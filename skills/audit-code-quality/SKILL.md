---
name: audit-code-quality
description: Detect and fix code anti-patterns, and audit codebase consistency. Use when reviewing code quality, fixing anti-patterns, enforcing naming conventions, standardising file organisation, onboarding to a codebase, or when user mentions "code smell", "anti-pattern", "technical debt", "inconsistent", "standardize", "cleanup codebase", "conventions", or "why is this slow/broken".
license: MIT
---

# Code Quality Audit

Two-in-one: (1) detect and fix React/TypeScript anti-patterns that cause bugs and performance issues, and (2) audit the whole codebase for naming, organisation, and pattern consistency.

## Before any change

```bash
cat CONTRIBUTING.md .cursor/rules/*.md 2>/dev/null | head -100 # existing conventions
git log --oneline -20 | grep -i "convention\|pattern\|style" # recent decisions
```

Verify the "inconsistency" isn't intentional. Check `git blame` before touching working code.

---

## Part 1 — Anti-patterns

### React

#### Props drilling → Context or composition
```tsx
// Bad: prop drilled through 5+ levels
<Layout user={user}><Sidebar user={user}><UserMenu user={user}><Avatar user={user} />

// Fix: context for global state
const UserContext = createContext<User | null>(null)
const useUser = () => useContext(UserContext)

// Fix: composition for UI concerns
<Layout><Layout.Sidebar><UserMenu /></Layout.Sidebar></Layout>
```

#### Derived state in `useState` → `useMemo`
```tsx
// Bad
const [items, setItems] = useState([])
const [filtered, setFiltered] = useState([])
useEffect(() => { setFiltered(items.filter(i => i.active)) }, [items])

// Fix
const filtered = useMemo(() => items.filter(i => i.active), [items])
```

#### `useEffect` for data fetching → Server Components or TanStack Query
```tsx
// Fix (Next.js 15 Server Component)
async function DataDisplay() {
 const data = await db.getData()
 return <div>{data.name}</div>
}

// Fix (client with TanStack Query)
const { data, isLoading } = useQuery({ queryKey: ['data'], queryFn: fetchData })
```

#### Object/array in dependency array → memoize or destructure
```tsx
// Bad: new object every render → infinite loop
useEffect(() => { doSomething(options) }, [options])

// Fix
const options = useMemo(() => ({ page, limit }), [page, limit])
useEffect(() => { doSomething(options) }, [options])
```

#### Index as key in dynamic lists → stable IDs
```tsx
// Bad
{items.map((item, i) => <Item key={i} />)}
// Fix
{items.map(item => <Item key={item.id} />)}
```

#### Giant component → composition
```tsx
// Split by responsibility
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
```

### TypeScript

```tsx
// Bad: any
function processData(data: any) { return data.items.map((i: any) => i.name) }

// Fix: proper types + Zod validation
const DataSchema = z.object({ items: z.array(z.object({ id: z.string(), name: z.string() })) })
function processData(data: z.infer<typeof DataSchema>) { return data.items.map(i => i.name) }

// Bad: enums (runtime object, not tree-shakeable)
enum Status { Pending = 'pending', Active = 'active' }
// Fix: union types
type Status = 'pending' | 'active'

// Fix: exhaustive switch
function handle(s: Status): string {
 switch (s) {
 case 'pending': return 'Waiting'
 case 'active': return 'Running'
 default:
 const _: never = s
 throw new Error(`Unknown: ${_}`)
 }
}
```

### State management

```tsx
// Rule of thumb:
// URL state (nuqs) → shareable, bookmarkable
// Global state (Zustand) → cross-component, persisted
// Local state (useState) → component-specific, ephemeral

// Stale closure fix
useEffect(() => {
 const id = setInterval(() => setCount(c => c + 1), 1000) // functional update
 return () => clearInterval(id)
}, [])
```

### Architecture

```
// Circular deps → extract shared code / dependency inversion
// Business logic in components → move to lib/feature/calculations.ts
// God files → feature-based organisation:
lib/
 date/format.ts
 currency/format.ts
 validation/schemas.ts
```

---

## Part 2 — Consistency audit

### Naming conventions

| Element | Expected | Check |
|---------|----------|-------|
| Components | PascalCase | `userCard` vs `UserCard` |
| Hooks | `use` prefix | `fetchData` vs `useFetchData` |
| Utils | camelCase | `format_date` vs `formatDate` |
| Constants | SCREAMING_SNAKE | `apiUrl` vs `API_URL` |
| Files | kebab-case | `UserCard.tsx` vs `user-card.tsx` |
| Boolean props | `is/has/should` | `loading` vs `isLoading` |

```bash
rg "export (function|const|class) [a-z]" --type tsx # lowercase component exports
rg "use[A-Z]" --type ts # hook patterns
rg "export default" --type tsx -l | head -20 # mixed default/named exports
```

### File organisation (feature-sliced)

```
src/
 features/{name}/
 components/ # UI only
 hooks/ # custom hooks
 server/ # server actions
 types.ts
 schemas.ts
 components/ui/ # shared primitives
 lib/ # global utilities
```

Red flags:
- Components in `/lib` or `/utils`
- Server actions in component files
- Types scattered across component files
- Zod schemas inline in components

```bash
rg "z\.object" --glob "*/components/*" # inline schemas
rg "'use server'" --glob "*/components/*" # actions in wrong place
rg "from '\.\." --type tsx | head -20 # relative imports instead of @/
```

### Pattern consistency

| Concern | Check |
|---------|-------|
| Server state | All TanStack Query, or mixed with useEffect? |
| Forms | All React Hook Form, or controlled inputs too? |
| Error handling | Consistent ActionResult shape? |
| Styling | cn() used everywhere? Dark mode via CSS vars? |
| Tests | `*.test.ts` vs `__tests__/`? Consistent mocking? |

---

## Coherency report template

```markdown
# Code Quality Audit

## Summary
- Overall score: X/10
- Critical issues: X

## Anti-patterns found
| Pattern | Files | Severity |
|---------|-------|----------|
| useEffect for data | 3 files | High |
| Index as key | 2 files | Medium |

## Naming convention issues
| Element | Expected | Actual | Files |
|---------|----------|--------|-------|
| Components | PascalCase | Mixed | 4 |

## Organisation issues
- Server actions found in: components/PaymentForm.tsx
- Types scattered in: 6 component files

## Priority fixes
1. Move server actions to features/*/server/
2. Replace useEffect data fetching with TanStack Query
3. Standardise component naming to PascalCase

## Conventions to document
1. Decision on default vs named exports
2. Where Zod schemas live
```

---

## Anti-pattern detection checklist

### React
- [ ] No `useEffect` for derived state
- [ ] No index keys in dynamic lists
- [ ] No objects/arrays in dependency arrays
- [ ] Components under 300 lines
- [ ] No prop drilling beyond 2 levels

### TypeScript
- [ ] No `any` (use `unknown` + validation)
- [ ] No unsafe type assertions
- [ ] Exhaustive switch statements
- [ ] Zod schemas for all external data

### Architecture
- [ ] No circular dependencies
- [ ] Business logic separated from UI
- [ ] Files under 400 lines
- [ ] Clear module boundaries

## Validation

1. Run TypeScript strict: `npx tsc --noEmit`
2. Run linter: `npx eslint src/`
3. Confirm no regressions: `npx vitest run`
4. Document any enforced standard in `CONTRIBUTING.md` or `.cursor/rules/`
