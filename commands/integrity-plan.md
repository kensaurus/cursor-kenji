---
description: "Data-integrity & destructive-op audit — plan only, no migrations or tokens until approved"
argument-hint: "[path or scope]"
---

# Data Integrity Plan

Run the **`plan-data-integrity`** skill: audit for destructive-operation and
data-loss risk (unsafe migrations, missing backups, unguarded deletes), then
produce a safeguard plan. **Audit and plan only — run no migrations and add no
tokens until the plan is approved.**

Emit findings ranked by severity with locations and a phased safeguard
checklist. After approval, execute with `db-migrator` and `backend-patterns`.

The full playbook lives in the **`plan-data-integrity`** skill.
