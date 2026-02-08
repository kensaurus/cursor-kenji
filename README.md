# cursor_kenji

A curated collection of **Cursor AI Agent Skills**, **Slash Commands**, **MCP configurations**, and **coding rules** — designed for modern full-stack development with React, Next.js, Supabase, and Tailwind.

This is a **living repository**: skills evolve with the ecosystem, new patterns replace old ones, and every update is versioned.

---

## What's Inside

```
cursor_kenji/
├── skills/                  # 27 Agent Skills (.cursor/skills/)
│   ├── accessibility-audit/
│   ├── algorithmic-art/
│   ├── api-design/
│   ├── backend-patterns/
│   ├── canvas-design/
│   ├── code-antipatterns/
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
│   ├── interactive-ux/
│   ├── mcp-builder/
│   ├── mobile-first/
│   ├── motion-design/
│   ├── performance-audit/
│   ├── realtime-features/
│   ├── refactoring/
│   ├── security-audit/
│   ├── skill-creator/
│   ├── theme-factory/
│   ├── uiux-enhancement/
│   └── webapp-testing/
├── skills-cursor/           # 5 Cursor-specific Skills
│   ├── create-rule/
│   ├── create-skill/
│   ├── create-subagent/
│   ├── migrate-to-skills/
│   └── update-cursor-settings/
├── commands/                # 7 Slash Commands (.cursor/commands/)
│   ├── commit.md
│   ├── mcp.md
│   ├── readme.md
│   ├── refactor.md
│   ├── research.md
│   ├── test.md
│   └── uiux.md
├── rules/                   # Cursor Rules
│   └── senior-engineer.md
├── mcp/                     # MCP Server Configurations
│   ├── mcp.json.template
│   └── README.md
├── docs/                    # Documentation
│   ├── CATALOG.md
│   └── CONTRIBUTING.md
└── install.sh               # One-command installer
```

---

## Quick Start

### One-Command Install

```bash
curl -sSL https://raw.githubusercontent.com/YOUR_USERNAME/cursor_kenji/main/install.sh | bash
```

Or clone and install manually:

```bash
git clone https://github.com/YOUR_USERNAME/cursor_kenji.git
cd cursor_kenji
chmod +x install.sh
./install.sh
```

### What the Installer Does

1. Backs up your existing `~/.cursor/skills/` (if any)
2. Symlinks or copies skills to `~/.cursor/skills/`
3. Symlinks or copies cursor-specific skills to `~/.cursor/skills-cursor/`
4. Copies the MCP config template to `~/.cursor/mcp.json` (won't overwrite)
5. Prints a summary of what was installed

---

## Skills Overview

### Design & Frontend (8 skills)

| Skill | Description |
|-------|-------------|
| **frontend-design** | Production-grade UI avoiding generic AI aesthetics |
| **design-system** | Component libraries, tokens, variants, CVA patterns |
| **motion-design** | Framer Motion, CSS animations, GSAP micro-interactions |
| **creative-effects** | WebGL, Three.js, shaders, particles, Canvas 2D |
| **uiux-enhancement** | Incremental UI/UX improvements and polish |
| **interactive-ux** | Gamification, Easter eggs, delightful interactions |
| **mobile-first** | Touch-optimized, responsive, PWA patterns |
| **theme-factory** | Apply cohesive visual themes across artifacts |

### Data & Visualization (2 skills)

| Skill | Description |
|-------|-------------|
| **data-visualization** | Recharts, D3.js, sparklines, real-time charts |
| **algorithmic-art** | Generative art, flow fields, L-systems, circle packing |

### Backend & Database (3 skills)

| Skill | Description |
|-------|-------------|
| **backend-patterns** | Server Actions, tRPC, Edge Functions, caching, jobs |
| **database-optimization** | Indexes, N+1 fixes, RLS performance, query tuning |
| **realtime-features** | WebSocket, Supabase Realtime, SSE, live data |

### Architecture & Quality (7 skills)

| Skill | Description |
|-------|-------------|
| **api-design** | REST conventions, error schemas, pagination, versioning |
| **error-handling** | Error boundaries, Server Action errors, toast patterns |
| **code-antipatterns** | Detect and fix React, TypeScript, state anti-patterns |
| **codebase-coherency** | Naming, imports, organization consistency audit |
| **refactoring** | Safe, incremental code transformations |
| **performance-audit** | Core Web Vitals, bundle analysis, runtime profiling |
| **security-audit** | OWASP Top 10, auth flows, RLS, secrets management |

### Process & Documentation (4 skills)

| Skill | Description |
|-------|-------------|
| **git-workflow** | Branching, conventional commits, PRs, releases |
| **doc-coauthoring** | Structured co-authoring for specs, PRDs, RFCs |
| **canvas-design** | Museum-quality visual design philosophy |
| **creative-workflow** | End-to-end feature development workflow |

### Meta & Tooling (3 skills)

| Skill | Description |
|-------|-------------|
| **skill-creator** | Guide for creating new Agent Skills |
| **mcp-builder** | Build MCP servers for LLM tool integration |
| **webapp-testing** | Playwright browser automation and E2E testing |

### Cursor-Specific (5 skills)

| Skill | Description |
|-------|-------------|
| **create-rule** | Create `.cursor/rules/` for persistent AI guidance |
| **create-skill** | Create new Agent Skills in `~/.cursor/skills/` |
| **create-subagent** | Create custom subagents in `.cursor/agents/` |
| **migrate-to-skills** | Convert rules/commands to Skills format |
| **update-cursor-settings** | Modify Cursor/VSCode settings.json |

---

## Commands Overview

| Command | Trigger | Purpose |
|---------|---------|---------|
| `/commit` | After coding | Fix build errors, lint, commit & push |
| `/test` | Before commit | Run tests, verify quality, check coverage |
| `/readme` | End of session | Sync all READMEs with session changes |
| `/refactor` | Long files | Split into clean, modular architecture |
| `/research` | Before coding | Scrape latest docs, patterns, solutions |
| `/mcp` | Dev workflow | MCP-powered development with all tools |
| `/uiux` | UI review | Enforce design system, fix rogue implementations |

---

## MCP Configuration

The `mcp/` folder contains a template for configuring MCP servers used by these skills:

| MCP Server | Purpose |
|------------|---------|
| **Sequential Thinking** | Step-by-step reasoning for complex tasks |
| **Context7** | Live, up-to-date library documentation |
| **Firecrawl** | Web scraping for research and docs |
| **Chrome DevTools** | Browser automation and testing |
| **Supabase** | Direct database access and management |

See [`mcp/README.md`](mcp/README.md) for setup instructions.

---

## Design Principles

These skills are built around core principles:

1. **Check Existing First** — Every skill starts by scanning the codebase. Never duplicate, always extend.
2. **Production-Ready** — No placeholders, no TODO comments. Code that ships.
3. **Modular & Composable** — Skills reference each other. Combine `frontend-design` + `motion-design` + `interactive-ux` for a full creative build.
4. **Creative Yet Disciplined** — Bold aesthetics backed by solid engineering. Distinctive, not generic.
5. **Modern Stack** — React 19, Next.js 15+, Tailwind v4, TypeScript strict, Zod validation.
6. **Accessibility by Default** — WCAG 2.1 AA compliance is non-negotiable.
7. **Performance Aware** — Every pattern considers bundle size, render performance, and Core Web Vitals.

---

## Keeping Up to Date

```bash
cd ~/cursor_kenji
git pull origin main
./install.sh
```

Or set up auto-sync:

```bash
# Add to crontab for daily sync
0 9 * * * cd ~/cursor_kenji && git pull origin main && ./install.sh --quiet
```

---

## Customization

### Adding Your Own Skills

```bash
mkdir -p skills/my-skill
cat > skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: Description of when this skill should be used
---

# My Custom Skill

Your skill content here...
EOF
```

See [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) for the full guide.

### Project-Specific Overrides

For project-specific skills, create them in your project's `.cursor/skills/` directory. Project-level skills take priority over global (`~/.cursor/skills/`) ones.

---

## Stack Compatibility

These skills are optimized for:

| Technology | Version | Notes |
|------------|---------|-------|
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

## License

MIT License. Use freely, modify freely, share freely.

---

*Built by Kenji. Enhanced continuously.*
