---
name: plan-docs-sync
description: >
  Audit documentation against actual code behavior and plan corrections — no rewrites in
  this pass. Use when asked to "docs drift", "sync docs with code", "audit documentation",
  "stale README", "onboarding docs broken", "doc sync plan", "phantom docs", or "docs out
  of date". Why-we-chose-X / ADRs → docs-adr.
license: MIT
---

# Docs Drift Audit + Sync Plan

**Degree of freedom: MIXED** — inventory globs are exact; drift judgment
is high. Stay **plan-only**. No rewrites until approved.

**Role:** Senior engineer + technical writer.

**Task:** Audit all documentation against what the code **actually does**, find every drift,
plan corrections. README, CONTRIBUTING, setup/onboarding, API docs, JSDoc/docstrings,
architecture notes, `.env.example`, CLI `--help`, changelogs. **Audit & plan only.**

## This skill vs neighbors

| Skill | Does |
|-------|------|
| **plan-docs-sync** (this) | Plan doc corrections from code truth |
| `docs-writer` | Write/improve docs (execution) |
| `workflow-housekeep` | README refresh as part of housekeeping |
| `plan-stub-checker` | Stubs/dead UI — often surfaces phantom docs |

**Loop position:** run **last** in the six-skill plan loop. See `docs/PLAN-LOOPS.md`.

## How to reason (every plan item)

1. **Propose** — correction that makes the doc match code truth
2. **Risk** — onboard fail, phantom API, or invented behavior if left stale
3. **Keep-working** — claims already backed by path:line
4. **Phase** — factual drift first; wording last (do not execute)

## Worked example

> **Propose:** drop `STRIPE_WEBHOOK_SECRET` from the README setup list (absent from `.env.example` and code); document `POST /v1/webhooks/stripe` which exists undocumented.
> **Risk:** onboarding fails on a phantom env var; integrators miss a live endpoint.
> **Keep-working:** CONTRIBUTING install steps match `package.json` scripts.
> **Phase:** first sync slice — factual drift only.

---

## ⛔ Preservation Contract  [LOW freedom — run exactly]

Read `references/preservation-contract.md`. Acknowledge in output #1.

Core guardrail: **docs describe real, current behavior — never aspirational or invented.**

---

## References

| File | Contents |
|------|----------|
| `references/drift-taxonomy.md` | Types, detection passes, guardrails |
| `references/output-templates.md` | Burndown, phased sync plan |

---

## Phase flow

```
1. Inventory all doc surfaces
2. Code-as-source-of-truth pass
3. Reverse pass (missing docs)
4. Onboarding replay (.env.example + CLI help)
5. Signature + cross-doc consistency + links
6. Burndown + phased sync plan
7. Research + guardrails (docs-as-code, CI drift checks)
```

---

## Phase 1 — Doc inventory  [LOW freedom — run exactly]

```
Glob: README.md CONTRIBUTING.md docs/**/*.md **/*README*.md
Glob: .env.example
```

List: README, CONTRIBUTING, docs/, inline JSDoc targets, OpenAPI, CLI help, changelog.

---

## Phase 2–5 — Detection  [HIGH freedom]

Execute all passes in `references/drift-taxonomy.md`.

**Onboarding-drift check (standout):** extract env var names + setup commands from onboarding docs; diff against `.env.example` keys and `package.json` scripts; run CLI `--help` where safe and compare.

Every drift: **doc claim** + **code truth** (path:line). Can't verify → `[NEEDS VERIFICATION]`.

---

## Phase 6 — Burndown + sync plan  [HIGH freedom — plan only]

Template: `references/output-templates.md`

Quantify: e.g. "9 phantom env vars, 14 undocumented endpoints, 6 onboarding steps that fail".

Per drift: before/after correction + "what's still accurate here". **Plan only — no rewrites until approval.**

**Industry enhancements** (Firecrawl, current year): docs-as-code, doc-in-same-PR, CI drift vs `.env.example` + CLI help, generated API refs, `llms.txt`.

## Self-critique before the burndown  [LOW freedom — do not skip]

1. **evidenced-not-assumed** — every drift is doc claim + code path:line (or `[NEEDS VERIFICATION]`)
2. **plan-only** — no rewrites; deletions are proposals
3. **phase justified** — factual drift before wording polish
4. **right-owner** — why-we-chose-X → `docs-adr`; stubs/dead UI → `plan-stub-checker`
5. **no-false-safety** — never document invented or aspirational behavior

---

## Required output (in order)

1. Preservation-contract acknowledgment
2. Drift taxonomy results (counts per type)
3. Per-doc drift inventory (checklist)
4. Burndown table (code-truth + risk)
5. Sync + enhancement plan, phased
6. Guardrails/tooling
7. Research notes + citations
8. Open questions / `[NEEDS VERIFICATION]` list

---

## Rules  [LOW freedom — run exactly]

- Plan only — do not rewrite docs until approved.
- Code is source of truth. Every drift = doc claim + code fact.
- Never document invented or aspirational behavior.
- Stale docs get corrected, not deleted. Deletions are proposals.
- Separate factual drift vs subjective wording improvement.
