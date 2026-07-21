---
description: "Secrets & key-scope audit (rotate vs relocate) — plan only, no rotation until approved"
argument-hint: "[path or scope]"
---

# Secrets Audit Plan

Run the **`plan-secrets-audit`** skill: scan the codebase and git history for
exposed secrets and over-scoped keys, then produce a rotate-vs-relocate plan.
**Audit and plan only — rotate or move nothing until the plan is approved.**

Emit findings ranked by severity with locations (never print secret values) and
a phased remediation checklist. After approval, execute rotation/relocation
with provider consoles and `backend-patterns`.

The full playbook lives in the **`plan-secrets-audit`** skill.
