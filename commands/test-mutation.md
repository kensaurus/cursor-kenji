---
description: "Set up mutation testing to prove tests assert behavior, not just coverage"
argument-hint: "[paths to mutate]"
---

# Mutation Testing

Run the **`test-mutation`** skill: install StrykerJS or mutmut, scope to
critical paths (never whole-repo first), triage survivors, and wire an
incremental per-PR job plus a score ratchet.

Coverage plan stays on `plan-test-coverage`. Writing tests stays on
`test-unit`. "Compiles and covers" is not "would notice a bug."

The full playbook lives in the **`test-mutation`** skill.
