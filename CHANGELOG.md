# Changelog

All notable additions and changes to cursor-kenji are listed here.

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
