# Anti-Slop Burndown — cursor-kenji

_Audit refreshed 2026-09-09. Execution follows `plan-gtm-docs-sync`. Jun 2026 sample is historical._

## Scope

- Surfaces audited: [x] Prose  [x] Visual (markdown chrome)  [ ] Code  [x] Structure
- In scope: README.md, docs/GETTING-STARTED.md, docs/PROMOTION.md, docs/DISTRIBUTION.md, docs/CATALOG.md intro, llms.txt, docs/README.md
- Out of scope: 155 skill bodies, app UI, installer behavior

## Slop score (at a glance)

| Surface    | Findings | High-recognizability | Top quick win |
|------------|----------|----------------------|---------------|
| Prose      | 12       | 5                    | Drop ELI5 heading + kid columns |
| Visual     | 6        | 3                    | Strip family emoji; drop indigo badge |
| Code       | 0        | —                    | — |
| Structure  | 11       | 6                    | Move 155-skill dump below install |

## Findings

### Prose & copy

| # | Location | Tell | Recog | Effort | Direction |
|---|----------|------|-------|--------|-----------|
| P1 | README.md:20 | `Explain it like I'm five` | High | S | Product heading; keep a concrete 3-step if needed |
| P2 | README.md:8–10 | Dual-clause hero + italic closer | Med | S | One sentence: what + who |
| P3 | README.md:22–24 | sometimes/sometimes + box of recipes | Med | S | Lead with installable playbooks |
| P4 | README.md:89–97 | `five toys` + Kid explanation | High | S | Keep 5-row primitive table; drop toys/kid |
| P5 | README.md:116–122 | House / tires / seatbelts kid column | High | S | Keep Stage / families; delete Kid version |
| P6 | docs/GETTING-STARTED.md:11–13 | Phone-apps ELI5 + Without/With | Med | S | One sentence on auto-trigger |
| P7 | docs/GETTING-STARTED.md:144–145 | Dual-clause + em-dash reveal | Med | S | State the failure mode once |
| P8 | README.md:905–920 | Tsumagoi camp hero | High | M | One row under More from KENSAURUS |
| P9 | docs/PROMOTION.md:115–138 | Launch copy says 128, live count is 143 | High | S | Live filesystem count |
| P10 | llms.txt:3 | ~120-word restatement of hero + installer FAQ | Med | S | Two short lines |
| P11 | README.md:870 | FAQ restates the box-of-recipes hero | Low | S | Answer the install question only |
| P12 | README.md:907–909 | Three-beat ranch triad | High | S | Same as P8 |

### Visual & UI

| # | Route/region | Tell | Recog | Effort | Direction |
|---|--------------|------|-------|--------|-----------|
| V1 | README.md:1–3 | Centered indigo for-the-badge | High | S | Drop decorative badge; keep npm |
| V2 | README.md:5–16 | Centered H1 + italic + badges | Med | S | Left-align title + one line + npm/license |
| V3 | README.md:161–181 | Emoji family glance table | High | S | Text family names only |
| V4 | README.md:186–424 | Emoji on every family H3 | High | M | Strip in generate-skill-index.mjs |
| V5 | README ~20 identical tables | Table monotony | High | L | 1–2 phrase tables; rest → CATALOG |
| V6 | README.md:911–920 | Centered Tsumagoi OG + CTA | Med | S | Falls with P8 |

### Structure & IA

| # | Location | Tell | Recog | Effort | Direction |
|---|----------|------|-------|--------|-----------|
| S1 | README.md (945 lines) | Catalog + loops + manifesto + camp | High | L | First-visit: pitch + install + phrases + links |
| S2 | README.md:154–441 then :445 | 155-skill dump before Quick Start | High | M | Move SKILL-INDEX below install variants |
| S3 | README.md:101–124 vs :555–569 | Same loop twice | High | M | One loop |
| S4 | README + GETTING-STARTED | Three copies of say-this tables | High | M | One short phrase table on README |
| S5 | README vs CATALOG taxonomy | Duplicated prefix table | Med | S | README links to CATALOG |
| S6 | Install restated 6 times | Empty completeness | Med | M | Canonical install on README + DISTRIBUTION |
| S7 | README.md:445–475 | Quick Start repeats L34 | High | S | Flag list once |
| S8 | GETTING-STARTED.md:63–134 | Phrase dump before typical session | High | M | Session after Step 4 |
| S9 | GETTING-STARTED.md:280 | Dead `#also-by-kensaurus` | Med | S | `#more-from-kensaurus` |
| S10 | llms.txt:10 | Claims MCP/troubleshooting in GETTING-STARTED | Med | S | Describe the file that exists |
| S11 | README.md:838–901 | Design-principles + FAQ restating hero | Med | S | Shrink; keep Contributing + DISTRIBUTION |

## KEEP-WORKING

Install one-liner, kenji `--all` vs skills.sh `--all`, slopsquatting pin, Codex/Gemini mapping, CATALOG taxonomy, DISTRIBUTION matrix, GETTING-STARTED grill example.

## Phased burndown

- Phase 1 — Copy pass → docs-writer
- Phase 2 — Visual → generate-skill-index + README chrome
- Phase 3 — UX & flow → README / GETTING-STARTED IA
- Phase 4 — Guardrails → check-docs-facts.mjs
