---
description: "Drive the whole repository to a verified-green baseline — typecheck, lint, tests, build — with authorized fixing of pre-existing debt"
argument-hint: "[optional package/scope]"
---

# Green Repo

Drive the **entire repository** to a verified-green baseline: typecheck, lint,
tests, and build all passing from a clean run. Use this only when fixing
pre-existing debt is explicitly authorized — for a single plan use
`/complete-everything`, and for one searchable pattern use `/burndown-full`.

Follow the **`workflow-green-repo`** skill end to end. In brief:

1. **Confirm scope and discover gates** — whole repo vs. a package. Read
   `package.json`, `Makefile`, CI workflows, and `AGENTS.md`/`CLAUDE.md` for
   the real typecheck/lint/test/e2e/build commands. Capture the baseline.
2. **Enumerate every failure** into `.cursor/green-repo-state.md`, separating
   real failures from flaky/environment-dependent ones. State the totals.
3. **Fix root causes in batches**, ticking each immediately. Never skip,
   `.only`, `@ts-ignore`, or blanket-update snapshots to force green. Append
   newly surfaced failures and fix them in this run.
4. **Prove green from scratch** — re-run every gate clean; zero unchecked
   failures outside justified, human-signed-off exceptions.
5. **Report** the result, fixed count, quarantined items, and any real
   environment blockers.

**Green is defined by a fresh from-scratch run of every gate, not by the
failures you happened to notice.**

The full playbook lives in the **`workflow-green-repo`** skill.

Related: `complete-everything` (one plan's connected scope), `burndown-full`
(one searchable pattern), `verification-before-completion` (evidence levels),
`completion-judge` (independent green verdict).
