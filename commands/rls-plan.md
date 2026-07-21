---
description: "Supabase RLS + access-control audit + remediation plan — no SQL until approved"
argument-hint: "[project or scope]"
---

# RLS Audit Plan

Run the **`plan-rls-audit`** skill: audit Supabase/Postgres row-level security
and access control, then produce a remediation plan. **Audit and plan only —
write no SQL and change no policies until the plan is approved.**

Emit findings ranked by severity (tables without RLS, over-permissive policies,
`service_role` exposure) with a phased fix checklist. After approval, execute
with `db-migrator` and `backend-patterns`.

The full playbook lives in the **`plan-rls-audit`** skill.
