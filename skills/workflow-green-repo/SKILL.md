---
name: workflow-green-repo
description: >
  Drive an entire repository to a fully green baseline — typecheck, lint, tests, and build
  all passing from a clean checkout — when the user has explicitly authorized fixing. Use
  when "make the repo green", "get CI passing", "fix all the failing tests". Ratchet
  integrity → audit-gate-logic.
license: MIT
---

# workflow-green-repo — Whole-Repository Greening

Bring the repository to a verified-green baseline: every configured health
gate passes from a clean state. This is broad, authorized cleanup — the one
place where fixing unrelated pre-existing failures is the goal, not scope
creep.

> **Green is defined by a fresh from-scratch run of every gate, not by the
> failures you happened to see.** Enumerate first, externalize the worklist,
> fix root causes in batches, and re-run until zero.

## When NOT to use this

- The user asked to finish one plan or feature → use `complete-everything`.
- The change is one searchable pattern across files → use `burndown-full`.
- No explicit authorization to touch pre-existing debt → confirm scope first;
  do not silently rewrite unrelated code.

## Phase 0 — Confirm authorization and discover gates

1. Confirm the user wants the **whole repo** green, including debt that predates
   their work. If the surface is narrower, route to `complete-everything`.
2. Discover the real gate commands — never assume them. Read `package.json`
   scripts, `Makefile`, `justfile`, CI workflows (`.github/workflows/*`),
   `AGENTS.md`, `CLAUDE.md`, and README. Identify the exact commands for:
   typecheck, lint/format, unit/integration tests, e2e (if any), build.
3. Note the required scope for each gate (whole repo vs. per-package in a
   monorepo) and any environment prerequisites (services, env vars, fixtures).
4. Capture the **baseline**: run each gate once and record the failing output.
   This is the worklist source, and it separates real regressions from flakes.

## Phase 1 — Enumerate the full failure worklist

Write `.cursor/green-repo-state.md` as the durable source of truth:

```md
# Green Repo: <repo/package scope>
Gates: typecheck=`...` lint=`...` test=`...` e2e=`...|none` build=`...`
Baseline captured: <date>

## Failures
- [ ] typecheck: <file:line> — <error summary>
- [ ] lint: <rule> — <file(s)>
- [ ] test: <suite/case> — <assertion / error>
- [ ] build: <step> — <error>

## Flaky / environment-dependent (quarantine, do not fake-fix)
- [ ] <case> — <why it is nondeterministic>

## Discovered while fixing (append, then fix)
- (none yet)

## Intentional exceptions (justify each — needs human sign-off)
- (none yet)

## Evidence
- <gate>: <command> → <result>
```

State the totals: "N failing gates across M areas. Driving all to green."
Mirror the worklist into the native task list for UI visibility; the state
file wins after context compaction.

## Phase 2 — Fix root causes in batches

Work the list in small batches (one gate area or 5–10 related failures):

1. Read the failing code and its intent before editing. Understand why it
   fails — do not pattern-match a silence.
2. Fix the **root cause**. Forbidden: deleting/`.skip`/`.only`-ing a test,
   narrowing an assertion so it cannot fail, `@ts-ignore` / `eslint-disable` /
   `any` to hide a real type error, broad `try/catch` that swallows, or
   blanket snapshot updates that mask regressions.
3. A snapshot or golden file may be updated only when the output change is
   correct and intended — state why.
4. Tick the item in the state file immediately per batch.
5. Append any newly surfaced failure to **Discovered while fixing** and close
   it in this run.
6. If a failure is genuinely flaky or needs a real environment you lack, move
   it to the quarantine/exception section with a precise reason — never fake a
   pass. Real environment blockers are the only stop condition.

Do not pause between batches to ask "continue?" — keep going until the
worklist is empty. Re-read the state file instead of trusting memory.

## Phase 3 — Prove green from scratch

Do not report green until every configured gate passes in a fresh run:

1. Typecheck (whole configured scope) → clean.
2. Lint/format → clean.
3. Unit/integration tests → all pass; quarantined items explicitly listed.
4. E2E (if configured) → pass.
5. Build → succeeds.
6. State file: zero unchecked failures outside justified exceptions.
7. If the repo has CI, note whether the same gates run there and whether any
   are environment-specific (so local green predicts CI green).

Any new failure or regression → add to the worklist and loop back to Phase 2.
For approved-plan or wide-change contexts, invoke `completion-judge` before the
final claim.

## Phase 4 — Report

```md
## Green Repo — report
Scope: <repo/packages>
### Result: GREEN | GREEN WITH QUARANTINE | BLOCKED
### Gates
- typecheck: `<cmd>` → clean
- lint: `<cmd>` → clean
- tests: `<cmd>` → <n> passed
- build: `<cmd>` → ok
### Fixed
- <count> failures across <areas>
### Quarantined / exceptions (each justified)
- <case> — <reason, tracking recommendation>
### Environment blockers (real human/infra gates only)
- none | <blocker + one precise ask>
```

Leave `.cursor/green-repo-state.md` in place as the audit trail unless asked to
remove it. Suggest committing mechanical fixes separately from behavioral ones
if that aids review.

## Related

- `complete-everything` — close one plan's connected scope (not the whole repo)
- `burndown-full` — one searchable pattern to 100% coverage
- `audit-gate-logic` — whether the green baseline / ratchet can be gamed
- `verification-before-completion` — evidence levels this skill proves
- `completion-judge` — independent verdict before a green claim
- `debug-error` — root-cause a single stubborn failure
