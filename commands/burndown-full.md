# Burndown Full

Drive a partially-executed plan to **100% coverage** across the entire codebase. Use this when a refactor / migration / rename / rule-application was planned and started but stopped before it was actually complete everywhere.

Follow the **burndown-full skill** end to end. Do not improvise a shortcut version of it. In brief:

1. **Recover the change** from the plan + `git diff`/`git log`, and express it as a searchable **MATCH** pattern (still-needs-changing) and **DONE** pattern (already-changed). If it can't be made searchable, stop and ask. Discover the repo's typecheck/lint/test/build commands.
2. **Enumerate the full worklist** with a repo-wide `rg` for MATCH — the whole repo, not the plan's file list. Hunt the usual misses: barrels, re-exports, aliased/namespace imports, tests, stories, snapshots, fixtures, configs, type defs, docs. Write every occurrence to `.cursor/burndown-state.md` and state the total count out loud (vs. how many the plan named).
3. **Execute in batches of 5–10 files**, ticking each off in `.cursor/burndown-state.md` immediately per batch. Append any newly discovered occurrences. Do **not** pause to ask "continue?" — keep going until the worklist is empty. Re-read the state file instead of trusting memory if context gets long.
4. **Prove completeness:** re-run the MATCH search from scratch (expect zero hits), sweep for orphans, then whole-project typecheck + lint + test + build. Any new hit or failure → add to the worklist and loop back to step 3.
5. **Report** coverage (call out files the plan missed), verification results, intentional exceptions, and any genuine ambiguities needing a human.

**Done is defined by verification, not by effort:** a from-scratch search for the old pattern returning zero and the project checking clean — never "I edited the planned files."

The plan is a hypothesis about scope, never its limit. The repo is bigger than the plan and bigger than your context window; the state file is your memory and the fresh grep is your source of truth.

The full playbook lives in the **`burndown-full`** skill at `~/.cursor/skills/burndown-full/SKILL.md` (Cursor) or `~/.claude/skills/burndown-full/SKILL.md` (Claude Code).

Related: `composer-2.5-execution` rule for approved-plan execution, `plan-*` skills for audit-only burndowns before changes.
