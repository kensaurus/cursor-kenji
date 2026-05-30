---
name: test-unit
description: >
  Write effective unit tests with best practices for any project. Auto-detects test framework
  (Jest, Vitest, pytest, Go test, etc.), researches current testing patterns via Firecrawl,
  fetches testing library docs via Context7, and uses Sentry MCP to identify production errors
  that lack test coverage. Use when writing tests, creating test cases, improving test coverage,
  increasing confidence before release, or when the user mentions testing.
---

# Unit Testing Skill

Write effective, maintainable unit tests informed by the project's actual framework,
production error data, and current best practices.

---

## Step 0: Auto-Detect Test Environment

Before writing any tests, discover the project's testing setup.

### 0a. Detect Test Framework

Read the dependency manifest (`package.json`, `requirements.txt`, `pyproject.toml`, `go.mod`,
`Cargo.toml`, `build.gradle`, `Gemfile`) and look for:

| Framework | Detection Signal |
|-----------|-----------------|
| **Vitest** | `vitest` in devDependencies, `vitest.config.ts` |
| **Jest** | `jest` in devDependencies, `jest.config.*`, `"jest"` key in `package.json` |
| **Testing Library** | `@testing-library/react`, `@testing-library/vue`, etc. |
| **Playwright** | `@playwright/test` in devDependencies, `playwright.config.ts` |
| **Cypress** | `cypress` in devDependencies, `cypress.config.*` |
| **pytest** | `pytest` in requirements, `conftest.py` files |
| **Go test** | `_test.go` files, `go test` in Makefile |
| **RSpec** | `rspec` in Gemfile, `spec/` directory |
| **JUnit** | `junit` in build.gradle, `src/test/` directory |

### 0b. Discover Existing Test Patterns

```
Glob: **/*.test.{ts,tsx,js,jsx}     → JS/TS test files
Glob: **/*.spec.{ts,tsx,js,jsx}     → JS/TS spec files
Glob: **/test_*.py                   → Python test files
Glob: **/*_test.go                   → Go test files
Glob: **/spec/**/*_spec.rb           → Ruby spec files
```

Read 2-3 existing test files to understand:
- Import patterns and test utilities used
- Naming conventions (`describe`/`it` vs `test`)
- Mock/stub patterns (`vi.mock`, `jest.mock`, `unittest.mock`)
- Setup/teardown patterns (`beforeEach`, `afterEach`, fixtures)
- Assertion library (`expect`, `assert`, `chai`)

### 0c. Detect Test Configuration

```
Glob: **/vitest.config.*
Glob: **/jest.config.*
Glob: **/pytest.ini
Glob: **/conftest.py
Glob: **/setup.cfg
Glob: **/.nycrc*
Glob: **/c8.config.*
```

Extract: coverage thresholds, test directories, global setup files, module aliases.

### 0d. Check Coverage Status

If there's a coverage tool configured (c8, istanbul/nyc, coverage.py):

```bash
# Check if coverage script exists
Grep: "coverage" in package.json scripts section
Grep: "c8" or "nyc" or "istanbul" in package.json
```

### 0e. Record Discovery

```
TEST ENVIRONMENT:
- Framework: [Vitest/Jest/pytest/etc. + version]
- Assertion style: [expect/assert/chai]
- Component testing: [Testing Library/Enzyme/none]
- Mock pattern: [vi.mock/jest.mock/unittest.mock]
- Coverage tool: [c8/nyc/coverage.py/none]
- Coverage threshold: [X% or not configured]
- Test directory: [__tests__/tests/spec/co-located]
- Existing tests: [count]
- Config file: [path]
```

---

## Step 1: Research Testing Best Practices

Before writing tests, research current best practices for the detected framework.

### 1a. Context7 — Official Testing Library Docs

Fetch docs for the detected test framework:

```json
CallMcpTool(server: "context7", toolName: "resolve-library-id", arguments: {
  "libraryName": "<DETECTED_FRAMEWORK>",
  "query": "unit testing best practices"
})
```

Then fetch specific guidance:

```json
CallMcpTool(server: "context7", toolName: "query-docs", arguments: {
  "libraryId": "<RESOLVED_ID>",
  "query": "testing patterns mocking setup teardown"
})
```

Do this for each major testing dependency (e.g., `vitest`, `@testing-library/react`, `msw`).

### 1b. Firecrawl — Current Testing Patterns

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<FRAMEWORK> unit testing best practices [current year]",
  "limit": 5,
  "sources": [{ "type": "web" }]
})
```

Run 2-3 searches targeting different aspects:

| Search | Query |
|--------|-------|
| Best practices | `<framework> testing best practices [current year]` |
| Mocking patterns | `<framework> mocking API calls best practices` |
| Component testing | `React Testing Library component testing patterns [current year]` |
| Coverage strategy | `unit test coverage strategy meaningful tests vs coverage percentage` |

Scrape the 1-2 most authoritative results for implementation details:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "<AUTHORITATIVE_URL>",
  "formats": ["markdown"],
  "onlyMainContent": true
})
```

---

## Step 2: Analyze Coverage Gaps (Sentry Integration)

Use Sentry MCP to find production errors that should have been caught by tests.

### 2a. Find Unresolved Production Errors

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "naturalLanguageQuery": "unresolved errors from the last 30 days",
  "projectSlugOrId": "<PROJECT_SLUG>",
  "regionUrl": "<REGION_URL>",
  "limit": 25
})
```

### 2b. Cross-Reference with Test Coverage

For each Sentry error:
1. Identify the source file from the stack trace
2. Check if a corresponding test file exists (`Glob: **/<filename>.test.*`)
3. If tests exist, check whether they cover the failing code path
4. If no tests exist, prioritize writing tests for this file

### 2c. Generate Priority List

```
COVERAGE GAP ANALYSIS:
- Production errors without tests: [count]
  1. [file] — [error type] — [frequency] — NO TEST FILE
  2. [file] — [error type] — [frequency] — test exists but missing edge case
- Highest-impact files to test: [ordered list]
```

---

## Step 3: Write Tests

### Test Structure (AAA Pattern)

```typescript
describe('ComponentOrModule', () => {
  describe('methodOrBehavior', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange — set up test data and dependencies
      const input = createTestData();

      // Act — execute the behavior under test
      const result = functionUnderTest(input);

      // Assert — verify the outcome
      expect(result).toEqual(expectedOutput);
    });
  });
});
```

### Naming Conventions

**Test file names** — co-locate with source or mirror directory structure:

| Source File | Test File |
|-------------|-----------|
| `src/utils/formatDate.ts` | `src/utils/formatDate.test.ts` |
| `src/components/Button.tsx` | `src/components/Button.test.tsx` |
| `app/services/user.py` | `tests/services/test_user.py` |

**Test descriptions** — use `should [behavior] when [condition]`:

```typescript
describe('validateEmail', () => {
  it('should return true for valid email', () => { /* ... */ });
  it('should return false when @ is missing', () => { /* ... */ });
  it('should return false for empty string', () => { /* ... */ });
  it('should handle unicode characters in local part', () => { /* ... */ });
});
```

### What to Test

**DO test:**
- Public API / exported functions
- Business logic and domain rules
- Edge cases and boundary values
- Error handling and failure modes
- User interactions (clicks, inputs, submissions)
- State transitions
- Data transformations

**DON'T test:**
- Implementation details (private methods, internal state)
- Third-party library internals
- Trivial code (simple getters/setters)
- Framework behavior
- CSS classes or DOM structure (test behavior, not markup)

### Edge Cases to Cover

For every function, consider:

| Category | Test Values |
|----------|------------|
| Empty | `null`, `undefined`, `""`, `[]`, `{}` |
| Boundary | `0`, `-1`, `Number.MAX_SAFE_INTEGER`, `Number.MIN_SAFE_INTEGER` |
| Type confusion | String where number expected, array where object expected |
| Unicode | Emoji, CJK characters, RTL text, zero-width spaces |
| Concurrency | Rapid successive calls, race conditions |
| Network | Timeout, 404, 500, empty response, malformed JSON |
| Dates | Midnight, DST transitions, leap years, timezone boundaries |

---

## Step 4: Testing Patterns by Category

### Pure Functions

```typescript
describe('formatCurrency', () => {
  it('should format positive amounts', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should handle negative amounts', () => {
    expect(formatCurrency(-100)).toBe('-$100.00');
  });

  it('should handle very large numbers', () => {
    expect(formatCurrency(999999999.99)).toBe('$999,999,999.99');
  });
});
```

### Async Functions

```typescript
describe('fetchUser', () => {
  it('should return user data for valid id', async () => {
    const user = await fetchUser('123');
    expect(user).toEqual({ id: '123', name: 'John Doe' });
  });

  it('should throw for non-existent user', async () => {
    await expect(fetchUser('invalid')).rejects.toThrow('User not found');
  });

  it('should handle network timeout', async () => {
    vi.useFakeTimers(); // or jest.useFakeTimers()
    const promise = fetchUser('123');
    vi.advanceTimersByTime(30000);
    await expect(promise).rejects.toThrow('timeout');
    vi.useRealTimers();
  });
});
```

### Mocking

```typescript
// Vitest
import { vi } from 'vitest';
vi.mock('./emailService', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

// Jest
jest.mock('./emailService');

// MSW (API mocking — preferred for HTTP)
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, name: 'Test User' });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### React Components (Testing Library)

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
  it('should submit with valid credentials', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'invalid');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
  });

  it('should disable submit button while loading', () => {
    render(<LoginForm onSubmit={vi.fn()} isLoading />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
  });
});
```

### Custom Hooks

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';

describe('useCounter', () => {
  it('should start with initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('should increment', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });

  it('should not go below zero', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.decrement());
    expect(result.current.count).toBe(0);
  });
});
```

### API Route Handlers (Next.js / Node)

```typescript
describe('POST /api/users', () => {
  it('should create user with valid data', async () => {
    const req = new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', email: 'test@example.com' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toMatchObject({ name: 'Test', email: 'test@example.com' });
  });

  it('should return 422 for invalid email', async () => {
    const req = new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', email: 'invalid' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(422);
  });
});
```

---

## Step 5: Test Data Management

### Use Factories

```typescript
const createUser = (overrides: Partial<User> = {}): User => ({
  id: crypto.randomUUID(),
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  createdAt: new Date('2024-01-01'),
  ...overrides,
});

// Usage
const admin = createUser({ role: 'admin' });
const inactive = createUser({ status: 'inactive', name: 'Inactive User' });
```

### Use Meaningful Data

```typescript
// Bad — meaningless
const data = { a: 'b', c: 'd' };

// Good — realistic and descriptive
const user = { name: 'Jane Doe', email: 'jane@example.com', role: 'admin' };
```

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
