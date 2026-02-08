---
name: security-audit
description: Web application security audit covering OWASP Top 10, authentication, and data protection. Use when reviewing vulnerabilities, auth flows, API security, or when user mentions "security", "vulnerability", "XSS", "CSRF", "SQL injection", "auth", "RLS", "secrets", or "security headers".
---

# Security Audit Skill

Systematic methodology for auditing web application security covering OWASP Top 10, authentication, authorization, data protection, and secure coding practices.

## When to Use

- Before production deployment
- After adding authentication/authorization
- When handling sensitive data
- Reviewing third-party integrations
- Periodic security reviews
- After dependency updates

## CRITICAL: Check Existing First

**Before ANY security changes, verify:**

1. **Check existing security setup:**
```bash
cat next.config.* | grep -i "headers\|csp\|security"
rg "Content-Security-Policy|X-Frame-Options" --type ts
ls -la middleware.ts src/middleware.ts 2>/dev/null
```

2. **Check existing auth patterns:**
```bash
rg "auth\(|getSession|getUser|supabase.auth" --type ts -l | head -10
cat package.json | grep -i "auth\|supabase\|clerk\|next-auth"
```

3. **Check for existing RLS:**
```bash
ls -la supabase/migrations/*.sql 2>/dev/null | head -10
rg "CREATE POLICY|ENABLE ROW LEVEL" supabase/
```

4. **Check env validation:**
```bash
cat src/env.* lib/env.* 2>/dev/null
rg "createEnv|t3-env" --type ts
```

**Why:** Security requires consistency. Understand existing patterns before modifying.

## Security Audit Framework

### 1. OWASP Top 10 (2021)

| Rank | Vulnerability | Check |
|------|---------------|-------|
| A01 | Broken Access Control | Verify authorization on every endpoint |
| A02 | Cryptographic Failures | Check encryption, hashing, secrets |
| A03 | Injection | Parameterized queries, input validation |
| A04 | Insecure Design | Threat modeling, security requirements |
| A05 | Security Misconfiguration | Headers, defaults, error handling |
| A06 | Vulnerable Components | Dependency audit |
| A07 | Auth Failures | Session management, MFA |
| A08 | Data Integrity Failures | Code signing, CI/CD security |
| A09 | Logging Failures | Audit logs, monitoring |
| A10 | SSRF | URL validation, network segmentation |

### 2. Authentication Security

**Checklist:**
- [ ] Passwords hashed with bcrypt/Argon2 (cost factor ≥10)
- [ ] No plaintext secrets in code or logs
- [ ] Session tokens are secure random (≥128 bits)
- [ ] Tokens stored in httpOnly, secure cookies
- [ ] Implement rate limiting on auth endpoints
- [ ] Account lockout after failed attempts
- [ ] Secure password reset flow
- [ ] MFA available for sensitive operations

**Secure Session Example:**
```typescript
// Cookie configuration
{
  httpOnly: true,      // Prevent XSS access
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 3600000,     // 1 hour
  path: '/',
}
```

### 3. Authorization & Access Control

**Verify:**
- [ ] Authorization checked on every request (not just UI)
- [ ] Row-level security for multi-tenant data
- [ ] Principle of least privilege
- [ ] No IDOR vulnerabilities (direct object references)
- [ ] Admin functions protected
- [ ] API rate limiting implemented

**Supabase RLS Example:**
```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can only read their own posts
CREATE POLICY "Users read own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only update their own posts
CREATE POLICY "Users update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 4. Input Validation & Injection Prevention

**Rules:**
- Validate all input server-side (never trust client)
- Use parameterized queries (never string concatenation)
- Sanitize HTML output (XSS prevention)
- Validate file uploads (type, size, content)

**Safe Patterns:**
```typescript
// Zod validation
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().positive().max(150),
})

// Parameterized query (Prisma)
const user = await prisma.user.findUnique({
  where: { id: userId }  // Safe
})

// NOT: `SELECT * FROM users WHERE id = ${userId}` // SQL injection!

// HTML sanitization
import DOMPurify from 'dompurify'
const safeHTML = DOMPurify.sanitize(userInput)
```

### 5. Security Headers

**Required Headers:**
```typescript
// Next.js next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  }
]
```

### 6. Dependency Security

**Commands:**
```bash
# NPM audit
npm audit
npm audit fix

# Snyk (more comprehensive)
npx snyk test
npx snyk monitor

# Check for outdated packages
npm outdated

# SBOM generation
npx @cyclonedx/cyclonedx-npm --output-file sbom.json
```

**Dependency Rules:**
- Regular audits (weekly minimum)
- Pin versions in production
- Review changelogs before updating
- No packages with known CVEs in production

### 7. Secrets Management

**Never:**
- Commit secrets to git
- Log secrets or tokens
- Expose secrets to client
- Use production secrets in development

**Best Practices:**
```bash
# Use environment variables
DATABASE_URL="postgresql://..."

# Validate with t3-env
import { createEnv } from "@t3-oss/env-nextjs"

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    SECRET_KEY: z.string().min(32),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
})
```

### 8. API Security

**Checklist:**
- [ ] Authentication on all endpoints
- [ ] Rate limiting implemented
- [ ] Input validation on all parameters
- [ ] Proper error handling (no stack traces)
- [ ] CORS configured correctly
- [ ] Request size limits
- [ ] Timeout limits

**Rate Limiting Example:**
```typescript
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
})

// In API route
const { success } = await ratelimit.limit(ip)
if (!success) {
  return new Response("Too many requests", { status: 429 })
}
```

### 9. Data Protection

**Requirements:**
- [ ] Encrypt sensitive data at rest
- [ ] Use TLS 1.3 for data in transit
- [ ] Implement data retention policies
- [ ] PII handling compliant with regulations
- [ ] Backup encryption

**Data Classification:**
| Level | Examples | Protection |
|-------|----------|------------|
| Public | Marketing content | Standard |
| Internal | User emails | Encryption at rest |
| Confidential | Payment data | Strong encryption, access logs |
| Restricted | Auth credentials | HSM, never logged |

### 10. Error Handling

**Secure Error Handling:**
```typescript
// Production: Generic error
if (process.env.NODE_ENV === 'production') {
  return { error: 'An error occurred' }
}

// Never expose:
// - Stack traces
// - Database errors
// - Internal paths
// - Configuration details
```

## Security Audit Report Template

```markdown
# Security Audit Report

## Executive Summary
- **Risk Level**: Critical/High/Medium/Low
- **Vulnerabilities Found**: X
- **Critical Issues**: X

## Findings

### [SEV-1] Critical: [Title]
- **Description**: [Details]
- **Location**: [File/endpoint]
- **Impact**: [What could happen]
- **Remediation**: [How to fix]
- **References**: [CVE, OWASP, etc.]

### [SEV-2] High: [Title]
...

## Checklist Results
- [x] Authentication secure
- [ ] Authorization needs work
- [x] Input validation present
...

## Recommendations
1. [Priority 1 fix]
2. [Priority 2 fix]

## Next Steps
- Schedule remediation
- Re-audit after fixes
```

## Quick Security Wins

- [ ] Enable HTTPS everywhere
- [ ] Add security headers
- [ ] Run `npm audit fix`
- [ ] Enable RLS on all tables
- [ ] Add rate limiting
- [ ] Review .env.example (no real secrets)
- [ ] Add CSRF protection
- [ ] Validate all inputs with Zod
- [ ] Log authentication events
- [ ] Set up alerts for suspicious activity
