---
description: "Measure-don't-guess performance audit + optimization plan — no fixes until approved"
argument-hint: "[url or scope]"
---

# Performance Audit Plan

Run the **`plan-perf-audit`** skill: measure performance (Core Web Vitals,
bundle, queries) and produce an optimization plan grounded in measurements, not
guesses. **Audit and plan only — optimize nothing until the plan is approved.**

Emit findings ranked by measured impact with locations and a phased checklist.
After approval, execute with `audit-performance`, `backend-db-performance`, and
`workflow-refactor`.

The full playbook lives in the **`plan-perf-audit`** skill.
