---
description: "OWASP Top 10 + Supabase security audit + hardening plan — no fixes until approved"
argument-hint: "[path or scope]"
---

# Security Audit Plan

Run the **`plan-security-audit`** skill: audit against the OWASP Top 10 plus
Supabase-specific risks (auth, RLS, secrets, injection), then produce a
hardening plan. **Audit and plan only — change no code until the plan is
approved.**

Emit findings ranked by severity with concrete `file:line` locations and a
phased hardening checklist. After approval, execute with `audit-security`,
`plan-rls-audit`, and `backend-patterns`.

The full playbook lives in the **`plan-security-audit`** skill.
