---
description: "Audit a codemod or bulk mechanical transform for behavior-preservation — report only"
argument-hint: "[diff, PR, or transform description]"
---

# Codemod-Safety Audit

Run the **`audit-codemod-safety`** skill: characterize the transform, then
check whether it preserved behavior, caught every case, and left the repo
on one convention.

**Read-only — do not re-run the transform or edit the diffs.** "Compiles
and lints" is not "behaves the same." General PR quality stays on
`audit-code-review`. SQL / destructive migrations stay on
`plan-data-integrity`.

If a semantic bug slipped past CI because size defeated review, also note
it for `audit-gate-logic`.

The full playbook lives in the **`audit-codemod-safety`** skill.
