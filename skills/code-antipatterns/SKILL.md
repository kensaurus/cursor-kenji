---
name: code-antipatterns
description: Detect and fix code anti-patterns and bad practices. Use when reviewing code quality, fixing problematic patterns, refactoring legacy code, debugging mysterious bugs, or when user mentions "code smell", "bad practice", "anti-pattern", "technical debt", "cleanup", or "why is this slow/broken".
---

# Code Anti-patterns Skill

Identify and remediate common anti-patterns that cause bugs, performance issues, and maintenance nightmares.

## When to Use

- Code review for quality issues
- Refactoring problematic code
- Debugging mysterious bugs
- Improving code maintainability
- Onboarding (teaching good patterns)

## CRITICAL: Check Existing First

**Before fixing ANY anti-pattern, verify:**

1. **Check if fix already exists elsewhere:**
```bash
rg "YourProposedFix" --type ts
```

2. **Check for existing utilities that solve this:**
```bash
ls -la src/lib/ src/hooks/ src/utils/
```

3. **Check for project-specific patterns:**
- Read `CONTRIBUTING.md` or `README.md`
- Check `.cursor/rules/` for established conventions
- Review recent PRs for similar fixes

4. **Verify the "anti-pattern" isn't intentional:**
- Some patterns look bad but are necessary (e.g., `// eslint-disable` with reason)
- Check git blame for context on why code exists

**Why:** "Fixing" working code without understanding context can introduce bugs. Always investigate before changing.

## React Anti-patterns

### 1. Props Drilling → Context or Composition

**Anti-pattern:**
```tsx
// Passing props through 5+ levels
<App>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserMenu user={user}>
        <Avatar user={user} />
```

**Fix: Context for global state, composition for UI:**
```tsx
// Context for truly global state
const UserContext = createContext<User | null>(null)
const useUser = () => useContext(UserContext)

// Composition for UI concerns
<Layout>
  <Layout.Sidebar>
    <UserMenu />
  </Layout.Sidebar>
  <Layout.Main>{children}</Layout.Main>
</Layout>

// Check @/components/ui first for existing primitives
```

### 2. Derived State in useState → useMemo

**Anti-pattern:**
```tsx
const [items, setItems] = useState([])
const [filteredItems, setFilteredItems] = useState([])

useEffect(() => {
  setFilteredItems(items.filter(i => i.active))
}, [items])  // Unnecessary re-render
```

**Fix:**
```tsx
const [items, setItems] = useState([])
const filteredItems = useMemo(
  () => items.filter(i => i.active),
  [items]
)
```

### 3. useEffect for Data Fetching → Server Components or TanStack Query

**Anti-pattern:**
```tsx
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  fetch('/api/data')
    .then(r => r.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false))
}, [])
```

**Fix (Server Component - preferred in Next.js 15):**
```tsx
// No 'use client' - this is a Server Component
async function DataDisplay() {
  const data = await db.getData()  // Direct DB access
  return <div>{data.name}</div>
}
```

**Fix (Client Component with TanStack Query):**
```tsx
'use client'
const { data, isLoading, error } = useQuery({
  queryKey: ['data'],
  queryFn: () => fetch('/api/data').then(r => r.json()),
})
```

**Decision:** Use Server Components for initial data, TanStack Query for client-side updates/polling.

### 4. Object/Array in Dependency Array → useRef or Memoize

**Anti-pattern:**
```tsx
useEffect(() => {
  doSomething(options)
}, [options])  // New object every render = infinite loop
```

**Fix:**
```tsx
// Option 1: Memoize the object
const options = useMemo(() => ({ page, limit }), [page, limit])

// Option 2: Destructure primitives
useEffect(() => {
  doSomething({ page, limit })
}, [page, limit])

// Option 3: useRef for truly stable reference
const optionsRef = useRef(options)
optionsRef.current = options
```

### 5. Index as Key in Dynamic Lists

**Anti-pattern:**
```tsx
{items.map((item, index) => (
  <Item key={index} {...item} />  // Breaks on reorder/delete
))}
```

**Fix:**
```tsx
{items.map(item => (
  <Item key={item.id} {...item} />  // Stable identity
))}
```

### 6. Giant Component → Composition

**Anti-pattern:** 500+ line component with mixed concerns

**Fix: Split by responsibility:**
```tsx
// UserDashboard/index.tsx - Orchestration only
export function UserDashboard() {
  const user = useUser()
  return (
    <DashboardLayout>
      <UserHeader user={user} />
      <UserStats userId={user.id} />
      <RecentActivity userId={user.id} />
    </DashboardLayout>
  )
}

// Each sub-component handles its own data/state
```

## TypeScript Anti-patterns

### 1. any Everywhere → Proper Types

**Anti-pattern:**
```tsx
function processData(data: any) {
  return data.items.map((i: any) => i.name)
}
```

**Fix:**
```tsx
interface DataResponse {
  items: Array<{ id: string; name: string }>
}

function processData(data: DataResponse) {
  return data.items.map(i => i.name)  // Fully typed
}
```

### 2. Type Assertions Over Validation → Zod

**Anti-pattern:**
```tsx
const data = await response.json() as User  // Trust issues
```

**Fix:**
```tsx
const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
})

const data = UserSchema.parse(await response.json())  // Validated
```

### 3. Enums → Union Types or as const

**Anti-pattern:**
```tsx
enum Status {
  Pending = 'pending',
  Active = 'active',
}
// Compiles to runtime object, can't be tree-shaken
```

**Fix:**
```tsx
type Status = 'pending' | 'active'
// or
const Status = {
  Pending: 'pending',
  Active: 'active',
} as const
type Status = typeof Status[keyof typeof Status]
```

### 4. Non-Exhaustive Switches → never Check

**Anti-pattern:**
```tsx
function handle(status: Status) {
  switch (status) {
    case 'pending': return 'Waiting'
    case 'active': return 'Running'
    // Adding new status doesn't cause compile error!
  }
}
```

**Fix:**
```tsx
function handle(status: Status): string {
  switch (status) {
    case 'pending': return 'Waiting'
    case 'active': return 'Running'
    default:
      const _exhaustive: never = status
      throw new Error(`Unknown status: ${_exhaustive}`)
  }
}
```

## State Management Anti-patterns

### 1. Global State for Local Concerns

**Anti-pattern:** Everything in Redux/Zustand
```tsx
// Modal open state in global store - overkill
const { isModalOpen } = useStore()
```

**Fix: Local state for local concerns:**
```tsx
const [isOpen, setIsOpen] = useState(false)
```

**Rule of thumb:**
- URL state (nuqs) → Shareable, bookmarkable
- Global state (Zustand) → Cross-component, persisted
- Local state (useState) → Component-specific, ephemeral

### 2. Stale Closure in Event Handlers

**Anti-pattern:**
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    setCount(count + 1)  // Captures initial count
  }, 1000)
  return () => clearInterval(interval)
}, [])  // Missing count dependency
```

**Fix:**
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + 1)  // Functional update
  }, 1000)
  return () => clearInterval(interval)
}, [])
```

## Architecture Anti-patterns

### 1. Circular Dependencies

**Anti-pattern:**
```
utils.ts imports from components/Button.tsx
components/Button.tsx imports from utils.ts
```

**Fix: Dependency inversion, extract shared code**

### 2. Business Logic in Components

**Anti-pattern:**
```tsx
function OrderForm() {
  const calculateTotal = () => {
    // 50 lines of pricing logic
  }
  const validateOrder = () => {
    // 30 lines of validation
  }
  // UI mixed with logic
}
```

**Fix: Separate concerns:**
```tsx
// lib/orders/calculations.ts
export function calculateTotal(items: OrderItem[]): number

// lib/orders/validation.ts  
export const OrderSchema = z.object({...})

// components/OrderForm.tsx - UI only
function OrderForm() {
  const total = calculateTotal(items)
  // Clean UI code
}
```

### 3. God Files / Kitchen Sink

**Anti-pattern:** `utils.ts` with 2000 lines of unrelated functions

**Fix: Feature-based organization:**
```
lib/
  date/
    format.ts
    parse.ts
  currency/
    format.ts
  validation/
    schemas.ts
```

## Detection Checklist

### React
- [ ] No useEffect for derived state
- [ ] No index keys in dynamic lists
- [ ] No objects/arrays in dependency arrays
- [ ] Components under 300 lines
- [ ] No prop drilling beyond 2 levels

### TypeScript
- [ ] No `any` (use `unknown` + validation)
- [ ] No type assertions without validation
- [ ] Exhaustive switch statements
- [ ] Proper error types

### State
- [ ] Right tool for scope (local/URL/global)
- [ ] No stale closures in callbacks
- [ ] Optimistic updates use proper patterns

### Architecture
- [ ] No circular dependencies
- [ ] Business logic separated from UI
- [ ] Files under 400 lines
- [ ] Clear module boundaries
