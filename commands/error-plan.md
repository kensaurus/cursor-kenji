---
description: "Error-handling & observability audit (Sentry + Langfuse) — plan only, no fixes until approved"
argument-hint: "[path or scope]"
---

# Error Handling Plan

Run the **`plan-error-handling`** skill: audit for silent failures, empty catch
blocks, and observability gaps across Sentry and Langfuse, then produce a
remediation plan. **Audit and plan only — change no code until the plan is
approved.**

Emit findings ranked by severity with concrete `file:line` locations and a
phased checklist. After approval, execute with `backend-error-handling`,
`backend-observability`, and `audit-langfuse-llm`.

The full playbook lives in the **`plan-error-handling`** skill.
