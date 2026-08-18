---
description: "Audit the skill pack for contradictions, overlapping triggers, and stale cross-refs — report only, no rewrites until approved"
argument-hint: "[path or pack root]"
---

# Skill-Pack Conflict Audit

Run the **`audit-skill-conflicts`** skill: treat the installed skills,
commands, and always-on rules as one system. Find opposite directives,
ambiguous trigger descriptions, dangling handoffs, and greedy descriptions
that waste context.

**Read-only — rewrite no SKILL.md until the user approves the fix plan.**
Description rewrites first (routing). Per-file spec lint stays on
`validate:skills`. Authoring how-to stays on `meta-skill-creator`.

The full playbook lives in the **`audit-skill-conflicts`** skill.
