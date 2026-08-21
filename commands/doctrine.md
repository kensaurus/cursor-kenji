---
description: "Audit custom lint/ratchet doctrine for content correctness — report only"
argument-hint: "[repo or rule path]"
---

# /doctrine

> Is each custom rule *right on the merits*, not merely enforced?

This command is a thin entry point. The full playbook lives in the
**`audit-doctrine`** skill.

Use `/doctrine` when a lint/ratchet banned a legitimate pattern, or
when you want every axis judged against the governance contract
(remedy, named token, teaching failure, Tier-D practice, shrink-only
baseline). Enforcement / bypass stays on `/gate-logic`
(`audit-gate-logic`). Consolidation stays on `/housekeep-gates`.
