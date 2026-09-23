---
description: "Hypothesis-driven debugging with runtime evidence before a fix — not guessing"
argument-hint: "[error or symptom]"
disable-model-invocation: true
---

# /debug-issue

> Hypothesis-driven debugging with runtime evidence — not guessing.

This command is a thin entry point. The full playbook lives in the **`debug-error`** skill: a hypothesis, a failing check, then a fix. When the error is from production and Sentry is connected, fetch that context first. When the fix pattern is unfamiliar, use Firecrawl or Context7.

> **Named `/debug-issue` (not `/debug`).** Claude Code's bundled `/debug` and the Cursor CLI `/debug` both toggle debug logging or Debug mode. This command is the debugging procedure.

Use `/debug-issue` to explicitly enter debug mode. Otherwise, say "debug this", "investigate the bug", or "why isn't this working" and the skill auto-fires.

Related: `debug-fe-be-integration` for API/contract bugs, `debug-sentry-monitor` for production triage.
