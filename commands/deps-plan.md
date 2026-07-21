---
description: "Dependency provenance & slopsquatting audit — plan only, no install until approved"
argument-hint: "[path or scope]"
---

# Dependency Provenance Plan

Run the **`plan-dependency-provenance`** skill: audit dependencies for
hallucinated, slopsquatted, or unvetted packages and supply-chain risk, then
produce a remediation plan. **Audit and plan only — install or remove nothing
until the plan is approved.**

Emit findings ranked by severity with package locations and a phased checklist.
After approval, execute updates with `workflow-housekeep` (dependency phase).

The full playbook lives in the **`plan-dependency-provenance`** skill.
