#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# cursor-kenji installer
#
# Installs skills, commands, agents, rules, and MCP config.
#
# Why two skill paths?
#   ~/.cursor/skills/   — Cursor agent reads skills from here at runtime
#   ~/.agents/skills/   — Cursor Skills UI panel indexes from here
#   Both must be populated for skills to show up AND be used.
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CURSOR_DIR="$HOME/.cursor"
SKILLS_DIR="$CURSOR_DIR/skills"
AGENTS_SKILLS_DIR="$HOME/.agents/skills"
MCP_CONFIG="$CURSOR_DIR/mcp.json"

QUIET=false
[[ "${1:-}" == "--quiet" ]] && QUIET=true

log() { $QUIET || echo "$1"; }
warn() { echo "  [!] $1"; }
ok() { $QUIET || echo "  [+] $1"; }

log ""
log "======================================"
log "  cursor-kenji installer"
log "======================================"
log ""

# ---- Backup existing skills ----
if [ -d "$SKILLS_DIR" ] && [ ! -L "$SKILLS_DIR" ]; then
    BACKUP_DIR="$CURSOR_DIR/skills.backup.$(date +%Y%m%d_%H%M%S)"
    log "Backing up existing skills to $BACKUP_DIR"
    cp -r "$SKILLS_DIR" "$BACKUP_DIR"
    ok "Backup created"
fi

# ---- Install skills (skills/ + skills-cursor/ merged into ~/.cursor/skills/) ----
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

# ---- Sync to ~/.agents/skills/ (Cursor Skills UI reads from here) ----
mkdir -p "$AGENTS_SKILLS_DIR"
for skill_dir in "$SKILLS_DIR"/*/; do
    [ -d "$skill_dir" ] || continue
    skill_name=$(basename "$skill_dir")
    target="$AGENTS_SKILLS_DIR/$skill_name"
    rm -rf "$target"
    cp -r "$skill_dir" "$target"
done
ok "Synced $SKILL_COUNT skills to $AGENTS_SKILLS_DIR (Cursor UI)"

# ---- Install commands ----
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

# ---- Install agents ----
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

# ---- Install rules ----
RULES_DIR="$CURSOR_DIR/rules"
if [ -d "$SCRIPT_DIR/rules" ]; then
    mkdir -p "$RULES_DIR"
    for item in "$SCRIPT_DIR"/rules/*; do
        [ -e "$item" ] || continue
        name=$(basename "$item")
        rm -rf "$RULES_DIR/$name"
        cp -r "$item" "$RULES_DIR/$name"
    done
    RULE_COUNT=$(ls "$RULES_DIR" | wc -l | tr -d ' ')
    ok "Installed $RULE_COUNT rules to $RULES_DIR"
fi

# ---- Install MCP config (only if missing; never overwritten) ----
if [ ! -f "$MCP_CONFIG" ]; then
    if [ -f "$SCRIPT_DIR/mcp/mcp.json.template" ]; then
        cp "$SCRIPT_DIR/mcp/mcp.json.template" "$MCP_CONFIG"
        ok "Installed MCP config template to $MCP_CONFIG"
        warn "Edit $MCP_CONFIG to add your API keys"
    fi
else
    ok "MCP config already exists at $MCP_CONFIG (skipped)"
fi

# ---- Summary ----
log ""
log "======================================"
log "  Installation complete!"
log "======================================"
log ""
log "  Skills (runtime):  $SKILL_COUNT → $SKILLS_DIR"
log "  Skills (UI index): $SKILL_COUNT → $AGENTS_SKILLS_DIR"
log "  Commands:          ${COMMAND_COUNT:-0} → $COMMANDS_DIR"
log "  Subagents:         ${AGENT_COUNT:-0} → $AGENTS_DIR"
log "  Rules:             ${RULE_COUNT:-0} → $RULES_DIR"
log ""
log "  Next steps:"
log "  1. Fully quit and reopen Cursor (not just reload window)"
log "  2. Skills will appear in Cursor Settings > Skills"
log "  3. Edit ~/.cursor/mcp.json to add your API keys"
log "  4. Try: 'red team this app', 'audit my security', 'commit my changes'"
log ""
