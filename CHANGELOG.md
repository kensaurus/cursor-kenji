# Changelog

All notable additions and changes to cursor-kenji are listed here.

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
