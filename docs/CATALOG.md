# Skill & Command Catalog

Complete reference for all skills, commands, and their trigger phrases.

---

## Skills

### Design & Frontend

#### `frontend-design`
**Triggers:** "make it look good", "beautify", "style this", "redesign", "modern UI", "professional look", "improve the design"
**What it does:** Creates distinctive, production-grade frontend interfaces avoiding generic AI aesthetics. Enforces bold design thinking with intentional typography, color, motion, and spatial composition.
**Related:** `design-system`, `motion-design`, `theme-factory`

#### `design-system`
**Triggers:** "design system", "component library", "tokens", "variants", "consistent styling", "reusable components"
**What it does:** Build scalable design systems with CSS custom properties, CVA variants, compound components, and Radix primitives. Includes token architecture and documentation patterns.
**Related:** `frontend-design`, `codebase-coherency`

#### `motion-design`
**Triggers:** "animation", "transition", "micro-interaction", "motion", "animate", "hover effect", "scroll animation", "page transition", "make it interactive"
**What it does:** Framer Motion, CSS animations, GSAP patterns. Covers entrance/exit animations, staggered lists, scroll-triggered effects, page transitions, and layout animations. Always respects `prefers-reduced-motion`.
**Related:** `creative-effects`, `interactive-ux`, `frontend-design`

#### `creative-effects`
**Triggers:** "3D", "WebGL", "shader", "particles", "visual effects", "creative coding", "immersive", "interactive background", "hero effect", "wow factor"
**What it does:** Three.js with React Three Fiber, custom shaders, Canvas 2D particle systems, CSS/SVG effects (glassmorphism, gradient animations, noise textures), mouse-following effects.
**Related:** `motion-design`, `algorithmic-art`, `frontend-design`

#### `uiux-enhancement`
**Triggers:** "improve UI", "polish", "enhance", "fix usability", "user flow", "make intuitive", "loading states", "empty states", "mobile experience", "micro-interactions"
**What it does:** Incremental UX improvements. Enforces existing design system, fixes rogue implementations, standardizes interactions, adds missing states (loading, empty, error).
**Related:** `frontend-design`, `design-system`, `accessibility-audit`

#### `interactive-ux`
**Triggers:** "fun interactions", "playful UI", "gamification", "delightful", "engaging", "interactive experience", "Easter eggs", "surprise and delight", "memorable UX"
**What it does:** Confetti celebrations, bouncy/magnetic/jelly buttons, satisfying toggles, progress bars with personality, achievement badges, streak counters, Konami codes, sound design.
**Related:** `motion-design`, `creative-effects`

#### `mobile-first`
**Triggers:** "mobile", "responsive", "touch", "PWA", "mobile-first", "small screen", "tablet", "swipe", "gesture"
**What it does:** Touch-optimized navigation, bottom sheets, swipe-to-delete, pull-to-refresh, responsive tables/grids, 44px touch targets, safe area handling, PWA install prompts.
**Related:** `frontend-design`, `performance-audit`

#### `theme-factory`
**Triggers:** "apply theme", "color palette", "brand colors", "styling slides", "presentation design", "visual identity"
**What it does:** 11 pre-set visual themes with curated colors and fonts. Apply cohesive styling across artifacts.
**Related:** `design-system`, `frontend-design`

### Data & Creative

#### `data-visualization`
**Triggers:** "chart", "graph", "visualization", "dashboard", "analytics", "D3", "Recharts", "data display", "metrics", "statistics"
**What it does:** Recharts (line, bar, area, pie/donut), sparklines, stat cards with trends, real-time chart updates, D3.js custom visualizations. Includes accessibility patterns for charts.
**Related:** `frontend-design`, `design-system`

#### `algorithmic-art`
**Triggers:** "generative art", "procedural art", "flow fields", "particle systems", "creative coding", "noise patterns", "mathematical visualizations", "art from code", "generate visuals", "interactive animation"
**What it does:** Seeded randomness, flow fields, recursive subdivision, circle packing, L-systems, animation loops. React component pattern with controllable parameters and PNG/SVG export.
**Related:** `creative-effects`, `motion-design`, `canvas-design`

### Backend & Database

#### `backend-patterns`
**Triggers:** "API design", "database schema", "authentication", "caching", "queues", "background jobs", "microservices", "serverless", "backend architecture"
**What it does:** Server Actions (Next.js 15), tRPC routers, Supabase Edge Functions, database patterns (optimistic locking, soft deletes, audit logging), caching (Next.js cache, Redis), background jobs (Inngest, Trigger.dev), rate limiting.
**Related:** `api-design`, `database-optimization`, `error-handling`

#### `database-optimization`
**Triggers:** "slow query", "database performance", "timeout", "index", "query optimization", "Prisma", "Supabase", "PostgreSQL"
**What it does:** N+1 query detection and fixes, index strategy (single, composite, partial, GIN), EXPLAIN ANALYZE interpretation, Prisma/Supabase query patterns, pagination (offset vs cursor), batch operations, RLS performance.
**Related:** `backend-patterns`, `performance-audit`

#### `realtime-features`
**Triggers:** "real-time", "live updates", "WebSocket", "notifications", "chat", "collaborative", "presence", "live data", "instant sync"
**What it does:** Supabase Realtime subscriptions, Server-Sent Events, WebSocket patterns, presence tracking, live data synchronization.
**Related:** `backend-patterns`, `data-visualization`

### Architecture & Quality

#### `api-design`
**Triggers:** "API", "endpoint", "REST", "GraphQL", "route handler", "request/response", "HTTP methods"
**What it does:** RESTful resource design, request/response schemas, HTTP status codes, pagination (offset/cursor), filtering/sorting, versioning, authentication patterns, error handling, Server Actions vs Route Handlers decision matrix.
**Related:** `backend-patterns`, `error-handling`

#### `error-handling`
**Triggers:** "error boundary", "try/catch", "error state", "toast notification", "form validation error", "API error handling"
**What it does:** Standard error types, Server Action error patterns, form error display (React 19 useActionState), error boundaries, API route error handling, TanStack Query error handling, error state UI components, monitoring/logging.
**Related:** `api-design`, `backend-patterns`

#### `code-antipatterns`
**Triggers:** "code smell", "bad practice", "anti-pattern", "technical debt", "cleanup", "why is this slow/broken"
**What it does:** Detects React anti-patterns (prop drilling, derived state in useState, useEffect for data fetching), TypeScript anti-patterns (any, type assertions, enums), state management anti-patterns, architecture anti-patterns (circular deps, god files, business logic in components).
**Related:** `refactoring`, `codebase-coherency`

#### `codebase-coherency`
**Triggers:** "inconsistent", "standardize", "conventions", "cleanup codebase", "why different patterns", "onboarding to codebase"
**What it does:** Systematic audit across naming conventions, file organization, import patterns, component patterns, state management consistency, error handling patterns, type definitions, API patterns, styling patterns, testing patterns. Includes report template.
**Related:** `code-antipatterns`, `refactoring`

#### `refactoring`
**Triggers:** "refactor", "split file", "extract", "cleanup", "reorganize", "too big", "technical debt"
**What it does:** Safe, incremental code transformations. Extract to utils/hooks/components/types/services. Barrel files, separation of concerns, performance patterns (memoization, code splitting), clean code patterns (early returns, derived state, no magic values).
**Related:** `code-antipatterns`, `codebase-coherency`

#### `performance-audit`
**Triggers:** "slow", "performance", "LCP", "INP", "CLS", "bundle size", "loading time", "optimize", "Web Vitals", "lighthouse score"
**What it does:** Core Web Vitals assessment (LCP, INP, CLS), bundle analysis, network optimization, JavaScript/CSS performance, React 19+ optimizations, image optimization, server-side optimizations. Includes audit report template.
**Related:** `database-optimization`, `mobile-first`

#### `security-audit`
**Triggers:** "security", "vulnerability", "XSS", "CSRF", "SQL injection", "auth", "RLS", "secrets", "security headers"
**What it does:** OWASP Top 10 review, authentication flow audit, RLS policy verification, secrets management, CSP headers, input validation, rate limiting assessment.
**Related:** `backend-patterns`, `api-design`

#### `accessibility-audit`
**Triggers:** "accessible", "WCAG", "ADA", "a11y", "screen reader", "disability"
**What it does:** WCAG 2.1 AA compliance audit. Form labels, color contrast, keyboard navigation, focus management, alt text, dynamic content announcements, skip links, accessible modals/tables/forms. Includes automated testing (axe, pa11y, Lighthouse).
**Related:** `frontend-design`, `uiux-enhancement`

### Process & Documentation

#### `git-workflow`
**Triggers:** "git", "commit message", "branch", "PR", "pull request", "merge", "rebase", "release", "changelog"
**What it does:** GitHub Flow/GitFlow branching, conventional commits, PR templates, code review checklists, merge strategies, semantic versioning, release workflow, conflict resolution, git hooks.
**Related:** `codebase-coherency`

#### `doc-coauthoring`
**Triggers:** "write a doc", "draft proposal", "help me document", "create spec", "design document", "PRD", "RFC", "ADR"
**What it does:** Three-stage workflow: Context Gathering (questions, info dumping), Refinement & Structure (brainstorm, curate, draft per section), Reader Testing (predict questions, verify answers, fix gaps).
**Related:** `creative-workflow`

#### `canvas-design`
**Triggers:** "poster", "visual design", "infographic", "certificate", "badge", "banner", "social media graphic", "print design", "create artwork", "design graphic"
**What it does:** Museum-quality visual design through named design philosophies ("Brutalist Joy", "Chromatic Silence"). Creates .md philosophy files and .pdf/.png visual artifacts.
**Related:** `frontend-design`, `theme-factory`

#### `creative-workflow`
**Triggers:** "build", "create", "implement feature", "end-to-end", "full stack implementation"
**What it does:** End-to-end development workflow: Discovery & Context, Design Direction, Component Architecture, Implementation (types → server → hooks → UI → page), Polish & Delight, Validation.
**Related:** All skills (orchestrator)

### Meta & Tooling

#### `skill-creator`
**Triggers:** "create skill", "SKILL.md format", "skill structure", "skill best practices"
**What it does:** Guide for creating effective AI agent skills with proper frontmatter, descriptions, and structure.

#### `mcp-builder`
**Triggers:** "MCP", "Model Context Protocol", "AI tools", "LLM integration", "agent tools", "build MCP server"
**What it does:** Four-phase MCP server development: Research & Planning, Implementation (TypeScript/Python SDK), Review & Test, Create Evaluations.

#### `webapp-testing`
**Triggers:** "test UI", "Playwright", "e2e test", "browser test", "screenshot", "automate browser", "verify functionality"
**What it does:** Playwright automation for testing frontend functionality, capturing screenshots, form testing, visual regression.

---

## Commands

| Command | File | Quick Reference |
|---------|------|-----------------|
| `/commit` | `commit.md` | Fix build, lint, type errors → commit → push |
| `/test` | `test.md` | Type check → lint → unit → integration → E2E → coverage |
| `/readme` | `readme.md` | Scan changes → update READMEs → sync docs |
| `/refactor` | `refactor.md` | Analyze → split → barrel files → verify behavior |
| `/research` | `research.md` | Define scope → scrape sources → validate → synthesize |
| `/mcp` | `mcp.md` | MCP-powered dev workflow reference |
| `/uiux` | `uiux.md` | Discover system → detect rogue → fix → validate |

---

## Skill Composition Patterns

### Full Creative Build
`creative-workflow` → `frontend-design` + `motion-design` + `interactive-ux` + `creative-effects`

### Production Feature
`creative-workflow` → `backend-patterns` + `api-design` + `error-handling` + `security-audit`

### Performance Fix
`performance-audit` → `database-optimization` + `code-antipatterns` + `refactoring`

### Design System Sprint
`design-system` → `frontend-design` + `accessibility-audit` + `mobile-first` + `theme-factory`

### Code Quality Review
`codebase-coherency` → `code-antipatterns` → `refactoring` → `security-audit`
