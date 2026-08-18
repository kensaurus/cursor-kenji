---
description: "Consolidate accreted CI gates into one aggregator required check — apply phase by phase"
argument-hint: "[archaeology map or workflow path]"
---

# Housekeep Gates

Run the **`housekeep-gates`** skill: consume the `audit-gate-logic`
archaeology map, build one aggregator job that `needs:` every real check
and fails on failed **or skipped** dependencies, port unique value from
losers, then **delete** (do not disable) the rest.

**Net enforcement strictly ≥ before.** Branch-protection changes always
get explicit confirmation. Pipeline cost stays on `audit-cicd`. Installing
brand-new guard classes stays on `enhance-agent-guardrails`.

The full playbook lives in the **`housekeep-gates`** skill.
