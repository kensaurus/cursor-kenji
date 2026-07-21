---
description: "LLM cost guardrails & quota-abuse audit — plan only, no limits added until approved"
argument-hint: "[path or scope]"
---

# LLM Cost Guardrails Plan

Run the **`plan-llm-cost-guardrails`** skill: audit an LLM-powered app for
runaway-cost and quota-abuse risk (unbounded loops, missing per-user limits,
no budget caps), then produce a guardrail plan. **Audit and plan only — add no
limits until the plan is approved.**

Emit findings ranked by severity with concrete `file:line` locations and a
phased checklist. After approval, execute with `backend-patterns` and
`audit-langfuse-llm`.

The full playbook lives in the **`plan-llm-cost-guardrails`** skill.
