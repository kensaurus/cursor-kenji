---
description: "Input-validation & trust-boundary audit — plan only, no hardening until approved"
argument-hint: "[path or scope]"
---

# Input Validation Plan

Run the **`plan-input-validation`** skill: audit every trust boundary
(forms/API, rendered content, webhooks, uploads) for unvalidated input, then
produce a hardening plan. **Audit and plan only — add no validation until the
plan is approved.**

Emit findings ranked by severity with concrete `file:line` locations and a
phased hardening checklist. After approval, execute with `backend-patterns` and
`backend-error-handling`.

The full playbook lives in the **`plan-input-validation`** skill.
