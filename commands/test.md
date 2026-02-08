# Test & Verify

## Purpose
Run comprehensive tests, verify functionality, and validate implementation quality before committing.

## Process

### 1. Identify What to Test
- Check `git diff --stat` for changed files
- Map changes to test files
- Identify integration points affected

### 2. Run Test Suite

**Priority Order:**
```bash
# 1. Type check (catch type errors first)
npx tsc --noEmit

# 2. Lint (catch code quality issues)
npm run lint

# 3. Unit tests (fast feedback)
npx vitest run

# 4. Integration tests (if applicable)
npx vitest run --config vitest.integration.config.ts

# 5. E2E tests (if applicable)
npx playwright test
```

### 3. Manual Verification

**Browser Testing (Chrome DevTools MCP):**
1. Navigate to affected pages
2. Check console for errors/warnings
3. Test user interactions
4. Verify network requests succeed
5. Test responsive behavior
6. Screenshot critical states

**Data Verification (Supabase MCP):**
1. Query affected tables
2. Verify data integrity
3. Test RLS policies
4. Check foreign key relationships

### 4. Coverage Check

```bash
# Generate coverage report
npx vitest run --coverage

# Check specific files
npx vitest run path/to/test.test.ts
```

**Coverage Targets:**
| Type | Target |
|------|--------|
| Statements | > 80% |
| Branches | > 75% |
| Functions | > 80% |
| Lines | > 80% |

### 5. Fix Issues

**Common Test Failures:**
| Issue | Fix |
|-------|-----|
| Type mismatch | Update types or mock data |
| Missing mock | Add mock for external dependency |
| Async timeout | Increase timeout or fix async flow |
| Snapshot diff | Update snapshot if change is intentional |
| Flaky test | Add proper waits, fix race conditions |

### 6. Re-run & Confirm

```bash
# Full suite
npm run test

# Specific changed tests
npx vitest run --changed
```

## Checklist
- [ ] Type check passes
- [ ] Lint passes
- [ ] All unit tests pass
- [ ] Integration tests pass (if applicable)
- [ ] E2E tests pass (if applicable)
- [ ] No console errors in browser
- [ ] Data integrity verified
- [ ] Coverage targets met
- [ ] No flaky tests introduced
