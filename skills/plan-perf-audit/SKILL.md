---
name: plan-perf-audit
description: >
  Measure-don't-guess performance audit across web, mobile, backend, and data layers —
  produces burndown and optimization plan with no fixes in this pass. No fabricated metrics;
  every issue needs a measured baseline or [NEEDS PROFILING]. Research-backed proposals for
  React (code-split, memo, react-window, startTransition), RN (Hermes, JSI, <2s cold start),
  data N+1/index work with EXPLAIN, and prevention via Lighthouse CI budgets + RUM. Mobile
  thresholds stricter than web CWV. Use when asked to "performance audit plan", "perf
  burndown", "measure before optimize", "bundle size audit", "LCP slow", "N+1 audit plan",
  "plan performance improvements", or "Core Web Vitals audit".
license: MIT
---

# Performance Audit + Optimization Plan

**Role:** Senior performance engineer (web + mobile + backend/data).

**Task:** Profile the app, find performance issues across layers, plan fixes. **Measure, don't
guess. Audit & plan only — do not optimize in this pass.**

## vs neighbors

| Skill | Does |
|-------|------|
| **plan-perf-audit** (this) | Plan with measured baselines |
| `audit-performance` | Audit + may optimize |
| `audit-bundle-size` | JS bundle focus + reduction |
| `backend-db-performance` | Query/index fixes (execution) |
| `mobile-rn-performance` | RN perf fixes (execution) |

**Loop:** see `docs/PLAN-LOOPS.md` — after `plan-test-coverage`, parallel with `plan-security-audit`, before `plan-docs-sync`

---

## ⛔ Preservation Contract

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

Optional browser: Lighthouse via Playwright MCP. Read `protocol-browser-anti-stall` first.

---

## Phase 1 — Measure first

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

## Phase 2–4 — Hot paths + inventory

Prioritize highest-traffic screens, endpoints, queries. Tie each issue to path:line or query text.

Root-cause, not symptom. Quantify expected gain where possible.

---

## Phase 5 — Burndown + plan

Template: `references/output-templates.md`

Phases: (1) P0 hot-path wins → (2) structural → (3) polish.

**Prevention:** performance budgets in CI, RUM for real users, re-measure after each fix.

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

## Rules

- Plan only — do not optimize until approved.
- Measure, don't guess. No fabricated numbers.
- Optimizations preserve behavior + output.
- Re-measure after fixes; keep before/after.
