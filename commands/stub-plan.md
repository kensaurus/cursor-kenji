---
description: "Stub / dead-link / fake-component audit + wiring plan — no fixes until approved"
argument-hint: "[path or scope]"
---

# Stub Checker Plan

Run the **`plan-stub-checker`** skill: exhaustively audit for stubs, dead
buttons, unwired handlers, fake components, and dead links, then produce a
wiring plan. **Audit and plan only — wire nothing until the plan is approved.**

Emit findings ranked by severity with concrete `file:line` locations and a
phased wiring checklist. After approval, execute with `debug-fe-be-integration`
and `workflow-fix-and-ship`.

The full playbook lives in the **`plan-stub-checker`** skill.
