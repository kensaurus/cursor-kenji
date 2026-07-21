---
name: complete-everything
description: >
  Close an approved plan with zero plan-related deferrals: implement every
  unfinished item, absorb every connected out-of-scope/follow-up/nice-to-have
  item parked by prior runs, fix newly exposed gaps, and run the full applicable
  verification ladder. Use when a plan was marked done with work deferred, or
  the user says "complete everything", "don't defer", "fix out of scope too",
  "finish the whole plan", "close every TODO", or invokes
  /complete-everything. Distinct from burndown-full, which proves mechanical
  pattern coverage; this skill closes intent, behavior, and verification gaps.
---

# Complete Everything

## Mission (verbatim)

> fix and test thoroughly on all the plan - do not defer anything. make sure proper full test is done after enhancement - also fix all out of scope.

## Completion contract

Drive the approved outcome through implementation, repair, and verification in
one continuous run. Do not stop at phase boundaries or ask whether to continue.
Do not claim success from memory, compilation alone, or the original plan's
checkboxes.

The **closure set** contains:

- every unfinished or partially finished plan item;
- every `out of scope`, follow-up, optional, nice-to-have, or future-work item
  parked by the plan or prior completion report that is materially connected to
  the approved goal;
- every defect, missing test, contract mismatch, or regression discovered in
  the affected blast radius;
- every failure introduced by the work or blocking proof of the outcome.

This is not permission for unrelated repository-wide cleanup. Do not silently
reopen explicit user non-goals, rejected features, or unrelated pre-existing
debt. Record those as baseline context, not closure items. If relevance is
unclear, decide from the approved user outcome; ask only when the answer would
materially change product behavior.

Only these may block execution:

- missing credentials, access, or a real endpoint/contract;
- destructive production-data operations or irreversible external actions;
- auth behavior, RLS semantics, secrets, payments, destructive data mutation,
  or an unconfirmed deployment target where project rules require approval;
- a genuine product decision with materially different valid outcomes.

Ask one precise question immediately when blocked. Effort, context length, an
uncertain implementation approach, or a failing test are not blockers.

## Phase 0 — Recover scope and establish a baseline

1. Read the full plan, including appendices, exclusions, acceptance criteria,
   and checked items. If no path is supplied, inspect `.cursor/plans/`, the
   conversation, and recent plan/report files.
2. Read the prior completion report or chat summary. Search plan and report
   text for parked work:

   ```bash
   rg -n -i \
     'out of scope|follow[- ]?up|nice to have|later|defer(red)?|skip(ped)?|not in this (pr|pass|phase)|left as|TODO|FIXME|won.t do|optional|future work|beyond scope' \
     <plan-and-report-paths>
   ```

3. Inspect `git status`, staged and unstaged diffs, and recent commits. Do not
   overwrite unrelated user work.
4. Discover exact verification commands from manifests, CI, `AGENTS.md`,
   `CLAUDE.md`, README files, Makefiles, or equivalent project tooling.
5. Run the cheapest representative baseline checks before editing when
   practical. Record pre-existing failures so later results distinguish
   regressions from baseline debt.
6. Convert every closure item into an observable acceptance statement: what a
   user can do, which contract holds, or which test/command proves it.

Announce: **"Closing N items (P planned + D previously parked + G discovered).
No plan-related deferrals this run."**

## Phase 1 — Externalize the work

Create `.cursor/complete-everything-state.md` as the durable source of truth:

```md
# Complete Everything: <approved outcome>
Plan: <path or conversation>
Baseline: <commands and pre-existing failures>
Verify: typecheck=`...` lint=`...` test=`...` build=`...` e2e=`...|none`

## Plan items
- [ ] <item> — acceptance: <observable proof>

## Previously parked — now in scope
- [ ] <item> — parked as: "<short quote>" — acceptance: <proof>

## Discovered while closing
- [ ] <item> — source: <test/diff/runtime/review> — acceptance: <proof>

## Human gates
- [ ] <item> — blocked by: <real blocker> — question: <one precise ask>

## Verification ladder
- [ ] changed-file diagnostics
- [ ] typecheck
- [ ] lint
- [ ] focused unit/integration tests
- [ ] related/full tests
- [ ] API contract verification (if applicable)
- [ ] build (if configured)
- [ ] real user-flow smoke (if applicable)
- [ ] independent completion judge

## Evidence and decisions
- <timestamp or milestone>: <command/result or decision/rationale>
```

Mirror the milestones in the runtime's native task list when available. The
state file wins after context compaction: re-read it before each milestone and
before any completion claim.

### Arm host-level continuation

Instruction text alone cannot reliably prevent premature stops. Use the host's
continuation mechanism in addition to the state file:

- **Cursor:** the packaged `stop` hook reads
  `.cursor/complete-everything-state.md` and submits a follow-up only while
  actionable unchecked items remain. It ignores completed states, errored or
  aborted turns, and human-gate-only states. If hooks are disabled, continue
  manually from the state file; do not lower the completion contract.
- **Claude Code 2.1.139+:** start the run with:

  ```text
  /goal All actionable items in .cursor/complete-everything-state.md are checked, every applicable verification gate has fresh passing evidence after the final edit, and completion-judge returns PASS at the claimed completion level.
  ```

  `/goal` supplies an independent per-turn evaluator. The state file remains
  the auditable source of truth. If `/goal` is unavailable or hooks are
  disabled, continue the same workflow without pretending the evaluator ran.

## Phase 2 — Close every item

Work in small, independently verifiable milestones. For each item:

1. Mark it in progress in the native task list; keep it unchecked in the state
   file until its acceptance evidence exists.
2. Read the relevant implementation and tests. Preserve existing public
   behavior unless the approved plan explicitly changes it.
3. Implement the root-cause fix. Do not delete features, narrow behavior,
   weaken tests, blanket-update snapshots, or silence errors to get green.
4. Add or update tests whenever behavior, contracts, or error handling change.
5. Run the cheapest focused validation. Repair failures before moving on.
6. Append newly discovered connected work to **Discovered while closing** and
   close it in this run. Never hide it in the final report as a follow-up.
7. Tick the item only after recording its evidence.

If the approach is uncertain, use the `research` skill, record the decision and
source, then implement. If a large task has separable read-only inventory or
test work, use bounded subagents while the main agent retains the closure set
and integrates the results.

### Required routing by change signal

- **Searchable migration or rename remains:** use `burndown-full` for the
  mechanical sweep, then return here for behavioral verification.
- **Behavior changed or coverage is missing:** use `test-unit`; tests must be
  capable of failing for the regression.
- **API clients, routes, RPCs, webhooks, request/response types changed:** use
  `audit-fe-api`; fix every mismatch in the affected contract.
- **4xx/5xx, validation, serialization, CORS, or FE/BE drift appears:** use
  `debug-fe-be-integration` and verify both sides.
- **UI flow changed:** use `test-playwright` with
  `protocol-browser-anti-stall`; drive the real touched flow and fix failures.
- **Fetching, polling, realtime, lists, images, or heavy rendering changed:**
  measure the affected path and use `audit-performance` when evidence shows a
  performance gap. Optimize the root cause; do not add speculative complexity.
- **Schema, RPC, edge function, RLS, bucket, secret, or cron changed:** obey
  `full-stack-ship-discipline`; keep local migration/config artifacts aligned
  with the verified target environment and honor protected-surface approvals.

## Phase 3 — Full post-enhancement verification

Completion requires fresh evidence from this run. Execute every applicable step
in this order:

1. Re-read the state file. Zero closure items may remain unchecked. A human gate
   means the run is **blocked**, not complete.
2. Review the full diff against the plan, parked-item inventory, acceptance
   statements, and repository conventions.
3. Run diagnostics on changed files and fix introduced issues.
4. Run the configured whole-project or affected-package typecheck.
5. Run lint/format checks using the repository's commands.
6. Run focused unit/integration tests, then the related or full suite required
   by the blast radius.
7. Run API/FE-BE/runtime truth checks when those surfaces changed. Verify remote
   backend objects and client roles when required.
8. Run the build when configured.
9. For user-facing changes, drive the real flow in a headed browser or the
   repository's platform-appropriate E2E harness. Confirm UI, console, network,
   persistence, and error states.
10. Re-run any gate invalidated by a later fix.
11. Invoke the `completion-judge` subagent with the approved outcome, state-file
    path, relevant diff range, baseline, and fresh command/runtime evidence.
    - `PASS` permits the closure report at the judge's claimable level.
    - `CONTINUE` adds every finding to the state file and returns to Phase 2.
    - `BLOCKED` records the precise human gate; it is not completion.

On failure: diagnose, add the repair to the state file, fix it, and restart from
the failed gate. Never report "known failure, ship anyway." If a whole-project
gate failed before the run, fix it when connected to the closure set or when it
blocks proof; otherwise report the unchanged baseline failure separately
without mislabeling the plan closure as a fully green repository.

## Phase 4 — Evidence-only closure

Use this structure:

```md
## Complete Everything — report

**Goal:** <approved outcome>
**Closed:** N planned + D previously parked + G discovered
**Blocked on you:** none | <real blocker and one precise question>

### Evidence
- diagnostics: `<tool/command>` → <result>
- typecheck: `<command>` → <result>
- lint: `<command>` → <result>
- tests: `<command>` → <result>
- API / FE-BE: ran / n/a — <result>
- performance: measured / n/a — <result>
- build: `<command>` → <result>
- user flow: `<flow>` → <result>
- completion judge: `PASS` — claimable level: <level>

### Baseline unrelated failures
- none | <failure that existed before and why it is outside the closure set>

### Intentionally unchanged
- none | <explicit user non-goal or protected human gate>
```

Forbidden success language: "left as follow-up", "out of scope for now", "can
be done later", "should work", "probably fine", or any claim unsupported by
fresh evidence.

Leave `.cursor/complete-everything-state.md` fully ticked as the audit trail
unless the user asks to remove it.

## Relationship to other workflows

- `complete-everything` closes plan intent, parked work, behavior, and evidence.
- `burndown-full` proves repo-wide mechanical pattern coverage.
- `workflow-quality-gate` assesses release readiness; it does not replace this
  implementation loop.
- `verification-before-completion` defines the evidence levels and mandatory
  final gate used by this workflow.
- `completion-judge` is the independent read-only verdict; the implementation
  agent cannot self-certify a wide closure run.
- `workflow-pr` or `workflow-git-commit` may ship the result only when the user
  requested commit, push, or PR actions.
