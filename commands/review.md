# Code Review

## Purpose
Run a thorough review of current changes — linting, types, logic, security, and patterns — before merging or sharing.

## Process

### 1. Scope the Review
```bash
git diff --stat          # Files changed
git diff                 # Full diff
git diff main...HEAD     # All changes vs main
```

### 2. Automated Checks (Run in Order)
```bash
npx tsc --noEmit         # Type errors first
npm run lint             # ESLint issues
npm run test             # Unit/integration tests
npm run build            # Full build check
```

Fix all errors before proceeding.

### 3. Agent Review Pass
Use **Review → Find Issues** in the Cursor agent UI to run a dedicated review pass. The agent analyzes diffs line-by-line and flags potential problems.

For all local changes: open Source Control tab → **Agent Review** to compare against main branch.

### 4. Manual Review Checklist

**Logic & Correctness**
- [ ] Does the code do what the task requires?
- [ ] Edge cases handled (null, empty, large input, concurrent calls)?
- [ ] Error paths tested and handled gracefully?
- [ ] No silent failures (unhandled promises, swallowed exceptions)?

**Security**
- [ ] All inputs validated with Zod server-side?
- [ ] No secrets, tokens, or PII in logs or responses?
- [ ] Auth checks present in every Server Action and Route Handler?
- [ ] RLS policies cover new tables?
- [ ] No SQL string concatenation (parameterized queries only)?

**Types & Patterns**
- [ ] No `any` types introduced?
- [ ] Matches existing code patterns and naming conventions?
- [ ] No duplicate logic (reuses existing hooks/utils)?
- [ ] No files >300 lines (split if needed)?

**Performance**
- [ ] No N+1 queries (use `include` / joins)?
- [ ] Indexes on new frequently-queried columns?
- [ ] `useCallback`/`useMemo` where needed for stable references?
- [ ] No unnecessary re-renders from unstable props?

**Accessibility**
- [ ] Inputs have labels?
- [ ] Interactive elements are keyboard accessible?
- [ ] `aria-live` for dynamic content?

### 5. Summarize
Output a summary:
- What changed and why
- Issues found and fixed
- Anything flagged for follow-up
- Confidence level (ready to merge / needs work / needs discussion)
