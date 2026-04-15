---
name: debug-error
description: >
  Systematic debugging workflow for errors and bugs. Use when debugging errors,
  investigating bugs, troubleshooting issues, or when something isn't working as expected.
  Integrates Sentry MCP for production error context, Firecrawl for researching fix patterns,
  and Sequential Thinking for complex multi-step diagnosis.
---

# Debug Error Skill

Systematic approach to debugging errors and unexpected behavior. Works with any project.

## MANDATORY: Pre-Debug Checks

**BEFORE debugging, you MUST:**

### 1. Read Relevant Documentation
```
README.md                              (project overview)
src/[domain]/@_[domain]-README.md      (domain-specific behavior)
docs/                                  (system documentation)
```

### 2. Check for Sentry Context (if production error)

If the error is from production and Sentry is configured, fetch the full context:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "naturalLanguageQuery": "<error message or description>",
  "projectSlugOrId": "<PROJECT_SLUG>",
  "regionUrl": "<REGION_URL>",
  "limit": 5
})
```

Then get details for the matching issue:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "get_sentry_resource", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "resourceType": "issue",
  "resourceId": "<ISSUE_ID>"
})
```

Extract: stacktrace, breadcrumbs, tags (browser, OS, URL, release), event frequency.

### 3. Check Database State (if data-related)

If data is involved, verify expectations against reality using Supabase MCP or direct queries.

### 4. Verification Statement (REQUIRED)

Before diving into debug, state:
```
"Pre-debug check:
- README/docs read: [list]
- Sentry context: [YES with details / NO — not production / not configured]
- Database state verified: [YES/NO — findings]
- Backend API checked: [YES/NO — status]
- Error scope identified: [FE only / BE only / Integration / Data]"
```

---

## Debug Process

```
1. Reproduce → 2. Isolate → 3. Research → 4. Identify → 5. Fix → 6. Verify → 7. Prevent
```

---

## Phase 1: Reproduce

### Gather Information

```markdown
Error Report:
- What happened: [description]
- Expected behavior: [what should happen]
- Steps to reproduce:
  1. [step]
  2. [step]
- Environment: [browser/OS/Node version]
- Error message: [exact message]
- Stack trace: [if available]
- First seen: [when — correlate with deploys]
```

### Questions to Determine Scope
- Can you reproduce it consistently?
- When did it start happening? (check `git log` for recent changes)
- Does it happen for all users or specific ones? (check Sentry tag distribution)
- Is it environment-specific? (dev vs staging vs production)

---

## Phase 2: Isolate

### Narrow Down the Problem

```
Works in:          Fails in:
├─ Production?     ├─ Production?
├─ Staging?        ├─ Staging?
├─ Local?          ├─ Local?
├─ All browsers?   ├─ Specific browser?
├─ All users?      ├─ Specific user?
└─ All data?       └─ Specific data?
```

### Trace the Data Flow

For data-related bugs, trace the full pipeline:
```
User Action → Frontend Handler → API Call → Backend Controller → Database → Response → State Update → Render
```

Identify where the data goes wrong by checking each boundary.

### Binary Search (when completely lost)

1. Comment out half the code
2. Does error still occur?
   - Yes: Bug is in remaining code
   - No: Bug is in commented code
3. Repeat until isolated

---

## Phase 3: Research (NEW — research the error pattern before fixing)

For non-trivial errors, research the correct fix before implementing:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<framework> <exact error message> fix best practice",
  "limit": 5,
  "sources": [{ "type": "web" }]
})
```

Then scrape the most relevant result:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "<best-result-url>",
  "formats": ["markdown"],
  "onlyMainContent": true
})
```

Also check official docs via Context7 if the error relates to a library:

```json
CallMcpTool(server: "context7", toolName: "resolve-library-id", arguments: {
  "libraryName": "<library>",
  "query": "<error description>"
})
```

**Trust hierarchy**: Official docs > maintainer posts > engineering blogs > Stack Overflow (current year, high votes).

---

## Phase 4: Identify Root Cause

### Common Error Types

| Error | Likely Cause | First Check |
|-------|--------------|-------------|
| `TypeError: Cannot read property 'x' of undefined` | Null/undefined access | Where does the value come from? Fix the producer. |
| `ReferenceError: x is not defined` | Variable not declared | Check imports, scope, circular dependencies |
| `SyntaxError` | Invalid code | Check syntax, missing brackets, JSON parsing |
| `Network Error` | API/connectivity | Check endpoint, CORS, auth, network tab |
| `CORS Error` | Cross-origin blocked | Check server CORS config, proxy setup |
| `401 Unauthorized` | Auth issue | Check token expiry, refresh logic, cookie settings |
| `404 Not Found` | Wrong URL/missing resource | Check route definition, dynamic params, API path |
| `500 Internal Server Error` | Server-side bug | Check server logs, not frontend code |
| `Unhandled Promise Rejection` | Missing await or catch | Find the unhandled async chain |
| `Hydration mismatch` | Server/client render differs | Check for browser-only APIs in SSR, dynamic content |

### Root Cause Formulation

Before writing any fix, state:
1. **What happened**: The specific runtime state that caused the error
2. **Why it happened**: The upstream reason that state was possible
3. **Where to fix it**: The correct layer — usually NOT the crash site

---

## Phase 5: Fix

### Before Fixing

- [ ] Understand WHY it's broken, not just WHERE
- [ ] Consider if this fix could break something else
- [ ] Check if other callers of the affected function exist
- [ ] Verify the fix matches what research recommends

### Anti-Pattern Checklist

Do NOT apply these as the sole fix:
- Adding `?.` to suppress a TypeError → fix why the value is null
- Wrapping in try/catch and swallowing → fix the underlying error
- Adding `?? []` fallback → handle loading/error states explicitly
- Adding `if` guards at the consumer → fix the producer

### Fix Principles

1. Fix at the root cause layer, not the crash site (unless they're the same)
2. Make invalid state unrepresentable
3. Follow existing project conventions
4. If the fix touches a shared function, verify all callers

---

## Phase 6: Verify

### Test the Fix

- [ ] Original bug no longer occurs
- [ ] Related functionality still works
- [ ] Edge cases handled
- [ ] Tests pass (if they exist)

### Regression Check

```bash
# Run tests
npm test
# Or framework-specific
pytest
cargo test
go test ./...
```

---

## Phase 7: Prevent

### Add Monitoring

If the bug could recur in a different form, add monitoring:
- Custom Sentry context for the affected code path
- Breadcrumbs for key user actions
- Structured logging for data flow checkpoints

### Document Non-Obvious Fixes

If the bug was caused by a non-obvious interaction, add a comment explaining the constraint:
```typescript
// Profile can be null for users who haven't completed onboarding.
// The API returns null (not 404) in this case. See: ISSUE-123.
```

---

## Debug Checklist

```markdown
## Bug Investigation: [Title]

**Pre-Debug:**
- [ ] Docs/README read
- [ ] Sentry context fetched (if applicable)
- [ ] Database state checked (if data-related)
- [ ] Error scope identified

**Investigation:**
- [ ] Can reproduce locally (or have Sentry reproduction)
- [ ] Isolated to specific component/function/layer
- [ ] Research completed (Firecrawl/Context7)
- [ ] Root cause identified and stated

**Fix:**
- [ ] Fix addresses root cause (not symptoms)
- [ ] No anti-patterns used as sole fix
- [ ] Side effects checked (other callers)
- [ ] Tests pass

**Prevention:**
- [ ] Monitoring added (if applicable)
- [ ] Documentation updated (if non-obvious)
```

---

## Quick Debug Commands

```bash
# Check recent changes to a file
git log --oneline -20 -- path/to/file.ts

# Find when a bug was introduced
git bisect start
git bisect bad HEAD
git bisect good <known-good-commit>

# Check what changed between two commits
git diff <commit1>..<commit2> -- path/to/file.ts

# Search for all usages of a function
rg "functionName" --type ts
```
