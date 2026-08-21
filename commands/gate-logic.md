---
description: "Audit CI/CD gate logic — silent bypass, ratchet gaming, conflicting conditions — report only"
argument-hint: "[repo or workflow path]"
---

# Gate-Logic Audit

Run the **`audit-gate-logic`** skill: inventory every gate and test whether
it can be silently bypassed, whether a ratchet can lock in regressions,
whether two workflows' conditions both fire or both skip, and map
accreted duplicate gates (Phase 2.5 archaeology).

**Read-only — rewrite no workflow or branch-protection setting.**
Consolidation of the archaeology map stays on `housekeep-gates`. Pipeline
cost/speed stays on `audit-cicd`. Whether the *rule is right* (not merely
enforced) stays on `/doctrine` (`audit-doctrine`). Running the pre-release
sweep stays on `workflow-quality-gate`. Installing new gates stays on
`enhance-agent-guardrails`.

Highest-value "is it actually required" checks need branch-protection /
rulesets via the repo settings API. If those are invisible, say so and
audit the YAML alone.

The full playbook lives in the **`audit-gate-logic`** skill.
