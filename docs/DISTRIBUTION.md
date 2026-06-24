# Distribution & discovery

Where cursor-kenji is published and how users find it.

## Install (always works)

| Channel | Command |
|---------|---------|
| **skills.sh** (recommended) | `npx skills add kensaurus/cursor-kenji` |
| **npm** | `npx @kensaurus/cursor-kenji` |
| **Git clone** | `git clone https://github.com/kensaurus/cursor-kenji.git && ./install.sh` |

Current npm version: see [npm package page](https://www.npmjs.com/package/@kensaurus/cursor-kenji) or `npm view @kensaurus/cursor-kenji version`.

## Official listings

| Directory | URL | Status |
|-----------|-----|--------|
| **npm** | https://www.npmjs.com/package/@kensaurus/cursor-kenji | Live @ 1.4.2 |
| **GitHub** | https://github.com/kensaurus/cursor-kenji | Source of truth |
| **Cursor Marketplace** | https://cursor.com/marketplace | Publisher application submitted — awaiting review |
| **cursor.directory** | https://cursor.directory/plugins/cursor-kenji | Submitted — pending security scan |
| **skills.sh index** | https://skills.sh | [Issue #1499](https://github.com/vercel-labs/skills/issues/1499) — awaiting merge |
| **awesome-cursorrules** | https://github.com/PatrickJS/awesome-cursorrules | [PR #320](https://github.com/PatrickJS/awesome-cursorrules/pull/320) — awaiting merge |
| **Agent Skills spec** | https://agentskills.io | [Issue #432](https://github.com/agentskills/agentskills/issues/432) — showcase request |
| **Enterprise DNA Skills dir** | https://enterprisedna.co/directories/submit | Submitted (Skills category; email draft) |

Track submission URLs and review status in [PROMOTION.md](PROMOTION.md).

## Machine-readable index

- **[llms.txt](../llms.txt)** — AI/crawler map of canonical docs
- **[docs/CATALOG.md](CATALOG.md)** — full skill list + trigger phrases
- **[docs/TRIGGER-CHEATSHEET.md](TRIGGER-CHEATSHEET.md)** — quick lookup

## What gets installed

### By install channel

| Channel | Cursor | Claude Code | Commands | Agents | Rules | MCP config |
|---------|:------:|:-------------:|:--------:|:------:|:-----:|:----------:|
| `npx skills add kensaurus/cursor-kenji` | Yes | No | Yes | Yes | Yes | Template copy if missing |
| `npx @kensaurus/cursor-kenji` | Yes | No | Yes | Yes | Yes | Template copy if missing |
| `./install.sh` (clone) | Yes | Yes | Yes | Yes | Yes | Template copy if missing |
| Cursor Marketplace / cursor.directory | Yes | No | Yes | Yes | Yes | `.mcp.json` at repo root |

The installer merges into:

- `~/.cursor/skills/` and `~/.agents/skills/` — agent skills (runtime)
- `~/.cursor/commands/` — slash commands
- `~/.cursor/agents/` — subagents
- `~/.claude/skills/`, `~/.claude/agents/`, `~/.claude/rules/` — Claude Code only (`./install.sh`)

MCP templates live in the repo under `mcp/` — copy `mcp/mcp.json.template` to `~/.cursor/mcp.json` and fill `YOUR_*` placeholders. See [mcp/README.md](../mcp/README.md).

## Maintainer release path

See [PUBLISHING.md](PUBLISHING.md) — GitHub Release → OIDC npm publish (no token required).
