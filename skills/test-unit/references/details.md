### Avoid Shared Mutable State

```typescript
// Bad — tests can interfere with each other
const users = [createUser()];

// Good — fresh data per test
let users: User[];
beforeEach(() => {
  users = [createUser()];
});
```

---

## Step 6: Database-Aware Tests (Supabase Integration)

If the project uses Supabase, verify test data matches the actual schema:

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "execute_sql", arguments: {
  "project_id": "<PROJECT_ID>",
  "query": "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = '<TABLE_BEING_TESTED>' ORDER BY ordinal_position"
})
```

Use this to ensure:
- Test factories produce data matching actual column types
- Nullable fields are tested with both values and null
- Enum values in tests match actual database enums
- Foreign key relationships are correctly represented

---

## Output: Test Plan Report

After analyzing the codebase and production errors, produce:

```markdown
## Test Plan — [Project Name]

### Environment
- Framework: [detected]
- Coverage tool: [detected]
- Current coverage: [if available]

### Production Error Coverage Gaps
| Error | Source File | Test Exists | Priority |
|-------|-----------|-------------|----------|
| [TypeError: Cannot read...] | [src/utils/parse.ts] | No | HIGH |
| [NetworkError: timeout] | [src/api/client.ts] | Yes (missing edge case) | MEDIUM |

### Recommended Tests (Priority Order)

#### 1. [file path] — [why this file needs tests]
- Test: [description of test case]
- Test: [description of test case]

#### 2. [file path] — [why]
- Test: [description]

### Research Findings Applied
- [Pattern from research]: applied to [which tests]
- [Best practice]: [how it informed the test strategy]
```

---

## Quick Reference

```bash
# Run all tests
npm test                    # or: pnpm test, yarn test
python -m pytest            # Python
go test ./...               # Go

# Run specific file
npx vitest src/utils/formatDate.test.ts
npx jest --testPathPattern formatDate
python -m pytest tests/test_format.py

# Run with coverage
npx vitest --coverage
npx jest --coverage
python -m pytest --cov=src

# Watch mode
npx vitest --watch
npx jest --watch

# Run matching pattern
npx vitest -t "should format"
npx jest -t "should format"
python -m pytest -k "test_format"
```

---

## Checklist

- [ ] Test environment auto-detected (framework, config, patterns)
- [ ] Research completed (Context7 docs, Firecrawl best practices)
- [ ] Production errors checked (Sentry coverage gaps identified)
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Descriptive test names (`should [behavior] when [condition]`)
- [ ] Edge cases covered (null, empty, boundary, error)
- [ ] Mocks reset between tests (`beforeEach` cleanup)
- [ ] No test interdependency (each test runs in isolation)
- [ ] Tests are fast (mock external dependencies)
- [ ] Tests are deterministic (no random, no time-dependent without fakes)
- [ ] Test data uses factories (no hardcoded shared state)
- [ ] Coverage gaps from Sentry addressed
