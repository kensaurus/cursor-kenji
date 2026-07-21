---
description: "Full UI/UX + design-system unification plan — audit only, no fixes until approved"
argument-hint: "[path or scope]"
---

# UI/UX Unification Plan

Run the **`plan-uiux-unification`** skill: exhaustively audit UI/UX and
design-system consistency and produce a phased unification plan. **Audit and
plan only — change no code until the plan is reviewed and approved.**

Emit the plan ranked by severity with concrete `file:line` findings and a
phase-by-phase remediation checklist. After approval, execute with
`enhance-web-ui`, `enhance-web-ux`, and `audit-uiux-design-system`.

The full playbook lives in the **`plan-uiux-unification`** skill.
