---
description: "Dead-code audit — configured Knip baseline plus ratchet plan, delete nothing until approved"
argument-hint: "[path or workspace]"
---

# Dead Code Plan

Run the **`plan-dead-code`** skill: author `knip.json` before trusting any
output, resolve every configuration hint, baseline both `--production` and
default runs, then count the surfaces Knip cannot see — unused locals,
duplication, debug residue, suppression debt, orphan assets, env drift,
dead schema. **Audit and plan only — delete no file, export, dependency,
asset, or row until the plan is approved.**

On a first run most findings are misconfiguration, not dead code. Report
the before/after finding counts so the difference is visible, and mark
anything reached dynamically, generated, or deliberately public as
`keep-*` rather than guessing `kill`.

Emit `plan-dead-code.md`: baseline table, keep/kill list with evidence and
risk, phased burndown, and the `--max-issues` ratchet proposal. After
approval, execute with `housekeep-dead-code`.

The full playbook lives in the **`plan-dead-code`** skill.
