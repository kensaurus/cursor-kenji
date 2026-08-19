---
name: audit-fe-api
description: >
  Audit frontend API calls against backend implementation for contract alignment
  and network shape. Use when "API audit", "FE-BE contract", or "review frontend
  API integration". Live 4xx/5xx reproduction → debug-fe-be-integration.
license: MIT
---

# Frontend API Audit Skill

**Degree of freedom: MIXED** — Steps 0, 1, 3–6 `[HIGH freedom]`; Step 2
Sentry queries and schema SQL `[LOW freedom — run exactly]`.

## How to reason

1. **Observe** — quote the FE call site, BE route, and response/error
2. **Interpret** — does the contract match (path, method, params, types)?
3. **Classify** — missing route / mismatch / untyped / cache-gap / correct
4. **Severity** — 404/401/type-mismatch in prod = Critical; cache/prefetch = opportunity

## Worked example

> **Observe:** `useUser` GETs `/api/users/${id}`; no `app/api/users/[id]/route.ts`;
> Sentry 25× 404 in 14d.
> **Interpret:** FE calls a route the BE never registered.
> **Classify:** missing route (Critical).
> **Severity:** Critical — guaranteed 404.
> **Finding:** `hooks/useUser.ts` | GET `/api/users/:id` | Critical | no BE route.

## Self-critique before reporting  [LOW freedom — do not skip]

1. **Evidenced** — FE file + BE route or Sentry event, not "probably 500"
2. **Contract, not taste** — staleTime advice needs a freshness reason
3. **Severity justified** — Critical = broken contract in prod
4. **Right owner** — live 4xx/5xx repro → `debug-fe-be-integration`; DB shape → `audit-db-schema`
5. **Both sides named** — every mismatch lists FE file and BE path (or NOT FOUND)

---

## Step 0: Auto-Detect API Layer

### 0a. Detect Frontend Stack

| Dependency | Technology |
|------------|-----------|
| `@tanstack/react-query` | TanStack Query (React Query) |
| `swr` | SWR |
| `@reduxjs/toolkit` with `createApi` | RTK Query |
| `axios` | Axios HTTP client |
| `ky` | Ky HTTP client |
| `ofetch` or `$fetch` | Nuxt/ofetch |
| `@trpc/client` | tRPC (type-safe RPC) |
| `graphql-request` or `@apollo/client` | GraphQL |
| `openapi-fetch` or `openapi-typescript` | OpenAPI typed client |

### 0b. Detect Backend Stack


```
Glob: **/app/api/**/route.ts → Next.js App Router API routes
Glob: **/pages/api/**/*.ts → Next.js Pages Router API routes
Glob: **/src/routes/**/*.ts → Express/Hono/Fastify routes
Glob: **/server/api/**/*.ts → Nuxt server routes
Glob: **/src/app.py → Flask/Django
Glob: **/main.go → Go backend
```

### 0c. Find API Service Files

```
Glob: **/services/*api*.ts → API service files
Glob: **/services/*service*.ts → Service files
Glob: **/api/*.ts → API client files
Glob: **/hooks/use*.ts → Custom hooks (may contain API calls)
Glob: **/lib/api*.ts → API client config
Glob: **/features/*/api.* → Feature-specific API files
```

### 0d. Detect Dev Server Port

```
Grep: "dev" in package.json scripts → extract port (3000, 3001, 5173, 8080, etc.)
Grep: "PORT" in .env or .env.local
```

### 0e. Record Discovery

```
API LAYER DISCOVERY:
- HTTP client: [axios/fetch/ky/ofetch]
- State management: [TanStack Query/SWR/RTK Query/none]
- API style: [REST/GraphQL/tRPC]
- Backend framework: [Next.js API routes/Express/Hono/etc.]
- API service files: [list paths]
- API hooks: [list paths]
- Dev server: http://localhost:[port]
- API docs: [path or URL if detected]
```

---

## Step 1: Research API Best Practices

### 1a. Context7 — Library Documentation

```json
context7:resolve-library-id
{
 "libraryName": "<DETECTED_LIBRARY>",
 "query": "caching deduplication error handling best practices"
}
```

```json
context7:query-docs
{
 "libraryId": "<RESOLVED_ID>",
 "query": "staleTime cacheTime retry error handling optimistic updates"
}
```

Run for each major dependency (e.g., `@tanstack/react-query`, `axios`, `zod`).

### 1b. Firecrawl — Current API Patterns

```json
firecrawl:firecrawl_search
{
 "query": "<FRAMEWORK> API integration best practices [current year]",
 "limit": 5,
 "sources": [{ "type": "web" }]
}
```

| Topic | Query |
|-------|-------|
| Caching | `<state library> caching strategy staleTime production` |
| Error handling | `<framework> API error handling patterns retry` |
| Type safety | `<framework> type-safe API client OpenAPI Zod` |
| Performance | `frontend API request optimization batching deduplication` |

---

## Step 2: Check Production API Errors (Sentry)

### 2a. Find API-Related Production Errors

```json
sentry:search_issues
{
 "organizationSlug": "<ORG_SLUG>",
 "query": "API errors 4xx 5xx fetch axios network from the last 14 days",
 "projectSlugOrId": "<PROJECT_SLUG>",
 "regionUrl": "<REGION_URL>",
 "limit": 25
}
```

### 2b. Find Slowest API Calls

```json
sentry:search_events
{
 "organizationSlug": "<ORG_SLUG>",
 "projectSlugOrId": "<PROJECT_SLUG>",
 "regionUrl": "<REGION_URL>",
 "query": "transaction.op:http.client",
 "sort": "-duration",
 "limit": 15
}
```

### 2c. Cross-Reference with Frontend Code

For each Sentry error: identify the endpoint, `Grep` the FE caller, check error/retry/types.

---

## Phase 3: Discover Frontend API Calls

### 3a. Find All API Calls

Grep (not bash grep):

```
Grep: pattern "fetch\(|axios\.|api\.(get|post|patch|put|delete)" glob "*.{ts,tsx,js,jsx}"
Grep: pattern "useQuery|useMutation|useInfiniteQuery|useSuspenseQuery" glob "*.{ts,tsx}"
Grep: pattern "createApi|injectEndpoints" glob "*.{ts,tsx}"
```

### 3b. Create API Call Inventory


| File | Function/Hook | Method | Endpoint | Params | Used By |
|------|---------------|--------|----------|--------|---------|
| `services/user.ts` | `getUsers` | GET | `/api/users` | `page`, `limit` | `UserList.tsx` |
| `hooks/useUser.ts` | `useUser` | GET | `/api/users/:id` | `id` | `UserProfile.tsx` |

---

## Phase 4: Validate Against Backend

### 4a. Check Endpoint Existence

```
Grep: pattern "<ENDPOINT_PATH>" glob "*.{ts,js,py,go,rb}" — in backend source
```

App Router: `app/api/<path>/route.ts` must exist.

### 4b. Check Parameter Correctness

| Check | How |
|-------|-----|
| Required params sent | Compare FE call params with BE validation schema (Zod, Yup, Joi) |
| Naming convention match | FE camelCase vs BE snake_case — check if transform exists |
| Type match | FE sends string but BE expects number, or vice versa |
| Body shape match | Compare FE request body with BE expected schema |

### 4c. Verify Schema with Supabase MCP

If the backend reads from Supabase, verify the DB schema matches what the frontend expects:

```json
supabase:execute_sql
{
 "project_id": "<PROJECT_ID>",
 "query": "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = '<TABLE>' ORDER BY ordinal_position"
}
```

Compare columns/types to FE TypeScript interfaces.

---

## Phase 5: Identify Issues

### Critical Issues

| Issue | Impact | Detection |
|-------|--------|-----------|
| Endpoint does not exist | 404 errors | Grep backend for route — not found |
| Missing required parameter | 500/422 errors | Compare FE params with BE schema |
| Wrong HTTP method | 405 errors | FE uses GET, BE expects POST |
| Auth header missing | 401 errors | Check API client interceptor |
| Type mismatch | Runtime errors | FE interface vs BE response shape |

### Warnings

| Issue | Impact | Detection |
|-------|--------|-----------|
| Parameter name mismatch | Silently ignored params | camelCase vs snake_case comparison |
| Deprecated endpoint | Future breakage | Version markers in BE routes |
| Missing error handling | Poor UX | useQuery without error state handling |
| No loading state | Poor UX | No `isLoading` / `isPending` check |

### Optimization Opportunities

| Issue | Impact | Detection |
|-------|--------|-----------|
| Duplicate requests | Wasted bandwidth | Same queryKey in multiple components |
| No caching configured | Slow UX | `staleTime` not set (default 0) |
| No request batching | Too many requests | N+1 query pattern in lists |
| Missing prefetch | Slow navigation | No prefetchQuery on hover/focus |
| No optimistic updates | Slow mutations | Mutation waits for server response |

---

## Phase 6: Frontend Optimizations

### 6a. Caching Strategy

```typescript
// Per-query staleTime based on data freshness needs
const { data } = useQuery({
 queryKey: ['user', userId],
 queryFn: () => getUser(userId),
 staleTime: 1000 * 60 * 10, // User data: 10 minutes
});

const { data: settings } = useQuery({
 queryKey: ['settings'],
 queryFn: getSettings,
 staleTime: Infinity, // Settings rarely change
});
```

### 6b. Optimistic Updates

```typescript
const mutation = useMutation({
 mutationFn: updateUser,
 onMutate: async (newData) => {
 await queryClient.cancelQueries({ queryKey: ['user', userId] });
 const previous = queryClient.getQueryData(['user', userId]);
 queryClient.setQueryData(['user', userId], newData);
 return { previous };
 },
 onError: (_err, _newData, context) => {
 queryClient.setQueryData(['user', userId], context?.previous);
 },
 onSettled: () => {
 queryClient.invalidateQueries({ queryKey: ['user', userId] });
 },
});
```

### 6c. Prefetching

```typescript
const prefetchUser = (userId: string) => {
 queryClient.prefetchQuery({
 queryKey: ['user', userId],
 queryFn: () => getUser(userId),
 });
};

// On hover or focus
<Link onMouseEnter={() => prefetchUser(userId)} to={`/users/${userId}`}>
 View User
</Link>
```

### 6d. Error Handling

```typescript
const { data, error, isError, isLoading } = useQuery({
 queryKey: ['users'],
 queryFn: getUsers,
 retry: 3,
 retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
});

if (isLoading) return <Skeleton />;
if (isError) return <ErrorDisplay error={error} />;
if (!data?.length) return <EmptyState message="No users found" />;
```

### 6e. Response Validation (Zod)

```typescript
import { z } from 'zod';

const UserSchema = z.object({
 id: z.string().uuid(),
 email: z.string().email(),
 name: z.string(),
 createdAt: z.string().datetime(),
});

type User = z.infer<typeof UserSchema>;

const getUser = async (id: string): Promise<User> => {
 const response = await api.get(`/api/users/${id}`);
 return UserSchema.parse(response.data);
};
```

---

## Output Template

```markdown
## Frontend API Audit Report

**Audited:** [date]
**Framework:** [detected framework]
**API client:** [detected client]
**State management:** [detected library]

---

### Production Error Summary (Sentry)

| Endpoint | Error | Frequency | Has Error Handling |
|----------|-------|-----------|-------------------|
| [endpoint] | [error type] | [events/week] | [YES/NO] |

---

### Critical Issues (Must Fix)

#### 1. [Endpoint/File] — [Issue Type]
- **Current:** `[current implementation]`
- **Problem:** [description]
- **Fix:** `[correct implementation]`

---

### Warnings (Should Fix)

#### 1. [Issue description]
- **File:** `[file path]`
- **Impact:** [what could go wrong]
- **Recommendation:** [how to fix]

---

### Optimization Opportunities

#### 1. Caching
- **Missing staleTime:** [list endpoints]
- **Recommendation:** [suggested values per data type]

#### 2. Prefetching
- **Candidates:** [navigation links that could prefetch]

#### 3. Batching
- **N+1 patterns found:** [list]
- **Backend batch endpoint exists:** [YES/NO]

---

### API Inventory

| Endpoint | Method | Frontend File | Backend Route | Status | Notes |
|----------|--------|---------------|---------------|--------|-------|
| `/api/users` | GET | `user-service.ts` | `app/api/users/route.ts` | VALID | — |
| `/api/reports` | GET | `report-hook.ts` | NOT FOUND | MISSING | Remove or implement |

---

### Type Safety Status

| Service | Typed Response | Zod Validation | Notes |
|---------|---------------|----------------|-------|
| `user-service.ts` | YES | NO | Add runtime validation |
| `auth-service.ts` | Partial | NO | Missing error response types |

---

### Research Findings Applied
- [Pattern]: [how it applies]
- [Best practice]: [gap identified]

---

### Next Steps

1. [ ] Fix critical: [list]
2. [ ] Add missing parameters: [list]
3. [ ] Configure caching: [list with suggested staleTime values]
4. [ ] Add error handling: [files]
5. [ ] Add Zod validation: [services]
```

---

## Related

- `debug-fe-be-integration` — live 4xx/5xx reproduction from BE logs
- `audit-db-schema` — FE types vs DB columns
- `debug-sentry-monitor` — production error volume on the same endpoints
