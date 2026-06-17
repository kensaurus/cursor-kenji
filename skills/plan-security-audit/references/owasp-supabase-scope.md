# OWASP Scope & Supabase-First Methodology

## OWASP Top 10 mapping

| Area | Checks |
|------|--------|
| A01 Access control | Missing auth, IDOR, client-only checks, admin routes, least privilege |
| A02 Crypto / exposure | TLS, PII in logs/Sentry, sensitive client storage |
| A03 Injection | SQLi, XSS/`dangerouslySetInnerHTML`, command injection |
| A05 Misconfiguration | Headers, CSP, SRI, SSRF, open redirects |
| A06 Vulnerable deps | CVEs, transitive, `npm audit`, SBOM |
| A07 Auth/session | Session handling, rate limits on login/reset, token storage, MFA |

## Supabase-specific (front-loaded — highest yield)

Research pattern: majority of incidents = **tables without RLS** (anon key → full read/write/delete).

| Finding class | Check |
|---------------|-------|
| **No RLS** | Every `public` table — RLS enabled? |
| **service_role in client** | Bundle/source scan — full RLS bypass = Critical |
| **Permissive RLS** | Missing `WITH CHECK`, policies don't scope rows |
| **RPC auth** | Functions callable without auth |
| **Realtime** | Rows beyond SELECT policy |
| **Key usage** | anon vs authenticated; service_role server-side only |

Use Supabase MCP when available: `list_tables`, policies, `get_advisors`, security advisors.

## Methodology (order)

1. **Fingerprint stack** — DB, auth, hosting, integrations
2. **RLS-first pass** — enumerate public tables + policies
3. **Bundle/secret scan** — client bundle + source for keys, service_role
4. **Auth-path trace** — protected routes/endpoints → server-side enforcement?
5. **Dependency scan** — versions vs CVEs, transitive
6. **Map finding → OWASP category**

## Secret scan patterns

```
Grep: "service_role|SUPABASE_SERVICE|sk_live|sk_test|api_key" glob "*.{ts,tsx,js,env*}" -i
Grep: "dangerouslySetInnerHTML" glob "*.{tsx,jsx}"
Grep: "eval\\(|new Function" glob "*.{ts,js}"
```

**Never echo matched secret values in output.**

## Guardrails (research-backed)

- RLS on every public table; test with non-owner user
- `WITH CHECK` on writes; service_role server-side only
- Secrets manager; rotate any ever-committed key
- SCA in CI (Dependabot/Renovate, `npm audit`), SBOM
- CSP/SRI/security headers, rate limiting, audit logging
- Re-scan after remediation
