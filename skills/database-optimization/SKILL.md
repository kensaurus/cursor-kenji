---
name: database-optimization
description: Optimize database queries, schemas, and performance. Use when fixing slow queries, adding indexes, N+1 problems, schema design, RLS policies, or when user mentions "slow query", "database performance", "timeout", "index", "query optimization", "Prisma", "Supabase", or "PostgreSQL".
---

# Database Optimization Skill

Systematic approach to identifying and fixing database performance issues.

## When to Use

- Slow page loads (database bottleneck)
- Query timeout errors
- N+1 query problems
- Schema design review
- Index optimization
- Migration planning

## CRITICAL: Check Existing First

**Before ANY optimization, verify current state:**

1. **Check existing indexes:**
```sql
SELECT indexname, indexdef FROM pg_indexes 
WHERE schemaname = 'public' AND tablename = 'your_table';
```

2. **Check existing migrations:**
```bash
ls -la supabase/migrations/ | grep -i "index\|optim\|perf"
```

3. **Check if index already exists:**
```sql
SELECT 1 FROM pg_indexes WHERE indexname = 'your_proposed_index';
```

4. **Check Supabase advisors for current issues:**
- Use `get_advisors` MCP tool for performance/security
- Don't re-fix already addressed issues

**Why:** Duplicate indexes waste storage and slow writes. Always verify before adding.

## Performance Investigation

### 1. Identify Slow Queries

**Prisma - Enable query logging:**
```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
  ],
})

db.$on('query', (e) => {
  if (e.duration > 100) {  // Log queries > 100ms
    console.log(`Slow query (${e.duration}ms):`, e.query)
  }
})
```

**Supabase - Query analysis:**
```sql
-- Enable query stats
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Find slow queries
SELECT 
  query,
  calls,
  total_time / calls as avg_time_ms,
  rows / calls as avg_rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 20;
```

### 2. Common Performance Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| N+1 Queries | Many small queries | Use `include` / eager load |
| Missing Index | Slow WHERE/JOIN | Add index on filtered columns |
| Full Table Scan | Slow on large tables | Add index, limit results |
| Over-fetching | Slow response | Select only needed fields |
| No Pagination | Memory issues | Add cursor/offset pagination |

## N+1 Query Fix

**Problem: Fetching related data in loop**
```typescript
// Bad - N+1 queries
const posts = await db.post.findMany()
for (const post of posts) {
  const author = await db.user.findUnique({ where: { id: post.authorId } })
  // 1 query for posts + N queries for authors
}
```

**Solution: Eager loading**
```typescript
// Good - 2 queries total
const posts = await db.post.findMany({
  include: {
    author: true,
  },
})

// Or with select for specific fields
const posts = await db.post.findMany({
  include: {
    author: {
      select: { id: true, name: true, avatar: true }
    },
  },
})
```

**Supabase equivalent:**
```typescript
// Single query with join
const { data: posts } = await supabase
  .from('posts')
  .select(`
    *,
    author:users(id, name, avatar)
  `)
```

## Index Optimization

### When to Add Indexes

**Add index when column is used in:**
- `WHERE` clauses (filtering)
- `JOIN` conditions
- `ORDER BY` clauses
- Unique constraints

**Don't add index when:**
- Table is small (< 1000 rows)
- Column has low cardinality (few unique values)
- Column is rarely queried
- Table has heavy writes

### Index Types

```sql
-- Single column index
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- Composite index (order matters!)
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);

-- Unique index
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Partial index (index subset of rows)
CREATE INDEX idx_posts_published ON posts(created_at) 
WHERE published = true;

-- GIN index for JSONB/array
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- Full-text search
CREATE INDEX idx_posts_search ON posts 
USING GIN(to_tsvector('english', title || ' ' || content));
```

### Prisma Index Syntax

```prisma
model Post {
  id        String   @id @default(cuid())
  userId    String
  title     String
  status    Status
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
  
  // Single column index
  @@index([userId])
  
  // Composite index
  @@index([userId, createdAt(sort: Desc)])
  
  // Unique constraint (creates unique index)
  @@unique([userId, title])
}
```

## Query Optimization Patterns

### Select Only Needed Fields

```typescript
// Bad - fetches all columns
const users = await db.user.findMany()

// Good - fetches only needed
const users = await db.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
})
```

### Pagination

**Offset pagination (simple, but slow at high offsets):**
```typescript
const posts = await db.post.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' },
})
```

**Cursor pagination (better for large datasets):**
```typescript
const posts = await db.post.findMany({
  take: limit,
  skip: cursor ? 1 : 0,  // Skip cursor itself
  cursor: cursor ? { id: cursor } : undefined,
  orderBy: { createdAt: 'desc' },
})

// Return next cursor
const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null
```

### Batch Operations

```typescript
// Bad - individual inserts
for (const item of items) {
  await db.item.create({ data: item })
}

// Good - batch insert
await db.item.createMany({
  data: items,
  skipDuplicates: true,
})

// Good - transaction for related data
await db.$transaction([
  db.order.create({ data: order }),
  db.orderItem.createMany({ data: orderItems }),
  db.inventory.updateMany({ where: {...}, data: {...} }),
])
```

### Count Optimization

```typescript
// Get count without fetching data
const count = await db.post.count({
  where: { published: true },
})

// Combined with pagination
const [posts, count] = await db.$transaction([
  db.post.findMany({ where, take: limit, skip: offset }),
  db.post.count({ where }),
])
```

## Schema Design Best Practices

### Normalization vs Denormalization

**Normalize when:**
- Data changes frequently
- Data integrity is critical
- Storage is a concern

**Denormalize when:**
- Read performance is critical
- Data rarely changes
- Complex joins are slow

```sql
-- Normalized (separate table)
CREATE TABLE post_stats (
  post_id UUID PRIMARY KEY REFERENCES posts(id),
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0
);

-- Denormalized (same table)
ALTER TABLE posts 
ADD COLUMN view_count INT DEFAULT 0,
ADD COLUMN like_count INT DEFAULT 0;
```

### Efficient Data Types

```sql
-- Use appropriate types
id UUID DEFAULT gen_random_uuid()    -- vs TEXT for IDs
status VARCHAR(20)                   -- vs unlimited TEXT
price DECIMAL(10,2)                  -- vs FLOAT for money
created_at TIMESTAMPTZ               -- vs TIMESTAMP (include timezone)

-- Use enums for fixed values
CREATE TYPE status AS ENUM ('draft', 'published', 'archived');
```

### Soft Deletes

```prisma
model Post {
  id        String    @id
  deletedAt DateTime?
  
  @@index([deletedAt])  // Index for filtering
}

// Query pattern
const posts = await db.post.findMany({
  where: { deletedAt: null },
})
```

## Supabase-Specific Optimizations

### RLS Performance

```sql
-- Bad: Function call in RLS (slow)
CREATE POLICY "slow_policy" ON posts
FOR SELECT USING (
  user_id IN (SELECT user_id FROM team_members WHERE team_id = get_user_team())
);

-- Good: Direct comparison (fast)
CREATE POLICY "fast_policy" ON posts
FOR SELECT USING (user_id = auth.uid());

-- Good: Join-based (when needed)
CREATE POLICY "team_policy" ON posts
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = posts.team_id 
    AND team_members.user_id = auth.uid()
  )
);
```

### Edge Functions for Complex Logic

```typescript
// Move complex aggregations to Edge Functions
// instead of multiple round trips

// supabase/functions/dashboard-stats/index.ts
Deno.serve(async (req) => {
  const stats = await supabase.rpc('get_dashboard_stats', {
    user_id: userId
  })
  return new Response(JSON.stringify(stats))
})
```

## Query Analysis

### EXPLAIN ANALYZE

```sql
EXPLAIN ANALYZE
SELECT * FROM posts 
WHERE user_id = 'abc123' 
ORDER BY created_at DESC 
LIMIT 20;

-- Look for:
-- - Seq Scan (bad on large tables)
-- - Index Scan (good)
-- - Nested Loop (check if N+1)
-- - High actual time
```

### Key Metrics

| Metric | Target | Action if Exceeded |
|--------|--------|-------------------|
| Query time | < 100ms | Add index, optimize |
| Rows scanned | < 10x returned | Add index |
| Memory usage | < 256MB | Add LIMIT, pagination |
| Connection count | < pool size | Use connection pooling |

## Optimization Checklist

- [ ] Queries logged and monitored
- [ ] Indexes on filtered/joined columns
- [ ] No N+1 queries (eager loading)
- [ ] Pagination on all list endpoints
- [ ] Select only needed fields
- [ ] Batch operations where possible
- [ ] Connection pooling configured
- [ ] RLS policies optimized
- [ ] EXPLAIN ANALYZE on slow queries
- [ ] Appropriate data types used
