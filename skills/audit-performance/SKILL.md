---
name: audit-performance
description: >
  Audit and optimize application performance. Use when optimizing performance,
  debugging slow code, reducing load times, or when the user mentions performance issues.
  Integrates Sentry MCP for production performance data (Web Vitals, slow transactions),
  Firecrawl for researching current optimization techniques, and automated codebase analysis.
license: MIT
---

# Performance Audit Skill

Systematic approach to finding and fixing performance issues. Research-driven, data-backed.

## Step 0: Gather Performance Data

Before optimizing, measure. Collect data from multiple sources.

### Production Data (Sentry)

If Sentry performance monitoring is enabled, fetch real production metrics:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_events", arguments: {
 "organizationSlug": "<ORG_SLUG>",
 "projectSlug": "<PROJECT_SLUG>",
 "regionUrl": "<REGION_URL>",
 "naturalLanguageQuery": "slowest transactions by p95 duration in last 7 days",
 "limit": 20
})
```

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_events", arguments: {
 "organizationSlug": "<ORG_SLUG>",
 "projectSlug": "<PROJECT_SLUG>",
 "regionUrl": "<REGION_URL>",
 "naturalLanguageQuery": "web vitals LCP INP CLS performance scores in last 7 days",
 "limit": 20
})
```

Check for performance-related issues:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
 "organizationSlug": "<ORG_SLUG>",
 "projectSlugOrId": "<PROJECT_SLUG>",
 "regionUrl": "<REGION_URL>",
 "naturalLanguageQuery": "performance issues slow queries N+1 in last 30 days",
 "limit": 20
})
```

### Research Current Benchmarks

Fetch current performance targets:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
 "query": "web vitals thresholds good score <current year>",
 "limit": 3,
 "sources": [{ "type": "web" }]
})
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

## Frontend Performance Audit

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

## Backend Performance Audit

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

**Index verification:**
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

## Research-Driven Optimization

For specific performance bottlenecks, research current solutions:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
 "query": "<framework> <specific bottleneck> performance optimization <current year>",
 "limit": 5,
 "sources": [{ "type": "web" }]
})
```

Then deep-read the best result:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
 "url": "<best-result-url>",
 "formats": ["markdown"],
 "onlyMainContent": true
})
```

Check official framework docs via Context7:

```json
CallMcpTool(server: "context7", toolName: "resolve-library-id", arguments: {
 "libraryName": "<framework>",
 "query": "performance optimization"
})
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
