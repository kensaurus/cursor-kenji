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
  <a href="#how-to-use-this-toolkit"><img src="https://img.shields.io/badge/-How_to_Use-22c55e?style=flat-square" alt="How to Use" /></a>
  <a href="#skills-57"><img src="https://img.shields.io/badge/-57_Skills-6366f1?style=flat-square" alt="57 Skills" /></a>
  <a href="#subagents-5"><img src="https://img.shields.io/badge/-5_Subagents-f59e0b?style=flat-square" alt="5 Subagents" /></a>
  <a href="#commands-13"><img src="https://img.shields.io/badge/-13_Commands-ef4444?style=flat-square" alt="13 Commands" /></a>
  <a href="#mcp-servers-16"><img src="https://img.shields.io/badge/-16_MCP_Servers-3b82f6?style=flat-square" alt="16 MCP Servers" /></a>
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

## How It All Fits Together

```mermaid
graph TB
  subgraph TOOLKIT["cursor-kenji Toolkit"]
    direction TB
    SK["Skills (57)"]
    CS["Cursor Skills (12)"]
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

> Based on [Cursor's official agent best practices](https://cursor.com/blog/agent-best-practices) and the latest Cursor features (Jan-Apr 2026).

### Apr 2026 — The Enhance Family <sup>Latest</sup>

> *Generic, research-grounded skills that turn AI-templated screens into hand-crafted ones, applicable to any web stack.*

| Addition | Type | Why It Matters |
|:---------|:-----|:---------------|
| `enhance-page-ui` | Skill | Composition over decoration — fix hierarchy, grouping, spacing, motion before adding visual flourish. NN/g visual hierarchy + Laws of UX grounded |
| `enhance-page-ux` | Skill | Replace generic "stacked" UI with semantic data — every change cites a Nielsen heuristic, uses existing primitives, verified at 3 viewports via browser MCP |
| `enhance-readme` | Skill | Theme-aware hero + tour grid + animated GIF — turns plain READMEs into showcases via Playwright MCP screenshot capture |
| `audit-ux` | Skill | Deep UX audit grounded in NN/g 10 heuristics, Laws of UX, Intuit Content Design, and Google HEART — generic across any webapp |
| `split-to-prs` | Cursor Skill | Slice a single chat / branch / PR into small reviewable PRs with safe snapshot, no destructive git ops |
| Updated `canvas` | Cursor Skill | Live React canvas SDK — refreshed primitives, better SDK type hints, additional design guidance |
| Updated `/commit` | Command | Lint, Sentry pre-check, build verify, auto-detect scope, conventional commit, push — full pre-commit pipeline |
| Updated `/research` | Command | Three-phase Firecrawl deep research with gap analysis, fallback to WebSearch, sequential thinking for complex changes |
| Updated `/readme` | Command | End-of-session doc sync — detect convention, smart change detection, stale reference cleanup |
| Updated `/review`, `/fix-issue`, `/update-deps` | Commands | More thorough, safer, more actionable |

### Earlier 2026

| Addition | Type | Why It Matters |
|:---------|:-----|:---------------|
| `hooks-builder` | Skill | Cursor Hooks — auto-format on edit, block dangerous commands, scan for secrets, create agent loop automation |
| `tdd` | Skill | TDD is Cursor's #1 recommended agent pattern — tests give agents a clear, verifiable goal |
| `spec-writing` | Skill | Writing good specs is the highest-leverage 2026 AI skill — vague prompts produce vague code |
| `parallel-agents` | Skill | Worktrees + cloud agents + multi-model comparison — delegate and compare in parallel |
| `audit-code-review` | Skill | Agent Review + BugBot + manual checklist for thorough pre-merge review |
| 20 new skills | Skill | Audits, debugging, deploy verification, file handling, PRD generation, QA testing, housekeeping, and more |
| 6 new cursor-skills | Cursor | babysit, canvas, create-hook, shell, statusline, update-cli-config |
| `/plan` | Command | Plan Mode (`Shift+Tab`) — Cursor's #1 recommendation: plan before coding |
| `/pr` | Command | Checks pass -> commit -> push -> open PR with description, one workflow |
| `/debug` | Command | Debug Mode — hypothesis-driven, instruments code, pinpoints root cause |

---

## What's Inside

```mermaid
pie title Toolkit Composition
    "Skills (57)" : 57
    "Commands (13)" : 13
    "MCP Servers (16)" : 16
    "Project Rules (6)" : 6
    "Subagents (5)" : 5
    "Cursor Skills (12)" : 12
    "Notepads (2)" : 2
    "Shell Aliases (8)" : 8
```

<table>
<tr>
<td width="50%">

### Core

| | Count | Description |
|-|-------|-------------|
|| **Skills** | 57 | AI agent capabilities |
|| **Cursor Skills** | 12 | IDE-specific tools |
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
├── skills/                  # 57 Agent Skills (each has SKILL.md)
│   ├── algorithmic-art/
│   ├── audit-accessibility/
│   ├── audit-code-review/
│   ├── audit-db-schema/
│   ├── audit-fe-api/
│   ├── audit-langfuse-llm/
│   ├── audit-performance/
│   ├── audit-security/
│   ├── audit-uiux-design-system/
│   ├── audit-ux/              # NEW Apr 2026 — NN/g + Laws of UX + HEART audit
│   ├── backend-patterns/
│   ├── canvas-design/
│   ├── code-antipatterns/
│   ├── codebase-coherency/
│   ├── creative-effects/
│   ├── creative-workflow/
│   ├── data-visualization/
│   ├── database-optimization/
│   ├── debug-error/
│   ├── debug-fe-be-integration/
│   ├── debug-sentry-monitor/
│   ├── deploy-verify/
│   ├── design-api/
│   ├── design-frontend/
│   ├── design-prd/
│   ├── design-system/
│   ├── docs-coauthor/
│   ├── docs-writer/
│   ├── enhance-page-ui/       # NEW Apr 2026 — composition + hierarchy + motion
│   ├── enhance-page-ux/       # NEW Apr 2026 — heuristic-grounded UX enhancement
│   ├── enhance-readme/        # NEW Apr 2026 — hero + tour + GIF for any README
│   ├── error-handling/
│   ├── file-docx/
│   ├── file-pdf/
│   ├── file-pptx/
│   ├── file-xlsx/
│   ├── hooks-builder/
│   ├── interactive-ux/
│   ├── karpathy-guidelines/
│   ├── meta-mcp-builder/
│   ├── meta-skill-creator/
│   ├── mobile-first/
│   ├── motion-design/
│   ├── parallel-agents/
│   ├── protocol-browser-anti-stall/
│   ├── realtime-features/
│   ├── spec-writing/
│   ├── tdd/
│   ├── test-qa/
│   ├── test-unit/
│   ├── theme-factory/
│   ├── uiux-enhancement/
│   ├── webapp-testing/
│   ├── workflow-git-commit/
│   ├── workflow-housekeep/
│   ├── workflow-pr/
│   └── workflow-refactor/
├── skills-cursor/           # 12 Cursor-specific Skills
│   ├── babysit/
│   ├── canvas/                # Updated Apr 2026 — refreshed SDK + design rules
│   ├── create-hook/
│   ├── create-rule/
│   ├── create-skill/
│   ├── create-subagent/
│   ├── migrate-to-skills/
│   ├── shell/
│   ├── split-to-prs/          # NEW Apr 2026 — safely slice work into small PRs
│   ├── statusline/
│   ├── update-cli-config/
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
  B --> C["Install 57 skills\n+ 12 cursor skills"]
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

## How to Use This Toolkit

> *Five primitives, one mental model: **describe** the task → Cursor **auto-selects** a skill, OR **type** a `/command` for a known workflow.*

### The four ways the agent gets help

```mermaid
flowchart LR
  YOU["You"] -->|"natural language\n('clean up this page')"| AUTO["Skills auto-trigger\nfrom description"]
  YOU -->|"slash command\n('/commit')"| CMD["Commands\nrun a recipe"]
  YOU -->|"keyword in chat\n('migration', 'review')"| SUB["Subagents\nauto-delegate"]
  YOU -->|"long-lived guidance\n(.cursor/rules/)"| RULES["Project Rules\nalways apply"]

  AUTO --> WORK["Cursor Agent\ndoes the work"]
  CMD --> WORK
  SUB --> WORK
  RULES -.->|"shape every response"| WORK

  style YOU fill:#064e3b,stroke:#10b981,color:#d1fae5
  style WORK fill:#1e1b4b,stroke:#6366f1,color:#e0e7ff
  style AUTO fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style CMD fill:#7f1d1d,stroke:#f87171,color:#fee2e2
  style SUB fill:#78350f,stroke:#fbbf24,color:#fef3c7
  style RULES fill:#3b0764,stroke:#a78bfa,color:#ede9fe
```

| Primitive | When | How to invoke | Example |
|:----------|:-----|:--------------|:--------|
| **Skill** | Specific task with a known workflow (audit, enhance, debug, build) | Just describe the task — Cursor matches keywords from skill descriptions | "make `/dashboard` feel less AI-generated" → triggers `enhance-page-ux` |
| **Command** | Repeatable workflow you run often | Type `/<name>` in chat | `/commit`, `/research`, `/pr` |
| **Subagent** | Background autonomous work (review, migrate, deploy) | Mention a trigger keyword — Cursor auto-delegates | "review this PR" → `code-reviewer` |
| **Rule** | Always-on project conventions | Drop `.mdc` into `.cursor/rules/` of any project | `supabase.mdc`, `typescript.mdc` |

### Common daily flows

```mermaid
flowchart TB
  subgraph FEAT["Building a feature"]
    F1["/research <topic>"] --> F2["/plan"]
    F2 --> F3["Code"]
    F3 --> F4["/test"]
    F4 --> F5["/commit"]
    F5 --> F6["/pr"]
  end

  subgraph FIX["Fixing a bug"]
    B1["/debug or /fix-issue #N"] --> B2["Code"]
    B2 --> B3["/review"]
    B3 --> B4["/commit"]
  end

  subgraph POLISH["Polishing UI"]
    P1["audit-ux skill\n(report)"] --> P2["enhance-page-ux skill\n(implement)"]
    P2 --> P3["enhance-page-ui skill\n(visual polish)"]
    P3 --> P4["/commit"]
  end

  subgraph DOCS["Shipping docs"]
    D1["enhance-readme skill"] --> D2["/readme"]
    D2 --> D3["/commit"]
  end

  style FEAT fill:#1e3a5f,stroke:#60a5fa,color:#dbeafe
  style FIX fill:#7f1d1d,stroke:#f87171,color:#fee2e2
  style POLISH fill:#3b0764,stroke:#a78bfa,color:#ede9fe
  style DOCS fill:#064e3b,stroke:#10b981,color:#d1fae5
```

### How to invoke a skill (without overthinking it)

Skills auto-trigger from **trigger phrases in their description** (the `description:` block at the top of every `SKILL.md`). You don't need to remember names — just describe what you want.

| You say | Skill that fires |
|:--------|:-----------------|
| "this page feels AI-generated, fix it" | `enhance-page-ux` |
| "make `/settings` more polished, less crowded" | `enhance-page-ui` |
| "give the README a hero image and screenshots" | `enhance-readme` |
| "audit the UX of the checkout flow" | `audit-ux` |
| "split this branch into smaller PRs" | `split-to-prs` |
| "show me a canvas with these query results" | `canvas` |
| "the agent keeps hanging on browser steps" | `protocol-browser-anti-stall` |

If you want to force a skill, mention it explicitly: *"use `enhance-page-ux` on `/dashboard`"*.

### How the new "Enhance" family works

The three `enhance-*` skills compose like a pipeline — pick the layer that matches what you want changed:

```mermaid
flowchart LR
  AUDIT["audit-ux\n(diagnose)"] -.->|"report only"| REPORT["UX report"]
  AUDIT --> UX
  UX["enhance-page-ux\n(workflow + data)"] --> UI
  UI["enhance-page-ui\n(composition + motion)"] --> DONE["Polished page"]
  README["enhance-readme\n(showcase the repo itself)"] --> SHIP["Pretty README"]

  style AUDIT fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style UX fill:#1e3a5f,stroke:#60a5fa,color:#dbeafe
  style UI fill:#3b0764,stroke:#a78bfa,color:#ede9fe
  style README fill:#064e3b,stroke:#10b981,color:#d1fae5
  style DONE fill:#1e1b4b,stroke:#6366f1,color:#e0e7ff
  style SHIP fill:#1e1b4b,stroke:#6366f1,color:#e0e7ff
```

| Want to... | Use |
|:-----------|:----|
| **Get a heuristic-grounded report** (NN/g + Laws of UX + HEART, no code changes) | `audit-ux` |
| **Replace stacked / templated UI with semantic data** that maps to real backend state | `enhance-page-ux` |
| **Refine layout, hierarchy, spacing, motion** of an already-correct page | `enhance-page-ui` |
| **Visually showcase the repo itself** with hero image + tour + animated GIF | `enhance-readme` |

All four are **generic** — they work in any web stack (Next.js, Remix, SvelteKit, Vite + React, etc.) because they rely on browser MCP for live observation and on inventory of existing primitives rather than assumed framework APIs.

### Setting up a new project

1. **Drop project rules** — copy the `.mdc` files into the project's `.cursor/rules/`:

   ```bash
   mkdir -p .cursor/rules
   cp ~/cursor-kenji/rules/project-starter/*.mdc .cursor/rules/
   ```

2. **Add an `AGENTS.md`** at the repo root if you want the agent to follow specific conventions across the whole repo (Cursor reads it automatically).

3. **Verify MCP keys** in `~/.cursor/mcp.json` — Firecrawl, Supabase, GitHub PAT — only what you actually use.

4. **Try one workflow end-to-end**: `/research "current React Server Components patterns"` → `/plan` → code → `/test` → `/commit` → `/pr`. If anything is missing, run `cursor-sync` to refresh.

### Tips for getting the most out of skills

- **Be specific about scope.** "Enhance the page" is vague. "Enhance `/dashboard` so empty cells get folder-aggregate counts and the toolbar buttons stop wrapping at 1024px" gives the agent a concrete target.
- **Let skills cite heuristics.** `audit-ux` and `enhance-page-ux` insist every change names the heuristic it satisfies — review the citation, not just the diff. If the citation is weak, the change probably is too.
- **Stack a slow-then-fast workflow.** `/plan` first (slow, in Plan Mode) → switch to Agent Mode for execution → `/review` before `/commit` → `/pr` at the end.
- **Compose skills.** Run `audit-ux` → review report → run `enhance-page-ux` for the top 3 issues → run `enhance-page-ui` for visual polish → `/commit`. Each skill leaves clear write-up tables for the next one.
- **Don't fight the rules.** Project rules in `.cursor/rules/*.mdc` constrain the agent; if a rule blocks something legitimate, edit the rule rather than ignoring it.
- **Update often.** `cd ~/cursor-kenji && git pull && ./install.sh`.

---

## Skills (57)

### Skill Categories at a Glance

```mermaid
mindmap
  root((57 Skills))
    Enhance
      enhance-page-ui
      enhance-page-ux
      enhance-readme
    Design & Frontend
      design-frontend
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
      design-api
      error-handling
      code-antipatterns
      audit-code-review
      codebase-coherency
      workflow-refactor
      audit-performance
      audit-security
      audit-accessibility
    Audits & Monitoring
      audit-db-schema
      audit-fe-api
      audit-langfuse-llm
      audit-uiux-design-system
      audit-ux
      debug-sentry-monitor
      deploy-verify
    Debugging
      debug-error
      debug-fe-be-integration
    Engineering Practices
      tdd
      spec-writing
      parallel-agents
      hooks-builder
      karpathy-guidelines
      test-unit
      test-qa
      workflow-pr
      protocol-browser-anti-stall
    Process & Docs
      workflow-git-commit
      docs-coauthor
      docs-writer
      design-prd
      creative-workflow
      workflow-housekeep
    File Handling
      file-docx
      file-pdf
      file-pptx
      file-xlsx
    Meta & Tooling
      meta-skill-creator
      meta-mcp-builder
      webapp-testing
```

---

### Enhance <sup>New Apr 2026</sup>

> *Make existing pages and READMEs feel hand-crafted. Generic across any web stack.*

| Skill | What it Does |
|:------|:-------------|
| `enhance-page-ui` | Composition before decoration — hierarchy, grouping, spacing, motion. Subtract clutter, group related, pin metadata, soften scroll edges. NN/g + Laws of UX grounded |
| `enhance-page-ux` | Replace stacked / templated UI with semantic data wired to real backend state. Every change cites a Nielsen heuristic, uses existing primitives, verified at 1440/1024/800 viewports |
| `enhance-readme` | Theme-aware hero (`<picture>` dark/light auto-swap) + tour grid + optional autoplay GIF via Playwright MCP. Works for any repo with a live URL or local dev server |

### Design & Frontend

> *Build distinctive, production-grade interfaces*

| Skill | What it Does |
|:------|:-------------|
| `design-frontend` | Production-grade UI avoiding generic AI aesthetics |
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
| `design-api` | REST conventions, error schemas, pagination, versioning |
| `error-handling` | Error boundaries, Server Action errors, toast patterns |
| `code-antipatterns` | Detect and fix React, TypeScript, state anti-patterns |
| `audit-code-review` | Thorough PR reviews — correctness, security, perf, a11y checklist |
| `codebase-coherency` | Naming, imports, organization consistency audit |
| `workflow-refactor` | Safe, incremental code transformations |
| `audit-performance` | Core Web Vitals, bundle analysis, runtime profiling |
| `audit-security` | OWASP Top 10, auth flows, RLS, secrets management |
| `audit-accessibility` | WCAG 2.1 AA compliance, screen reader, keyboard, ARIA |

### Engineering Practices <sup>New in 2026</sup>

| Skill | What it Does |
|:------|:-------------|
| `tdd` | Test-driven development with AI — Red/Green/Refactor, Vitest patterns, agent-compatible TDD workflow |
| `spec-writing` | Write effective specs and briefs so agents produce correct implementations first time |
| `parallel-agents` | Run agents in parallel via git worktrees, cloud agents, and multi-model comparison |
| `hooks-builder` | Build Cursor Agent Hooks — auto-formatters, security gates, secret scanners, loop automation |
| `karpathy-guidelines` | Behavioral guardrails (Think before coding, Simplicity first, Surgical changes, Goal-driven execution) — distilled from Karpathy's LLM coding pitfalls |

### Process & Documentation

| Skill | What it Does |
|:------|:-------------|
| `workflow-git-commit` | Branching, conventional commits, PRs, releases |
| `docs-coauthor` | Structured co-authoring for specs, PRDs, RFCs |
| `creative-workflow` | End-to-end feature development workflow |

### Audits & Monitoring <sup>New</sup>

> *Deep, MCP-powered audits across the full stack*

| Skill | What it Does |
|:------|:-------------|
| `audit-db-schema` | Database schema audit — naming, types, constraints, indexes, RLS, migrations, security |
| `audit-fe-api` | Frontend API calls vs backend — contract alignment, caching, error handling |
| `audit-langfuse-llm` | PDCA audit for LLM features — traces, prompts, costs, evals, grounding via Langfuse |
| `audit-uiux-design-system` | Visual token compliance vs design system — colors, spacing, components, WCAG |
| `audit-ux` <sup>NEW</sup> | Generic UX audit — NN/g 10 heuristics, Laws of UX, Intuit Content Design, HEART metrics. Stack-agnostic |
| `debug-sentry-monitor` | Sentry issue triage, root cause analysis, noise filtering, architecture audit |
| `deploy-verify` | Post-deploy smoke test — Sentry + Supabase + Langfuse + Playwright, ship-or-rollback verdict |

### Debugging <sup>New</sup>

> *Systematic root cause analysis, not guessing*

| Skill | What it Does |
|:------|:-------------|
| `debug-error` | Systematic debugging workflow — reproduce, isolate, research, fix, verify, prevent |
| `debug-fe-be-integration` | FE/BE integration debug — backend logs, API mismatches, both-side fixes |

### Testing & QA <sup>New</sup>

> *From unit tests to full E2E QA*

| Skill | What it Does |
|:------|:-------------|
| `test-unit` | Auto-detect framework, research patterns, Sentry coverage gaps, write tests |
| `test-qa` | Comprehensive QA via browser MCP — CRUD lifecycle, data pipeline, UX quality audit |
| `workflow-pr` | PR lifecycle — validation, monitoring, bot feedback, merge criteria |
| `protocol-browser-anti-stall` | Anti-stall protocol for browser automation — timeouts, retries, evidence gathering |

### Product & Documentation <sup>New</sup>

> *From PRD to production docs*

| Skill | What it Does |
|:------|:-------------|
| `design-prd` | Generate PRDs via structured conversation — competitive research, technical feasibility |
| `docs-writer` | Write READMEs, API docs, architecture docs, code comments |
| `workflow-housekeep` | Full-cycle repo maintenance — README sync, dead file cleanup, dependency updates, config audit |

### File Handling <sup>New</sup>

> *Create and manipulate Office documents and PDFs*

| Skill | What it Does |
|:------|:-------------|
| `file-docx` | Word documents — create, edit, tracked changes, comments, text extraction |
| `file-pdf` | PDF processing — extract text/tables, create, merge/split, forms, OCR |
| `file-pptx` | PowerPoint — create from HTML, edit slides, extract content, visual validation |
| `file-xlsx` | Spreadsheets — formulas, formatting, data analysis, financial model standards |

### Meta & Tooling

| Skill | What it Does |
|:------|:-------------|
| `meta-skill-creator` | Guide for creating new Agent Skills |
| `meta-mcp-builder` | Build MCP servers for LLM tool integration |
| `webapp-testing` | Playwright browser automation and E2E testing |

<details>
<summary><strong>Cursor-Specific Skills (12)</strong></summary>

| Skill | What it Does |
|:------|:-------------|
| `babysit` | Keep a PR merge-ready — triage comments, resolve conflicts, fix CI in a loop |
| `canvas` | Live React canvas beside chat — rich data visualizations, audit reports, interactive tools |
| `create-hook` | Create Cursor hooks — scripts/prompts for before/after agent events |
| `create-rule` | Create `.cursor/rules/` for persistent AI guidance |
| `create-skill` | Create new Agent Skills in `~/.cursor/skills/` |
| `create-subagent` | Create custom subagents in `.cursor/agents/` |
| `migrate-to-skills` | Convert rules/commands to Skills format |
| `shell` | Direct shell execution — run `/shell` commands without interpretation |
| `split-to-prs` <sup>NEW</sup> | Slice one pile of work into small reviewable PRs — safe snapshot, no destructive git ops, approval-gated |
| `statusline` | Configure CLI status line — model, context usage, git info |
| `update-cli-config` | Modify CLI settings — permissions, sandbox, vim mode, display |
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
