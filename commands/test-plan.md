---
description: "User-story-driven test coverage audit + plan — no tests written until approved"
argument-hint: "[path or scope]"
---

# Test Coverage Plan

Run the **`plan-test-coverage`** skill: build a user-story traceability matrix,
find untested paths and fake-green tests, then produce a coverage plan. **Audit
and plan only — write no tests until the plan is approved.**

Emit gaps ranked by risk with a phased coverage checklist. After approval,
execute with `test-unit`, `workflow-spec-tdd`, and `test-playwright`.

The full playbook lives in the **`plan-test-coverage`** skill.
