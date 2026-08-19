---
name: audit-performance
description: >
  Audit and optimize application runtime performance (Core Web Vitals, slow
  code, load time). Use when "slow page", "LCP/INP/CLS", or "optimize
  performance". JS payload → audit-bundle-size. Concurrent breaking point →
  test-load. Timeouts/retries → audit-resilience.
license: MIT
---

# Performance Audit Skill

**Degree of freedom: MIXED** — what to optimize `[HIGH freedom]`;
measure-first Sentry/vitals and `EXPLAIN` `[LOW freedom — run exactly]`.

> **Audit-and-fix exception.** Measure, then optimize. JS payload → `audit-bundle-size`. Breaking point → `test-load`. Timeouts/retries → `audit-resilience`.

## How to reason

1. **Observe** — quote LCP/INP/CLS, p95, or `EXPLAIN` / N+1 loop (`file:line`)
2. **Interpret** — is the user waiting on bytes, a query, or main-thread work?
3. **Classify** — vital-miss / N+1 / missing-index / bundle / image / re-render
4. **Severity** — poor LCP/INP or p95 >> target on a live path = Critical

## Worked example

> **Observe:** Sentry p95 `/users` = 2.3s; handler `findAll` then per-user
> `Order.findByUserId` (`app/api/users/route.ts:31`).
> **Interpret:** N+1; TTFB/LCP suffer on that page.
> **Classify:** N+1.
> **Severity:** Critical (p95 far over 200ms).
> **Finding:** `/users` | N+1 | eager-load orders | then re-measure

## Step 0: Gather Performance Data  [LOW freedom — run exactly]

Before optimizing, measure. Collect data from multiple sources.

### Production Data (Sentry)

If Sentry performance monitoring is enabled, fetch real production metrics:

```json
sentry:search_events
{
 "organizationSlug": "<ORG_SLUG>",
 "projectSlug": "<PROJECT_SLUG>",
 "regionUrl": "<REGION_URL>",
 "query": "slowest transactions by p95 duration in last 7 days",
 "limit": 20
}
```

```json
sentry:search_events
{
 "organizationSlug": "<ORG_SLUG>",
 "projectSlug": "<PROJECT_SLUG>",
 "regionUrl": "<REGION_URL>",
 "query": "web vitals LCP INP CLS performance scores in last 7 days",
 "limit": 20
}
```

Check for performance-related issues:

```json
sentry:search_issues
{
 "organizationSlug": "<ORG_SLUG>",
 "projectSlugOrId": "<PROJECT_SLUG>",
 "regionUrl": "<REGION_URL>",
 "query": "performance issues slow queries N+1 in last 30 days",
 "limit": 20
}
```

### Research Current Benchmarks

Fetch current performance targets:

```json
firecrawl:firecrawl_search
{
 "query": "web vitals thresholds good score <current year>",
 "limit": 3,
 "sources": [{ "type": "web" }]
}
```

---

## Performance Targets

### Core Web Vitals

| Metric | Good | Needs Work | Poor |
|--------|------|------------|------|
| **LCP** (Largest Contentful Paint) | <2.5s | 2.5-4s | >4s |
| **INP** (Interaction to Next Paint) | <200ms | 200-500ms | >500ms |
| **CLS** (Cumulative Layout Shift) | <0.1 | 0.1-0.25 | >0.25 |

### Other Key Metrics

- **TTFB** (Time to First Byte): <200ms
- **FCP** (First Contentful Paint): <1.8s
- **TTI** (Time to Interactive): <3.8s

---

## Frontend Performance Audit  [HIGH freedom]

### Bundle Size Analysis

```bash
npm run build -- --analyze # framework-specific
npx source-map-explorer 'dist/**/*.js'
```

**Checklist:**
- [ ] Total bundle <200KB gzipped
- [ ] No single chunk >100KB gzipped
- [ ] Tree shaking working (no unused exports in bundle)
- [ ] Heavy libraries lazy-loaded (charts, editors, maps)
- [ ] No moment.js (use date-fns or dayjs)
- [ ] No lodash full import (use lodash-es or specific imports)

### Code Splitting

- [ ] Route-based splitting (each page loads its own chunk)
- [ ] Component-level splitting for heavy components (`lazy()` / `dynamic()`)
- [ ] Below-fold content deferred

### Image Optimization

- [ ] WebP/AVIF format used (not PNG/JPEG for photos)
- [ ] Images sized appropriately (not serving 4K to mobile)
- [ ] `loading="lazy"` on below-fold images
- [ ] Responsive `srcSet` for different screen sizes
- [ ] Image CDN used (Cloudinary, imgix, Vercel Image Optimization)

### React Performance (if applicable)

- [ ] No unnecessary re-renders (React DevTools Profiler)
- [ ] `memo()` on expensive components that receive stable props
- [ ] `useMemo()` for expensive computations
- [ ] `useCallback()` for callbacks passed to memoized children
- [ ] Long lists virtualized (react-window, @tanstack/react-virtual)
- [ ] No inline object/array creation in JSX props
- [ ] Context providers scoped narrowly (not wrapping entire app for local state)

### CSS Performance

- [ ] No layout thrashing (reads before writes)
- [ ] Animations use `transform`/`opacity` (GPU-accelerated)
- [ ] No `@import` chains (bundled instead)
- [ ] Critical CSS inlined for above-fold content
- [ ] Fonts subset and preloaded (`<link rel="preload">`)

---

## Backend Performance Audit  [HIGH freedom]

### Database Queries

**N+1 Detection:**
```typescript
// BAD: N+1
const users = await User.findAll();
for (const user of users) {
 const orders = await Order.findByUserId(user.id);
}

// GOOD: eager loading
const users = await User.findAll({ include: [Order] });
```

**Checklist:**
- [ ] N+1 queries eliminated (eager loading, joins, batch loading)
- [ ] Indexes on frequently queried columns (WHERE, JOIN, ORDER BY)
- [ ] SELECT only needed columns (no `SELECT *`)
- [ ] Pagination on all list endpoints
- [ ] Connection pooling configured
- [ ] Slow query logging enabled

**Index verification:**  [LOW freedom — run exactly]
```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = '123';
```

### API Response Optimization

- [ ] Response compression enabled (gzip/brotli)
- [ ] Appropriate cache headers (`Cache-Control`, `ETag`)
- [ ] No over-fetching (return only what the client needs)
- [ ] Pagination for list endpoints
- [ ] Response time <200ms for p95

### Caching Strategy

| Layer | Tool | TTL | Use For |
|-------|------|-----|---------|
| Browser | Cache-Control headers | Varies | Static assets, API responses |
| CDN | Vercel/CloudFront/Cloudflare | 1h-1d | Static pages, images |
| API | Redis/Memcached | 5m-1h | Expensive queries, computed data |
| ORM | Query cache | 1m-5m | Repeated identical queries |

### Network Optimization

- [ ] CDN for static assets
- [ ] HTTP/2 or HTTP/3 enabled
- [ ] Preconnect to critical origins (`<link rel="preconnect">`)
- [ ] DNS prefetch for third-party domains
- [ ] API calls batched where possible (GraphQL, DataLoader)

---

## Research-Driven Optimization  [HIGH freedom]

For specific performance bottlenecks, research current solutions:

```json
firecrawl:firecrawl_search
{
 "query": "<framework> <specific bottleneck> performance optimization <current year>",
 "limit": 5,
 "sources": [{ "type": "web" }]
}
```

Then deep-read the best result:

```json
firecrawl:firecrawl_scrape
{
 "url": "<best-result-url>",
 "formats": ["markdown"],
 "onlyMainContent": true
}
```

Check official framework docs via Context7:

```json
context7:resolve-library-id
{
 "libraryName": "<framework>",
 "query": "performance optimization"
}
```

---

## Quick Wins (Highest Impact, Lowest Effort)

| Issue | Solution | Impact |
|-------|----------|--------|
| Large bundle | Code split routes, lazy load heavy libs | High |
| Slow images | WebP + lazy load + responsive | High |
| No caching | Add Cache-Control headers | High |
| N+1 queries | Eager load / batch | High |
| Missing indexes | Add database indexes | High |
| Unoptimized fonts | Subset + preload + font-display:swap | Medium |
| No compression | Enable gzip/brotli | Medium |
| Expensive re-renders | React.memo + useMemo | Medium |
| Layout shifts | Set explicit width/height on images/embeds | Medium |

---

## Self-critique before applying fixes  [LOW freedom — do not skip]

1. **Evidenced** — a measured vital, p95, or `EXPLAIN`, not "this looks slow"
2. **Reproducible** — same path still exceeds the target table
3. **Severity justified** — Critical = poor vital or live-path p95
4. **Right owner** — JS payload → `audit-bundle-size`; breaking point → `test-load`; timeouts → `audit-resilience`
5. **No-false-safety** — no `memo`/`useMemo` without a measured re-render; measure again after the fix

## Output: Performance Audit Report

```markdown
## Performance Audit: [Project Name]

### Production Metrics (from Sentry)
- LCP: [value] — [good/needs work/poor]
- INP: [value] — [good/needs work/poor]
- CLS: [value] — [good/needs work/poor]
- Slowest transactions: [list with p95 times]

### Critical Issues (fix immediately)
| # | Area | Issue | Impact | Fix |
|---|------|-------|--------|-----|
| 1 | DB | N+1 on /users endpoint | p95 = 2.3s | Eager load orders relation |

### Optimizations (prioritized)
| # | Area | Issue | Impact | Effort | Fix |
|---|------|-------|--------|--------|-----|
| 1 | FE | Bundle 450KB gzipped | High | Low | Code split routes |

### Already Optimized
- [list of performance areas that are well-implemented]

### Monitoring Recommendations
- [what to add to track performance over time]

### Research Sources
- [URL] — [what optimization pattern it provided]
```
