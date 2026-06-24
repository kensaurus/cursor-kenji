# Anti-Slop Burndown — cursor-kenji

_Audit refreshed 2026-06-24 for npm / cursor.directory submission prep. Phases 0–3 executed in submission prep rollout._

## Scope

- Surfaces audited: [x] Prose  [x] Visual  [x] Code  [x] Structure
- Out of scope: Glama (not an MCP server); full per-skill body rewrite (89 files); individual skill bodies beyond YAML `description` fields
- Assumptions: No web UI; "visual" = README markdown presentation. Prior Jun 2026 refactor fixed stale counts and README bloat.

## Slop score (at a glance)

| Surface    | Findings | High-recognizability | Top quick win |
|------------|----------|----------------------|---------------|
| Prose      | 11       | 3 (fixed)            | YAML descriptions scrubbed |
| Visual     | 2        | 1 (fixed)            | Badge wall trimmed |
| Code       | 2        | 0                    | Caption placeholder fixed |
| Structure  | 3        | 0                    | Install channel matrix in DISTRIBUTION |

## Findings

### Prose & copy

| # | Location | Tell | Why it reads as AI | Recog | Effort | Status |
|---|----------|------|--------------------|-------|--------|--------|
| P1 | skills/audit-db-schema/SKILL.md:4 | YAML: "robustness" | Filler vocab; always-in-context | High | S | **Fixed** |
| P2 | skills/workflow-housekeep/SKILL.md:4 | "Comprehensive repo housekeeping" | Adjective padding | Med | S | **Fixed** |
| P3 | skills/enhance-web-web3d/SKILL.md:4 | "elevating an existing website" | Vague hype verb | Med | S | **Fixed** |
| P4 | skills/plan-rls-audit/SKILL.md:26-57 | Triads + "highest-leverage" | Empty symmetry cadence | Med | S | **Fixed** |
| P5 | agents/*.md (5) | "Expert… Proactively… senior specialist" | Agent persona boilerplate | High | S | **Fixed** |
| P6 | docs/CATALOG.md:3,287,350 | "Complete reference", "robustness", "Comprehensive QA" | README boilerplate + filler | Med | S | **Fixed** |
| P7 | docs/PROMOTION.md:3,45,150 | "Everything you need", "production-ready", hype title | Launch-pad filler | Med | S | **Fixed** |
| P8 | docs/GETTING-STARTED.md:11-13 | "production-tested workflow" | Unproved quality claim | Med | S | **Fixed** |
| P9 | README.md:127 | Arrow-chain cadence | Choreographed marketing arc | Med | S | **Fixed** |
| P10 | README.md:330 | "Production-ready examples" | Unproved adjective | Med | S | **Fixed** |
| P11 | mcp/README.md:40 | "Development Power-Ups" | Generic tier label | Med | S | **Fixed** |

### Visual & UI (README)

| # | Route/region | Tell | Recog | Effort | Status |
|---|--------------|------|-------|--------|--------|
| V1 | README L1-19 | 7-badge hero wall | High | S | **Fixed** (npm + license only) |
| V2 | README center-align | Uniform template layout | Low | — | Accepted for GitHub README |

### Code

| # | path:line | Tell | Recog | Effort | Status |
|---|-----------|------|-------|--------|--------|
| C1 | skills/enhance-readme/scripts/generate-readme-blocks.mjs:156 | `TODO short caption` | Med | S | **Fixed** |
| C2 | docs/CONTRIBUTING.md:113 | Intentional bad YAML example | — | — | **Kept** + HTML comment |

### Structure & IA

| # | Location | Tell | Recog | Effort | Status |
|---|----------|------|-------|--------|--------|
| S1 | docs/CATALOG.md (~90 entries) | Identical scaffold per skill | Med | L | Deferred (reference IA) |
| S2 | Install channels | npm vs bash vs Marketplace differ | Med | M | **Fixed** — DISTRIBUTION.md matrix |
| S3 | LICENSE + LICENSE-APACHE | Dual license | Low | S | **Fixed** — documented in README layout |

## Phased burndown

- **Phase 0 — Submission blockers** → housekeep — H1–H4 **Done**
- **Phase 1 — Copy pass** → docs-writer — P1–P8, P11 **Done**
- **Phase 2 — Visual + README prose** → docs-writer — V1, P9, P10, P7 **Done**
- **Phase 3 — Housekeep polish** → workflow-housekeep — H5, H7, C1, S2, S3, .gitignore **Done**
- **Phase 4 — Optional** → S1, full YAML sweep — **Deferred**

## Execution handoff

Re-run `plan-antislop` after Marketplace review if listing feedback requests catalog UX changes. Verify with `npm test` and spot-check agent/skill matching on trigger phrases.
