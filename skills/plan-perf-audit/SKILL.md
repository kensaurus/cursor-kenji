---
name: plan-perf-audit
description: >
  Plan-only performance audit across web/mobile/backend/data; measures
  first and emits a burndown, no fixes. Use when "performance audit
  plan", "perf burndown", "measure before optimize", or "N+1 audit
  plan". Apply runtime fixes → audit-performance. JS bundle-only →
  audit-bundle-size.
license: MIT
---

# Performance Audit + Optimization Plan

**Degree of freedom: HIGH** — measure, interpret, plan. Stay
**plan-only**. Do not optimize in this pass.

**Role:** Senior performance engineer (web + mobile + backend/data).

**Task:** Profile the app, find performance issues across layers, plan fixes. **Measure, don't
guess. Audit & plan only — do not optimize in this pass.**

## This skill vs neighbors

| Skill | Does |
|-------|------|
| **plan-perf-audit** (this) | Plan with measured baselines |
| `audit-performance` | Audit + may optimize |
| `audit-bundle-size` | JS bundle focus + reduction |
| `backend-db-performance` | Query/index fixes (execution) |
| `mobile-rn-performance` | RN perf fixes (execution) |

**Loop:** see `docs/PLAN-LOOPS.md` — after `plan-test-coverage`, parallel with `plan-security-audit`, before `plan-docs-sync`

## How to reason (every plan item)

1. **Propose** — an optimization tied to a measured baseline
2. **Risk** — user-visible stall, cost, or timeout if left as-is
3. **Keep-working** — paths already inside budget
4. **Phase** — P0 hot-path → structural → polish (do not execute)

## Worked example

> **Propose:** split the 412 KB hero chart chunk; add an index on `orders(user_id, created_at)` after EXPLAIN.
> **Risk:** `/dashboard` LCP 4.8s (Lighthouse); orders list is a 1.2s sequential N+1.
> **Keep-working:** `/pricing` already LCP <2s; user lookup is indexed.
> **Phase:** Phase 1 — P0 hot-path wins. No fabricated numbers.

---

## ⛔ Preservation Contract  [LOW freedom — run exactly]

Read `references/preservation-contract.md`. Acknowledge in output #1.

**Hardest guardrail:** no fix proposed without a measured baseline (or explicit `[NEEDS PROFILING]`).

---

## References

| File | Contents |
|------|----------|
| `references/audit-scope.md` | Layers, methodology, measurement, research fixes |
| `references/output-templates.md` | Baselines, burndown, phased plan |

---

## Phase flow

```
1. Fingerprint stack (web/RN/API/Supabase)
2. Measure baselines per layer (no guessing)
3. Trace hot paths
4. Per-layer issue inventory
5. Burndown + phased optimization plan
6. Guardrails (budgets, Lighthouse CI, RUM)
7. Research citations
```

Optional browser: Lighthouse via playwright-cli. Read `protocol-browser-anti-stall` first.

---

## Phase 1 — Measure first  [HIGH freedom]

Establish baselines before any fix proposal:

| Layer | Tools |
|-------|-------|
| Web CWV | Lighthouse, `web-vitals`, RUM/Sentry |
| Bundle | `rollup-plugin-visualizer`, `@next/bundle-analyzer` |
| RN | Metro bundle report, cold start profiler |
| API | Sentry transactions, server logs |
| DB | Supabase advisors, `EXPLAIN ANALYZE`, slow query logs |

Scope detail: `references/audit-scope.md`

---

## Phase 2–4 — Hot paths + inventory  [HIGH freedom]

Prioritize highest-traffic screens, endpoints, queries. Tie each issue to path:line or query text.

Root-cause, not symptom. Quantify expected gain where possible.

---

## Phase 5 — Burndown + plan  [HIGH freedom — plan only]

Template: `references/output-templates.md`

Phases: (1) P0 hot-path wins → (2) structural → (3) polish.

**Prevention:** performance budgets in CI, RUM for real users, re-measure after each fix.

## Self-critique before the burndown  [LOW freedom — do not skip]

1. **evidenced-not-assumed** — every fix proposal has a measured baseline or `[NEEDS PROFILING]`
2. **plan-only** — do not optimize this pass
3. **phase justified** — P0 hot-path before polish; no fabricated numbers
4. **right-owner** — bundle-only trim → `audit-bundle-size`; apply-now optimize → `audit-performance`
5. **no-false-safety** — symptom without root-cause is not a plan item

---

## Required output (in order)

1. Preservation-contract acknowledgment
2. Measured baselines per layer
3. Per-layer issue inventory
4. Burndown table (measured current + target + risk)
5. Optimization + enhancement plan, phased
6. Guardrails/tooling
7. Research notes + citations
8. Open questions / `[NEEDS PROFILING]` list

---

## Rules  [LOW freedom — run exactly]

- Plan only — do not optimize until approved.
- Measure, don't guess. No fabricated numbers.
- Optimizations preserve behavior + output.
- Re-measure after fixes; keep before/after.
