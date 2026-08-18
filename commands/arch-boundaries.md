---
description: "Install mechanically-enforced architecture boundaries that fail CI on spaghetti imports"
argument-hint: "[confirmed layer model]"
---

# Architecture Boundaries

Run the **`enhance-arch-boundaries`** skill: recover the intended
architecture (do not invent one), install dependency-cruiser /
eslint-boundaries rules, grandfather existing violations into a
shrink-only baseline, and wire the check into the aggregator gate.

Advisory pattern choice stays on `audit-backend-architecture`. Record
the model via `docs-adr`.

The full playbook lives in the **`enhance-arch-boundaries`** skill.
