#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# cursor-kenji installer
#
# Installs skills, commands, agents, rules, and MCP config
# for Cursor and/or Claude Code.
#
# Usage:
#   ./install.sh              # Cursor + Claude Code (default)
#   ./install.sh --cursor     # Cursor only
#   ./install.sh --claude     # Claude Code only
#   ./install.sh --quiet      # suppress output
#
# Why two Cursor skill paths?
#   ~/.cursor/skills/   — Cursor agent reads skills from here at runtime
#   ~/.agents/skills/   — Cursor Skills UI panel indexes from here
#   Both must be populated for skills to show up AND be used.
#
# Claude Code skill path:
#   ~/.claude/skills/<name>/SKILL.md — global skills, appear as /slash-commands
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CURSOR_DIR="$HOME/.cursor"
SKILLS_DIR="$CURSOR_DIR/skills"
AGENTS_SKILLS_DIR="$HOME/.agents/skills"
MCP_CONFIG="$CURSOR_DIR/mcp.json"
CLAUDE_DIR="$HOME/.claude"
CLAUDE_SKILLS_DIR="$CLAUDE_DIR/skills"
CLAUDE_AGENTS_DIR="$CLAUDE_DIR/agents"
CLAUDE_RULES_DIR="$CLAUDE_DIR/rules"

INSTALL_CURSOR=true
INSTALL_CLAUDE=true
QUIET=false

for arg in "${@}"; do
  case "$arg" in
    --cursor) INSTALL_CLAUDE=false ;;
    --claude) INSTALL_CURSOR=false ;;
    --quiet)  QUIET=true ;;
  esac
done

log() { $QUIET || echo "$1"; }
warn() { echo "  [!] $1"; }
ok() { $QUIET || echo "  [+] $1"; }

log ""
log "======================================"
log "  cursor-kenji installer"
if $INSTALL_CURSOR && $INSTALL_CLAUDE; then
  log "  targets: Cursor + Claude Code"
elif $INSTALL_CURSOR; then
  log "  target: Cursor"
else
  log "  target: Claude Code"
fi
log "======================================"
log ""

# ---- Cursor: backup existing skills ----
if $INSTALL_CURSOR; then

if [ -d "$SKILLS_DIR" ] && [ ! -L "$SKILLS_DIR" ]; then
    BACKUP_DIR="$CURSOR_DIR/skills.backup.$(date +%Y%m%d_%H%M%S)"
    log "Backing up existing skills to $BACKUP_DIR"
    cp -r "$SKILLS_DIR" "$BACKUP_DIR"
    ok "Backup created"
fi

# ---- Cursor: skills (skills/ + skills-cursor/ merged into ~/.cursor/skills/) ----
mkdir -p "$SKILLS_DIR"
SKILL_COUNT=0
for skill_dir in "$SCRIPT_DIR"/skills/*/; do
    skill_name=$(basename "$skill_dir")
    target="$SKILLS_DIR/$skill_name"
    rm -rf "$target"
    cp -r "$skill_dir" "$target"
    SKILL_COUNT=$((SKILL_COUNT + 1))
done

# Merge cursor-specific skills into the same skills dir (not a separate dir)
for skill_dir in "$SCRIPT_DIR"/skills-cursor/*/; do
    [ -d "$skill_dir" ] || continue
    skill_name=$(basename "$skill_dir")
    target="$SKILLS_DIR/$skill_name"
    rm -rf "$target"
    cp -r "$skill_dir" "$target"
    SKILL_COUNT=$((SKILL_COUNT + 1))
done
ok "Installed $SKILL_COUNT skills to $SKILLS_DIR"

ok "Installed $SKILL_COUNT skills to $SKILLS_DIR"

THIRDPARTY_COUNT=0
for skill_dir in "$SCRIPT_DIR"/skills/thirdparty-*/; do
    [ -d "$skill_dir" ] || continue
    THIRDPARTY_COUNT=$((THIRDPARTY_COUNT + 1))
done
if [ "$THIRDPARTY_COUNT" -gt 0 ]; then
    ok "Third-party skills: $THIRDPARTY_COUNT (prefixed thirdparty-*)"
fi

# ---- Cursor: sync to ~/.agents/skills/ (Cursor Skills UI reads from here) ----
mkdir -p "$AGENTS_SKILLS_DIR"
for skill_dir in "$SKILLS_DIR"/*/; do
    [ -d "$skill_dir" ] || continue
    skill_name=$(basename "$skill_dir")
    target="$AGENTS_SKILLS_DIR/$skill_name"
    rm -rf "$target"
    cp -r "$skill_dir" "$target"
done
ok "Synced $SKILL_COUNT skills to $AGENTS_SKILLS_DIR (Cursor UI)"

# ---- Cursor: commands ----
COMMANDS_DIR="$CURSOR_DIR/commands"
if [ -d "$SCRIPT_DIR/commands" ]; then
    mkdir -p "$COMMANDS_DIR"
    COMMAND_COUNT=0
    for item in "$SCRIPT_DIR"/commands/*.md "$SCRIPT_DIR"/commands/*/; do
        [ -e "$item" ] || continue
        name=$(basename "$item")
        target="$COMMANDS_DIR/$name"
        rm -rf "$target"
        cp -r "$item" "$target"
        COMMAND_COUNT=$((COMMAND_COUNT + 1))
    done
    ok "Installed $COMMAND_COUNT commands to $COMMANDS_DIR"
fi

# ---- Cursor: agents ----
AGENTS_DIR="$CURSOR_DIR/agents"
if [ -d "$SCRIPT_DIR/agents" ]; then
    mkdir -p "$AGENTS_DIR"
    AGENT_COUNT=0
    for agent_file in "$SCRIPT_DIR"/agents/*.md; do
        [ -f "$agent_file" ] || continue
        agent_name=$(basename "$agent_file")
        cp "$agent_file" "$AGENTS_DIR/$agent_name"
        AGENT_COUNT=$((AGENT_COUNT + 1))
    done
    ok "Installed $AGENT_COUNT subagents to $AGENTS_DIR"
fi

# ---- Cursor: rules ----
CURSOR_RULES_DIR="$CURSOR_DIR/rules"
if [ -d "$SCRIPT_DIR/rules" ]; then
    mkdir -p "$CURSOR_RULES_DIR"
    for item in "$SCRIPT_DIR"/rules/*; do
        [ -e "$item" ] || continue
        name=$(basename "$item")
        rm -rf "$CURSOR_RULES_DIR/$name"
        cp -r "$item" "$CURSOR_RULES_DIR/$name"
    done
    RULE_COUNT=$(ls "$CURSOR_RULES_DIR" | wc -l | tr -d ' ')
    ok "Installed $RULE_COUNT rules to $CURSOR_RULES_DIR"
fi

# ---- Cursor: MCP config (only if missing; never overwritten) ----
if [ ! -f "$MCP_CONFIG" ]; then
    if [ -f "$SCRIPT_DIR/mcp/mcp.json.template" ]; then
        cp "$SCRIPT_DIR/mcp/mcp.json.template" "$MCP_CONFIG"
        ok "Installed MCP config template to $MCP_CONFIG"
        warn "Edit $MCP_CONFIG to add your API keys"
    fi
else
    ok "MCP config already exists at $MCP_CONFIG (skipped)"
fi

fi  # end $INSTALL_CURSOR

# ============================================================
# Claude Code install
# ============================================================
if $INSTALL_CLAUDE; then

log ""
log "--- Claude Code ---"

# ---- Claude Code: skills (skills/ + skills-cursor/ → ~/.claude/skills/) ----
mkdir -p "$CLAUDE_SKILLS_DIR"
CLAUDE_SKILL_COUNT=0
for skill_dir in "$SCRIPT_DIR"/skills/*/; do
    skill_name=$(basename "$skill_dir")
    target="$CLAUDE_SKILLS_DIR/$skill_name"
    rm -rf "$target"
    cp -r "$skill_dir" "$target"
    CLAUDE_SKILL_COUNT=$((CLAUDE_SKILL_COUNT + 1))
done
for skill_dir in "$SCRIPT_DIR"/skills-cursor/*/; do
    [ -d "$skill_dir" ] || continue
    skill_name=$(basename "$skill_dir")
    target="$CLAUDE_SKILLS_DIR/$skill_name"
    rm -rf "$target"
    cp -r "$skill_dir" "$target"
    CLAUDE_SKILL_COUNT=$((CLAUDE_SKILL_COUNT + 1))
done
ok "Installed $CLAUDE_SKILL_COUNT skills to $CLAUDE_SKILLS_DIR"

# ---- Claude Code: agents ----
if [ -d "$SCRIPT_DIR/agents" ]; then
    mkdir -p "$CLAUDE_AGENTS_DIR"
    CLAUDE_AGENT_COUNT=0
    for agent_file in "$SCRIPT_DIR"/agents/*.md; do
        [ -f "$agent_file" ] || continue
        cp "$agent_file" "$CLAUDE_AGENTS_DIR/$(basename "$agent_file")"
        CLAUDE_AGENT_COUNT=$((CLAUDE_AGENT_COUNT + 1))
    done
    ok "Installed $CLAUDE_AGENT_COUNT subagents to $CLAUDE_AGENTS_DIR"
fi

# ---- Claude Code: rules (.mdc → .md, Cursor-specific frontmatter is harmless) ----
if [ -d "$SCRIPT_DIR/rules" ]; then
    mkdir -p "$CLAUDE_RULES_DIR"
    CLAUDE_RULE_COUNT=0
    for item in "$SCRIPT_DIR"/rules/*.md "$SCRIPT_DIR"/rules/*.mdc; do
        [ -f "$item" ] || continue
        # Normalise extension: strip .mdc and re-add .md
        base=$(basename "$item")
        name="${base%.mdc}"       # strip .mdc if present
        name="${name%.md}.md"     # ensure .md extension
        cp "$item" "$CLAUDE_RULES_DIR/$name"
        CLAUDE_RULE_COUNT=$((CLAUDE_RULE_COUNT + 1))
    done
    ok "Installed $CLAUDE_RULE_COUNT rules to $CLAUDE_RULES_DIR"
fi

fi  # end $INSTALL_CLAUDE

# ---- Summary ----
log ""
log "======================================"
log "  Installation complete!"
log "======================================"
log ""
if $INSTALL_CURSOR; then
log "  Cursor"
log "  Skills (runtime):  $SKILL_COUNT → $SKILLS_DIR"
log "  Skills (UI index): $SKILL_COUNT → $AGENTS_SKILLS_DIR"
log "  Commands:          ${COMMAND_COUNT:-0} → $COMMANDS_DIR"
log "  Subagents:         ${AGENT_COUNT:-0} → $AGENTS_DIR"
log "  Rules:             ${RULE_COUNT:-0} → $CURSOR_RULES_DIR"
log ""
log "  Next steps (Cursor):"
log "  1. Fully quit and reopen Cursor (not just reload window)"
log "  2. Skills appear in Cursor Settings > Skills"
log "  3. Edit ~/.cursor/mcp.json to add your API keys"
log "  4. Try: 'red team this app', 'audit my security', 'commit my changes'"
log ""
fi
if $INSTALL_CLAUDE; then
log "  Claude Code"
log "  Skills:    ${CLAUDE_SKILL_COUNT:-0} → $CLAUDE_SKILLS_DIR"
log "  Subagents: ${CLAUDE_AGENT_COUNT:-0} → $CLAUDE_AGENTS_DIR"
log "  Rules:     ${CLAUDE_RULE_COUNT:-0} → $CLAUDE_RULES_DIR"
log ""
log "  Next steps (Claude Code):"
log "  1. Restart any active 'claude' sessions to pick up new skills"
log "  2. Skills appear as /slash-commands (type / to see all)"
log "  3. Try: /workflow-build-feature  /debug-error  /plan-security-audit"
log ""
fi
