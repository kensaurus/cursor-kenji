---
description: "AI slop / authenticity / voice audit + de-slop burndown — plan only, no rewrites until approved"
argument-hint: "[path or scope]"
---

# Anti-Slop Plan

Run the **`plan-antislop`** skill: audit the codebase, UI, and copy for
machine-generated slop, authenticity, and voice, then produce a de-slop
burndown. **Audit and plan only — rewrite nothing until the plan is approved.**

Emit findings ranked by severity with concrete `file:line` locations and a
phased de-slop checklist. After approval, execute with `docs-writer`,
`audit-i18n`, `enhance-web-ui`, and `enhance-web-ux`.

The full playbook lives in the **`plan-antislop`** skill.
