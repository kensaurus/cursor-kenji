# Output Templates

## Stack fingerprint

```markdown
- DB: Supabase / Postgres / other
- Auth: …
- Hosting: …
- Client: web / RN / both
```

## Finding inventory checklist

| Area | RLS | Secrets | Auth | Injection | Deps | Headers | Audited |

## Burndown

| Area | Finding | OWASP | Evidence (path:line/config/dep@ver) | Severity | Effort | Risk-of-fix | Remediation |

Severity: Critical / High / Med / Low  
Critical = RLS-off, service_role exposed, auth bypass, data exposure

Quantify: e.g. "3 tables without RLS, 1 service_role in bundle, 5 high CVE deps"

## Phased hardening plan

1. **Critical** — RLS-off, exposed secrets, auth bypass
2. **High** — injection, broken access control, CVE deps
3. **Med/Low** — headers, logging, hardening

Per finding: remediation + "what must keep working"

## Secrets-to-rotate list (locations only — never values)

| Location | Type | Notes |
|----------|------|-------|
