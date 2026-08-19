---
description: "Read-only audit of app-layer auth — route×gate matrix, getSession vs getUser, middleware-as-only-gate"
argument-hint: "[app or auth path]"
---

# Auth-Flows Audit

Run the **`audit-auth-flows`** skill: map every protected route to the
gate that actually covers it, grep server-side `getSession()` used as
authorization, and treat middleware-as-the-only-gate as a finding even
after CVE-2025-29927 is patched.

**Read-only — do not patch.** Data-layer RLS stays on `plan-rls-audit`.
OWASP checklist / inline fixes stay on `audit-security`. Live probes
are non-prod only.

The full playbook lives in the **`audit-auth-flows`** skill.
