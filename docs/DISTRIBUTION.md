# Distribution & discovery

Where cursor-kenji is published and how users find it.

## Install (always works)

| Channel | Command |
|---------|---------|
| **npm** (full pack) | `npx @kensaurus/cursor-kenji --all` |
| **skills.sh** (skills only) | `npx skills add kensaurus/cursor-kenji` |
| **Clone (four tools)** | `git clone … && node bin/install.mjs --all` |
| **Clone (Cursor + Claude)** | `git clone https://github.com/kensaurus/cursor-kenji.git && ./install.sh` |
| **Claude Code plugin** | `/plugin marketplace add kensaurus/cursor-kenji` then `/plugin install cursor-kenji@cursor-kenji` |

`npx skills add --all` is **not** the same as `npx @kensaurus/cursor-kenji --all`. The skills CLI `--all` means “every skill to every detected agent”. The kenji installer `--all` means Cursor + Claude Code + Codex + Gemini, including slash commands.

Current npm version: see [npm package page](https://www.npmjs.com/package/@kensaurus/cursor-kenji) or `npm view @kensaurus/cursor-kenji version`.

## Official listings

| Directory | URL | Status |
|-----------|-----|--------|
| **npm** | https://www.npmjs.com/package/@kensaurus/cursor-kenji | Live — `npm view @kensaurus/cursor-kenji version` |
| **GitHub** | https://github.com/kensaurus/cursor-kenji | Source of truth. Homepage set to the skills.sh page. 9 stars on 2026-09-09 |
| **Cursor Marketplace** | https://cursor.com/marketplace | **Not listed.** Publisher application submitted 2026-09-09 (awaiting Cursor review) |
| **Claude Code plugin (this repo)** | `/plugin marketplace add kensaurus/cursor-kenji` | Installable from the public GitHub repo. **Not** in Anthropic’s community catalog until they accept a submit |
| **Claude community marketplace** | https://platform.claude.com/plugins/submit | **Not submitted until this commit is on `main`.** Validate locally with `claude plugin validate .` |
| **cursor.directory** | https://cursor.directory/plugins/cursor-kenji | Page exists but **flagged / hidden** (`noindex`). Description updated 2026-09-09; full re-scan hit HTTP 413 |
| **skills.sh** | https://www.skills.sh/kensaurus/cursor-kenji | **Live** (2.9K installs on 2026-09-09). [Issue #1499](https://github.com/vercel-labs/skills/issues/1499) is leftover |
| **SkillsMP** | https://skillsmp.com/creators/kensaurus/cursor-kenji | **Live crawl** — pack page (they report 153 skills; our ratchet is 155). No submit form |
| **LobeHub** | https://lobehub.com/skills/kensaurus-cursor-kenji-backend-patterns | **Live crawl** of individual skills (no pack page) |
| **AgenticSkills catalog** | https://agenticskills.io/submit | Form accepted 2026-09-09; **not listed** yet. Review issue URL is not publicly resolvable |
| **awesome-cursorrules** | https://github.com/PatrickJS/awesome-cursorrules | [PR #320](https://github.com/PatrickJS/awesome-cursorrules/pull/320) still **open** |
| **VoltAgent awesome-agent-skills** | https://github.com/VoltAgent/awesome-agent-skills | [PR #1034](https://github.com/VoltAgent/awesome-agent-skills/pull/1034) **open** |
| **awesome-cursor-skills** | https://github.com/spencerpauly/awesome-cursor-skills | [PR #72](https://github.com/spencerpauly/awesome-cursor-skills/pull/72) **open** |
| **Agent Skills spec** | https://agentskills.io | Spec + client showcase only — **not a skill catalog**. [Issue #432](https://github.com/agentskills/agentskills/issues/432) closed with no listing |
| **Official MCP Registry** | https://registry.modelcontextprotocol.io/ | **Do not submit** — this pack ships MCP *templates*, not an MCP server ([registry about](https://modelcontextprotocol.io/registry/about)) |
| **Skills Directory** | https://www.skillsdirectory.com/submit | Not listed; their GitHub OAuth (Supabase) returned HTTP 402 egress quota 2026-09-09 |
| **explainx.ai** | https://explainx.ai/submit | Submitted 2026-09-09; **pending review** (not live) |
| **Awesome Skills** | https://awesomeskill.ai/ | No public submit form; no listing found |
| **Enterprise DNA Skills dir** | https://enterprisedna.co/directories/submit | Older notes claimed a submit — **not re-verified** 2026-09-09 |

Track submission URLs and review status in [PROMOTION.md](PROMOTION.md).

## Machine-readable index

- **[llms.txt](../llms.txt)** — AI/crawler map of canonical docs
- **[skills.sh.json](../skills.sh.json)** — groups the live skills.sh repo page ([docs](https://www.skills.sh/docs/customize))
- **[docs/CATALOG.md](CATALOG.md)** — full skill list + trigger phrases
- **[docs/TRIGGER-CHEATSHEET.md](TRIGGER-CHEATSHEET.md)** — quick lookup

## What gets installed

### By install channel

| Channel | Cursor skills | Claude Code | Commands | Agents | Rules | Completion hook | MCP config |
|---------|:------:|:-----------:|:--------:|:------:|:-----:|:---------------:|:----------:|
| `npx skills add kensaurus/cursor-kenji` | Yes (project `.agents/skills` by default; `-g` → `~/.cursor/skills`) | only with `-a claude-code` | No | No | No | No | No |
| `npx @kensaurus/cursor-kenji` (`--claude` / `--all` / `--auto`) | Yes | Yes (`--claude` / `--all` / `--auto`) | Yes | Yes | Yes | Cursor only | Template copy if missing |
| `./install.sh` (clone) | Yes | Yes | Yes | Yes | Yes | Cursor only | Template copy if missing |
| Cursor Marketplace / cursor.directory | Yes | No | Yes | Yes | Yes | Plugin stop hook | `.mcp.json` at repo root |
| Claude Code `/plugin marketplace add kensaurus/cursor-kenji` | No | Yes (plugin-namespaced skills) | Yes | Yes | No | No | No |

Re-check a kenji install without writing: `npx @kensaurus/cursor-kenji --verify` (add `--all` to include Claude/Codex/Gemini dests). Extra personal files are allowed; missing or hash-mismatched packaged files fail.

The installer merges into:

- `~/.cursor/skills/` and `~/.agents/skills/` — agent skills (runtime)
- `~/.cursor/commands/` — slash commands
- `~/.cursor/agents/` — subagents
- `~/.cursor/hooks.json` + `~/.cursor/cursor-kenji-hooks/` — safely merged
  opt-in completion gate; inert unless a closure state file has actionable
  unchecked items
- `~/.claude/skills/`, `~/.claude/commands/`, `~/.claude/agents/`, `~/.claude/rules/` — Claude Code (`npx @kensaurus/cursor-kenji --claude` or `./install.sh --claude`; `.mdc` rules installed as `.md`)

Claude Code 2.1.139+ provides the equivalent independent continuation evaluator
through `/goal`; the `complete-everything` skill includes the recommended goal
condition.

MCP templates live in the repo under `mcp/` — copy `mcp/mcp.json.template` to `~/.cursor/mcp.json` and set `FIRECRAWL_API_KEY`, `CONTEXT7_API_KEY`, `SUPABASE_ACCESS_TOKEN`, and `SUPABASE_PROJECT_REF` in the environment. Slack/Notion in the full template still use `YOUR_*`. See [mcp/README.md](../mcp/README.md).

## Maintainer release path

See [PUBLISHING.md](PUBLISHING.md) — GitHub Release → OIDC npm publish (no token required).
