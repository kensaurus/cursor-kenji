---
name: audit-gate-logic
description: >
  Read-only audit of CI gate logic — silent bypass, ratchet gaming, conflicting
  conditions, required checks that are not. Use when "can CI be bypassed", "is
  our coverage ratchet sound", "why did a regression pass CI". Cost/speed →
  audit-cicd. Running the sweep → workflow-quality-gate.
license: MIT
---

# audit-gate-logic — Does the gate actually stop what it claims?

Read-only. `audit-cicd` asks "is the pipeline fast, cheap, and safe to run."
This asks **"does the gate stop what it claims to stop."** A green check is a
claim. The expensive failures are the ones where CI passed and shouldn't have.

Present findings. Do not edit workflows, branch protection, or baselines.
Hand fixes to a follow-up session or `enhance-agent-guardrails`.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **audit-gate-logic** (this) | Bypass, ratchet integrity, condition conflicts, required-vs-actual |
| `audit-cicd` | Pipeline cost, speed, storage, runner safety |
| `workflow-quality-gate` | *Runs* the pre-release sweep — does not audit its soundness |
| `enhance-agent-guardrails` | *Installs* new gates; does not audit existing gate logic |
| `burndown-full` / `workflow-green-repo` | Execute MATCH/DONE or green the repo — ratchet holes stay here |
| `audit-codemod-safety` | Bulk-transform behavior; if CI waved a semantic bug through, that is also a finding here |

**Degrade honestly.** Highest-value "is it actually required" checks need
branch-protection / rulesets via the repo settings API (`gh api`), not just
YAML. If settings are invisible, audit the workflow files and say so — you
can still catch `continue-on-error` and ratchet classes, but you cannot
confirm the required-check list.

---

## Phase 0 — Map every gate and its enforcement

Inventory the full gating surface, not just the obvious jobs:

- **Workflows & jobs** (`.github/workflows/*`, or GitLab/CircleCI equivalent):
  each job, its triggers (`on:`), its `if:` conditions, path/branch filters.
- **Required status checks** (branch protection / rulesets): which checks
  *actually* block merge vs which merely run.
- **Ratchets / baselines**: coverage floors, lint-error baselines, bundle
  budgets, type-error counts, MATCH/DONE burndown, `workflow-green-repo`
  green baseline.
- **Pre-commit / pre-push hooks**: local gates that may not mirror CI.
- **Bot gates**: CodeRabbit / Sonar / Danger — block vs advise.

For each gate record: what it checks, what happens on failure (block / warn /
silently pass), and whether it is enforced server-side or only by convention.

---

## Phase 1 — Silent-bypass failure modes

**`continue-on-error` / soft failure** — `continue-on-error: true`, `|| true`,
`exit 0` swallowing, or `if: always()` masking a failure. The check runs,
"passes", and enforces nothing.

**Required-in-name-only** — Runs in CI but is not in the required list →
mergeable while failing. Or a required check whose *job* can be skipped
(`if:`) so it reports success-by-absence. A skipped required check often
counts as passed.

**Path/branch filters that skip the wrong changes** — `paths:` /
`paths-ignore:` that exclude a gate for the files that needed it (security
scan skips `.github/`, so a PR that disables the scan is not scanned).
Filters that never run on the default branch, or only on PRs and not on
direct pushes.

**Condition conflicts** — Two workflows whose `if:` / triggers **both fire**
on the same event (duplicate work, race on a shared resource, contradictory
status posts) or **both skip** (each assumes the other ran). Missing
concurrency groups so two runs race and the loser's failure is discarded.

**Fork / permissions bypass** — `pull_request_target` running privileged with
untrusted code, or gates that do not run on external-contributor PRs.

**Event mismatch** — Gate triggers on `push` but merges use squash/PR (or
vice versa), so the enforced commit was never the gated one.

---

## Phase 2 — Ratchet and baseline soundness

**One-way that isn't** — Can the baseline be regenerated in the same PR that
regresses (`--update-snapshot`, `coverage --update-baseline` committed
alongside the drop), locking the regression in as the new floor? Baseline
moves should be a separate, reviewed act.

**Exclusion gaming** — Coverage/lint passes because the dropped files are in
`.eslintignore`, `coveragePathIgnorePatterns`, or `// istanbul ignore`. A
ratchet that measures a shrinking surface always passes.

**Threshold vs reality** — Floor so far below actual that a real drop still
clears it (60% gate, 90% actual → 89% "passes"). Global thresholds hiding
per-file collapse. Bundle budgets set above current so growth is free.

**Baseline staleness / drift** — Never regenerated (no longer reflects the
codebase) or auto-regenerated every run (never actually ratchets).

**Direction bugs** — Comparison operator backwards (passes when *worse*), or
comparing against `main` after `main` already absorbed the regression.

**Burndown ratchet integrity** — Can MATCH/DONE mark an item DONE without
verification evidence? Can the count go down (work un-done) without failing?
Cross-check `completion-judge` / `burndown-full`.

---

## Phase 3 — Verify against history (where possible)

Where CI history is inspectable, look for a merged PR that introduced a
failure the gate should have caught. Each one is a proven hole, not a
hypothetical.

Optional cheap probe on a **scratch branch the user already has**: introduce
a deliberate violation the gate claims to catch and confirm it blocks. A
gate never tested against a real violation has unknown efficacy. Do not
create that branch or push it unless the user asked.

---

## Definition of Done

- [ ] Every gate inventoried with on-failure behavior and server-side vs convention
- [ ] All `continue-on-error` / soft-fail / `always()` masking found
- [ ] Required-check list cross-checked against what actually runs — or explicitly skipped because settings were invisible
- [ ] Path / branch / event filters checked for excluding the changes that most need gating
- [ ] Cross-workflow both-fire / both-skip / races surfaced; concurrency groups checked
- [ ] Fork / `pull_request_target` / external-PR bypass assessed
- [ ] Every ratchet checked for same-PR overwrite, exclusion gaming, slack threshold, staleness, direction bug
- [ ] Burndown / completion ratchet integrity checked against its evidence requirement
- [ ] History scanned for regressions-shipped-green; deliberate-violation probe noted or skipped with reason
- [ ] Read-only — findings presented, gates not edited

## Output format

1. **Gate inventory** — gate | checks what | on-failure (block/warn/silent) | enforced where
2. **Bypass findings** — gate | failure mode | severity (critical = ships-broken-green) | evidence
3. **Ratchet findings** — ratchet | weakness | can it lock in / be gamed? | fix
4. **Conflict map** — workflow A × workflow B | both-fire / both-skip / race
5. **Proven holes** — merged PR / probe that passed a gate it shouldn't have
6. **Fix plan** — silent-bypass first, then ratchet integrity, then conflicts; each item → `enhance-agent-guardrails`, `audit-cicd` (pipeline-side), or a fix session. Present and stop.
