---
name: performance-audit
description: Comprehensive web performance audit for Core Web Vitals and optimization. Use when analyzing page load times, bundle sizes, render performance, or when user mentions "slow", "performance", "LCP", "INP", "CLS", "bundle size", "loading time", "optimize", "Web Vitals", or "lighthouse score".
---

# Performance Audit Skill

Systematic methodology for auditing web application performance across Core Web Vitals, bundle analysis, and runtime performance.

## When to Use

- Analyzing slow page loads or poor user experience
- Preparing for production deployment
- Investigating Core Web Vitals issues
- Optimizing bundle sizes
- Debugging render performance issues

## CRITICAL: Check Existing First

**Before ANY performance optimization, verify:**

1. **Check existing optimizations:**
```bash
cat next.config.* vite.config.* 2>/dev/null | head -50
rg "dynamic\(|lazy\(|React.lazy" --type tsx -l
rg "useMemo|useCallback|React.memo" --type tsx -l | wc -l
```

2. **Check for existing monitoring:**
```bash
cat package.json | grep -i "web-vitals\|lighthouse\|bundle-analyzer"
rg "reportWebVitals|analytics" --type ts -l
```

3. **Check image optimization:**
```bash
rg "next/image|Image.*src=" --type tsx -l | head -10
ls -la public/images/ src/assets/ 2>/dev/null
```

4. **Check caching strategies:**
```bash
rg "Cache-Control|revalidate|unstable_cache" --type ts
cat vercel.json 2>/dev/null | head -20
```

**Why:** Don't optimize prematurely. Measure first, then optimize the actual bottlenecks.

## Audit Framework

### 1. Core Web Vitals Assessment (2024+ Standards)

| Metric | Good | Needs Improvement | Poor | What It Measures |
|--------|------|-------------------|------|------------------|
| **LCP** (Largest Contentful Paint) | ≤2.5s | 2.5s - 4s | >4s | Loading performance |
| **INP** (Interaction to Next Paint) | ≤200ms | 200ms - 500ms | >500ms | Interactivity (replaced FID in 2024) |
| **CLS** (Cumulative Layout Shift) | ≤0.1 | 0.1 - 0.25 | >0.25 | Visual stability |
| **TTFB** (Time to First Byte) | ≤200ms | 200ms - 500ms | >500ms | Server response |
| **FCP** (First Contentful Paint) | ≤1.8s | 1.8s - 3s | >3s | Initial render |

**Note:** INP replaced FID as a Core Web Vital in March 2024. Focus on INP for interactivity.

### 2. Bundle Analysis

**Check for:**
- Total bundle size (target: < 200KB gzipped for initial load)
- Code splitting effectiveness
- Tree shaking working properly
- Duplicate dependencies
- Large dependencies that could be lazy-loaded

**Commands:**
```bash
# Vite bundle analysis
npx vite-bundle-analyzer

# Webpack bundle analysis
npx webpack-bundle-analyzer stats.json

# Check package sizes
npx bundlephobia <package-name>
```

### 3. Network Performance

**Optimize:**
- Enable HTTP/2 or HTTP/3
- Use CDN for static assets
- Implement proper caching headers
- Compress assets (gzip/brotli)
- Preload critical resources
- Prefetch likely next pages

**Resource hints:**
```html
<link rel="preload" href="/critical.css" as="style">
<link rel="prefetch" href="/likely-next-page.html">
<link rel="preconnect" href="https://api.example.com">
```

### 4. JavaScript Performance

**Check for:**
- Long tasks blocking main thread (> 50ms)
- Memory leaks
- Excessive re-renders (React)
- Expensive computations on main thread

**Solutions:**
- Use `requestIdleCallback` for non-critical work
- Move heavy computation to Web Workers
- Implement virtualization for long lists
- Memoize expensive calculations
- Debounce/throttle event handlers

### 5. Image Optimization

**Checklist:**
- [ ] Use modern formats (WebP, AVIF)
- [ ] Implement responsive images (`srcset`)
- [ ] Lazy load below-fold images
- [ ] Specify width/height to prevent CLS
- [ ] Use image CDN for dynamic resizing
- [ ] Compress images appropriately

```html
<img
  src="image.webp"
  srcset="image-400.webp 400w, image-800.webp 800w"
  sizes="(max-width: 600px) 400px, 800px"
  width="800"
  height="600"
  loading="lazy"
  alt="Description"
>
```

### 6. CSS Performance

**Optimize:**
- Remove unused CSS
- Avoid `@import` (use bundler)
- Critical CSS inlined in `<head>`
- Avoid expensive selectors
- Use `contain` for layout isolation
- Hardware-accelerate animations

```css
/* Good: GPU-accelerated */
.animate {
  transform: translateX(100px);
  will-change: transform;
}

/* Avoid: triggers layout */
.animate {
  left: 100px;
}
```

### 7. React-Specific Optimizations (React 19+)

```tsx
// Memoize expensive components (or let React Compiler handle it)
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* render */}</div>
})

// Memoize expensive calculations
// Note: React Compiler (2025+) auto-memoizes, making this optional
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])

// Memoize callbacks (optional with React Compiler)
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])

// Virtualize long lists
import { useVirtualizer } from '@tanstack/react-virtual'

// React 19: Use `use` for async data in render
import { use } from 'react'

function Comments({ commentsPromise }) {
  const comments = use(commentsPromise)  // Suspends until resolved
  return <ul>{comments.map(c => <li key={c.id}>{c.text}</li>)}</ul>
}
```

**React 19 Performance Features:**
- `use()` hook for promises and context
- React Compiler auto-memoization
- Improved Suspense for streaming
- `useOptimistic` for instant UI updates

### 8. Server-Side Optimizations

- Enable compression (gzip/brotli)
- Implement proper caching (Cache-Control, ETag)
- Use edge caching (CDN)
- Optimize database queries
- Implement connection pooling
- Use streaming where possible

## Audit Report Template

```markdown
# Performance Audit Report

## Summary
- **Overall Score**: X/100
- **LCP**: Xs (Good/Needs Work/Poor)
- **INP**: Xms (Good/Needs Work/Poor)
- **CLS**: X.XX (Good/Needs Work/Poor)

## Critical Issues
1. [Issue description]
   - Impact: [High/Medium/Low]
   - Fix: [Recommendation]

## Bundle Analysis
- Total size: XKB (gzipped)
- Largest chunks:
  1. vendor.js - XKB
  2. main.js - XKB

## Recommendations (Priority Order)
1. [High priority fix]
2. [Medium priority fix]
3. [Low priority optimization]

## Estimated Impact
- Expected LCP improvement: -Xs
- Expected bundle reduction: -XKB
```

## Tools Reference

| Tool | Purpose |
|------|---------|
| Chrome DevTools Performance tab | Runtime profiling |
| Lighthouse | Comprehensive audit |
| WebPageTest | Real-world testing |
| `web-vitals` library | RUM metrics |
| React DevTools Profiler | React performance |
| `why-did-you-render` | Re-render debugging |

## Quick Wins Checklist

- [ ] Enable gzip/brotli compression
- [ ] Add proper Cache-Control headers
- [ ] Lazy load images below fold
- [ ] Code split routes
- [ ] Preload critical fonts
- [ ] Remove unused CSS/JS
- [ ] Optimize images to WebP
- [ ] Add `loading="lazy"` to iframes
- [ ] Use `font-display: swap`
- [ ] Defer non-critical JavaScript
