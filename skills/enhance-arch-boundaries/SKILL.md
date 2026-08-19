---
name: enhance-arch-boundaries
description: >
  Install mechanically-enforced architecture boundaries (dependency-cruiser /
  eslint-boundaries) so layer direction, feature isolation, and forbidden
  imports fail CI. Use when "enforce module boundaries", "stop spaghetti
  imports", "add architecture rules". Advisory audit →
  audit-backend-architecture.
license: MIT
---

# enhance-arch-boundaries — Architecture as a fitness function

**Degree of freedom: MIXED — T1 is the priority.** Recovering the model
`[HIGH freedom]`; do-not-invent, shrink-only baseline, and deliberate-violation
probes `[LOW freedom — run exactly]`.

Codify the repo's intended structure as rules that block merge. **Import
spaghetti is how agents degrade architecture: each import looks locally
reasonable, no single diff is wrong, and after forty sessions the
layering is gone.** A rule in AGENTS.md is advisory. A dependency-cruiser
rule in the aggregator gate is physics.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **enhance-arch-boundaries** (this) | Mechanical boundary rules + shrink-only baseline |
| `audit-backend-architecture` | Advises which pattern to adopt — does not enforce |
| `housekeep-gates` | Wires this check into the aggregator |
| `docs-adr` | Records *why* the model was chosen |
| `enhance-agent-guardrails` | Broader guard install; this owns the import graph |

## How to reason

1. **Observe** — folder layout, existing conventions, any architecture audit
2. **Interpret** — what layering does the repo already mean to have?
3. **Classify** — recoverable model / no intended structure (stop) / inventing (forbidden)
4. **Severity** — client → server-only / service-role is the worst edge

## Worked example

> **Observe:** `app/dashboard/page.tsx` imports `@/lib/supabase/admin`
> (service-role). No boundary rule.
> **Interpret:** the intended split exists in folder names but is not physics.
> **Classify:** forbidden edge — client → server-only.
> **Fix:** dependency-cruiser / eslint-boundaries rule; grandfather other
> violations into a shrink-only baseline; probe a new forbidden import fails CI.

---

## Phase 0 — Recover the intended architecture (do not invent one)  [LOW freedom — stop if none]

The rules must encode the architecture the repo *means* to have.

- Read folder structure and existing conventions (`features/*`, `app/`,
  `lib/`, `server/`, `components/`, monorepo packages).
- Read `audit-backend-architecture` output if it exists — that is the
  drift to stop.
- Confirm with the user in one pass: layers and allowed direction (e.g.
  `ui → application → domain → infrastructure`, never reverse), feature
  units that must stay isolated, special zones (server-only, secrets,
  generated).

State the model in ten lines before writing any rule. If the repo
genuinely has no intended structure, **stop and say so** — enforcing a
structure nobody chose creates fights, not quality. Propose a minimal
layering first.

---

## Phase 1 — Install the rule set  [HIGH freedom; mapped to the confirmed model]

Tool by stack: **dependency-cruiser** (framework-agnostic JS/TS),
**eslint-plugin-boundaries** (when living inside ESLint is preferable),
Nx module-boundary tags, import-linter (Python).

Core rules, each mapped to the confirmed model:

- **Layer direction** — lower layers cannot import upward; skipping
  layers flagged where the model says so.
- **Feature isolation** — features import each other only via a public
  surface (`features/x/index.ts`), never deep paths. Shared code goes
  through `shared/`, not sideways.
- **No circular dependencies** — anywhere. Cycles are where "change one
  thing" stops being possible.
- **Forbidden edges** — client importing server-only / service-role
  modules (cross-ref `plan-rls-audit` / `plan-secrets-audit`), UI
  importing the DB layer directly, production importing test utilities,
  anything importing generated internals.
- **No orphans** — modules nothing reaches (feeds `workflow-housekeep`).
- **Dependency hygiene** — no `devDependencies` from shipped code;
  deprecated internals marked un-importable so migration ratchets.

---

## Phase 2 — Grandfather, then ratchet  [LOW freedom — shrink-only baseline]

Do not weaken the rules to fit existing violations, and do not block the
repo on fixing them all.

- Capture existing violations into the tool's **known-violations
  baseline** so CI is green today.
- The baseline is a **shrink-only ratchet**: new violations fail;
  existing ones are tracked debt; the baseline file can only get smaller
  without review — same reset policy as `housekeep-gates`.
- File the grandfathered list as a burndown, worst edges first (cycles
  and client→server-secrets before cosmetic layer skips).

---

## Phase 3 — Wire and make agent-legible  [HIGH freedom]

- Add the check to CI wired into the aggregator gate (`housekeep-gates`)
  and mirror it in local hooks (same command, two callers).
- Generate the dependency **graph visualization** into docs; regenerate
  it on the scheduled run so it cannot go stale.
- Write the ten-line model + "how to fix a boundary violation" into
  agent rules *referencing the mechanical check* — the rule text
  explains, the gate enforces.
- Record the architecture decision as an ADR (`docs-adr`) so a future
  session knows the layering was chosen, by whom, and why the rejected
  alternative lost.

---

## Definition of Done

- [ ] Intended model recovered from the repo + confirmed with the user (or the no-structure finding raised)
- [ ] Rules installed: layer direction, feature isolation via public surfaces, no cycles, forbidden edges (incl. server-only → client), no orphans, dep hygiene
- [ ] Existing violations grandfathered into a shrink-only baseline; burndown filed worst-first
- [ ] Check in the aggregator gate + local hooks with one shared command
- [ ] Graph visualization generated into docs with a regeneration schedule
- [ ] Agent rules updated to state the model and point at the gate; decision recorded via `docs-adr`
- [ ] Deliberate-violation probe: a test import that breaks each rule class fails CI

## Self-critique before claiming done  [LOW freedom — do not skip]

1. **Model confirmed** — or you stopped; you did not invent a layering
2. **Baseline shrink-only** — new violations fail; no silent growth
3. **Probe per rule class** — a test import failed CI
4. **Right owner** — pattern advice → `audit-backend-architecture`; why → `docs-adr`
5. **Aggregator wired** — `housekeep-gates`

## Output format

1. **Architecture model** — ten-line statement of layers, directions, features, special zones
2. **Rule set** — rule | what it forbids | why (mapped to the model)
3. **Grandfathered baseline** — count by rule | worst-first burndown
4. **Wiring** — gate job, hook parity, graph location, agent-rule text added
5. **Probe evidence** — violation per rule class | CI result

Applied directly (enhance-family). Pause for approval only on the model
confirmation and before committing the baseline.
