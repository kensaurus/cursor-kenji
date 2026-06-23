# Answer-Engine Readiness Audit — cursor-kenji

_Audit-only. Nothing changes until each phase is approved._

## Scope

- **Primary surfaces:** GitHub README (homepage), npm package page, skills.sh index, raw markdown in repo
- **No owned website** — `homepage` is `github.com/kensaurus/cursor-kenji#readme`; no `robots.txt`, CDN, or SSR layer under your control
- **Pages/routes audited:** README.md, docs/GETTING-STARTED.md, docs/CATALOG.md (headers), npm `@kensaurus/cursor-kenji`
- **Behind Cloudflare/CDN:** N/A (GitHub + npm hosting)
- **Assumptions:** AEO goal = cited when users ask Cursor/skills.sh/agent-skills questions; not classic SERP for a product landing page

## Verdict

| Area | Status | Worst gap |
|------|--------|-----------|
| AI crawler access | partial | No `llms.txt`; GitHub crawlable but repo doesn't optimize for it |
| Content extractability | weak | Answer buried after ~150 lines; no direct-answer-first opening |
| Authority levers | weak | Few cited stats; no expert attribution; long listicle README |
| Entity/consensus | partial | Strong npm/GitHub presence; no dedicated AEO monitoring baseline |

## Findings

| # | Page | Gap | Lever | Expected impact | Sev | Direction |
|---|------|-----|-------|-----------------|-----|-----------|
| A1 | repo root | No `llms.txt` | crawl access | Helps agents map skills/docs structure | Med | Add `llms.txt` pointing to CATALOG, GETTING-STARTED, PLAN-LOOPS |
| A2 | GitHub README | 1,020 lines before full picture; install buried below hero badges | extractability | LLMs may truncate or miss install command | High | Phase 2 README shrink (in progress) — lead with install + one-sentence purpose |
| A3 | README opening | No concise "what is this" answer in first 100 words | direct-answer-first | Citation probability for "what is cursor-kenji" queries | High | First paragraph: install command + skill count + target stack |
| A4 | README / docs | No FAQ-style Q&A blocks | schema / sub-query | Misses fan-out questions ("how many skills", "plan vs audit") | Med | Add FAQ section or JSON-LD if you add a docs site later; short FAQ markdown on GitHub now |
| A5 | README | Princeton levers absent — no cited statistics, expert quotes, or inline sources | authority (+41% / +30%) | Weaker citable density vs competitors | Med | Add 2–3 sourced stats (e.g. Agent Skills spec, skill count, validation gate) with links |
| A6 | docs/CATALOG.md | Canonical but not linked from a machine-readable index | llms.txt / structure | Secondary surface under-cited | Low | Reference in `llms.txt` and README docs index |
| A7 | npm page | Description synced (89 skills) but duplicates README without AEO structure | entity consistency | Align npm description with README lead sentence | Low | Single tagline across npm, README, skills.sh submit copy |
| A8 | — | No citation monitoring baseline | measurability | Can't prove AEO work helps | Med | Monthly prompt check: "best Cursor agent skills repo", "cursor-kenji skills" across ChatGPT/Perplexity/Claude |
| A9 | README "Also by" | Product promo blocks dilute toolkit answer | extractability | Noise for "cursor skills" queries | Low | Keep promo once at bottom (Phase 2); link out from GETTING-STARTED |
| A10 | GitHub | Cannot set per-repo robots for README rendering | crawl access | Accept platform defaults; optimize content not robots | — | N/A on GitHub; if you add kensaur.us landing, audit robots + Cloudflare AI-bot rules there |

## Phased burndown

- **Phase 1 — Unblock & expose** → `enhance-web-seo` / `docs-writer`
  - A2, A3 (README lead restructure — **Phase 2 antislop executing**)
  - A1 (`llms.txt` at repo root)
  - A6 (docs/README.md index — done)
- **Phase 2 — Structure & answer shape** → `docs-writer`
  - A4 (FAQ block in README or GETTING-STARTED)
  - Heading hierarchy pass on shrunk README
- **Phase 3 — Authority levers** → `docs-writer`
  - A5 — add sourced stats (agentskills.io spec, CSA slopsquatting stat in plan-dependency-provenance context, skill validation CI)
  - Inline links to official Cursor docs, skills.sh
- **Phase 4 — Entity/measure (advisory)** → off-site
  - A7 npm/skills.sh/cursor.directory consistency (see PROMOTION.md)
  - A8 citation monitoring cadence

## Execution handoff

README Phase 2 de-duplication directly addresses A2/A3/A9. Approve Phase 1 AEO items (`llms.txt`, FAQ) to execute after README lands.

Set citation-monitoring baseline **before** Phase 3 authority edits so improvement is measurable.
