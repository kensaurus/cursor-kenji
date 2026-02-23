---
name: hooks-builder
description: Create and configure Cursor Agent Hooks to automate, observe, and control the agent loop. Use when setting up auto-formatters, security gates, audit logging, PII scanning, dependency guards, agent loop automation, or when user mentions "hooks", "hooks.json", "after file edit", "before shell", "stop hook", "agent loop", "automate cursor", or "observe agent".
---

# Cursor Hooks Builder

## What Are Hooks?
Hooks are scripts that run at defined points in the Cursor agent loop. They receive JSON via stdin, return JSON via stdout, and can **observe**, **block**, or **modify** agent behaviour.

## Hook Events Reference

### Agent Hooks
| Event | When | Can Block? |
|-------|------|------------|
| `sessionStart` | New conversation created | Yes |
| `sessionEnd` | Conversation ends | No (fire-and-forget) |
| `preToolUse` | Before any tool | Yes |
| `postToolUse` | After tool succeeds | No |
| `postToolUseFailure` | When tool fails | No |
| `beforeShellExecution` | Before terminal command | Yes |
| `afterShellExecution` | After terminal command | No |
| `beforeMCPExecution` | Before MCP tool (fail-closed) | Yes |
| `afterMCPExecution` | After MCP tool | No |
| `beforeReadFile` | Before agent reads file (fail-closed) | Yes |
| `afterFileEdit` | After agent edits file | No |
| `beforeSubmitPrompt` | Before user prompt sent | Yes |
| `subagentStart` | Before subagent spawns | Yes |
| `subagentStop` | After subagent completes | No (can trigger followup) |
| `preCompact` | Before context compaction | No |
| `stop` | Agent loop ends | No (can trigger followup) |
| `afterAgentResponse` | After assistant message | No |
| `afterAgentThought` | After thinking block | No |

### Tab Hooks
| Event | When |
|-------|------|
| `beforeTabFileRead` | Before Tab reads file |
| `afterTabFileEdit` | After Tab edits file |

## Setup

### 1. Create hooks.json
**Global** (`~/.cursor/hooks.json`) — applies to all projects:
```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [{ "command": "./hooks/format.sh" }]
  }
}
```

**Project** (`.cursor/hooks.json`) — checked into git, applies to this project:
```json
{
  "version": 1,
  "hooks": {
    "beforeShellExecution": [{ "command": ".cursor/hooks/guard.sh" }]
  }
}
```

### 2. Create Hook Script
Path rules:
- **Global hooks**: paths relative to `~/.cursor/`
- **Project hooks**: paths relative to project root

```bash
#!/bin/bash
# Read input JSON from stdin
input=$(cat)
# Always exit 0 to allow; exit 2 to block
echo '{}'
exit 0
```

Make executable: `chmod +x script.sh`

## Common Patterns

### Auto-format on edit
```json
{ "afterFileEdit": [{ "command": ".cursor/hooks/format.sh" }] }
```
```bash
#!/bin/bash
file_path=$(echo "$1" | python3 -c "import sys,json; print(json.load(sys.stdin)['file_path'])" 2>/dev/null || cat | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('file_path',''))")
if [[ "$file_path" == *.ts ]] || [[ "$file_path" == *.tsx ]]; then
  npx prettier --write "$file_path" 2>/dev/null
fi
echo '{}'
exit 0
```

### Block dangerous shell commands
```json
{ "beforeShellExecution": [{ "command": ".cursor/hooks/guard.sh", "matcher": "rm -rf|DROP TABLE|kubectl delete" }] }
```
```bash
#!/bin/bash
# Exit 2 to block
echo '{"permission": "deny", "user_message": "Blocked dangerous command", "agent_message": "This command requires manual confirmation."}'
exit 2
```

### Scan for secrets before file read
```json
{ "beforeReadFile": [{ "command": ".cursor/hooks/secret-guard.sh" }] }
```
```bash
#!/bin/bash
input=$(cat)
file_path=$(echo "$input" | python3 -c "import sys,json; print(json.load(sys.stdin)['file_path'])")
if [[ "$file_path" == *".env"* ]] || [[ "$file_path" == *"secrets"* ]]; then
  echo '{"permission": "deny", "user_message": "Blocked: sensitive file"}'
  exit 0
fi
echo '{"permission": "allow"}'
exit 0
```

### Agent loop automation (stop hook)
Keep agent running until goal met:
```json
{ "stop": [{ "command": "bun run .cursor/hooks/grind.ts", "loop_limit": 5 }] }
```
```typescript
// .cursor/hooks/grind.ts
const input = await Bun.stdin.json();
if (input.status !== 'completed' || input.loop_count >= 5) {
  console.log(JSON.stringify({}));
  process.exit(0);
}
// Check if goal is met (e.g. read a scratchpad file)
const done = /* your check here */ false;
if (done) {
  console.log(JSON.stringify({}));
} else {
  console.log(JSON.stringify({
    followup_message: `[Iteration ${input.loop_count + 1}/5] Continue. Mark DONE in .cursor/scratchpad.md when complete.`
  }));
}
```

### Prompt-based hook (no script needed)
```json
{
  "beforeShellExecution": [{
    "type": "prompt",
    "prompt": "Does this command look safe? Only allow read-only operations.",
    "timeout": 10
  }]
}
```

## Hook Output Schema

### Blocking hooks (beforeShellExecution, beforeReadFile, preToolUse)
```json
{
  "permission": "allow" | "deny" | "ask",
  "user_message": "Shown to user",
  "agent_message": "Sent to agent"
}
```

### sessionStart
```json
{
  "env": { "MY_VAR": "value" },
  "additional_context": "Extra context injected into conversation",
  "continue": true
}
```

### stop / subagentStop (loop trigger)
```json
{ "followup_message": "Continue working on X until Y is true." }
```

## Matchers
Filter which calls trigger the hook:
```json
{
  "beforeShellExecution": [{
    "command": "./guard.sh",
    "matcher": "curl|wget|nc"
  }],
  "preToolUse": [{
    "command": "./validate.sh",
    "matcher": "Shell|Write|Delete"
  }]
}
```

## Environment Variables Available in Scripts
| Variable | Description |
|----------|-------------|
| `CURSOR_PROJECT_DIR` | Workspace root |
| `CURSOR_VERSION` | Cursor version |
| `CURSOR_USER_EMAIL` | Logged-in user email |

## Debugging
- Hooks tab in Cursor Settings → see configured and executed hooks
- Hooks output channel → see errors
- Restart Cursor after changing `hooks.json`
