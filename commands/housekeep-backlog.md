---
description: "Inventory parked work into one living BACKLOG.md — regenerate and diff, do not implement"
argument-hint: "[optional path to an existing BACKLOG.md]"
---

# Housekeep Backlog

Run the **`housekeep-backlog`** skill: scan the repo for unfinished
plans, deferred phases, TODO/FIXME markers, skipped tests, and open
audit findings; dedup; write or regenerate `docs/BACKLOG.md` with stable
`BL-` IDs and a new/done/stale diff.

Inventories only. Execution stays on `complete-everything` /
`burndown-full`. Decisions stay on `docs-adr`. Flag debt stays on
`workflow-feature-flag`.

The full playbook lives in the **`housekeep-backlog`** skill.
