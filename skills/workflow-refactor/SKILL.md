---
name: refactoring
description: Systematic code refactoring methodology with safe, incremental transformations. Use when improving code structure, breaking up large files, extracting components/hooks, or when user mentions "refactor", "split file", "extract", "cleanup", "reorganize", "too big", or "technical debt".
---

# Refactoring Skill

Safe, systematic approach to improving code structure without changing behavior.

## When to Use

- Breaking up large files/components
- Extracting reusable logic
- Modernizing legacy patterns
- Reducing code duplication
- Improving testability
- Paying down technical debt

## CRITICAL: Check Existing First

**Before ANY refactoring, verify current state:**

1. **Search for existing implementations:**
```bash
rg "function.*YourFunction" --type ts
rg "export.*YourComponent" --type tsx
```

2. **Check for existing hooks/utils:**
```bash
ls -la src/hooks/ src/lib/ src/utils/
rg "use[A-Z]" --type ts -l  # Find existing hooks
```

3. **Check if extraction already exists:**
```bash
ls -la src/components/ui/   # @/components/ui primitives
ls -la src/lib/             # @/lib utilities  
ls -la src/hooks/           # @/hooks shared hooks
rg "export function|export const" src/lib/ --type ts
```

4. **Review recent commits:**
```bash
git log --oneline -20 --all -- "*.ts" "*.tsx"
```

**Why:** Duplicate utilities cause confusion, bloat, and maintenance burden. Always search before creating.

## Refactoring Principles

### Golden Rules
1. **Never refactor and add features simultaneously**
2. **Keep tests passing after each step**
3. **Small, atomic commits**
4. **Prefer incremental over big-bang**
5. **Verify behavior before and after**

### Safety Checklist
- [ ] Tests exist (or write them first)
- [ ] Can verify behavior manually
- [ ] Changes are reversible
- [ ] No deadline pressure
- [ ] Team is aware

## Common Refactoring Patterns

### 1. Extract Component

**When:** Component > 200 lines, clear UI boundary

**Process:**
1. Identify self-contained UI section
2. List all props/state it needs
3. Create new component file
4. Move JSX and relevant state
5. Import and use in parent

```tsx
// Before: UserDashboard.tsx (500 lines)
function UserDashboard() {
  // ... 200 lines of stats logic and UI
  return (
    <div>
      {/* Stats section - candidate for extraction */}
      <div className="stats">
        {stats.map(s => (
          <div key={s.id}>
            <span>{s.label}</span>
            <span>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// After: Extract StatsGrid component
// components/StatsGrid.tsx
interface StatsGridProps {
  stats: Stat[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="stats">
      {stats.map(s => (
        <div key={s.id}>
          <span>{s.label}</span>
          <span>{s.value}</span>
        </div>
      ))}
    </div>
  )
}

// UserDashboard.tsx - now cleaner
import { StatsGrid } from './StatsGrid'

function UserDashboard() {
  return (
    <div>
      <StatsGrid stats={stats} />
    </div>
  )
}
```

### 2. Extract Custom Hook

**When:** Component has complex state/effect logic reused elsewhere

**Process:**
1. Identify state + effects that belong together
2. Create `useX` hook
3. Move state and effects
4. Return needed values/functions
5. Use hook in component

```tsx
// Before: inline fetch logic
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    setLoading(true)
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [userId])
  
  // ...render
}

// After: extracted hook
// hooks/useUser.ts
export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    setLoading(true)
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [userId])
  
  return { user, loading, error }
}

// Component - now simple
function UserProfile({ userId }: { userId: string }) {
  const { user, loading, error } = useUser(userId)
  // ...render
}
```

### 3. Extract Utility Function

**When:** Pure logic used in multiple places

**Process:**
1. Identify pure function (no side effects)
2. Create in appropriate location (`lib/` or feature utils)
3. Add types and JSDoc
4. Write unit tests
5. Replace inline logic with import

```tsx
// Before: inline in multiple components
const fullName = `${user.firstName} ${user.lastName}`.trim()
const initials = user.firstName[0] + user.lastName[0]

// After: lib/user.ts
/**
 * Get user's full display name
 */
export function getFullName(user: { firstName: string; lastName: string }) {
  return `${user.firstName} ${user.lastName}`.trim()
}

/**
 * Get user's initials for avatar
 */
export function getInitials(user: { firstName: string; lastName: string }) {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
}
```

### 4. Replace Magic Numbers/Strings with Constants

**Process:**
1. Find hardcoded values
2. Extract to named constants
3. Group related constants
4. Consider config file for env-specific values

```tsx
// Before
if (items.length > 100) { /* paginate */ }
const timeout = 5000
if (status === 'pending') { /* ... */ }

// After
// constants/limits.ts
export const PAGINATION_THRESHOLD = 100
export const DEFAULT_TIMEOUT_MS = 5000

// types/status.ts
export const Status = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETE: 'complete',
} as const
```

### 5. Consolidate Conditional Logic

**When:** Complex nested conditionals, repeated conditions

```tsx
// Before: nested conditionals
function getPrice(user: User, item: Item) {
  if (user.isPremium) {
    if (item.onSale) {
      return item.price * 0.7
    } else {
      return item.price * 0.9
    }
  } else {
    if (item.onSale) {
      return item.price * 0.8
    } else {
      return item.price
    }
  }
}

// After: extract to strategy pattern or lookup
const DISCOUNT_MATRIX = {
  premium: { sale: 0.7, regular: 0.9 },
  regular: { sale: 0.8, regular: 1.0 },
}

function getPrice(user: User, item: Item) {
  const tier = user.isPremium ? 'premium' : 'regular'
  const type = item.onSale ? 'sale' : 'regular'
  return item.price * DISCOUNT_MATRIX[tier][type]
}
```

### 6. Split Large Files

**When:** File > 400 lines, multiple unrelated concerns

**Process:**
1. Identify logical groupings
2. Create new files for each group
3. Move code maintaining imports
4. Update index.ts barrel export
5. Update imports in dependents

```
# Before
features/orders/OrderService.ts (800 lines)
  - Order CRUD
  - Payment processing
  - Notification sending
  - Analytics tracking

# After
features/orders/
  services/
    orderCrud.ts
    paymentProcessor.ts
    notificationService.ts
    analyticsTracker.ts
  index.ts  # Re-exports for backward compatibility
```

### 7. Replace useEffect with Derived State

**When:** useEffect updates state based on other state

```tsx
// Before: unnecessary effect
const [items, setItems] = useState([])
const [total, setTotal] = useState(0)

useEffect(() => {
  setTotal(items.reduce((sum, i) => sum + i.price, 0))
}, [items])

// After: derived value (useMemo)
const [items, setItems] = useState([])
const total = useMemo(
  () => items.reduce((sum, i) => sum + i.price, 0),
  [items]
)

// React 19+ with React Compiler: no useMemo needed
// The compiler auto-memoizes when beneficial
const total = items.reduce((sum, i) => sum + i.price, 0)
```

**Note:** React Compiler (2025+) auto-memoizes, making manual `useMemo`/`useCallback` optional in many cases.

### 8. Modernize to Server Components (Next.js 15+)

**When:** Component only fetches/displays data, no interactivity

```tsx
// Before: Client Component with useEffect
'use client'
function ProductList() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts)
  }, [])
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}

// After: Server Component (default in Next.js 15)
async function ProductList() {
  const products = await db.product.findMany()
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}

// For mutations: Use Server Actions
async function addProduct(formData: FormData) {
  'use server'
  await db.product.create({ data: { name: formData.get('name') } })
  revalidatePath('/products')
}
```

**Next.js 15 Patterns:**
- Server Components are default (no directive needed)
- `'use client'` only at leaf components
- Server Actions for mutations (`'use server'`)
- `revalidatePath`/`revalidateTag` for cache invalidation

## Refactoring Workflow

### Phase 1: Preparation
1. **Characterize current behavior** - Write tests or document expected behavior
2. **Identify scope** - What files/functions will change?
3. **Plan increments** - Break into small, testable steps

### Phase 2: Execution
1. **Make one change**
2. **Run tests** - Verify nothing broke
3. **Commit** - Small, atomic commit
4. **Repeat**

### Phase 3: Cleanup
1. **Remove dead code**
2. **Update imports**
3. **Update documentation**
4. **Final test run**

## Refactoring Red Flags

**Stop refactoring if:**
- Tests start failing unexpectedly
- Scope is growing beyond original plan
- You're changing behavior, not just structure
- You need to "just fix one more thing"
- Deadline is approaching

## Commit Message Templates

```
refactor(users): extract UserCard component from Dashboard

- Move user card UI to separate component
- Add UserCardProps interface
- No behavior changes
```

```
refactor(api): consolidate error handling

- Extract ApiError class
- Standardize error response shape
- Update all route handlers
```
