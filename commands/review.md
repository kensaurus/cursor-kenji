# /review

> Agent review pass plus manual checklist for correctness, security, performance, and accessibility.

This command is a thin entry point. The full playbook lives in the **`audit-code-review`** skill at `~/.cursor/skills/audit-code-review/SKILL.md`, which integrates Firecrawl for current best-practice verification and Sentry MCP to check whether the change relates to production errors.

Use `/review` when you want to explicitly trigger review. Otherwise, say "review this code", "check my PR", "find issues", or "is this safe" and the skill auto-fires.

Related: `audit-security` for OWASP-focused review, `audit-performance` for Core Web Vitals impact, `workflow-coding-discipline` for behavioral guardrails.
