# Trigger Cheat Sheet

Say any phrase in the left column → the skill in the right column fires.

You don't have to type the skill name. Just describe the task in plain language.

---

## Bundled workflows (start here for multi-phase tasks)

| Say this in chat | Skill |
|:-----------------|:------|
| "build a feature", "implement this", "add X end-to-end", "ship a new capability" | `workflow-build-feature` |
| "fix this bug and ship it", "patch this and close the ticket", "fix and deploy" | `workflow-fix-and-ship` |
| "is this ready to ship?", "quality gate", "pre-release checklist", "ship-readiness" | `workflow-quality-gate` |
| "prepare for launch", "launch week", "everything before going live", "pre-launch sweep" | `workflow-launch-ready` |
| "I'm new to this repo", "orient me", "explain this codebase", "onboard me" | `workflow-onboard` |

---

## Audits & code quality

| Say this in chat | Skill |
|:-----------------|:------|
| "audit accessibility", "WCAG audit", "check a11y", "check keyboard nav" | `audit-accessibility` |
| "reduce bundle size", "why is the bundle so big", "tree shaking", "code splitting" | `audit-bundle-size` |
| "code smell", "anti-pattern", "naming conventions", "tech debt" | `audit-code-quality` |
| "code review", "review this PR", "review this function" | `audit-code-review` |
| "audit database schema", "check my DB design", "naming conventions in DB" | `audit-db-schema` |
| "audit my API calls", "check frontend API", "FE-BE contract" | `audit-fe-api` |
| "audit i18n", "fix translations", "the Japanese feels like Google Translate", "hardcoded strings" | `audit-i18n` |
| "audit LLM", "check Langfuse", "audit prompts", "check AI quality", "check traces" | `audit-langfuse-llm` |
| "performance audit", "optimize performance", "slow page", "Web Vitals" | `audit-performance` |
| "audit security", "check for vulnerabilities", "OWASP", "security review" | `audit-security` |
| "audit design system", "check token compliance", "design consistency" | `audit-uiux-design-system` |
| "UX audit", "usability review", "heuristic evaluation", "UX quality" | `audit-ux` |

---

## Backend & data

| Say this in chat | Skill |
|:-----------------|:------|
| "slow query", "add index", "N+1", "database timeout", "optimize query" | `backend-db-performance` |
| "error handling", "error boundary", "try/catch", "error state", "toast notification" | `backend-error-handling` |
| "add logging", "instrument this", "why can't I debug prod", "set up alerts" | `backend-observability` |
| "API design", "backend architecture", "caching", "queues", "microservices" | `backend-patterns` |
| "real-time", "live updates", "WebSocket", "chat", "collaborative", "presence" | `backend-realtime` |
| "build a pipeline", "sync X into Y", "nightly aggregation", "cron double-counts", "dedupe" | `data-pipeline` |
| "chart", "graph", "dashboard", "analytics", "D3", "Recharts", "data visualization" | `data-visualization` |

---

## Debugging

| Say this in chat | Skill |
|:-----------------|:------|
| "debug this error", "fix this bug", "something isn't working" | `debug-error` |
| "API error", "4xx/5xx", "frontend-backend mismatch", "request is wrong" | `debug-fe-be-integration` |
| "check Sentry", "fix Sentry errors", "triage errors", "production errors" | `debug-sentry-monitor` |

---

## Deploying & releasing

| Say this in chat | Skill |
|:-----------------|:------|
| "publish to npm", "release", "cut a release", "ship a new version" | `deploy-npm` |
| "verify deploy", "post-deploy check", "smoke test production", "ship or rollback" | `deploy-verify` |
| "post-launch polish", "what should I fix next", "iterate on prod feedback", "make it better based on real usage" | `iterate-post-launch` |

---

## Design & UI creation

| Say this in chat | Skill |
|:-----------------|:------|
| "design an API", "create endpoints", "REST API design", "GraphQL schema" | `design-api` |
| "create a poster", "design an infographic", "make a banner", "social graphic" | `design-canvas` |
| "build an email template", "transactional email", "welcome email", "why is my email in spam" | `design-email` |
| "build a component", "new UI page", "make this look good" | `design-frontend` |
| "generative art", "creative coding", "flow fields", "particle system" | `design-generative-art` |
| "mobile design", "responsive layout", "touch UI", "small screen" | `design-mobile-first` |
| "animation", "micro-interaction", "hover effect", "scroll animation" | `design-motion` |
| "write a PRD", "product requirements", "spec this feature", "what should we build" | `design-prd` |
| "UI/UX unification plan", "design system audit plan", "UI burndown", "unify design system", "plan UI overhaul", "audit UI without fixing" | `plan-uiux-unification` |
| "find dead buttons", "stub checker", "fake components", "unwired handlers", "dead links", "buttons that do nothing", "stub audit" | `plan-stub-checker` |
| "docs drift", "sync docs with code", "stale README", "onboarding docs broken", "phantom docs" | `plan-docs-sync` |
| "performance audit plan", "perf burndown", "measure before optimize", "plan performance improvements" | `plan-perf-audit` |
| "security audit plan", "OWASP audit", "RLS audit", "Supabase security review", "hardening plan" | `plan-security-audit` |
| "design system", "component library", "design tokens", "theming" | `design-system` |
| "apply brand colors", "consistent styling", "color palette", "apply theme" | `design-theme` |

---

## Documentation

| Say this in chat | Skill |
|:-----------------|:------|
| "help me write a spec", "co-author a doc", "write a proposal", "draft an RFC" | `docs-coauthor` |
| "write a README", "document this API", "write docs", "create documentation" | `docs-writer` |

---

## Enhancing existing UI/UX

| Say this in chat | Skill |
|:-----------------|:------|
| "make this Capacitor/Ionic app work on all screen sizes" | `enhance-capacitor-ui` |
| "make it a PWA", "offline support", "service worker", "install prompt", "add to home screen" | `enhance-pwa` |
| "improve my README", "add screenshots to README", "make README prettier" | `enhance-readme` |
| "improve SEO", "add meta tags", "sitemap", "Open Graph", "Google indexing", "rich results" | `enhance-web-seo` |
| "make this landing page look premium", "anti-slop design", "portfolio design" | `enhance-web-landing` |
| "redesign this page", "remove AI slop", "make this look hand-crafted" | `enhance-web-redesign` |
| "make this page nicer", "better layout", "improve spacing", "polish UI" | `enhance-web-ui` |
| "improve UX", "this page feels bad", "fix user flow", "better information density" | `enhance-web-ux` |
| "add 3D", "WebGL hero", "Three.js scene", "cinematic scroll", "GSAP animation" | `enhance-web-web3d` |

---

## Meta (skill & MCP authoring)

| Say this in chat | Skill |
|:-----------------|:------|
| "build an MCP server", "integrate external API into Cursor" | `meta-mcp-builder` |
| "create a skill", "write a SKILL.md", "how do I make a skill" | `meta-skill-creator` |

---

## Mobile (React Native & Capacitor)

| Say this in chat | Skill |
|:-----------------|:------|
| "Capacitor push notifications", "deep linking", "OTA update", "App Store submission" | `mobile-capacitor-platform` |
| "start emulator", "boot Metro", "Android emulator", "Expo dev-client" | `mobile-emulator-start` |
| "test on emulator", "QA Android build", "white screen", "adb reverse" | `mobile-emulator-test` |
| "React Native jank", "frame drops", "slow startup", "RN bundle too big" | `mobile-rn-performance` |
| "polish this RN screen", "this iOS screen looks off", "fix RN layout" | `mobile-rn-screen` |

---

## Protocol & guardrails

| Say this in chat | Skill |
|:-----------------|:------|
| "browser automation", "Playwright", "page navigation" (as pre-session setup) | `protocol-browser-anti-stall` |

---

## Testing & QA

| Say this in chat | Skill |
|:-----------------|:------|
| "test this with Playwright", "test like a real user", "PDCA this" | `test-playwright` |
| "QA the app", "find bugs", "test before release", "smoke test" | `test-qa` |
| "red team this app", "attack my app", "break it", "find all the defects", "pre-launch hardening" | `test-red-team` |
| "write unit tests", "add test coverage", "write tests for this function" | `test-unit` |

---

## Workflow & dev process

| Say this in chat | Skill |
|:-----------------|:------|
| "think before coding", "simplicity first", "stop overcomplicating" | `workflow-coding-discipline` |
| "add a feature flag", "gradual rollout", "kill switch", "dark launch", "canary release" | `workflow-feature-flag` |
| "commit my changes", "write a commit message" | `workflow-git-commit` |
| "clean up the repo", "update README", "update dependencies", "remove dead code" | `workflow-housekeep` |
| "I'm new to this repo", "orient me", "explain this codebase", "catch me up" | `workflow-onboard` |
| "run agents in parallel", "best-of-N", "compare approaches", "multi-model" | `workflow-parallel-agents` |
| "create a PR", "write pull request", "manage PR review", "merge PR" | `workflow-pr` |
| "refactor this", "clean up code", "reduce duplication", "improve readability" | `workflow-refactor` |
| "build this properly", "spec first", "TDD", "stop vibe-coding" | `workflow-spec-tdd` |
