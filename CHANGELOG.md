# Changelog

All notable additions and changes to cursor-kenji are listed here.

---

## Jun 2026 — Anti-Vibe-Coding Spine + Taste Skills

### New Skills

| Skill | Why |
|:------|:----|
| `workflow-spec-tdd` | The anti-vibe-coding spine — brainstorm → spec → plan → RED/GREEN/REFACTOR TDD → self-review before "done". Adapted from [obra/superpowers](https://github.com/obra/superpowers) |
| `capacitor-platform` | Capacitor platform + pipeline depth — plugins, OTA, deep links, push, native CI, store submission + Apple preflight, security scan, migrations. From [cap-go/capgo-skills](https://github.com/cap-go/capgo-skills) |
| `rn-performance` | React Native perf/build/upgrade depth — FPS, Hermes, TTI, bundle size, FlashList, Reanimated, Turbo Modules, 16KB alignment, RN/Expo version upgrades. From [callstack/agent-skills](https://github.com/callstackincubator/agent-skills) |
| `data-pipeline` | Build-time data-pipeline correctness — idempotency, atomic writes, 4-layer staging, windowed backfills, dead-letter, observability. For ETL / edge-function workers / `pg_cron` / queues |
| `observability-instrumentation` | Build-time observability + logging — error↔trace↔log correlation, structured leveled logs, PII/secret redaction, OTel spans, LLM trace capture, alert/SLO design. Vendor-neutral (Sentry + Langfuse + OTel) |
| `enhance-web-landing` | Anti-slop frontend for landing pages, portfolios, and marketing sites — brief inference, variance/motion/density dials. From [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `enhance-web-redesign` | Audit-first upgrade of existing sites — 60-second AI-tell triage, then scan/diagnose/fix generic AI patterns without breaking functionality |
| `enhance-web-web3d` | Audit-first 3D/WebGL + GSAP cinematic-motion elevation of an existing web app (Three.js / R3F + ScrollTrigger + Motion / React Spring). From [freshtechbro/claudedesignskills](https://github.com/freshtechbro/claudedesignskills) |

### Family Rename

`enhance-page-ui` → `enhance-web-ui`, `enhance-page-ux` → `enhance-web-ux`, `enhance-screen-rn` → `enhance-rn-screen`, `enhance-web-mobile-ui` → `enhance-capacitor-ui`. New `enhance-<surface>-<aspect>` convention + a surface-router block added to every enhance skill.

---

## May 2026 — PDCA Browser Testing, npm Release, Native RN Loop

### New Skills

| Skill | Why |
|:------|:----|
| `test-playwright` | Closes the PDCA loop after you ship a change. Drives the live localhost app through the Playwright MCP manually like a real user, and **fixes** pain points/errors as it goes (full-stack: UI/UX + API + DB). Red-teams the work and suggests enhancements |
| `deploy-npm` | End-to-end release workflow for a Changesets + GitHub Actions + npm Trusted Publisher (OIDC) monorepo — green CI → merge release PR → resolve the `github-actions[bot]` anti-loop → dispatch publish → verify on npm and GitHub Releases |
| `start-emulator` | Boots Metro + Android emulator in the correct order — kills duplicate ports, picks fresh-cache vs fast-iteration, defaults to 1080×4000 for tall QA screenshots, polls `/status` before deeplink to avoid "Cannot connect to Expo CLI" races |
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
| `hooks-builder` | Skill |
| `tdd` | Skill |
| `spec-writing` | Skill |
| `parallel-agents` | Skill |
| `audit-code-review` | Skill |
| 20 new skills (audits, debugging, deploy verification, file handling, PRD, QA, housekeeping) | Skills |
| 6 new cursor-skills (babysit, canvas, create-hook, shell, statusline, update-cli-config) | Cursor Skills |
| `/plan`, `/pr`, `/debug` | Commands |
