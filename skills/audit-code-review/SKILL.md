---
name: audit-code-review
description: >
  Review code for quality, security, and maintainability following best practices.
  Use when reviewing pull requests, examining code changes, auditing code quality,
  or when the user asks for a code review. Integrates research via Firecrawl
  to verify patterns against current best practices, and Sentry MCP to check
  if the code change relates to production errors.
license: MIT
---

# Code Review Skill

full code review following industry best practices. Research-aware.

## MANDATORY: Pre-Review Checks

**BEFORE reviewing code, you MUST:**

### 1. Read Relevant Documentation
```
README.md (project conventions)
src/[domain]/@_[domain]-README.md (domain-specific patterns)
CONTRIBUTING.md (code standards)
```

### 2. Understand the Full Change

If reviewing a PR or commit:
```bash
git log --oneline -10 # recent context
git diff <base>..HEAD --stat # files changed
git diff <base>..HEAD # full diff
```

If reviewing a specific file, read the FULL file for context — not just the changed lines.

### 3. Check for Duplicate Implementations

Use `Grep` and `SemanticSearch` to verify:
- Does this code duplicate existing functionality?
- Is there an existing component/service that should have been extended?
- Does this follow established patterns in the codebase?

### 4. Check Production Impact (Sentry)

If the change touches error-prone code, check if related Sentry issues exist:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
 "organizationSlug": "<ORG_SLUG>",
 "naturalLanguageQuery": "issues related to <component or function being changed>",
 "projectSlugOrId": "<PROJECT_SLUG>",
 "regionUrl": "<REGION_URL>",
 "limit": 10
})
```

This reveals: does the code being changed have known production issues? Does this change fix or risk introducing them?

### 5. Research Current Best Practices (for non-trivial patterns)

If the code uses a pattern you want to verify:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
 "query": "<framework> <pattern> best practice <current year>",
 "limit": 5,
 "sources": [{ "type": "web" }]
})
```

---

## Review Process

### Phase 1: High-Level Assessment

Before line-by-line review:
- What is the purpose of this change?
- Does the approach make sense architecturally?
- Are there simpler alternatives?
- Does this introduce new dependencies? Are they justified?

### Phase 2: Detailed Review Checklist

#### Correctness
- [ ] Logic is correct for all expected inputs
- [ ] Edge cases handled (null, empty, overflow, concurrent access)
- [ ] No obvious bugs (off-by-one, wrong operator, missing await)
- [ ] Error handling is full and appropriate
- [ ] Async code handles race conditions and cleanup (AbortController, etc.)

#### Security
- [ ] No SQL injection vectors (raw queries with user input)
- [ ] No XSS vulnerabilities (dangerouslySetInnerHTML, innerHTML)
- [ ] No hardcoded secrets or credentials
- [ ] Input validation present on all user-facing endpoints
- [ ] Auth/authz properly checked (not just at UI level)
- [ ] No sensitive data in logs or error messages

#### Performance
- [ ] No N+1 queries (batching, eager loading)
- [ ] No unnecessary loops or repeated computations
- [ ] Appropriate data structures (Map vs Object, Set vs Array)
- [ ] No memory leaks (event listeners cleaned up, subscriptions unsubscribed)
- [ ] React: no unnecessary re-renders (memo, useMemo, useCallback where appropriate)
- [ ] Database: queries use indexes, avoid full table scans

#### Readability
- [ ] Clear, descriptive names (functions, variables, types)
- [ ] Functions appropriately sized (single responsibility)
- [ ] Comments explain "why" not "what" (non-obvious constraints only)
- [ ] Consistent with project's existing style

#### Maintainability
- [ ] DRY — no duplicated logic that should be shared
- [ ] Single responsibility — each function/component does one thing
- [ ] No magic numbers or strings (use constants or enums)
- [ ] Types are specific (no `any`, no overly broad unions)
- [ ] Dependencies are appropriate and minimal

#### Testing
- [ ] Tests cover the change (happy path + edge cases)
- [ ] Tests are independent and deterministic
- [ ] No flaky tests introduced (timeouts, race conditions)
- [ ] Test names describe the expected behavior

#### Duplicate Prevention
- [ ] No duplicate components (checked `src/components/`)
- [ ] No duplicate services or hooks
- [ ] Extends rather than duplicates existing patterns
- [ ] Shared logic extracted to utility/hook when used 2+ times

---

## Feedback Format

Use severity levels:

```markdown
### Critical (must fix before merge)
**[File:Line]** — [Description]
Why: [Impact if not fixed]
Fix: [Specific suggestion]

### Suggestion (recommended improvement)
**[File:Line]** — [Description]
Why: [Benefit of the change]
Alternative: [How to improve]

### Nitpick (optional, non-blocking)
**[File:Line]** — [Description]

### Praise (good patterns to reinforce)
**[File:Line]** — [What's done well and why]
```

---

## Blocking vs Non-Blocking

### Blocking (must fix)
- Security vulnerabilities
- Data corruption risks
- Breaking existing functionality
- Missing critical error handling
- Performance regressions (measurable)
- Type safety violations (`any`, unchecked casts)

### Non-Blocking (suggestions)
- Better naming or organization
- Missing tests for edge cases
- Documentation gaps
- Minor performance improvements
- Style preferences not covered by linter

---

## Common Patterns to Flag

### TypeScript/JavaScript
```typescript
// BLOCK: any types
const data: any = response;

// BLOCK: unhandled promises
fetchData(); // missing await or .catch()

// BLOCK: implicit type coercion in conditions
if (value) // when value could be 0 or ""

// SUGGEST: magic strings
if (status === 'active') // use constant or enum
```

### React
```tsx
// BLOCK: missing key in lists
{items.map(item => <Item {...item} />)}

// BLOCK: stale closure in useEffect
useEffect(() => {
 setInterval(() => console.log(count), 1000); // captures stale count
}, []);

// SUGGEST: inline object creation in props
<Component style={{ margin: 10 }} /> // new object each render
```

### Database
```sql
-- BLOCK: SQL injection vector
WHERE name = '${userInput}'

-- SUGGEST: missing index
SELECT * FROM orders WHERE user_id = ? -- is user_id indexed?

-- SUGGEST: SELECT *
SELECT * FROM users -- select only needed columns
```

---

## Review Response Template

```markdown
## Code Review: [PR Title / File]

### Summary
[1-2 sentence overall assessment — is this ready to merge?]

### Critical (blocking)
[List any must-fix issues]

### Suggestions (recommended)
[List recommended improvements]

### Praise
[Highlight good practices — reinforces positive patterns]

### Questions
[Clarifying questions about intent or design decisions]

### Research Notes
[If patterns were verified via Firecrawl/Context7, note what was confirmed]
```

---

## Best Practices for Reviewers

### DO
- Be specific and actionable — link to the exact line
- Explain the "why" behind every suggestion
- Suggest alternatives, not just problems
- Acknowledge good work — it reinforces good habits
- Ask questions when intent is unclear
- Verify patterns against current best practices (research if unsure)

### DON'T
- Block on personal style preferences when a linter exists
- Give vague feedback ("this could be better")
- Ignore the context/constraints the author worked within
- Review only the changed lines — read surrounding code too
- Assume malice — most issues are honest oversights
