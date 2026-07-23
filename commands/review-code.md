---
description: "Agent review pass plus manual checklist for correctness, security, performance, and accessibility"
argument-hint: "[path or PR]"
---

# /review-code

> Agent review pass plus manual checklist for correctness, security, performance, and accessibility.

This command is a thin entry point. The full playbook lives in the **`audit-code-review`** skill, which integrates Firecrawl for current best-practice verification and Sentry MCP to check whether the change relates to production errors.

> **Named `/review-code` (not `/review`)** to avoid colliding with Claude Code's built-in `/review` command.

Use `/review-code` when you want to explicitly trigger review. Otherwise, say "review this code", "check my PR", "find issues", or "is this safe" and the skill auto-fires.

Related: `audit-security` for OWASP-focused review, `audit-performance` for Core Web Vitals impact, `workflow-coding-discipline` for behavioral guardrails.
