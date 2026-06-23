---
name: plan-aeo-readiness
description: >
  Audit a site for answer-engine / generative-engine visibility (citation by ChatGPT,
  Claude, Perplexity, Google AI Overviews), then produce a phased plan to improve AI
  citation probability. Use when the user says "do AI engines cite my site", "AEO", "GEO",
  "answer engine optimization", "show up in ChatGPT/Perplexity", "AI search visibility",
  "llms.txt", "am I blocking AI crawlers", or wants discoverability beyond classic Google
  ranking. Google-link/AI-citation overlap has dropped below 20%. Audits AI-crawler access
  (robots.txt, Cloudflare AI-bot defaults), SSR vs JS-hidden content, llms.txt, FAQ/HowTo/
  Speakable schema, direct-answer-first structure, Princeton citation levers (quotes, stats,
  inline citations). Plan only until approved. Pairs with enhance-web-seo, docs-writer,
  plan-antislop. Do NOT use for Google ranking / Core Web Vitals alone (enhance-web-seo).
license: MIT
---

# Answer-Engine Readiness Audit + Citation Plan

**Role:** Senior growth engineer + content strategist (AEO/GEO lens).

**Task:** Confirm AI crawler access first, audit content extractability and authority
levers per key page, phase remediations, emit `plan-aeo-readiness.md`. **Audit & plan
only — no robots.txt, schema, or copy edits until approved.**

**Find why AI engines don't cite you. Plan the fix. Change nothing until approved.**

Ranking #1 on Google no longer buys an AI citation. Overlap between top Google links
and AI-cited sources has **dropped from ~70% to below 20%**. LLM-referred visitors
convert markedly better than classic search traffic (~4.4x in one 2026 analysis).

This skill targets *LLM citation* — distinct from SERP rank (`enhance-web-seo`).

---

## When this fires

Trigger phrases: *"do AI engines cite me"*, *"AEO"*, *"GEO"*, *"answer engine
optimization"*, *"show up in ChatGPT/Perplexity"*, *"AI search visibility"*,
*"llms.txt"*, *"am I blocking AI crawlers"*.

Do **not** fire for: classic Google ranking or Core Web Vitals alone
(`enhance-web-seo`). For Google AI Overviews, classic ranking is still often a
prerequisite — note and hand that layer to `enhance-web-seo`.

---

## The audit

### A · Can AI even read the site?
- **robots.txt** — GPTBot, ClaudeBot, PerplexityBot, Google-Extended allowed?
- **CDN / Cloudflare** — default now blocks AI bots; verify if site is behind it.
- **SSR vs JS-hidden** — content behind client JS/login/paywall can't be cited.
- **llms.txt** — present? Recommend describing site structure for AI systems.

### B · Extractable & answer-shaped?
- **Direct-answer-first** — concise answer before context.
- **Heading hierarchy** — H1→H2→H3, one topic per section.
- **Schema markup** — FAQ, HowTo, Product, Review, Speakable JSON-LD valid.
- **Sub-query coverage** — answers likely fan-out sub-questions.

### C · Citable / authoritative? (Princeton GEO levers)
- **Expert quotes / attribution** (~+41% citation probability).
- **Statistics & data** (~+30%).
- **Inline citations** to authoritative sources (~+30%).
- **No keyword stuffing** (~-9%); hand AI-slop copy to `plan-antislop`.

### D · Entity & consensus (advisory)
- Brand consistency across crawled sources; platform presence gaps. Note only.

### E · Measurability
- Baseline citation monitoring across engines recommended.

---

## Procedure

1. **Crawl-access first** (A) — blocked bots = finding #1.
2. **Audit content shape & authority** (B, C) per key page.
3. **Note entity/measurability** (D, E).
4. **Score** by impact × effort.
5. **Emit `plan-aeo-readiness.md`. End the turn.**

---

## Guardrails

- **Plan only.** No robots.txt, schema, or copy edits.
- **Access before optimization.**
- **Don't promise rankings** — frame as citation frequency, not fixed rank.
- **Authenticity over gaming** — real expertise, not manufactured quote-stuffing.
- **Cross-hand copy** to `plan-antislop`.

---

## Report template — `plan-aeo-readiness.md`

```markdown
# Answer-Engine Readiness Audit — <site>

_Audit-only. Nothing changes until each phase is approved._

## Scope
- Pages/routes audited: …  | Behind Cloudflare/CDN: ☐

## Verdict
| Area | Status | Worst gap |
|------|--------|-----------|
| AI crawler access | ❌ | GPTBot blocked |
| Content extractability | partial | answers buried |
| Authority levers | weak | no stats/quotes |

## Findings
| # | Page | Gap | Lever | Sev | Direction |
|---|------|-----|-------|-----|-----------|

## Phased burndown
- **Phase 1 — Unblock & expose** → `enhance-web-seo` — robots, CDN, SSR, llms.txt
- **Phase 2 — Structure & schema** → `enhance-web-seo` — direct-answer-first, JSON-LD
- **Phase 3 — Authority levers** → `docs-writer` — stats, quotes, citations
- **Phase 4 — Entity/measure (advisory)** → off-site + monitoring baseline

## Execution handoff
Set citation-monitoring baseline before/after so improvement is measured.
```

---

## Chains with

- **Launch gates loop** — growth/discoverability; run alongside `plan-mobile-readiness`.
- **`enhance-web-seo`** — classic ranking underpins AI Overviews.
- **`plan-antislop`** — generic copy suppresses citation.
- **Execution:** `enhance-web-seo`, `docs-writer`, `enhance-web-landing`.
- **Verify:** prompt-test target queries across engines before/after.

> Plan with a strong model; execute with `composer-2.5-execution.mdc`.
