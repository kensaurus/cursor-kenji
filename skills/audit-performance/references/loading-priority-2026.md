# Loading priority & speculation (2026)

Depth for `audit-performance` §Loading Priority & Speculation.
Implement instant navigations in `enhance-web-instant-nav`.

## LCP discoverability

The LCP resource must be in the first HTML. Failures:

- `loading="lazy"` on the hero
- CSS `background-image` (not a discoverable request)
- Client-only `<img>` after hydration
- Missing `fetchpriority="high"` / `<Image priority />`

Preload responsive LCP images:

```html
<link rel="preload" as="image" imagesrcset="…" imagesizes="…" fetchpriority="high">
```

## Fonts and CLS

`next/font` injects fallback metrics (`size-adjust`, `ascent-override`).
If you self-host `@font-face`, set those overrides or swap causes CLS.
Preload only the above-fold weight.

## 103 Early Hints

Emit on HTML only, ≤ ~5 hints: preconnect CDNs + preload LCP image + critical CSS.

```bash
curl -sv https://example.com/ 2>&1 | grep -E "< HTTP/.* 103"
```

Node: `res.writeEarlyHints({ link: [...] })`. CDN: Cloudflare/Fastly Early Hints
reads origin `Link` headers. See `enhance-web-instant-nav/references/early-hints.md`.

## Speculation Rules

Prefetch in-site links at `moderate`. Prerender only high-probability next pages.
Never speculate logout/cart/checkout/auth or GET-with-side-effects.
Guard servers with `Sec-Purpose` and clients with `document.prerendering`.

## bfcache

Blockers: `unload`, `Cache-Control: no-store` on HTML, open WebSocket/IDB at
`pagehide`. Test: DevTools → Application → Back/forward cache.

## Verification

```bash
npx @lhci/cli autorun --config=lighthouserc.json
```

Field p75 (CrUX/PSI) is pass/fail. Lab is diagnosis.

## Budgets

`budget.json` starter (fail the PR on regression):

```json
[{
  "path": "/*",
  "timings": [
    { "metric": "largest-contentful-paint", "budget": 2500 },
    { "metric": "cumulative-layout-shift", "budget": 0.1 },
    { "metric": "total-blocking-time", "budget": 200 }
  ],
  "resourceSizes": [
    { "resourceType": "script", "budget": 300 },
    { "resourceType": "image", "budget": 500 },
    { "resourceType": "third-party", "budget": 150 }
  ],
  "resourceCounts": [
    { "resourceType": "third-party", "budget": 5 }
  ]
}]
```

Definition of done for a perf PR: before/after field or lab numbers, LCP
element named, budgets green in CI.
