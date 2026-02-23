---
name: tdd
description: Test-driven development workflow with AI agents. Use when writing tests first, doing TDD, Red-Green-Refactor cycles, or when user mentions "write tests first", "TDD", "test-driven", "failing tests", "make tests pass", or "write tests before implementation".
---

# Test-Driven Development with AI

## Why TDD with Agents
Agents perform best when they have a **clear, verifiable target**. Tests give the agent an objective definition of "done" — it can run them, see failures, fix code, and iterate until they pass. This produces cleaner, more correct implementations than asking for code directly.

## The Cycle: Red → Green → Refactor

### Phase 1: Red — Write Failing Tests
Tell the agent: *"We're doing TDD. Write tests for [feature] based on these input/output pairs. Do NOT write any implementation yet."*

```typescript
// Example: agent writes this first
describe('calculateDiscount', () => {
  it('applies 10% for orders over £100', () => {
    expect(calculateDiscount(120, 'standard')).toBe(108)
  })
  it('returns full price for orders under £100', () => {
    expect(calculateDiscount(80, 'standard')).toBe(80)
  })
  it('applies 20% for premium customers', () => {
    expect(calculateDiscount(120, 'premium')).toBe(96)
  })
  it('throws for negative amounts', () => {
    expect(() => calculateDiscount(-10, 'standard')).toThrow()
  })
})
```

Tell the agent: *"Run the tests and confirm they fail. Do not write implementation yet."*

```bash
npx vitest run src/utils/discount.test.ts
# Expected: all tests fail (functions don't exist yet)
```

Commit the tests when satisfied.

### Phase 2: Green — Make Tests Pass
Tell the agent: *"Now write code that makes these tests pass. Do not modify the tests. Keep iterating until all pass."*

The agent writes implementation, runs tests, fixes failures, and repeats.

```bash
npx vitest run --watch src/utils/discount.test.ts
```

Commit when all tests pass with minimal implementation.

### Phase 3: Refactor — Clean Up
With tests as a safety net, refactor confidently:
- Extract repeated logic
- Improve naming
- Add types/docs
- Optimise performance

Run tests after every change. They must stay green.

## Test Patterns by Type

### Unit Tests (Vitest)
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates user with hashed password', async () => {
    const mockDb = { user: { create: vi.fn().mockResolvedValue({ id: '1', email: 'a@b.com' }) } }
    const service = new UserService(mockDb as any)
    const result = await service.createUser({ email: 'a@b.com', password: 'plain' })
    expect(mockDb.user.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ email: 'a@b.com' }) })
    )
    expect(result.id).toBe('1')
  })
})
```

### Server Actions (with validation)
```typescript
it('rejects invalid email', async () => {
  const result = await createUserAction({ email: 'not-an-email', name: 'Test' })
  expect(result.success).toBe(false)
  expect(result.fieldErrors?.email).toBeDefined()
})

it('returns success with valid data', async () => {
  const result = await createUserAction({ email: 'valid@test.com', name: 'Test' })
  expect(result.success).toBe(true)
  expect(result.data?.id).toBeDefined()
})
```

### React Components (Testing Library)
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

it('shows error on invalid submit', async () => {
  render(<LoginForm />)
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
  await waitFor(() => {
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })
})
```

### API Routes
```typescript
it('returns 401 without auth', async () => {
  const req = new Request('http://localhost/api/users', { method: 'GET' })
  const res = await GET(req)
  expect(res.status).toBe(401)
})
```

## Writing Good Tests

### Name tests behaviourally
```typescript
// Good — describes observable behaviour
it('redirects to login when session expires')
it('shows toast on network error')
it('disables submit while loading')

// Bad — describes implementation
it('sets isLoading to true')
it('calls setError with message')
```

### Arrange-Act-Assert
```typescript
it('filters active users', () => {
  // Arrange
  const users = [
    { id: '1', active: true, name: 'Alice' },
    { id: '2', active: false, name: 'Bob' },
  ]
  // Act
  const result = filterActiveUsers(users)
  // Assert
  expect(result).toHaveLength(1)
  expect(result[0].name).toBe('Alice')
})
```

### Mock at boundaries only
```typescript
// Mock external dependencies (DB, APIs, third-party services)
vi.mock('@/lib/db', () => ({ prisma: mockPrisma }))
vi.mock('resend', () => ({ Resend: vi.fn(() => ({ emails: { send: vi.fn() } })) }))

// Don't mock your own pure functions — test them directly
```

## Running Tests
```bash
npx vitest run                          # All tests once
npx vitest run --changed                # Only changed files
npx vitest run src/features/auth        # Specific folder
npx vitest --coverage                   # With coverage report
npx vitest watch                        # Watch mode
```

## Coverage Targets
| Type | Target |
|------|--------|
| Statements | > 80% |
| Branches | > 75% |
| Functions | > 80% |
| Lines | > 80% |

Focus coverage on: business logic, server actions, validation, auth flows.
Don't obsess over 100% — test behaviour, not implementation.
