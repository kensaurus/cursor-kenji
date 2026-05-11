# /debug

> Hypothesis-driven debugging with runtime evidence — not guessing.

This command is a thin entry point. The full playbook lives in the **`debug-error`** skill at `~/.cursor/skills/debug-error/SKILL.md`, which integrates Sentry MCP for production context, Firecrawl for fix-pattern research, and Sequential Thinking for multi-step diagnosis.

Use `/debug` to explicitly enter debug mode. Otherwise, say "debug this", "investigate the bug", or "why isn't this working" and the skill auto-fires.

Related: `debug-fe-be-integration` for API/contract bugs, `debug-sentry-monitor` for production triage.
