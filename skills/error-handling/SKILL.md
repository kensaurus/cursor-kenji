---
name: error-handling
description: Implement robust error handling patterns. Use when adding error handling, improving error UX, debugging error flows, standardizing error responses, or when user mentions "error boundary", "try/catch", "error state", "toast notification", "form validation error", or "API error handling".
---

# Error Handling Skill

Comprehensive error handling patterns for full-stack applications.

## When to Use

- Adding error handling to new features
- Improving error user experience
- Standardizing error responses
- Debugging error propagation
- Adding error monitoring

## CRITICAL: Check Existing First

**Before adding ANY error handling, verify:**

1. **Check for existing error types:**
```bash
rg "type.*Error|interface.*Error" --type ts
rg "ActionResult|ApiError" --type ts
```

2. **Check for existing error boundaries:**
```bash
ls -la app/error.tsx app/global-error.tsx
rg "ErrorBoundary" --type tsx
```

3. **Check for existing error utilities:**
```bash
rg "formatError|handleError|reportError" --type ts
ls -la src/lib/errors* src/lib/error* 2>/dev/null  # @/lib/errors
```

4. **Check established error response patterns:**
```bash
rg "success: false|error:" src/features/*/server/ --type ts | head -10
```

**Why:** Inconsistent error handling confuses users and complicates debugging. Always follow established patterns.

## Error Handling Layers

```
┌─────────────────────────────────────────┐
│  UI Layer                               │
│  - Error boundaries                     │
│  - Form validation errors               │
│  - Toast notifications                  │
├─────────────────────────────────────────┤
│  Application Layer                      │
│  - Server Action errors                 │
│  - API route errors                     │
│  - Business logic errors                │
├─────────────────────────────────────────┤
│  Data Layer                             │
│  - Database errors                      │
│  - Validation errors (Zod)             │
│  - External API errors                  │
└─────────────────────────────────────────┘
```

## Standard Error Types

```typescript
// types/errors.ts

// Base error shape
interface AppError {
  code: string          // Machine-readable: VALIDATION_ERROR
  message: string       // User-friendly message
  details?: unknown     // Additional context
}

// Action result pattern
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: AppError }

// Common error codes
const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const
```

## Server Action Error Handling

```typescript
// features/users/server/actions.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
})

export async function createUser(
  prevState: ActionResult<User>,
  formData: FormData
): Promise<ActionResult<User>> {
  try {
    // 1. Validate input
    const validated = CreateUserSchema.safeParse({
      email: formData.get('email'),
      name: formData.get('name'),
    })
    
    if (!validated.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: validated.error.flatten().fieldErrors,
        },
      }
    }
    
    // 2. Check authorization
    const session = await auth()
    if (!session) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Please sign in to continue',
        },
      }
    }
    
    // 3. Execute business logic
    const user = await db.user.create({
      data: validated.data,
    })
    
    revalidatePath('/users')
    
    return { success: true, data: user }
    
  } catch (error) {
    // 4. Handle known errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          success: false,
          error: {
            code: 'CONFLICT',
            message: 'A user with this email already exists',
          },
        }
      }
    }
    
    // 5. Log unknown errors, return generic message
    console.error('createUser error:', error)
    
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong. Please try again.',
      },
    }
  }
}
```

## Form Error Display (React 19+)

```tsx
// components/UserForm.tsx
'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createUser } from '@/features/users/server/actions'

// Separate submit button to use useFormStatus
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create User'}
    </button>
  )
}

export function UserForm() {
  const [state, action, isPending] = useActionState(createUser, null)
  
  // Get field errors from validation
  const fieldErrors = state?.success === false 
    ? state.error.details as Record<string, string[]>
    : {}
  
  return (
    <form action={action}>
      {/* Global error */}
      {state?.success === false && state.error.code !== 'VALIDATION_ERROR' && (
        <div role="alert" className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
          {state.error.message}
        </div>
      )}
      
      {/* Field with error */}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          className={fieldErrors.email ? 'border-red-500' : ''}
        />
        {fieldErrors.email && (
          <p id="email-error" className="text-red-600 text-sm mt-1">
            {fieldErrors.email[0]}
          </p>
        )}
      </div>
      
      <SubmitButton />
    </form>
  )
}
```

**React 19 Form Patterns:**
- `useActionState` - Form state with Server Actions
- `useFormStatus` - Pending state in child components
- `useOptimistic` - Optimistic UI updates
```

## React Error Boundaries

```tsx
// app/error.tsx (Next.js page error boundary)
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error('Page error:', error)
  }, [error])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
      <p className="text-muted-foreground mb-6">
        We're sorry, but something unexpected happened.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
      >
        Try again
      </button>
    </div>
  )
}

// app/global-error.tsx (root error boundary)
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  )
}
```

## API Route Error Handling

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validated = ProductSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            details: validated.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      )
    }
    
    const product = await db.product.create({ data: validated.data })
    
    return NextResponse.json({ data: product }, { status: 201 })
    
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: { code: 'INVALID_JSON', message: 'Invalid JSON body' } },
        { status: 400 }
      )
    }
    
    console.error('POST /api/products error:', error)
    
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
```

## TanStack Query Error Handling

```tsx
// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products')
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error?.message || 'Failed to fetch products')
      }
      return res.json()
    },
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error.message.includes('401') || error.message.includes('403')) {
        return false
      }
      return failureCount < 3
    },
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: ProductInput) => {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error?.message || 'Failed to create product')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product created')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
```

## Error State UI Components

```tsx
// components/ErrorState.tsx
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorState({ 
  title = 'Error', 
  message, 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  )
}

// Usage with TanStack Query
function ProductList() {
  const { data, error, isLoading, refetch } = useProducts()
  
  if (error) {
    return (
      <ErrorState
        title="Failed to load products"
        message={error.message}
        onRetry={() => refetch()}
      />
    )
  }
  
  // ...
}
```

## Error Logging & Monitoring

```typescript
// lib/error-reporting.ts

export function reportError(error: Error, context?: Record<string, unknown>) {
  // Development: log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error, context)
    return
  }
  
  // Production: send to monitoring service
  // Sentry example:
  // Sentry.captureException(error, { extra: context })
  
  // Or custom logging:
  fetch('/api/log-error', {
    method: 'POST',
    body: JSON.stringify({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {}) // Don't throw on logging failure
}
```

## Error Handling Checklist

### Server Side
- [ ] All Server Actions return `ActionResult<T>`
- [ ] Zod validation with user-friendly messages
- [ ] Known errors caught and mapped
- [ ] Unknown errors logged, generic message returned
- [ ] No sensitive info in error messages

### Client Side
- [ ] Error boundaries at page level
- [ ] Global error boundary for catastrophic failures
- [ ] Form field errors displayed inline
- [ ] Global errors shown in alert/toast
- [ ] Loading states during async operations
- [ ] Retry buttons where appropriate

### API
- [ ] Consistent error response shape
- [ ] Appropriate HTTP status codes
- [ ] Validation errors include field details
- [ ] Rate limiting with 429 response
- [ ] No stack traces in production

### Monitoring
- [ ] Error logging configured
- [ ] Alerts for critical errors
- [ ] Error rates tracked
- [ ] User-facing errors monitored
