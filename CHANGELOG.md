# Changelog

All notable additions and changes to cursor-kenji are listed here.

---

## [1.16.0] — 2026-08-04

Patterns adopted from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT) after a full comparison of the two packs: alignment-first interviewing, shared domain language, session handoff, intent-first conflict resolution, and the "writing great skills" verbosity levers.

### Added

- **`grilling` skill + `/grill-me` command** — relentless one-question-at-a-time interview to close the user↔agent alignment gap before any code: recommended answer with each question, facts looked up vs decisions asked, no edits until confirmed, closes with a decision log that feeds `design-prd` / `/plan`.
- **`domain-modeling` skill** — build a `CONTEXT.md` glossary and sparing ADRs (hard-to-reverse + surprising + real trade-off only); challenges conflicting terms, sharpens fuzzy language, cross-references claims against code.
- **`handoff` skill + `/handoff` command** — compact the session into a handoff doc (state, ordered next steps, suggested skills, gotchas) in the OS temp dir; secrets redacted, artifacts referenced not copied, verification claims held to the `verification-before-completion` ladder. `disable-model-invocation: true`, so it costs zero always-on context.
- **`workflow-merge-conflicts` skill** — resolve in-progress merges/rebases by tracing each hunk to its original intent (commits, PRs, issues) before resolving; repo checks re-run before finishing.

### Changed

- **`meta-skill-creator` + `create-skill` (Cursor)** — added the verbosity levers: no-op test (delete lines the model already obeys), positive phrasing over prohibition, leading words ("fast, deterministic, low-overhead" → *tight*), single source of truth, one trigger per branch in descriptions, checkable completion criteria; plus model-invoked vs user-invoked (`disable-model-invocation`) cost guidance.
- **`debug-error`** — Phase 1 now requires a tight feedback loop before any hypothesis: one red-capable, deterministic, fast command already run once, asserting the user's exact symptom; Phase 2 gains repro minimisation (every remaining element load-bearing); Phase 6 requires the loop re-run green and the minimised repro converted to a regression test at a correct seam.
- **`workflow-spec-tdd`** — TDD phase now tests only at pre-agreed seams (named in the plan, confirmed with the user), works in vertical slices (tracer bullets, not all-tests-first), bans tautological tests (expected values from an independent source of truth), and treats refactor-broken tests as implementation coupling to fix at the seam.
- **`.cursor-plugin/plugin.json`** — re-synced version with `package.json` (was left at 1.14.1 by the 1.15.0 release).

## [1.15.0] — 2026-08-02

Always-on rules audit (2026-08-02): the shipped rule set cost ~11k tokens per chat once installed globally, against a ~2–4k healthy budget, and per-project template bundles leaked into every repo. Verified against current Cursor docs (`alwaysApply: true` ignores globs/description; rules ≤500 lines; skills load on demand) and Claude Code docs (CLAUDE.md ≤200 lines; `paths:` frontmatter is the only conditional loader in `.claude/rules/`; hooks for enforcement).

### Changed

- **Installer (`bin/install.mjs`, `install.sh`)** — per-project rule bundles (`native-rn-monorepo/`, `project-starter/`) are no longer copied into global `~/.cursor/rules` or `~/.claude/rules`; they are documented as copy-into-project bundles and their always/glob rules were firing in every repo (e.g. RN no-Mac conventions loading in Vite web projects).
- **`rules/skill-workflows.mdc`** — demoted from a 172-line always-on catalog (~2.1k tokens/chat) to a 46-line agent-requested routing index (`alwaysApply: false`); skills self-describe and load on demand, so the full table was dead weight.
- **`rules/composer-2.5-execution.mdc`** — demoted to agent-requested for Cursor and `paths`-scoped (`**/plan-*.md`, `**/plans/**`) for Claude Code, so plan-execution guardrails load only during plan runs.
- **`rules/senior-engineer.md` → `.mdc`** — cut from 122 lines of generic protocol to 26 lines of stack defaults + security non-negotiables, demoted to agent-requested; renamed because current Cursor ignores plain `.md` rule files.
- **`rules/full-stack-ship-discipline.mdc`** and **`rules/verification-before-completion.mdc`** — kept always-on but rewritten at roughly half the length; intent (deploy-schema-with-UI, evidence-before-completion ladders, completion-judge gate) preserved.
- **`scripts/test-install.mjs`** — asserts the bundle exclusion (no `native-rn-monorepo/` or `project-starter/` in installed rules) and the `.mdc` rename.

Hooks, skills, commands, and subagents are unchanged — on-demand surfaces were not the problem.

---

## [1.14.1] — 2026-07-29

Follow-up audit of every browser-touching file after the 1.14.0 migration. Two classes of leftover slipped through: the prose pass used single-line regexes, so any "Playwright MCP" that wrapped across a line break survived; and the token pass renamed `browser_*` verbs without being able to tell that a block of bare verb names was meant to be *runnable*. All 26 files that reference `playwright-cli` or the anti-stall protocol were re-read by hand.

### Fixed

- **`test-playwright`** — Phase 3, the skill's core per-step interaction loop, was still bare pseudo-code carrying the pre-migration "wait 2s" phrasing. Rewritten as a runnable `$PW $S …` sequence. A stale "hard `goto` reload" also became `reload`.
- **`test-qa/references/details.md`** — the equivalent execution-cycle block, same fix.
- **`audit-langfuse-llm`** — a leftover MCP-shaped ` ```json ` block (`goto` plus a `{ "url": … }` object) is now a real `open --headed` invocation.
- **`audit-uiux-design-system`** — the skill **description** still advertised "browser MCP tools", line-split across the YAML fold. Description text feeds skill triggering, so this was stale metadata, not just prose.
- **`commands/test.md`** — "drive a visible browser through the Playwright / MCP" spanned a line break; now names playwright-cli with the `-s=` and `--headed` form inline.
- **`audit-ux/references/details.md`** — bare arrow-stub keyboard-navigation block converted to real commands.

### Changed

- **`enhance-web-ux`** — the three-viewport pass instructed "always with viewport set BEFORE navigate", written for the MCP. Verified against `@playwright/cli@0.1.17` that `resize` persists across `goto` (a 1024×700 viewport survived navigation intact), so the ordering is sound; the stub is now a runnable loop over the three widths with a comparison table for what each one exposes.

### Notes

Skills showing no `$PW` invocations are intentional, not gaps. Spokes such as `enhance-motion` and `enhance-web-forms` reference commands by name and defer to `protocol-browser-anti-stall` for the invocation form — only the hub carries the `PW=` boilerplate.

---

## [1.14.0] — 2026-07-29

Browser automation moves off the **Playwright MCP** and onto **`playwright-cli`**. The MCP serves one browser per server, and a persistent Chrome profile can only be locked by one process at a time — so several agents on the same repo either contend for the profile lock or fight over each other's tabs. The CLI gives every agent its own isolated browser through `-s=<session>`, runs natively in parallel shells, and costs far fewer tokens (no tool schemas or verbose accessibility trees loaded into context). Verified end-to-end against `@playwright/cli@0.1.17`.

### Changed

- **`protocol-browser-anti-stall`** — rewritten around `playwright-cli`. Mandatory `-s=<session>` naming, `npx --yes @playwright/cli@latest` invocation (a global `npm i -g` is unreliable under `fnm`/`nvm`, whose global prefix is per-shell), and **explicit `--headed`** because the CLI is headless by default where the MCP was headed. Adds a session-lifecycle section (`open`/`goto`/`close`/`list`/`close-all`/`kill-all`), a parallel-agents section replacing the old tab-claiming etiquette, and artifact rules covering both `.playwright-mcp/` (screenshots via `--filename`) and the CLI's auto-written `.playwright-cli/` snapshots. All anti-stall guarantees are preserved: navigation guard, ≤3s waits, max 4 attempts per goal, evidence-before-retry, timeout budget, blocker format.
- **Waiting model** — there is no `wait` command in the CLI. Playwright auto-waits for actionability on `click`/`fill`/`select`; explicit waits become `sleep N` (≤3s) or `run-code` with `waitFor({ timeout })`. Documented in the protocol and the command map.
- **22 skills + `commands/test.md` + README migrated** — 191 tool-token replacements plus 52 prose updates across `test-playwright`, `test-qa`, `test-red-team`, `audit-accessibility`, `audit-uiux-design-system`, `audit-ux`, `audit-langfuse-llm`, `audit-bundle-size`, `audit-i18n`, `audit-realworld`, `deploy-verify`, `iterate-post-launch`, `enhance-readme`, `enhance-web-ux`, `enhance-web-ui`, `enhance-web-forms`, `enhance-web-seo`, `enhance-motion`, `enhance-pwa`, `enhance-capacitor-ui`, `design-email`, `housekeep-design`, `plan-perf-audit`, `plan-stub-checker`, `plan-uiux-unification`. The 19 structural `playwright:browser_*` JSON call sites (axe-core injection, keyboard walks, deploy smoke checks) were rewritten by hand into real shell invocations.
- **`mcp/README.md`** — the Playwright entry now documents the CLI as the supported path, keeping the MCP only as an `--isolated` fallback (which loses saved logins). The pin in `mcp/VERSIONS.md` is retained for that fallback.
- **`.gitignore`** — added `.playwright-cli/` alongside `.playwright-mcp/`.

### Added

- **`references/mcp-to-cli-map.md`** — complete `browser_*` → CLI command map (actions, waiting, evidence, tabs, storage, session management), plus the concepts that no longer apply (`browser_lock`, tab claiming, `session.json`, `--isolated` storage-state injection) and the gotchas that bite in practice.
- **Google sign-in workaround** — `references/playwright-session-coordination.md` documents the one case that needs care: Google detects CDP and blocks sign-in from any Playwright-launched browser with "This browser or app may not be secure." The working sequence is a one-time manual login in **real Chrome** against a dedicated `--user-data-dir` (no `--remote-debugging-port`), then reuse via `open --persistent --profile <dir>`. Verified: Gmail loads straight into the inbox, and the session survives `close` → reopen.
- **`scripts/migrate-browser-mcp-to-cli.mjs`** — the reviewed migration script, kept in-tree as an audit trail of how the rewrite was performed.

---

## [1.13.0] — 2026-07-25

UX journeys audit — a new cross-page skill for the layer `audit-ux` (per-page heuristics) doesn't cover: **can users actually find things and finish their stories?** A site can pass every per-page heuristic and still fail because the feature is buried four clicks deep, the nav mirrors the DB schema, or the checkout dead-ends on mobile. Grounded in the 2026 practitioner consensus: a UX audit derives from user stories, audits IA against mental models, walks the real journeys, and grounds findings in behavioral evidence — never taste presented as data.

### Added

- **`audit-ux-journeys`** — cross-page user-story, task-completion & IA audit (**Skill 110**). **Phase 0** derives 5–10 real stories from routes/nav/CTAs (reuses `design-prd`/`plan-test-coverage` inventories, never invented personas) and scopes depth by audit trigger (KPIs dropping / complaints / redesign / pre-launch-no-data → qualitative, labeled as assumptions). **Phase 1** audits IA structurally (IA1–IA9): click depth per story target, orphan pages, dead ends, label consistency (nav ≈ title ≈ H1), grouping vs mental model, first-click logic, wayfinding, search/filter, URL sanity. **Phase 2** walks every story end-to-end in a headed browser (desktop + 390px mobile) → task-completion matrix with friction logs (hesitation/mislabel/backtrack/surprise/stall) and error-recovery probes (invalid input, Back, refresh mid-flow); a BLOCKED story is automatically a Blocker. **Phase 3** evidence discipline — every finding tagged `[data]` / `[observed]` / `[judgment]`; validates against GA4/PostHog/Clarity/Amplitude funnels when present, otherwise recommends minimal instrumentation so the next audit has evidence. **Phase 4** impact×effort report: quick wins vs roadmap vs deprioritized, neutral language, always names what works. Detailed methods in `skills/audit-ux-journeys/references/checklist.md`.

### Changed

- **`audit-ux`** — description and Step 0c now scope it explicitly to the **per-page experience lens** and hand cross-page journeys/IA to `audit-ux-journeys` (its 0c IA map is context-building, not a structural audit). CATALOG, TRIGGER-CHEATSHEET, README (family table 17→18, full list, Assess bullets, "Start here" row), and `skill-workflows.mdc` updated; skill count 109 → 110.

---

## [1.12.1] — 2026-07-24

Fix broken Tsumagoi image on the npm README (private-repo raw GitHub URL 404'd). Point at the public live-site OG image and drop the private repo link.

### Fixed

- **Tsumagoi ad image** — `src` now `https://tsumagoi.kensaur.us/og-image.png` (public) instead of `raw.githubusercontent.com/...` (404 on the private repo).
- **Also by table** — Tsumagoi row links only to the live site; no GitHub repo link.

---

## [1.12.0] — 2026-07-24

README discoverability overhaul — ELI5 intro, always-visible skill lists with family counts, npm-safe workflow diagram (no mermaid), and a playful Tsumagoi Work&Camp invite. No skill/command behavior changes; counts unchanged.

### Added

- **"Explain it like I'm five"** opener with a use-case table (*you say… → what kicks in*) and an ASCII workflow loop that renders on npm (replaces the mermaid block that showed as raw code).
- **Skill families at a glance** table (counts + one-line blurb per family) plus a full always-visible skill table per family — no collapsed `<details>` you have to click open.
- **Wanna code in the mountains?** — playful ad for [Tsumagoi Work&Camp](https://tsumagoi.kensaur.us) (1,444 m coworking camp) with live-site link + screenshot.

### Changed

- README section order: inventory + full skill list sit **above** the long Quick Start installer details.
- `scripts/generate-skill-index.mjs` emits markdown tables instead of collapsed details; warmer family headings.
- Workflows section simplified to a stage cheat-sheet that points at the top loop diagram.

---

## [1.11.2] — 2026-07-24

Move the auto-generated skill index up so npm/GitHub visitors see every skill right after the inventory table — no 12-screen scroll past Workflows. No skill behavior changes.

### Changed

- **README section order** — `Every skill, in plain English` now sits immediately after `What's Inside` (before `Workflows`), so the skill list is discoverable on the npm Readme tab without deep scrolling.

---

## [1.11.1] — 2026-07-24

README rewrite — the npm/GitHub landing page now lists every skill with a one-line summary, and the prose is warmer throughout. No skill, command, rule, or hook behavior changes; counts unchanged.

### Added

- **Auto-generated skill index in README** — new "Every skill, in plain English" section lists all **121** installable skills (109 agent + 12 Cursor) grouped by family, each with a one-line summary pulled from that skill's `SKILL.md` frontmatter. Collapsed `<details>` groups keep the page scannable.
- **`scripts/generate-skill-index.mjs`** — regenerates the README block between `<!-- SKILL-INDEX:START -->` / `END` markers. `npm run gen:skill-index` writes; `npm run check:skill-index` (wired into `npm test`) fails if the block drifts from the filesystem.

### Changed

- **README tone** — benefit-first intro, shorter sentences, plain-English lead-ins before dense tables, and the giant Workflows "Assess" paragraph broken into scannable sub-bullets. FAQ grammar fix ("A installable" → "It's an installable").

---

## [1.11.0] — 2026-07-24

Payment system audit — a new read-only skill for the code that fails differently from normal CRUD: a retried charge is a **double-charge**, a lost ledger write is **vanished money**, a logged PAN is **PCI liability**, an unverified webhook is a **spoofed "payment succeeded"**. Grounded in the 2026 consensus (idempotency + double-entry ledger + reconciliation, with PCI DSS v4.0.1 as the floor and webhooks as the source of truth). Scope-gated so a Stripe-Checkout shop and an in-house gateway each see only relevant findings, and wired to the Stripe MCP for version-anchored provider checks.

### Added

- **`audit-payment-system`** — read-only, scope-gated audit (**Skill 109**). Phase 0 detects the payment surfaces + provider and classifies the repo (**P0 merchant integrator / P1 platform-marketplace / P2 gateway-PSP-fintech**) so an in-house-ledger control is `N/A` (not "Missing") on a shop that offloads it to Stripe. Phase 2 marks each in-scope control **Implemented/Partial/Missing/N-A** with `file:line` across seven groups: **A** money-movement correctness (idempotency on every mutation + DB unique constraint, dedup/payload-guard, payment state machine / no double-capture, integer minor units, multi-currency+FX), **B** ledger & data integrity (double-entry balanced/sum-zero, append-only immutable, derived balance snapshots, auditability, date partitioning), **C** async & webhooks (sync-auth vs async-everything, HMAC verify, event-id dedup + 200-then-process, atomic state+ledger+outbox, pull-based recovery for stuck payments, refund/dispute/payout saga), **D** reconciliation & settlement (daily 3-way match ledger↔PSP↔bank, break report, discrepancy handling, halt-on-unreconciled brake), **E** fraud/risk/SCA (velocity/geo/device + rules/ML score, 3DS2/SCA + exemptions, fraud-service fail policy, chargeback/VAMP monitoring, AML), **F** PCI DSS v4.0.1 (never store/log PAN or CVV, tokens-only scope reduction, key rotation, access audit), **G** resilience (PSP/bank timeout + breaker, bulkhead, partial-write safety, graceful degradation). Detailed per-control detection in `skills/audit-payment-system/references/checklist.md`.
- **Stripe MCP wiring** — when the PSP is Stripe, Phase 1 uses `search_stripe_documentation` for concepts/best-practice and `stripe_api_search` + `stripe_api_details` for exact API params, anchoring findings to the current API (PaymentIntents, not the legacy Charges API). Non-Stripe providers use `/research` against official docs.

### Changed

- No severity below **Critical** for a double-charge, lost-money, or PAN-exposure finding. Read-only: payment code is a STOP-and-confirm surface, so findings feed a human-reviewed remediation rather than an unattended edit. Delegates without overlap — per-call resilience → `audit-resilience`, PCI/secrets → `audit-security`, ledger schema → `audit-db-schema`, outbox/saga structure → `audit-backend-architecture`. CATALOG, TRIGGER-CHEATSHEET, README, and `skill-workflows.mdc` updated; skill count 108 → 109.

---

## [1.10.0] — 2026-07-24

Decision lens for `audit-backend-architecture` — v1.9.0 answered *"is pattern X present?"* (conformance). This turns it into a **decision advisor** that answers *"which pattern should this codebase adopt next, and which would be over-engineering right now?"* — grounded in the 2026 "start simple, earn every pattern / modular-monolith-first" consensus. No new skill; the existing audit gets a second lens plus three patterns it was missing.

### Added

- **Fit/decision lens (Phase 3)** in `audit-backend-architecture` — for each pattern, classify **Adopt now / Adopt when [trigger] / Defer (premature)** from detected symptoms, with a **maturity ladder** (Stage 0 modular monolith → cache-aside/outbox → async/BFF/CQRS → db-per-service/saga → mesh/cell-based, each gated by a trigger) and a **symptom→pattern decision table**. Over-engineering is now a first-class finding (CQRS without read/write divergence, mesh/microservices below the size threshold, distributed monolith).
- **Core principle — "start simple, earn every pattern"** — modular-monolith-first default; a pattern is only "Missing" when a measurable trigger justifies its cost; decide sync-vs-async **per interaction**; distributed monolith flagged as worse than a monolith.
- **Three patterns added** (audit rows #17–19 + detection in `references/patterns.md`): **communication style** (sync request/response vs async event-driven, per interaction, with a signal table), **cache-aside** (TTL + invalidation + stampede guard), **database-per-service / data ownership** (+ distributed-monolith anti-pattern).
- **`backend-patterns/references/architecture-patterns.md`** — implementation for the three: sync-vs-async decision tree + hybrid/outbox example, cache-aside read+invalidate, and data-ownership (owned schemas at T1, split only under real pressure).

### Changed

- Report template gains **Adopt now / Adopt when / Defer** sections (renumbered to Phase 4). `audit-backend-architecture` description, CATALOG, TRIGGER-CHEATSHEET, README, and `skill-workflows.mdc` now surface the decision lens ("which pattern should I use", "am I over-engineering", "sync vs event-driven"). Skill/command/agent **counts unchanged** (enhancement, not a new skill).

---

## [1.9.0] — 2026-07-24

Backend architecture audit — a new read-only skill that checks a repo's **distributed-systems architecture** (not just per-call resilience), plus an implementation reference so the fixes it delegates actually exist. Answers "is my backend production-grade?" for the patterns agents systematically skip: API gateway, BFF, outbox, saga, bulkhead, hexagonal, service mesh, and more. Topology-gated so a Next.js/Supabase monolith and a Kubernetes fleet each see only relevant findings.

### Added

- **`audit-backend-architecture`** — read-only, topology-gated audit (**Skill 108**). Phase 0 classifies the repo into a tier (T1 serverless/monolith → T2 containers → T3 k8s/microservices/event-driven), then marks each in-scope pattern **Implemented/Partial/Missing/N-A** with `file:line`: **API gateway** (auth, rate-limit, CORS, transform, logging, monitoring, caching), **BFF / API composition / GraphQL federation**, **circuit breaker**, **bulkhead**, **backpressure/load-shedding**, **outbox + CDC** (the dual-write fix), **saga** (orchestration/choreography + compensation + saga-pivot), **CQRS + event sourcing**, **hexagonal / ports-and-adapters**, **anti-corruption layer**, **strangler-fig migration**, **sidecar / service mesh** (incl. ambient/sidecarless), **cell-based architecture**, **zero-trust/mTLS**, **distributed tracing + SLOs**, and **contract testing**. Detailed per-pattern detection lives in `skills/audit-backend-architecture/references/patterns.md`.
- **`skills/backend-patterns/references/architecture-patterns.md`** — implementation guidance + code for the patterns the audit flags (gateway centralization, BFF, bulkhead, circuit-breaker placement, outbox+relay/CDC, saga with the saga-pivot rule, hexagonal/ports-and-adapters, anti-corruption layer, strangler-fig), plus a "when NOT to reach for these" section.

### Changed

- **`audit-resilience` boundary kept clean** — the new architecture audit checks whether *patterns* exist (structural); per-call runtime tuning (timeouts, retry backoff+jitter, idempotency keys, cancellation) still belongs to `audit-resilience`, which the new skill explicitly defers to instead of duplicating.
- **`backend-patterns`** — description gains triggers ("circuit breaker", "outbox pattern", "saga", "bulkhead", "hexagonal architecture", "API gateway", "BFF") and a new "Architecture patterns (distributed systems)" section pointing to the reference; pairs with `audit-backend-architecture`.
- **Routing/docs** — added to `skill-workflows.mdc` (repo + `.cursor`), `docs/CATALOG.md`, `docs/TRIGGER-CHEATSHEET.md`, and `README.md` (Assess stage, use-case table). Counts synced to **108 skills**.

---

## [1.8.3] — 2026-07-23

Command-collision fix — three of our slash commands shared names with Claude Code's own commands. Because Claude Code 2.x **merges `commands/` into the skill namespace**, a file at `commands/<x>.md` creates `/<x>`: when `<x>` matches a built-in it shows a **duplicate**, and when it matches a bundled skill our file **silently overrides** Claude's. Renamed all three and added a CI guard so it can't regress. No other skill, command, rule, or hook behavior changes; command **counts are unchanged**.

### Changed

- **`/mcp` → `/mcp-guide`** — was duplicating Claude Code's built-in `/mcp` (the MCP server manager). Renamed `commands/mcp.md` → `commands/mcp-guide.md`.
- **`/review` → `/review-code`** — was duplicating Claude Code's built-in `/review`. Renamed `commands/review.md` → `commands/review-code.md` (still delegates to `audit-code-review`).
- **`/debug` → `/debug-issue`** — was overriding Claude Code's bundled `/debug`. Renamed `commands/debug.md` → `commands/debug-issue.md` (still delegates to `debug-error`).
- **`README.md` + `docs/CATALOG.md`** — command tables updated to the new names with a note on why each was renamed.

### Added

- **CI guard** in `scripts/validate-skills.mjs` — fails `npm test` if any `commands/*.md` name collides with a known Claude Code built-in command or bundled skill, so future commands can't reintroduce a duplicate/override.

> **Upgrade note:** the natural-language triggers are unchanged (say "debug this", "review my PR", etc. and the underlying skill still fires). Only the explicit slash aliases changed: use `/mcp-guide`, `/review-code`, `/debug-issue`. After updating, **restart Claude Code** — it live-watches skill directories but not `commands/`, so newly added or renamed command files only register on the next session start.

---

## [1.8.2] — 2026-07-23

Documentation-skill release — teach the skills to write the way the 1.8.1 README now reads. Bakes the reader-first, plain-language 5W1H approach into the documentation-authoring skills themselves, so every doc they produce orients a newcomer before diving into reference detail. No other skill, command, rule, or hook behavior changes.

### Changed

- **`docs-writer`** — new **"Core principle — write for the reader's mental model first"** section with a 5W1H table (what/why/who/how/when·where → how to answer each) and the rules that follow (lead with the goal not the implementation, progressive disclosure, beat the curse of knowledge, show-don't-tell). Adds a **"Newcomer on-ramp"** section demonstrating the 3-column plain-language building-blocks glossary, a **"Kill the Jargon"** guideline (plain-first, precise-second), an upgraded README template (plain tagline + why/who + glossary hint), and two new README-checklist items (first-screen what/why/who; jargon defined or glossed).
- **`enhance-readme`** — previously visual-only; adds **"The words matter as much as the pixels"** coupling the hero/screenshot work to `docs-writer`'s principle, defines the ideal first-screen order (name+tagline → hero → why/who → first-win → depth), adds why/who to the hero template, and adds a stop-condition that the first screen must answer what/why/who in plain language.
- **`docs-coauthor`** — adds a guiding-principle line: orient the reader (what/why/who) from the first sentence, not just at the Reader-Testing stage; points to the canonical `docs-writer` rule.

Kept DRY: the full principle lives in `docs-writer`; the other two reference it. `plan-docs-sync` (a drift *audit*, not an authoring skill) intentionally unchanged.

---

## [1.8.1] — 2026-07-23

Documentation-clarity release — same skills, friendlier front door. Rewrites the released-page surfaces (README on npm/GitHub, `llms.txt` for AI crawlers, the Cursor plugin manifest, directory listing copy) so a non-technical newcomer can answer *what / who / why / how* before hitting the counts and taxonomy. No skill, command, rule, or hook behavior changes.

### Changed

- **README newcomer on-ramp** — adds a plain-English hero line, a "New to AI skills?" primer, a "Who it's for" callout, and a five-row **building-blocks glossary** (Skill / Command / Subagent / Rule / MCP server → plain meaning + how you trigger each) directly under the intro, while preserving the full developer depth below.
- **`llms.txt`** — leads with the plain value proposition (ready-made playbooks your editor auto-triggers) before the inventory, improving how AI answer-engines and directory crawlers summarize the project.
- **`.cursor-plugin/plugin.json`** — benefit-first description for the Cursor marketplace / directory listings.
- **`docs/CATALOG.md`** — skill-taxonomy table gains a lifecycle **Stage** column and a `plan-`/`housekeep-` row, with a newcomer pointer to the Getting Started guide.
- **`docs/GETTING-STARTED.md`** — plain-language example rows for the v1.8.0 skills (motion, forms, design consolidation, guardrails, resilience).
- **`docs/TRIGGER-CHEATSHEET.md`** & **`docs/PROMOTION.md`** — first-time-reader pointer and benefit-first listing copy.

---

## [1.8.0] — 2026-07-23

Design, motion, forms, and anti-vibe-coding release. Adds six skills that fill the loop's remaining gaps — full-stack parity (`audit-realworld`), production resilience (`audit-resilience`), coherent motion on an existing system (`enhance-motion`), design-system consolidation to one SSOT (`housekeep-design`), production-quality forms (`enhance-web-forms`), and guardrails-as-code against AI regressions (`enhance-agent-guardrails`). README gains a "mental model" section teaching how the families chain against each other, a by-use-case entry table, and lifecycle-stage tags. Skills 100 → 106.

### Added

- **`audit-realworld` skill** — read-only full-stack gap audit that benchmarks a repo against the [RealWorld](https://github.com/realworld-apps/realworld) ("Conduit") reference: its formal API spec, shared Bruno/Hurl E2E contract suite, and closest-stack reference implementation. Auto-detects strict spec **Conformance** (repo is a RealWorld build) vs **Benchmark** (maps RealWorld's production-relevant patterns onto the repo's own domain), and bows out cleanly on non-CRUD/non-web repos. Reports Implemented/Partial/Missing/Diverges across frontend, backend, and data layer with `file:line` evidence, then delegates real production hardening to `audit-security` / `plan-security-audit` / `plan-perf-audit` / `plan-rls-audit` / `full-stack-ship-discipline` — RealWorld is treated as a completeness/pattern reference, never a production bar. Wired into the Audits routing table, `docs/CATALOG.md`, and `docs/TRIGGER-CHEATSHEET.md`. Skills 100 → 101.
- **`enhance-motion` skill** — audits an existing app's design system and current motion, then applies coherent, `prefers-reduced-motion`-safe, 60fps motion using a right-sized 2026 stack (tw-animate-css for CSS utility transitions, Auto-Animate for zero-config list/layout changes, Motion/motion.dev for component transitions·gestures·presence, GSAP only for complex timelines), with Kinetics as a pattern source. Defines a motion-token SSOT so timing/easing stops fragmenting. Distinct from `design-motion` (from-scratch cookbook); applies changes and verifies via browser MCP.
- **`housekeep-design` skill** — consolidates a design system that has drifted across many vibe-coding sessions and dev handoffs into one source of truth. Detects competing tokens, duplicate components, naming drift, mixed icon libraries, and arbitrary values; reconciles each conflict to a best-of-both canonical form; migrates usages via mechanical codemod (pairs with `burndown-full`); and installs lint guardrails so drift can't recur. Establishes a 3-layer W3C token taxonomy (primitive → semantic → component). The execution arm of `plan-uiux-unification`; the design counterpart of `workflow-housekeep`.
- **`enhance-web-forms` skill** — builds/upgrades web forms to production quality: accessible structure (labels, fieldsets, autocomplete, input types), schema-driven validation with client↔server parity, screen-reader-associated inline errors, complete interaction states (loading/disabled/success/error/empty), multi-step flows, unsaved-changes guards, and optimistic submit feedback. Auto-detects the form + validation stack; applies changes and verifies via browser MCP.
- **`enhance-agent-guardrails` skill** — installs guardrails-as-code so AI/vibe-coding can't keep reintroducing the same problem classes (leaked secrets, injection, off-system styles, untested code, vulnerable deps, destructive ops). Audits existing protection, then sets up agent policy files (`.cursor/rules` + `AGENTS.md`), a pre-commit hook (secret scan + SAST + lint/typecheck), a CI gate that treats agent output as untrusted, and lint-as-policy rules. Verifies the guards block a planted bad pattern; flags merge-blocking CI changes for human review. Grounded in 2026 research on AI-generated-code security debt.
- **`audit-resilience` skill** — read-only audit for the non-functional "20%" agents systematically skip (the "80% problem"): timeouts, retries with backoff+jitter, circuit breakers, idempotency keys, rate limiting, graceful degradation, cancellation, audit logging, and PII handling in logs. Inventories every external call, mutation, webhook, and payment path and marks each concern Implemented/Partial/Missing with `file:line`, severity, and the exact fix skill; delegates remediation to `backend-error-handling` / `backend-patterns` / `backend-observability` / `plan-*`.

All six new skills wired into both `skill-workflows.mdc` routing copies, `docs/CATALOG.md`, and `docs/TRIGGER-CHEATSHEET.md`. Skills 100 → 106.

### Changed

- **README mental-model rewrite** — the Workflows section now opens with a "how the families work against each other" lifecycle diagram (Orient → Assess → Change → Prove → Ship & operate, with always-on Guardrails), a "Start here — by use case" entry table that chains the new skills, and lifecycle-**stage** tags added to the skill-taxonomy table (Assess / Change / Prove / Ship / Operate / Guardrail). Teaches composition, not just the flat skill list.

---

## [1.7.0] — 2026-07-21

Completion-loop release — close the gaps where agents stop early, declare false "done", or leave documented capabilities unwired. Adds an enforcement layer (evidence rule + independent judge + opt-in continuation hook), five closure/ops workflow skills, and repairs every known broken internal reference. Skills 95 → 100, commands 16 → 36, subagents held at 6.

### Added

- **`complete-everything`** skill + **`/complete-everything`** command — close unfinished plan intent and connected work previously parked as out of scope/follow-up/optional, persist observable acceptance evidence in `.cursor/complete-everything-state.md`, and loop the applicable typecheck/lint/test/API/build/browser gates until complete
- **`completion-judge` subagent** — independently reconciles the approved outcome, durable state, full diff, baseline, and fresh evidence before returning `PASS`, `CONTINUE`, or `BLOCKED`
- **`verification-before-completion` rule** — defines evidence-backed completion levels from implemented through observed-stable and forbids claims above the proven level
- **Opt-in Cursor completion hook** — continues only actionable unchecked `complete-everything`/`burndown-full` state; safely merges into existing user hooks and remains inert for completed, errored, or human-gate-only runs
- **Closure-loop workflow skills + commands** — `workflow-green-repo` (`/green-repo`) drives the whole repository to a verified-green baseline; `workflow-ship-and-observe` (`/ship-and-observe`) takes merged code to a monitored production release with a live-revision check and rollback tail; `workflow-feedback-to-closure` (`/feedback-to-closure`) turns raw feedback into deduplicated durable tickets driven to production-verified closure
- **`workflow-environment-ready`** skill — preflights the toolchain, services, and config before a long autonomous run so it does not fail at the finish line on a missing dependency or credential
- **`iterate-agent-harness`** skill — converts an agent failure (premature stop, false done, reward-hacked check, broken handoff) into a durable harness guard plus a regression check that fails before the fix
- **17 `plan-*` pointer commands** — `/uiux-plan`, `/security-plan`, `/rls-plan`, `/secrets-plan`, `/validation-plan`, `/integrity-plan`, `/error-plan`, `/deps-plan`, `/cost-plan`, `/aeo-plan`, `/mobile-plan`, `/capacitor-plan`, `/stub-plan`, `/perf-plan`, `/docs-plan`, `/test-plan`, `/slop-plan` — thin audit-and-plan entries the docs previously referenced but shipped no file for

### Changed

- **Composer execution precedence** — normal plan runs still stop at phase boundaries; explicit closure modes persist the checkpoint and continue. Approved non-destructive schema work on a confirmed target now follows full-stack deployment discipline without a contradictory permission stop.
- **Count synchronization** — skill, command, and subagent totals are all derived from the filesystem.

### Fixed

- **Broken internal skill references** — repaired a doubled `workflow-spec-workflow-spec-tdd` link in four skills, a wrong `references/` path in `workflow-spec-tdd`, dead `mushi-debug` links in `mushi-health`/`mushi-integration` (now the mushi MCP `diagnose_setup` tool), and non-existent `../start-emulator`/`../test-emulator` links in `mobile-rn-screen`. A from-scratch relative-link scan now resolves clean.

## [1.6.0] — 2026-07-18

Universal installer — cursor-kenji now installs to every supported AI coding tool, mapping to what each tool actually loads. Skills-capable tools (Cursor, Claude Code) get the full skills + commands + agents + rules set; context-file tools (Codex CLI, Gemini CLI) get the rules merged into their global instructions file plus portable command ports. Skill count held at 94.

### Added
- **`--auto` detection** — probes `~/.cursor`, `~/.claude`, `~/.codex`, `~/.gemini` and installs the right artifacts to each installed tool (falls back to Cursor if none are found).
- **Codex CLI support (`--codex`)** — merges `rules/` into `~/.codex/AGENTS.md` (auto-loaded) and ports `plan`/`research`/`fix-issue` to `~/.codex/prompts/*.md`.
- **Gemini CLI support (`--gemini`)** — merges `rules/` into `~/.gemini/GEMINI.md` (auto-loaded) and ports the same commands to `~/.gemini/commands/*.toml`.
- **`commands-portable/`** — new single source of truth for the three tool-agnostic playbooks the installer transforms per tool.
- Install smoke test now exercises the Codex/Gemini paths (merged-rules content, command ports, TOML shape, idempotency, `--auto` detection).

### Changed
- **`--all` now targets all four supported tools** (was Cursor + Claude Code). A bare `npx @kensaurus/cursor-kenji` stays Cursor-only for backward compatibility.
- The rules merge deliberately omits the skill-routing index (`skill-workflows.mdc`) — the context-file tools have no skills loader, so it would be dead text. Skills and subagents are not written to Codex/Gemini for the same reason.
- Generated context files are idempotent (byte-identical on re-run) and backed up (`.bak-<stamp>`) before any overwrite.
- `install.sh` gains `--auto`/`--codex`/`--gemini`/`--all`; Codex/Gemini delegate to the Node installer so the merge/port logic has one source of truth.

## [1.5.1] — 2026-07-18

Prompt-engineering quality pass from `docs/PLAN-SKILL-PACK-ENHANCEMENT.md` (Phases 3–5). No new skills; skill count held at 94. Dual-runtime (Cursor + Claude Code) portability, staleness, and licensing hygiene.

### Changed
- **Dual-runtime portability** — skills now refer to each other by bare name (no path assumptions), and MCP calls use portable `ServerName:tool_name` prose instead of runtime-specific fenced tool blocks.
- **Command frontmatter** — added `description` + `argument-hint` to 14 slash commands for discoverability.
- **Progressive disclosure** — relocated bulk inline content to `references/` in `workflow-housekeep`, `backend-realtime`, and `deploy-npm` (`references/example-mushi-mushi.md`); trimmed oversized `plan-*` descriptions and rewrote thin ones to the house standard.
- **Descriptive prose over pseudo-tools** — `audit-ux` and `audit-security` reframe `Glob`/`Grep` fenced blocks (which read as executable calls) as plain guidance.

### Fixed
- **Stale model IDs** — refreshed illustrative model references in `audit-langfuse-llm` to current-generation IDs.
- **Hardcoded counts** — decoupled the style-catalog count from the always-on `thirdparty-ui-ux-pro-max` description.
- **License attribution** — pinned verified upstream MIT licenses (with copyright holders) in `thirdparty-emil-design-eng` and `thirdparty-web-interface-guidelines` `ATTRIBUTION.md`, replacing "See upstream repository" placeholders.

## [1.5.0] — 2026-07-18

### Added

- **npm installer: Claude Code target** — `npx @kensaurus/cursor-kenji --claude` (Claude Code only) and `--all` (Cursor + Claude Code) install skills, commands, agents, and rules to `~/.claude/` with `.mdc` rules converted to `.md`. One-click on any OS, no clone needed. New `npm run install:claude` / `install:all` scripts.
- **install.sh: Claude Code commands** — `~/.claude/commands/` now installed alongside skills/agents/rules.
- **`docs/PLAN-SKILL-PACK-ENHANCEMENT.md`** — full prompt-engineering audit of all 94 skills + 15 commands with a phased enhancement burndown (token usage, progressive disclosure, dual-runtime portability, description standards).
- **Third-party UI skills** (Jun 2026) — `thirdparty-emil-design-eng`, `thirdparty-ui-ux-pro-max`, `thirdparty-web-interface-guidelines` with `ATTRIBUTION.md`, `docs/THIRD-PARTY-SKILLS.md`, and `/thirdparty-web-interface-guidelines` command
- **`burndown-full`** skill + **`/burndown-full`** command — drive partially-executed refactors/migrations to 100% repo coverage via MATCH/DONE patterns, persistent `.cursor/burndown-state.md`, batched execution, and a verification gate (framework-agnostic; works in Cursor and Claude Code)

### Fixed

- **Sentry MCP calls** — `naturalLanguageQuery` → `query` across 15 skill files (matches current Sentry MCP `search_issues`/`search_events` signature).
- **`mobile-emulator-start`** — display default corrected to `1080×2400`; `1080×4000` is now opt-in for scroll-QA with a matching tall skin.
- **`test-red-team`** — description trimmed under the Agent Skills 1024-char frontmatter limit.
- **`design-mobile-first`** — repaired garbled self-referential description.
- **`enhance-web-landing`** — H1 renamed to match the skill (internal codename removed).
- **Privacy/staleness** — private project names removed from `test-qa` and `data-pipeline`; unverifiable CVE numbers and named-incident claims replaced with hedged failure-class descriptions in `plan-input-validation`, `plan-rls-audit`, `plan-data-integrity`, `plan-llm-cost-guardrails`, `plan-secrets-audit`.
- **install.sh** — removed duplicated "Installed N skills" log line.

---

## [1.4.2] — 2026-06-24

### Fixed

- **npm tarball** — `.mcp.json` included in published package (Cursor Marketplace MCP reference)
- **MCP essential 5** — aligned `mcp/mcp.json.template`, `.mcp.json`, and docs on Playwright (was Chrome DevTools in template)

### Changed

- **Anti-slop pass** — skill YAML descriptions, subagent frontmatter, README badges, CATALOG/PROMOTION/GETTING-STARTED copy
- **`docs/DISTRIBUTION.md`** — install channel matrix (Cursor vs Claude Code vs Marketplace)
- **README** — Claude Code labeled bash-only; shell helpers table expanded; project rules count clarified
- **`package.json`** — removed `prepare` git-hooks side effect on consumer `npm install`
- **`.gitignore`** — `*.log`, `*.bak`, `*.old`, `*.tmp`

---

## [1.4.1] — 2026-06-23

### Fixed

- **`package.json` bin** — `cursor-kenji` → `bin/install.mjs` (npm publish no longer strips the bin entry)
- **`repository.url`** — normalized to `git+https://github.com/kensaurus/cursor-kenji.git`

### Changed

- **npm OIDC Trusted Publisher** configured (`kensaurus/cursor-kenji` · workflow `npm-publish.yml`)
- **CI publish** — OIDC-first; `NPM_TOKEN` only used when the secret is set

---

## [1.4.0] — 2026-06-23

### Added

- **`llms.txt`** — machine-readable doc index for answer-engine / AI crawler discoverability
- **`SECURITY.md`** — MCP secrets hygiene, OIDC-first publish guidance, zero-dep policy
- **`scripts/scan-secrets.mjs`** — pre-commit secret pattern scanner (zero-deps)
- **`scripts/check-mcp-pins.mjs`** + **`mcp/pinned-versions.json`** + **`mcp/VERSIONS.md`** — semver-pinned MCP templates
- **README FAQ** — install, skill count, audit vs plan, MCP keys, llms.txt

### Changed

- **MCP templates** — all `@latest` removed; npm + uvx packages pinned; AWS servers migrated to valid PyPI names (`lambda-tool`, `aws-api`, unified `cloudwatch-mcp`)
- **Pre-commit** — runs secret scan before skill validation
- **`npm test`** — includes secret self-test + MCP pin check
- **`docs/PROMOTION.md`** — OIDC-first npm publish; launch copy skill count 90

---

## [1.3.0] — 2026-06-23

### Added

- **Eleven new `plan-*` skills** — security spine, launch gates, antislop, Capacitor hardening, observability/spend (`plan-rls-audit` through `plan-capacitor-hardening`)
- **`docs/AGENTS.template.md`** — project constitution (mission / stack / roadmap / agent discipline)
- **`docs/examples/plan-audits/`** — sample plan burndown outputs; root `/plan-*.md` gitignored

### Changed

- **README** de-duplicated (~340 lines); CATALOG canonical; skill count **90** (17 plan-*)
- **`check-skill-count.mjs`** syncs README, CATALOG, PROMOTION, package.json
- **Pre-commit hook** re-stages all count-sync files on drift
- **`create-skill`** body split — detail in `references/authoring-guide.md` (<500 lines)

---

## [1.2.7] — 2026-06-17

### Added

- **`composer-2.5-execution.mdc`** rule (`alwaysApply: true`) — execution-time guardrails for Composer 2.5 when implementing an approved `plan-*.md`: anti-reward-hacking, anti-feature-deletion, checkpointing, context + terminal discipline, STOP-and-ask on auth/RLS/secrets/payments/migrations
- Documents the two-model workflow (strong model plans, Composer 2.5 executes) in README and `docs/PLAN-LOOPS.md`

### Changed

- Project rules count: 8 → **9**

---

## [1.2.6] — 2026-06-17

### Added

- **`plan-test-coverage`** — user-story-driven coverage audit, traceability matrix, fake-green detection (plan only)
- **`docs/PLAN-LOOPS.md`** — six-skill plan loop: link, chain, prompts, execution mapping

### Changed

- Six-skill plan loop (was five): adds `plan-test-coverage` after stub-checker, before perf/security

---

## [1.2.5] — 2026-06-17

### Added

- **`plan-docs-sync`** — docs drift audit vs code truth; onboarding-drift checks; docs-as-code guardrails (plan only)
- **`plan-perf-audit`** — measure-don't-guess perf audit across web/mobile/backend/data; Lighthouse CI + RUM guardrails (plan only)
- **`plan-security-audit`** — OWASP + Supabase-first (RLS, service_role scan); no destructive testing; secrets location-only (plan only)
- Five-skill plan loop documented in `skill-workflows` and CATALOG

---

## [1.2.4] — 2026-06-17

### Added

- **`plan-stub-checker`** — exhaustive stub/dead-button/fake-component/unwired-handler audit with burndown and phased wiring plan (plan only; no implementation until user approves)

---

## [1.2.3] — 2026-06-16

### Added

- **`plan-uiux-unification`** — exhaustive non-destructive UI/UX + design-system audit that outputs burndown, unification plan, and phased roadmap (plan only; no fixes until user approves)

---

## [1.2.2] — 2026-06-16

### Changed

- **Playwright test skills:** shared signed-in session reuse (Google OAuth, etc.) and multi-agent tab discipline — no fighting over the same browser tab
- New reference: `protocol-browser-anti-stall/references/playwright-session-coordination.md`
- Updated: `test-playwright`, `test-qa`, `test-red-team`, `protocol-browser-anti-stall`

---

## [1.2.1] — 2026-06-12

### Fixed

- npm CI publish: use OIDC trusted publishing (remove empty `NPM_TOKEN` that blocked auth)

---

## [1.2.0] — 2026-06-12

### Added (13 skills since v1.1.0)

- **Red team & quality:** `test-red-team`, `workflow-quality-gate`
- **Post-launch & shipping:** `iterate-post-launch`, `workflow-launch-ready`, `workflow-feature-flag`
- **Enhance & audit:** `enhance-web-seo`, `enhance-pwa`, `audit-bundle-size`, `audit-i18n`, `design-email`
- **Bundled workflows:** `workflow-build-feature`, `workflow-fix-and-ship`, `workflow-onboard`
- **Routing rule:** `rules/skill-workflows.mdc` — capabilities catalog with skill-chaining diagram

### Changed

- Skill count: 60 → **73**
- `test-red-team` trimmed to stay under 500-line spec limit
- `.gitignore`: ignore `.playwright-mcp/` and `.qa-screenshots/` scratch artifacts

### Install

```bash
npx skills add kensaurus/cursor-kenji
# or
npx @kensaurus/cursor-kenji@1.2.0
```

---

## Jun 2026 — Bundled Workflows, Gap-Filling, & Verbosity Trim

### New Bundled Workflow Skills

Orchestrator skills that chain multiple individual skills into a single tracked loop. Inspired by community patterns from `darthlinuxer/Agentic-Skills`, `kscius/KS-Cursor-Orchestrator`, and the Anthropic agent skills ecosystem.

| Skill | What it chains |
|:------|:--------------|
| `workflow-build-feature` | spec → TDD → unit tests → smoke test → PR |
| `workflow-fix-and-ship` | debug → root cause → fix → regression test → smoke → PR → deploy |
| `workflow-quality-gate` | red-team → security → bundle → perf → unit tests → go/no-go verdict |
| `workflow-launch-ready` | SEO + PWA + bundle + i18n + quality gate + deploy smoke + iterate |
| `workflow-onboard` | First-contact orientation — reads codebase, produces 5-minute briefing |

### New `.cursor/rules/skill-workflows.mdc`

Always-on routing index that routes intent to bundled workflows vs individual skills, with a full skill-chaining diagram. Reduces the cognitive load of "which skill do I use?" to a single lookup.

### Improvements

- `test-red-team` trimmed from 515 → 417 lines: security priority table replaced verbose prose sections; Playwright quick-ref removed (already in platform docs).

---

## Jun 2026 — Post-Launch Iteration & Shipping-Quality Skills

### New Skills

| Skill | Why |
|:------|:----|
| `iterate-post-launch` | Closes the post-ship improvement loop — pulls Sentry errors, Supabase slow-query advisors, and live Playwright walkthrough into a ranked backlog, implements fixes, and verifies them against the live app. |
| `enhance-web-seo` | Audits and fixes SEO for any web app: meta tags, OG/Twitter cards, JSON-LD structured data, robots.txt, sitemap, canonical URLs, heading hierarchy, Core Web Vitals. Applies fixes and verifies with Playwright. |
| `audit-bundle-size` | Finds and eliminates JS bundle bloat: detects bundler (Vite/Webpack/Next.js), runs production build with analysis, identifies large chunks/duplicate deps/missing lazy splits, and maps every finding to a specific import. |
| `enhance-pwa` | Adds or upgrades PWA features: Web App Manifest, Workbox service worker with per-asset caching strategies, install prompt, push notifications, offline page. Capacitor-compatible. Lighthouse PWA audit before/after. |
| `workflow-feature-flag` | Feature-flag rollout discipline: design flag contract, gate the feature, stage at 0%→internal→5%→100%, monitor Sentry error rate and Supabase logs at each stage, promote or roll back, then clean up the flag from code. |
| `audit-i18n` | i18n audit with emphasis on **human-readable, natural-sounding copy** — not machine-translated jargon. Finds hardcoded strings, checks translation completeness, rewrites stiff/literal copy to sound like a real person in each locale, fixes date/number/currency formatting. |
| `design-email` | Full-stack transactional email: React Email templates with dark mode, mobile-first layout, inline styles, and copy that sounds like a person wrote it. Covers SPF/DKIM/DMARC deliverability, Resend/SendGrid/SES integration, and Supabase Edge Function triggers. |

---

## Jun 2026 — Adversarial Red-Team Skill

### New Skills

| Skill | Why |
|:------|:----|
| `test-red-team` | Adversarial full-app sweep — feature-first coverage matrix (feature → surfaces → components+states) attacked across 4 dimensions: UI/UX, data pipeline, security (OWASP Top 10 + MASVS), and performance. Drives Playwright browser MCP for web/PWA, Playwright Android WebView attach for Capacitor hybrid apps, and adb tap-walk for native chrome. Cross-references Sentry for production telemetry, Supabase for DB-layer truth and RLS verification, and Firecrawl for current OWASP/MASVS guidance. Produces a severity-ranked defect list with repro steps, evidence, and launch-readiness verdict. Ships with a `references/owasp-attack-checklist.md` payload library covering XSS, SQLi, IDOR, MASVS-PLATFORM, auth attacks, and 2026 performance thresholds. |

---

## Jun 2026 — Installer hardening + spec compliance

### Installer (`bin/install.mjs`)

- **Fixed a shipped bug:** the installer only copied subdirectories, silently
  dropping every top-level `.md`/`.mdc` file — `npx` installs landed 0 subagents,
  only 1 of 14 commands, and no rules files. It now copies files and directories.
- **`--clean` / `--mirror`** — make `~/.cursor` exactly mirror this repo (no
  overlap/duplicates); takes a timestamped backup first (`--no-backup` to skip).
- **`--restore [stamp]`** — restore a previous `--clean` backup.
- **`--only <csv>`** and **`--skill <name>`** — partial installs.
- **`--link`** — dev mode: symlink (junction on Windows) instead of copy.
- MCP template is written only when missing and never overwrites existing keys.

### Quality gates

- `scripts/validate-skills.mjs` — validates every skill against the
  [Agent Skills spec](https://agentskills.io/specification): frontmatter present,
  `name` matches its directory, `description` ≤ 1024 chars, body length warnings.
- `scripts/test-install.mjs` — install smoke test (would have caught the bug above).
- Both run in the pre-commit hook, a new cross-OS `validate` workflow, and before
  `npm publish`.
- Trimmed 4 over-long skill descriptions to ≤ 1024 chars (`audit-ux`,
  `enhance-web-ui`, `enhance-web-ux`, `enhance-capacitor-ui`).
- Added `.gitattributes` to normalize line endings (LF) across machines.

---

## Jun 2026 — Anti-Vibe-Coding Spine + Taste Skills

### New Skills

| Skill | Why |
|:------|:----|
| `workflow-spec-workflow-spec-tdd` | The anti-vibe-coding spine — brainstorm → spec → plan → RED/GREEN/REFACTOR TDD → self-review before "done". Adapted from [obra/superpowers](https://github.com/obra/superpowers) |
| `mobile-mobile-capacitor-platform` | Capacitor platform + pipeline depth — plugins, OTA, deep links, push, native CI, store submission + Apple preflight, security scan, migrations. From [cap-go/capgo-skills](https://github.com/cap-go/capgo-skills) |
| `mobile-mobile-rn-performance` | React Native perf/build/upgrade depth — FPS, Hermes, TTI, bundle size, FlashList, Reanimated, Turbo Modules, 16KB alignment, RN/Expo version upgrades. From [callstack/agent-skills](https://github.com/callstackincubator/agent-skills) |
| `data-pipeline` | Build-time data-pipeline correctness — idempotency, atomic writes, 4-layer staging, windowed backfills, dead-letter, observability. For ETL / edge-function workers / `pg_cron` / queues |
| `backend-observability` | Build-time observability + logging — error↔trace↔log correlation, structured leveled logs, PII/secret redaction, OTel spans, LLM trace capture, alert/SLO design. Vendor-neutral (Sentry + Langfuse + OTel) |
| `enhance-web-landing` | Anti-slop frontend for landing pages, portfolios, and marketing sites — brief inference, variance/motion/density dials. From [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `enhance-web-redesign` | Audit-first upgrade of existing sites — 60-second AI-tell triage, then scan/diagnose/fix generic AI patterns without breaking functionality |
| `enhance-web-web3d` | Audit-first 3D/WebGL + GSAP cinematic-motion elevation of an existing web app (Three.js / R3F + ScrollTrigger + Motion / React Spring). From [freshtechbro/claudedesignskills](https://github.com/freshtechbro/claudedesignskills) |

### Family Rename

`enhance-page-ui` → `enhance-web-ui`, `enhance-page-ux` → `enhance-web-ux`, `enhance-screen-rn` → `mobile-rn-screen`, `enhance-web-mobile-ui` → `enhance-capacitor-ui`. New `enhance-<surface>-<aspect>` convention + a surface-router block added to every enhance skill.

---

## May 2026 — PDCA Browser Testing, npm Release, Native RN Loop

### New Skills

| Skill | Why |
|:------|:----|
| `test-playwright` | Closes the PDCA loop after you ship a change. Drives the live localhost app through the Playwright MCP manually like a real user, and **fixes** pain points/errors as it goes (full-stack: UI/UX + API + DB). Red-teams the work and suggests enhancements |
| `deploy-npm` | End-to-end release workflow for a Changesets + GitHub Actions + npm Trusted Publisher (OIDC) monorepo — green CI → merge release PR → resolve the `github-actions[bot]` anti-loop → dispatch publish → verify on npm and GitHub Releases |
| `mobile-emulator-start` | Boots Metro + Android emulator in the correct order — kills duplicate ports, picks fresh-cache vs fast-iteration, defaults to 1080×4000 for tall QA screenshots, polls `/status` before deeplink to avoid "Cannot connect to Expo CLI" races |
| `enhance-capacitor-ui` | Cross-surface architecture for hybrid PWA + iOS + Android apps. Three orthogonal axes (form factor / platform / pointer) so polish on one surface can't degrade another |

### New Rules

| Rule | Why |
|:-----|:----|
| `full-stack-ship-discipline.mdc` | `alwaysApply: true` — prevents the "local migration file never deployed" failure mode. Forces UI tasks to inventory backend deps in the same chat, deploy via Supabase MCP, and verify against the remote DB |
| `shell-first-search.md` | Workspace-wide rule routing routine search to `Shell` (`grep`/`find`/`ls`) instead of `Grep`/`Glob` tools, which can hang for minutes on some Windows hosts |

### Housekeep Pass

- 11 skills renamed so `name:` frontmatter matches folder names per Cursor spec
- 22 descriptions tightened to direct-tone single-sentence WHAT + concrete trigger list
- 9 commands demoted to skill pointers (no more duplicated playbook)

---

## Apr 2026 — The Enhance Family

| Skill | Why |
|:------|:----|
| `enhance-web-ui` | Composition over decoration — fix hierarchy, grouping, spacing, motion. NN/g + Laws of UX grounded |
| `enhance-web-ux` | Replace generic "stacked" UI with semantic data. Every change cites a Nielsen heuristic, uses existing primitives, verified at 3 viewports via browser MCP |
| `enhance-readme` | Theme-aware hero + tour grid + optional animated GIF via Playwright MCP |
| `audit-ux` | Deep UX audit grounded in NN/g 10 heuristics, Laws of UX, Intuit Content Design, Google HEART |
| `split-to-prs` *(Cursor Skill)* | Slice a single chat / branch / PR into small reviewable PRs with safe snapshot |
| `canvas` *(Cursor Skill)* | Live React canvas beside chat — updated with refreshed SDK primitives |

---

## Earlier 2026

| Addition | Type |
|:---------|:-----|
| `create-hook` | Skill |
| `workflow-spec-workflow-spec-tdd` | Skill |
| `workflow-spec-tdd` | Skill |
| `workflow-workflow-parallel-agents` | Skill |
| `audit-code-review` | Skill |
| 20 new skills (audits, debugging, deploy verification, file handling, PRD, QA, housekeeping) | Skills |
| 6 new cursor-skills (babysit, canvas, create-hook, shell, statusline, update-cli-config) | Cursor Skills |
| `/plan`, `/pr`, `/debug` | Commands |
