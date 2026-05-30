---
name: workflow-refactor
description: >
  Guide for refactoring code to improve quality without changing behavior. Use when refactoring,
  cleaning up code, reducing duplication, improving readability, or restructuring code.
  Integrates Firecrawl for researching modern patterns before refactoring,
  and codebase-aware dependency analysis to avoid breaking changes.
---

# Refactor Code Skill

Improve code quality without changing external behavior. Research-aware.

## MANDATORY: Pre-Refactoring Checks

**BEFORE refactoring any code, you MUST:**

### 1. Read Relevant Documentation
```
README.md                              (project overview)
src/[domain]/@_[domain]-README.md      (domain architecture)
CONTRIBUTING.md                        (code standards)
```

### 2. Understand Existing Patterns

Use `Grep` and `SemanticSearch` to find:
- How similar code is structured elsewhere in the codebase
- What patterns are already established
- ALL files that import/depend on the code being refactored

### 3. Map the Blast Radius

Before changing any function, class, or component:
```bash
rg "functionName" --type ts       # find all callers
rg "import.*from.*module" --type ts  # find all importers
```

List every file that will be affected by the change. If the blast radius is large (10+ files), consider a phased approach.

### 4. Research Modern Patterns (for non-trivial refactors)

If the refactoring introduces a new pattern, verify it's current best practice:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<framework> <pattern> best practice <current year>",
  "limit": 5,
  "sources": [{ "type": "web" }]
})
```

Scrape the most authoritative result:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "<best-result-url>",
  "formats": ["markdown"],
  "onlyMainContent": true
})
```

This prevents refactoring FROM one outdated pattern TO another outdated pattern.

### 5. Verification Statement (REQUIRED)

Before refactoring, state:
```
"Pre-refactoring check:
- README/docs read: [list]
- Dependent files identified: [list files that import this code]
- Blast radius: [N files affected]
- Tests exist: [YES/NO — if NO, write tests first]
- Pattern verified: [YES via research / YES matches codebase / SKIP — trivial refactor]"
```

---

## Refactoring Principles

1. **Behavior stays the same** — tests pass before and after
2. **Small steps** — one change at a time, verify after each
3. **Test frequently** — run tests after each change
4. **Commit often** — easy to revert if something breaks
5. **Research first** — don't replace old patterns with other old patterns

---

## Code Smells and Fixes

| Smell | Symptom | Solution |
|-------|---------|----------|
| **Long Function** | >20 lines, does multiple things | Extract functions |
| **Duplicate Code** | Same logic in 2+ places | Extract shared function/hook |
| **Magic Numbers** | Unexplained literals | Named constants or config |
| **Deep Nesting** | 3+ levels of if/loops | Early returns, extract functions |
| **Long Parameter List** | >3 parameters | Object parameter with interface |
| **Feature Envy** | Function uses another module's data heavily | Move function to that module |
| **God Object** | One class/component does everything | Split by responsibility |
| **Primitive Obsession** | Using strings/numbers where a type would be safer | Create domain types |
| **Shotgun Surgery** | One change requires editing many files | Consolidate related logic |
| **Dead Code** | Unreachable or unused code | Delete it (git has history) |

---

## Common Refactorings

### Extract Function

**Before:**
```typescript
function processOrder(order: Order) {
  if (!order.items.length) throw new Error('Empty order');
  if (!order.customer) throw new Error('No customer');
  if (order.total < 0) throw new Error('Invalid total');

  const subtotal = order.items.reduce((sum, i) => sum + i.price, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  db.orders.insert({ ...order, total });
}
```

**After:**
```typescript
function processOrder(order: Order) {
  validateOrder(order);
  const total = calculateTotal(order);
  saveOrder({ ...order, total });
}
```

### Flatten Nested Conditionals

**Before:**
```typescript
function getDiscount(user: User, order: Order) {
  if (user) {
    if (user.isPremium) {
      if (order.total > 100) {
        return 0.2;
      } else {
        return 0.1;
      }
    }
  }
  return 0;
}
```

**After:**
```typescript
function getDiscount(user: User | null, order: Order) {
  if (!user) return 0;
  if (user.isPremium && order.total > 100) return 0.2;
  if (user.isPremium) return 0.1;
  return 0;
}
```

### Replace Magic Numbers

```typescript
// Before
if (password.length < 8) { ... }
if (retries > 3) { ... }
const tax = amount * 0.1;

// After
const MIN_PASSWORD_LENGTH = 8;
const MAX_RETRIES = 3;
const TAX_RATE = 0.1;
```

### Use Object Parameters

```typescript
// Before — positional args are error-prone
function createUser(name: string, email: string, age: number, role: string) { ... }

// After — named, self-documenting, extensible
interface CreateUserParams {
  name: string;
  email: string;
  age: number;
  role: string;
}
function createUser(params: CreateUserParams) { ... }
```

---

## Refactoring Process

```
1. Verify tests pass → 2. Make one small change → 3. Verify tests pass → 4. Commit → 5. Repeat
```

### Commit Message Format
```
refactor(scope): description of structural change

- What was changed and why
- No behavior change
```

---

## Refactoring Checklist

### Before Starting
- [ ] Tests pass (if no tests, write them first)
- [ ] Understand current behavior
- [ ] All dependent files identified
- [ ] Pattern researched (if introducing new pattern)
- [ ] Specific smell identified

### During Refactoring
- [ ] One change at a time
- [ ] Tests run after each change
- [ ] Working states committed

### After Refactoring
- [ ] All tests still pass
- [ ] Code is more readable
- [ ] No behavior changes
- [ ] Performance not degraded
- [ ] All dependent files updated
- [ ] Types still correct (no new `any` or casts)

---

## When NOT to Refactor

- No test coverage (write tests first)
- Don't understand the code yet (read and learn first)
- Code is being deleted soon
- The refactoring has no clear benefit
- Under deadline pressure (ship first, refactor in a follow-up)
