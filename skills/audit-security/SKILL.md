---
name: audit-security
description: >
  Audit code for security vulnerabilities and best practices. Use when reviewing security,
  checking for vulnerabilities, auditing auth code, or when the user mentions security concerns.
  Integrates Firecrawl for researching current OWASP guidelines and CVEs,
  Sentry MCP for checking production security-related errors, and automated codebase scanning.
---

# Security Audit Skill

Systematic security review for any web application. Research-driven, using current OWASP guidelines.

## Step 0: Understand the Project

Before auditing, discover the tech stack and attack surface:

1. Read `package.json` / `requirements.txt` / `go.mod` to identify:
   - Auth library (next-auth, passport, supabase-auth, django-auth, etc.)
   - Database ORM (Prisma, Sequelize, SQLAlchemy, etc.)
   - HTTP framework (Express, Fastify, Django, Flask, etc.)
   - Any security-specific packages (helmet, cors, csurf, rate-limit, etc.)

2. Identify the auth pattern:
   - Session-based vs JWT vs OAuth
   - Where tokens are stored (cookies, localStorage, headers)
   - How permissions/roles are enforced

3. Identify the data flow:
   - Where user input enters the system
   - How data is validated and sanitized
   - How data reaches the database

---

## Step 1: Research Current Threats

Fetch current OWASP and security best practices for the detected stack:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<framework> security best practices OWASP <current year>",
  "limit": 5,
  "sources": [{ "type": "web" }]
})
```

Scrape the OWASP Top 10 for the relevant platform:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "https://owasp.org/Top10/",
  "formats": ["markdown"],
  "onlyMainContent": true
})
```

Also check for known CVEs in dependencies:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<package-name> CVE vulnerability <current year>",
  "limit": 5,
  "sources": [{ "type": "web" }]
})
```

---

## Step 2: Check Production Security Errors (Sentry)

If Sentry is configured, check for security-related production errors:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "naturalLanguageQuery": "401 unauthorized OR 403 forbidden OR CORS OR CSP violation in last 30 days",
  "projectSlugOrId": "<PROJECT_SLUG>",
  "regionUrl": "<REGION_URL>",
  "limit": 20
})
```

Patterns that indicate security issues:
- Frequent 401/403 errors → possible auth bypass attempts
- CORS errors from unexpected origins → misconfigured CORS
- CSP violations → potential XSS vectors
- Rate limit errors → possible brute force

---

## Step 3: Automated Code Scan

### Authentication Audit

- [ ] Passwords hashed with bcrypt/argon2/scrypt (not MD5/SHA1/SHA256 for passwords)
- [ ] Session tokens are cryptographically random
- [ ] Sessions expire appropriately (idle timeout + absolute timeout)
- [ ] Password reset tokens are single-use and expire quickly
- [ ] MFA available for sensitive accounts
- [ ] Login rate limiting implemented
- [ ] Account lockout after repeated failed attempts
- [ ] OAuth state parameter validated (CSRF protection for OAuth flows)
- [ ] JWT secret is strong and stored in env vars (not hardcoded)
- [ ] JWT expiry is reasonable (access: 15min, refresh: 7d)

### Authorization Audit

- [ ] Every API endpoint checks permissions (not just authentication)
- [ ] No direct object references without ownership/permission check (IDOR)
- [ ] Role-based access properly enforced at the API layer (not just UI)
- [ ] Principle of least privilege followed
- [ ] Admin functions require elevated auth
- [ ] Row-Level Security (RLS) enabled for multi-tenant databases
- [ ] API keys scoped to minimum required permissions

### Input Validation Audit

- [ ] All user input validated server-side (client validation is UX only)
- [ ] Input sanitized before use in queries, HTML, commands
- [ ] File uploads validated: type (MIME + magic bytes), size, filename
- [ ] JSON/XML parsing has depth/size limits
- [ ] URL parameters decoded and validated
- [ ] No raw SQL concatenation (parameterized queries only)
- [ ] No `eval()`, `Function()`, `innerHTML` with user input
- [ ] No `dangerouslySetInnerHTML` without DOMPurify

### Data Protection Audit

- [ ] Sensitive data encrypted at rest
- [ ] TLS/HTTPS enforced (no HTTP fallback)
- [ ] Secrets not in code, git history, or logs
- [ ] PII handled according to applicable regulations (GDPR, CCPA)
- [ ] Database connections encrypted (SSL)
- [ ] API responses don't leak internal data (stack traces, SQL errors, file paths)
- [ ] Password fields use `type="password"` and `autocomplete="new-password"`

### Security Headers Audit

- [ ] `Strict-Transport-Security` (HSTS) with long max-age
- [ ] `Content-Security-Policy` (CSP) configured (not just `default-src *`)
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY` or `SAMEORIGIN`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` or stricter
- [ ] `Permissions-Policy` restricting unnecessary browser features
- [ ] CORS `Access-Control-Allow-Origin` is NOT `*` for authenticated endpoints
- [ ] Cookies: `HttpOnly`, `Secure`, `SameSite=Strict` (or `Lax`)

### Dependency Audit

```bash
npm audit          # Node.js
pip-audit          # Python
cargo audit        # Rust
govulncheck ./...  # Go
bundle audit       # Ruby
```

- [ ] No known high/critical CVEs
- [ ] Dependencies reasonably up to date
- [ ] Lock file committed (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`)
- [ ] No unnecessary dependencies (smaller surface area)

---

## Step 4: Common Vulnerability Patterns

### SQL Injection

```javascript
// VULNERABLE
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// SAFE — parameterized
const query = 'SELECT * FROM users WHERE id = $1';
db.query(query, [userId]);

// SAFE — ORM
User.findById(userId);
```

### XSS (Cross-Site Scripting)

```jsx
// VULNERABLE
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// SAFE — React escapes by default
<div>{userInput}</div>

// SAFE — sanitize when HTML is genuinely needed
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### IDOR (Insecure Direct Object Reference)

```javascript
// VULNERABLE — no ownership check
app.get('/documents/:id', (req, res) => {
  const doc = db.documents.findById(req.params.id);
  res.json(doc);
});

// SAFE — verify ownership
app.get('/documents/:id', (req, res) => {
  const doc = db.documents.findOne({
    where: { id: req.params.id, userId: req.user.id }
  });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
});
```

### Sensitive Data Exposure

```javascript
// VULNERABLE — leaking sensitive fields
res.json(user); // includes passwordHash, tokens, internal IDs

// SAFE — explicit field selection
const { id, name, email, avatar } = user;
res.json({ id, name, email, avatar });
```

---

## Step 5: Environment and Secrets

### Scan for Hardcoded Secrets

Search the codebase for potential leaked secrets:

```
Grep for: api_key, apiKey, secret, password, token, credentials, private_key
Grep for: sk-, pk-, ghp_, gho_, xox[bpsa]-, AKIA
Grep for: -----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----
```

### Verify .gitignore

```
.env, .env.local, .env.production
*.pem, *.key, *.p12
credentials.json, service-account.json
.sentryclirc (if it contains auth tokens)
```

### Validate Environment Variables

```typescript
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  SENTRY_DSN: z.string().url().optional(),
});

const env = envSchema.parse(process.env);
```

---

## Output: Security Audit Report

```markdown
## Security Audit: [Project Name]

### Tech Stack
- Framework: [name + version]
- Auth: [library + pattern]
- Database: [ORM + provider]
- Security packages: [list]

### Critical Issues (must fix)
| # | Category | Finding | File | Recommendation |
|---|----------|---------|------|----------------|
| 1 | Auth | JWT secret hardcoded | config.ts:12 | Move to env var |

### High Risk (should fix soon)
| # | Category | Finding | File | Recommendation |
|---|----------|---------|------|----------------|

### Medium Risk (improve when possible)
| # | Category | Finding | File | Recommendation |
|---|----------|---------|------|----------------|

### Passed Checks
- [list of security areas that are properly implemented]

### Dependencies
- Critical CVEs: [count] — [details]
- High CVEs: [count]
- Outdated packages: [count]

### Research Sources
- [URL] — [what it confirmed or revealed]
```
