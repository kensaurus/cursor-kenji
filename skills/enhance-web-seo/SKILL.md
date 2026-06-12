---
name: enhance-web-seo
description: >-
  Audit and fix SEO for any web app. Checks meta tags, Open Graph and Twitter
  Card tags, JSON-LD structured data, robots.txt, sitemap.xml, canonical URLs,
  heading hierarchy, internal linking, and image alt text via Playwright against
  the live app. Measures Core Web Vitals (LCP, CLS, TBT) and links them to
  search ranking. Researches current Google guidelines via Firecrawl. Produces
  a prioritised fix list and applies changes. Generic across Next.js, Remix,
  SvelteKit, and any web framework. Use when asked to "improve SEO", "add meta
  tags", "fix search ranking", "add structured data", "sitemap", "canonical
  URLs", "Open Graph", "Google indexing", "rich results", "SEO audit", or
  "why is my site not ranking".
license: MIT
---

# enhance-web-seo — SEO Audit & Implementation

**Google does not rank pages it cannot read, understand, or trust.** This skill
finds every gap between your app and how search engines see it, then fixes them
in order of impact.

**Before ANY browser action, read `protocol-browser-anti-stall`.**

---

## Phase 0: Detect the stack

```
package.json        → Next.js Metadata API, remix-utils/seo, @vueuse/head, etc.
src/app/layout.tsx  → existing metadata export (Next.js App Router)
src/app/head.tsx    → legacy Head component
public/robots.txt   → existing robots config
public/sitemap.xml  → existing sitemap
```

Also check if a sitemap generator is configured (`next-sitemap`, `astro-sitemap`,
SvelteKit's `@sveltejs/adapter-static` sitemap, etc.).

---

## Phase 1: Live page audit (Playwright)

For every public-facing route, run the following:

### 1a. Navigate and capture head

```javascript
// browser_evaluate after browser_navigate
const seo = await page.evaluate(() => ({
  title: document.title,
  description: document.querySelector('meta[name="description"]')?.content,
  canonical: document.querySelector('link[rel="canonical"]')?.href,
  og_title: document.querySelector('meta[property="og:title"]')?.content,
  og_description: document.querySelector('meta[property="og:description"]')?.content,
  og_image: document.querySelector('meta[property="og:image"]')?.content,
  og_url: document.querySelector('meta[property="og:url"]')?.content,
  twitter_card: document.querySelector('meta[name="twitter:card"]')?.content,
  robots: document.querySelector('meta[name="robots"]')?.content,
  jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')]
            .map(s => s.textContent),
}));
```

### 1b. Heading hierarchy

```javascript
const headings = await page.evaluate(() =>
  [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .map(h => ({ tag: h.tagName, text: h.textContent.trim().slice(0, 60) }))
);
```

Rules: exactly one `<h1>` per page; `<h2>` never skips to `<h4>` without `<h3>`.

### 1c. Image alt text

```javascript
const images = await page.evaluate(() =>
  [...document.querySelectorAll('img')]
    .filter(img => !img.alt || img.alt.trim() === '')
    .map(img => img.src.slice(-60))
);
```

### 1d. Core Web Vitals

```javascript
// Measure LCP
const lcp = await new Promise(resolve => {
  new PerformanceObserver(list =>
    resolve(list.getEntries().at(-1)?.startTime)
  ).observe({ type: 'largest-contentful-paint', buffered: true });
  setTimeout(() => resolve(null), 5000);
});
const cls = await page.evaluate(() => {
  let clsScore = 0;
  new PerformanceObserver(list => {
    for (const entry of list.getEntries())
      if (!entry.hadRecentInput) clsScore += entry.value;
  }).observe({ type: 'layout-shift', buffered: true });
  return new Promise(r => setTimeout(() => r(clsScore), 2000));
});
```

Thresholds: LCP < 2.5 s ✅ / 2.5–4 s ⚠ / > 4 s ❌. CLS < 0.1 ✅ / 0.1–0.25 ⚠ / > 0.25 ❌.

---

## Phase 2: Technical SEO checks

### 2a. robots.txt

`browser_navigate` to `/robots.txt`. Check:
- File exists and returns 200 (not 404)
- No `Disallow: /` unless intentional (private app)
- Sitemap URL referenced: `Sitemap: https://yourdomain.com/sitemap.xml`
- No important pages accidentally blocked

### 2b. Sitemap

Navigate to `/sitemap.xml` or `/sitemap-index.xml`. Check:
- Exists and is valid XML
- Contains all important public routes (not just `/`)
- `<lastmod>` dates are current, not hardcoded to a past date
- No 404 or noindex pages included

### 2c. Structured data (JSON-LD)

Validate each JSON-LD block found in Phase 1a:
- `@context: "https://schema.org"` present
- `@type` matches the page content (Article, Product, Organization, WebSite, BreadcrumbList, FAQPage, etc.)
- Required fields for the type are present (check `references/structured-data-types.md`)
- No syntax errors in the JSON

### 2d. Canonical URLs

- Every page has a `<link rel="canonical">` pointing to its definitive URL
- No page canonicalises to a 404 or redirect
- Pagination: page 2+ should have canonical pointing to itself (not page 1)
- Duplicate content (www vs non-www, http vs https): one canonical, one redirect

---

## Phase 3: Research current best practices

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "Google SEO best practices Core Web Vitals ranking 2026",
  "limit": 3,
  "sources": [{ "type": "web" }]
})
```

Also check for framework-specific SEO guidance:
```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<framework> SEO metadata structured data 2026",
  "limit": 3,
  "sources": [{ "type": "web" }]
})
```

---

## Phase 4: Fix — ordered by impact

### Priority 1 — Page title and meta description (every page)

Every public page needs a unique, descriptive title (50–60 chars) and
meta description (150–160 chars).

**Next.js App Router:**
```typescript
// app/page.tsx
export const metadata: Metadata = {
  title: 'Specific Page Title — Brand Name',
  description: 'One or two sentences that describe this page for someone scanning search results.',
};
```

**Next.js dynamic routes:**
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const item = await fetchItem(params.id);
  return {
    title: `${item.name} — Brand Name`,
    description: item.summary,
    openGraph: { title: item.name, description: item.summary, images: [item.coverImage] },
  };
}
```

### Priority 2 — Open Graph and Twitter Card

Required for social sharing previews. Every page needs at minimum:
```typescript
openGraph: {
  title: 'Page Title',
  description: 'Page description',
  url: 'https://yourdomain.com/page',
  siteName: 'Brand Name',
  images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  type: 'website', // or 'article' for blog posts
},
twitter: {
  card: 'summary_large_image',
  title: 'Page Title',
  description: 'Page description',
  images: ['/og-image.png'],
},
```

### Priority 3 — robots.txt and sitemap

**robots.txt** (static file at `public/robots.txt`):
```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

**Sitemap** — use the framework's built-in generator where available:
- Next.js App Router: `app/sitemap.ts` returning `MetadataRoute.Sitemap`
- SvelteKit: `+server.ts` returning XML response
- Remix: `sitemap[.]xml.ts` resource route

### Priority 4 — Structured data (JSON-LD)

Add to the relevant page layout:
```typescript
// For a website home page
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Brand Name',
  url: 'https://yourdomain.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://yourdomain.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};
// Inject via: <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
```

### Priority 5 — Core Web Vitals fixes

See `audit-bundle-size` for JS bundle → LCP fixes.
For CLS: ensure images have explicit `width`/`height`, fonts use `font-display: swap`,
ads/embeds have reserved space.

---

## Phase 5: Verify with Playwright

After fixes, re-run Phase 1 checks on each modified page. Confirm:
- `document.title` and meta description match the intent
- OG tags present and well-formed
- JSON-LD valid (no JSON.parse errors)
- LCP improved or within threshold
- No new console errors introduced

---

## SEO audit checklist

```
Per page:
- [ ] Unique descriptive title (50–60 chars)
- [ ] Meta description (150–160 chars), not cut off
- [ ] Exactly one <h1>
- [ ] Heading hierarchy correct (no skipped levels)
- [ ] All images have alt text
- [ ] Canonical URL present and correct
- [ ] OG title, description, image
- [ ] Twitter card meta
- [ ] JSON-LD structured data where relevant

Site-wide:
- [ ] robots.txt exists and correct
- [ ] Sitemap exists and up to date
- [ ] No important pages noindexed accidentally
- [ ] HTTPS enforced, no mixed content
- [ ] LCP < 2.5 s
- [ ] CLS < 0.1
```
