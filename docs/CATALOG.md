# Skill & Command Catalog

Complete reference for all skills, commands, and their trigger phrases.

---

## Skills

### Enhance

#### `enhance-web-ui`
**Triggers:** "make this page nicer", "more polished", "more beautiful", "more editorial", "more premium", "less crowded", "less AI-generated", "better laid out", "better balanced", "typography", "visual hierarchy", "progressive disclosure", "empty/dead space", "scroll fades", "microinteractions", "motion", "hover states", "cards", "grids", "density", "cosmetic UI polish"
**What it does:** Composition before decoration — fix hierarchy, grouping, alignment, and rhythm before adding gradients, motion, blur, masks, or shadows. Subtract clutter, group related, pin metadata, soften scroll cuts, animate purposefully. Generic across web stacks.
**Related:** `enhance-web-ux`, `audit-uiux-design-system`, `design-frontend`

#### `enhance-web-ux`
**Triggers:** "enhance this page", "make /xxx better", "this page feels AI-generated", "fix UX of /xxx", "improve information density", "icons all look the same", "buttons wrap to 2 lines", "empty columns", "I can't tell which is which"
**What it does:** Replaces generic / "stacked" UI with semantic data wired to real backend state. Inventories primitives FIRST, maps every pain to an NN/g heuristic, fixes at the helper / token level (not row-by-row), verified live at 1440/1024/800 viewports via browser MCP. Generic — works on any webapp regardless of stack.
**Related:** `enhance-web-ui`, `audit-ux`, `audit-uiux-design-system`

#### `enhance-readme`
**Triggers:** "enhance README", "make README prettier", "add screenshots to README", "showcase the app in README", "design the README", "add hero image", "spice up README", "make README more fun", "add animated demo to README", "record a tour GIF", "make a README GIF"
**What it does:** Theme-aware hero + tour grid + optional autoplay GIF via Playwright MCP. Captures live screenshots at 1600x1000 in dark and light mode, pairs them with `<picture>` for auto theme-swap, and inlines them into the README with GitHub-supported HTML. Companion scripts at `~/.cursor/skills/enhance-readme/scripts/`.
**Related:** `webapp-testing`, `protocol-browser-anti-stall`

#### `enhance-capacitor-ui` <sup>NEW May 2026</sup>
**Triggers:** "improved one surface and broke the other", "looks great on web but cramped on mobile", "looks great on my laptop but atrocious on my phone", "ad-hoc useIsMobile branches", "single md: breakpoint everywhere", "platform-specific styling inline", "Capacitor / Tauri / Expo Web cross-surface issues", "hover-only affordances on touch"
**What it does:** Cross-surface UIUX separation skill for hybrid PWA + iOS + Android apps. Establishes three orthogonal axes — **form factor** (compact / medium / expanded), **platform** (web / ios / android), **pointer capability** (fine / coarse) — and a three-layer architecture (context hook, mode tokens, container-query primitives). Catches axis conflation in single booleans, viewport queries used for component micro-layout, hover-only affordances shipped to native shells, hardcoded chrome dimensions leaking into primitives, SSR/Capacitor first-paint mismatch. Generic across Tailwind 3/4, Next.js / Vite / React Router, Capacitor / Tauri / Expo Web / Ionic.
**Related:** `enhance-web-ui`, `enhance-web-ux`, `mobile-first`

#### `enhance-rn-screen`
**Triggers:** "this screen looks off", "feels clunky on iOS", "Android version looks wrong", "jank when scrolling", "button is unreachable", "polish this React Native screen", "safe area", "keyboard covers input", "FlatList re-renders"
**What it does:** Polishes an existing React Native screen to feel intentional and native. Catches RN-specific silent failures — safe-area violations, sub-minimum touch targets, keyboard occlusion, JS-thread animation jank, gesture conflicts, tab-bar content clipping, double safe-area insets, FlatList re-render storms — plus the platform-agnostic composition failures shared with the web skills. Applies to bare React Native, Expo bare, and Expo managed.
**Related:** `enhance-capacitor-ui`, `start-emulator`, `test-emulator`

#### `enhance-web-landing` <sup>NEW Jun 2026</sup>
**Triggers:** "build a landing page", "portfolio", "marketing site", "anti-slop", "Awwwards-style", "premium frontend", "make it not look AI-generated", "taste"
**What it does:** Anti-slop frontend skill for landing pages, portfolios, and marketing sites. Reads the brief, infers design direction, and tunes three dials (variance / motion / density). Brief inference, design-system map, hard em-dash ban, canonical motion code skeletons, strict pre-flight check. NOT for dashboards, data tables, or multi-step product UI. Adapted from [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill).
**Related:** `enhance-web-redesign`, `design-frontend`, `enhance-web-ui`

#### `enhance-web-redesign` <sup>NEW Jun 2026</sup>
**Triggers:** "redesign this site", "upgrade UI to premium", "remove AI slop patterns", "redesign audit", "make this existing site feel premium without breaking it"
**What it does:** Audit-first upgrade of an existing web project. Opens with a 60-second AI-tell triage (Inter, purple gradients, three equal cards, pill-everything, em-dash overuse), then scans the codebase, diagnoses generic patterns, and applies targeted fixes working with the existing stack — no rewrites. Adapted from [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) + [anti-slop-ui](https://github.com/awaken7050dev/anti-slop-ui).
**Related:** `enhance-web-landing`, `enhance-web-ui`, `audit-uiux-design-system`

#### `enhance-web-web3d` <sup>NEW Jun 2026</sup>
**Triggers:** "add 3D", "add a WebGL hero", "make it cinematic", "scroll-driven 3D", "three.js scene", "React Three Fiber", "GSAP scroll animation", "product configurator", "3D model viewer", "pinned scroll storytelling", "make the landing page feel immersive", "add a wow factor"
**What it does:** Audit-first elevation of an existing web app with 3D + cinematic motion. Scans the stack, runs a fit check (rejects 3D-for-3D's-sake), picks the minimal library combination (Three.js / R3F + GSAP ScrollTrigger + Motion / React Spring, optional Lenis), then ships the effect with a performance budget (DPR cap, <100 draw calls, Draco/KTX2, lazy-load, on-demand render, off-screen pause), mobile + no-WebGL fallbacks, `prefers-reduced-motion` support, and SSR/hydration safety (`ssr: false`, `useGSAP` cleanup) baked into the same change. GSAP is 100% free since Apr 2025. Generalized from the `web3d-integration-patterns` meta-skill in [freshtechbro/claudedesignskills](https://github.com/freshtechbro/claudedesignskills).
**Related:** `enhance-web-redesign`, `enhance-web-landing`, `creative-effects`, `motion-design`, `audit-performance`

#### `workflow-spec-tdd` <sup>NEW Jun 2026</sup>
**Triggers:** "build X", "implement", "add a feature", "do it properly", "this keeps breaking", "make it right", non-trivial feature/refactor/bug across web / RN / Capacitor
**What it does:** The anti-vibe-coding spine. Runs brainstorm → spec (the contract) → plan (file-mapped, ordered) → TDD (RED failing test → GREEN minimal code → REFACTOR) → self-review gate before declaring done. Operationalizes `karpathy-guidelines`. Adapted from [obra/superpowers](https://github.com/obra/superpowers) (MIT).
**Related:** `karpathy-guidelines`, `tdd`, `full-stack-ship-discipline`, `test-unit`, `test-playwright`

#### `capacitor-platform` <sup>NEW Jun 2026</sup>
**Triggers:** "add push notifications", "deep linking", "ship an OTA update", "set up native build CI", "submit to the App Store", "fix an App Store rejection", "make the app work offline", "migrate my web app to Capacitor"
**What it does:** Capacitor platform + pipeline depth — plugin selection, OTA/live updates, deep/universal links, push (FCM/APNs), offline-first, safe-area, native build CI/CD (Actions/GitLab/Fastlane), App Store/Play Store submission + Apple preflight, Capsec security scan, and web/Cordova/SPM/SQLite migrations. Distilled from [cap-go/capgo-skills](https://github.com/cap-go/capgo-skills) (48 skills, MIT).
**Related:** `enhance-capacitor-ui`, `workflow-spec-tdd`, `full-stack-ship-discipline`

#### `rn-performance` <sup>NEW Jun 2026</sup>
**Triggers:** "janky scroll", "slow startup", "huge bundle", "memory leak", "frame drops", "FlashList", "upgrade React Native", "bump Expo SDK"
**What it does:** React Native / Expo performance, build, and upgrade depth — FPS & re-renders, Hermes, TTI/startup, bundle & app size, FlashList, memory, Reanimated UI-thread animation, Turbo Modules, Android 16KB page alignment, and RN/Expo version upgrades. Diagnose-first (profile before fixing). Distilled from [callstack/agent-skills](https://github.com/callstackincubator/agent-skills) (MIT).
**Related:** `enhance-rn-screen`, `start-emulator`, `test-emulator`, `workflow-spec-tdd`

#### `data-pipeline` <sup>NEW Jun 2026</sup>
**Triggers:** "build an ingestion pipeline", "sync X into Y", "nightly aggregation", "process this queue", "backfill", "this cron double-counts", "dedupe", "the numbers are wrong after a retry", edge-function workers, `pg_cron` jobs
**What it does:** Build-time correctness for data pipelines / ETL / ingestion / edge-function workers / cron / queue consumers. Bakes in the 5 non-negotiables (idempotency, atomicity, data contracts, explicit delivery semantics, observability), a 4-layer staging architecture (Raw → Staged → Curated → Aggregated), windowed/chunked backfills with watermarks, dead-letter handling, and anti-patterns (monolithic DAGs, silent catch, count+1 on retryable paths, cron overlap). Supabase `pg_cron`/edge-function specifics included. Complements the Supabase plugin and `sbc-qa-data-integrity-audit`.
**Related:** `audit-db-schema`, `supabase-postgres-best-practices`, `full-stack-ship-discipline`, `workflow-spec-tdd`, `sbc-qa-data-integrity-audit`

#### `observability-instrumentation` <sup>NEW Jun 2026</sup>
**Triggers:** "add logging", "instrument this", "why can't I debug prod", "no observability", "correlate the error to the trace", "redact PII from logs", "set up alerts/SLOs", wiring Sentry context / Langfuse traces / structured logs
**What it does:** Build-time observability + logging discipline — the counterpart to the setup plugins and post-hoc audit skills. Centers on **correlation** (a shared request/trace id stamped on every log line, the Sentry scope, and the Langfuse trace so you pivot error ↔ trace ↔ log ↔ user in ≤2 clicks), structured + correctly-leveled logging (no `console.log` in prod), PII/secret redaction enforced at the logger + Sentry `beforeSend` + Langfuse masking, OTel-conventional span design with sampling that never drops errors, LLM trace capture (model/tokens/cost/latency linked back to the request id), and symptom-based alerts/SLOs. Vendor-neutral with Sentry, Langfuse, and OpenTelemetry GenAI patterns.
**Related:** `debug-sentry-monitor`, `audit-langfuse-llm`, `debug-error`, `data-pipeline`, `workflow-spec-tdd`

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

Commands fall into two groups: **standalone** (full playbook lives in the command file) and **pointer** (thin slash entry that redirects to one or more skills, where the full procedure lives). Skills auto-fire on natural language; commands fire only when you type `/`.

### Standalone

| Command | File | Quick Reference |
|---------|------|-----------------|
| `/plan` | `plan.md` | Plan Mode — research codebase, clarify, produce approved plan before coding |
| `/research` | `research.md` | Three-phase Firecrawl deep research → gap analysis → implementation plan |
| `/fix-issue` | `fix-issue.md` | Fetch GitHub issue → find code → implement fix → open PR |
| `/mcp` | `mcp.md` | MCP-powered dev workflow reference |

### Pointer (delegate to skill)

| Command | File | Points to | Notes |
|---------|------|-----------|-------|
| `/commit` | `commit.md` | `workflow-git-commit` | Pre-commit pipeline: lint, Sentry, build, scope, conventional commit, push |
| `/debug` | `debug.md` | `debug-error` | Hypothesis-driven debugging with runtime evidence |
| `/pr` | `pr.md` | `workflow-pr` | Pre-flight → commit → push → open PR |
| `/readme` | `readme.md` | `enhance-readme`, `docs-writer` | Visual showcase + content sync |
| `/refactor` | `refactor.md` | `workflow-refactor` | Analyze → split → extract → verify behavior |
| `/review` | `review.md` | `audit-code-review` | Agent review + manual checklist |
| `/test` | `test.md` | `test-unit`, `test-qa`, `test-emulator` | Type check → unit → integration → E2E |
| `/uiux` | `uiux.md` | `audit-uiux-design-system`, `audit-ux`, `enhance-web-ui`, `enhance-web-ux` | Audit + enhance UI/UX |
| `/update-deps` | `update-deps.md` | `workflow-housekeep` (Phase 3) | Audit and update dependencies safely |

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
**Related:** `audit-uiux-design-system`, `audit-accessibility`, `enhance-web-ux`

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

#### `deploy-npm` <sup>NEW May 2026</sup>
**Triggers:** "release", "publish to npm", "ship a new version", "cut a release", "deploy to production", "update the changelog and publish"
**What it does:** End-to-end release workflow for a Changesets + GitHub Actions + npm Trusted Publisher (OIDC) monorepo with per-package GitHub Releases. Drives the full chain — green CI → merge release PR → wait for the Version PR → resolve the `github-actions[bot]` anti-loop → dispatch publish → verify on npm and the GitHub Releases page.
**Related:** `deploy-verify`, `workflow-pr`

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

#### `test-playwright` <sup>NEW May 2026</sup>
**Triggers:** "test this with playwright", "test my changes", "test on localhost like a user", "PDCA this", "did you actually test it", "red-team this feature", "verify the work end-to-end"
**What it does:** Closes the PDCA loop after an implementation. Scopes to the current session's diff + blast radius, drives the live localhost app through the Playwright MCP **manually like a real user**, and **fixes** pain points/errors as it goes — full-stack (UI/UX + API + DB) — using Sentry/Supabase/Firecrawl. Red-teams the change and proposes enhancements. Distinct from `test-qa` (full-app crawl that only reports).
**Related:** `test-qa`, `protocol-browser-anti-stall`, `debug-fe-be-integration`

#### `test-emulator`
**Triggers:** "test on emulator", "QA Android build", "verify native build", "white screen", "cache rehydration", "RN sync empty state", "Expo dev-client QA"
**What it does:** Native build QA on Android emulator — three-layer CRUD verification across UI / API / DB, build-freshness + dual-auth phases, fixes for white-screen / cache-rehydration / sync-empty-state failure modes. Pairs Metro/adb walk with Supabase + Sentry MCPs for end-to-end coverage.
**Related:** `start-emulator`, `test-qa`, `debug-fe-be-integration`

#### `start-emulator` <sup>NEW May 2026</sup>
**Triggers:** "start emulator", "start Metro", "restart dev loop", "fix Cannot connect to Expo", "spin up new terminal instance", "stuck bundler", "align emulator geometry for scroll QA", "1080×4000 emulator"
**What it does:** Boots Metro + Android emulator (Expo dev-client / bare RN) in the right order — inspect existing IDE terminals first, kill stale ports/processes, choose "fresh cache wipe" vs "fast iteration" for Hot Reload, default to 1080×4000 display for tall QA screenshots, adb reverse + poll Metro `/status` before deeplink to avoid connection races. Pairs with `test-emulator` for full QA.
**Related:** `test-emulator`, native-rn-monorepo commands

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
`audit-ux` → `enhance-web-ux` → `enhance-web-ui` → `/commit`

### README Showcase (NEW)
`enhance-readme` → `/readme` → `/commit`

### Stack-Aware UI Quality (NEW)
`audit-uiux-design-system` (visual tokens) + `audit-ux` (heuristics) → `enhance-web-ux` (data + primitives) → `enhance-web-ui` (composition + motion)

### Cross-Surface UI Architecture (NEW May 2026)
`enhance-capacitor-ui` (architecture: axes + tokens + primitives) → `enhance-web-ui` (per-surface polish) → `enhance-web-ux` (data + heuristics)
*Run the architecture pass first when a hybrid web/iOS/Android app has axis conflation — otherwise per-surface polish will keep introducing regressions on the other surface.*

### Native RN Ship Loop (NEW May 2026)
`start-emulator` (boot Metro + adb cleanly) → `test-emulator` (CRUD + Sentry + Supabase verification) → `/rn-ship-ios` (verify → push → CI → TestFlight)

---

## Rules

Rules live at the repo's `rules/` top level (drop into a project's `.cursor/rules/` or `~/.cursor/rules/` for global).

### Global rules (`alwaysApply: true`)

| Rule | Enforces |
|:-----|:---------|
| `senior-engineer.md` | Full-stack execution protocol with MCP tool usage |
| `full-stack-ship-discipline.mdc` <sup>NEW May 2026</sup> | Every UI task is full-stack until verified end-to-end. Local migration files (`supabase/migrations/`, `prisma/migrations/`, `db/migrate/`) must be deployed via Supabase MCP `apply_migration` / `execute_sql` in the same chat and verified against `information_schema` / `pg_proc` / `pg_policies`. Treats new ERROR-level advisors as part of your change |
| `shell-first-search.md` <sup>NEW May 2026</sup> | Routes routine text/filename search to `Shell` (`grep -rn`, `find … -name`, `ls`) instead of `Grep`/`Glob`, which can hang for minutes on some Windows hosts. `SemanticSearch` stays for meaning-based queries, `Read` stays for known paths |

### Project rule bundles

| Bundle | When to install |
|:-------|:----------------|
| `rules/project-starter/` | Generic Next.js + Supabase + Tailwind starter — supabase, components, typescript, tailwind, git, data-fetching |
| `rules/native-rn-monorepo/` | React Native + Web monorepo where the dev is on Linux/Windows (no Mac) and iOS verification is CI-only. Pairs with `commands/native-rn-monorepo/` |

---

## Cursor-Specific Skills

### `split-to-prs`
**Triggers:** "split this PR", "split this branch", "split this chat", "make smaller PRs", "break this up into PRs", "stack PRs"
**What it does:** Turn one pile of work into several small reviewable PRs. Compares current work to default branch, proposes a slice plan with Mermaid when needed, asks for approval before doing anything destructive. Saves a recoverable snapshot via `git stash create` + `update-ref refs/backup/...` before moving work around. Stages only named files or hunks — never `git add .`.
**Related:** `babysit`, `workflow-pr`
