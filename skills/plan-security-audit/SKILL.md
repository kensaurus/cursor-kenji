---
name: plan-security-audit
description: >
  OWASP Top 10 security audit with Supabase-first methodology — RLS pass, bundle/secret scan,
  auth-path tracing, dependency CVEs. Plan only, no patches or destructive testing. Never
  paste secret values — location + rotation flag only. Research-backed: tables without RLS
  and service_role in client bundle as top critical classes. Use when asked to "security
  audit plan", "OWASP audit", "RLS audit", "Supabase security review", "hardening plan",
  "secrets scan plan", "plan security fixes", or "security burndown".
license: MIT
---

# Security Audit + Hardening Plan

**Role:** Senior application security engineer.

**Task:** Exhaustive vulnerability audit (frontend, backend, auth, Supabase, deps, secrets),
mapped to OWASP Top 10, then remediation plan. **Audit & plan only — no code changes, no
destructive testing.**

## vs neighbors

| Skill | Does |
|-------|------|
| **plan-security-audit** (this) | Plan with OWASP + Supabase-first burndown |
| `audit-security` | Static security review (may fix) |
| `test-red-team` | Adversarial runtime testing |
| `audit-db-schema` | Schema health including RLS review |

**Loop:** see `docs/PLAN-LOOPS.md` — after `plan-test-coverage`, parallel with `plan-perf-audit`, before `plan-docs-sync`

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

## Phase 2 — RLS-first (Supabase)

Enumerate every `public` table:

- RLS enabled?
- Policies scope rows correctly?
- `WITH CHECK` on writes?
- Realtime respects SELECT policies?

**#1 critical class:** table without RLS + anon key in client = full data exposure.

Detail: `references/owasp-supabase-scope.md`

---

## Phase 3 — Bundle/secret scan

Inspect client bundle + source for:

- `service_role` key (Critical — full RLS bypass)
- Hardcoded API keys, DSNs
- `.env` committed / not gitignored
- Secrets in git history → **rotate** (history is forever)

Report: `file:line` + type only — **never the value**.

---

## Phase 4–6 — Auth, deps, OWASP

- Every protected route/endpoint → server-side enforcement?
- `npm audit`, lockfile versions vs CVE databases
- XSS, SQLi, SSRF, headers/CSP, rate limits

Map each finding to OWASP category.

---

## Burndown + hardening plan

Template: `references/output-templates.md`

Phases: Critical → High → Med/Low. Each remediation + "what must keep working".

Re-scan proposed after fixes (second pass).

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
