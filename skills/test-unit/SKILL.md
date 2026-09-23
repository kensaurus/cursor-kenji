---
name: test-unit
description: >
  Write unit/integration tests for a named module or change. Use when
  "write unit tests" or "add tests for this function". Coverage plan →
  plan-test-coverage. Mutation score → test-mutation. Story QA →
  test-qa. This-diff Playwright → test-playwright.
license: MIT
---

# test-unit — Write tests that would notice a break

**Degree of freedom: MIXED** — which cases to write `[HIGH freedom]`;
detect-then-match existing harness `[LOW freedom — run exactly]`. This skill
**writes tests**. Coverage theater / mutation score → `test-mutation`.

Write effective, maintainable unit tests from the project's actual
framework, production error data, and current best practices.

## This skill vs neighbors

| Skill | Owns |
|:------|:-----|
| **test-unit** (this) | **Write** the tests |
| `test-mutation` | Survivors / assertion theater — hand off the score |
| `plan-test-coverage` | What *should* be tested — plan only, no harness |
| `test-playwright` | Live this-diff PDCA, not unit files |
| `test-qa` | Story/CRUD QA in a headed browser |

## How to reason (each test you add)

1. **Observe** — target function, existing pattern, Sentry gap if any
2. **Interpret** — behavior under test vs implementation detail
3. **Classify** — write (public/edge/error) / skip (trivial/third-party/markup)
4. **Severity** — prod-error gap and money/auth paths first

## Worked example

> **Observe:** Sentry `TypeError` in `parsePrice`; `parsePrice.test.ts` only
> asserts the happy path; coverage 91%.
> **Interpret:** suite executes the file but never the empty/malformed branch.
> **Classify:** write the missing edge cases here — do not declare coverage done.
> **Handoff:** if the new tests still wouldn't catch a `>`/`>=` flip → `test-mutation`.

---

## Step 0: Auto-Detect Test Environment  [LOW freedom — match the harness]

### 0a. Detect Test Framework

Read the dependency manifest (`package.json`, `requirements.txt`,
`pyproject.toml`, `go.mod`, `Cargo.toml`, `build.gradle`, `Gemfile`):

| Framework | Detection Signal |
|-----------|-----------------|
| **Vitest** | `vitest` in devDependencies, `vitest.config.ts` |
| **Jest** | `jest` in devDependencies, `jest.config.*`, `"jest"` key |
| **Testing Library** | `@testing-library/react`, `@testing-library/vue`, etc. |
| **Playwright** | `@playwright/test`, `playwright.config.ts` |
| **Cypress** | `cypress`, `cypress.config.*` |
| **pytest** | `pytest` in requirements, `conftest.py` |
| **Go test** | `_test.go`, `go test` in Makefile |
| **RSpec** | `rspec` in Gemfile, `spec/` |
| **JUnit** | `junit` in build.gradle, `src/test/` |

### 0b. Discover Existing Test Patterns

```
Glob: **/*.test.{ts,tsx,js,jsx} → JS/TS test files
Glob: **/*.spec.{ts,tsx,js,jsx} → JS/TS spec files
Glob: **/test_*.py → Python
Glob: **/*_test.go → Go
Glob: **/spec/**/*_spec.rb → Ruby
```

Read 2–3 existing tests: imports/utilities, `describe`/`it` vs `test`,
mock style (`vi.mock`, `jest.mock`, `unittest.mock`), setup/teardown,
assertion library (`expect`, `assert`, `chai`).

### 0c. Detect Test Configuration

Glob `vitest.config.*`, `jest.config.*`, `pytest.ini`, `conftest.py`,
`setup.cfg`, `.nycrc*`, `c8.config.*`. Extract coverage thresholds, test
dirs, global setup, module aliases.

### 0d. Check Coverage Status

If c8 / istanbul/nyc / coverage.py is configured, grep `package.json`
scripts for `coverage` / `c8` / `nyc` / `istanbul`.

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

## Step 1: Research Testing Best Practices  [HIGH freedom]

Context7 for the detected framework + each major testing dep (`vitest`,
`@testing-library/react`, `msw`):

```json
context7:resolve-library-id
{ "libraryName": "<DETECTED_FRAMEWORK>", "query": "unit testing best practices" }
```

Then `context7:query-docs` for mocking, setup, teardown.

Firecrawl — one current-year search, scrape the most authoritative result:

```json
firecrawl:firecrawl_search
{
 "query": "<FRAMEWORK> unit testing best practices [current year]",
 "limit": 5, "sources": [{ "type": "web" }]
}
```

Optional second query: `<framework> mocking API calls` or `React Testing
Library component testing patterns [current year]`.

---

## Step 2: Analyze Coverage Gaps (Sentry Integration)  [HIGH freedom]

```json
sentry:search_issues
{
 "organizationSlug": "<ORG_SLUG>",
 "query": "unresolved errors from the last 30 days",
 "projectSlugOrId": "<PROJECT_SLUG>",
 "regionUrl": "<REGION_URL>",
 "limit": 25
}
```

For each issue: stack-trace file → `Glob: **/<filename>.test.*` → does a
test cover the failing path? No file, or happy-path-only → prioritize it.

```
COVERAGE GAP ANALYSIS:
- Production errors without tests: [count]
 1. [file] — [error type] — [frequency] — NO TEST FILE
 2. [file] — [error type] — [frequency] — test exists but missing edge case
- Highest-impact files to test: [ordered list]
```

---

## Step 3: Write Tests  [HIGH freedom]

### Test Structure (AAA Pattern)

```typescript
describe('ComponentOrModule', () => {
 describe('methodOrBehavior', () => {
 it('should [expected behavior] when [condition]', () => {
 // Arrange
 const input = createTestData();
 // Act
 const result = functionUnderTest(input);
 // Assert
 expect(result).toEqual(expectedOutput);
 });
 });
});
```

### Naming Conventions

Co-locate or mirror the source tree:

| Source File | Test File |
|-------------|-----------|
| `src/utils/formatDate.ts` | `src/utils/formatDate.test.ts` |
| `src/components/Button.tsx` | `src/components/Button.test.tsx` |
| `app/services/user.py` | `tests/services/test_user.py` |

Descriptions: `should [behavior] when [condition]`.

### What to Test

**DO test:** public API / exported functions; business/domain rules; edge
and boundary values; error/failure modes; user interactions; state
transitions; data transformations.

**DON'T test:** private methods / internal state; third-party internals;
trivial getters/setters; framework behavior; CSS classes or DOM structure
(behavior, not markup).

### Edge Cases to Cover

| Category | Test Values |
|----------|------------|
| Empty | `null`, `undefined`, `""`, `[]`, `{}` |
| Boundary | `0`, `-1`, `Number.MAX_SAFE_INTEGER`, `Number.MIN_SAFE_INTEGER` |
| Type confusion | String where number expected, array where object expected |
| Unicode | Emoji, CJK, RTL, zero-width spaces |
| Concurrency | Rapid successive calls, races |
| Network | Timeout, 404, 500, empty body, malformed JSON |
| Dates | Midnight, DST, leap years, timezone boundaries |

---

## Step 4: Match the repo's patterns  [HIGH freedom]

Write mocks, component, hook, and route-handler tests in the shape the existing suite uses (Step 0b) and the framework docs describe (Step 1). Generic templates per category live in [references/details.md](references/details.md) for repos with no precedent.

## Step 5: Test Data Management  [HIGH freedom]

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

## Self-critique before reporting  [LOW freedom — do not skip]

1. **Wrote tests** — this skill does not stop at a plan
2. **Behavior not markup** — no className / private internals
3. **Matched harness** — same runner, naming, mock style as existing files
4. **Isolated + deterministic** — factories, no shared mutable
5. **Mutation theater not claimed** — score → `test-mutation`

## Further reading

- [Avoid Shared Mutable State and more](references/details.md)
