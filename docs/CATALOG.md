# Skill & Command Catalog

Complete reference for all skills, commands, and their trigger phrases.

---

## Skill Taxonomy

Every skill has a category prefix that tells you what it does at a glance:

| Prefix | Purpose |
|:-------|:--------|
| `audit-` | Read-only assessment that produces a structured report |
| `debug-` | Diagnose & fix a specific failure |
| `test-` | Write/run tests & QA |
| `design-` | Create something new (UI, system, API, spec, art) |
| `enhance-` | Improve existing web UI/UX |
| `backend-` | Server / data-layer engineering patterns |
| `data-` | Data visualization & pipeline correctness |
| `deploy-` | Release & post-deploy verification |
| `workflow-` | Dev process (git, PR, refactor, spec-TDD, housekeep) |
| `docs-` | Documentation authoring |
| `mobile-` | Native / React Native / emulator / Capacitor |
| `meta-` | Authoring skills & MCP servers |
| `protocol-` | Session-level protocols used by other skills |

---

## Skills (73)

### Enhance

#### `enhance-web-ui`
**Triggers:** "make this page nicer", "more polished", "more beautiful", "less crowded", "less AI-generated", "better laid out", "typography", "visual hierarchy", "empty/dead space", "fades", "microinteractions", "density"
**What it does:** Composition before decoration — fix hierarchy, grouping, alignment, rhythm. Subtract clutter, group related items, soften scroll cuts, animate purposefully. Generic across web stacks.
**Related:** `enhance-web-ux`, `audit-uiux-design-system`, `design-frontend`

#### `enhance-web-ux`
**Triggers:** "enhance this page", "make /xxx better", "this page feels AI-generated", "fix UX of /xxx", "improve information density", "icons all look the same", "buttons wrap to 2 lines", "empty columns"
**What it does:** Replaces generic / "stacked" UI with semantic data wired to real backend state. Maps every pain point to an NN/g heuristic, fixes at the helper / token level. Verified live at multiple viewports via browser MCP.
**Related:** `enhance-web-ui`, `audit-ux`, `audit-uiux-design-system`

#### `enhance-web-landing`
**Triggers:** "build a landing page", "portfolio", "marketing site", "anti-slop", "Awwwards-style", "premium frontend", "make it not look AI-generated", "taste"
**What it does:** Anti-slop frontend skill for landing pages, portfolios, and marketing sites. Tunes variance / motion / density dials. Hard em-dash ban, canonical motion skeletons, strict pre-flight check.
**Related:** `enhance-web-redesign`, `design-frontend`, `enhance-web-ui`

#### `enhance-web-redesign`
**Triggers:** "redesign this site", "upgrade UI to premium", "remove AI slop patterns", "redesign audit", "make this existing site feel premium"
**What it does:** Audit-first upgrade of an existing web project. Starts with a 60-second AI-tell triage, then scans codebase and applies targeted fixes — no rewrites.
**Related:** `enhance-web-landing`, `enhance-web-ui`, `audit-uiux-design-system`

#### `enhance-web-web3d`
**Triggers:** "add 3D", "add a WebGL hero", "make it cinematic", "scroll-driven 3D", "three.js scene", "React Three Fiber", "GSAP scroll animation", "product configurator", "3D model viewer", "pinned scroll storytelling", "wow factor"
**What it does:** Audit-first elevation of an existing web app with 3D + cinematic motion (Three.js / R3F + GSAP ScrollTrigger + Motion). Ships with performance budget, mobile + no-WebGL fallbacks, reduced-motion support, SSR safety.
**Related:** `enhance-web-redesign`, `enhance-web-landing`, `design-motion`, `audit-performance`

#### `enhance-capacitor-ui`
**Triggers:** "improved one surface and broke the other", "looks great on web but cramped on mobile", "ad-hoc useIsMobile branches", "Capacitor / Tauri / Expo Web cross-surface issues", "hover-only affordances on touch"
**What it does:** Cross-surface UIUX separation for hybrid PWA + iOS + Android. Establishes three orthogonal axes — form factor, platform, pointer capability — and a three-layer architecture (context hook, mode tokens, container-query primitives).
**Related:** `enhance-web-ui`, `enhance-web-ux`, `design-mobile-first`

#### `enhance-readme`
**Triggers:** "enhance README", "make README prettier", "add screenshots to README", "add hero image", "make README more fun", "add animated demo to README", "record a tour GIF"
**What it does:** Theme-aware hero + tour grid + optional autoplay GIF via Playwright MCP. Captures live screenshots at 1600×1000 in dark and light mode with `<picture>` auto theme-swap.
**Related:** `docs-writer`, `test-playwright`

#### `enhance-web-seo`
**Triggers:** "improve SEO", "add meta tags", "fix search ranking", "add structured data", "sitemap", "canonical URLs", "Open Graph", "Google indexing", "rich results", "SEO audit", "why is my site not ranking"
**What it does:** Full SEO audit and fix for any web app. Checks meta tags, OG/Twitter Card, JSON-LD structured data, robots.txt, sitemap, canonical URLs, heading hierarchy, image alt text, and Core Web Vitals (LCP, CLS) via Playwright. Researches current Google guidelines, applies fixes, verifies with Playwright.
**Related:** `audit-performance`, `audit-bundle-size`, `enhance-web-ui`

#### `enhance-pwa`
**Triggers:** "make it a PWA", "offline support", "install prompt", "push notifications", "service worker", "add to home screen", "background sync", "Lighthouse PWA score", "app-like experience", "installable", "works offline"
**What it does:** Adds or upgrades PWA features: Web App Manifest, Workbox service worker with per-asset caching strategies (CacheFirst / NetworkFirst / StaleWhileRevalidate), install prompt, push notifications, offline page. Capacitor-compatible. Lighthouse PWA audit before and after.
**Related:** `enhance-capacitor-ui`, `mobile-capacitor-platform`, `audit-performance`

---

### Design

#### `design-frontend`
**Triggers:** "make it look good", "beautify", "style this", "redesign", "modern UI", "professional look", "improve the design"
**What it does:** Production-grade frontend interfaces avoiding generic AI aesthetics. Enforces bold design thinking with intentional typography, color, motion, and spatial composition.
**Related:** `design-system`, `design-motion`, `design-theme`

#### `design-system`
**Triggers:** "design system", "component library", "tokens", "variants", "consistent styling", "reusable components"
**What it does:** Build scalable design systems with CSS custom properties, CVA variants, compound components, and Radix primitives.
**Related:** `design-frontend`, `audit-uiux-design-system`

#### `design-api`
**Triggers:** "API", "endpoint", "REST", "GraphQL", "route handler", "request/response", "HTTP methods"
**What it does:** RESTful resource design, request/response schemas, HTTP status codes, pagination (offset/cursor), filtering/sorting, versioning, authentication patterns, Server Actions vs Route Handlers decision matrix.
**Related:** `backend-patterns`, `backend-error-handling`

#### `design-prd`
**Triggers:** "PRD", "product requirements", "write a spec", "new feature spec", "feature requirements", "scope a feature"
**What it does:** Generate PRDs via structured conversation. Auto-detects tech stack, features, data model. Uses Firecrawl for competitive research, Context7 for feasibility, Supabase MCP for data model verification.
**Related:** `docs-coauthor`, `workflow-spec-tdd`

#### `plan-uiux-unification`
**Triggers:** "UI/UX unification plan", "design system audit plan", "UI burndown", "unify the design system", "plan UI overhaul", "design system consolidation", "IA audit before redesign", "audit UI without fixing", "UI/UX unification"
**What it does:** Exhaustive, non-destructive UI/UX + design-system audit that produces a burndown and unification plan — **no code changes in this pass**. IA-first (hierarchy before layout), preservation contract, full surface inventory, violation log, prioritized burndown with risk column, phased roadmap, guardrails. Enhances existing DS; does not replace it. Optional browser MCP for evidence; Firecrawl for current-year best practices.
**Related:** `audit-uiux-design-system`, `audit-ux`, `enhance-web-ux`, `enhance-web-ui`, `design-system`

#### `plan-stub-checker`
**Triggers:** "find dead buttons", "stub checker", "fake components", "unwired handlers", "dead links", "orphaned components", "plan stub wiring", "what's not connected", "mock data in prod", "buttons that do nothing", "stub audit"
**What it does:** Exhaustive audit for stubs, dead buttons, fake/placeholder components, unwired handlers, dead links, orphans, and severed integrations. Traces intended backend, Supabase, Sentry, and pipeline targets; conservative false-positive filtering. Burndown + phased wiring plan — **no implementation until user approves**. Optional Playwright, Sentry, and Supabase MCP.
**Related:** `debug-fe-be-integration`, `audit-fe-api`, `test-qa`, `debug-sentry-monitor`, `workflow-fix-and-ship`

#### `plan-perf-audit`
**Triggers:** "performance audit plan", "perf burndown", "measure before optimize", "bundle size audit plan", "LCP slow plan", "N+1 audit plan", "plan performance improvements", "Core Web Vitals audit"
**What it does:** Measure-don't-guess performance audit across web, mobile, backend, and data. Burndown + optimization plan — **no fixes in this pass**. No fabricated metrics; baselines or `[NEEDS PROFILING]`. Research-backed proposals: React code-split/memo/virtualization, RN Hermes/JSI/cold start, EXPLAIN-verified indexes, Lighthouse CI budgets + RUM. Mobile thresholds stricter than web CWV.
**Related:** `audit-performance`, `audit-bundle-size`, `backend-db-performance`, `mobile-rn-performance`

#### `plan-security-audit`
**Triggers:** "security audit plan", "OWASP audit plan", "RLS audit", "Supabase security review", "hardening plan", "secrets scan plan", "plan security fixes", "security burndown"
**What it does:** OWASP Top 10 audit with Supabase-first methodology (RLS pass, service_role bundle scan, auth-path trace, CVE deps). Plan only — no patches, no destructive testing. Never pastes secret values. Top classes: tables without RLS, service_role in client, permissive policies.
**Related:** `audit-security`, `audit-db-schema`, `test-red-team`, `plan-stub-checker`

#### `plan-docs-sync`
**Triggers:** "docs drift", "sync docs with code", "audit documentation", "stale README", "onboarding docs broken", "doc sync plan", "phantom docs", "docs out of date"
**What it does:** Audit docs vs actual code behavior. Drift taxonomy (stale/missing/phantom/contradictory/onboarding-breaking/inline-rot/API-contract). Code-as-source-of-truth; onboarding-drift check vs `.env.example` + CLI `--help`. Docs-as-code guardrails. **Plan only — no rewrites until approved.** Never aspirational or invented behavior.
**Related:** `docs-writer`, `workflow-housekeep`, `plan-stub-checker`

#### `plan-test-coverage`
**Triggers:** "test coverage plan", "coverage audit", "traceability matrix", "fake-green tests", "uncovered user stories", "plan tests for critical flows", "mutation testing plan", "what's not tested"
**What it does:** User-story-driven coverage audit from real code — traceability matrix, multi-lens coverage (branch/path/risk/integration), fake-green detection, mutation-testing recommendations. **Plan only — no test writing until approved.** Natural lock-in after stub-wiring.
**Related:** `test-unit`, `workflow-spec-tdd`, `test-playwright`, `plan-stub-checker`

#### `design-motion`
**Triggers:** "animation", "transition", "micro-interaction", "motion", "animate", "hover effect", "scroll animation", "page transition", "make it interactive", "fun interactions", "playful UI", "gamification", "delightful", "Easter eggs"
**What it does:** Framer Motion, CSS animations, GSAP. Covers entrance/exit, staggered lists, scroll-triggered effects, layout animations. Includes delight patterns (bouncy buttons, magnetic elements, confetti, Konami code). Always respects `prefers-reduced-motion`.
**Related:** `design-frontend`, `enhance-web-web3d`

#### `design-mobile-first`
**Triggers:** "mobile", "responsive", "touch", "PWA", "mobile-first", "small screen", "tablet", "swipe", "gesture"
**What it does:** Touch-optimized navigation, bottom sheets, swipe-to-delete, pull-to-refresh, responsive tables/grids, 44px touch targets, safe area handling, PWA install prompts.
**Related:** `design-frontend`, `audit-performance`

#### `design-theme`
**Triggers:** "apply theme", "color palette", "brand colors", "styling slides", "presentation design", "visual identity"
**What it does:** Pre-set visual themes with curated colors and fonts. Apply cohesive styling across artifacts.
**Related:** `design-system`, `design-frontend`

#### `design-email`
**Triggers:** "build an email template", "transactional email", "welcome email", "password reset email", "email design", "React Email", "MJML", "dark mode email", "deliverability", "SPF DKIM", "email copy review", "why is my email in spam"
**What it does:** Full-stack transactional and marketing email. Detects React Email / MJML / plain HTML and Resend / SendGrid / Postmark / SES. Builds mobile-first templates (600px, inline styles, dark mode), reviews copy for natural conversational tone (no jargon, one action per email), checks SPF/DKIM/DMARC deliverability, and wires Supabase Edge Function triggers.
**Related:** `design-frontend`, `backend-patterns`, `workflow-feature-flag`

#### `design-generative-art` *(Apache-2.0, adapted from Anthropic)*
**Triggers:** "generative art", "procedural art", "flow fields", "particle systems", "creative coding", "noise patterns", "mathematical visualizations", "art from code", "generate visuals", "interactive animation"
**What it does:** Seeded randomness, flow fields, recursive subdivision, circle packing, L-systems, animation loops. React component pattern with controllable parameters and PNG/SVG export.
**Related:** `enhance-web-web3d`, `design-motion`

#### `design-canvas` *(Apache-2.0, adapted from Anthropic)*
**Triggers:** "poster", "visual design", "infographic", "certificate", "badge", "banner", "social media graphic", "print design", "create artwork", "design graphic"
**What it does:** Museum-quality visual design through named design philosophies ("Brutalist Joy", "Chromatic Silence"). Creates .md philosophy files and .pdf/.png visual artifacts.
**Related:** `design-frontend`, `design-theme`

---

### Backend

#### `backend-patterns`
**Triggers:** "API design", "database schema", "authentication", "caching", "queues", "background jobs", "microservices", "serverless", "backend architecture"
**What it does:** Server Actions (Next.js), tRPC routers, Supabase Edge Functions, database patterns (optimistic locking, soft deletes, audit logging), caching (Next.js cache, Redis), background jobs (Inngest, Trigger.dev), rate limiting.
**Related:** `design-api`, `backend-db-performance`, `backend-error-handling`

#### `backend-db-performance`
**Triggers:** "slow query", "database performance", "timeout", "index", "query optimization", "Prisma", "Supabase", "PostgreSQL"
**What it does:** N+1 query detection and fixes, index strategy (single, composite, partial, GIN), EXPLAIN ANALYZE interpretation, Prisma/Supabase query patterns, pagination (offset vs cursor), batch operations, RLS performance.
**Related:** `backend-patterns`, `audit-db-schema`, `audit-performance`

#### `backend-realtime`
**Triggers:** "real-time", "live updates", "WebSocket", "notifications", "chat", "collaborative", "presence", "live data", "instant sync"
**What it does:** Supabase Realtime subscriptions, Server-Sent Events, WebSocket patterns, presence tracking, live data synchronization.
**Related:** `backend-patterns`, `data-visualization`

#### `backend-error-handling`
**Triggers:** "error boundary", "try/catch", "error state", "toast notification", "form validation error", "API error handling"
**What it does:** Standard error types, Server Action error patterns, form error display (React 19 `useActionState`), error boundaries, API route error handling, TanStack Query error handling, monitoring/logging.
**Related:** `design-api`, `backend-patterns`

#### `backend-observability`
**Triggers:** "add logging", "instrument this", "why can't I debug prod", "no observability", "correlate the error to the trace", "redact PII from logs", "set up alerts/SLOs", wiring Sentry / Langfuse / structured logs
**What it does:** Build-time observability — shared request/trace ID across every log line, Sentry scope, and Langfuse trace. Structured logging, PII redaction, OTel-conventional span design, LLM trace capture, symptom-based alerts/SLOs. Vendor-neutral.
**Related:** `debug-sentry-monitor`, `audit-langfuse-llm`, `debug-error`

#### `data-pipeline`
**Triggers:** "build an ingestion pipeline", "sync X into Y", "nightly aggregation", "process this queue", "backfill", "this cron double-counts", "dedupe", "the numbers are wrong after a retry"
**What it does:** Build-time correctness for ETL / ingestion / edge-function workers / cron / queue consumers. Bakes in idempotency, atomicity, data contracts, delivery semantics, observability, and a 4-layer staging architecture.
**Related:** `audit-db-schema`, `backend-observability`, `workflow-spec-tdd`

#### `data-visualization`
**Triggers:** "chart", "graph", "visualization", "dashboard", "analytics", "D3", "Recharts", "data display", "metrics", "statistics"
**What it does:** Recharts (line, bar, area, pie/donut), sparklines, stat cards with trends, real-time chart updates, D3.js custom visualizations. Includes accessibility patterns for charts.
**Related:** `design-frontend`, `design-system`

---

### Audit

#### `audit-code-quality`
**Triggers:** "code smell", "anti-pattern", "technical debt", "inconsistent", "standardize", "conventions", "cleanup codebase", "why different patterns", "cleanup", "why is this slow/broken"
**What it does:** Two-in-one: (1) detect and fix React/TypeScript/state anti-patterns that cause bugs and performance issues; (2) audit codebase for naming, organisation, and pattern consistency. Produces a structured coherency report.
**Related:** `workflow-refactor`, `audit-code-review`

#### `audit-code-review`
**Triggers:** "code review", "review this PR", "review this code", "review changes"
**What it does:** Thorough code review — correctness, security, performance, a11y, maintainability. Uses Sentry MCP for production error context, Firecrawl for current best practices.
**Related:** `audit-code-quality`, `workflow-pr`

#### `audit-performance`
**Triggers:** "slow", "performance", "LCP", "INP", "CLS", "bundle size", "loading time", "optimize", "Web Vitals", "lighthouse score"
**What it does:** Core Web Vitals assessment (LCP, INP, CLS), bundle analysis, network optimization, JavaScript/CSS performance, React 19+ optimizations, image optimization.
**Related:** `backend-db-performance`, `design-mobile-first`

#### `audit-security`
**Triggers:** "security", "vulnerability", "XSS", "CSRF", "SQL injection", "auth", "RLS", "secrets", "security headers"
**What it does:** OWASP Top 10 review, authentication flow audit, RLS policy verification, secrets management, CSP headers, input validation, rate limiting assessment.
**Related:** `backend-patterns`, `design-api`

#### `audit-accessibility`
**Triggers:** "accessible", "WCAG", "ADA", "a11y", "screen reader", "disability"
**What it does:** WCAG 2.1 AA compliance audit — WCAG 2.2 automated via axe. Form labels, color contrast, keyboard navigation, focus management, alt text, dynamic content announcements, skip links, accessible modals/tables/forms.
**Related:** `design-frontend`, `audit-uiux-design-system`

#### `audit-db-schema`
**Triggers:** "schema review", "database audit", "naming conventions", "RLS audit", "migration check", "index audit", "constraint check"
**What it does:** Audit database schema for consistency, robustness, and industry standards. Auto-detects database type, ORM, migration tool. Uses Supabase MCP for live inspection, Firecrawl for best practices, Context7 for ORM docs.
**Related:** `backend-db-performance`, `audit-security`

#### `audit-fe-api`
**Triggers:** "API audit", "frontend API", "API mismatch", "request optimization", "API contract", "network requests"
**What it does:** Audit frontend API calls against backend implementation. Validates endpoints exist, parameters match, types align, caching configured, error handling present. Uses Sentry MCP for production API errors.
**Related:** `debug-fe-be-integration`, `design-api`

#### `audit-langfuse-llm`
**Triggers:** "audit LLM", "check Langfuse", "audit prompts", "check AI quality", "LLM PDCA", "audit AI costs", "check traces", "audit eval scores", "check hallucination"
**What it does:** PDCA quality audit for LLM/AI features via Langfuse CLI, Sentry, Supabase, Playwright, and Firecrawl. Audits traces, prompts, costs, evals. Performs live verification and grounding/hallucination checks.
**Related:** `deploy-verify`, `debug-sentry-monitor`, `backend-observability`

#### `audit-uiux-design-system`
**Triggers:** "design system audit", "UI consistency", "token compliance", "design drift", "component audit", "visual coherency"
**What it does:** Audit UI/UX coherency against design system. Auto-detects CSS framework, component library, icon library. Checks token compliance, component modularity, live visual verification via browser MCP, Nielsen's 10 heuristics.
**Related:** `design-system`, `audit-accessibility`, `audit-ux`

#### `audit-ux`
**Triggers:** "UX audit", "usability review", "heuristic evaluation", "content audit", "interaction design review", "user flow analysis", "UX quality", "check cognitive load", "audit microcopy"
**What it does:** Research-driven UX audit — Nielsen Norman Group's 10 heuristics, Laws of UX, Intuit Content Design, Google HEART metrics. Browser MCP for live walkthrough, Firecrawl for research, Sequential Thinking for complex flow analysis.
**Related:** `audit-uiux-design-system`, `audit-accessibility`, `enhance-web-ux`

#### `audit-bundle-size`
**Triggers:** "reduce bundle size", "analyse bundle", "tree shaking", "lazy loading", "code splitting", "slow initial load", "large JS", "chunk size", "why is the bundle so big", "first load JS too large", "LCP caused by JS"
**What it does:** Finds and eliminates JS bundle bloat. Detects bundler (Vite/Webpack/Next.js/Rollup). Runs production build with analysis (rollup-plugin-visualizer, @next/bundle-analyzer), identifies largest chunks, duplicate deps, non-tree-shakeable imports, missing code-splitting. Maps every finding to a specific file and import with before/after size estimates.
**Related:** `audit-performance`, `enhance-web-seo`, `workflow-refactor`

#### `audit-i18n`
**Triggers:** "audit i18n", "fix translations", "add locale", "natural language", "translation quality", "hardcoded strings", "localisation", "the Japanese feels like Google Translate", "translations sound robotic", "add language support"
**What it does:** i18n audit with emphasis on **natural, human-sounding copy** — not machine-translated jargon. Finds hardcoded strings, checks translation completeness across all locales, rewrites stiff/literal copy to sound like a real person, fixes date/number/currency locale formatting, walks the live app in each locale via Playwright. Works with react-i18next, next-intl, vue-i18n, lingui, and any other library.
**Related:** `audit-ux`, `audit-code-quality`, `enhance-web-ux`

---

### Debug

#### `debug-error`
**Triggers:** "debug", "error", "bug", "broken", "not working", "exception", "crash", "investigate"
**What it does:** Systematic debugging: reproduce → isolate → research → identify root cause → fix → verify → prevent. Integrates Sentry MCP for production context, Firecrawl for fix patterns, Context7 for library docs.
**Related:** `debug-fe-be-integration`, `debug-sentry-monitor`

#### `debug-fe-be-integration`
**Triggers:** "API error", "4xx error", "5xx error", "validation error", "integration issue", "backend error", "FE-BE mismatch"
**What it does:** Debug frontend-backend integration by analyzing backend logs, production errors (Sentry), and source code. Auto-detects FE/BE frameworks, API style, validation library. Generates both FE and BE fixes.
**Related:** `audit-fe-api`, `debug-error`

#### `debug-sentry-monitor`
**Triggers:** "check Sentry", "fix Sentry errors", "triage errors", "production errors", "monitoring", "error tracking", "run sentry check"
**What it does:** Monitor, triage, fix, and enhance Sentry error monitoring. Auto-detects org, project, framework, config. Seer AI root cause analysis, code fixes, noise filters, monitoring architecture audit.
**Related:** `debug-error`, `deploy-verify`, `backend-observability`

---

### Test

#### `test-unit`
**Triggers:** "write tests", "test coverage", "unit test", "test this", "add tests", "testing", "Jest", "Vitest", "pytest"
**What it does:** Write effective unit tests. Auto-detects framework (Vitest/Jest/pytest/Go/etc.), researches patterns via Firecrawl, fetches docs via Context7. Uses Sentry MCP to identify production errors lacking test coverage.
**Related:** `workflow-spec-tdd`, `test-qa`

#### `test-qa`
**Triggers:** "QA the app", "test the app", "find bugs", "test before release", "run QA", "test CRUD", "test data pipeline", "check for dead buttons", "pre-release testing", "smoke test"
**What it does:** Comprehensive QA via browser MCP. Auto-discovers pages, features, data entities, auth patterns. Performs real CRUD with data pipeline verification (FE → API → DB → FE), audits UX quality, tests edge cases.
**Related:** `test-unit`, `test-playwright`, `protocol-browser-anti-stall`

#### `test-playwright`
**Triggers:** "test this with playwright", "test my changes", "test on localhost like a user", "PDCA this", "did you actually test it", "red-team this feature", "verify the work end-to-end"
**What it does:** Closes the PDCA loop after an implementation. Scopes to the current session's diff, drives the live localhost app through the Playwright MCP manually like a real user, and **fixes** pain points — full-stack (UI/UX + API + DB).
**Related:** `test-qa`, `protocol-browser-anti-stall`, `debug-fe-be-integration`

#### `test-red-team`
**Triggers:** "red team this app", "attack my app", "break it", "find all the defects", "adversarial test", "pre-launch hardening", "pentest the app", "full app QA", "security + perf + UX sweep", "try to break it"
**What it does:** Adversarial full-app sweep driven by a **feature-first coverage matrix**: each feature decomposed to surfaces, sub-pages, components, and states, attacked across 4 dimensions — UI/UX, data pipeline, security (OWASP Top 10 + MASVS), and performance. Drives Playwright browser MCP (web), Playwright Android WebView attach (Capacitor), or adb tap-walk (native chrome). Cross-references Sentry + Supabase + Firecrawl. Produces a severity-ranked defect list with repro evidence and a launch-readiness verdict.
**Related:** `test-playwright`, `test-qa`, `audit-security`, `iterate-post-launch`

#### `protocol-browser-anti-stall`
**Triggers:** (protocol — used by other skills before browser automation sessions)
**What it does:** Prevent browser automation freezing. Navigation guards with snapshot verification, max 3-second waits, incremental wait pattern, max 4 attempts per goal, SPA-specific rules, fresh refs after state changes.
**Related:** `test-qa`, `test-playwright`, `deploy-verify`

---

### Mobile

#### `mobile-rn-screen`
**Triggers:** "this screen looks off", "feels clunky on iOS", "Android version looks wrong", "jank when scrolling", "button is unreachable", "polish this React Native screen", "safe area", "keyboard covers input", "FlatList re-renders"
**What it does:** Polishes an existing React Native screen to feel intentional and native. Catches safe-area violations, sub-minimum touch targets, keyboard occlusion, JS-thread animation jank, gesture conflicts, FlatList re-render storms.
**Related:** `enhance-capacitor-ui`, `mobile-emulator-start`, `mobile-emulator-test`

#### `mobile-rn-performance`
**Triggers:** "janky scroll", "slow startup", "huge bundle", "memory leak", "frame drops", "FlashList", "upgrade React Native", "bump Expo SDK"
**What it does:** React Native / Expo performance, build, and upgrade depth — FPS & re-renders, Hermes, TTI/startup, bundle & app size, FlashList, memory, Reanimated UI-thread animation, Turbo Modules, Android 16KB page alignment.
**Related:** `mobile-rn-screen`, `mobile-emulator-start`, `mobile-emulator-test`

#### `mobile-capacitor-platform`
**Triggers:** "add push notifications", "deep linking", "ship an OTA update", "set up native build CI", "submit to the App Store", "fix an App Store rejection", "make the app work offline", "migrate my web app to Capacitor"
**What it does:** Capacitor platform + pipeline depth — plugin selection, OTA/live updates, deep/universal links, push (FCM/APNs), offline-first, safe-area, native build CI/CD, App Store/Play Store submission, Capsec security scan.
**Related:** `enhance-capacitor-ui`, `workflow-spec-tdd`

#### `mobile-emulator-start`
**Triggers:** "start emulator", "start Metro", "restart dev loop", "fix Cannot connect to Expo", "spin up new terminal instance", "stuck bundler", "1080×4000 emulator"
**What it does:** Boots Metro + Android emulator in the right order — kills duplicate ports, picks fresh-cache vs fast-iteration, defaults to 1080×4000 for tall QA screenshots, polls `/status` before deeplink to avoid connection races.
**Related:** `mobile-emulator-test`, `mobile-rn-screen`

#### `mobile-emulator-test`
**Triggers:** "test on emulator", "QA Android build", "verify native build", "white screen", "cache rehydration", "RN sync empty state", "Expo dev-client QA"
**What it does:** Native build QA on Android emulator — three-layer CRUD verification (UI / API / DB), build-freshness + dual-auth phases, fixes for white-screen / cache-rehydration / sync-empty-state. Pairs Metro/adb walk with Supabase + Sentry MCPs.
**Related:** `mobile-emulator-start`, `test-qa`, `debug-fe-be-integration`

---

### Deploy

#### `deploy-verify`
**Triggers:** "verify deploy", "post-deploy check", "smoke test production", "ship or rollback", "deploy health check", "post-release check"
**What it does:** Post-deploy smoke test combining Sentry + Supabase + Langfuse + Playwright + Firecrawl. Checks for new errors, verifies migration health, confirms trace pipeline, runs browser smoke test. Binary SHIP/ROLLBACK/MONITOR verdict.
**Related:** `debug-sentry-monitor`, `audit-langfuse-llm`

#### `iterate-post-launch`
**Triggers:** "improve the app after launch", "fix the top issues", "post-launch polish", "what should I fix next", "production issues", "iterate on feedback", "post-release improvements", "what is broken in prod", "ship a polish pass", "make it better based on real usage"
**What it does:** Closes the post-ship improvement loop. Pulls Sentry top errors (with Seer AI root-cause), Supabase slow-query and API logs, advisor warnings, and a live Playwright walkthrough into a ranked improvement backlog (impact × effort). Implements the approved fixes full-stack and verifies each one live. Resolves confirmed Sentry issues.
**Related:** `test-red-team`, `deploy-verify`, `debug-sentry-monitor`, `test-playwright`

#### `deploy-npm`
**Triggers:** "release", "publish to npm", "ship a new version", "cut a release", "deploy to production", "update the changelog and publish"
**What it does:** End-to-end release workflow for a Changesets + GitHub Actions + npm Trusted Publisher (OIDC) monorepo with per-package GitHub Releases.
**Related:** `deploy-verify`, `workflow-pr`

---

### Workflow

#### `workflow-spec-tdd`
**Triggers:** "build X", "implement", "add a feature", "do it properly", "this keeps breaking", "make it right", any non-trivial feature/refactor/bug
**What it does:** Anti-vibe-coding spine: brainstorm → spec (the contract) → plan (file-mapped) → TDD (RED failing test → GREEN minimal code → REFACTOR) → self-review gate before declaring done. Stack-agnostic.
**Related:** `workflow-coding-discipline`, `test-unit`, `test-playwright`

#### `workflow-refactor`
**Triggers:** "refactor", "split file", "extract", "cleanup", "reorganize", "too big", "technical debt"
**What it does:** Safe, incremental code transformations. Extract to utils/hooks/components/types/services. Barrel files, separation of concerns, performance patterns (memoization, code splitting), clean code patterns.
**Related:** `audit-code-quality`, `workflow-spec-tdd`

#### `workflow-git-commit`
**Triggers:** "git", "commit message", "branch", "PR", "pull request", "merge", "rebase", "release", "changelog"
**What it does:** GitHub Flow/GitFlow branching, conventional commits, PR templates, code review checklists, merge strategies, semantic versioning, release workflow, conflict resolution, git hooks.
**Related:** `workflow-pr`

#### `workflow-pr`
**Triggers:** "create PR", "pull request", "merge PR", "PR review", "PR checks", "merge criteria"
**What it does:** PR lifecycle from creation to merge. Runs validations, security scans, creates PR with template. Monitors checks (polls status), addresses bot feedback, ensures all threads resolved.
**Related:** `workflow-git-commit`, `audit-code-review`

#### `workflow-housekeep`
**Triggers:** "housekeep", "clean up repo", "update README", "update dependencies", "fix vulnerabilities", "remove dead code", "tidy up", "repo maintenance", "spring clean", "declutter"
**What it does:** Full-cycle repository maintenance: README sync, dead file cleanup (logs, screenshots, deprecated code), dependency updates (audit, classify, update with research), config/script/env audit.
**Related:** `workflow-refactor`, `docs-writer`, `audit-code-review`

#### `workflow-parallel-agents`
**Triggers:** "run agents in parallel", "parallel worktrees", "multi-model", "best-of-N", "compare approaches"
**What it does:** Run agents in parallel via git worktrees, cloud agents, or multi-model comparison. Covers isolation, merge strategies, result evaluation.
**Related:** `workflow-spec-tdd`

#### `workflow-coding-discipline`
**Triggers:** "coding guidelines", "LLM discipline", "avoid vibe-coding", "think before coding", "simplicity first", "Karpathy guidelines"
**What it does:** Behavioral guardrails for writing, editing, refactoring, debugging, or reviewing code. Reduces LLM mistakes — overcomplication, drive-by edits, hidden assumptions, weak success criteria. Adapted from Karpathy's observations.
**Related:** `workflow-spec-tdd`, `audit-code-quality`

#### `workflow-feature-flag`
**Triggers:** "add a feature flag", "gradual rollout", "staged release", "kill switch", "dark launch", "flag cleanup", "canary release", "rollback plan", "safe feature release", "deploy without switching on", "LaunchDarkly", "PostHog flags", "GrowthBook"
**What it does:** Disciplined feature-flag rollout. Detects existing flag infrastructure (LaunchDarkly, Flagsmith, GrowthBook, Unleash, PostHog, or env-var gates). Designs flag contract (name, targeting, kill-switch path), implements the gate, stages rollout (0% → internal → 5% → 100%), monitors Sentry error rate + Supabase logs at each stage, promotes or rolls back, then schedules cleanup from code.
**Related:** `workflow-spec-tdd`, `deploy-verify`, `iterate-post-launch`

#### `workflow-onboard`
**Triggers:** "I'm new to this repo", "orient me", "explain this codebase", "what does this do?", "onboard me", "first day on this project", "catch me up on the codebase", "help me understand this project"
**What it does:** First-contact orientation for any codebase. Reads package manifests, entry points, routing, data layer, auth, env vars, and recent git history. Produces a concise briefing: what the app does, how it's structured, how to run it, and the top 3 areas to understand first.
**Related:** `workflow-build-feature`, `docs-writer`

---

### Bundled Workflows

Orchestrator skills that sequence multiple individual skills into a tracked, phase-gated loop. **Use these first** — they eliminate the need to manually chain skills.

#### `workflow-build-feature`
**Triggers:** "build a feature", "implement this", "add X", "ship a new capability", "build this end to end", "implement from scratch"
**What it does:** End-to-end feature build: spec (`workflow-spec-tdd`) → implement → unit tests (`test-unit`) → smoke test (`test-playwright`) → PR (`workflow-pr`). Enforces spec-before-code discipline and full-stack verification. Done criteria: spec written, RED test was failing, GREEN after implementation, smoke test passed, PR open with evidence.
**Chain:** `workflow-spec-tdd` → `test-unit` → `test-playwright` → `workflow-pr`
**Related:** `workflow-spec-tdd`, `test-unit`, `test-playwright`, `workflow-pr`

#### `workflow-fix-and-ship`
**Triggers:** "fix this bug and ship it", "patch this and close the ticket", "fix this Sentry issue", "bug report from user", "fix and deploy", "triage and fix"
**What it does:** Complete bug-fix lifecycle: triage Sentry/logs → reproduce locally → root cause (`debug-error`) → surgical fix + regression test → smoke test (`test-playwright`) → PR (`workflow-pr`) → optional post-deploy smoke (`deploy-verify`) → resolve Sentry issue. Leaves evidence at every step.
**Chain:** `debug-error` → `test-playwright` → `workflow-pr` → `deploy-verify`
**Related:** `debug-error`, `debug-sentry-monitor`, `test-playwright`, `workflow-pr`, `deploy-verify`

#### `workflow-quality-gate`
**Triggers:** "is this ready to ship?", "quality gate", "pre-release checklist", "what do I need to fix before launch?", "ship-readiness check", "run the quality gate"
**What it does:** Pre-release go/no-go. Sequences: adversarial red team (`test-red-team`) → static security review (`audit-security`) → bundle size (`audit-bundle-size`) → Core Web Vitals (`audit-performance`) → unit test coverage (`test-unit`). Produces a single GO / NO-GO / GO WITH CONDITIONS verdict with a ranked defect list.
**Chain:** `test-red-team` → `audit-security` → `audit-bundle-size` → `audit-performance` → `test-unit`
**Related:** `test-red-team`, `audit-security`, `audit-bundle-size`, `audit-performance`, `test-unit`

#### `workflow-launch-ready`
**Triggers:** "prepare for launch", "launch week", "everything before going live", "is the app launch-ready?", "pre-launch sweep", "ship it to the world", "launch prep"
**What it does:** Full launch preparation sweep. Sequences: SEO (`enhance-web-seo`) → PWA (`enhance-pwa`) → bundle (`audit-bundle-size`) → i18n (`audit-i18n`) → quality gate (`workflow-quality-gate`) → deploy smoke (`deploy-verify`) → day-1 iteration (`iterate-post-launch`). Produces a launch checklist with go/no-go verdict.
**Chain:** `enhance-web-seo` → `enhance-pwa` → `audit-bundle-size` → `audit-i18n` → `workflow-quality-gate` → `deploy-verify` → `iterate-post-launch`
**Related:** `workflow-quality-gate`, `iterate-post-launch`, `deploy-verify`

---

### Docs

#### `docs-writer`
**Triggers:** "write documentation", "README", "API docs", "document this", "create docs", "architecture docs"
**What it does:** Write clear documentation. Templates for READMEs, API docs, code comments, architecture docs. Includes Mermaid diagram patterns.
**Related:** `docs-coauthor`, `design-prd`

#### `docs-coauthor`
**Triggers:** "write a doc", "draft proposal", "help me document", "create spec", "design document", "PRD", "RFC", "ADR"
**What it does:** Three-stage workflow: Context Gathering (questions, info dump), Refinement & Structure (brainstorm, curate, draft per section), Reader Testing (predict questions, verify answers, fix gaps).
**Related:** `docs-writer`, `design-prd`

---

### Meta

#### `meta-skill-creator` *(Apache-2.0, adapted from Anthropic)*
**Triggers:** "create skill", "SKILL.md format", "skill structure", "skill best practices"
**What it does:** Guide for creating effective AI agent skills with proper frontmatter, descriptions, progressive disclosure structure, and concise body.

#### `meta-mcp-builder`
**Triggers:** "MCP", "Model Context Protocol", "AI tools", "LLM integration", "agent tools", "build MCP server"
**What it does:** Four-phase MCP server development: Research & Planning, Implementation (TypeScript/Python SDK), Review & Test, Create Evaluations.

---

## Commands (13)

Commands fall into two groups: **standalone** (full playbook in the file) and **pointer** (thin slash entry delegating to a skill).

### Standalone

| Command | File | Quick Reference |
|---------|------|-----------------|
| `/plan` | `plan.md` | Plan Mode — research codebase, clarify, produce approved plan before coding |
| `/research` | `research.md` | Three-phase Firecrawl deep research → gap analysis → implementation plan |
| `/fix-issue` | `fix-issue.md` | Fetch GitHub issue → find code → implement fix → open PR |
| `/mcp` | `mcp.md` | MCP-powered dev workflow reference |

### Pointer (delegates to skill)

| Command | Points to | Notes |
|---------|-----------|-------|
| `/commit` | `workflow-git-commit` | Pre-commit pipeline: lint, Sentry, build, scope, conventional commit, push |
| `/debug` | `debug-error` | Hypothesis-driven debugging with runtime evidence |
| `/pr` | `workflow-pr` | Pre-flight → commit → push → open PR |
| `/readme` | `enhance-readme`, `docs-writer` | Visual showcase + content sync |
| `/refactor` | `workflow-refactor` | Analyze → split → extract → verify behavior |
| `/review` | `audit-code-review` | Agent review + manual checklist |
| `/test` | `test-unit`, `test-qa`, `mobile-emulator-test` | Type check → unit → integration → E2E |
| `/uiux` | `audit-uiux-design-system`, `audit-ux`, `enhance-web-ui`, `enhance-web-ux` | Audit + enhance UI/UX |
| `/uiux-plan` | `plan-uiux-unification` | Full UI/UX unification plan (audit only, no fixes) |
| `/stub-plan` | `plan-stub-checker` | Stub/dead-link/fake-component audit + wiring plan (no fixes) |
| `/perf-plan` | `plan-perf-audit` | Performance audit + optimization plan (no fixes) |
| `/security-plan` | `plan-security-audit` | Security/OWASP/RLS audit + hardening plan (no fixes) |
| `/docs-plan` | `plan-docs-sync` | Docs drift audit + sync plan (no rewrites) |
| `/test-plan` | `plan-test-coverage` | User-story test coverage audit + plan (no tests written) |
| `/update-deps` | `workflow-housekeep` (Phase 3) | Audit and update dependencies safely |

---

## Skill Composition Patterns

> **Prefer bundled workflows** (`workflow-build-feature`, `workflow-fix-and-ship`, `workflow-quality-gate`, `workflow-launch-ready`) for multi-phase tasks. Use individual skills when the request is scoped to one phase.

### Bundled workflows (start here)

| Intent | Bundled skill | What it chains |
|--------|--------------|----------------|
| Build a feature end-to-end | `workflow-build-feature` | spec → TDD → unit tests → smoke → PR |
| Fix a bug and ship it | `workflow-fix-and-ship` | debug → fix → smoke → PR → deploy |
| Pre-release quality check | `workflow-quality-gate` | red-team → security → bundle → perf → unit tests |
| Full launch preparation | `workflow-launch-ready` | SEO + PWA + bundle + i18n + quality gate + deploy + iterate |

### Chaining diagram

```
workflow-build-feature
  └─ workflow-spec-tdd → test-unit → test-playwright → workflow-pr

workflow-fix-and-ship
  └─ debug-error → test-playwright → workflow-pr → deploy-verify

workflow-quality-gate
  └─ test-red-team → audit-security → audit-bundle-size → audit-performance → test-unit

workflow-launch-ready
  └─ enhance-web-seo → enhance-pwa → audit-bundle-size → audit-i18n
     → workflow-quality-gate → deploy-verify → iterate-post-launch
```

### Specialist compositions (individual skills)

#### Full Feature Build (manual)
`workflow-spec-tdd` → `backend-patterns` + `design-api` + `backend-error-handling` + `audit-security`

#### Six-Skill Plan Loop (audit → approve → execute)

See **[docs/PLAN-LOOPS.md](PLAN-LOOPS.md)** for diagrams, prompts, and execution mapping.

```
plan-uiux-unification → plan-stub-checker → plan-test-coverage
  → plan-perf-audit ∥ plan-security-audit → plan-docs-sync
```

After approval: `enhance-web-ux`, `debug-fe-be-integration`, `test-unit`, `audit-performance`, `audit-security`, `docs-writer`, `test-playwright`

#### Stub & Wiring Audit
`plan-stub-checker` → user approval → `debug-fe-be-integration` → `workflow-fix-and-ship` → `test-playwright`

#### Performance Fix
`audit-performance` → `backend-db-performance` + `audit-code-quality` + `workflow-refactor`

#### Design System Sprint
`plan-uiux-unification` → user approval → `enhance-web-ux` + `enhance-web-ui` → `audit-accessibility` + `design-mobile-first` + `design-theme`

#### LLM Quality Cycle
`audit-langfuse-llm` → `debug-sentry-monitor` → `deploy-verify`

#### UX Polish
`audit-ux` → `enhance-web-ux` → `enhance-web-ui` → `/commit`

#### Native RN Ship Loop
`mobile-emulator-start` → `mobile-emulator-test` → `workflow-pr` → `deploy-verify`

#### Cross-Surface UI Architecture
`enhance-capacitor-ui` → `enhance-web-ui` → `enhance-web-ux`

#### Repo Maintenance
`workflow-housekeep` → `docs-writer` + `workflow-refactor` + `audit-code-review`

---

## Cursor-Specific Skills (12)

These extend Cursor itself — stored in `~/.cursor/skills-cursor/`.

| Skill | What it does |
|:------|:-------------|
| `babysit` | Keep a PR merge-ready — triage comments, resolve conflicts, fix CI in a loop |
| `canvas` | Live React canvas beside chat — rich data visualizations, interactive tools |
| `create-hook` | Create Cursor hooks — scripts/prompts for before/after agent events |
| `create-rule` | Create `.cursor/rules/` files for persistent AI guidance |
| `create-skill` | Create new Agent Skills in `~/.cursor/skills/` |
| `create-subagent` | Create custom subagents in `.cursor/agents/` |
| `migrate-to-skills` | Convert rules/commands to Skills format |
| `shell` | Direct shell execution without interpretation |
| `split-to-prs` | Slice one pile of work into small reviewable PRs — safe snapshot, no destructive git ops |
| `statusline` | Configure CLI status line — model, context, git info |
| `update-cli-config` | Modify CLI settings — permissions, sandbox, vim mode |
| `update-cursor-settings` | Modify Cursor/VSCode `settings.json` |
