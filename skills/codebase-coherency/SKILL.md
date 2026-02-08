---
name: codebase-coherency
description: Audit codebase for consistency and coherency issues. Use when checking naming conventions, file organization, pattern adherence, import styles, or when user mentions "inconsistent", "standardize", "conventions", "cleanup codebase", "why different patterns", or "onboarding to codebase".
---

# Codebase Coherency Skill

Systematic audit for consistency across naming, patterns, organization, and architecture.

## When to Use

- Onboarding to unfamiliar codebase
- Before major refactoring
- Code review for consistency
- Establishing or enforcing standards
- Resolving conflicting patterns

## CRITICAL: Check Existing First

**Before enforcing ANY convention, verify:**

1. **Check for existing conventions documentation:**
```bash
cat CONTRIBUTING.md README.md .cursor/rules/*.md 2>/dev/null | head -100
```

2. **Analyze the MAJORITY pattern (don't impose minority):**
```bash
# Count naming patterns
rg "export function [a-z]" --type ts | wc -l  # camelCase functions
rg "export function [A-Z]" --type tsx | wc -l  # PascalCase components
```

3. **Check for recent decisions:**
```bash
git log --oneline -30 | grep -i "convention\|pattern\|style"
```

4. **Verify before "fixing" inconsistencies:**
- Is the "inconsistency" intentional for a reason?
- Does changing it break imports elsewhere?
- Was there a migration in progress?

**Why:** Enforcing new conventions without understanding existing context creates churn. Document patterns, don't impose.

## Coherency Audit Framework

### 1. Naming Convention Audit

**Check for consistency in:**

| Element | Check | Common Issues |
|---------|-------|---------------|
| Components | PascalCase? | `userCard` vs `UserCard` |
| Hooks | `use` prefix? | `fetchData` vs `useFetchData` |
| Utils | camelCase? | `format_date` vs `formatDate` |
| Constants | SCREAMING_SNAKE? | `apiUrl` vs `API_URL` |
| Types/Interfaces | Prefixed? | `IUser` vs `User` vs `UserType` |
| Files | kebab or camelCase? | `UserCard.tsx` vs `user-card.tsx` |
| Folders | kebab-case? | `userProfile` vs `user-profile` |
| Boolean props | `is/has/should` prefix? | `loading` vs `isLoading` |

**Audit Command:**
```bash
# Find naming inconsistencies
rg "export (function|const|class) [a-z]" --type tsx  # lowercase exports
rg "use[A-Z]" --type ts  # hook patterns
```

### 2. File Organization Audit

**Expected Structure (feature-sliced):**
```
src/
  features/{name}/
    components/     # UI components
    hooks/          # Custom hooks
    server/         # Server actions
    types.ts        # Type definitions
    schemas.ts      # Zod schemas
    utils.ts        # Feature-specific utils
  components/ui/    # Shared UI primitives (@/components/ui)
  lib/              # Global utilities (@/lib)
  hooks/            # Shared hooks (@/hooks)
  types/            # Global types (@/types)
```

**Path Alias Convention:** Use `@/` prefix for absolute imports (configured in `tsconfig.json`).

**Red Flags:**
- [ ] Components in `/lib` or `/utils`
- [ ] Types scattered across component files
- [ ] Server actions in component files
- [ ] Hooks outside feature folders (unless shared)
- [ ] Zod schemas inline in components

### 3. Import Pattern Audit

**Check for:**
```typescript
// Consistent alias usage
import { Button } from '@/components/ui/button'  // ✓
import { Button } from '../../../components/ui/button'  // ✗

// Barrel exports vs direct imports
import { UserCard } from '@/features/users'  // ✓ if barrel exists
import { UserCard } from '@/features/users/components/UserCard'  // ✓ if no barrel

// Default vs named exports (pick one pattern)
export default function UserCard()  // Pattern A
export function UserCard()          // Pattern B (preferred)
```

### 4. Component Pattern Audit

**Check for consistent patterns:**

```tsx
// Props definition style - pick one:
type Props = { ... }                    // Type alias
interface Props { ... }                 // Interface
interface UserCardProps { ... }         // Prefixed interface

// Component definition - pick one:
export function UserCard(props: Props)  // Named function
export const UserCard = (props: Props) => ...  // Arrow function
export default function UserCard()      // Default export

// Props destructuring - pick one:
function UserCard({ name, email }: Props)  // In signature
function UserCard(props: Props) {          // In body
  const { name, email } = props
```

### 5. State Management Pattern Audit

**Check for consistent approach:**

| Concern | Pattern Used | Alternatives in Codebase |
|---------|--------------|--------------------------|
| Server state | TanStack Query | `useEffect` + `useState`? |
| Client state | Zustand | Context? Redux? |
| URL state | nuqs | manual `useSearchParams`? |
| Form state | React Hook Form | controlled inputs? |

**Red Flags:**
- Multiple state libraries for same purpose
- Mixed patterns (some TanStack Query, some useEffect fetching)
- Inconsistent form handling approaches

### 6. Error Handling Pattern Audit

**Check for consistent error handling:**

```typescript
// Server Actions - consistent return type?
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

// API responses - consistent shape?
{ data: T } | { error: { code: string; message: string } }

// Error boundaries - where placed?
// Try/catch patterns - consistent?
```

### 7. Type Definition Audit

**Check for:**
- Types near usage vs centralized
- Duplicate type definitions
- Consistent nullability (`null` vs `undefined`)
- Zod-inferred vs manual types

```typescript
// Derived types from Zod (preferred)
const UserSchema = z.object({ ... })
type User = z.infer<typeof UserSchema>

// vs duplicate manual types (avoid)
interface User { ... }
const UserSchema = z.object({ ... })  // Could drift
```

### 8. API Pattern Audit

**Server Actions:**
```typescript
// Consistent location?
// features/users/server/actions.ts ✓
// features/users/actions.ts ✓ (if only file)
// features/users/components/UserForm.tsx ✗ (mixed)

// Consistent signature?
export async function createUser(
  prevState: ActionState,
  formData: FormData
): Promise<ActionResult<User>>
```

**Route Handlers:**
```typescript
// Consistent error responses?
// Consistent authentication checks?
// Consistent validation patterns?
```

### 9. Styling Pattern Audit

**Check for consistency:**

| Pattern | Check |
|---------|-------|
| Tailwind | Using design system tokens? |
| CSS Modules | Naming convention? |
| cn() utility | Used consistently? |
| Dark mode | `dark:` classes or CSS vars? |
| Responsive | `sm/md/lg` breakpoint usage? |

```tsx
// Consistent className composition
className={cn(
  "base-classes",
  variant && variantClasses[variant],
  className
)}
```

### 10. Testing Pattern Audit

**Check for:**
- Test file location (`*.test.ts` vs `__tests__/`)
- Consistent test utilities
- Mock patterns
- Naming conventions for tests

## Coherency Report Template

```markdown
# Codebase Coherency Audit

## Summary
- **Overall Consistency Score**: X/10
- **Critical Issues**: X
- **Recommendations**: X

## Naming Conventions
| Element | Expected | Actual | Compliant |
|---------|----------|--------|-----------|
| Components | PascalCase | Mixed | ⚠️ |
| Hooks | useX | Consistent | ✓ |

## File Organization
- [x] Feature-sliced structure followed
- [ ] Some types scattered in components
- [ ] Server actions in wrong locations

## Patterns In Use
| Concern | Primary Pattern | Inconsistencies |
|---------|-----------------|-----------------|
| Server state | TanStack Query | 3 files use useEffect |
| Forms | React Hook Form | 2 forms use controlled |

## Priority Fixes
1. Standardize X pattern
2. Move Y files to correct location
3. Update Z naming

## Conventions to Document
1. [Pattern that needs documentation]
2. [Decision that needs recording]
```

## Quick Audit Commands

```bash
# Find inconsistent exports
rg "export default" --type tsx -l | head -20

# Find inline Zod schemas in components
rg "z\.object" --glob "*/components/*"

# Find server actions in component files
rg "'use server'" --glob "*/components/*"

# Find direct useState for server data
rg "useState.*\[\]" --glob "*.tsx" | rg -v "test"

# Check import alias usage
rg "from '\.\." --type tsx | head -20
```

## Establishing Standards

When patterns conflict, choose based on:
1. **Majority** - What's most common in the codebase?
2. **Recency** - What do newer files use?
3. **Best practice** - What does the community recommend?
4. **Tooling** - What does the linter/formatter enforce?

Document decisions in:
- `CONTRIBUTING.md` for human reference
- `.cursor/rules/` for AI assistance
- ESLint/Prettier for automated enforcement
