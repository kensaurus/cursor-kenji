---
description: "Find dead code with a configured Knip baseline, then delete it by category behind a ratchet"
argument-hint: "[optional path, workspace, or 'apply' to execute an already-approved plan]"
---

# Dead Code

Two skills, one loop. Default to the audit unless an approved
`plan-dead-code.md` already exists.

1. **`plan-dead-code`** — author `knip.json` first, resolve configuration
   hints, baseline both `--production` and default runs, then count the
   surfaces Knip cannot see (unused locals, duplication, debug residue,
   suppression debt, orphan assets, env drift, dead schema). Emits a
   keep/kill list and a ratchet baseline. **Deletes nothing.**

2. **`housekeep-dead-code`** — delete per the approved list, one category
   per commit with typecheck and tests between, cascade unexport →
   unused-locals → re-run, then install the `--max-issues` ratchet and
   wire it into the single aggregator gate.

On a first run most findings are misconfiguration, not dead code — never
`--fix` before the config settles, and never `ignore` a finding to shrink
a number.

Duplication fixes stay on `workflow-refactor`. `DROP` migrations stay on
`db-migrator` with safety judgment from `plan-data-integrity`. README,
build artifacts, and dependency bumps stay on `workflow-housekeep`.

The full playbooks live in the **`plan-dead-code`** and
**`housekeep-dead-code`** skills.
