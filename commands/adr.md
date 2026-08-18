---
description: "Create or maintain Architecture Decision Records as agent-readable decision memory"
argument-hint: "[decision to record]"
---

# Architecture Decision Records

Run the **`docs-adr`** skill: install `docs/adr/` + INDEX.md, write
one-page records with a **Rejected alternatives** section, and wire
agent rules so a future session cannot silently contradict an Accepted
ADR.

Docs-vs-code drift stays on `plan-docs-sync`. Session state stays on
`/handoff`. Present the backfill list before writing ADRs.

The full playbook lives in the **`docs-adr`** skill.
