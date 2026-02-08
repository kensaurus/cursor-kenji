# Refactor Long Code

## Purpose
Refactor lengthy files into clean, maintainable code without truncating or omitting any functionality.

## Critical Rule
**NEVER truncate, omit, or summarize code with comments like `// ...rest of code`. Every line must be preserved or properly relocated.**

## Process

### 1. Analyze Current File
- Map all exports and dependencies
- Identify logical groupings
- Note all functionality

### 2. Split Into

| Type | Extract To |
|------|------------|
| Helper functions | `utils/` or `lib/` |
| Custom hooks | `hooks/` |
| Sub-components | Same folder or `components/` |
| Types/interfaces | `types/` |
| Constants | `constants/` |
| API calls | `services/` |
| Zod schemas | `schemas/` |
| Zustand stores | `stores/` |
| TanStack queries | `queries/` or `hooks/` |
| Config/env | `config/` |

### 3. Barrel Files

**Create `index.ts` in each folder:**
```tsx
export { Button } from './Button'
export type { ButtonProps } from './types'
```

**Usage:**
```tsx
// ✅ Clean
import { Button, Modal } from '@/components'

// ❌ Deep imports
import { Button } from '@/components/Button/Button'
```

### 4. Library-Specific Patterns

**Zod:**
- One schema per domain
- Export inferred types: `export type User = z.infer<typeof userSchema>`
- Reuse with `.extend()`, `.pick()`, `.omit()`

**Zustand:**
- One store per domain
- Separate state from actions interface
- Use selectors: `useStore(s => s.field)`

**TanStack Query:**
- Query key factories
- Co-locate queries/mutations
- Separate queryFn to services

### 5. Performance Patterns

**Memoization:**
```tsx
// Expensive computations
const filtered = useMemo(() => heavyFilter(items), [items])

// Stable callbacks passed to children
const handleClick = useCallback(() => {...}, [deps])

// Prevent re-renders
export const Child = memo(({ data }) => {...})
```

**Code Splitting:**
```tsx
// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'))

// Route-based splitting (TanStack Router)
const route = createRoute({ component: lazyRouteComponent(() => import('./Page')) })
```

### 6. Error Handling

**Error Boundaries:**
```tsx
// Wrap risky components
<ErrorBoundary fallback={<Error />}>
  <RiskyComponent />
</ErrorBoundary>
```

**Type Guards:**
```tsx
// Type-safe narrowing
const isUser = (data: unknown): data is User => userSchema.safeParse(data).success
```

**Consistent try/catch:**
```tsx
// services/api.ts - centralize error handling
export const api = {
  get: async <T>(url: string): Promise<Result<T>> => {
    try { ... } 
    catch (e) { return { error: parseError(e) } }
  }
}
```

### 7. Naming & Conventions

**Files:**
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- Types: `camelCase.types.ts` or `types.ts`
- Constants: `SCREAMING_SNAKE` values, `camelCase.ts` file

**Functions:**
- Handlers: `handleClick`, `onSubmit`
- Booleans: `isLoading`, `hasError`, `canSubmit`
- Fetchers: `fetchUsers`, `getUser`, `createUser`

### 8. Clean Code Patterns

**Early returns:**
```tsx
// ✅ 
if (!user) return null
if (loading) return <Spinner />
return <Content />

// ❌ Nested
if (user) { if (!loading) { return <Content /> } }
```

**Derived state (no redundant useState):**
```tsx
// ✅ 
const fullName = `${firstName} ${lastName}`

// ❌
const [fullName, setFullName] = useState('')
useEffect(() => setFullName(`${firstName} ${lastName}`), [firstName, lastName])
```

**Remove dead code:**
- Unused imports
- Commented-out code
- Unreachable branches
- Unused variables/functions

**No magic values:**
```tsx
// ✅
const MAX_RETRIES = 3
if (attempts >= MAX_RETRIES) {...}

// ❌
if (attempts >= 3) {...}
```

### 9. Separation of Concerns

**Container/Presentation:**
```tsx
// useUserPage.ts - logic
export const useUserPage = () => {
  const { data } = useUser(id)
  const handleSave = () => {...}
  return { user: data, handleSave }
}

// UserPage.tsx - presentation
export const UserPage = () => {
  const { user, handleSave } = useUserPage()
  return <UserForm user={user} onSave={handleSave} />
}
```

**Hooks for logic extraction:**
- 3+ related useState/useEffect → extract to hook
- Reusable logic → extract to hook
- Complex derived state → extract to hook

### 10. Refactor Steps

1. **Extract** one piece
2. **Move** to appropriate location
3. **Update** barrel file
4. **Import** via barrel
5. **Verify** unchanged behavior
6. **Repeat**

### 11. Checklist

- [ ] All functions exist (moved or in place)
- [ ] All exports available
- [ ] Barrel files updated
- [ ] Imports use barrels
- [ ] No `// ...` placeholders
- [ ] No functionality removed
- [ ] No behavior changed
- [ ] Memoization where needed
- [ ] Error handling consistent
- [ ] Dead code removed
- [ ] No magic values
- [ ] Naming conventions followed

## Large File Strategy

If file too large for single response:
1. Refactor in multiple passes
2. Each pass: extract 1-2 pieces
3. Show complete code for each extraction
4. Never summarize remaining code
5. State: "Pass 1 of N complete, continuing..."