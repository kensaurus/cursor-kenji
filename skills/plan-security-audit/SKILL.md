---
name: plan-security-audit
description: >
  OWASP Top 10 + Supabase-first hardening burndown. Use when "security audit
  plan", "OWASP audit", "hardening plan", or "security burndown". App-layer
  auth flows → audit-auth-flows. Table RLS → plan-rls-audit. Key rotation →
  plan-secrets-audit. App LLM attacks → audit-llm-security.
license: MIT
---

# Security Audit + Hardening Plan

**Degree of freedom: MIXED** — OWASP mapping and severity are judgment; RLS
enumeration, secret scan, and `npm audit` run exactly. Stay **plan-only**.
No patches or destructive testing.

**Role:** Senior application security engineer.

**Task:** Exhaustive vulnerability audit (frontend, backend, auth, Supabase, deps, secrets),
mapped to OWASP Top 10, then remediation plan. **Audit & plan only — no code changes, no
destructive testing.**

## This skill vs neighbors

| Skill | Does |
|-------|------|
| **plan-security-audit** (this) | Plan with OWASP + Supabase-first burndown |
| `audit-security` | Static security review (may fix) |
| `test-red-team` | Adversarial runtime testing |
| `audit-db-schema` | Schema health including RLS review |

**Loop:** see `docs/PLAN-LOOPS.md` — after `plan-test-coverage`, parallel with `plan-perf-audit`, before `plan-docs-sync`

## How to reason (every plan item)

1. **Propose** — RLS, secret rotation, auth enforcement, dep bump, or header/CSP
2. **Risk** — data exposure, auth bypass, or a leaked key that bypasses RLS
3. **Keep-working** — controls that already enforce server-side
4. **Phase** — Critical → High → Med-Low (do not execute)

## Worked example

> **Propose:** enable RLS on `public.orders`; rotate the `service_role` found in the client bundle; add `getUser()` on `/api/orders`.
> **Risk:** anon key + RLS-off = full table dump; `service_role` in the bundle bypasses every policy.
> **Keep-working:** `/dashboard` layout already calls `getUser()` on the server.
> **Phase:** Critical — RLS + secret rotation first.
> **Report:** `lib/supabase.ts:12` service_role (type only — never the value). Table RLS detail → `plan-rls-audit`.

---

## ⛔ Preservation Contract

Read `references/preservation-contract.md`. Acknowledge in output #1.

**Safety guardrails:**

- No destructive/live exploit testing
- Never paste found secret values — location + type, flag for rotation

---

## References

| File | Contents |
|------|----------|
| `references/owasp-supabase-scope.md` | OWASP map, RLS-first methodology, scans |
| `references/output-templates.md` | Burndown, phased hardening, secrets list |

---

## Phase flow

```
1. Stack fingerprint
2. RLS-first pass (Supabase MCP if available)
3. Bundle/secret scan (no value echo)
4. Auth-path trace
5. Dependency CVE scan
6. OWASP remainder (injection, headers, misconfig)
7. Burndown + phased hardening plan
8. Guardrails + research citations
```

Sentry MCP: security-related production errors. Firecrawl: current OWASP + Supabase patterns.

---

## Phase 2 — RLS-first (Supabase)  [LOW freedom — run exactly]

Enumerate every `public` table:

- RLS enabled?
- Policies scope rows correctly?
- `WITH CHECK` on writes?
- Realtime respects SELECT policies?

**#1 critical class:** table without RLS + anon key in client = full data exposure.

Detail: `references/owasp-supabase-scope.md`

---

## Phase 3 — Bundle/secret scan  [LOW freedom — run exactly]

Inspect client bundle + source for:

- `service_role` key (Critical — full RLS bypass)
- Hardcoded API keys, DSNs
- `.env` committed / not gitignored
- Secrets in git history → **rotate** (history is forever)

Report: `file:line` + type only — **never the value**.

---

## Phase 4–6 — Auth, deps, OWASP  [HIGH freedom]

- Every protected route/endpoint → server-side enforcement?
- `npm audit`, lockfile versions vs CVE databases
- XSS, SQLi, SSRF, headers/CSP, rate limits

Map each finding to OWASP category.

---

## Burndown + hardening plan  [HIGH freedom — plan only]

Template: `references/output-templates.md`

Phases: Critical → High → Med/Low. Each remediation + "what must keep working".

Re-scan proposed after fixes (second pass).

## Self-critique before the burndown  [LOW freedom — do not skip]

1. **evidenced-not-assumed** — every finding cites file:line or scan output; unconfirmed → `[NEEDS VERIFICATION]`
2. **plan-only** — no patches, no live/destructive exploit testing
3. **severity/phase justified** — RLS-off + anon key and client `service_role` are Critical
4. **right-owner** — table-by-table RLS → `plan-rls-audit`; key rotation → `plan-secrets-audit`; app-layer auth flows → `audit-auth-flows`; LLM attacks → `audit-llm-security`
5. **no-false-safety** — never paste secret values; never fabricate CVEs; confirmed vuln ≠ hardening suggestion

---

## Required output (in order)

1. Preservation-contract acknowledgment
2. Stack fingerprint + scope
3. Per-area finding inventory
4. Burndown table (OWASP + evidence + severity)
5. Hardening + enhancement plan, phased
6. Guardrails/tooling (SCA CI, secrets manager, RLS tests)
7. Research notes + citations
8. Open questions / `[NEEDS VERIFICATION]` + secrets-to-rotate (locations only)

---

## Rules

- Plan only — no patches, no live/destructive testing.
- Every finding cites real evidence. Unconfirmed → `[NEEDS VERIFICATION]`.
- Never paste secret values.
- Never fabricate CVEs or exploits.
- Separate confirmed vulnerability vs hardening recommendation.
