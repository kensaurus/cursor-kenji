#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# cursor_kenji installer
# Installs skills, commands, and MCP config to ~/.cursor/
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CURSOR_DIR="$HOME/.cursor"
SKILLS_DIR="$CURSOR_DIR/skills"
SKILLS_CURSOR_DIR="$CURSOR_DIR/skills-cursor"
MCP_CONFIG="$CURSOR_DIR/mcp.json"

QUIET=false
[[ "${1:-}" == "--quiet" ]] && QUIET=true

log() { $QUIET || echo "$1"; }
warn() { echo "  [!] $1"; }
ok() { $QUIET || echo "  [+] $1"; }

log ""
log "======================================"
log "  cursor_kenji installer"
log "======================================"
log ""

# ---- Backup existing skills ----
if [ -d "$SKILLS_DIR" ] && [ ! -L "$SKILLS_DIR" ]; then
    BACKUP_DIR="$CURSOR_DIR/skills.backup.$(date +%Y%m%d_%H%M%S)"
    log "Backing up existing skills to $BACKUP_DIR"
    cp -r "$SKILLS_DIR" "$BACKUP_DIR"
    ok "Backup created"
fi

# ---- Install skills ----
mkdir -p "$SKILLS_DIR"
SKILL_COUNT=0
for skill_dir in "$SCRIPT_DIR"/skills/*/; do
    skill_name=$(basename "$skill_dir")
    target="$SKILLS_DIR/$skill_name"
    
    # Copy skill directory (overwrite if exists)
    rm -rf "$target"
    cp -r "$skill_dir" "$target"
    SKILL_COUNT=$((SKILL_COUNT + 1))
done
ok "Installed $SKILL_COUNT skills to $SKILLS_DIR"

# ---- Install cursor-specific skills ----
mkdir -p "$SKILLS_CURSOR_DIR"
CURSOR_SKILL_COUNT=0
for skill_dir in "$SCRIPT_DIR"/skills-cursor/*/; do
    skill_name=$(basename "$skill_dir")
    target="$SKILLS_CURSOR_DIR/$skill_name"
    
    rm -rf "$target"
    cp -r "$skill_dir" "$target"
    CURSOR_SKILL_COUNT=$((CURSOR_SKILL_COUNT + 1))
done
ok "Installed $CURSOR_SKILL_COUNT cursor-specific skills to $SKILLS_CURSOR_DIR"

# ---- Install MCP config ----
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
log "  Skills:         $SKILL_COUNT installed"
log "  Cursor Skills:  $CURSOR_SKILL_COUNT installed"
log "  Location:       $SKILLS_DIR"
log ""
log "  Next steps:"
log "  1. Restart Cursor to pick up new skills"
log "  2. Edit ~/.cursor/mcp.json with your API keys"
log "  3. Try: /commit, /test, /research in Cursor"
log ""
