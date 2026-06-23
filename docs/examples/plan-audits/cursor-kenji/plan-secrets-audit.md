# Secrets & Key-Scope Audit — cursor-kenji

_Audit-only. No key is rotated, moved, or scrubbed until each phase is approved._

## Scope

- **Scanned:** working tree (grep patterns), git history (sampled `-S` searches), tracked config templates
- **Deploy env:** not inspected (no Vercel/AWS config in repo)
- **Assumptions:** Local `.env` exists on developer machine (gitignored) — contents not read. GitHub Actions secrets not accessible from repo.

## Verdict

| Severity | Count | Worst case |
|----------|-------|-----------|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 2 | `.env.example` documents NPM_TOKEN; PROMOTION.md references GitHub secret setup |
| Low | 3 | Example tokens in docs; no pre-commit secret scanner |

## Findings

| # | Key type | Location | Scope bucket | In history? | Action | Sev |
|---|----------|----------|--------------|-------------|--------|-----|
| S1 | NPM_TOKEN | `.env.example:3` | never-client (publish) | placeholder only (`npm_your_token_here`) | OK — example shape | — |
| S2 | FIRECRAWL_API_KEY | `.mcp.json:11` | never-client | `${FIRECRAWL_API_KEY}` env ref | OK — not a literal secret | — |
| S3 | SUPABASE_ACCESS_TOKEN | `.mcp.json:34` | never-client | `${SUPABASE_ACCESS_TOKEN}` env ref | OK | — |
| S4 | MCP placeholders | `mcp/mcp.json.template` | never-client | `YOUR_*` literals | OK — templates | — |
| S5 | GitHub PAT example | `mcp/README.md:81,94` | never-client | `ghp_your_token_here` | OK — documentation | Low |
| S6 | `.gitignore` | `*.env`, `mcp.json` ignored | hygiene | — | **Note:** `.mcp.json` is **tracked** at repo root with env refs; user's `~/.cursor/mcp.json` is separate | Low |
| S7 | pre-commit hook | `.githooks/pre-commit` | hygiene | skill validation only | No secret scan | Med |
| S8 | PROMOTION.md | NPM_TOKEN in GitHub Actions secrets | ops doc | instructs adding org secret | OK for maintainers | — |
| S9 | skills/docs | `service_role`, `sk_` mentions | instructional | grep hits in plan/audit skills only | OK — not credentials | — |
| S10 | git history | `-S "ghp_"`, `-S "npm_"` on `.env` | — | no real tokens found in commits | OK | — |

## Cross-hand

- No Supabase `service_role` or Stripe `sk_live` in client-shipped files (this repo ships markdown + templates, not a web app bundle).
- If consumers copy MCP configs into projects, hand boundary review to `plan-input-validation` for their apps — out of scope here.

## Phased burndown

- **Phase 1 — Rotate exposed never-client secrets** → **none required**
- **Phase 2 — Relocate clean secrets** → document that real keys live only in `~/.cursor/mcp.json` and gitignored `.env`
- **Phase 3 — Hygiene** → `create-hook`
  - Add pre-commit secret scanner (gitleaks/trufflehog or custom pattern hook)
  - Extend `.gitignore` note: repo `.mcp.json` is a **shared template** with env var names — users must not commit filled values to forks
  - Align PROMOTION.md with `deploy-npm` OIDC-first guidance (NPM_TOKEN as fallback only)
- **Phase 4 — (optional) Scrub history** → not needed (no real secrets found)

## Execution handoff

Clean bill for open-source publication from a credentials perspective. Approve Phase 3 to add a secret-scanning pre-commit hook so future skill examples can't regress.

Cross-hand: N/A to `plan-rls-audit` (no Supabase project in this repo).
