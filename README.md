<p align="center">
  <img src="https://img.shields.io/badge/Cursor_AI-Skills_&_Tools-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0ibTEyIDMtMS45IDEyLjRMMTguMSA2LjYgMi4yIDEzLjRsMTEuNSAxLjFMNy45IDIxeiIvPjwvc3ZnPg==&logoColor=white" alt="Cursor AI Skills" />
</p>

<h1 align="center">cursor-kenji</h1>

<p align="center">
  <strong>A curated toolkit of Cursor AI Agent Skills, Commands, MCP configs, Subagents, and Rules</strong><br/>
  <em>Designed for modern full-stack development with React, Next.js, Supabase, and Tailwind</em>
</p>

<p align="center">
  <a href="#quick-start"><img src="https://img.shields.io/badge/-Quick_Start-10b981?style=flat-square" alt="Quick Start" /></a>
  <a href="#skills-overview"><img src="https://img.shields.io/badge/-27_Skills-6366f1?style=flat-square" alt="27 Skills" /></a>
  <a href="#subagents"><img src="https://img.shields.io/badge/-5_Subagents-f59e0b?style=flat-square" alt="5 Subagents" /></a>
  <a href="#commands-overview"><img src="https://img.shields.io/badge/-7_Commands-ef4444?style=flat-square" alt="7 Commands" /></a>
  <a href="#mcp-configuration"><img src="https://img.shields.io/badge/-16_MCP_Servers-3b82f6?style=flat-square" alt="16 MCP Servers" /></a>
  <a href="#project-rules-starter-pack"><img src="https://img.shields.io/badge/-6_Rules-8b5cf6?style=flat-square" alt="6 Rules" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/kensaurus/cursor-kenji?style=flat-square&color=444" alt="License" />
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Next.js-15-000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind v4" />
  <img src="https://img.shields.io/badge/Supabase-Latest-3fcf8e?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
</p>

---

> **Living repository** — skills evolve with the ecosystem. Every update is versioned.

---

## What's Inside

<table>
<tr>
<td width="50%">

### Core

| | Count | Description |
|-|-------|-------------|
| **Skills** | 27 | AI agent capabilities |
| **Cursor Skills** | 5 | IDE-specific tools |
| **Commands** | 7 | Slash commands |
| **Subagents** | 5 | Autonomous AI agents |

</td>
<td width="50%">

### Configuration

| | Count | Description |
|-|-------|-------------|
| **MCP Servers** | 16 | External tool integrations |
| **Project Rules** | 6 | Per-project AI guidance |
| **Notepads** | 2 | Reusable context templates |
| **Shell Aliases** | 8 | Terminal productivity |

</td>
</tr>
</table>

<details>
<summary><strong>Full directory tree</strong></summary>

```
cursor-kenji/
├── skills/                  # 27 Agent Skills
├── skills-cursor/           # 5 Cursor-specific Skills
├── commands/                # 7 Slash Commands
├── agents/                  # 5 Subagents
├── rules/
│   ├── senior-engineer.md   # Global AI rules
│   └── project-starter/     # 6 Project rule templates
├── notepads/                # Reusable context templates
├── shell-aliases/           # Terminal helpers
├── mcp/                     # MCP server configs (16 servers)
├── docs/                    # Catalog & contributing guide
└── install.sh               # One-command installer
```

</details>

---

## Quick Start

```bash
git clone https://github.com/kensaurus/cursor-kenji.git
cd cursor-kenji
./install.sh
```

<details>
<summary>Or one-liner install</summary>

```bash
curl -sSL https://raw.githubusercontent.com/kensaurus/cursor-kenji/main/install.sh | bash
```

</details>

**What happens:**
1. Backs up existing `~/.cursor/skills/`
2. Installs 27 skills + 5 cursor skills + 5 subagents
3. Sets up MCP config template
4. Ready in seconds

---

## Skills Overview

### Design & Frontend

> *Build distinctive, production-grade interfaces*

| Skill | What it Does |
|:------|:-------------|
| `frontend-design` | Production-grade UI avoiding generic AI aesthetics |
| `design-system` | Component libraries, tokens, variants, CVA patterns |
| `motion-design` | Framer Motion, CSS animations, GSAP micro-interactions |
| `creative-effects` | WebGL, Three.js, shaders, particles, Canvas 2D |
| `uiux-enhancement` | Incremental UI/UX improvements and polish |
| `interactive-ux` | Gamification, Easter eggs, delightful interactions |
| `mobile-first` | Touch-optimized, responsive, PWA patterns |
| `theme-factory` | Apply cohesive visual themes across artifacts |

### Data & Creative

| Skill | What it Does |
|:------|:-------------|
| `data-visualization` | Recharts, D3.js, sparklines, real-time charts |
| `algorithmic-art` | Generative art, flow fields, L-systems, circle packing |

### Backend & Database

| Skill | What it Does |
|:------|:-------------|
| `backend-patterns` | Server Actions, tRPC, Edge Functions, caching, jobs |
| `database-optimization` | Indexes, N+1 fixes, RLS performance, query tuning |
| `realtime-features` | WebSocket, Supabase Realtime, SSE, live data |

### Architecture & Quality

| Skill | What it Does |
|:------|:-------------|
| `api-design` | REST conventions, error schemas, pagination, versioning |
| `error-handling` | Error boundaries, Server Action errors, toast patterns |
| `code-antipatterns` | Detect and fix React, TypeScript, state anti-patterns |
| `codebase-coherency` | Naming, imports, organization consistency audit |
| `refactoring` | Safe, incremental code transformations |
| `performance-audit` | Core Web Vitals, bundle analysis, runtime profiling |
| `security-audit` | OWASP Top 10, auth flows, RLS, secrets management |

### Process & Documentation

| Skill | What it Does |
|:------|:-------------|
| `git-workflow` | Branching, conventional commits, PRs, releases |
| `doc-coauthoring` | Structured co-authoring for specs, PRDs, RFCs |
| `canvas-design` | Museum-quality visual design philosophy |
| `creative-workflow` | End-to-end feature development workflow |

### Meta & Tooling

| Skill | What it Does |
|:------|:-------------|
| `skill-creator` | Guide for creating new Agent Skills |
| `mcp-builder` | Build MCP servers for LLM tool integration |
| `webapp-testing` | Playwright browser automation and E2E testing |

<details>
<summary><strong>Cursor-Specific Skills (5)</strong></summary>

| Skill | What it Does |
|:------|:-------------|
| `create-rule` | Create `.cursor/rules/` for persistent AI guidance |
| `create-skill` | Create new Agent Skills in `~/.cursor/skills/` |
| `create-subagent` | Create custom subagents in `.cursor/agents/` |
| `migrate-to-skills` | Convert rules/commands to Skills format |
| `update-cursor-settings` | Modify Cursor/VSCode settings.json |

</details>

---

## Commands Overview

| Command | When | What it Does |
|:--------|:-----|:-------------|
| `/commit` | After coding | Fix build errors, lint, type check, commit & push |
| `/test` | Before commit | Run full test suite, verify quality, check coverage |
| `/readme` | End of session | Sync all READMEs with session changes |
| `/refactor` | Long files | Split into clean, modular architecture |
| `/research` | Before coding | Scrape latest docs, patterns, solutions |
| `/mcp` | Dev workflow | MCP-powered development reference |
| `/uiux` | UI review | Enforce design system, fix rogue implementations |

---

## Subagents

> *Autonomous AI agents that Cursor auto-delegates to*

| Agent | Auto-triggers On | What it Does |
|:------|:-----------------|:-------------|
| `code-reviewer` | Code changes, "review" | Quality, security, types, anti-patterns |
| `debugger` | Errors, exceptions | Root cause analysis, isolate, fix, verify |
| `db-migrator` | "migration", "new table" | SQL, RLS policies, indexes, type generation |
| `deploy-checker` | "deploy", "ship it" | 8-check validation pipeline |
| `perf-monitor` | "slow", "optimize" | Bundle, render, data fetching audit |

---

## MCP Configuration

> *16 MCP servers across 4 tiers — pick what you need*

<table>
<tr>
<td>

**Tier 1: Essential**
| Server | Key? |
|:-------|:-----|
| Sequential Thinking | No |
| Context7 | No |
| Firecrawl | Yes |
| Supabase | Yes |
| Chrome DevTools | No* |

</td>
<td>

**Tier 2: Dev Power-Ups**
| Server | Key? |
|:-------|:-----|
| GitHub | PAT |
| GitHub Official | PAT |
| Playwright | No |
| Postgres | Conn |
| Memory | No |

</td>
</tr>
<tr>
<td>

**Tier 3: AWS Cloud**
| Server | Key? |
|:-------|:-----|
| AWS Lambda | Profile |
| AWS S3 | Profile |
| AWS CloudWatch | Profile |
| Redis | URL |

</td>
<td>

**Tier 4: Productivity**
| Server | Key? |
|:-------|:-----|
| Slack | Bot |
| Notion | Yes |
| | |
| | |

</td>
</tr>
</table>

Two templates included:
- `mcp.json.template` — Essential 5 servers
- `mcp-full.json.template` — All 16 servers

See [`mcp/README.md`](mcp/README.md) for setup guides.

---

## Project Rules Starter Pack

> *Drop into any project's `.cursor/rules/` for instant AI guidance*

| Rule | Enforces |
|:-----|:---------|
| `supabase.mdc` | Typed clients, RLS mandatory, migration patterns |
| `components.mdc` | Reuse primitives, Server Components, a11y |
| `typescript.mdc` | No `any`, Zod validation, ActionResult pattern |
| `tailwind.mdc` | Design tokens, `cn()`, mobile-first, motion prefs |
| `git.mdc` | Conventional commits, branch naming, no secrets |
| `data-fetching.mdc` | TanStack Query, prefetch, query key factories |

```bash
cp ~/cursor-kenji/rules/project-starter/*.mdc your-project/.cursor/rules/
```

---

## Shell Helpers

```bash
source ~/cursor-kenji/shell-aliases/cursor-helpers.sh
```

| Command | What it Does |
|:--------|:-------------|
| `newskill <name>` | Create a new skill with template |
| `lsskills` | List all installed skills |
| `cursor-sync` | Pull latest + reinstall |
| `cursor-dev` | Open Cursor + Chrome DevTools |
| `newrule <name>` | Create a project rule |
| `newagent <name>` | Create a subagent |
| `gc <type> <msg>` | Conventional commit shortcut |
| `gp` | Push current branch |

---

## Design Principles

| # | Principle |
|---|----------|
| 1 | **Check Existing First** — scan before creating. Never duplicate. |
| 2 | **Production-Ready** — no placeholders. Code that ships. |
| 3 | **Modular & Composable** — skills cross-reference. Mix and match. |
| 4 | **Creative Yet Disciplined** — bold aesthetics, solid engineering. |
| 5 | **Modern Stack** — React 19, Next.js 15+, Tailwind v4, strict TS. |
| 6 | **Accessible by Default** — WCAG 2.1 AA is non-negotiable. |
| 7 | **Performance Aware** — every pattern considers Web Vitals. |

---

## Stack Compatibility

| Technology | Version | |
|:-----------|:--------|:-|
| React | 19+ | Server Components, `use()`, Compiler |
| Next.js | 15+ | App Router, Server Actions, PPR |
| TypeScript | 5+ | Strict mode, no `any` |
| Tailwind CSS | v4 | CSS-first config, `@theme` |
| Supabase | Latest | Auth, RLS, Edge Functions, Realtime |
| TanStack Query | v5 | `queryOptions()`, prefetch, hydration |
| Zustand | v5 | Slices, immer, selective persist |
| Zod | v3 | Input validation, type inference |
| Framer Motion | v11 | Animations, gestures, layout |

---

## Keeping Up to Date

```bash
cd ~/cursor-kenji && git pull && ./install.sh
```

<details>
<summary>Auto-sync via crontab</summary>

```bash
0 9 * * * cd ~/cursor-kenji && git pull origin main && ./install.sh --quiet
```

</details>

---

## Contributing

See [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) for how to add skills, commands, and rules.

See [`docs/CATALOG.md`](docs/CATALOG.md) for the full reference with trigger phrases.

---

<p align="center">
  <strong>MIT License</strong> — Use freely, modify freely, share freely.
</p>

<p align="center">
  <em>Built by <a href="https://github.com/kensaurus">@kensaurus</a>. Enhanced continuously.</em>
</p>
