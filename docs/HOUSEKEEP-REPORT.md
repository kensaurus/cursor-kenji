# Housekeep Report — cursor-kenji

**Date:** 2026-06-24 · **Release:** 1.4.2 · **Scope:** npm / cursor.directory submission prep

## Configuration

- **Ecosystem:** Node.js (content pack, zero runtime dependencies)
- **Package manager:** npm
- **Framework:** Agent Skills + Cursor plugin manifest

## Phase 0: Submission blockers

| Item | Action | Verified |
|------|--------|----------|
| H1 `.mcp.json` missing from npm tarball | Added to `package.json` `files` | `npm pack --dry-run` lists `.mcp.json` |
| H2 MCP essential-5 drift | Playwright in template + docs; matches root `.mcp.json` | `npm run check:mcp-pins` |
| H3 Claude Code install parity | README labels Claude Code as `./install.sh` only | Manual review |
| H4 README accuracy | Terminology, rules count, shell helpers, MCP tier | `npm run check:skills` |

## Phase 1–2: Anti-slop copy

- Skill YAML: `audit-db-schema`, `workflow-housekeep`, `enhance-web-web3d`, `plan-rls-audit`
- Subagents (5): trigger-focused descriptions, persona lines removed
- Docs: CATALOG, PROMOTION, GETTING-STARTED opener/claim fixes
- README: badge trim (npm + license), workflow sentence, design principles row

## Phase 3: General cleanup

| Item | Action |
|------|--------|
| H5 `prepare` script | Removed — no git config mutation on consumer install |
| H7 orphan content | `notepads/`, `shell-aliases/` documented as clone-only in README layout |
| C1 caption placeholder | `TODO short caption` → `[add caption]` in enhance-readme script |
| S2 install matrix | Added to `docs/DISTRIBUTION.md` |
| S3 dual license | Apache-2.0 portions linked from README footer → NOTICE |
| `.gitignore` | Added `*.log`, `*.bak`, `*.old`, `*.orig`, `*.tmp` |

## Files modified (summary)

- `package.json`, `.cursor-plugin/plugin.json`, `.mcp.json` (unchanged content), `mcp/mcp.json.template`, `mcp/README.md`
- `README.md`, `CHANGELOG.md`, `docs/DISTRIBUTION.md`, `docs/CATALOG.md`, `docs/PROMOTION.md`, `docs/GETTING-STARTED.md`, `docs/CONTRIBUTING.md`
- `agents/*.md` (5), `skills/*/SKILL.md` (4), `.gitignore`
- `docs/examples/plan-audits/cursor-kenji/plan-antislop.md` (audit refresh)

## Files deleted

None.

## Requires manual follow-up

- **Rotate local `NPM_TOKEN`** if `.env` on disk still holds a real token (gitignored; not in repo)
- **Git hooks for contributors:** after clone, run `git config core.hooksPath .githooks` (no longer via npm `prepare`)
- **External listings:** awesome-cursorrules PR #320, skills.sh #1499, agentskills.io #432 — awaiting merge
- **Glama:** skipped (not an MCP server implementation)

## Verification

```bash
npm test          # pass
npm pack --dry-run  # 222+ files, .mcp.json present
```
