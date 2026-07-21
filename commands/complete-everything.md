---
description: "Close every plan-related deferral, implement the full closure set, and prove the result with fresh tests"
argument-hint: "[plan file or approved outcome]"
---

# Complete Everything

Follow the **`complete-everything`** skill end to end. This command is a thin
entry point; do not replace the skill with a shorter improvised workflow.

In brief:

1. Recover the full plan, prior completion report, diffs, and every connected
   item parked as out of scope, follow-up, optional, nice-to-have, or future
   work.
2. Write the closure set and observable acceptance criteria to
   `.cursor/complete-everything-state.md`.
3. Use host continuation as well as instructions: the packaged Cursor stop hook
   follows unfinished state files; on Claude Code 2.1.139+ the strongest entry
   is `/goal All actionable items in .cursor/complete-everything-state.md are
   checked, fresh applicable verification passes after the final edit, and
   completion-judge returns PASS.`
4. Implement every item without pausing between milestones. Research uncertain
   approaches, append connected discoveries, and repair validation failures
   immediately.
5. Compose the applicable skills: `burndown-full`, `test-unit`, `audit-fe-api`,
   `debug-fe-be-integration`, `audit-performance`, and `test-playwright`.
6. Run fresh diagnostics, typecheck, lint, tests, API/backend checks, build, and
   real user-flow smoke as applicable. A failure loops back to implementation.
7. Invoke `completion-judge` with the plan, state file, full diff, baseline, and
   fresh evidence. `CONTINUE` loops back; `BLOCKED` is not success.
8. Report only evidence. A real human decision or protected operation is
   **blocked**, never mislabeled as complete or deferred.

The full playbook lives in the **`complete-everything`** skill.

Related: `burndown-full` for mechanical coverage, `verification-before-completion`
for evidence levels, `workflow-quality-gate` for release assessment, and
`full-stack-ship-discipline` for backend deployment.
