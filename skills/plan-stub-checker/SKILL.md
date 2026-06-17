---
name: plan-stub-checker
description: >
  Exhaustive audit for stubs, dead buttons, fake/placeholder components, unwired handlers,
  dead links, orphans, and severed integrations — produces a burndown and wiring plan with
  no implementation in this pass. Traces intended backend, Supabase, Sentry, and data-pipeline
  targets; conservative false-positive filtering. Plan only — user approves before wiring.
  Uses codebase static analysis + optional Playwright/Sentry/Supabase MCP. Use when asked to
  "find dead buttons", "stub checker", "fake components", "unwired handlers", "dead links",
  "orphaned components", "plan stub wiring", "what's not connected", "mock data in prod",
  "buttons that do nothing", or "stub audit".
license: MIT
---

# Stub, Dead-Link & Fake-Component Checker + Wiring Plan

**Role:** Senior full-stack engineer + reliability auditor.

**Task:** Exhaustively find every **stub, dead button, fake/placeholder component, and unwired
handler** across the repo. Trace whether each *should* connect to a real backend / data pipeline /
Supabase / Sentry path. Produce a burndown + wiring plan. **Audit & plan only — do not implement.**

## This skill vs neighbors

| Skill | Does |
|-------|------|
| **plan-stub-checker** (this) | Plan only — inventory, burndown, wiring roadmap |
| `debug-fe-be-integration` | Diagnose and fix FE-BE mismatches |
| `audit-fe-api` | Audit API calls vs backend contracts |
| `test-qa` | Live QA — may find dead buttons during crawl |
| `debug-sentry-monitor` | Triage production Sentry errors |
| `workflow-fix-and-ship` | Fix → verify → PR after you approve |

**Chain:** `plan-stub-checker` → user approval → `debug-fe-be-integration` / `workflow-fix-and-ship` → `test-playwright`

---

## ⛔ Preservation Contract

Read `references/preservation-contract.md` before Phase 1.

**Acknowledge in output #1** — restate what you will NOT do:

- No removal of features/routes/screens/handlers/props
- No fabricated endpoints, tables, env keys, or DSNs
- Every claim cites file path + line
- Preserve I/O boundaries unless wiring is proposed + approved
- No silent breaking changes
- **Plan, don't build**

---

## References

| File | Contents |
|------|----------|
| `references/detection-taxonomy.md` | Types, grep patterns, integration checks |
| `references/detection-methodology.md` | Six-pass methodology + linkage tracing |
| `references/output-templates.md` | Burndown, inventory, phased plan templates |

---

## Phase flow

```
1. Auto-detect stack (routes, data layer, integrations)
2. Entry-point + static analysis sweep
3. Handler-binding + data-flow trace
4. False-positive filter (dynamic invocation pass)
5. Integration linkage (API, Supabase, Sentry, pipeline)
6. Burndown + phased wiring plan
7. Research + guardrails (current year)
```

---

## Phase 1 — Auto-detect stack

Read `package.json` and config:

| Signal | Layer |
|--------|-------|
| `@supabase/supabase-js` | Supabase — find `createClient`, `supabase/migrations` |
| `@sentry/*` | Sentry — find init, instrumentation config |
| `react-query` / `@tanstack/react-query` | Data fetching |
| `next/server` actions | Server actions |
| `trpc` / `graphql` | API style |

Record: route manifest paths, API client location, env example file.

---

## Phase 2–4 — Detection passes

Execute all passes in `references/detection-methodology.md`:

1. Entry-point trace (reachable vs orphan candidates)
2. Static analysis (unused exports, dead branches)
3. Handler-binding (every interactive control → real effect?)
4. Data-flow (display components → live source?)
5. **Dynamic-invocation filter** — uncertain → `Review required`
6. Config/env trace (integrations actually initialized?)

Taxonomy: `references/detection-taxonomy.md`

**Be aggressive in finding, conservative in deleting.** Keep **Confirmed** vs **Review required** separate.

Optional live click pass: `protocol-browser-anti-stall` + shared session before Playwright MCP.

---

## Phase 5 — Backend / pipeline / integration linkage

For every stub that *should* be live, map:

- **API:** endpoint or server action — exists? contract? auth? → `[NEEDS REAL TARGET]` if missing
- **Pipeline:** ingest → transform → store → read — which hop is broken?
- **Supabase:** client role, table/view, **RLS** (missing = silent break or leak), types, realtime
- **Sentry:** instrumented? swallowed catches? context/tags/release/env/source maps/PII
- **Analytics / flags / i18n:** real sink, flag resolution, key resolution

Use MCP when available:

| MCP | Use |
|-----|-----|
| Supabase | `list_tables`, policies, advisors — verify tables/RLS exist |
| Sentry | Production errors on related routes — swallowed failures |
| Firecrawl | Current-year Supabase RLS + Sentry instrumentation patterns |
| Playwright | Click dead-looking controls; observe network/nav |

Never invent table names or endpoints.

---

## Phase 6 — Burndown + wiring plan

Burndown columns:

`Surface | Element | Type | Classification | Intended target | Wiring gap | Severity P0–P3 | Effort S/M/L | Risk | File:line`

Group by page/screen. Quantify totals.

**Phased wiring plan:**

1. **Silent-failure P0s** — dead controls, swallowed errors, missing RLS
2. **Mock → live data** — replace fixtures with real queries
3. **Orphan cleanup** — proposals only, dependency checks
4. **Instrumentation gaps** — Sentry, analytics, loading/error/empty states

Per confirmed stub: proposed wiring (target, contract, auth, states) + one-line "what must keep working."

**Industry-standard enhancements** (cite current year via Firecrawl):

- Typed Supabase client + generated types; RLS on every public table; test as non-owner
- Replace empty `catch` with handling + Sentry capture; breadcrumbs/tags/release
- Loading/error/empty UI for every newly-wired data path
- Guardrails: lint empty handlers, CI orphan/mock checks, PR checklist

Each phase independently reviewable + revertible.

---

## Required output (in order)

1. Preservation-contract acknowledgment
2. Detection taxonomy results (counts per type)
3. Per-surface stub/dead/fake inventory (checklist — nothing skipped)
4. Burndown table (classification + intended-target + risk)
5. Backend/Supabase/Sentry/pipeline linkage map
6. Wiring + enhancement plan, phased
7. Guardrails / tooling recommendations
8. Research notes + citations
9. Open questions / `[NEEDS REAL TARGET]` list

Deliver as markdown or canvas for large repos. **Do not implement wiring** unless user approves in a follow-up.

---

## Rules

- **Plan only — do not implement.** User approves before wiring.
- **Trace before flagging** (entry-point + dynamic-invocation pass).
- **Never fabricate** endpoints, tables, env, or behavior.
- Missing target/integration/env → say so, don't guess.
- Before proposing any file change: one line on what must keep working.
