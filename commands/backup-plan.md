---
description: "Backup and disaster-recovery capability audit — plan only, no infra changes until approved"
argument-hint: "[path or scope]"
---

# Backup & DR Plan

Run the **`plan-backup-dr`** skill: verify that a restore has actually been
proven, quantify RPO/RTO per store, and emit a phased disaster-recovery plan.
**Audit and plan only — toggle no PITR, lifecycle, or prod restore until
approved.**

Destructive-op gates (unguarded DELETE/DROP) stay on `plan-data-integrity`.

The full playbook lives in the **`plan-backup-dr`** skill.
