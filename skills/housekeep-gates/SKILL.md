---
name: housekeep-gates
description: >
  Apply-now consolidation of accreted CI gates, ratchets, and hooks into one
  aggregator required check. Use after audit-gate-logic, or when "clean up our
  CI checks", "we have three lint jobs", "make one quality gate". Audit-only →
  audit-gate-logic. Pipeline cost → audit-cicd.
license: MIT
---

# housekeep-gates — One required check, defined in code

**Degree of freedom: MIXED — T1 is the priority.** Mapping and winner
confirmation `[HIGH freedom]`; aggregator `needs:` + skip-fail, loser
**deletion**, branch-protection, and Phase 4 probes `[LOW freedom — run
exactly]`. **Net enforcement strictly ≥ before.**

Apply-now. `audit-gate-logic` mapped the sprawl and named a winner per
duplicate cluster; this makes the repo match the map. **Target state: one
required check in branch protection, backed by an aggregator job that
`needs:` every real gate — so "what blocks merge" has exactly one answer,
in one file.**

Every retirement is proven safe before deletion. Never weaken enforcement
while consolidating. **Net enforcement strictly ≥ before.**

This is the execution arm of `audit-gate-logic`, the same way
`housekeep-design` executes `plan-uiux-unification`.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **housekeep-gates** (this) | Consolidate / delete / wire the aggregator |
| `audit-gate-logic` | Read-only map — bypass, ratchets, archaeology |
| `audit-cicd` | Pipeline cost, speed, storage |
| `workflow-quality-gate` | *Runs* the pre-release sweep |
| `enhance-agent-guardrails` | *Installs* new guard classes, not accreted-gate cleanup |
| `workflow-green-repo` | Make the repo green — does not redesign the gate graph |
| `housekeep-backlog` | Parked-work register — not CI gates |

## How to reason

1. **Observe** — archaeology map: cluster, winner, loser, current required checks
2. **Interpret** — would deleting this loser drop unique coverage?
3. **Classify** — port-then-delete / keep / not-yet-mapped
4. **Severity** — deleting the only server-side-enforced gate is a regression

## Worked example

> **Observe:** two lint jobs; old `lint.yml` is required; new `ci.yml` lint
> is not. `paths:` skips `.github/**`.
> **Interpret:** retiring `lint.yml` without porting + aggregator skip-fail
> would let a workflow edit merge unlinted.
> **Classify:** port unique rules, wire winner, delete loser; probe the skip path.
> **Probe:** change matching the old skip filter → aggregator must go red, not skip-green.

---

## Phase 0 — Load the map (or make a quick one)  [HIGH freedom; confirm before edits]

Consume the archaeology map from `audit-gate-logic` (duplicate clusters,
winners, losers, ratchet findings). If none exists, run its Phase 0 + 2.5
first — never consolidate gates you have not mapped. Deleting an "obvious
duplicate" that was the only server-side-enforced one *weakens* the repo.

Confirm which winners stand **before touching anything**. Branch-protection
changes always get explicit confirmation.

---

## Phase 1 — Build the aggregator gate  [LOW freedom — fail on failed or skipped]

Create (or adopt) the single-gate structure:

- One job — conventionally `gate` / `all-green` — that `needs:` every real
  check (lint, typecheck, tests, build, and the audit jobs worth blocking
  on) and fails if any dependency failed **or was skipped** (`if: always()`
  + explicit result check). Skipped-counts-as-success is the classic
  aggregator bug.
- Make that job the **only** required status check; remove scattered
  required entries. Enforcement moves from a settings list nobody audits
  to a `needs:` list that lives in code review.
- If a merge queue is (or will be) in use: add `merge_group` to the
  workflow triggers and keep check names identical across `pull_request`
  and `merge_group`, or queued PRs wait on checks that never start.
- Keep one fast always-runs job as the visible status link if the
  aggregator's `needs:` delays its appearance.

---

## Phase 2 — Consolidate per the map  [LOW freedom — delete losers, do not disable]

For each duplicate cluster, in this order:

1. **Port unique value** from losers into the winner (a lint rule only the
   old config had, a test only the old workflow ran). Diff configs before
   deleting — retirement must not drop coverage.
2. **Wire the winner** into the aggregator's `needs:`.
3. **Retire the losers** — delete the workflow/config, do not
   disable-and-keep. A disabled gate is comprehension debt and resurrection
   bait for the next agent session.
4. **Extract shared logic** into a reusable workflow or composite action
   when the same steps exist in 2+ places.

Also restore **hook/CI parity**: local pre-commit / pre-push hooks run the
same commands (ideally the same scripts) as CI's gate jobs — one
definition, two callers — so "passes locally" predicts "passes CI" and
nobody learns `--no-verify`.

---

## Phase 3 — Normalize the ratchets  [HIGH freedom]

- **One baseline per metric.** Competing thresholds (jest + codecov + a
  committed floor) collapse to one enforcement point; the rest read from
  it or die.
- **Auto-tighten upward.** Floors track reality (threshold rises as the
  metric improves, small flake tolerance) instead of sitting far below
  actual.
- **Resets are reviewed, separate acts.** Baseline regeneration happens in
  its own PR with the diff visible. CI should fail if a baseline file
  changes in the same PR as a metric regression, where the tooling allows
  expressing that.
- **No silent exemption growth.** Ignore-lists and inline-disable counts
  become ratcheted metrics themselves where feasible.

---

## Phase 4 — Prove it  [LOW freedom — run both probes]

- **Deliberate-violation probe** on a scratch branch: one violation per
  consolidated gate class (lint error, failing test, coverage drop,
  baseline edit bundled with a regression). Confirm the aggregator goes
  red and the PR is unmergeable. A consolidation is not done until each
  retired loser's job is demonstrably covered by the winner.
- **Skip-path probe:** push a change matching any `paths:` filter that
  previously skipped gates; confirm the aggregator still reports
  (skipped-as-success is the failure mode to disprove).
- Run a `workflow-green-repo`-style full pass to confirm the repo is green
  under the new single gate.

---

## Definition of Done

- [ ] Archaeology map confirmed with the user before edits
- [ ] Aggregator job exists, fails on any failed **or skipped** dependency, and is the only required check
- [ ] `merge_group` parity in place if a merge queue is used
- [ ] Every cluster: unique value ported, winner wired, losers deleted (not disabled)
- [ ] Shared steps extracted to one reusable definition; hooks and CI call the same commands
- [ ] One baseline per metric; ratchets auto-tighten; resets require a separate reviewed PR; exemption lists cannot silently grow
- [ ] Deliberate-violation + skip-path probes red as expected; repo green under the new gate
- [ ] Net enforcement strictly ≥ before

## Self-critique before claiming done  [LOW freedom — do not skip]

1. **Map confirmed** — no "obvious duplicate" deleted unmapped
2. **Skipped ≠ success** — aggregator checks dependency results
3. **Losers deleted** — not disabled
4. **Probes red** — violation + skip-path
5. **Branch protection** — only after explicit confirmation

## Output format

1. **Before/after map** — old gates → new structure (aggregator + needs list)
2. **Per-cluster log** — winner | value ported from losers | losers deleted
3. **Ratchet policy** — metric | enforcement point | floor behavior | reset rule
4. **Probe evidence** — violation | gate response | pass/fail

Applied phase-by-phase. Pause for approval between phases when blast
radius is large. Branch-protection changes always get explicit confirmation.
