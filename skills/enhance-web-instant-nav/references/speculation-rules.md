# Speculation Rules — syntax

Official: https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API

## Actions

| Action | What it does | Use |
|--------|--------------|-----|
| `prefetch` | Fetch HTML (and often subresources) | Broad in-site links |
| `prerender` | Fully render in a hidden document | ≥ ~50% next-click pages only |

## Eagerness

| Value | When | Risk |
|-------|------|------|
| `conservative` | pointerdown | Lowest waste |
| `moderate` | hover ~200 ms / viewport heuristics | Default |
| `eager` | sooner | More waste |
| `immediate` | as soon as parsed | List rules only |

## Chrome limits (verify at implement time)

Prerender count and memory caps change. Prefer few prerender URLs.
`target_hint` can hint `_blank` vs `_self`.

## No-Vary-Search

Ignore tracking params so `/posts/1?utm_source=x` matches `/posts/1`:

```json
"expects_no_vary_search": "params=(\"utm_source\" \"utm_medium\" \"utm_campaign\")"
```

Or exclude `?` URLs entirely.

## Headers

Browser sends `Sec-Purpose: prefetch` (and `prerender` when prerendering).
Server must skip side effects on that header.

## Next.js 16.3 Instant Navigations

Opt-in suite (partial prefetch, navigation insights). If it covers the
case, skip custom prerender rules; keep moderate prefetch + `<Link>`.
