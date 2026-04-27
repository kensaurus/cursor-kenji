# Skill & Command Catalog

Complete reference for all skills, commands, and their trigger phrases.

---

## Skills

### Enhance

#### `enhance-page-ui`
**Triggers:** "make this page nicer", "more polished", "more beautiful", "more editorial", "more premium", "less crowded", "less AI-generated", "better laid out", "better balanced", "typography", "visual hierarchy", "progressive disclosure", "empty/dead space", "scroll fades", "microinteractions", "motion", "hover states", "cards", "grids", "density", "cosmetic UI polish"
**What it does:** Composition before decoration — fix hierarchy, grouping, alignment, and rhythm before adding gradients, motion, blur, masks, or shadows. Subtract clutter, group related, pin metadata, soften scroll cuts, animate purposefully. Generic across web stacks.
**Related:** `enhance-page-ux`, `audit-uiux-design-system`, `design-frontend`

#### `enhance-page-ux`
**Triggers:** "enhance this page", "make /xxx better", "this page feels AI-generated", "fix UX of /xxx", "improve information density", "icons all look the same", "buttons wrap to 2 lines", "empty columns", "I can't tell which is which"
**What it does:** Replaces generic / "stacked" UI with semantic data wired to real backend state. Inventories primitives FIRST, maps every pain to an NN/g heuristic, fixes at the helper / token level (not row-by-row), verified live at 1440/1024/800 viewports via browser MCP. Generic — works on any webapp regardless of stack.
**Related:** `enhance-page-ui`, `audit-ux`, `audit-uiux-design-system`

#### `enhance-readme`
**Triggers:** "enhance README", "make README prettier", "add screenshots to README", "showcase the app in README", "design the README", "add hero image", "spice up README", "make README more fun", "add animated demo to README", "record a tour GIF", "make a README GIF"
**What it does:** Theme-aware hero + tour grid + optional autoplay GIF via Playwright MCP. Captures live screenshots at 1600x1000 in dark and light mode, pairs them with `<picture>` for auto theme-swap, and inlines them into the README with GitHub-supported HTML. Companion scripts at `~/.cursor/skills/enhance-readme/scripts/`.
**Related:** `webapp-testing`, `protocol-browser-anti-stall`

### Design & Frontend

#### `design-frontend`
**Triggers:** "make it look good", "beautify", "style this", "redesign", "modern UI", "professional look", "improve the design"
**What it does:** Creates distinctive, production-grade frontend interfaces avoiding generic AI aesthetics. Enforces bold design thinking with intentional typography, color, motion, and spatial composition.
**Related:** `design-system`, `motion-design`, `theme-factory`

#### `design-system`
**Triggers:** "design system", "component library", "tokens", "variants", "consistent styling", "reusable components"
**What it does:** Build scalable design systems with CSS custom properties, CVA variants, compound components, and Radix primitives. Includes token architecture and documentation patterns.
**Related:** `design-frontend`, `codebase-coherency`

#### `motion-design`
**Triggers:** "animation", "transition", "micro-interaction", "motion", "animate", "hover effect", "scroll animation", "page transition", "make it interactive"
**What it does:** Framer Motion, CSS animations, GSAP patterns. Covers entrance/exit animations, staggered lists, scroll-triggered effects, page transitions, and layout animations. Always respects `prefers-reduced-motion`.
**Related:** `creative-effects`, `interactive-ux`, `design-frontend`

#### `creative-effects`
**Triggers:** "3D", "WebGL", "shader", "particles", "visual effects", "creative coding", "immersive", "interactive background", "hero effect", "wow factor"
**What it does:** Three.js with React Three Fiber, custom shaders, Canvas 2D particle systems, CSS/SVG effects (glassmorphism, gradient animations, noise textures), mouse-following effects.
**Related:** `motion-design`, `algorithmic-art`, `design-frontend`

#### `uiux-enhancement`
**Triggers:** "improve UI", "polish", "enhance", "fix usability", "user flow", "make intuitive", "loading states", "empty states", "mobile experience", "micro-interactions"
**What it does:** Incremental UX improvements. Enforces existing design system, fixes rogue implementations, standardizes interactions, adds missing states (loading, empty, error).
**Related:** `design-frontend`, `design-system`, `audit-accessibility`

#### `interactive-ux`
**Triggers:** "fun interactions", "playful UI", "gamification", "delightful", "engaging", "interactive experience", "Easter eggs", "surprise and delight", "memorable UX"
**What it does:** Confetti celebrations, bouncy/magnetic/jelly buttons, satisfying toggles, progress bars with personality, achievement badges, streak counters, Konami codes, sound design.
**Related:** `motion-design`, `creative-effects`

#### `mobile-first`
**Triggers:** "mobile", "responsive", "touch", "PWA", "mobile-first", "small screen", "tablet", "swipe", "gesture"
**What it does:** Touch-optimized navigation, bottom sheets, swipe-to-delete, pull-to-refresh, responsive tables/grids, 44px touch targets, safe area handling, PWA install prompts.
**Related:** `design-frontend`, `audit-performance`

#### `theme-factory`
**Triggers:** "apply theme", "color palette", "brand colors", "styling slides", "presentation design", "visual identity"
**What it does:** 11 pre-set visual themes with curated colors and fonts. Apply cohesive styling across artifacts.
**Related:** `design-system`, `design-frontend`

### Data & Creative

#### `data-visualization`
**Triggers:** "chart", "graph", "visualization", "dashboard", "analytics", "D3", "Recharts", "data display", "metrics", "statistics"
**What it does:** Recharts (line, bar, area, pie/donut), sparklines, stat cards with trends, real-time chart updates, D3.js custom visualizations. Includes accessibility patterns for charts.
**Related:** `design-frontend`, `design-system`

#### `algorithmic-art`
**Triggers:** "generative art", "procedural art", "flow fields", "particle systems", "creative coding", "noise patterns", "mathematical visualizations", "art from code", "generate visuals", "interactive animation"
**What it does:** Seeded randomness, flow fields, recursive subdivision, circle packing, L-systems, animation loops. React component pattern with controllable parameters and PNG/SVG export.
**Related:** `creative-effects`, `motion-design`, `canvas-design`

### Backend & Database

#### `backend-patterns`
**Triggers:** "API design", "database schema", "authentication", "caching", "queues", "background jobs", "microservices", "serverless", "backend architecture"
**What it does:** Server Actions (Next.js 15), tRPC routers, Supabase Edge Functions, database patterns (optimistic locking, soft deletes, audit logging), caching (Next.js cache, Redis), background jobs (Inngest, Trigger.dev), rate limiting.
**Related:** `design-api`, `database-optimization`, `error-handling`

#### `database-optimization`
**Triggers:** "slow query", "database performance", "timeout", "index", "query optimization", "Prisma", "Supabase", "PostgreSQL"
**What it does:** N+1 query detection and fixes, index strategy (single, composite, partial, GIN), EXPLAIN ANALYZE interpretation, Prisma/Supabase query patterns, pagination (offset vs cursor), batch operations, RLS performance.
**Related:** `backend-patterns`, `audit-performance`

#### `realtime-features`
**Triggers:** "real-time", "live updates", "WebSocket", "notifications", "chat", "collaborative", "presence", "live data", "instant sync"
**What it does:** Supabase Realtime subscriptions, Server-Sent Events, WebSocket patterns, presence tracking, live data synchronization.
**Related:** `backend-patterns`, `data-visualization`

### Architecture & Quality

#### `design-api`
**Triggers:** "API", "endpoint", "REST", "GraphQL", "route handler", "request/response", "HTTP methods"
**What it does:** RESTful resource design, request/response schemas, HTTP status codes, pagination (offset/cursor), filtering/sorting, versioning, authentication patterns, error handling, Server Actions vs Route Handlers decision matrix.
**Related:** `backend-patterns`, `error-handling`

#### `error-handling`
**Triggers:** "error boundary", "try/catch", "error state", "toast notification", "form validation error", "API error handling"
**What it does:** Standard error types, Server Action error patterns, form error display (React 19 useActionState), error boundaries, API route error handling, TanStack Query error handling, error state UI components, monitoring/logging.
**Related:** `design-api`, `backend-patterns`

#### `code-antipatterns`
**Triggers:** "code smell", "bad practice", "anti-pattern", "technical debt", "cleanup", "why is this slow/broken"
**What it does:** Detects React anti-patterns (prop drilling, derived state in useState, useEffect for data fetching), TypeScript anti-patterns (any, type assertions, enums), state management anti-patterns, architecture anti-patterns (circular deps, god files, business logic in components).
**Related:** `workflow-refactor`, `codebase-coherency`

#### `codebase-coherency`
**Triggers:** "inconsistent", "standardize", "conventions", "cleanup codebase", "why different patterns", "onboarding to codebase"
**What it does:** Systematic audit across naming conventions, file organization, import patterns, component patterns, state management consistency, error handling patterns, type definitions, API patterns, styling patterns, testing patterns. Includes report template.
**Related:** `code-antipatterns`, `workflow-refactor`

#### `workflow-refactor`
**Triggers:** "refactor", "split file", "extract", "cleanup", "reorganize", "too big", "technical debt"
**What it does:** Safe, incremental code transformations. Extract to utils/hooks/components/types/services. Barrel files, separation of concerns, performance patterns (memoization, code splitting), clean code patterns (early returns, derived state, no magic values).
**Related:** `code-antipatterns`, `codebase-coherency`

#### `audit-performance`
**Triggers:** "slow", "performance", "LCP", "INP", "CLS", "bundle size", "loading time", "optimize", "Web Vitals", "lighthouse score"
**What it does:** Core Web Vitals assessment (LCP, INP, CLS), bundle analysis, network optimization, JavaScript/CSS performance, React 19+ optimizations, image optimization, server-side optimizations. Includes audit report template.
**Related:** `database-optimization`, `mobile-first`

#### `audit-security`
**Triggers:** "security", "vulnerability", "XSS", "CSRF", "SQL injection", "auth", "RLS", "secrets", "security headers"
**What it does:** OWASP Top 10 review, authentication flow audit, RLS policy verification, secrets management, CSP headers, input validation, rate limiting assessment.
**Related:** `backend-patterns`, `design-api`

#### `audit-accessibility`
**Triggers:** "accessible", "WCAG", "ADA", "a11y", "screen reader", "disability"
**What it does:** WCAG 2.1 AA compliance audit. Form labels, color contrast, keyboard navigation, focus management, alt text, dynamic content announcements, skip links, accessible modals/tables/forms. Includes automated testing (axe, pa11y, Lighthouse).
**Related:** `design-frontend`, `uiux-enhancement`

### Process & Documentation

#### `workflow-git-commit`
**Triggers:** "git", "commit message", "branch", "PR", "pull request", "merge", "rebase", "release", "changelog"
**What it does:** GitHub Flow/GitFlow branching, conventional commits, PR templates, code review checklists, merge strategies, semantic versioning, release workflow, conflict resolution, git hooks.
**Related:** `codebase-coherency`

#### `docs-coauthor`
**Triggers:** "write a doc", "draft proposal", "help me document", "create spec", "design document", "PRD", "RFC", "ADR"
**What it does:** Three-stage workflow: Context Gathering (questions, info dumping), Refinement & Structure (brainstorm, curate, draft per section), Reader Testing (predict questions, verify answers, fix gaps).
**Related:** `creative-workflow`

#### `canvas-design`
**Triggers:** "poster", "visual design", "infographic", "certificate", "badge", "banner", "social media graphic", "print design", "create artwork", "design graphic"
**What it does:** Museum-quality visual design through named design philosophies ("Brutalist Joy", "Chromatic Silence"). Creates .md philosophy files and .pdf/.png visual artifacts.
**Related:** `design-frontend`, `theme-factory`

#### `creative-workflow`
**Triggers:** "build", "create", "implement feature", "end-to-end", "full stack implementation"
**What it does:** End-to-end development workflow: Discovery & Context, Design Direction, Component Architecture, Implementation (types → server → hooks → UI → page), Polish & Delight, Validation.
**Related:** All skills (orchestrator)

### Meta & Tooling

#### `meta-skill-creator`
**Triggers:** "create skill", "SKILL.md format", "skill structure", "skill best practices"
**What it does:** Guide for creating effective AI agent skills with proper frontmatter, descriptions, and structure.

#### `meta-mcp-builder`
**Triggers:** "MCP", "Model Context Protocol", "AI tools", "LLM integration", "agent tools", "build MCP server"
**What it does:** Four-phase MCP server development: Research & Planning, Implementation (TypeScript/Python SDK), Review & Test, Create Evaluations.

#### `webapp-testing`
**Triggers:** "test UI", "Playwright", "e2e test", "browser test", "screenshot", "automate browser", "verify functionality"
**What it does:** Playwright automation for testing frontend functionality, capturing screenshots, form testing, visual regression.

---

## Commands

| Command | File | Quick Reference |
|---------|------|-----------------|
| `/plan` | `plan.md` | Plan Mode — research codebase, clarify, produce approved plan before coding |
| `/commit` | `commit.md` | Lint → Sentry pre-check → build verify → auto-detect scope → conventional commit → push |
| `/pr` | `pr.md` | Checks pass → commit → push → open PR with title and description |
| `/fix-issue` | `fix-issue.md` | Fetch GitHub issue → find code → implement fix → open PR |
| `/debug` | `debug.md` | Debug Mode — hypothesis-driven, instruments code, pinpoints root cause |
| `/review` | `review.md` | Agent review pass + manual checklist (correctness, security, perf, a11y) |
| `/test` | `test.md` | Type check → lint → unit → integration → E2E → coverage |
| `/update-deps` | `update-deps.md` | Audit and safely update dependencies one at a time with changelog review |
| `/research` | `research.md` | Three-phase Firecrawl deep research → gap analysis → implementation plan |
| `/readme` | `readme.md` | Scan changes → detect convention → update READMEs → verify links |
| `/refactor` | `refactor.md` | Analyze → split → barrel files → verify behavior |
| `/mcp` | `mcp.md` | MCP-powered dev workflow reference |
| `/uiux` | `uiux.md` | Discover system → detect rogue → fix → validate |

---

### Audits & Monitoring

#### `audit-db-schema`
**Triggers:** "schema review", "database audit", "naming conventions", "RLS audit", "migration check", "index audit", "constraint check"
**What it does:** Audit database schema for consistency, robustness, and industry standards. Auto-detects database type (Supabase/Postgres/MySQL), ORM (Prisma/Drizzle/Sequelize), and migration tool. Uses Supabase MCP for live schema inspection, Firecrawl for current best practices, Context7 for ORM docs. Covers naming, types, constraints, indexes, RLS, relationships, migrations, security.
**Related:** `database-optimization`, `audit-security`

#### `audit-fe-api`
**Triggers:** "API audit", "frontend API", "API mismatch", "request optimization", "API contract", "network requests"
**What it does:** Audit frontend API calls against backend implementation. Auto-detects API client, state management, and backend framework. Uses Sentry MCP for production API errors, Firecrawl for best practices. Validates endpoints exist, parameters match, types align, caching configured, error handling present.
**Related:** `debug-fe-be-integration`, `design-api`

#### `audit-langfuse-llm`
**Triggers:** "audit LLM", "check Langfuse", "audit prompts", "check AI quality", "LLM PDCA", "audit AI costs", "check traces", "audit eval scores", "check hallucination"
**What it does:** PDCA quality audit for LLM/AI features via Langfuse CLI, Sentry, Supabase, Playwright, and Firecrawl. Audits traces, prompts, costs, evals. Performs live verification and grounding/hallucination checks. Includes prompt improvement cycle with measurable before/after comparison.
**Related:** `deploy-verify`, `debug-sentry-monitor`

#### `audit-ux`
**Triggers:** "UX audit", "usability review", "heuristic evaluation", "content audit", "interaction design review", "user flow analysis", "UX quality", "evaluate usability", "audit microcopy", "check UX heuristics", "assess cognitive load"
**What it does:** Research-driven UX audit grounded in Nielsen Norman Group's 10 heuristics, Laws of UX (Fitts's, Hick's, Miller's, Jakob's), Intuit Content Design principles, and Google HEART metrics. Browser MCP for live walkthrough, Firecrawl for fresh research, Sequential Thinking for complex flow analysis. Generic — works with any webapp regardless of tech stack. For visual design system compliance only, use `audit-uiux-design-system`.
**Related:** `audit-uiux-design-system`, `audit-accessibility`, `enhance-page-ux`

#### `audit-uiux-design-system`
**Triggers:** "design system audit", "UI consistency", "token compliance", "design drift", "component audit", "visual coherency", "Nielsen heuristics"
**What it does:** Audit UI/UX coherency against design system. Auto-detects CSS framework, component library, icon library. Checks token compliance (colors, typography, spacing, radii, shadows), component modularity, live visual verification via browser MCP, WCAG AA accessibility, Nielsen's 10 heuristics.
**Related:** `design-system`, `audit-accessibility`, `uiux-enhancement`

#### `debug-sentry-monitor`
**Triggers:** "check Sentry", "fix Sentry", "triage errors", "production errors", "monitoring", "error tracking", "run sentry check"
**What it does:** Monitor, triage, fix, and enhance Sentry error monitoring. Auto-detects org, project, framework, config. Fetches issues via Sentry MCP, triages (noise/bug/perf/regression), root cause analysis with Seer AI, fixes code, updates noise filters, audits monitoring architecture. Resolves only after verified fixes.
**Related:** `debug-error`, `deploy-verify`

#### `deploy-verify`
**Triggers:** "verify deploy", "post-deploy check", "smoke test production", "ship or rollback", "deploy health check", "post-release check"
**What it does:** Post-deploy smoke test combining Sentry + Supabase + Langfuse + Playwright + Firecrawl. Checks for new errors, verifies migration health, confirms trace pipeline, runs browser smoke test on critical paths. Produces binary SHIP/ROLLBACK/MONITOR verdict with evidence.
**Related:** `debug-sentry-monitor`, `audit-langfuse-llm`

### Debugging

#### `debug-error`
**Triggers:** "debug", "error", "bug", "broken", "not working", "exception", "crash", "investigate"
**What it does:** Systematic debugging: reproduce → isolate → research → identify root cause → fix → verify → prevent. Integrates Sentry MCP for production context, Firecrawl for fix patterns, Context7 for library docs. Anti-pattern checklist prevents band-aid fixes.
**Related:** `debug-fe-be-integration`, `debug-sentry-monitor`

#### `debug-fe-be-integration`
**Triggers:** "API error", "4xx error", "5xx error", "validation error", "integration issue", "backend error", "FE-BE mismatch"
**What it does:** Debug frontend-backend integration by analyzing backend logs, production errors (Sentry), and source code. Auto-detects FE/BE frameworks, API style, validation library. Maps errors to source code, verifies data state via Supabase MCP, generates both FE and BE fixes.
**Related:** `audit-fe-api`, `debug-error`

### Testing & QA

#### `test-unit`
**Triggers:** "write tests", "test coverage", "unit test", "test this", "add tests", "testing", "Jest", "Vitest", "pytest"
**What it does:** Write effective unit tests. Auto-detects framework (Vitest/Jest/pytest/Go/etc.), researches current patterns via Firecrawl, fetches testing library docs via Context7. Uses Sentry MCP to identify production errors lacking test coverage. Covers pure functions, async, mocking, React components, hooks, API routes.
**Related:** `tdd`, `test-qa`

#### `test-qa`
**Triggers:** "QA the app", "test the app", "find bugs", "test before release", "run QA", "test CRUD", "test data pipeline", "check for dead buttons", "pre-release testing"
**What it does:** Comprehensive QA via browser MCP tools. Auto-discovers pages, features, data entities, auth patterns from codebase. Generates user stories dynamically, performs real CRUD with data pipeline verification (FE → API → DB → FE), audits UX quality, tests edge cases. Structured pass/fail report with production readiness score.
**Related:** `test-unit`, `webapp-testing`, `protocol-browser-anti-stall`

#### `workflow-pr`
**Triggers:** "create PR", "pull request", "merge PR", "PR review", "PR checks", "merge criteria"
**What it does:** PR lifecycle from creation to merge. Runs validations, security scans, creates PR with template. Monitors checks (polls status), addresses bot feedback, ensures all threads resolved. Two-gate merge criteria: clean state + zero unresolved threads.
**Related:** `workflow-git-commit`, `audit-code-review`

#### `protocol-browser-anti-stall`
**Triggers:** (protocol — used by other skills before browser automation)
**What it does:** Prevent browser automation freezing. Rules: navigation guard with snapshot verification, max 3-second waits, incremental wait pattern, max 4 attempts per goal, evidence before retry, timeout budgets, SPA-specific rules, fresh refs after state changes, lock/unlock discipline.
**Related:** `test-qa`, `webapp-testing`, `deploy-verify`

### Product & Documentation

#### `design-prd`
**Triggers:** "PRD", "product requirements", "write a spec", "new feature spec", "feature requirements", "scope a feature"
**What it does:** Generate Product Requirements Documents via structured conversation. Auto-detects tech stack, existing features, data model. Uses Firecrawl for competitive research, Context7 for framework feasibility, Supabase MCP for data model verification. Produces actionable PRDs with technical feasibility sections.
**Related:** `docs-coauthor`, `spec-writing`

#### `docs-writer`
**Triggers:** "write documentation", "README", "API docs", "document this", "create docs", "architecture docs"
**What it does:** Write clear documentation. Templates for READMEs, API docs, code comments, architecture docs. Includes Mermaid diagram patterns. Enforces concise writing, structured information, and usage examples.
**Related:** `docs-coauthor`, `design-prd`

### Workflow & Maintenance

#### `workflow-housekeep`
**Triggers:** "housekeep", "clean up repo", "update README", "update dependencies", "fix vulnerabilities", "remove dead code", "tidy up", "repo maintenance", "spring clean", "prune", "declutter", "modernize the repo"
**What it does:** Full-cycle repository maintenance in 4 phases: README sync (verify against reality), dead file cleanup (logs, screenshots, build artifacts, deprecated code), dependency updates (audit, classify, update with research), and research-driven general cleanup (config audit, script audit, env var audit, gitignore modernization). Auto-detects ecosystem, package manager, and project structure.
**Related:** `workflow-refactor`, `docs-writer`, `audit-code-review`

### File Handling

#### `file-docx`
**Triggers:** "Word document", "docx", "create document", "edit document", "tracked changes", "redline"
**What it does:** Create, edit, and analyze .docx files. Supports tracked changes (redlining), comments, formatting preservation, text extraction via pandoc, raw XML access. Uses docx-js for creation and OOXML library for editing.
**Related:** `file-pdf`, `file-pptx`

#### `file-pdf`
**Triggers:** "PDF", "extract text", "merge PDF", "split PDF", "PDF form", "create PDF"
**What it does:** PDF processing with pypdf, pdfplumber, and reportlab. Extract text and tables, create new PDFs, merge/split documents, handle forms, OCR scanned PDFs, add watermarks, password protection.
**Related:** `file-docx`, `file-xlsx`

#### `file-pptx`
**Triggers:** "presentation", "PowerPoint", "slides", "pptx", "create slides", "deck"
**What it does:** Create, edit, and analyze presentations. HTML-to-PPTX workflow with design principles, color palettes, layout tips. Edit existing via OOXML. Thumbnail grid generation for visual validation. Supports charts and tables.
**Related:** `file-docx`, `canvas-design`

#### `file-xlsx`
**Triggers:** "spreadsheet", "Excel", "xlsx", "formulas", "financial model", "data analysis"
**What it does:** Spreadsheet creation, editing, analysis. Zero formula errors mandate. Financial model standards (color coding, number formatting). Uses openpyxl for formulas/formatting, pandas for data analysis. LibreOffice for formula recalculation.
**Related:** `file-pdf`, `data-visualization`

---

## Skill Composition Patterns

### Full Creative Build
`creative-workflow` → `design-frontend` + `motion-design` + `interactive-ux` + `creative-effects`

### Production Feature
`creative-workflow` → `backend-patterns` + `design-api` + `error-handling` + `audit-security`

### Performance Fix
`audit-performance` → `database-optimization` + `code-antipatterns` + `workflow-refactor`

### Design System Sprint
`design-system` → `design-frontend` + `audit-accessibility` + `mobile-first` + `theme-factory`

### Code Quality Review
`codebase-coherency` → `code-antipatterns` → `workflow-refactor` → `audit-security`

### Full Stack Audit
`audit-db-schema` + `audit-fe-api` → `debug-fe-be-integration` → `debug-sentry-monitor`

### Deploy Pipeline
`test-unit` → `test-qa` → `workflow-pr` → `deploy-verify`

### LLM Quality Cycle
`audit-langfuse-llm` → `debug-sentry-monitor` → `deploy-verify`

### Document Generation
`design-prd` → `docs-writer` + `file-docx` + `file-pdf`

### Repo Maintenance
`workflow-housekeep` → `docs-writer` + `workflow-refactor` + `audit-code-review`

### UX Polish (NEW)
`audit-ux` → `enhance-page-ux` → `enhance-page-ui` → `/commit`

### README Showcase (NEW)
`enhance-readme` → `/readme` → `/commit`

### Stack-Aware UI Quality (NEW)
`audit-uiux-design-system` (visual tokens) + `audit-ux` (heuristics) → `enhance-page-ux` (data + primitives) → `enhance-page-ui` (composition + motion)

---

## Cursor-Specific Skills

### `split-to-prs`
**Triggers:** "split this PR", "split this branch", "split this chat", "make smaller PRs", "break this up into PRs", "stack PRs"
**What it does:** Turn one pile of work into several small reviewable PRs. Compares current work to default branch, proposes a slice plan with Mermaid when needed, asks for approval before doing anything destructive. Saves a recoverable snapshot via `git stash create` + `update-ref refs/backup/...` before moving work around. Stages only named files or hunks — never `git add .`.
**Related:** `babysit`, `workflow-pr`
