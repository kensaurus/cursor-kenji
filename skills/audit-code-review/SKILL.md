---
name: code-review
description: Thorough code review for correctness, security, performance, and patterns. Use when reviewing a PR, auditing a feature, checking someone's code, or when user mentions "review this code", "check my PR", "find issues", "code audit", "what's wrong with", "is this safe", or "review before merge".
---

# Code Review

## Review Modes

### Agent Review (Built-in)
After implementing, click **Review → Find Issues** in Cursor. The agent reviews the diff line-by-line and flags problems. Also available in Source Control tab → **Agent Review** to compare against main.

### BugBot (Automated PRs)
Push to GitHub → BugBot runs advanced analysis on every PR automatically. Catches issues before human review.

### Manual Review (This Skill)
Use the checklist below for thorough reviews.

## Review Checklist

### Correctness
- [ ] Does it do what the task/spec requires?
- [ ] Edge cases handled: null/undefined, empty arrays/strings, 0, negative numbers, very large inputs
- [ ] Concurrent requests handled correctly (no race conditions)?
- [ ] Async code properly awaited? No floating promises?
- [ ] Error paths covered and tested?
- [ ] No silent failures (swallowed errors, empty catch blocks)?

### Security (Non-Negotiable)
- [ ] All user inputs validated with Zod **server-side** before any DB operation
- [ ] Auth check in every Server Action and Route Handler
- [ ] No secrets, tokens, API keys in code, logs, or responses
- [ ] No PII in logs (emails, names, phone numbers)
- [ ] RLS enabled on any new tables; policies tested
- [ ] No SQL string concatenation (parameterized queries only)
- [ ] File uploads: type and size validated server-side
- [ ] CSRF protection for mutation endpoints
- [ ] No `dangerouslySetInnerHTML` with user content

### Types & Code Quality
- [ ] No `any` types introduced
- [ ] No `// @ts-ignore` or `// @ts-expect-error` without explanation
- [ ] Return types explicit on public functions
- [ ] Zod schemas defined at module level (not inline in components)
- [ ] No inline types >5 lines (extract to `types.ts`)
- [ ] Dead code removed (unused imports, variables, functions)
- [ ] No magic values (use named constants)
- [ ] Early returns used to reduce nesting

### Patterns & Conventions
- [ ] Matches existing code patterns (file structure, naming, exports)
- [ ] Reuses existing components from `@/components/ui`
- [ ] Server Actions for mutations (not API routes for internal CRUD)
- [ ] `'use client'` only at leaf components (not layouts, pages)
- [ ] Forms use React Hook Form + Zod, not manual `useState`
- [ ] Data fetching uses TanStack Query (not `useEffect` + `useState`)
- [ ] URL state uses `nuqs` (not manual `URLSearchParams`)
- [ ] No files >300 lines

### Performance
- [ ] No N+1 queries (use `include` / batch queries)
- [ ] Indexes exist on new frequently-queried columns
- [ ] `select` only needed fields from DB (not `SELECT *`)
- [ ] `useMemo`/`useCallback` for expensive computations and stable callbacks to children
- [ ] `memo()` on components that receive stable props
- [ ] No unnecessary re-renders from object/array literals in JSX props
- [ ] Heavy components lazy-loaded with `dynamic()`
- [ ] Images use `next/image` with proper `sizes`

### Database
- [ ] Migration file created for schema changes
- [ ] Migration is reversible (has down migration or is additive-only)
- [ ] `created_at`/`updated_at` on new tables
- [ ] Foreign keys have `ON DELETE` behaviour specified
- [ ] New indexes added where needed
- [ ] RLS policies added and tested

### Accessibility
- [ ] All inputs have associated `<label>` or `aria-label`
- [ ] Interactive elements are keyboard accessible
- [ ] `aria-live` for dynamic content that updates
- [ ] Error messages are associated with their fields
- [ ] Focus management handled for modals/dialogs

### Tests
- [ ] New logic has tests
- [ ] Tests cover the bug fix (regression test added)
- [ ] Tests are named behaviourally ("shows error when X", not "sets state to Y")
- [ ] No tests that only test mocks

## Common Issues to Watch For

### React
```typescript
// Race condition — state update after unmount
useEffect(() => {
  fetchData().then(setData) // Problem: component may unmount before this resolves
}, [])
// Fix: use TanStack Query or an AbortController

// Stale closure
const handler = () => console.log(count) // Problem: captures stale count
// Fix: useCallback with [count] dep or use ref

// Unstable reference causing infinite loop
useEffect(() => { ... }, [{ id: user.id }]) // New object every render
// Fix: depend on user.id directly
```

### Server Actions
```typescript
// Missing auth check
export async function deletePost(id: string) {
  // Problem: any user can delete any post
  await prisma.post.delete({ where: { id } })
}
// Fix: verify session and ownership first

// Missing validation
export async function createPost(data: unknown) {
  // Problem: trusting client data
  await prisma.post.create({ data: data as any })
}
// Fix: parse with Zod before using
```

### Database
```typescript
// N+1 query
const posts = await prisma.post.findMany()
for (const post of posts) {
  post.author = await prisma.user.findUnique({ where: { id: post.authorId } }) // N queries!
}
// Fix: use include
const posts = await prisma.post.findMany({ include: { author: true } })
```

## Review Output Format
```
## Review Summary

### Issues Found

**Critical (must fix before merge)**
- Line 45: Missing auth check in `deleteUser` action
- Line 78: SQL injection risk — string concatenation in query

**Important (should fix)**
- Line 23: `any` type on `userData` — should be `UserWithProfile`
- Missing index on `orders.user_id` — will cause slow queries at scale

**Suggestions (optional)**
- Line 56: Could use `prisma.user.upsert` instead of find-then-create pattern

### Verdict
[ ] Ready to merge
[x] Needs changes (see critical issues)
[ ] Needs discussion (architectural concerns)
```
