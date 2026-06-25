---
name: burndown-full
description: Drive a planned change to 100% coverage across an entire codebase when a prior agent run stopped early. Use whenever a refactor, migration, rename, rule-application, or sweeping edit was planned and partially executed but left incomplete — i.e. the agent "ran out of steam," forgot files, or treated the plan's file list as the full scope. Triggers on phrases like "finish the burndown", "it stopped halfway", "apply this everywhere", "complete the refactor across all files", "make sure nothing was missed", or invoking /burndown-full. Works for any plan and any task, framework-agnostic.
---

# Burndown Full

## What problem this solves

A coding agent is given a plan, generates it, starts executing, and then **stops before the change is actually complete across the codebase**. The user is left with a half-migrated repo. This is not a motivation problem — it is a well-documented set of failure modes in long-horizon LLM agents:

- **Context rot / long-context degradation.** Model reasoning quality drops as the input grows, *even within the advertised window*. Information in the middle of a long context is attended to least reliably ("lost in the middle"). So as execution proceeds, the agent's grip on "what's left to do" erodes.
- **Premature termination.** When tool outputs and history get pruned or summarized to save context, agents lose task-level awareness ("how many items remain, am I near done?") and declare completion early. The fix shown in the research is to keep a *condensed, persistent record of remaining work* visible at all times.
- **Plan-as-boundary error.** A plan is a *hypothesis* about scope produced before the repo was fully explored. The real set of affected files is almost always larger than the plan's list (barrels, tests, stories, configs, re-exports, dynamic usages). Treating the plan's file list as the boundary guarantees an incomplete burndown.

The countermeasures below are drawn from how robust coding agents (Claude Code's TodoWrite, etc.) actually achieve reliable completion: **enumerate before executing, externalize the worklist to a file so it survives context truncation, work in small focused batches, and define "done" by a fresh verification pass rather than by the agent's memory.**

## The core principle

> **The plan is a starting hypothesis about scope, never the limit of scope. Memory is not a source of truth — a fresh repo-wide search is. You are not done when the planned files are edited; you are done when a from-scratch search for the old pattern returns zero, and the whole project type-checks, lints, and tests clean.**

Internalize this loop: **enumerate → batch-execute → persist progress → verify from scratch → if anything remains, loop.** Never exit the loop on a feeling of completion.

---

## Phase 0 — Recover and pin down the change

Reconstruct, in one precise sentence, what the change actually is. Pull from:
- the plan file or prior conversation (if arguments reference a plan/path, read it fully first);
- what's already been applied: `git diff`, `git diff --staged`, `git log --oneline -15`, `git status`.

Then convert the change into a **machine-checkable signature** — the concrete pattern(s) that distinguish "still needs changing" from "already changed." Define both explicitly:

- **MATCH** = the pattern that marks code still needing the change (the *remaining-work* signal).
- **DONE** = the pattern that marks code already migrated (so you never redo or thrash).

Examples of (MATCH → DONE):
- old import path → new import path
- `TWEEN_*` constant names → `SPRING_PHYSICS_*`
- deprecated `<OldButton>` / `useOldHook` → replacement
- old API/prop signature → new signature
- a lint/style rule violation → its corrected form

**If the change cannot be expressed as a searchable pattern (grep / structural / AST), STOP and say so.** Ask the user to make the criterion concrete, or agree on a per-file judgment checklist instead. Proceeding on "vibes" is the exact thing that causes the early stop — verification by search is what makes a full burndown provable. Do not skip this.

Also discover the project's **verification commands** up front (don't assume them):
- Look in `package.json` scripts, `Makefile`, `justfile`, `README`, `AGENTS.md`/`CLAUDE.md`, CI config.
- Identify: typecheck (e.g. `tsc --noEmit`), lint, test, build. Note the exact commands. If none exist, say so — verification will rely on search + build only.

## Phase 1 — Enumerate the FULL worklist before editing anything

Run an exhaustive, repo-wide search for MATCH. **Search the whole repo, not the plan's file list.** Cast wide with ripgrep; include every plausibly relevant extension and location:

```bash
rg -n --hidden \
  -g '!node_modules' -g '!.git' -g '!dist' -g '!build' -g '!.next' -g '!coverage' -g '!*.lock' \
  -e '<MATCH_PATTERN>'
```

Deliberately hunt the categories plans habitually miss:
- barrel / index files and re-exports (`export * from`, `export { X } from`)
- aliased and namespace imports (`import { X as Y }`, `import * as M`)
- string-literal and dynamic usages, template strings, config keys
- tests, snapshots, fixtures, mocks, stories (`*.stories.*`), e2e
- type definitions (`*.d.ts`), generated types
- config files (`*.config.*`, `.env*`, CI yaml), scripts, docs/README
- comments and JSDoc, if the change semantically requires them

If MATCH is multi-form (e.g. a symbol imported several ways), run a query per form and union the results. Don't trust a single grep to capture every flavor.

**Write the result to a durable checklist file: `.cursor/burndown-state.md`.** This file is your working memory; it must survive context truncation. One line per (file + occurrence/role). Format:

```md
# Burndown: <one-sentence change definition>
MATCH: <pattern>
DONE:  <pattern>
Verify: typecheck=`<cmd>` lint=`<cmd>` test=`<cmd>` build=`<cmd>`
Total occurrences found: N across M files
Plan originally named: P files

## Worklist
- [ ] src/components/Button.tsx:42 — direct usage
- [ ] src/index.ts — barrel re-export
- [ ] src/components/Button.stories.tsx — story + snapshot
- [ ] tests/button.test.tsx:17 — assertion references old name
...

## Exceptions (intentionally NOT changed — justify each)
- (none yet)

## Newly discovered during execution (append here, then work them)
- (none yet)
```

**State the totals out loud to the user**: "Found N occurrences across M files; the original plan named only P. I'll burn down all N." Announcing the full count up front commits you to the real scope and makes any later shortfall visible. Also create the equivalent native task list (TodoWrite / Cursor task list) so progress is visible in the UI — but `.cursor/burndown-state.md` is the source of truth because it persists.

## Phase 2 — Execute in small batches, persisting progress every batch

Work the checklist top-to-bottom in **batches of 5–10 files**. Small, focused batches keep each step's context tight and avoid overwhelming the model (which is itself a cause of dropped work). For each batch:

1. Apply the change to those files. Prefer mechanical, pattern-driven edits so coverage is verifiable rather than judgment-based. Keep edits minimal and consistent with DONE.
2. **Immediately** flip those lines `[ ]` → `[x]` in `.cursor/burndown-state.md`. Do the bookkeeping per-batch, never deferred — if context is truncated mid-run, an un-ticked completed item is lost work and a ticked incomplete item is a false "done."
3. Run a fast scoped check on just the touched files if cheap (lint/typecheck the batch). Fix what you broke before moving on.
4. If you discover new occurrences while editing (a usage the grep missed, a follow-on file), **append them to the "Newly discovered" section** and include them in the burndown — do not silently absorb or skip them.

**Do not stop between batches to ask "should I continue?"** Continue automatically until the worklist is exhausted. If you sense context filling up, **re-read `.cursor/burndown-state.md` to recover the remaining list** rather than trusting memory — the file is precisely there so you don't have to remember.

## Phase 3 — Prove completeness (the anti-stop gate)

You may **NOT** report done until every check below passes. This gate is the whole point: completion is defined by verification, not by the agent's sense of having finished.

1. **Fresh from-scratch search.** Re-run the Phase 1 `rg` for MATCH across the entire repo *as if starting over*. Expected: **zero** hits, except items explicitly listed under Exceptions (each justified). Any new hit → add to worklist, return to Phase 2.
2. **Orphan sweep.** Search for things that must move *with* the change: barrel exports, type defs, tests, stories, mocks, docs referencing the old form. A migrated component whose test/story/snapshot still references the old form is **not** done.
3. **Whole-project typecheck** (not just touched files), e.g. `tsc --noEmit`. New errors reveal remaining work.
4. **Lint the repo.** Unused-import / unresolved-import / no-undef errors frequently expose half-finished migrations.
5. **Run the test suite** (or at least the affected projects). Update snapshots only where the change legitimately changes output; never blanket-update to hide regressions.
6. **Build** if there's a build step.
7. **Checklist is clean:** zero `[ ]` lines remain in `.cursor/burndown-state.md`.

If any check surfaces new occurrences or failures, **add them to the checklist and loop back to Phase 2.** Repeat the gate until a fresh search is clean and all configured checks pass. The loop terminates on verified emptiness, not on effort spent.

## Phase 4 — Report and clean up

Produce a concise final report:

- **Change applied:** one sentence.
- **Coverage:** N occurrences across M files completed. **Call out the (M − P) files the original plan missed** — this is the value the burndown added.
- **Verification results:** `rg <MATCH>` → 0 hits; typecheck → clean; lint → clean; tests → pass; build → ok. Show the actual commands and outcomes.
- **Intentional exceptions:** each file left unchanged, with reason.
- **Genuine ambiguities for a human:** anything you could not resolve mechanically. Surface these explicitly — never silently skip an occurrence to reach a clean number.

Leave `.cursor/burndown-state.md` in place (fully ticked) as an audit trail unless the user asks to delete it. Suggest committing the change as one reviewable unit, or splitting mechanical vs. judgment edits into separate commits if that aids review.

---

## Operating principles (keep these in working memory)

- The plan is a hypothesis about scope; the repo is bigger than the plan and bigger than your context window.
- The checklist file is your memory; the fresh grep is your source of truth. When they disagree, the grep wins.
- "I edited the files in the plan" is **not** completion. "A from-scratch search for the old pattern returns zero and the project checks clean" is completion.
- Work in small batches and persist progress every batch, so a truncated context never costs progress.
- Never stop early to ask permission to continue. Only stop for (a) a genuine ambiguity needing a human decision, or (b) a verification failure you cannot resolve — and in both cases, report precisely what's left.
