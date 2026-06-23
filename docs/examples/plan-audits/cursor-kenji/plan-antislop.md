# Anti-Slop Burndown — cursor-kenji

_Audit-only deliverable from `plan-antislop`. Doc fixes from Phase 1 applied separately via `docs-writer`; visual/structure phases await approval._

## Scope

- Surfaces audited: [x] Prose  [x] Visual (README/markdown presentation)  [x] Code  [x] Structure
- Out of scope: Individual skill bodies (89 files — sampled + pattern-scanned; full per-skill prose pass is Phase 1b)
- Assumptions: No web UI; "visual" = README layout, badges, diagram density. Skill content is instructional prose, not marketing — different bar.

## Slop score (at a glance)

| Surface    | Findings | High-recognizability | Top quick win |
|------------|----------|----------------------|---------------|
| Prose      | 12       | 4                    | Sync skill counts (61/73/89 coexist) |
| Visual     | 6        | 3                    | Remove misleading React/Next stack badges from repo hero |
| Code       | 5        | 2                    | Extend `check-skill-count.mjs` to cover hero/install lines |
| Structure  | 9        | 5                    | README is 1,024 lines with 3 overlapping loop diagrams |

## Findings

### Prose & copy

| # | Location | Tell | Why it reads as AI | Recog | Effort | Direction |
|---|----------|------|--------------------|-------|--------|-----------|
| P1 | README.md:8 | "Every Cursor AI workflow you'd build yourself — already built." | Dual-clause marketing cadence; claims universality | High | S | State what ships: skills, commands, MCP templates, rules |
| P2 | README.md:26 | "production-ready toolkit of 61 Cursor agent skills" | Stale count + "production-ready toolkit" filler | High | S | Use filesystem count (89); drop "production-ready" or prove it once |
| P3 | README.md:157–158 | "Skills chain. Chains loop. Each loop pass levels up your codebase." | Chiasmus + gamification cadence | Med | S | One sentence: how bundles chain audits → plan → execute |
| P4 | README.md:842 | "The six `plan-*` skills" | Wrong count (16 exist); undermines trust | High | S | "Fourteen `plan-*` skills" + link to grouped loops in PLAN-LOOPS |
| P5 | docs/GETTING-STARTED.md:123 | "Six `plan-*` skills" | Same stale framing; new loops invisible | High | S | Point to PLAN-LOOPS groups (six-skill, hardening, spend, launch gates) |
| P6 | docs/PROMOTION.md:36,55 | "58 Cursor agent skills" | Copy-paste drift from old README | High | S | Single sourced count or "89+" with install date |
| P7 | package.json:4 | `"73 Cursor AI agent skills"` | npm metadata ≠ README ≠ hero | High | S | Align to `skills/` count via script or manual sync |
| P8 | docs/CATALOG.md:29 | `## Skills (73)` | Third canonical number | High | S | 89, or auto-generate heading from script |
| P9 | README.md:994–1017 | "Also by @kensaurus" app blurbs duplicated in GETTING-STARTED | Same four-app table twice; launch-pad not repo docs | Med | M | Keep once in README; GETTING-STARTED links out |
| P10 | README.md:311–312 | Recipe 3 paste prompt repeats enhance-web-ux/ui chain | Fine as recipe; adjacent sections already cover same chain 3× | Low | M | One canonical "de-slop a page" recipe; others link to it |
| P11 | skills/audit-db-schema/SKILL.md:4 | "robustness" in description | Filler vocab (ironic in anti-slop repo) | Low | S | "consistency and validation" |
| P12 | docs/CONTRIBUTING.md:113 | Intentional bad example uses "comprehensive… leverage… seamlessly" | Correct as anti-pattern demo — **not slop** | — | — | Keep; add note "example of what NOT to write" |

### Visual & UI (markdown / README presentation)

| # | Route/region | Tell | Recog | Effort | Direction |
|---|--------------|------|-------|--------|-----------|
| V1 | README.md:1–22 | Center-aligned hero + 8-badge wall (React 19, Next.js 15, Supabase…) | Default README template; badges describe *target stack*, not this repo | High | S | Replace stack badges with repo facts (89 skills, MIT, npm version) or move stack note to "Targets" section |
| V2 | README.md:6366f1 indigo badge | Tailwind default indigo — same palette as "AI slop" landing pages | Med | M | One brand color if any; or neutral gray badges only |
| V3 | README.md | Three large mermaid flowcharts (Improvement Loop, Six-skill plan, How It Fits, Daily workflow, Core iterate) | Card-grid monotony at doc scale — reader sees same arc five times | High | L | One primary diagram; link to PLAN-LOOPS + CATALOG for detail |
| V4 | README.md:404–524 | Seven `<details>` recipe blocks with identical "Paste into Cursor:" scaffolding | Symmetrical IA — every recipe same shape | Med | M | Top 3 recipes expanded; rest in CATALOG only |
| V5 | GETTING-STARTED.md:156 | Emoji in heading "Mushi Mushi 🐛" | Minor; consistent with README promo tone | Low | S | Optional: drop emoji in docs, keep in README promo |
| V6 | README.md:144 | What's Inside table: Skills **60** vs section **89** | Visual inconsistency — looks broken | High | S | Single number everywhere |

### Code

| # | path:line | Tell | Recog | Effort | Direction |
|---|-----------|------|-------|--------|-----------|
| C1 | scripts/check-skill-count.mjs:29–39 | Regex rules miss hero "61 agent skills", intro paragraph, tree comment | Script passes CI while README lies | High | M | Add rules for tagline, intro, `What's Inside` table, tree comment |
| C2 | README.md:876 | Tree comment `# 61 Agent Skills` | Stale generated tree | Med | S | Fix with count script or remove exact number from tree |
| C3 | README.md:678,688 | `workflow-housekeep` listed twice in Engineering + Product tables | Copy-paste duplicate row | Med | S | One row; cross-link |
| C4 | skills/enhance-readme/scripts/generate-readme-blocks.mjs:156 | `TODO short caption` default | Intentional for generated output | Low | — | OK for tool; document in skill |
| C5 | package.json vs README | Count drift across manifests | Maintainers can't trust any number | High | S | Derive package.json description from same script or CI gate |

### Structure & IA

| # | Location | Tell | Recog | Effort | Direction |
|---|----------|------|-------|--------|-----------|
| S1 | README.md (1024 lines) | Entire skill catalog inlined + CATALOG.md duplicates | Listicle-brain; two sources of truth | High | L | README = install + loops + taxonomy; CATALOG = full index |
| S2 | README.md | Six-skill plan loop section appears twice (lines ~202–246 and ~501–522) | Symmetrical scaffolding | High | M | Once + link to PLAN-LOOPS.md |
| S3 | README.md:532–722 | 190-line skill tables duplicate CATALOG | Empty completeness — maintain both or neither | High | L | Collapse to prefix table + "see CATALOG.md" |
| S4 | docs/GETTING-STARTED.md | Planning section covers only six-skill loop | Incomplete vs PLAN-LOOPS (14 skills, 4 loop groups) | Med | S | Short pointer to hardening / spend / launch gate loops |
| S5 | Repository tree in README | Lists ~50 skills in tree then "...50 more" | Template residue | Med | S | Shallow tree + link to `skills/` |
| S6 | No docs/README.md index | docs/ has 7 files; no map | Minor IA gap | Low | S | Add `docs/README.md` with one-line purpose per file |
| S7 | TRIGGER-CHEATSHEET vs CATALOG | Overlap by design; TRIGGER is leaner | OK if README doesn't also duplicate | Med | M | README links to TRIGGER for "say X → skill Y" |
| S8 | Design Principles table | Generic principles (Accessible by Default, Performance Aware) | Could be any repo | Low | S | Tie each principle to a skill or rule file |
| S9 | Alternatives section | Fine — not slop | Low | — | Keep |

## Phased burndown

- **Phase 1 — Copy & count integrity** → `docs-writer` / `workflow-housekeep`
  - P2, P4–P8, P5, P6, V6, C1, C2, C5 (counts + stale plan-skill framing)
  - **In progress:** partial fixes applied this session
- **Phase 2 — README de-duplication** → `docs-writer` / `workflow-housekeep` — **DONE (2026-06-23)**
  - README 1,020 → ~340 lines; CATALOG canonical; one workflow diagram; plan loops → PLAN-LOOPS; GETTING-STARTED deduped
- **Phase 3 — Visual identity** → `enhance-readme`
  - V1, V2 — hero badges and alignment
- **Phase 4 — Skill description hygiene** → `audit-i18n` / manual pass
  - P11 — scrub filler vocab in skill `description` fields (always-in-context)
- **Phase 4b — Code cleanup** → `workflow-housekeep`
  - C3 duplicate table row; extend CI count checks

## Execution handoff

Phase 1 doc fixes **applied** (2026-06-23): counts synced via extended `check-skill-count.mjs` (README, CATALOG, PROMOTION, package.json); GETTING-STARTED plan loops updated; `docs/README.md` added; duplicate `workflow-housekeep` row removed. Approve Phase 2 before restructuring README.

Re-run `plan-antislop` after Phase 2 to confirm slop score drops (target: README <500 lines, zero count mismatches).
