<p align="center">
  <img src="https://img.shields.io/badge/Cursor_AI-Skills_&_Tools-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0ibTEyIDMtMS45IDEyLjRMMTguMSA2LjYgMi4yIDEzLjRsMTEuNSAxLjFMNy45IDIxeiIvPjwvc3ZnPg==&logoColor=white" alt="Cursor AI Skills" />
</p>

<h1 align="center">cursor-kenji</h1>

<p align="center">
  <strong>A curated toolkit of Cursor AI Agent Skills, Commands, MCP configs, Subagents, and Rules</strong><br/>
  <em>Designed for modern full-stack development with React, Next.js, Supabase, and Tailwind</em>
</p>

<p align="center">
  <a href="#-quick-start"><img src="https://img.shields.io/badge/-Quick_Start-10b981?style=flat-square" alt="Quick Start" /></a>
  <a href="#-skills-33"><img src="https://img.shields.io/badge/-33_Skills-6366f1?style=flat-square" alt="33 Skills" /></a>
  <a href="#-subagents-5"><img src="https://img.shields.io/badge/-5_Subagents-f59e0b?style=flat-square" alt="5 Subagents" /></a>
  <a href="#-commands-13"><img src="https://img.shields.io/badge/-13_Commands-ef4444?style=flat-square" alt="13 Commands" /></a>
  <a href="#-mcp-servers-16"><img src="https://img.shields.io/badge/-16_MCP_Servers-3b82f6?style=flat-square" alt="16 MCP Servers" /></a>
  <a href="#-project-rules-starter-pack"><img src="https://img.shields.io/badge/-6_Rules-8b5cf6?style=flat-square" alt="6 Rules" /></a>
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

## How It All Fits Together

```mermaid
graph TB
  subgraph TOOLKIT["cursor-kenji Toolkit"]
    direction TB
    SK["Skills (33)"]
    CS["Cursor Skills (5)"]
    CMD["Commands (13)"]
    SA["Subagents (5)"]
    MCP["MCP Servers (16)"]
    RULES["Project Rules (6)"]
    NP["Notepads (2)"]
  end

  CURSOR["Cursor IDE"]
  YOU["You"]

  YOU -->|"types /command"| CMD
  YOU -->|"describes task"| SK
  YOU -->|"triggers keyword"| SA
  CURSOR -->|"auto-selects"| SK
  CURSOR -->|"auto-delegates"| SA
  CMD -->|"orchestrates"| SK
  SK -->|"calls"| MCP
  SA -->|"uses"| SK
  SA -->|"calls"| MCP
  RULES -->|"guides"| CURSOR
  NP -->|"provides context"| CURSOR
  CS -->|"extends"| CURSOR

  style TOOLKIT fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#e0e7ff
  style CURSOR fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#e0f2fe
  style YOU fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#d1fae5
  style SK fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style CS fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style CMD fill:#7f1d1d,stroke:#f87171,color:#fee2e2
  style SA fill:#78350f,stroke:#fbbf24,color:#fef3c7
  style MCP fill:#1e3a5f,stroke:#60a5fa,color:#dbeafe
  style RULES fill:#3b0764,stroke:#a78bfa,color:#ede9fe
  style NP fill:#3b0764,stroke:#a78bfa,color:#ede9fe
```

---

## What's New in 2026

> Based on [Cursor's official agent best practices](https://cursor.com/blog/agent-best-practices) and the latest Cursor features (Jan-Feb 2026).

| Addition | Type | Why It Matters |
|:---------|:-----|:---------------|
| `hooks-builder` | Skill | Cursor Hooks — auto-format on edit, block dangerous commands, scan for secrets, create agent loop automation |
| `tdd` | Skill | TDD is Cursor's #1 recommended agent pattern — tests give agents a clear, verifiable goal |
| `spec-writing` | Skill | Writing good specs is the highest-leverage 2026 AI skill — vague prompts produce vague code |
| `parallel-agents` | Skill | Worktrees + cloud agents + multi-model comparison — delegate and compare in parallel |
| `code-review` | Skill | Agent Review + BugBot + manual checklist for thorough pre-merge review |
| `/plan` | Command | Plan Mode (`Shift+Tab`) — Cursor's #1 recommendation: plan before coding |
| `/pr` | Command | Checks pass -> commit -> push -> open PR with description, one workflow |
| `/review` | Command | Full code review pass before merging |
| `/debug` | Command | Debug Mode — hypothesis-driven, instruments code, pinpoints root cause |
| `/fix-issue` | Command | GitHub issue -> find code -> implement fix -> open PR end-to-end |
| `/update-deps` | Command | Audit and safely update dependencies one at a time |

---

## What's Inside

```mermaid
pie title Toolkit Composition
    "Skills (33)" : 33
    "Commands (13)" : 13
    "MCP Servers (16)" : 16
    "Project Rules (6)" : 6
    "Subagents (5)" : 5
    "Cursor Skills (5)" : 5
    "Notepads (2)" : 2
    "Shell Aliases (8)" : 8
```

<table>
<tr>
<td width="50%">

### Core

| | Count | Description |
|-|-------|-------------|
|| **Skills** | 33 | AI agent capabilities |
|| **Cursor Skills** | 5 | IDE-specific tools |
|| **Commands** | 13 | Slash commands |
|| **Subagents** | 5 | Autonomous AI agents |

</td>
<td width="50%">

### Configuration

| | Count | Description |
|-|-------|-------------|
|| **MCP Servers** | 16 | External tool integrations |
|| **Project Rules** | 6 | Per-project AI guidance |
|| **Notepads** | 2 | Reusable context templates |
|| **Shell Aliases** | 8 | Terminal productivity |

</td>
</tr>
</table>

<details>
<summary><strong>Full directory tree</strong></summary>

```
cursor-kenji/
├── skills/                  # 33 Agent Skills (each has SKILL.md)
│   ├── accessibility-audit/
│   ├── algorithmic-art/
│   ├── api-design/
│   ├── backend-patterns/
│   ├── canvas-design/
│   ├── code-antipatterns/
│   ├── code-review/
│   ├── codebase-coherency/
│   ├── creative-effects/
│   ├── creative-workflow/
│   ├── data-visualization/
│   ├── database-optimization/
│   ├── design-system/
│   ├── doc-coauthoring/
│   ├── error-handling/
│   ├── frontend-design/
│   ├── git-workflow/
│   ├── hooks-builder/
│   ├── interactive-ux/
│   ├── mcp-builder/
│   ├── mobile-first/
│   ├── motion-design/
│   ├── parallel-agents/
│   ├── performance-audit/
│   ├── realtime-features/
│   ├── refactoring/
│   ├── security-audit/
│   ├── skill-creator/
│   ├── spec-writing/
│   ├── tdd/
│   ├── theme-factory/
│   ├── uiux-enhancement/
│   └── webapp-testing/
├── skills-cursor/           # 5 Cursor-specific Skills
│   ├── create-rule/
│   ├── create-skill/
│   ├── create-subagent/
│   ├── migrate-to-skills/
│   └── update-cursor-settings/
├── commands/                # 13 Slash Commands
│   ├── commit.md
│   ├── debug.md
│   ├── fix-issue.md
│   ├── mcp.md
│   ├── plan.md
│   ├── pr.md
│   ├── readme.md
│   ├── refactor.md
│   ├── research.md
│   ├── review.md
│   ├── test.md
│   ├── uiux.md
│   └── update-deps.md
├── agents/                  # 5 Subagents
│   ├── code-reviewer.md
│   ├── db-migrator.md
│   ├── debugger.md
│   ├── deploy-checker.md
│   └── perf-monitor.md
├── rules/
│   ├── senior-engineer.md   # Global AI rules (alwaysApply: true)
│   └── project-starter/     # 6 Project rule templates
│       ├── components.mdc
│       ├── data-fetching.mdc
│       ├── git.mdc
│       ├── supabase.mdc
│       ├── tailwind.mdc
│       └── typescript.mdc
├── notepads/                # Reusable context templates
│   ├── architecture.md
│   └── design-tokens.md
├── shell-aliases/
│   └── cursor-helpers.sh    # 8 shell commands
├── mcp/                     # MCP server configs
│   ├── README.md
│   ├── mcp.json.template      (Essential 5 servers)
│   └── mcp-full.json.template (All 16 servers)
├── docs/
│   ├── CATALOG.md
│   └── CONTRIBUTING.md
├── install.sh               # One-command installer
├── LICENSE
└── README.md
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

### What the installer does

```mermaid
flowchart LR
  A["./install.sh"] --> B["Backup existing\n~/.cursor/skills/"]
  B --> C["Install 33 skills\n+ 5 cursor skills"]
  C --> D["Install 5\nsubagents"]
  D --> E["Copy MCP\nconfig template"]
  E --> F["Ready!"]

  style A fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#d1fae5
  style F fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#d1fae5
  style B fill:#1e293b,stroke:#64748b,color:#e2e8f0
  style C fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style D fill:#78350f,stroke:#fbbf24,color:#fef3c7
  style E fill:#1e3a5f,stroke:#60a5fa,color:#dbeafe
```

**Post-install steps:**
1. Restart Cursor to pick up new skills
2. Edit `~/.cursor/mcp.json` with your API keys
3. Try: `/commit`, `/test`, `/research` in Cursor
4. Source shell helpers: `source ~/cursor-kenji/shell-aliases/cursor-helpers.sh`

---

## Skills (33)

### Skill Categories at a Glance

```mermaid
mindmap
  root((33 Skills))
    Design & Frontend
      frontend-design
      design-system
      motion-design
      creative-effects
      uiux-enhancement
      interactive-ux
      mobile-first
      theme-factory
    Data & Creative
      data-visualization
      algorithmic-art
      canvas-design
    Backend & Database
      backend-patterns
      database-optimization
      realtime-features
    Architecture & Quality
      api-design
      error-handling
      code-antipatterns
      code-review
      codebase-coherency
      refactoring
      performance-audit
      security-audit
      accessibility-audit
    Engineering Practices
      tdd
      spec-writing
      parallel-agents
      hooks-builder
    Process & Docs
      git-workflow
      doc-coauthoring
      creative-workflow
    Meta & Tooling
      skill-creator
      mcp-builder
      webapp-testing
```

---

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
| `canvas-design` | Museum-quality visual design in `.png` and `.pdf` formats |

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
| `code-review` | Thorough PR reviews — correctness, security, perf, a11y checklist |
| `codebase-coherency` | Naming, imports, organization consistency audit |
| `refactoring` | Safe, incremental code transformations |
| `performance-audit` | Core Web Vitals, bundle analysis, runtime profiling |
| `security-audit` | OWASP Top 10, auth flows, RLS, secrets management |
| `accessibility-audit` | WCAG 2.1 AA compliance, screen reader, keyboard, ARIA |

### Engineering Practices <sup>New in 2026</sup>

| Skill | What it Does |
|:------|:-------------|
| `tdd` | Test-driven development with AI — Red/Green/Refactor, Vitest patterns, agent-compatible TDD workflow |
| `spec-writing` | Write effective specs and briefs so agents produce correct implementations first time |
| `parallel-agents` | Run agents in parallel via git worktrees, cloud agents, and multi-model comparison |
| `hooks-builder` | Build Cursor Agent Hooks — auto-formatters, security gates, secret scanners, loop automation |

### Process & Documentation

| Skill | What it Does |
|:------|:-------------|
| `git-workflow` | Branching, conventional commits, PRs, releases |
| `doc-coauthoring` | Structured co-authoring for specs, PRDs, RFCs |
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

## Commands (13)

### Development Workflow

```mermaid
flowchart LR
  PLAN["/plan"] --> CODE["Write Code"]
  CODE --> TEST["/test"]
  TEST --> DEBUG{Bugs?}
  DEBUG -->|Yes| FIX["/debug"]
  FIX --> TEST
  DEBUG -->|No| REVIEW["/review"]
  REVIEW --> COMMIT["/commit"]
  COMMIT --> PR["/pr"]

  style PLAN fill:#064e3b,stroke:#10b981,color:#d1fae5
  style CODE fill:#1e293b,stroke:#64748b,color:#e2e8f0
  style TEST fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style DEBUG fill:#78350f,stroke:#fbbf24,color:#fef3c7
  style FIX fill:#7f1d1d,stroke:#f87171,color:#fee2e2
  style REVIEW fill:#3b0764,stroke:#a78bfa,color:#ede9fe
  style COMMIT fill:#1e3a5f,stroke:#60a5fa,color:#dbeafe
  style PR fill:#064e3b,stroke:#10b981,color:#d1fae5
```

### Coding Workflow

| Command | When | What it Does |
|:--------|:-----|:-------------|
| `/plan` | Before coding | Plan Mode — research codebase, clarify requirements, produce an approved plan before writing code |
| `/commit` | After coding | Fix build errors, lint, type check, commit & push |
| `/pr` | Ready to ship | Checks pass -> commit -> push -> open PR with title and description |
| `/fix-issue [#]` | Bug reports | Fetch GitHub issue -> find relevant code -> implement fix -> open PR |
| `/debug` | Tricky bugs | Hypothesis-driven debugging with runtime instrumentation, not guessing |
| `/review` | Before merge | Agent review pass + manual checklist: correctness, security, performance, accessibility |
| `/test` | Before commit | Run full test suite, verify quality, check coverage targets |
| `/update-deps` | Maintenance | Audit and safely update dependencies one at a time with changelog review |

### Research & Documentation

| Command | When | What it Does |
|:--------|:-----|:-------------|
| `/research` | Before coding | Scrape latest docs, patterns, and solutions via Firecrawl |
| `/readme` | End of session | Sync all READMEs to reflect session changes |
| `/refactor` | Long files | Split into clean, modular architecture without losing any code |
| `/mcp` | Dev workflow | MCP-powered development reference and tool guide |
| `/uiux` | UI review | Enforce design system, fix rogue styling, standardize interactions |

---

## Subagents (5)

> *Autonomous AI agents that Cursor auto-delegates to based on keywords*

```mermaid
flowchart TB
  CURSOR["Cursor IDE"] -->|"code changes"| CR["code-reviewer"]
  CURSOR -->|"errors / exceptions"| DB["debugger"]
  CURSOR -->|"migration / new table"| DM["db-migrator"]
  CURSOR -->|"deploy / ship it"| DC["deploy-checker"]
  CURSOR -->|"slow / optimize"| PM["perf-monitor"]

  CR -->|output| QR["Quality Report\nSecurity + Types + Anti-patterns"]
  DB -->|output| RCA["Root Cause Analysis\nIsolate + Fix + Verify"]
  DM -->|output| MIG["SQL Migration\nRLS + Indexes + Types"]
  DC -->|output| CHK["8-Point Checklist\nPre-deploy Validation"]
  PM -->|output| PERF["Performance Report\nBundle + Render + Data"]

  style CURSOR fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#e0f2fe
  style CR fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style DB fill:#7f1d1d,stroke:#f87171,color:#fee2e2
  style DM fill:#1e3a5f,stroke:#60a5fa,color:#dbeafe
  style DC fill:#064e3b,stroke:#10b981,color:#d1fae5
  style PM fill:#78350f,stroke:#fbbf24,color:#fef3c7
  style QR fill:#1e1b4b,stroke:#6366f1,color:#e0e7ff
  style RCA fill:#450a0a,stroke:#ef4444,color:#fee2e2
  style MIG fill:#0c2340,stroke:#3b82f6,color:#dbeafe
  style CHK fill:#022c22,stroke:#059669,color:#d1fae5
  style PERF fill:#451a03,stroke:#d97706,color:#fef3c7
```

| Agent | Auto-triggers On | What it Does |
|:------|:-----------------|:-------------|
| `code-reviewer` | Code changes, "review" | Quality, security, types, anti-patterns |
| `debugger` | Errors, exceptions | Root cause analysis, isolate, fix, verify |
| `db-migrator` | "migration", "new table" | SQL, RLS policies, indexes, type generation |
| `deploy-checker` | "deploy", "ship it" | 8-check validation pipeline |
| `perf-monitor` | "slow", "optimize" | Bundle, render, data fetching audit |

---

## MCP Servers (16)

> *External tool integrations across 4 tiers — pick what you need*

```mermaid
graph TB
  subgraph T1["Tier 1: Essential"]
    ST["Sequential Thinking"]
    C7["Context7"]
    FC["Firecrawl"]
    SB["Supabase"]
    CD["Chrome DevTools"]
  end

  subgraph T2["Tier 2: Dev Power-Ups"]
    GH["GitHub"]
    GHO["GitHub Official"]
    PW["Playwright"]
    PG["Postgres"]
    MEM["Memory"]
  end

  subgraph T3["Tier 3: AWS Cloud"]
    LAM["AWS Lambda"]
    S3["AWS S3"]
    CW["AWS CloudWatch"]
    RD["Redis"]
  end

  subgraph T4["Tier 4: Productivity"]
    SL["Slack"]
    NT["Notion"]
  end

  style T1 fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#d1fae5
  style T2 fill:#1e3a5f,stroke:#60a5fa,stroke-width:2px,color:#dbeafe
  style T3 fill:#78350f,stroke:#fbbf24,stroke-width:2px,color:#fef3c7
  style T4 fill:#3b0764,stroke:#a78bfa,stroke-width:2px,color:#ede9fe
```

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

```mermaid
graph LR
  R1["supabase.mdc"] --> P["Your Project\n.cursor/rules/"]
  R2["components.mdc"] --> P
  R3["typescript.mdc"] --> P
  R4["tailwind.mdc"] --> P
  R5["git.mdc"] --> P
  R6["data-fetching.mdc"] --> P
  SE["senior-engineer.md\n(Global Rule)"] -.->|"alwaysApply: true"| P

  style P fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#e0e7ff
  style SE fill:#78350f,stroke:#fbbf24,color:#fef3c7
  style R1 fill:#064e3b,stroke:#10b981,color:#d1fae5
  style R2 fill:#064e3b,stroke:#10b981,color:#d1fae5
  style R3 fill:#064e3b,stroke:#10b981,color:#d1fae5
  style R4 fill:#064e3b,stroke:#10b981,color:#d1fae5
  style R5 fill:#064e3b,stroke:#10b981,color:#d1fae5
  style R6 fill:#064e3b,stroke:#10b981,color:#d1fae5
```

| Rule | Enforces |
|:-----|:---------|
| `supabase.mdc` | Typed clients, RLS mandatory, migration patterns |
| `components.mdc` | Reuse primitives, Server Components, a11y |
| `typescript.mdc` | No `any`, Zod validation, ActionResult pattern |
| `tailwind.mdc` | Design tokens, `cn()`, mobile-first, motion prefs |
| `git.mdc` | Conventional commits, branch naming, no secrets |
| `data-fetching.mdc` | TanStack Query, prefetch, query key factories |

Plus a **global rule** — `senior-engineer.md` — that always applies and enforces the full-stack execution protocol with MCP tool usage.

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
| `lsskills` | List all installed skills with descriptions |
| `cursor-sync` | Pull latest + reinstall |
| `cursor-dev` | Open Cursor + Chrome DevTools |
| `newrule <name>` | Create a project rule with template |
| `newagent <name>` | Create a subagent with template |
| `gc <type> <msg>` | Conventional commit shortcut |
| `gp` | Push current branch |

---

## Design Principles

```mermaid
graph LR
  P1["Check Existing\nFirst"] --> P2["Production\nReady"]
  P2 --> P3["Modular &\nComposable"]
  P3 --> P4["Creative Yet\nDisciplined"]
  P4 --> P5["Modern\nStack"]
  P5 --> P6["Accessible\nby Default"]
  P6 --> P7["Performance\nAware"]

  style P1 fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style P2 fill:#064e3b,stroke:#10b981,color:#d1fae5
  style P3 fill:#1e3a5f,stroke:#60a5fa,color:#dbeafe
  style P4 fill:#78350f,stroke:#fbbf24,color:#fef3c7
  style P5 fill:#7f1d1d,stroke:#f87171,color:#fee2e2
  style P6 fill:#3b0764,stroke:#a78bfa,color:#ede9fe
  style P7 fill:#1e293b,stroke:#64748b,color:#e2e8f0
```

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

| Technology | Version | Key Features |
|:-----------|:--------|:-------------|
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
