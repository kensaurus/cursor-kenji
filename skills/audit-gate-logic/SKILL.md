---
name: audit-gate-logic
description: >
  Read-only audit of CI gate logic — silent bypass, ratchet gaming, conflicting
  conditions, required checks that are not, and accreted duplicate gates. Use
  when "can CI be bypassed", "why did a regression pass CI", "we have too many
  overlapping checks". Cost/speed → audit-cicd. Consolidation → housekeep-gates.
license: MIT
---

# audit-gate-logic — Does the gate actually stop what it claims?

Read-only. `audit-cicd` asks "is the pipeline fast, cheap, and safe to run."
This asks **"does the gate stop what it claims to stop."** A green check is a
claim. The expensive failures are the ones where CI passed and shouldn't have.

Present findings. Do not edit workflows, branch protection, or baselines.
Consolidation of the archaeology map → `housekeep-gates`. Rule-to-mechanical
gaps → `enhance-agent-guardrails`.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **audit-gate-logic** (this) | Bypass, ratchet integrity, conflicts, required-vs-actual, archaeology map |
| `housekeep-gates` | *Executes* the map — aggregator, delete losers, prove |
| `audit-cicd` | Pipeline cost, speed, storage, runner safety |
| `workflow-quality-gate` | *Runs* the pre-release sweep — does not audit its soundness |
| `enhance-agent-guardrails` | *Installs* new gates; does not audit existing gate logic |
| `burndown-full` / `workflow-green-repo` | Execute MATCH/DONE or green the repo — ratchet holes stay here |
| `audit-codemod-safety` | Bulk-transform behavior; if CI waved a semantic bug through, that is also a finding here |
| `test-mutation` | Assertion-strength gate this map should name if coverage is the only test metric |

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

## Phase 2.5 — Gate archaeology (accreted gates from multiple sessions)

Gates accumulate: each dev, agent session, or "let's add a check" iteration
layers another workflow without removing the last. Audit the *set*:

**Duplicate gates, different vintages** — Two+ jobs checking the same
thing (two lint jobs with disagreeing configs, ESLint and Biome both
wired, an old `test.yml` and a newer `ci.yml` both running the suite).
For each pair: which actually blocks, whether configs disagree, which is
vestigial.

**Competing baselines / ratchets** — Multiple floors for one metric (jest
threshold + codecov + a committed floor), updated at different times. The
agent satisfies whichever loaded; the strictest one silently stopped
being the real gate.

**Hook-vs-CI divergence** — Pre-commit / pre-push enforcing a different
ruleset than CI, so "passes locally" and "passes CI" are different claims
and people learn `--no-verify`.

**Dead gates** — Triggers that can no longer fire (renamed branches,
removed paths, disabled but not deleted). Still cost comprehension:
every reader must reason about a gate that does nothing.

**Best-of selection** — For each duplicate cluster, name the winner:

1. Server-side-enforced beats convention
2. Aggregator-gate pattern (one required check that `needs:` all others) beats N scattered required checks
3. Merge-queue-compatible (`merge_group` + matching check names) beats PR-only
4. Auto-tightening ratchet with reviewed resets beats a static threshold
5. AST / structural checks beat regex greps
6. Owned + recently maintained beats abandoned

Record winner + losers per cluster — this is the input `housekeep-gates`
executes.

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
- [ ] Duplicate-gate clusters, competing baselines, hook-vs-CI divergence, and dead gates mapped; a winner named per cluster
- [ ] Read-only — findings presented, gates not edited; consolidation handed to `housekeep-gates`

## Output format

1. **Gate inventory** — gate | checks what | on-failure (block/warn/silent) | enforced where
2. **Bypass findings** — gate | failure mode | severity (critical = ships-broken-green) | evidence
3. **Ratchet findings** — ratchet | weakness | can it lock in / be gamed? | fix
4. **Conflict map** — workflow A × workflow B | both-fire / both-skip / race
5. **Archaeology map** — duplicate cluster | members | winner (+ why) | losers to retire
6. **Proven holes** — merged PR / probe that passed a gate it shouldn't have
7. **Fix plan** — silent-bypass first, then ratchet integrity, then conflicts. Consolidation → `housekeep-gates`; pipeline-side → `audit-cicd`; rule-to-mechanical gaps → `enhance-agent-guardrails`. Present and stop.
