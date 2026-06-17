---
name: plan-docs-sync
description: >
  Audit documentation against actual code behavior and plan corrections — no rewrites in this
  pass. Drift taxonomy (stale, missing, phantom, contradictory, onboarding-breaking, inline
  rot, API-contract drift) with code-as-source-of-truth methodology. Onboarding-drift checks
  against .env.example and CLI --help; docs-as-code guardrails for same-PR updates. Docs
  describe real current behavior — never aspirational or invented. Use when asked to "docs
  drift", "sync docs with code", "audit documentation", "stale README", "onboarding docs
  broken", "doc sync plan", "phantom docs", or "docs out of date".
license: MIT
---

# Docs Drift Audit + Sync Plan

**Role:** Senior engineer + technical writer.

**Task:** Audit all documentation against what the code **actually does**, find every drift,
plan corrections. README, CONTRIBUTING, setup/onboarding, API docs, JSDoc/docstrings,
architecture notes, `.env.example`, CLI `--help`, changelogs. **Audit & plan only.**

## vs neighbors

| Skill | Does |
|-------|------|
| **plan-docs-sync** (this) | Plan doc corrections from code truth |
| `docs-writer` | Write/improve docs (execution) |
| `workflow-housekeep` | README refresh as part of housekeeping |
| `plan-stub-checker` | Stubs/dead UI — often surfaces phantom docs |

**Loop position:** run **last** in the six-skill plan loop. See `docs/PLAN-LOOPS.md`.

---

## ⛔ Preservation Contract

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

## Phase 1 — Doc inventory

```
Glob: README.md CONTRIBUTING.md docs/**/*.md **/*README*.md
Glob: .env.example
```

List: README, CONTRIBUTING, docs/, inline JSDoc targets, OpenAPI, CLI help, changelog.

---

## Phase 2–5 — Detection

Execute all passes in `references/drift-taxonomy.md`.

**Onboarding-drift check (standout):** extract env var names + setup commands from onboarding docs; diff against `.env.example` keys and `package.json` scripts; run CLI `--help` where safe and compare.

Every drift: **doc claim** + **code truth** (path:line). Can't verify → `[NEEDS VERIFICATION]`.

---

## Phase 6 — Burndown + sync plan

Template: `references/output-templates.md`

Quantify: e.g. "9 phantom env vars, 14 undocumented endpoints, 6 onboarding steps that fail".

Per drift: before/after correction + "what's still accurate here". **Plan only — no rewrites until approval.**

**Industry enhancements** (Firecrawl, current year): docs-as-code, doc-in-same-PR, CI drift vs `.env.example` + CLI help, generated API refs, `llms.txt`.

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

## Rules

- Plan only — do not rewrite docs until approved.
- Code is source of truth. Every drift = doc claim + code fact.
- Never document invented or aspirational behavior.
- Stale docs get corrected, not deleted. Deletions are proposals.
- Separate factual drift vs subjective wording improvement.
