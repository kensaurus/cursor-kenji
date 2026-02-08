---
name: backend-patterns
description: Design robust backend architectures with modern patterns. Use when user wants "API design", "database schema", "authentication", "caching", "queues", "background jobs", "microservices", "serverless", or "backend architecture".
---

# Backend Patterns Skill

Design scalable, maintainable backend architectures using modern patterns and best practices.

## CRITICAL: Check Existing First

**Before implementing ANY backend pattern, verify:**

1. **Check existing architecture:**
```bash
ls -la src/server/ src/api/ app/api/ supabase/functions/ 2>/dev/null
cat package.json | grep -i "prisma\|drizzle\|supabase\|trpc"
```

2. **Check existing patterns:**
```bash
rg "createTRPCRouter|publicProcedure" --type ts -l
rg "'use server'" --type ts -l
ls -la supabase/migrations/*.sql 2>/dev/null | tail -5
```

3. **Check database setup:**
```bash
cat prisma/schema.prisma 2>/dev/null | head -50
cat supabase/config.toml 2>/dev/null
```

**Why:** Backend changes have wide impact. Understand existing architecture first.

## Server Actions (Next.js 15+)

### Basic Pattern
```tsx
// app/actions/users.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
})

type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export async function createUser(
  prevState: ActionResult<User> | null,
  formData: FormData
): Promise<ActionResult<User>> {
  // 1. Auth check
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' }
  }

  // 2. Validate input
  const result = CreateUserSchema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
  })

  if (!result.success) {
    return {
      success: false,
      error: 'Invalid input',
      fieldErrors: result.error.flatten().fieldErrors,
    }
  }

  // 3. Execute
  try {
    const user = await db.user.create({
      data: result.data,
    })

    revalidatePath('/users')
    return { success: true, data: user }
  } catch (error) {
    if (isPrismaError(error, 'P2002')) {
      return { success: false, error: 'Email already exists' }
    }
    console.error('createUser error:', error)
    return { success: false, error: 'Failed to create user' }
  }
}
```

### With Background Tasks
```tsx
'use server'

import { after } from 'next/server'

export async function createOrder(formData: FormData) {
  const order = await db.order.create({ data: { ... } })

  // Run after response sent (Next.js 15)
  after(async () => {
    await sendOrderConfirmation(order.id)
    await updateInventory(order.items)
    await notifyWarehouse(order.id)
  })

  revalidatePath('/orders')
  return { success: true, data: order }
}
```

## tRPC Setup

### Router Definition
```tsx
// server/api/routers/users.ts
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const usersRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { id: input.id },
      })
    }),

  create: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          ...input,
          createdById: ctx.session.user.id,
        },
      })
    }),

  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.user.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: 'desc' },
      })

      let nextCursor: string | undefined
      if (items.length > input.limit) {
        const nextItem = items.pop()
        nextCursor = nextItem?.id
      }

      return { items, nextCursor }
    }),
})
```

## Supabase Edge Functions

### Basic Function
```tsx
// supabase/functions/process-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify webhook signature
    const signature = req.headers.get('x-webhook-signature')
    if (!verifySignature(signature, await req.text())) {
      return new Response('Invalid signature', { status: 401 })
    }

    const payload = await req.json()

    // Create admin client (bypasses RLS)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Process webhook
    await supabase.from('events').insert({
      type: payload.type,
      data: payload.data,
    })

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

## Database Patterns

### Optimistic Locking
```sql
-- Add version column
ALTER TABLE orders ADD COLUMN version INT DEFAULT 1;

-- Update with version check
UPDATE orders 
SET 
  status = 'shipped',
  version = version + 1
WHERE id = $1 AND version = $2;
-- Returns 0 rows if version mismatch (concurrent update)
```

### Soft Deletes
```prisma
model Post {
  id        String    @id @default(cuid())
  title     String
  deletedAt DateTime?
  
  @@index([deletedAt])
}

// Query active records
const posts = await db.post.findMany({
  where: { deletedAt: null }
})

// Soft delete
await db.post.update({
  where: { id },
  data: { deletedAt: new Date() }
})
```

### Audit Logging
```sql
-- Audit table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, user_id)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) END,
    auth.uid()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to table
CREATE TRIGGER orders_audit
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

## Caching Patterns

### Next.js Cache
```tsx
// Cached fetch
const data = await fetch('https://api.example.com/data', {
  next: { 
    revalidate: 3600, // 1 hour
    tags: ['data']
  }
})

// Revalidate on demand
import { revalidateTag } from 'next/cache'
revalidateTag('data')

// unstable_cache for database queries
import { unstable_cache } from 'next/cache'

const getCachedUser = unstable_cache(
  async (id: string) => db.user.findUnique({ where: { id } }),
  ['user'],
  { revalidate: 3600, tags: ['users'] }
)
```

### Redis Caching
```tsx
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 3600
): Promise<T> {
  // Try cache
  const cached = await redis.get<T>(key)
  if (cached) return cached

  // Fetch and cache
  const data = await fetcher()
  await redis.set(key, data, { ex: ttl })
  return data
}

// Usage
const user = await getCachedData(
  `user:${id}`,
  () => db.user.findUnique({ where: { id } }),
  600 // 10 minutes
)
```

## Background Jobs

### Inngest
```tsx
// inngest/functions.ts
import { inngest } from './client'

export const processOrder = inngest.createFunction(
  { id: 'process-order' },
  { event: 'order/created' },
  async ({ event, step }) => {
    // Step 1: Validate inventory
    const inventory = await step.run('check-inventory', async () => {
      return await checkInventory(event.data.items)
    })

    if (!inventory.available) {
      await step.run('notify-out-of-stock', async () => {
        await notifyCustomer(event.data.userId, 'out-of-stock')
      })
      return { status: 'cancelled' }
    }

    // Step 2: Charge payment
    const payment = await step.run('charge-payment', async () => {
      return await chargeCustomer(event.data.paymentMethod)
    })

    // Step 3: Send confirmation
    await step.run('send-confirmation', async () => {
      await sendOrderConfirmation(event.data.orderId)
    })

    return { status: 'completed', paymentId: payment.id }
  }
)

// Trigger from server action
await inngest.send({
  name: 'order/created',
  data: { orderId, userId, items, paymentMethod }
})
```

### Trigger.dev
```tsx
// trigger/jobs.ts
import { client } from './client'

export const syncJob = client.defineJob({
  id: 'sync-data',
  name: 'Sync External Data',
  version: '1.0.0',
  trigger: intervalTrigger({ seconds: 3600 }), // Every hour
  run: async (payload, io, ctx) => {
    const data = await io.runTask('fetch-external', async () => {
      return await fetchExternalAPI()
    })

    await io.runTask('update-database', async () => {
      await db.externalData.upsert({
        where: { externalId: data.id },
        create: data,
        update: data,
      })
    })

    return { synced: data.length }
  },
})
```

## Rate Limiting

```tsx
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
})

export async function rateLimitedAction(userId: string) {
  const { success, limit, remaining, reset } = await ratelimit.limit(userId)

  if (!success) {
    return {
      success: false,
      error: 'Too many requests',
      retryAfter: Math.ceil((reset - Date.now()) / 1000),
    }
  }

  // Proceed with action...
}
```

## Validation

After implementing backend patterns:

1. **Error handling** → All errors caught, logged, safe response returned
2. **Auth checks** → Every mutation verifies authentication
3. **Input validation** → Zod schema on all inputs
4. **Rate limiting** → Sensitive endpoints protected
5. **Idempotency** → Critical operations handle retries
6. **Logging** → Structured logs without sensitive data
7. **Testing** → Unit tests for business logic, integration for APIs
