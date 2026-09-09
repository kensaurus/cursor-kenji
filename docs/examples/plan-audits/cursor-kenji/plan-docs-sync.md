# Docs Drift Sync — cursor-kenji

_Audit refreshed 2026-09-09. Code is source of truth. Jun 2026 HOUSEKEEP-REPORT is historical._

## Preservation contract

Docs describe current behavior. Unknowns stay `[NEEDS VERIFICATION]`. Stale living docs are corrected, not deleted. Historical snapshots get a banner.

## Drift counts

| Type | Count |
|------|------:|
| stale | 12 |
| missing | 4 |
| phantom | 5 |
| contradictory | 8 |
| onboarding-breaking | 5 |
| inline-rot | 2 |
| api-contract | 3 |

## Keep-working

143 agent skills + 12 Cursor skills = 155; 55 commands; 6 subagents; 20 `plan-*`; package/plugin/CHANGELOG 1.31.0. README `--all` / `--auto` / `--verify` match `bin/install.mjs`. Bare `./install.sh` is `--cursor --claude`.

## P0 burndown

| Location | Claim | Type | Code truth | Fix |
|----------|-------|------|------------|-----|
| GETTING-STARTED.md:226 | Cursor-only | onboarding-breaking | install.mjs:7–11 four tools | Match installer |
| SECURITY.md:35 | `npm run prepare` | phantom | package.json has no prepare | `git config core.hooksPath .githooks` |
| README.md:752–760 | essential 5 | api-contract | mcp.json.template: 3 servers | Firecrawl + Context7 + Supabase |
| README / DISTRIBUTION / SECURITY | Fill YOUR_* in essential | api-contract | essential uses ${env:…} | Env vars; YOUR_* only full template Slack/Notion |
| GETTING-STARTED.md:280 | #also-by-kensaurus | phantom | README #more-from-kensaurus | Retarget |
| PUBLISHING.md:33 | gh release v1.4.2 | onboarding-breaking | package.json 1.31.0 | Derive from package.json |

## P1–P3 (summary)

PROMOTION 1.19.1 + 128 drafts; PLAN-LOOPS dead skill-chaining hash; llms.txt GETTING-STARTED blurb; docs/CONTRIBUTING hand-edit README vs gen:skill-index; global rules 3 vs 5 .mdc; HOUSEKEEP / PLAN-SKILL-PACK leftover snapshots; THIRD-PARTY 112/36 log; command “no frontmatter”; DISTRIBUTION clone `--all` vs `./install.sh`; mushi install `[NEEDS VERIFICATION]`.

## Guardrails to add

`scripts/check-docs-facts.mjs`: essential MCP names ⊆ template; no `npm run prepare` in SECURITY; PROMOTION leftover 128 phrases; inbound heading slugs; version tokens from package.json.
