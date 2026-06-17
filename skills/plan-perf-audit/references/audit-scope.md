# Audit Scope & Methodology

## Layers

### Web frontend
- **CWV:** LCP, CLS, INP — Lighthouse / web-vitals / RUM (not guessed)
- **Bundle:** total + per-route, code-split gaps, duplicate deps, lazy-load, tree-shaking
- **Render:** unnecessary re-renders, missing memo, unstable keys, un-virtualized lists, main-thread blocking work
- **Assets:** image format/size, lazy-load, third-party scripts, compression/CDN

### Mobile / React Native
- Cold start / TTI (target <2s mid-tier), Hermes, JS bundle size, re-renders, JSI/native for heavy work, lazy feature bundles, list virtualization, image caching
- **Mobile thresholds ~40% stricter than web CWV** (Indeed research pattern)

### Backend / API
- Slow endpoints (p95/p99), sync I/O, missing caching, over-fetching, unbounded payloads, missing pagination

### Data / Supabase
- N+1 queries, missing indexes (**EXPLAIN**, not guesses), sequential scans, `select *`, RLS slow filters, missing realtime SELECT policies, unbatched writes

## Methodology

1. **Measure first** — baselines per layer. No fix without baseline.
2. **Trace hot paths** — highest-traffic screens/endpoints/queries first.
3. **Root-cause** — tie slow metric to path:line or query.
4. **Quantify expected gain** where possible (e.g. code-split route → −340KB initial JS).

## Measurement commands (adapt)

```
npm run build -- --analyze   # or vite-bundle-visualizer
npx lighthouse <url> --only-categories=performance
npm audit bundle             # if configured
```

Supabase MCP: slow query logs, advisors. Sentry MCP: Web Vitals, slow transactions.

## Research-backed fixes (propose, don't implement)

**React:** route `lazy()`, `React.memo`/`useCallback`/`useMemo`, `react-window`, `startTransition`; SSR/hydration caveats.

**RN:** Hermes, JSI for heavy work, lazy feature bundles, cold start <2s mid-tier.

**Data:** verified indexes via EXPLAIN, projection-only selects, caching tiers, batched writes.

## Prevention guardrails

- Performance budgets: bundle size, image weight, third-party count, CWV — Lighthouse CI
- RUM (web-vitals) for real-user distribution, not just lab
- Re-measure after each fix (same tool, before/after)
