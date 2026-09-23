---
name: docs-comparison-pages
description: >
  Write honest "X vs Y", "alternatives to X", and "migrate from X" pages from
  verified facts, each unique and dated for review. Use when "comparison
  page", "vs page", "alternatives to", "competitor page", or "migration guide
  from".
license: MIT
effort: high
---

# docs-comparison-pages — The pages buyers read last

**Degree of freedom: MIXED.** Which competitors and angles `[HIGH freedom]`;
fact verification, per-page uniqueness, and the freshness contract
`[LOW freedom — run exactly]`.

Apply-now. In one 162-page programmatic test, comparison pages were 28% of
the pages and took 78% of the clicks and six of seven leads. They also sit
squarely inside Google's scaled-content-abuse policy when generated in bulk.
This skill writes a few pages that survive both a buyer and a reviewer.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **docs-comparison-pages** (this) | Comparison / alternatives / migration page content and its freshness contract |
| `enhance-web-seo` | Title, meta, canonical, JSON-LD, sitemap for those pages |
| `plan-aeo-readiness` | Whether answer engines can read and cite them |
| `docs-writer` | Product docs and the migration steps' technical accuracy |
| `plan-antislop` | Voice audit when a page reads generated |
| `docs-launch-kit` | Launch posts — not evergreen pages |

Do **not** fire for "write a blog post about our launch" → `docs-launch-kit`.

## How to reason

1. **Query** — which bottom-funnel question does a real buyer type, and which alternative do they name?
2. **Facts** — every claim about the competitor comes from their current public page, dated
3. **Angle** — where is the product honestly better, honestly worse, and for whom
4. **Unique** — what on this page could not be pasted onto the next one
5. **Freshness** — who re-verifies competitor prices and features, and when

## Worked example

> **Query:** "mushi-mushi vs Sentry user feedback" — buyers name Sentry.
> **Facts:** Sentry pricing page fetched 2026-09-17; free tier limits quoted with the date; our limits from `pricing.ts`.
> **Angle:** better for in-app screenshot + reporter chat; worse for backend error grouping; for teams shipping web apps without a support desk.
> **Unique:** a side-by-side of one real bug report in both tools; the migration snippet from their SDK init to ours.
> **Freshness:** `lastVerified: 2026-09-17`, review quarterly; page shows "prices checked on …".

## Self-critique before reporting

- **Dated facts** — every competitor claim carries the fetch date and URL in the source block
- **Both directions** — the page names at least one thing the alternative does better
- **No template stamping** — two pages share structure, never paragraphs
- **Freshness contract** — `lastVerified` in frontmatter and a visible "checked on" line; review cadence recorded
- **Right owner** — meta/schema → `enhance-web-seo`; voice → `plan-antislop`

---

## Procedure

### 1. Choose pages  [HIGH freedom]

From `plan-gtm`'s alternatives list (or the founder), pick ≤5 pages to start:
`<product> vs <alt>`, `<alt> alternatives`, `migrate from <alt>`. One page per
real query; skip alternatives nobody compares against.

### 2. Verify facts  [LOW freedom — run exactly]

For each alternative: fetch its pricing page, feature/limits page, and docs this session (Firecrawl or WebFetch) — recognizing the product's name is not knowing its current prices or limits, so fetch even for products you know well. Record `URL · fetched date · quote` in a source
block at the bottom of the page. Product-side facts come from the repo
(`pricing`, limits, feature flags) with file references. Anything
unverifiable is omitted, not softened.

### 3. Write  [HIGH freedom — words; LOW freedom — shape]

Shape per page (order may vary, sections may not be skipped):

1. **Verdict in two sentences** — who should pick which.
2. **Comparison table** — 6–10 rows buyers care about; ✅/⚠️/❌ plus one clause each; prices with the checked-on date.
3. **Where the alternative wins** — honest, specific.
4. **Where this product wins** — with a screenshot or a real artifact.
5. **Migration** (migrate-from pages) — steps, code, data export/import, what does not carry over.
6. **FAQ** — 3–5 real objections (→ FAQ JSON-LD via `enhance-web-seo`).
7. **Sources** — the dated block from step 2.

Voice: first person plural, plain claims, no superlatives, no mannered prose (throat-clearing openers, stacked hedges, triplets for rhythm, a closing line that restates the paragraph). If a paragraph
could sit on another vendor's page, rewrite it.

### 4. Freshness contract  [LOW freedom — run exactly]

Frontmatter `lastVerified: YYYY-MM-DD`, `reviewEvery: 90d`; visible line
"Prices and limits checked on …". Add a repo reminder (issue, cron, or
`docs/launch` calendar row) for the next review. A page past its review date
gets re-verified or unpublished — never left stale.

### 5. Hand off

`enhance-web-seo` for title/meta/canonical/JSON-LD and sitemap;
`plan-aeo-readiness` if answer-engine citation is a goal; `test-playwright`
for the migration snippet where it is runnable.

## Guardrails

- **No bulk generation.** ≤5 pages per pass, each hand-checked; templated batches are the spam policy's target.
- **No trademark misuse.** Competitor names as plain text; their logos only with permission.
- **No invented weaknesses.** If you cannot cite it, it is not on the page.
- **Keep the loser's case.** A page with no "where they win" section is not published.

## Chains with

- **`plan-gtm`** → alternatives list and channel plan.
- **`enhance-web-seo`** → meta, schema, sitemap.
- **`plan-aeo-readiness`** → citation readiness.
- **`docs-launch-kit`** → announce a new comparison page in the next kit.
