---
name: audit-bundle-size
description: >-
  Analyse and shrink JavaScript bundle size for any web app. Auto-detects
  bundler (Vite, Webpack, Rollup, esbuild, Next.js, Turbopack). Runs a
  production build with bundle analysis, identifies the largest chunks,
  duplicate dependencies, non-tree-shakeable imports, and missing code-splitting
  or lazy-load boundaries. Researches current best practices via Firecrawl and
  Context7. Maps every finding to a specific file and import with before/after
  size estimates. Generic across any framework. Use when asked to "reduce bundle
  size", "analyse bundle", "tree shaking", "lazy loading", "code splitting",
  "slow initial load", "large JS", "chunk size", "build performance", "LCP
  caused by JS", "why is the bundle so big", or "first load JS too large".
license: MIT
---

# audit-bundle-size — Find and Eliminate Bundle Bloat

**Every kilobyte of JavaScript the browser must download, parse, and compile
before showing anything costs real users real time.** A large initial bundle is
the #1 avoidable cause of slow LCP and poor Core Web Vitals. This skill finds
exactly what is bloating it and tells you how to fix each item.

---

## Phase 0: Detect bundler and existing setup

```
package.json scripts.build   → build command and framework
vite.config.*                → Vite + rollupOptions
next.config.*                → Next.js (webpack / Turbopack)
webpack.config.*             → standalone Webpack
astro.config.*               → Astro (islands, Vite underneath)
```

Identify:
- **Bundler**: Vite / Webpack / Rollup / esbuild / Turbopack / Next.js built-in
- **Analyser available**: `rollup-plugin-visualizer`, `webpack-bundle-analyzer`,
  `@next/bundle-analyzer`, `source-map-explorer`
- **Framework**: Next.js (App / Pages), SvelteKit, Astro, Remix, Nuxt, Vite SPA

---

## Phase 1: Run a production build with analysis

### Vite / Rollup

If `rollup-plugin-visualizer` is not installed:
```bash
npm install --save-dev rollup-plugin-visualizer
```

Add temporarily to `vite.config.ts`:
```typescript
import { visualizer } from 'rollup-plugin-visualizer';
// in plugins array:
visualizer({ open: false, filename: 'dist/bundle-report.html', gzipSize: true })
```

Then build:
```bash
npm run build 2>&1 | tail -40
```

Read `dist/bundle-report.html` for the treemap, or parse `dist/stats.json` if
the plugin is configured to output JSON.

### Next.js

```bash
ANALYZE=true npm run build 2>&1 | tail -60
```

This requires `@next/bundle-analyzer` in `next.config.*`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({ /* your config */ });
```

Read the generated `client.html` report. Key number: **First Load JS** per route.
Next.js prints this in the build output — capture it for before/after comparison.

### If no analyser is installed

Use `source-map-explorer` on the build output:
```bash
npx source-map-explorer 'dist/**/*.js' --html dist/bundle-report.html
```

Or for a quick size summary:
```bash
find dist -name '*.js' | xargs ls -lh | sort -k5 -hr | head -20
find dist -name '*.css' | xargs ls -lh | sort -k5 -hr | head -5
```

---

## Phase 2: Parse the results — find the problems

For each chunk or entry point, record:

| Chunk | Raw size | Gzip size | Largest contributors |
|-------|----------|-----------|---------------------|
| main / page.js | ... | ... | [dep@version, ...] |
| vendor | ... | ... | [dep@version, ...] |

### Red flags to look for

| Problem | Signal | Impact |
|---------|--------|--------|
| One giant vendor chunk | Single `vendor.js` > 200 KB gzip | High — blocks first paint |
| Duplicate dependency | Same library listed twice (e.g. `lodash` + `lodash-es`) | Medium |
| Full library import | `import _ from 'lodash'` (imports everything) | High |
| Missing lazy routes | All routes in one bundle | High |
| Unused package | Large dep that appears in bundle but only 1–2 exports used | High |
| Dev-only dep in prod bundle | `faker`, `debug`, `chalk` in client code | Medium |
| Moment.js | 67 KB gzip with all locales | Medium — replace with date-fns or dayjs |
| Material UI / Ant Design full import | Full icon library loaded | High |
| `react-icons` full package | 50+ MB raw, huge when not tree-shaken | High |

---

## Phase 3: Research current alternatives

For the largest offenders, check current alternatives:
```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "replace <package-name> smaller alternative bundle size 2026",
  "limit": 3,
  "sources": [{ "type": "web" }]
})
```

Common swaps (research to confirm current state):
- `moment` → `date-fns` or `dayjs` (much smaller, tree-shakeable)
- `lodash` → native JS or `lodash-es` with named imports
- Full icon set → per-icon imports or SVG sprites
- `axios` → native `fetch` (if browser targets allow)
- Large chart libs → check if a lighter alternative exists for the charts used

---

## Phase 4: Fix — ordered by size saved

### Fix 1: Named imports (tree shaking)

```typescript
// Before — pulls in the whole library
import _ from 'lodash';
import { BellIcon } from '@heroicons/react/24/solid'; // only needs Bell

// After — only the export you need
import debounce from 'lodash/debounce';
import { BellIcon } from '@heroicons/react/24/solid'; // already correct for heroicons v2
```

For icon libraries that do not tree-shake well, use per-icon deep imports or
an SVG sprite sheet.

### Fix 2: Dynamic imports for routes (code splitting)

**Next.js App Router** — code-splits by route automatically. If you have heavy
components inside a page, split them:
```typescript
import dynamic from 'next/dynamic';
const HeavyChart = dynamic(() => import('../components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // if it uses browser-only APIs
});
```

**Vite / React Router:**
```typescript
const LazyPage = React.lazy(() => import('./pages/LazyPage'));
// Wrap in <Suspense fallback={<PageSkeleton />}>
```

**SvelteKit** — routes are code-split by default. For heavy components:
```svelte
{#await import('./HeavyComponent.svelte') then { default: Component }}
  <Component />
{/await}
```

### Fix 3: Replace or remove over-sized dependencies

Follow the research from Phase 3. For any replacement:
1. Read the new library's docs via Context7 or Firecrawl before touching code.
2. Make the swap in one file, run `npm run build`, compare sizes before merging everywhere.

### Fix 4: Bundle splitting configuration

**Vite** — split large deps into their own cacheable chunks:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'router': ['react-router-dom'],
        'charts': ['recharts'], // or whatever charting lib
      },
    },
  },
},
```

**Next.js** — configure `splitChunks` in `next.config.*` only if the default
chunking is creating sub-optimal splits. Prefer `dynamic()` over manual config.

### Fix 5: Remove dev-only packages from the client bundle

Any package that should only run server-side or in tests must not be imported
from client-side code. Move to `devDependencies` and verify it disappears from
the bundle after rebuild.

---

## Phase 5: Measure the improvement

After fixes, rebuild and re-run Phase 1:

```
Before: First Load JS = X KB gzip
After:  First Load JS = Y KB gzip
Saved:  Z KB (N%)
```

For each route (Next.js build output shows this), confirm the numbers improved.
Run a quick Playwright check to confirm the app still works:

```
browser_navigate → key routes
browser_snapshot → no blank screen or error
browser_console_messages → no new errors
```

---

## Quick-reference: size targets (2026)

| Asset | Target | Review if |
|-------|--------|-----------|
| Initial JS (gzip) | < 100 KB | > 250 KB |
| Route chunk (gzip) | < 50 KB | > 150 KB |
| CSS total (gzip) | < 20 KB | > 50 KB |
| Largest single image | < 200 KB | > 500 KB |
| Total page weight | < 500 KB | > 1.5 MB |
