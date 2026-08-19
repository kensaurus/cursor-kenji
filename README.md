<p align="center">
  <img src="https://img.shields.io/badge/Cursor_AI-Skills_&_Tools-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0ibTEyIDMtMS45IDEyLjRMMTguMSA2LjYgMi4yIDEzLjRsMTEuNSAxLjFMNy45IDIxeiIvPjwvc3ZnPg==&logoColor=white" alt="Cursor AI Skills" />
</p>

<h1 align="center">cursor-kenji</h1>

<p align="center">
  <strong>Ready-made playbooks for your AI coding editor.</strong><br/>
  137 agent skills · 50 slash commands · 16 MCP servers · 12 Cursor skills · 6 subagents<br/><br/>
  <em>You talk in plain English. The matching expert recipe runs itself.</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@kensaurus/cursor-kenji"><img src="https://img.shields.io/npm/v/@kensaurus/cursor-kenji?style=flat-square&color=cb3837&logo=npm" alt="npm version" /></a>
  <img src="https://img.shields.io/github/license/kensaurus/cursor-kenji?style=flat-square&color=444" alt="License" />
</p>

---

## Explain it like I'm five

Your AI editor is smart, but without a recipe it **guesses**. Sometimes that guess is great. Sometimes it invents a half-broken button and calls it done.

**cursor-kenji** is a big box of **recipes** (we call them *skills*). Install once. After that:

1. You type something normal — *"check my security"*, *"make this form nicer"*, *"ship this feature"*.
2. Cursor picks the matching recipe.
3. The AI follows that recipe step by step, instead of freestyling.

You do **not** need to memorize skill names. Talking like a human is enough.

It ships **137 Cursor agent skills**, 50 slash commands, and 6 subagents — tuned for React / Next.js / Supabase, useful on almost any stack. Works in [Cursor](https://cursor.com), [Claude Code](https://www.anthropic.com/claude-code), and (with a lighter install) Codex + Gemini CLI. Brand new? Read the **[plain-language guide →](docs/GETTING-STARTED.md)**.

### Install (30 seconds)

```bash
npx skills add kensaurus/cursor-kenji
```

Restart Cursor. Done.

> No Cursor yet? **[Download it](https://cursor.com)**. No `skills` CLI? `npm install -g skills`, or see [manual install](#manual-install).

### What should I say? (use cases)

| You say… | What kicks in | What you get |
|:---------|:--------------|:-------------|
| *"orient me"* / *"what's in this repo?"* | `workflow-onboard` | A short tour of the codebase |
| *"grill me before I build"* | `grilling` | One question at a time until you're truly aligned |
| *"build this feature"* | `workflow-build-feature` | Spec → tests → code → smoke → PR |
| *"fix this bug and ship it"* | `workflow-fix-and-ship` | Debug → fix → verify → PR → deploy |
| *"audit my security"* | `audit-security` | OWASP-style findings with file:line |
| *"is this production-ready?"* | `audit-resilience` + `audit-realworld` | Timeouts, retries, parity checks |
| *"make this page less AI-looking"* | `enhance-web-ui` / `enhance-web-ux` | Cleaner layout, real content hierarchy |
| *"desktop looks like a phone"* | `audit-responsive` | Unstack the layout at 375 / 768 / 1440 |
| *"what happens when this list is empty?"* | `audit-ui-states` | Empty / loading / error / offline matrix |
| *"why do our emails go to spam?"* | `enhance-email-deliverability` | SPF/DKIM/DMARC + bounce hygiene |
| *"can we recover if the DB dies?"* | `plan-backup-dr` | RPO/RTO + restore-drill plan (approve first) |
| *"why did the wrong skill trigger?"* | `audit-skill-conflicts` | Overlapping descriptions / stale handoffs in the pack |
| *"is my chatbot safe?"* | `audit-llm-security` | Prompt injection, leaks, unscoped tools |
| *"are we tracking the right events?"* | `audit-analytics` | Funnel holes, taxonomy, consent gating |
| *"check our privacy / store labels"* | `plan-privacy-compliance` | Collection vs claimed — approve before edits |
| *"optimize the App Store listing"* | `plan-aso` | Keywords + screenshots, plan only |
| *"make the forms accessible"* | `enhance-web-forms` | Labels, validation, keyboard-friendly |
| *"plan a security hardening pass"* | `plan-security-audit` | A burndown **you** approve before edits |
| *"monkey test the app"* / *"guest vs logged in"* | `test-exploratory` | Wander twice, then a guest/auth diff table |
| *"complete everything"* | `complete-everything` | No parked leftovers — judge verifies "done" |
| *"ship it and watch it"* | `workflow-ship-and-observe` | Deploy → verify live → observe / rollback |

### Highest-impact combo pipelines

You almost never want a single skill. Copy one of these into chat:

| You want… | Paste this | What it chains |
|:----------|:-----------|:---------------|
| **Find real breaks, then lock them** | `monkey-test as guest and logged-in, ticket every real bug, then lock a Playwright pass on the worst ones` | `test-exploratory` → `workflow-feedback-to-closure` → `test-playwright` |
| **Pre-release with a live identity probe** | `wander the app as guest vs logged-in, then run the quality gate` | `test-exploratory` → `workflow-quality-gate` |
| **Build a feature end-to-end** | `build this feature` | `workflow-build-feature` |
| **Fix a bug and ship it** | `fix this bug and ship it` | `workflow-fix-and-ship` |
| **Close a plan with nothing parked** | `complete everything` | `complete-everything` |
| **Ship and watch it** | `ship it and watch it` | `workflow-ship-and-observe` |

Full menu with every skill name → **[Every skill](#every-skill-in-plain-english)** below. Combos with trigger phrases → **[docs/CATALOG.md — Skill Composition](docs/CATALOG.md#skill-composition-patterns)**.

### The five toys in the box

| Thing | Kid explanation | How you use it |
|:------|:----------------|:---------------|
| **Skill** | A recipe for one job | Just describe the job in chat |
| **Command** | A shortcut button | Type `/commit`, `/pr`, `/plan` |
| **Subagent** | A helper who peels off to do one task | Say *"review this PR"* |
| **Rule** | A house rule the AI always obeys | Drop a `.mdc` into your project |
| **MCP server** | A phone line to your database / GitHub / browser | Copy a template + paste your keys |

Everything follows the [Agent Skills spec](https://agentskills.io/specification) and is checked on every commit (`npm test` covers all **149** installable skills). MCP templates pin exact versions against [package-hallucination attacks](https://cloudsecurityalliance.org/blog/product-news/2025/03/06/slopsquatting-ai-code-assistants-and-package-hallucinations).

### How the recipes fit together (the loop)

You almost never run one skill alone. Think of a simple loop — **look → change → prove → ship** — with seatbelts on the whole time:

```text
   Orient          Assess           Change           Prove            Ship
(get to know) → (measure first) → (build/fix) → (test for real) → (go live)
      │                                                                      │
      └──────────────────── findings loop back ←─────────────────────────────┘
                              ▲
                     Guardrails always on
              (rules · hooks · "are we actually done?")
```

| Stage | Kid version | Skill families |
|:------|:------------|:---------------|
| **Orient** | Walk around the house before rearranging furniture | `workflow-onboard`, `/research` |
| **Assess** | Look carefully — maybe take notes, don't smash walls yet | `audit-*`, `plan-*`, `/grill-me` (the AI interviews *you* until aligned) |
| **Change** | Build new things or improve old ones | `design-*`, `enhance-*`, `backend-*`, `housekeep-design` |
| **Prove** | Kick the tires. Don't say "done" unless it really is | `test-*`, `complete-everything`, `completion-judge` |
| **Ship** | Put it in the world and watch it | `workflow-ship-and-observe`, `deploy-*`, `debug-*` |
| **Guardrails** | Seatbelts that stay on between sessions | rules, completion hook, `enhance-agent-guardrails`, `/handoff` (carry state to the next session) |

Rule of thumb: **assess before you change, prove before you ship, never skip a stage.**

Highest-impact prove loop: **wander as guest + logged-in → ticket real bugs → lock them** (`test-exploratory` → `workflow-feedback-to-closure` → `test-playwright`). Copy-paste phrases live in [What should I say?](#what-should-i-say-use-cases).

---

## What's Inside

The whole kit, at a glance:

| | Count | What it does |
|:--|------:|:-------------|
| **Skills** | 137 | Auto-triggering playbooks (audit, enhance, debug, test, build, plan) |
| **Cursor Skills** | 12 | IDE tools (canvas, hooks, rules, PR splitter) |
| **Commands** | 50 | Slash shortcuts (`/commit`, `/pr`, `/burndown-full`, …) |
| **Subagents** | 6 | Background helpers (code-reviewer, debugger, db-migrator…) |
| **Completion hook** | 1 | Opt-in stop gate: continues only unfinished durable closure state |
| **MCP Servers** | 16 | Supabase · GitHub · Sentry · Playwright · AWS · Slack |
| **Project Rules** | 6 | Drop-in `.mdc` for `.cursor/rules/` (plus 3 global, 5 RN bundle optional) |
| **Notepads** | 2 | Context templates (architecture, design tokens) |
| **Shell Aliases** | 8 | `newskill`, `cursor-sync`, `gc`, `gp` |

**Every skill is listed below** — first a family count table, then the full name + one-line summary for each. Trigger phrases → **[docs/CATALOG.md](docs/CATALOG.md)** · quick lookup → **[docs/TRIGGER-CHEATSHEET.md](docs/TRIGGER-CHEATSHEET.md)**.

---

## Every skill, in plain English

Scroll the **family counts**, then the **full list**. You don't memorize names — describe the job in chat and Cursor matches. Want exact trigger phrases? **[docs/CATALOG.md](docs/CATALOG.md)**.

<!-- SKILL-INDEX:START -->

_Auto-generated from each skill's `SKILL.md` — run `npm run gen:skill-index` after adding a skill. **149 skills** listed below._

#### Skill families at a glance

| Family | Count | In one sentence |
|:-------|------:|:----------------|
| 🔍 Audit — inspect; some then fix | **29** | Check the codebase — security, UX, analytics, IAP, the skill pack… |
| 📋 Plan — audit first, change only after you approve | **20** | Write a fix plan you approve before any code changes |
| 🎨 Enhance — improve what already exists | **15** | Polish UI, forms, motion, SEO, PWA, email deliverability |
| ✨ Design — build something new | **10** | Create new UI, APIs, emails, themes from scratch |
| 🧱 Backend — server & data patterns | **5** | Auth, caching, queues, realtime, observability |
| 📱 Mobile — React Native / Capacitor | **5** | RN screens, emulators, Capacitor, App Store prep |
| 📊 Data — charts & pipelines | **2** | Charts, dashboards, ETL / cron jobs |
| 📚 Docs — write it down clearly | **3** | READMEs, PRDs, RFCs with a reader-first voice |
| 🧹 Housekeeping — clean up design drift | **2** | Merge a drifted design system into one source of truth |
| 🔗 Workflows — multi-step recipes | **18** | End-to-end recipes (build, fix, ship, green the repo) |
| ✅ Test & QA — prove it works | **8** | Unit, Playwright, visual regression, load, red-team |
| 🚀 Deploy — ship & verify | **2** | npm release + post-deploy smoke tests |
| 🐛 Debug — find & fix what's broken | **3** | Errors, Sentry, frontend↔backend mismatches |
| 🦟 Mushi Mushi — bug triage helpers | **2** | Integrate the Mushi Mushi bug-report pipeline |
| 🛡️ Protocols — session guardrails | **1** | Keep browser automation from freezing |
| ✍️ Authoring — build skills & MCP | **2** | Author new skills or MCP servers |
| 🤝 Third-party (upstream-maintained) | **3** | Vendored upstream skills (Emil, UI/UX Pro Max, Vercel WIG) |
| 🧩 Core & cross-cutting | **7** | Close everything, burndown, post-launch loops |
| 🖱️ Cursor IDE skills | **12** | Canvas, hooks, rules, PR splitter, CLI helpers |
| **Total** | **149** | |

#### Full list (every skill)

### 🔍 Audit — inspect; some then fix (29)

| Skill | What it does |
|:------|:-------------|
| `audit-accessibility` | Automated WCAG 2.2 accessibility audit using playwright-cli to crawl every page, inject axe-core via eval, test keyboard navigation, check… |
| `audit-analytics` | Read-only audit of product-analytics instrumentation: event taxonomy, funnel completeness, consent-gated firing, dead/duplicate/phantom… |
| `audit-auth-flows` | Read-only audit of app-layer auth — route×gate matrix, session lifecycle, OAuth, and provider traps (getSession vs getUser,… |
| `audit-backend-architecture` | Read-only audit and decision advisor for backend architecture, topology-gated by stack |
| `audit-bundle-size` | Analyse and shrink JavaScript bundle size for any web app |
| `audit-cicd` | Audit CI/CD pipelines (GitHub Actions) for cost, speed, and safety |
| `audit-code-quality` | Detect and fix repo-wide anti-patterns and consistency drift (naming, organisation, repeated smells) |
| `audit-code-review` | Review this PR or diff for quality, security, and maintainability |
| `audit-codemod-safety` | Read-only audit of a codemod or bulk mechanical transform for behavior-preservation — compiles/lints is not same-behavior |
| `audit-db-schema` | Audit database schema for consistency, validation, and industry standards |
| `audit-env-parity` | Read-only audit of config/env parity across dev, staging, and prod — missing or misnamed vars, drifted flags, hardcoded values, secrets… |
| `audit-fe-api` | Audit frontend API calls against backend implementation for contract alignment and network shape |
| `audit-gate-logic` | Read-only audit of CI gate logic — silent bypass, ratchet gaming, conflicting conditions, required checks that are not, and accreted… |
| `audit-i18n` | Audit and fix internationalisation for any web or mobile app |
| `audit-infra-cost` | Read-only audit of hosting, database, storage, egress, and serverless spend (Supabase, Vercel, S3/R2, edge) |
| `audit-langfuse-llm` | Run a PDCA quality audit on LLM/AI features: traces, prompts, costs, evals, grounding, hallucination |
| `audit-llm-security` | Read-only OWASP LLM Top 10 audit of app-facing AI features: prompt injection, data leak, supply chain, poisoning, unsafe output, excessive… |
| `audit-monetization-iap` | Read-only audit of mobile IAP and subscriptions — StoreKit 2, Play Billing, or RevenueCat — for server receipt validation, restore,… |
| `audit-payment-system` | Read-only audit for payment/money-movement systems, scope-gated so a Stripe-Checkout site and an in-house ledger each see only relevant… |
| `audit-performance` | Audit and optimize application runtime performance (Core Web Vitals, slow code, load time) |
| `audit-realworld` | Audit a full-stack app against the RealWorld ("Conduit") reference — its formal API spec, shared Bruno/Hurl E2E suite, and closest-stack… |
| `audit-resilience` | Read-only audit for the non-functional "20%" AI agents systematically skip: timeouts, retries with backoff+jitter, circuit breakers,… |
| `audit-responsive` | Audit-and-fix linearized mobile layouts at every breakpoint — desktop is not a wide phone |
| `audit-security` | Static OWASP review of app code (injection, headers, deps) |
| `audit-skill-conflicts` | Read-only audit of an agent-skill pack for contradictory directives, overlapping triggers, stale cross-refs, and context bloat |
| `audit-ui-states` | Read-only audit of unhappy-path UI states vibe-coding skips — empty, loading, error, offline, zero-results, permission, overflow — then… |
| `audit-uiux-design-system` | Audit visual UI coherency, design token compliance, and component modularity against a design system for any project |
| `audit-ux` | Per-page UX audit using NN/g heuristics, Intuit microcopy, and Google HEART |
| `audit-ux-journeys` | Cross-page UX audit for user stories, task completion, and information architecture — the layer audit-ux (per-page heuristics) skips |

### 📋 Plan — audit first, change only after you approve (20)

| Skill | What it does |
|:------|:-------------|
| `plan-aeo-readiness` | Audit a site for answer-engine / GEO citation readiness (ChatGPT, Perplexity, AI Overviews), then a phased plan |
| `plan-antislop` | Audit a codebase, UI, or copy for machine-generated tells across prose, visual/UI, code, and structure/IA, then produce a phased de-slop… |
| `plan-aso` | Audit App Store and Google Play listings for discoverability and conversion — keywords, localized metadata, screenshots, ratings prompts —… |
| `plan-backup-dr` | Audit whether a project can actually recover from data loss — not just whether backups exist — then emit a phased DR plan |
| `plan-capacitor-hardening` | Audit a Capacitor/Ionic hybrid app for native-layer security gaps, then produce a phased hardening plan |
| `plan-data-integrity` | Audit a project for destructive-operation and migration safety gaps, then produce a phased safeguard plan |
| `plan-dependency-provenance` | Audit dependencies for hallucinated or slopsquatted packages, supply-chain risk, and licensing gaps, then a remediation plan |
| `plan-docs-sync` | Audit documentation against actual code behavior and plan corrections — no rewrites in this pass |
| `plan-error-handling` | Audit a codebase for silent failures, swallowed exceptions, and observability gaps across Sentry and Langfuse, then produce a phased fix… |
| `plan-input-validation` | Audit every trust boundary for unvalidated input, injection, and forged-request gaps, then produce a phased hardening plan |
| `plan-llm-cost-guardrails` | Audit an LLM-powered app for runaway-cost and quota-abuse exposure, then produce a phased guardrail plan |
| `plan-mobile-readiness` | Audit a Capacitor/React Native app for App Store and Google Play submission readiness, then produce a phased pre-submission plan |
| `plan-perf-audit` | Measure-don't-guess performance audit across web, mobile, backend, and data layers — produces burndown and optimization plan with no fixes… |
| `plan-privacy-compliance` | Audit real personal-data flows against the privacy policy and GDPR / Japan APPI / store privacy labels, then emit a phased plan |
| `plan-rls-audit` | Audit a Supabase/Postgres project for Row-Level Security and access-control gaps, then produce a phased remediation plan |
| `plan-secrets-audit` | Audit the working tree and git history for exposed credentials and mis-scoped keys, then a rotate-vs-relocate plan |
| `plan-security-audit` | OWASP Top 10 + Supabase-first hardening burndown |
| `plan-stub-checker` | Exhaustive audit for stubs, dead buttons, fake components, unwired handlers, and dead links — then a wiring plan, no implementation |
| `plan-test-coverage` | User-story-driven test coverage audit and plan — no test writing in this pass |
| `plan-uiux-unification` | Non-destructive UI/UX and design-system audit that emits a unification burndown — no code until each phase is approved |

### 🎨 Enhance — improve what already exists (15)

| Skill | What it does |
|:------|:-------------|
| `enhance-agent-guardrails` | Install guardrails-as-code so AI sessions cannot reintroduce leaked secrets, injection, or untested code |
| `enhance-arch-boundaries` | Install mechanically-enforced architecture boundaries (dependency-cruiser / eslint-boundaries) so layer direction, feature isolation, and… |
| `enhance-capacitor-ui` | Cross-surface UIUX separation skill for hybrid web apps that ship as PWA + iOS + Android via Capacitor (or Tauri / Expo Web / Ionic /… |
| `enhance-email-deliverability` | Audit and fix transactional/marketing deliverability — SPF, DKIM, DMARC, reputation, bounce/complaint handling, list hygiene, unsubscribe… |
| `enhance-motion` | Audit an existing app's design system and motion, then apply a coherent, performant, reduced-motion-safe pass |
| `enhance-pwa` | Add or upgrade PWA features to any web app: service worker, offline mode, install prompt, push notifications, and background sync |
| `enhance-readme` | Turn a plain-text README into a visually rich showcase with a theme-aware hero image, a feature tour grid, an optional animated guided-tour… |
| `enhance-skill-prompts` | Upgrade an existing SKILL.md prompt (not its behavior) to 2026 practice: degrees of freedom, structured CoT, one worked example,… |
| `enhance-web-forms` | Build or upgrade web forms to production quality: accessible structure, schema-driven validation, client↔server parity |
| `enhance-web-landing` | Build landing pages, portfolios, and marketing sites that don't look AI-generated |
| `enhance-web-redesign` | Upgrades existing websites and apps to premium quality |
| `enhance-web-seo` | Audit and fix SEO for any web app |
| `enhance-web-ui` | Artistic, research-grounded UI enhancement for making an existing page feel intentional, spacious, and human-crafted |
| `enhance-web-ux` | NN/g-grounded page enhancement for flows and semantic data wiring — not visual polish |
| `enhance-web-web3d` | Add 3D and scroll-driven motion to an existing website or web app — Three.js / React Three Fiber for the scene, GSAP ScrollTrigger for… |

### ✨ Design — build something new (10)

| Skill | What it does |
|:------|:-------------|
| `design-api` | Design RESTful and GraphQL APIs following current best practices for naming, versioning, error shapes, and auth patterns |
| `design-canvas` | Create museum-quality visual art in .png and .pdf formats using design philosophy |
| `design-email` | Design and implement transactional and marketing email templates |
| `design-frontend` | Create distinctive, production-grade frontend interfaces that avoid generic AI aesthetics |
| `design-generative-art` | Create algorithmic art using p5.js, Canvas API, or SVG with seeded randomness and interactive parameters |
| `design-mobile-first` | Design mobile-first UIs: touch targets, safe areas, gestures, then enhance up |
| `design-motion` | Design and implement new isolated motion — micro-interactions, page transitions, scroll, hover — with Framer Motion, CSS, or GSAP |
| `design-prd` | Generate Product Requirements Documents through structured conversation for any project |
| `design-system` | Build and maintain cohesive design systems and component libraries with tokens, theming, and documented variants |
| `design-theme` | Apply cohesive visual themes to artifacts (slides, docs, landing pages) |

### 🧱 Backend — server & data patterns (5)

| Skill | What it does |
|:------|:-------------|
| `backend-db-performance` | Optimize database queries, schemas, and performance |
| `backend-error-handling` | Implement solid error handling patterns |
| `backend-observability` | Instrument features so errors, traces, and logs are correlated from the first line |
| `backend-patterns` | Apply modern backend patterns — auth middleware, caching strategies, background queues, rate limiting, and serverless/edge function design… |
| `backend-realtime` | Implement real-time features using WebSockets, Supabase Realtime, Server-Sent Events, and live data |

### 📱 Mobile — React Native / Capacitor (5)

| Skill | What it does |
|:------|:-------------|
| `mobile-capacitor-platform` | Handle Capacitor platform depth beyond UI: plugins, OTA, deep links, push, offline, native CI/CD, App Store / Play Store submission, Apple… |
| `mobile-emulator-start` | Boots a clean Android emulator + Metro (Expo dev-client / bare React Native) with the right ordering: inspect existing IDE terminals first,… |
| `mobile-emulator-test` | QA a native Android build end-to-end on the emulator |
| `mobile-rn-performance` | Fix React Native / Expo performance, build, and upgrade issues |
| `mobile-rn-screen` | Polish an existing React Native screen to feel intentional, native, and human-crafted |

### 📊 Data — charts & pipelines (2)

| Skill | What it does |
|:------|:-------------|
| `data-pipeline` | Wire ETL, ingestion, cron, edge-function, and queue jobs correctly |
| `data-visualization` | Build interactive, accessible charts, graphs, and data dashboards using Recharts, D3, or Victory |

### 📚 Docs — write it down clearly (3)

| Skill | What it does |
|:------|:-------------|
| `docs-adr` | Create and maintain lightweight Architecture Decision Records as agent-readable decision memory — what was decided, why, and which… |
| `docs-coauthor` | Co-author structured documents (specs, PRDs, RFCs) through a 3-stage workflow: context gathering, drafting, and reader testing |
| `docs-writer` | Write clear, developer-friendly documentation — READMEs, API references, code comments, and changelog entries — tailored to the audience… |

### 🧹 Housekeeping — clean up design drift (2)

| Skill | What it does |
|:------|:-------------|
| `housekeep-design` | Apply-now consolidation of a drifted design system into one token/component SSOT |
| `housekeep-gates` | Apply-now consolidation of accreted CI gates, ratchets, and hooks into one aggregator required check |

### 🔗 Workflows — multi-step recipes (18)

| Skill | What it does |
|:------|:-------------|
| `workflow-build-feature` | End-to-end feature build workflow: spec → TDD → implement → smoke test → PR |
| `workflow-coding-discipline` | Apply behavioral guardrails when writing, editing, refactoring, or debugging code |
| `workflow-environment-ready` | Prove the working environment is actually runnable before starting a long or autonomous task, so a multi-hour run does not fail at the… |
| `workflow-feature-flag` | Plan and execute a disciplined feature-flag rollout for any app |
| `workflow-feedback-to-closure` | Turn raw feedback — bug reports, review comments, Sentry, QA, audit output — into deduplicated durable tickets and drive each to verified… |
| `workflow-fix-and-ship` | Complete bug-fix lifecycle in one sweep: triage production signals (Sentry / logs) → reproduce → fix (debug-error) → verify full-stack… |
| `workflow-git-commit` | Generate clear, descriptive commit messages following conventional commits format |
| `workflow-green-repo` | Drive an entire repository to a fully green baseline — typecheck, lint, tests, and build all passing from a clean checkout — when the user… |
| `workflow-housekeep` | Repo housekeeping: sync READMEs to match current architecture, remove dead files (logs, screenshots, deprecated code, build artifacts),… |
| `workflow-launch-ready` | Full launch preparation sweep for a new app or major release |
| `workflow-merge-conflicts` | Resolve an in-progress git merge or rebase conflict by tracing each side back to its original intent |
| `workflow-onboard` | First-contact orientation for an unfamiliar codebase |
| `workflow-parallel-agents` | Run multiple agents in parallel via git worktrees, cloud agents, or multi-model comparison |
| `workflow-pr` | Manage the full PR lifecycle — create, review, address bot feedback, resolve conflicts, and merge |
| `workflow-quality-gate` | Pre-release quality gate that sequences test-red-team, audit-security, audit-bundle-size, audit-performance, and test-unit into a single… |
| `workflow-refactor` | Guide for refactoring code to improve quality without changing behavior |
| `workflow-ship-and-observe` | Take merged, repository-green code all the way to a verified, monitored production release for any app stack |
| `workflow-spec-tdd` | Stop vibe-coding with a spec → plan → TDD loop before writing a line |

### ✅ Test & QA — prove it works (8)

| Skill | What it does |
|:------|:-------------|
| `test-exploratory` | Exploratory ("monkey") QA of a live app as GUEST then LOGGED-IN, then diff |
| `test-load` | Design and run a k6/Artillery load profile that measures throughput, latency percentiles, error rate, and the breaking point under… |
| `test-mutation` | Set up and run mutation testing (StrykerJS / mutmut) to measure whether tests assert behavior, not just execute lines |
| `test-playwright` | Close the PDCA loop on this session's diff |
| `test-qa` | Generic webapp QA fallback — use only when no project-specific QA skill applies (project-local QA wins; native builds →… |
| `test-red-team` | Adversarial red-team of a running web, React Native, or Capacitor hybrid app |
| `test-unit` | Write effective unit tests with best practices for any project |
| `test-visual-regression` | Set up Playwright screenshot baselines and CI diffing so UI changes fail pixel-by-pixel instead of by eye |

### 🚀 Deploy — ship & verify (2)

| Skill | What it does |
|:------|:-------------|
| `deploy-npm` | Release npm packages end-to-end: Changesets version bump, CHANGELOG update, GitHub Actions OIDC publish, and post-release verification |
| `deploy-verify` | Post-deploy smoke test combining all 5 tools (Sentry + Supabase + Firecrawl MCPs, plus the Langfuse and Playwright CLIs) into one workflow |

### 🐛 Debug — find & fix what's broken (3)

| Skill | What it does |
|:------|:-------------|
| `debug-error` | Systematic debugging workflow for errors and bugs |
| `debug-fe-be-integration` | Debug frontend-backend integration issues for any project by analyzing backend logs, identifying incorrect API calls, and fixing both sides |
| `debug-sentry-monitor` | Monitor, triage, fix, and proactively enhance Sentry error monitoring for any project |

### 🦟 Mushi Mushi — bug triage helpers (2)

| Skill | What it does |
|:------|:-------------|
| `mushi-health` | Pass/fail health check across every Mushi Mushi pipeline component — CLI credentials, API reachability, edge functions, BYOK key pool, QA… |
| `mushi-integration` | Full end-to-end Mushi Mushi integration smoke test: bug capture → AI triage → story mapping → TDD test generation → approval → execution →… |

### 🛡️ Protocols — session guardrails (1)

| Skill | What it does |
|:------|:-------------|
| `protocol-browser-anti-stall` | Prevent browser automation from freezing, stalling, or colliding between parallel agents, and enforce manual, headed, real-user driving… |

### ✍️ Authoring — build skills & MCP (2)

| Skill | What it does |
|:------|:-------------|
| `meta-mcp-builder` | Scaffold and implement Model Context Protocol (MCP) servers that expose external services, APIs, and data sources as typed tools and… |
| `meta-skill-creator` | Create or update Cursor agent skills (SKILL.md) |

### 🤝 Third-party (upstream-maintained) (3)

| Skill | What it does |
|:------|:-------------|
| `thirdparty-emil-design-eng` | Third-party skill — Emil Kowalski's design-engineering notes (animation craft, Sonner-style components) |
| `thirdparty-ui-ux-pro-max` | Third-party skill — searchable style catalog, palettes, typography, and UX guidelines via Python scripts |
| `thirdparty-web-interface-guidelines` | Third-party skill — Vercel Web Interface Guidelines compliance (focus, forms, animation, copy) |

### 🧩 Core & cross-cutting (7)

| Skill | What it does |
|:------|:-------------|
| `burndown-full` | Drive a planned change to 100% coverage across an entire codebase when a prior agent run stopped early |
| `complete-everything` | Close an approved plan with zero plan-related deferrals: implement every unfinished item, absorb every connected… |
| `domain-modeling` | Build and sharpen a project's domain model — a CONTEXT.md glossary and ubiquitous language |
| `grilling` | Grill the user relentlessly about a plan, decision, or idea — one question at a time — until shared understanding is reached |
| `handoff` | Compact the current conversation into a handoff document a fresh agent can pick up |
| `iterate-agent-harness` | Turn an agent's own failure — a premature stop, a false "done", a reward- hacked check, a missed file, a broken handoff — into a durable… |
| `iterate-post-launch` | Close the post-launch improvement loop for any shipped app |

### 🖱️ Cursor IDE skills (12)

| Skill | What it does |
|:------|:-------------|
| `babysit` | Keep a PR merge-ready by triaging comments, resolving clear conflicts, and fixing CI in a loop |
| `canvas` | A Cursor Canvas is a live React app the user opens beside the chat |
| `create-hook` | Create Cursor hooks |
| `create-rule` | Create Cursor rules for persistent AI guidance |
| `create-skill` | Guide users through creating effective Agent Skills for Cursor |
| `create-subagent` | Create custom subagents for specialized AI tasks |
| `migrate-to-skills` | Convert 'Applied intelligently' Cursor rules (.cursor/rules/*.mdc) and slash commands (.cursor/commands/*.md) to Agent Skills format… |
| `shell` | Run the rest of a /shell request as a literal shell command |
| `split-to-prs` | Split current work into small reviewable PRs |
| `statusline` | Configure a custom status line in the CLI |
| `update-cli-config` | View and modify Cursor CLI configuration in ~/.cursor/cli-config.json |
| `update-cursor-settings` | Modify Cursor/VSCode user settings in settings.json |

<!-- SKILL-INDEX:END -->

---

## Quick Start

Pick whichever fits how you work. The first one covers most people.

| Method | Command |
|:-------|:--------|
| **skills.sh** (recommended) | `npx skills add kensaurus/cursor-kenji` |
| **npm installer** | `npx @kensaurus/cursor-kenji` |
| **Clone** | `git clone … && ./install.sh` |

**npm installer modes:**

```bash
npx @kensaurus/cursor-kenji            # merge — add/overwrite this repo's items (Cursor)
npx @kensaurus/cursor-kenji --auto     # detect installed tools and install to each
npx @kensaurus/cursor-kenji --claude   # install for Claude Code (~/.claude/) instead
npx @kensaurus/cursor-kenji --codex    # install for Codex CLI (~/.codex/AGENTS.md + prompts)
npx @kensaurus/cursor-kenji --gemini   # install for Gemini CLI (~/.gemini/GEMINI.md + commands)
npx @kensaurus/cursor-kenji --all      # install for all four supported tools in one run
npx @kensaurus/cursor-kenji --clean    # mirror ~/.cursor to match this repo (backup first)
npx @kensaurus/cursor-kenji --dry-run  # preview
npx @kensaurus/cursor-kenji --skill audit-ux   # single skill
npx @kensaurus/cursor-kenji --link     # dev: symlink for live skill authoring
```

**Use more than one AI tool? Reach for `--auto`.** It checks `~/.cursor`, `~/.claude`, `~/.codex`, and `~/.gemini`, then installs the right files to each one it finds. Running the bare command stays Cursor-only, so nothing changes for existing setups.

From a clone: `npm run install:cursor` · `node bin/install.mjs --all` (all tools) · `npm test` validates skills + count + install smoke test.

From any folder: `npx @kensaurus/cursor-kenji --all`. From a clone, `node bin/install.mjs --all` also works (Windows ships `cursor-kenji.cmd` so `npx` from the repo folder works too).

**Optional — [Mushi Mushi](https://github.com/kensaurus/mushi-mushi)** bug-report triage + AI draft PRs (pairs with `mushi-health`, `test-playwright`):

```bash
npx skills add kensaurus/mushi-mushi
```

**After install:** (1) Restart Cursor (2) Copy `mcp/mcp.json.template` → `~/.cursor/mcp.json`, fill `YOUR_*` keys (3) Describe any task — skills match on keywords.

**Authoring skills?** Each skill must pass [Agent Skills spec](https://agentskills.io/specification) validation (`npm run validate:skills`): `name` matches directory, `description` ≤ 320 chars (house budget; spec max 1024), body < 500 lines.

### Claude Code

One-click, no clone needed (works on Windows too):

```bash
npx @kensaurus/cursor-kenji --claude   # Claude Code only
npx @kensaurus/cursor-kenji --all      # all four supported tools
```

All skills, commands, agents, and rules install to Claude Code (`~/.claude/`), with `.mdc` rules installed as `.md`. Skills appear as `/slash-commands` — type `/` inside any `claude` session.

From a clone, the bash installer does the same:

```bash
# Install for Claude Code only
./install.sh --claude

# Install for both Cursor and Claude Code (default)
./install.sh
```

```bash
# Inside Claude Code — use skills as slash commands
/workflow-build-feature
/debug-error the login endpoint returns 401
/plan-security-audit
/docs-writer
```

Skills are read from `~/.claude/skills/<name>/SKILL.md`. No restart required when you re-run the installer — Claude Code picks up file changes at the start of each new session.

### Codex CLI & Gemini CLI

Codex CLI and Gemini CLI don't have a skills system yet. Each reads a single global context file instead, so cursor-kenji maps to exactly what they load:

```bash
npx @kensaurus/cursor-kenji --codex    # Codex CLI
npx @kensaurus/cursor-kenji --gemini   # Gemini CLI
```

| | Codex CLI | Gemini CLI |
|:--|:--|:--|
| **Rules → context file** | `~/.codex/AGENTS.md` | `~/.gemini/GEMINI.md` |
| **Portable commands** | `~/.codex/prompts/*.md` | `~/.gemini/commands/*.toml` |

Your `rules/` get merged into that one auto-loaded file (the skill-routing index is skipped, since nothing here would load it). Three standalone playbooks — `plan`, `research`, and `fix-issue` — ship as native prompts/commands. Skills and subagents aren't written out, because neither tool can load them, so they'd only be dead files. Any existing `AGENTS.md` or `GEMINI.md` is backed up as `.bak-<stamp>` first, and re-running the installer is always safe.

> The bash `install.sh --codex`/`--gemini` delegates to the Node installer (needs Node ≥ 18) so the merge/port logic has a single source of truth.

### Manual install

```bash
git clone https://github.com/kensaurus/cursor-kenji.git && cd cursor-kenji && ./install.sh
```

<details>
<summary>One-liner (curl)</summary>

```bash
curl -sSL https://raw.githubusercontent.com/kensaurus/cursor-kenji/main/install.sh | bash
```

</details>

**Keep fresh:** `npx skills add kensaurus/cursor-kenji` or `git pull && ./install.sh`

---

## Workflows

You rarely run just one skill. You **chain** them. The picture at the top ([How the recipes fit together](#how-the-recipes-fit-together-the-loop)) is the whole idea — this section is the same loop with more detail.

### Stage cheat-sheet

| Stage | What you do | Skill families |
|:------|:------------|:---------------|
| **Orient** | Get to know the repo before you touch it | `workflow-onboard`, `/research` |
| **Assess** | Measure, don't guess. `audit-*` may fix inline; `plan-*` only plans until you approve | `audit-*`, `plan-*` |
| **Change** | Build new (`design-*`) or improve existing (`enhance-*`); merge design drift with `housekeep-design` | `design-*`, `enhance-*`, `backend-*`, `mobile-*` |
| **Prove** | Tests + the no-false-done trio | `test-*`, `verification-before-completion` → `completion-judge` → `complete-everything` |
| **Ship & operate** | Release, watch, feed findings back into Assess | `deploy-*`, `debug-*`, `workflow-ship-and-observe` |
| **Guardrails** | Seatbelts between sessions | rules, completion hook, `enhance-agent-guardrails` |

Specialist audits worth knowing:

- `audit-realworld` — full-stack feature parity
- `audit-resilience` — timeouts, retries, idempotency, PII (the stuff agents skip)
- `audit-backend-architecture` — which distributed pattern to adopt vs skip as over-engineering
- `audit-payment-system` — double-charge, ledgers, webhooks, PCI
- `audit-ux-journeys` — can users actually find things and finish their stories? (IA + task completion)
- `audit-llm-security` — prompt injection / unscoped tools on the AI you ship
- `audit-analytics` — are the funnel events actually firing (and after consent)?
- `audit-skill-conflicts` — did two skills just start giving opposite advice?

### Start here, by situation

Find the row that sounds like your day, then follow the chain:

| Your situation | Chain (→ hands off to) |
|:---------------|:-----------------------|
| New to this repo | `workflow-onboard` → `/research` |
| Inherited a messy / drifted design system | `audit-uiux-design-system` → `plan-uiux-unification` → **`housekeep-design`** |
| Make the app feel alive | **`enhance-motion`** (existing app) · `design-motion` (from scratch) |
| Forms are clunky or inaccessible | **`enhance-web-forms`** → `audit-accessibility` |
| "Is it production-ready?" | **`audit-resilience`** + **`audit-realworld`** → `workflow-quality-gate` |
| Backend architecture — which pattern to use / am I over-engineering? | **`audit-backend-architecture`** → `backend-patterns` |
| Payment flow — double-charge, ledger, webhook, PCI safe? | **`audit-payment-system`** → `audit-security` / `audit-resilience` |
| Users get lost / can't finish a flow / nav feels wrong | **`audit-ux-journeys`** → `enhance-web-ux` / `audit-ux` |
| Empty/error screens are blank or raw | **`audit-ui-states`** → `test-visual-regression` |
| Emails land in spam | **`enhance-email-deliverability`** → `design-email` |
| Can we restore if the DB dies? | **`plan-backup-dr`** → `plan-data-integrity` |
| Are we tracking the right events? | **`audit-analytics`** → `plan-privacy-compliance` / `iterate-post-launch` |
| Prompt injection / is the chatbot safe? | **`audit-llm-security`** → `plan-input-validation` / `plan-llm-cost-guardrails` |
| Wrong skill fired / just added a batch | **`audit-skill-conflicts`** → `meta-skill-creator` |
| Stop AI / vibe-coding regressions | **`enhance-agent-guardrails`** → `plan-security-audit` |
| Close everything, zero deferrals | **`complete-everything`** → `completion-judge` |
| Ship it and watch it | `workflow-ship-and-observe` → `debug-sentry-monitor` → `workflow-feedback-to-closure` |

### Bundled workflows

Say the phrase, and the whole sequence runs for you:

| Say this | Bundle | What runs |
|----------|--------|-----------|
| "complete everything" | `complete-everything` | recover parked work → implement all → full verification → independent judge |
| "make the repo green" | `workflow-green-repo` | discover gates → enumerate failures → batch fix → prove green |
| "ship it / go live" | `workflow-ship-and-observe` | preflight → deploy → verify live revision → observe → stable/rollback |
| "triage this feedback" | `workflow-feedback-to-closure` | gather → dedupe → tickets → fix → verify live → close |
| "build a feature" | `workflow-build-feature` | spec → TDD → unit → smoke → PR |
| "fix this and ship" | `workflow-fix-and-ship` | debug → fix → regression → PR → deploy |
| "is this ready?" | `workflow-quality-gate` | red-team → security → bundle → perf → unit |
| "prepare for launch" | `workflow-launch-ready` | SEO + PWA + bundle + i18n + quality gate |
| "orient me" | `workflow-onboard` | codebase briefing in ~5 min |

### Plan loops (audit only — approve before execution)

These **20 `plan-*` skills** come in grouped loops. Each one audits, then hands you a plan — nothing changes until you approve it. See **[docs/PLAN-LOOPS.md](docs/PLAN-LOOPS.md)** for diagrams, slash aliases (`/uiux-plan`, `/capacitor-plan`, …), and how each maps to execution.

| Loop | Skills | When |
|------|--------|------|
| Six-skill | uiux → stub → test-coverage → perf ∥ security → docs-sync | Inherited codebase / UI hardening |
| Pre-launch hardening | input-validation → secrets → RLS → data-integrity → dependency-provenance | Supabase/Stripe, pre-open-source |
| Observability & spend | error-handling + llm-cost-guardrails | LLM features, Sentry/Langfuse gaps |
| Mobile gate | capacitor-hardening → mobile-readiness | Capacitor/hybrid pre-store |
| Privacy & recovery | privacy-compliance + backup-dr | Consumer launch labels; "can we restore" |
| Growth gate | aeo-readiness + aso | AI citation + store listing conversion |

**One-shot (six-skill plan only):**

```
Run the six-skill plan loop — no changes until I approve each phase:
plan-uiux-unification → plan-stub-checker → plan-test-coverage →
plan-perf-audit + plan-security-audit (parallel) → plan-docs-sync.
```

More copy-paste recipes (adopt repo, de-slop a page, pre-launch sweep, split PRs) → **[docs/CATALOG.md#skill-composition-patterns](docs/CATALOG.md#skill-composition-patterns)** · New to Cursor? → **[docs/GETTING-STARTED.md](docs/GETTING-STARTED.md)**

---

## How to Use

Four kinds of building blocks, four ways to reach them:

| Primitive | Invoke | Example |
|:----------|:-------|:--------|
| **Skill** | Describe the task | "audit my security" → `audit-security` |
| **Command** | `/name` in chat | `/commit`, `/research`, `/pr` |
| **Subagent** | Mention trigger keyword | "review this PR" → `code-reviewer` |
| **Rule** | Copy `.mdc` into project | Always-on conventions |

**Force a skill:** *"use `enhance-web-ux` on `/dashboard`"*

---

## Skill taxonomy

Every skill has two labels: a **family** (its `<prefix>-<topic>` name) and a **lifecycle stage** (from the loop above). The table below shows which stage each family lives in. For the full entries with trigger phrases, see **[docs/CATALOG.md](docs/CATALOG.md)**.

| Prefix | Stage | Purpose | Examples |
|:-------|:------|:--------|:---------|
| `audit-` | 🔍 Assess | Read-only assessments (may fix inline) | `audit-security`, `audit-resilience`, `audit-realworld` |
| `plan-` | 🔍 Assess | Audit-and-plan burndowns — approve before execute (20) | `plan-stub-checker`, `plan-privacy-compliance`, `plan-backup-dr` |
| `enhance-` | 🛠️ Change | Improve existing UI/UX/motion/forms/SEO/PWA | `enhance-motion`, `enhance-web-forms`, `enhance-web-ux` |
| `design-` | 🛠️ Change | New surfaces from scratch | `design-frontend`, `design-motion`, `design-system` |
| `backend-` | 🛠️ Change | Server patterns & resilience | `backend-patterns`, `backend-observability` |
| `mobile-` | 🛠️ Change | RN / Capacitor / emulator | `mobile-rn-screen`, `mobile-capacitor-platform` |
| `docs-` | 🛠️ Change | Documentation | `docs-writer`, `docs-coauthor` |
| `workflow-` | ♻️ Spans | Multi-phase process bundles | `workflow-build-feature`, `workflow-spec-tdd`, `workflow-housekeep` |
| `test-` | ✅ Prove | QA and unit tests | `test-exploratory`, `test-playwright`, `test-red-team`, `test-unit` |
| `deploy-` | 🚀 Ship | Release verify | `deploy-verify`, `deploy-npm` |
| `debug-` | 🚀 Operate | Failures and integration | `debug-error`, `debug-sentry-monitor` |
| `mushi-` | 🚀 Operate | Mushi Mushi integration | `mushi-health`, `mushi-integration` |
| `protocol-` | 🛡️ Guardrail | Session guardrails | `protocol-browser-anti-stall` |
| `meta-` | ✍️ Author | Author skills/MCP | `meta-skill-creator`, `meta-mcp-builder` |
| `thirdparty-` | Varies | Upstream-maintained (vendored) | `thirdparty-emil-design-eng`, `thirdparty-ui-ux-pro-max`, `thirdparty-web-interface-guidelines` |

> `housekeep-design` (design-system consolidation) is the execution arm of `plan-uiux-unification`; it lives in the 🛠️ Change stage alongside `enhance-*`.

> **Third-party skills:** prefixed `thirdparty-*` with `ATTRIBUTION.md` — do not add Kenji-specific sections to upstream bodies. Full guide → **[docs/THIRD-PARTY-SKILLS.md](docs/THIRD-PARTY-SKILLS.md)**.

> **Note:** Anthropic `file-docx/pdf/pptx/xlsx` skills are not in this public repo. Keep personal copies in `~/.cursor/skills/` if needed.

**Cursor-specific skills (12):** `babysit`, `canvas`, `create-hook`, `create-rule`, `create-skill`, `split-to-prs`, … — see [CATALOG.md](docs/CATALOG.md).

---

## Commands (50)

Commands are shortcuts for the things you do constantly. Type `/` in chat to see them all.

| Command | When | What |
|:--------|:-----|:-----|
| `/burndown-full` | Partial refactor stopped early | Drive plan to 100% repo coverage via MATCH/DONE + verification gate |
| `/complete-everything` | Plan marked done with deferrals | Close planned, parked, and discovered work; run the full applicable test ladder |
| `/green-repo` | Whole-repo debt cleanup (authorized) | Drive typecheck/lint/test/build to green from a fresh run |
| `/ship-and-observe` | Deploy to production | Verify the live revision, observe the stability window, roll back if needed |
| `/feedback-to-closure` | Incoming reports/QA/Sentry | Dedupe into durable tickets → fix → production-verified closure |
| `/plan` | Before coding | Research + approved plan |
| `/commit` | After coding | Lint, typecheck, commit |
| `/pr` | Ready to ship | Push + open PR |
| `/fix-issue [#]` | Bug reports | Issue → fix → PR |
| `/debug-issue` | Tricky bugs | Instrumented debugging |
| `/review-code` | Before merge | Agent + manual review |
| `/test` | Before commit | Test suite + coverage |
| `/update-deps` | Maintenance | Safe dep updates |
| `/research` | Before coding | Firecrawl doc research |
| `/readme` | End of session | Sync READMEs |
| `/refactor` | Long files | Modular split |
| `/mcp-guide` | MCP workflow | Tool reference (renamed to avoid Claude Code's built-in `/mcp`) |
| `/uiux` | UI review | Design-system enforcement |
| `/responsive-audit` | Desktop looks like a phone | Breakpoint / linearized-layout audit |
| `/skill-conflicts` | Wrong skill fired / just added skills | Pack contradictions, overlapping triggers, stale refs |
| `/thirdparty-web-interface-guidelines` | Vercel UI audit | Review files against [Web Interface Guidelines](https://vercel.com/design/guidelines) |
| `/*-plan` (20 aliases) | Audit before changing | Thin pointers to the `plan-*` skills (`/uiux-plan`, `/privacy-plan`, `/backup-plan`, `/aso-plan`, …) — audit + plan only. See [CATALOG](docs/CATALOG.md#pointer-delegates-to-skill) |

**RN monorepo bundle:** copy `commands/native-rn-monorepo/` + `rules/native-rn-monorepo/` into your project (iOS builds on CI, not locally).

---

## Subagents (6)

Subagents are focused helpers that peel off to handle one job and report back. Just mention what you need and the right one steps in.

| Agent | Triggers on | Output |
|:------|:------------|:-------|
| `code-reviewer` | "review", code changes | Quality, security, types |
| `debugger` | Errors, exceptions | Root cause + fix |
| `db-migrator` | "migration", "new table" | SQL, RLS, indexes |
| `deploy-checker` | "deploy", "ship it" | Pre-deploy validation |
| `perf-monitor` | "slow", "optimize" | Perf audit |
| `completion-judge` | Plan/burndown closure claim | PASS / CONTINUE / BLOCKED against plan, state, diff, and fresh evidence |

Beyond the prompt itself, `complete-everything` leans on two safety nets: a packaged Cursor stop hook that auto-continues any unfinished work, and `completion-judge`, which independently rejects stale or premature "done" claims. On Claude Code 2.1.139+ you can kick off the same run with `/goal` (see the skill for details).

---

## MCP servers (16)

MCP servers connect your editor to the outside world — your database, GitHub, a browser, and more. Copy a template and drop in your keys:

```bash
cp ~/cursor-kenji/mcp/mcp.json.template ~/.cursor/mcp.json      # essential 5
cp ~/cursor-kenji/mcp/mcp-full.json.template ~/.cursor/mcp.json  # all 16
```

Replace `YOUR_*` placeholders with real keys. Setup details → **[mcp/README.md](mcp/README.md)**

| Tier | Servers | Keys? |
|:-----|:--------|:------|
| Essential | Sequential Thinking, Context7, Firecrawl, Supabase, Playwright | Firecrawl + Supabase |
| Dev | GitHub, Playwright, Postgres, Memory | PAT / conn string |
| Cloud | AWS Lambda, S3, CloudWatch, Redis | AWS profile / URL |
| Productivity | Slack, Notion | Bot token / API key |

---

## Project rules

Rules are always-on conventions your editor follows inside a project. Copy the starters into any repo:

```bash
cp ~/cursor-kenji/rules/project-starter/*.mdc your-project/.cursor/rules/
```

| Rule | Enforces |
|:-----|:---------|
| `supabase.mdc` | Typed clients, RLS, migrations |
| `typescript.mdc` | No `any`, Zod, ActionResult |
| `components.mdc` | Primitives, Server Components, a11y |
| `tailwind.mdc` | Tokens, mobile-first |
| `git.mdc` | Conventional commits, no secrets |

Global rules in this repo: `full-stack-ship-discipline.mdc`, `composer-2.5-execution.mdc`, `skill-workflows.mdc`.

> **Plan with a strong model, execute with Composer 2.5.** The 20 `plan-*` skills are authored/reviewed with a stronger reasoning model; `composer-2.5-execution.mdc` constrains how approved plans are implemented.

**Project constitution:** copy [docs/AGENTS.template.md](docs/AGENTS.template.md) to your app repo as `AGENTS.md` for always-on agent discipline.

---

## Shell helpers

If you live in the terminal, these bash aliases speed up authoring and syncing:

```bash
source ~/cursor-kenji/shell-aliases/cursor-helpers.sh
```

| Command | Action |
|:--------|:-------|
| `newskill <name>` | Create skill template |
| `lsskills` | List installed skills |
| `cursor-sync` | Pull repo + reinstall |
| `cursor-dev` | Open Chrome (debug port) + Cursor |
| `newrule <name>` | Create project rule template |
| `newagent <name>` | Create subagent template |
| `gc <type> <msg>` | Conventional commit |
| `gp` | Push current branch |

Full definitions in [shell-aliases/cursor-helpers.sh](shell-aliases/cursor-helpers.sh) (clone-only; not in npm tarball).

---

## Repository layout

Where everything lives:

```
cursor-kenji/
├── skills/           # 137 Agent Skills (SKILL.md each)
├── skills-cursor/    # 12 Cursor-specific skills
├── commands/         # 50 slash commands
├── agents/           # 6 subagents
├── hooks/            # opt-in completion stop gate
├── rules/            # Global + project-starter rules
├── mcp/              # MCP templates
├── docs/             # CATALOG, PLAN-LOOPS, GETTING-STARTED, …
├── notepads/         # Context templates (clone-only)
├── shell-aliases/    # Bash helpers (clone-only)
├── scripts/          # validate-skills, check-skill-count, install tests
└── bin/install.mjs   # npm installer
```

---

## Design principles

A few opinions this project keeps coming back to — and what keeps them honest:

| # | Principle | Enforced by |
|---|:----------|:------------|
| 1 | Check existing first | `workflow-housekeep`, `plan-stub-checker` |
| 2 | CI-validated examples | `workflow-spec-tdd`, skill validation CI |
| 3 | Modular & composable | `skill-workflows.mdc`, bundled workflows |
| 4 | Audit before change | 20 `plan-*` skills, `/plan` |
| 5 | Verify end-to-end | `full-stack-ship-discipline.mdc`, `test-playwright` |
| 6 | Accessible by default | `audit-accessibility`, project-starter rules |
| 7 | Performance aware | `audit-performance`, `audit-bundle-size` |

---

## Contributing

Adding your own skill is two steps — write it, then let the checks confirm it's valid:

```bash
mkdir -p skills/my-skill && vim skills/my-skill/SKILL.md
npm run test   # validate + count + install smoke
```

See [CONTRIBUTING.md](CONTRIBUTING.md), [docs/README.md](docs/README.md), [docs/DISTRIBUTION.md](docs/DISTRIBUTION.md), [llms.txt](llms.txt), [docs/CATALOG.md](docs/CATALOG.md), [docs/TRIGGER-CHEATSHEET.md](docs/TRIGGER-CHEATSHEET.md).

---

## FAQ

**What is cursor-kenji?**  
A box of ready-made recipes for your AI editor ([Agent Skills](https://agentskills.io) format) — plus slash commands, subagents, and MCP templates for [Cursor](https://cursor.com). One command installs them into `~/.cursor/` and `~/.agents/skills/`.

**How do I install?**  
`npx skills add kensaurus/cursor-kenji` (recommended) or `npx @kensaurus/cursor-kenji`. Restart Cursor after install.

**How many skills?**  
**137** agent skills in `skills/` plus **12** Cursor-specific skills in `skills-cursor/` (**149** total). Counts come from the filesystem and stay synced via `npm run check:skills`. See the [family counts table](#skill-families-at-a-glance).

**How do skills trigger?**  
You talk normally. Cursor matches your words to each skill's YAML `description`. To force one: *"use \`audit-security\` on this repo"*. Full trigger list: [docs/CATALOG.md](docs/CATALOG.md).

**What's the difference between `audit-*` and `plan-*`?**  
`audit-*` looks around and may fix things. `plan-*` only writes a `plan-{name}.md` burndown — **you** approve each phase before any code changes. See [docs/PLAN-LOOPS.md](docs/PLAN-LOOPS.md).

**Where do MCP API keys go?**  
Copy `mcp/mcp.json.template` to `~/.cursor/mcp.json` and fill `YOUR_*` placeholders — never commit real keys. See [SECURITY.md](SECURITY.md) and [mcp/README.md](mcp/README.md).

**Is there machine-readable docs for AI crawlers?**  
Yes — [llms.txt](llms.txt) at the repo root links to canonical docs surfaces.

---

## Alternatives

Not quite what you're after? A few good neighbors:

- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) — curated rules collections
- [skills.sh](https://skills.sh) — skills registry (`npx skills add kensaurus/cursor-kenji`)
- [agentskills.io](https://agentskills.io) — Agent Skills spec + index
- [npm](https://www.npmjs.com/package/@kensaurus/cursor-kenji) · [Cursor Marketplace](https://cursor.com/marketplace) · [cursor.directory](https://cursor.directory/)

cursor-kenji ships executable skills, MCP configs, commands, and subagents in one installable package — not static rules alone. Full listing status → **[docs/DISTRIBUTION.md](docs/DISTRIBUTION.md)**.

---

## Wanna code in the mountains?

Tired of the same desk, same coffee shop, same fluorescent lights?

**[Tsumagoi Work&Camp](https://tsumagoi.kensaur.us)** is a coworking camp at **1,444 m** in Gunma, Japan — real fiber internet, ten camp sites, an open lounge, starlit campfires, and onsen towns (Kusatsu / Manza / Shima) down the road. Bring your laptop. Ship features from a highland ranch. Go for a walk when the build finishes.

<p align="center">
  <a href="https://tsumagoi.kensaur.us">
    <img src="https://tsumagoi.kensaur.us/og-image.png" alt="Tsumagoi Work&Camp — mountain coworking camp" width="720" />
  </a>
</p>

<p align="center">
  <a href="https://tsumagoi.kensaur.us"><strong>→ Visit tsumagoi.kensaur.us — peek at the live ranch, sensors, and booking</strong></a><br/>
  <sub>Built with a stack a lot like what these skills are tuned for. Come say hi.</sub>
</p>

---

## Also by @kensaurus

**[Mushi Mushi](https://kensaur.us/mushi-mushi)** — shake-to-report bugs, AI triage, optional draft PR. `npx mushi-mushi` · pairs with `mushi-health`, `debug-sentry-monitor`, `test-playwright`.

| App | Links |
|:----|:------|
| [Tsumagoi Work&Camp](https://tsumagoi.kensaur.us) | Mountain coworking camp · [tsumagoi.kensaur.us](https://tsumagoi.kensaur.us) |
| [glot.it — Learn Thai](https://kensaur.us/glot-it/) | [iOS](https://apps.apple.com/us/app/glot-it/id6761582648) · [Android](https://play.google.com/store/apps/details?id=com.glotit.app) |
| [yen-yen — Expense Tracker](https://kensaur.us/yen-yen/) | [iOS](https://apps.apple.com/app/id6764548441) · [Android](https://play.google.com/store/apps/details?id=app.yenyen) |
| [Help Her Take Photo](https://kensaur.us/help-her-take-photo/) | [iOS](https://apps.apple.com/app/help-her-take-photo/id6762513666) · [Android](https://play.google.com/store/apps/details?id=com.kensaurus.helphertakephoto) |
| [The Wanting Mind — Free Book](https://kensaur.us/the-wanting-mind/) | [iOS](https://apps.apple.com/us/app/the-wanting-mind/id6761361305) · [Android](https://play.google.com/store/apps/details?id=us.kensaur.thewantingmind) |
| [How to Talk to Girls](https://talk.kensaur.us/) | [Live demo](https://talk.kensaur.us/) |

---

<p align="center">
  <strong>MIT License</strong> · Apache-2.0 portions noted in <a href="NOTICE">NOTICE</a><br/>
  <em><a href="https://github.com/kensaurus">@kensaurus</a> · <a href="CHANGELOG.md">Changelog</a> · <a href="https://github.com/kensaurus/cursor-kenji/discussions">Discussions</a></em>
</p>
