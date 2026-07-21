---
description: "Documentation drift audit + sync plan — no rewrites until approved"
argument-hint: "[path or scope]"
---

# Docs Sync Plan

Run the **`plan-docs-sync`** skill: audit documentation against the actual code
for drift (stale READMEs, phantom docs, broken onboarding steps), then produce a
sync plan. **Audit and plan only — rewrite nothing until the plan is approved.**

Emit findings ranked by severity with concrete locations and a phased sync
checklist. After approval, execute with `docs-writer`.

The full playbook lives in the **`plan-docs-sync`** skill.
