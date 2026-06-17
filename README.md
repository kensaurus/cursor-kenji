<p align="center">
  <img src="https://img.shields.io/badge/Cursor_AI-Skills_&_Tools-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0ibTEyIDMtMS45IDEyLjRMMTguMSA2LjYgMi4yIDEzLjRsMTEuNSAxLjFMNy45IDIxeiIvPjwvc3ZnPg==&logoColor=white" alt="Cursor AI Skills" />
</p>

<h1 align="center">cursor-kenji</h1>

<p align="center">
  <strong>Every Cursor AI workflow you'd build yourself — already built.</strong><br/>
  61 agent skills · 13 slash commands · 16 MCP servers · 12 Cursor extensions · 5 subagents
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@kensaurus/cursor-kenji"><img src="https://img.shields.io/npm/v/@kensaurus/cursor-kenji?style=flat-square&color=cb3837&logo=npm" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@kensaurus/cursor-kenji"><img src="https://img.shields.io/npm/dm/@kensaurus/cursor-kenji?style=flat-square&color=cb3837&logo=npm" alt="npm downloads" /></a>
  <img src="https://img.shields.io/github/license/kensaurus/cursor-kenji?style=flat-square&color=444" alt="License" />
  <img src="https://img.shields.io/github/stars/kensaurus/cursor-kenji?style=flat-square&color=f59e0b" alt="Stars" />
  <a href="CHANGELOG.md"><img src="https://img.shields.io/badge/changelog-Jun_2026-6366f1?style=flat-square" alt="Latest" /></a>
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Next.js-15-000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/Supabase-Latest-3fcf8e?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

---

**cursor-kenji** is a production-ready toolkit of 61 Cursor agent skills, 13 slash commands, and 5 pre-built subagents for React / Next.js / Supabase development. Install once — the agent picks the right skill automatically.

---

## 30-second install

```bash
npx skills add kensaurus/cursor-kenji
```

That's it. Restart Cursor. Done. The agent now has 61 skills it picks automatically.

> No Cursor? **[Download Cursor free](https://cursor.com)** (it's VS Code with AI built in).
> Don't have `skills`? Run `npm install -g skills` first, or use the manual install below.

---

## Quick Start

> New to Cursor? Read [docs/GETTING-STARTED.md](docs/GETTING-STARTED.md) — plain-language walkthrough.

### Via skills.sh (recommended)

```bash
npx skills add kensaurus/cursor-kenji
```

Installs all 61 skills to `~/.cursor/skills/` (or `~/.agents/skills/`) automatically.

Also install [Mushi Mushi skills](https://github.com/kensaurus/mushi-mushi) for bug-report triage + fix dispatch from inside Cursor:
```bash
npx skills add kensaurus/mushi-mushi
```

### Via npm (`npx @kensaurus/cursor-kenji`)

The npm installer copies skills, commands, agents, and rules into `~/.cursor/`. It
has two modes:

```bash
npx @kensaurus/cursor-kenji            # merge: add/overwrite this repo's items, keep your others
npx @kensaurus/cursor-kenji --clean    # mirror: make ~/.cursor EXACTLY match this repo
npx @kensaurus/cursor-kenji --dry-run  # preview without changing anything
```

- **merge** (default) — overwrites same-named items and leaves everything else in
  `~/.cursor` untouched. Safe for a shared machine with skills from other sources.
- **`--clean` / mirror** — wipes `~/.cursor/{skills,commands,agents,rules}` so they
  contain *only* what this repo ships (no overlap, no duplicates). Your previous
  contents are backed up to `~/.cursor/.cursor-kenji-backups/<timestamp>/` first
  (add `--no-backup` to skip). `mcp.json` is never touched, so your API keys are safe.

Advanced flags:

```bash
npx @kensaurus/cursor-kenji --only skills,commands   # install a subset of groups
npx @kensaurus/cursor-kenji --skill audit-ux         # install a single skill
npx @kensaurus/cursor-kenji --link                   # dev mode: symlink instead of copy
npx @kensaurus/cursor-kenji --restore                # restore the latest --clean backup
```

- **`--skill <name>`** mirrors `npx skills add … --skill <name>` for one-off installs.
- **`--link`** symlinks the repo into `~/.cursor` (junctions on Windows) so edits to
  skills show up live — ideal when authoring skills in this repo. Files that can't be
  symlinked without elevated rights fall back to a copy automatically.
- **`--restore [timestamp]`** copies a snapshot from
  `~/.cursor/.cursor-kenji-backups/` back into place (latest if omitted).

From a clone, the same operations are available as npm scripts:

```bash
npm run install:cursor            # merge
npm run install:cursor:clean      # mirror (with backup)
npm run install:cursor:dry        # preview merge
npm run install:cursor:clean:dry  # preview mirror
npm run install:cursor:link       # dev mode (symlink)
npm run install:cursor:restore    # restore latest backup
npm test                          # validate spec + skill count + install smoke test
```

> **Authoring skills?** Every skill is validated against the
> [Agent Skills spec](https://agentskills.io/specification) (`npm run validate:skills`):
> frontmatter present, `name` matches the directory, `description` ≤ 1024 chars (it's
> the always-in-context trigger), and SKILL.md body < 500 lines (move detail to
> `references/`). For slash-command-only behavior set `disable-model-invocation: true`;
> to auto-scope a skill to a subtree use the `paths` frontmatter field.

### Manual install

```bash
git clone https://github.com/kensaurus/cursor-kenji.git
cd cursor-kenji
./install.sh
```

<details>
<summary>Or one-liner (curl)</summary>

```bash
curl -sSL https://raw.githubusercontent.com/kensaurus/cursor-kenji/main/install.sh | bash
```

</details>

**After install:**
1. Restart Cursor to pick up skills
2. Edit `~/.cursor/mcp.json` — replace `YOUR_*` placeholders with real keys
3. Try it: describe any task in chat. Skills auto-trigger from keywords.
4. Optional: `source ~/cursor-kenji/shell-aliases/cursor-helpers.sh`

**Keep it fresh:** `npx skills add kensaurus/cursor-kenji` (or `cd ~/cursor-kenji && git pull && ./install.sh`)

---

## What's Inside

| | Count | What it does |
|:--|------:|:-------------|
| **Skills** | 60 | Auto-triggering agent capabilities (audits, enhance, debug, test, build) |
| **Cursor Skills** | 12 | IDE-specific tools (canvas, hooks, rules, PR splitter) |
| **Commands** | 13 | Slash commands for repeatable workflows (`/commit`, `/pr`, `/research`) |
| **Subagents** | 5 | Background autonomous agents (code-reviewer, debugger, db-migrator…) |
| **MCP Servers** | 16 | External integrations: Supabase · GitHub · Sentry · Playwright · AWS · Slack |
| **Project Rules** | 9 | Drop-in `.mdc` files for any project's `.cursor/rules/` |
| **Notepads** | 2 | Reusable context templates (architecture, design tokens) |
| **Shell Aliases** | 8 | Terminal shortcuts (`newskill`, `cursor-sync`, `gc`, `gp`) |

---

## The Improvement Loop

> **Skills chain. Chains loop. Each loop pass levels up your codebase.**
> The arc repeats: **Understand → Clean → Measure → Plan → Change → Verify → Ship**.

```mermaid
flowchart LR
  U["Understand<br/>workflow-onboard · /research"] --> C["Clean<br/>workflow-housekeep"]
  C --> M["Measure<br/>audit-code-quality<br/>audit-security · audit-performance"]
  M --> P["Plan<br/>/plan"]
  P --> CH["Change<br/>workflow-spec-tdd<br/>workflow-refactor"]
  CH --> V["Verify<br/>test-playwright · test-unit<br/>code-reviewer"]
  V --> S["Ship<br/>/commit → /pr · deploy-verify"]
  S -. "next slice" .-> M

  style U fill:#064e3b,stroke:#10b981,color:#d1fae5
  style C fill:#1e293b,stroke:#64748b,color:#e2e8f0
  style M fill:#3b0764,stroke:#a78bfa,color:#ede9fe
  style P fill:#064e3b,stroke:#10b981,color:#d1fae5
  style CH fill:#78350f,stroke:#fbbf24,color:#fef3c7
  style V fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style S fill:#1e3a5f,stroke:#60a5fa,color:#dbeafe
```

**Trigger the full loop in one message:**

```
"Research this repo, housekeep dead code and stale deps, audit code quality +
security + performance, plan the top 10 findings by impact, refactor the worst
offenders behind tests, verify with Playwright like a real user, then open a PR."
```

**Or step through it stage-by-stage** — review each diff before continuing:

| Stage | Skill / Command | Say this in Cursor |
|:------|:---------------|:-------------------|
| Understand | `workflow-onboard` · `/research` | *"onboard me to this codebase"* |
| Clean | `workflow-housekeep` | *"housekeep — dead files, README sync, update deps"* |
| Measure | `audit-code-quality` `audit-security` `audit-performance` | *"audit code quality, security, and performance"* |
| Plan | `/plan` | *"/plan — rank findings by impact × effort, pick top 5"* |
| Change | `workflow-spec-tdd` → `workflow-refactor` | *"refactor [finding] behind tests"* |
| Verify | `test-playwright` · `test-unit` · `code-reviewer` | *"test this with Playwright like a real user"* |
| Ship | `/commit` → `/pr` → `deploy-verify` | *"/pr"* |
| Repeat | → back to Measure | Tighter scope, compounding quality |

See [Skill Chaining](#skill-chaining----improve--iterate-any-repo) below for ready-to-run chain recipes, and **[docs/PLAN-LOOPS.md](docs/PLAN-LOOPS.md)** for the six-skill **plan-only** loop (audit → approve → execute).

### Six-skill plan loop (audit only — approve before each execution phase)

For inherited codebases or pre-launch hardening. **Nothing changes until you approve.**

```mermaid
flowchart LR
  UI["plan-uiux-unification"]
  ST["plan-stub-checker"]
  TC["plan-test-coverage"]
  PF["plan-perf-audit"]
  SC["plan-security-audit"]
  DS["plan-docs-sync"]

  UI --> ST --> TC
  TC --> PF
  TC --> SC
  PF --> DS
  SC --> DS

  style UI fill:#3b0764,stroke:#a78bfa,color:#ede9fe
  style ST fill:#78350f,stroke:#fbbf24,color:#fef3c7
  style TC fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style PF fill:#1e3a5f,stroke:#60a5fa,color:#dbeafe
  style SC fill:#7f1d1d,stroke:#f87171,color:#fee2e2
  style DS fill:#064e3b,stroke:#10b981,color:#d1fae5
```

| Step | Skill | Plans |
|:----:|:------|:------|
| 1 | `plan-uiux-unification` | IA, design-system burndown |
| 2 | `plan-stub-checker` | Dead buttons, fake data, unwired handlers |
| 3 | `plan-test-coverage` | Story→test matrix, fake-green gaps |
| 4 | `plan-perf-audit` ∥ `plan-security-audit` | Measured perf + OWASP/RLS |
| 5 | `plan-docs-sync` | Docs drift (run **last**) |

**One-shot prompt (plan only):**

```
Run the six-skill plan loop — no code/doc/test changes until I approve:
plan-uiux-unification → plan-stub-checker → plan-test-coverage →
plan-perf-audit + plan-security-audit (parallel) → plan-docs-sync.
Consolidated burndown report at the end.
```

Full prompts, slash aliases (`/uiux-plan`, `/stub-plan`, `/test-plan`, …), and execution mapping → **[docs/PLAN-LOOPS.md](docs/PLAN-LOOPS.md)**

---

## How It All Fits Together

```mermaid
graph TB
  subgraph TOOLKIT["cursor-kenji Toolkit"]
    direction TB
    SK["Skills (79)"]
    CS["Cursor Skills (12)"]
    CMD["Commands (13)"]
    SA["Subagents (5)"]
    MCP["MCP Servers (16)"]
    RULES["Project Rules (9)"]
    NP["Notepads (2)"]
  end

  CURSOR["Cursor IDE"]
  YOU["You"]

  YOU -->|"types /command"| CMD
  YOU -->|"describes task"| SK
  YOU -->|"triggers keyword"| SA
  CURSOR -->|"auto-selects"| SK
  CURSOR -->|"auto-delegates"| SA
  CMD -->|"orchestrates"| SK
  SK -->|"calls"| MCP
  SA -->|"uses"| SK
  SA -->|"calls"| MCP
  RULES -->|"guides"| CURSOR
  NP -->|"provides context"| CURSOR
  CS -->|"extends"| CURSOR

  style TOOLKIT fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#e0e7ff
  style CURSOR fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#e0f2fe
  style YOU fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#d1fae5
  style SK fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style CS fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style CMD fill:#7f1d1d,stroke:#f87171,color:#fee2e2
  style SA fill:#78350f,stroke:#fbbf24,color:#fef3c7
  style MCP fill:#1e3a5f,stroke:#60a5fa,color:#dbeafe
  style RULES fill:#3b0764,stroke:#a78bfa,color:#ede9fe
  style NP fill:#3b0764,stroke:#a78bfa,color:#ede9fe
```

---

## How to Use

**One mental model:** describe the task → Cursor auto-selects a skill. Or type `/command` for a known workflow.

| Primitive | How to invoke | Example |
|:----------|:--------------|:--------|
| **Skill** | Just describe the task — Cursor matches trigger keywords | "make `/dashboard` feel less AI-generated" → `enhance-web-ux` |
| **Command** | Type `/<name>` in chat | `/commit`, `/research`, `/pr` |
| **Subagent** | Mention a trigger keyword | "review this PR" → `code-reviewer` auto-delegates |
| **Rule** | Drop `.mdc` into any project's `.cursor/rules/` | Always-on conventions, no re-prompting |

### Trigger phrase cheat sheet

| You say | Skill that fires |
|:--------|:----------------|
| "this page feels AI-generated, fix it" | `enhance-web-ux` |
| "make `/settings` more polished, less crowded" | `enhance-web-ui` |
| "build a landing page that doesn't look like AI slop" | `enhance-web-landing` |
| "redesign this site to feel premium, keep functionality" | `enhance-web-redesign` |
| "polish this React Native screen, feels clunky on iOS" | `mobile-rn-screen` |
| "Capacitor app looks great on web but cramped on mobile" | `enhance-capacitor-ui` |
| "build this feature properly" / "this keeps breaking" | `workflow-spec-tdd` |
| "add push notifications / deep links / ship OTA / App Store" | `mobile-capacitor-platform` |
| "the RN app is janky / slow to start / bundle is huge" | `mobile-rn-performance` |
| "build an ingestion pipeline / cron double-counts / backfill" | `data-pipeline` |
| "add logging / instrument this / why can't I debug prod" | `backend-observability` |
| "give the README a hero image and screenshots" | `enhance-readme` |
| "audit the UX of the checkout flow" | `audit-ux` |
| "split this branch into smaller PRs" | `split-to-prs` |
| "agent keeps hanging on browser steps" | `protocol-browser-anti-stall` |
| "is mushi working" / "mushi health check" / "check mushi pipeline" | `mushi-health` |
| "test mushi integration" / "verify full mushi pipeline" / "mushi e2e" | `mushi-integration` |

> **Force a specific skill:** *"use `enhance-web-ux` on `/dashboard`"*

### Daily workflow

```mermaid
flowchart LR
  PLAN["/plan"] --> CODE["Code"]
  CODE --> TEST["/test"]
  TEST --> DEBUG{Bugs?}
  DEBUG -->|yes| FIX["/debug"]
  FIX --> TEST
  DEBUG -->|no| REVIEW["/review"]
  REVIEW --> COMMIT["/commit"]
  COMMIT --> PR["/pr"]

  style PLAN fill:#064e3b,stroke:#10b981,color:#d1fae5
  style CODE fill:#1e293b,stroke:#64748b,color:#e2e8f0
  style TEST fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style DEBUG fill:#78350f,stroke:#fbbf24,color:#fef3c7
  style FIX fill:#7f1d1d,stroke:#f87171,color:#fee2e2
  style REVIEW fill:#3b0764,stroke:#a78bfa,color:#ede9fe
  style COMMIT fill:#1e3a5f,stroke:#60a5fa,color:#dbeafe
  style PR fill:#064e3b,stroke:#10b981,color:#d1fae5
```

---

## Skill Chaining — improve & iterate any repo

The real power isn't one skill — it's **chaining** them so the output of one becomes
the input of the next. You can run a chain two ways:

- **One prompt** — name the whole pipeline and let the agent walk it:
  *"Adopt this repo: research the stack, housekeep, then audit code-quality →
  security → performance, refactor the worst offenders, add tests, and open a PR."*
- **Step by step** — run each skill/command, review the diff, then continue. Best
  when stakes are high or the repo is unfamiliar.

> Rule of thumb: **audit → plan → change behind tests → verify → commit.** Never let
> a chain *change* code before something can *prove* the change is safe.

### The core iterate-a-repo loop

```mermaid
flowchart LR
  R["/research<br/>understand stack"] --> H["workflow-housekeep<br/>dead code, deps"]
  H --> A["audit-* <br/>quality / security / perf"]
  A --> P["/plan<br/>prioritize fixes"]
  P --> T["workflow-spec-tdd<br/>lock behavior in tests"]
  T --> RF["workflow-refactor<br/>make the change"]
  RF --> V["test-playwright<br/>verify like a user"]
  V --> RV["code-reviewer<br/>subagent review"]
  RV --> C["/commit → /pr"]
  C -. next slice .-> A

  style R fill:#064e3b,stroke:#10b981,color:#d1fae5
  style H fill:#1e293b,stroke:#64748b,color:#e2e8f0
  style A fill:#3b0764,stroke:#a78bfa,color:#ede9fe
  style P fill:#064e3b,stroke:#10b981,color:#d1fae5
  style T fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style RF fill:#78350f,stroke:#fbbf24,color:#fef3c7
  style V fill:#312e81,stroke:#818cf8,color:#e0e7ff
  style RV fill:#3b0764,stroke:#a78bfa,color:#ede9fe
  style C fill:#1e3a5f,stroke:#60a5fa,color:#dbeafe
```

### Bundled workflows — one phrase, full loop

| Say this | Bundle | What runs |
|----------|--------|-----------|
| "build a feature" | `workflow-build-feature` | spec → TDD → unit → smoke → PR |
| "fix this and ship" | `workflow-fix-and-ship` | debug → fix → regression → smoke → PR → deploy |
| "is this ready?" | `workflow-quality-gate` | red-team → security → bundle → perf → unit → verdict |
| "prepare for launch" | `workflow-launch-ready` | SEO + PWA + bundle + i18n + quality gate + deploy |
| "orient me" | `workflow-onboard` | reads codebase → briefing in 5 min |

### Recipes — copy, paste, and run

> Paste any prompt below into Cursor chat. The agent chains the skills automatically.

<details>
<summary><strong>1 · Adopt and harden an inherited codebase</strong></summary>

**Chain:** `workflow-onboard` → `workflow-housekeep` → `audit-code-quality` → `audit-security` → `audit-performance` → `/plan` → `workflow-refactor` → `test-unit` → `code-reviewer` → `/commit` → `/pr`

**Paste into Cursor:**

```
"Adopt this repo: onboard me to the codebase, housekeep dead code and stale deps,
then audit code quality + security + performance. Plan the top 10 findings by
impact × effort, refactor the worst offenders behind tests, run unit tests to
verify nothing broke, do a code review, then commit and open a PR."
```

</details>

<details>
<summary><strong>2 · Ship a feature the disciplined way (spec → TDD → verify)</strong></summary>

**Chain:** `design-prd` → `workflow-spec-tdd` → implement → `test-playwright` → `backend-observability` → `deploy-verify`

**Paste into Cursor:**

```
"Build [feature] the right way: write a one-page PRD, spec it with TDD
(write failing tests first), implement, add logging and traces, then
verify with Playwright like a real user and confirm the deploy is healthy."
```

</details>

<details>
<summary><strong>3 · Make a page stop looking AI-generated</strong></summary>

**Chain:** `audit-ux` → `audit-uiux-design-system` → `enhance-web-ux` → `enhance-web-ui` → `test-playwright` → `/commit`

**Paste into Cursor:**

```
"Audit the UX and design system compliance of [page/route]. Then enhance it:
fix information hierarchy, spacing, and visual weight so it feels intentional
and hand-crafted, not AI-generated. Verify the result with Playwright, then commit."
```

</details>

<details>
<summary><strong>4 · Fix a production incident and prevent recurrence</strong></summary>

**Chain (one shot):** `workflow-fix-and-ship`

**Or manually:** `debug-sentry-monitor` → `debug-error` → fix → `test-unit` → `deploy-verify`

**Paste into Cursor:**

```
"Check Sentry for the top error. Reproduce it locally, fix it, write a
regression test so it can't come back, then deploy and confirm the
error rate drops."
```

</details>

<details>
<summary><strong>5 · Full pre-launch sweep</strong></summary>

**Chain (one shot):** `workflow-launch-ready` *(SEO + PWA + bundle + i18n + red-team + security + deploy)*

**Paste into Cursor:**

```
"Run a full pre-launch sweep: audit SEO, PWA readiness, JS bundle size, and
i18n coverage. Red-team the app for bugs + security + perf issues. Prepare
everything for launch, then deploy and smoke test."
```

</details>

<details>
<summary><strong>6 · Land a big change as small, reviewable PRs</strong></summary>

**Chain:** `workflow-refactor` → `split-to-prs` → `workflow-pr` → `babysit`

**Paste into Cursor:**

```
"Refactor [area] into clean, modular architecture. Split the changes into
small PRs (max 300 lines each), open them in sequence, and babysit them
until merged."
```

</details>

<details>
<summary><strong>7 · Six-skill plan loop (audit inherited / pre-launch codebase)</strong></summary>

**Chain (plan only):** `plan-uiux-unification` → `plan-stub-checker` → `plan-test-coverage` → `plan-perf-audit` + `plan-security-audit` → `plan-docs-sync`

**After approval, execute:** `enhance-web-ux` · `debug-fe-be-integration` · `test-unit` · `audit-performance` · `audit-security` · `docs-writer` · `test-playwright`

**Paste into Cursor:**

```
Run the full six-skill plan loop on this repo — audit and plan only, no fixes yet:

1. plan-uiux-unification — IA + design-system burndown
2. plan-stub-checker — stubs, dead buttons, unwired handlers
3. plan-test-coverage — user stories from code, traceability matrix, fake-green scan
4. plan-perf-audit + plan-security-audit in parallel
5. plan-docs-sync last — docs match shipped reality

One consolidated report with phased burndowns. I'll approve phases before execution.
```

See also: [docs/PLAN-LOOPS.md](docs/PLAN-LOOPS.md)

</details>

> **Tip — run audits in parallel:** use `workflow-parallel-agents` to run
> `audit-security`, `audit-performance`, and `audit-code-quality` as three separate
> agents simultaneously, then merge findings into one `/plan` before touching code.

---

## Skills (79)

> **Note:** The `file-docx`, `file-pdf`, `file-pptx`, and `file-xlsx` skills (Anthropic proprietary, source-available only) have been removed from this public repo. Keep personal copies in `~/.cursor/skills/` if needed.

### Naming taxonomy

Every skill name is `<prefix>-<topic>`. 14 prefixes, one concern each:

| Prefix | Purpose |
|:-------|:--------|
| `audit-` | Quality/security assessments |
| `backend-` | Server-side patterns (DB, observability, realtime) |
| `data-` | Pipelines, ETL, visualization |
| `debug-` | Reproduce → isolate → fix failures |
| `deploy-` | Release, publish, post-deploy verify |
| `design-` | Create new visual/API surfaces |
| `docs-` | Write or co-author documentation |
| `enhance-` | Improve existing web/mobile UI & UX |
| `meta-` | Skills and MCP authoring |
| `mobile-` | React Native, Capacitor, emulator |
| `mushi-` | Mushi Mushi integration — health, pipeline, TDD |
| `plan-` | Audit-and-plan only (burndown → approve → execute) |
| `protocol-` | Procedural guardrails (browser anti-stall, etc.) |
| `test-` | QA, unit tests, acceptance tests |
| `workflow-` | Dev-process skills (git, refactor, PR, spec-TDD) |

### Enhance — make pages feel hand-crafted

Pick by surface:

| Surface | Skill |
|:--------|:------|
| Web product page — composition, hierarchy, motion | `enhance-web-ui` |
| Web product page — UX heuristics, flows, data wiring | `enhance-web-ux` |
| Web landing / marketing / portfolio | `enhance-web-landing` |
| Existing site upgrade (audit-first, preserve behaviour) | `enhance-web-redesign` |
| 3D / WebGL / cinematic scroll on an existing site | `enhance-web-web3d` |
| React Native screen (Expo / bare) | `mobile-rn-screen` |
| Capacitor / hybrid app (one web app on iOS + Android) | `enhance-capacitor-ui` |
| Repo README showcase | `enhance-readme` |
| SEO — meta, OG, structured data, Core Web Vitals | `enhance-web-seo` |
| PWA — offline, install prompt, service worker, push | `enhance-pwa` |

### Design & Frontend

| Skill | What it does |
|:------|:-------------|
| `design-frontend` | Production-grade UI — avoids generic AI aesthetics |
| `design-system` | Component libraries, tokens, variants, CVA |
| `design-motion` | Framer Motion, CSS animations, GSAP micro-interactions, gamification, Easter eggs |
| `enhance-web-web3d` | WebGL, Three.js, shaders, particles, Canvas 2D |
| `enhance-web-ui` | Incremental UI/UX improvements and polish |
| `design-mobile-first` | Touch-optimized, responsive, PWA patterns |
| `design-theme` | Apply cohesive visual themes across artifacts |
| `design-email` | Transactional + marketing email templates — React Email, MJML, dark mode, natural copy, deliverability |
| `mobile-capacitor-platform` | Capacitor plugins, OTA updates, deep links, push, store submission, Apple preflight |
| `mobile-rn-performance` | React Native perf/build/upgrade — FPS, Hermes, TTI, bundle size, FlashList, Reanimated |

### Data & Creative

| Skill | What it does |
|:------|:-------------|
| `data-visualization` | Recharts, D3.js, sparklines, real-time charts |
| `design-generative-art` | Generative art, flow fields, L-systems, circle packing |
| `design-canvas` | Museum-quality visual design in `.png` and `.pdf` formats |

### Backend & Database

| Skill | What it does |
|:------|:-------------|
| `backend-patterns` | Server Actions, tRPC, Edge Functions, caching, jobs |
| `backend-db-performance` | Indexes, N+1 fixes, RLS performance, query tuning |
| `backend-realtime` | WebSocket, Supabase Realtime, SSE, live data |
| `data-pipeline` | ETL / edge-function / `pg_cron` correctness — idempotency, atomic writes, backfills, dead-letter |
| `backend-observability` | Error↔trace↔log correlation, structured logs, PII redaction, OTel spans, LLM traces, SLO design |

### Architecture & Quality

| Skill | What it does |
|:------|:-------------|
| `design-api` | REST conventions, error schemas, pagination, versioning |
| `backend-error-handling` | Error boundaries, Server Action errors, toast patterns |
| `audit-code-quality` | Detect and fix React / TypeScript anti-patterns, naming, imports, organization |
| `audit-code-review` | Thorough PR reviews — correctness, security, perf, a11y |
| `workflow-refactor` | Safe, incremental code transformations |
| `audit-performance` | Core Web Vitals, bundle analysis, runtime profiling |
| `audit-bundle-size` | Find and eliminate JS bundle bloat — tree shaking, code splitting, lazy loading |
| `audit-security` | OWASP Top 10, auth flows, RLS, secrets management |
| `audit-accessibility` | WCAG 2.1 AA, screen reader, keyboard navigation, ARIA |
| `audit-i18n` | Internationalisation audit — hardcoded strings, natural-sounding translations, locale formatting |

### Audits & Monitoring

| Skill | What it does |
|:------|:-------------|
| `audit-db-schema` | Schema audit — naming, types, constraints, indexes, RLS, migrations |
| `audit-fe-api` | Frontend API calls vs backend — contract alignment, caching, error handling |
| `audit-langfuse-llm` | PDCA audit for LLM features — traces, prompts, costs, evals, grounding |
| `audit-uiux-design-system` | Visual token compliance — colors, spacing, components, WCAG |
| `audit-ux` | Generic UX audit — NN/g 10 heuristics, Laws of UX, Intuit Content Design, HEART |
| `debug-sentry-monitor` | Sentry triage, root cause analysis, noise filtering, architecture audit |
| `deploy-verify` | Post-deploy smoke test — Sentry + Supabase + Langfuse + Playwright, ship-or-rollback verdict |
| `iterate-post-launch` | Post-launch improvement loop — Sentry + Supabase signals → triage → fix → verify |

### Debugging

| Skill | What it does |
|:------|:-------------|
| `debug-error` | Systematic debugging — reproduce, isolate, research, fix, verify, prevent |
| `debug-fe-be-integration` | FE/BE integration debug — backend logs, API mismatches, both-side fixes |

### Testing & QA

| Skill | What it does |
|:------|:-------------|
| `test-unit` | Auto-detect framework, research patterns, Sentry coverage gaps, write tests |
| `test-qa` | Comprehensive QA via browser MCP — CRUD lifecycle, data pipeline, UX quality |
| `test-playwright` | PDCA loop closer — drive localhost like a real user, fix pain points as you go |
| `test-red-team` | Adversarial full-app sweep — feature-first coverage matrix × UI/UX + pipeline + security (OWASP) + perf; severity-ranked defect list |
| `mobile-emulator-test` | Native build QA on Android emulator — adb walk + Supabase + Sentry MCPs |
| `mobile-emulator-start` | Boot Metro + Android emulator in the correct order — prevents "Cannot connect to Expo CLI" races |
| `workflow-pr` | PR lifecycle — validation, bot feedback, merge criteria |
| `protocol-browser-anti-stall` | Anti-hang protocol for browser automation sessions |

### Bundled Workflows

One phrase that chains multiple skills into a tracked, phase-gated loop.

| Skill | What it chains |
|:------|:--------------|
| `workflow-build-feature` | spec → TDD → implement → unit tests → smoke → PR |
| `workflow-fix-and-ship` | debug → root cause → fix → regression test → smoke → PR → deploy |
| `workflow-quality-gate` | red-team → security → bundle → perf → unit tests → go/no-go verdict |
| `workflow-launch-ready` | SEO + PWA + bundle + i18n + quality gate + deploy smoke + iterate |
| `workflow-onboard` | reads codebase → orientation briefing in 5 minutes |

### Engineering Practices

| Skill | What it does |
|:------|:-------------|
| `workflow-spec-tdd` | Anti-vibe-coding: brainstorm → spec → plan → RED/GREEN/REFACTOR → self-review |
| `workflow-parallel-agents` | Run agents in parallel via git worktrees, cloud agents, multi-model comparison |
| `workflow-feature-flag` | Feature-flag rollout discipline — gate → staged release → monitor → promote or roll back |
| `create-hook` | Build Cursor Agent Hooks — auto-formatters, security gates, secret scanners |
| `workflow-coding-discipline` | Behavioral guardrails (Think before coding, Simplicity first, Surgical changes) |
| `workflow-refactor` | Safe, incremental code transformations with behaviour-preserving steps |
| `workflow-housekeep` | Full-cycle repo maintenance — README sync, dead file cleanup, dependency updates |

### Product & Documentation

| Skill | What it does |
|:------|:-------------|
| `design-prd` | Generate PRDs via structured conversation — competitive research, technical feasibility |
| `docs-writer` | Write READMEs, API docs, architecture docs, code comments |
| `docs-coauthor` | Structured co-authoring for specs, PRDs, RFCs |
| `workflow-git-commit` | Conventional commits, branching, PRs, releases |
| `workflow-housekeep` | Full-cycle repo maintenance — README sync, dead file cleanup, dependency updates |

### Mushi Mushi

| Skill | What it does |
|:------|:-------------|
| `mushi-health` | Pass/fail health check — CLI, edge functions, BYOK key pool, QA cron running |
| `mushi-integration` | Full end-to-end smoke test — bug capture → triage → story map → TDD gen → run → PDCA |

### Meta & Tooling

| Skill | What it does |
|:------|:-------------|
| `meta-skill-creator` | Guide for creating new Agent Skills |
| `meta-mcp-builder` | Build MCP servers for LLM tool integration |

<details>
<summary><strong>Cursor-Specific Skills (12)</strong></summary>

| Skill | What it does |
|:------|:-------------|
| `babysit` | Keep a PR merge-ready — triage comments, resolve conflicts, fix CI in a loop |
| `canvas` | Live React canvas beside chat — rich data visualizations, audit reports, interactive tools |
| `create-hook` | Create Cursor hooks — scripts/prompts for before/after agent events |
| `create-rule` | Create `.cursor/rules/` files for persistent AI guidance |
| `create-skill` | Create new Agent Skills in `~/.cursor/skills/` |
| `create-subagent` | Create custom subagents in `.cursor/agents/` |
| `migrate-to-skills` | Convert rules/commands to Skills format |
| `shell` | Direct shell execution without interpretation |
| `split-to-prs` | Slice one pile of work into small reviewable PRs — safe snapshot, no destructive git ops |
| `statusline` | Configure CLI status line — model, context usage, git info |
| `update-cli-config` | Modify CLI settings — permissions, sandbox, vim mode |
| `update-cursor-settings` | Modify Cursor/VSCode `settings.json` |

</details>

---

## Commands (13)

| Command | When to use | What it does |
|:--------|:------------|:-------------|
| `/plan` | Before coding | Research codebase, clarify requirements, produce an approved plan before writing code |
| `/commit` | After coding | Fix build errors, lint, type check, commit & push |
| `/pr` | Ready to ship | Checks pass → commit → push → open PR with description |
| `/fix-issue [#]` | Bug reports | Fetch GitHub issue → find relevant code → implement fix → open PR |
| `/debug` | Tricky bugs | Hypothesis-driven debugging with runtime instrumentation |
| `/review` | Before merge | Agent review + manual checklist: correctness, security, perf, a11y |
| `/test` | Before commit | Run test suite, verify quality, check coverage |
| `/update-deps` | Maintenance | Safely update dependencies one at a time with changelog review |
| `/research` | Before coding | Scrape latest docs, patterns, and solutions via Firecrawl |
| `/readme` | End of session | Sync all READMEs to reflect session changes |
| `/refactor` | Long files | Split into clean, modular architecture without losing any code |
| `/mcp` | Dev workflow | MCP-powered development reference and tool guide |
| `/uiux` | UI review | Enforce design system, fix rogue styling, standardize interactions |

**Bundle — `native-rn-monorepo`:** 9 extra commands (`/android-*`, `/ios-ci-*`, `/rn-*`) + 5 rules for an RN + Web monorepo where iOS verification runs on CI (not locally). Copy into any project:

```bash
cp ~/cursor-kenji/commands/native-rn-monorepo/*.md  <project>/.cursor/commands/
cp ~/cursor-kenji/rules/native-rn-monorepo/*.mdc    <project>/.cursor/rules/
```

---

## Subagents (5)

Cursor auto-delegates to these when it detects the right keywords.

| Agent | Triggers on | Output |
|:------|:------------|:-------|
| `code-reviewer` | Code changes, "review" | Quality, security, types, anti-patterns |
| `debugger` | Errors, exceptions | Root cause analysis, isolate, fix, verify |
| `db-migrator` | "migration", "new table" | SQL, RLS policies, indexes, type generation |
| `deploy-checker` | "deploy", "ship it" | 8-check validation pipeline |
| `perf-monitor` | "slow", "optimize" | Bundle, render, data fetching audit |

---

## MCP Servers (16)

Copy a template to `~/.cursor/mcp.json` and fill in your keys:

```bash
cp ~/cursor-kenji/mcp/mcp.json.template ~/.cursor/mcp.json      # Essential 5
cp ~/cursor-kenji/mcp/mcp-full.json.template ~/.cursor/mcp.json  # All 16
```

**Tier 1 — Essential (no key needed except Firecrawl + Supabase)**

| Server | Key? | What it does |
|:-------|:-----|:-------------|
| Sequential Thinking | No | Step-by-step reasoning for complex tasks |
| Context7 | No | Live, up-to-date library documentation |
| Firecrawl | Yes | Web research and doc scraping |
| Supabase | Yes | DB access, auth, storage, migrations |
| Chrome DevTools | No* | Browser testing, console, screenshots |

**Tier 2 — Dev power-ups**

| Server | Key? | What it does |
|:-------|:-----|:-------------|
| GitHub | PAT | Repos, issues, PRs, code search |
| GitHub Official | PAT | Official Go-based server (Docker) |
| Playwright | No | Browser automation, E2E, screenshots |
| Postgres | Conn | Direct PostgreSQL queries and schema |
| Memory | No | Persistent memory across sessions |

**Tier 3 — Cloud & infrastructure**

| Server | Key? | What it does |
|:-------|:-----|:-------------|
| AWS Lambda | Profile | Functions, deployments, logs |
| AWS S3 | Profile | Bucket management, file ops |
| AWS CloudWatch | Profile | Log queries, metrics, alarms |
| Redis | URL | Key-value store operations |

**Tier 4 — Productivity**

| Server | Key? | What it does |
|:-------|:-----|:-------------|
| Slack | Bot token | Post messages, read channels |
| Notion | Yes | Pages, databases, content |

See [`mcp/README.md`](mcp/README.md) for full setup instructions.

---

## Project Rules Starter Pack

Drop into any project's `.cursor/rules/` for instant AI guidance:

```bash
cp ~/cursor-kenji/rules/project-starter/*.mdc your-project/.cursor/rules/
```

| Rule | Enforces |
|:-----|:---------|
| `supabase.mdc` | Typed clients, RLS mandatory, migration patterns |
| `components.mdc` | Reuse primitives, Server Components, a11y |
| `typescript.mdc` | No `any`, Zod validation, ActionResult pattern |
| `tailwind.mdc` | Design tokens, `cn()`, design-mobile-first, motion preferences |
| `git.mdc` | Conventional commits, branch naming, no secrets |
| `data-fetching.mdc` | TanStack Query, prefetch, query key factories |

**Global rules** (apply across every project):

| Rule | Enforces |
|:-----|:---------|
| `senior-engineer.md` | Full-stack execution protocol with MCP tool usage |
| `full-stack-ship-discipline.mdc` | Every UI task is full-stack until verified end-to-end — migrations must deploy in the same chat |
| `shell-first-search.md` | Route routine search to `Shell` instead of `Grep`/`Glob` (prevents Windows hang) |
| `composer-2.5-execution.mdc` | Execution-time guardrails when Composer 2.5 implements an approved `plan-*.md` — anti-reward-hacking, anti-feature-deletion, checkpointing |

> **Plan with a strong model, execute with the rule on.** The six `plan-*` skills are
> meant to be authored/reviewed with a stronger reasoning model (e.g. Opus 4.8), then
> handed to Composer 2.5 for implementation. `composer-2.5-execution.mdc` is
> `alwaysApply: true`, so it rides along on every Composer execution run to keep the
> handoff honest — the plan says *what* to do; the rule constrains *how* it's allowed to do it.

---

## Shell Helpers

```bash
source ~/cursor-kenji/shell-aliases/cursor-helpers.sh
```

| Command | What it does |
|:--------|:-------------|
| `newskill <name>` | Create a new skill with template |
| `lsskills` | List all installed skills with descriptions |
| `cursor-sync` | Pull latest + reinstall |
| `cursor-dev` | Open Cursor + Chrome DevTools |
| `newrule <name>` | Create a project rule with template |
| `newagent <name>` | Create a subagent with template |
| `gc <type> <msg>` | Conventional commit shortcut |
| `gp` | Push current branch |

---

## Repository Layout

<details>
<summary>Full directory tree</summary>

```
cursor-kenji/
├── skills/                  # 61 Agent Skills (each has SKILL.md)
│   ├── enhance-web-ui/      # Composition, hierarchy, spacing, motion
│   ├── enhance-web-ux/      # NN/g heuristic-grounded UX enhancement
│   ├── enhance-web-landing/ # Anti-slop landing/portfolio design
│   ├── enhance-web-redesign/# Audit-first redesign of existing sites
│   ├── enhance-web-web3d/   # 3D/WebGL + GSAP cinematic motion
│   ├── mobile-rn-screen/       # React Native screen polish
│   ├── enhance-capacitor-ui/# Cross-surface hybrid app architecture
│   ├── enhance-readme/      # Hero + tour + GIF for any README
│   ├── workflow-spec-tdd/   # Anti-vibe-coding: spec → plan → TDD → review
│   ├── data-pipeline/       # ETL/edge-function/cron correctness
│   ├── backend-observability/  # Build-time logging + tracing
│   ├── mobile-capacitor-platform/ # Capacitor plugins, OTA, store submission
│   ├── mobile-rn-performance/  # React Native perf, bundle, upgrade depth
│   ├── test-playwright/     # PDCA: drive localhost as a user + fix
│   ├── test-red-team/       # Adversarial sweep: feature matrix × UX+pipeline+security+perf
│   ├── iterate-post-launch/ # Post-launch loop: Sentry+Supabase signals → fix → verify
│   ├── enhance-web-seo/     # SEO audit + meta/OG/JSON-LD/sitemap/CWV fixes
│   ├── audit-bundle-size/   # Bundle analysis, tree-shaking, code-splitting
│   ├── enhance-pwa/         # Service worker, offline, install prompt, push
│   ├── workflow-feature-flag/ # Gate → staged rollout → monitor → promote or roll back
│   ├── audit-i18n/          # i18n audit — natural tone, locale formatting, no jargon
│   ├── design-email/        # Transactional email — React Email, dark mode, deliverability
│   ├── workflow-build-feature/ # BUNDLE: spec → TDD → unit → smoke → PR
│   ├── workflow-fix-and-ship/  # BUNDLE: debug → fix → smoke → PR → deploy
│   ├── workflow-quality-gate/  # BUNDLE: red-team → security → bundle → perf → unit
│   ├── workflow-launch-ready/  # BUNDLE: SEO + PWA + bundle + i18n + quality gate + deploy
│   ├── workflow-onboard/    # First-contact codebase orientation in 5 minutes
│   ├── mobile-emulator-start/ # Metro + Android emulator bring-up
│   ├── deploy-npm/          # Changesets + npm OIDC release loop
│   └── ...50 more skills
├── skills-cursor/           # 12 Cursor-specific Skills
│   ├── babysit/
│   ├── canvas/
│   ├── create-hook/
│   ├── create-rule/
│   ├── create-skill/
│   ├── split-to-prs/
│   └── ...6 more
├── commands/                # 13 Slash Commands (.md files)
├── agents/                  # 5 Subagents
├── .cursor/rules/
│   ├── skill-workflows.mdc  # Routing index — bundles → individual skills chaining diagram
├── rules/
│   ├── senior-engineer.md
│   ├── full-stack-ship-discipline.mdc
│   ├── shell-first-search.md
│   ├── composer-2.5-execution.mdc  # Composer execution guardrails for approved plans
│   ├── project-starter/     # 6 drop-in project rule templates
│   └── native-rn-monorepo/  # RN + Web monorepo bundle
├── notepads/                # Reusable context (architecture, design-tokens)
├── shell-aliases/
│   └── cursor-helpers.sh    # 8 terminal shortcuts
├── mcp/
│   ├── mcp.json.template    # Essential 5 servers
│   ├── mcp-full.json.template  # All 16 servers
│   └── README.md
├── docs/
│   ├── CATALOG.md           # Full reference with trigger phrases
│   └── CONTRIBUTING.md      # Detailed contributor guide
├── .github/
│   ├── ISSUE_TEMPLATE/      # Bug report + skill request forms
│   └── PULL_REQUEST_TEMPLATE.md
├── scripts/
│   └── check-skill-count.mjs  # Enforces README count matches actual skills
├── install.sh               # One-command installer
├── CHANGELOG.md             # Full version history
├── CONTRIBUTING.md          # Quick contributor guide
├── SECURITY.md              # Vulnerability reporting
├── CITATION.cff             # How to cite this toolkit
└── LICENSE                  # MIT
```

</details>

---

## Design Principles

| # | Principle |
|---|:----------|
| 1 | **Check Existing First** — scan before creating. Never duplicate. |
| 2 | **Production-Ready** — no placeholders. Code that ships. |
| 3 | **Modular & Composable** — skills cross-reference. Mix and match. |
| 4 | **Creative Yet Disciplined** — bold aesthetics, solid engineering. |
| 5 | **Modern Stack** — React 19, Next.js 15+, Tailwind v4, strict TS. |
| 6 | **Accessible by Default** — WCAG 2.1 AA is non-negotiable. |
| 7 | **Performance Aware** — every pattern considers Web Vitals. |

---

## Contributing

New skills, commands, rules, and MCP configs are welcome. The fastest path:

```bash
# Add a skill
mkdir -p skills/my-skill-name
# Write skills/my-skill-name/SKILL.md (see CONTRIBUTING.md for the template)
npm run check:skills
# Open a PR — template is pre-filled
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide, [docs/CATALOG.md](docs/CATALOG.md) for the complete trigger phrase reference, and [docs/TRIGGER-CHEATSHEET.md](docs/TRIGGER-CHEATSHEET.md) for a plain-English "say X → skill Y fires" lookup table.

---

## Alternatives & see also

- **[awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)** — curated `.cursorrules` / `.cursor/rules` collection
- **[skills.sh](https://skills.sh)** — the skills registry this repo is listed on
- **[cursor.directory](https://cursor.directory)** — Cursor plugin and rules directory
- **[agentskills.io](https://agentskills.io)** — community agent skill index

cursor-kenji differs from cursorrules collections in that it ships *executable* skill files (not static rules), MCP server configs, slash commands, and subagent definitions in one installable package.

---

## Also by @kensaurus

Other free apps and tools from the same Tokyo studio — all built with the skills in this repo.

### Mushi Mushi 🐛 — bug reporting + AI auto-fix

Drop in a shake-to-report widget → AI-classified + deduped bug reports → optional agent opens a draft PR. Complements Sentry; never replaces it.

```bash
npx mushi-mushi   # React / Next.js / Vue / Svelte / Angular / RN / Expo / Capacitor
```

[kensaur.us/mushi-mushi](https://kensaur.us/mushi-mushi) · [GitHub](https://github.com/kensaurus/mushi-mushi) · [npm](https://www.npmjs.com/package/mushi-mushi) · free tier 1,000 reports/month · MIT SDK

> cursor-kenji's `deploy-npm` skill was built for Mushi's Changesets + OIDC monorepo. `debug-sentry-monitor` and `test-playwright` pair naturally with it. Use `mushi-health` to verify the pipeline is running and `mushi-integration` to smoke-test the full TDD loop.

### Mobile apps — iOS & Android

| App | What it does | Links |
|:----|:-------------|:------|
| **[glot.it — Learn Thai Free](https://kensaur.us/glot-it/)** | 161 lessons, AI roleplay chat, pitch-contour tone mirror, offline-first. Actually free. | [iOS](https://apps.apple.com/us/app/glot-it/id6761582648) · [Android](https://play.google.com/store/apps/details?id=com.glotit.app) |
| **[yen-yen — Expense Tracker](https://kensaur.us/yen-yen/)** | Kakeibo-style household ledger. No bank password, no ads, multi-currency + historical FX. | [iOS](https://apps.apple.com/app/id6764548441) · [Android](https://play.google.com/store/apps/details?id=app.yenyen) |
| **[Help Her Take Photo](https://kensaur.us/help-her-take-photo/)** | Two phones → remote photo studio. Live preview + remote shutter. No account. | [iOS](https://apps.apple.com/app/help-her-take-photo/id6762513666) · [Android](https://play.google.com/store/apps/details?id=com.kensaurus.helphertakephoto) |
| **[The Wanting Mind — Free Book](https://kensaur.us/the-wanting-mind/)** | 147,000-word interactive book. 3D knowledge graph, 12 narrators, karaoke highlight, EN/JA/ZH/TH. No ads, no paywalls. | [iOS](https://apps.apple.com/us/app/the-wanting-mind/id6761361305) · [Android](https://play.google.com/store/apps/details?id=us.kensaur.thewantingmind) |

---

<p align="center">
  <strong>MIT License</strong> — use freely, modify freely, share freely.<br/>
  <em>Built by <a href="https://github.com/kensaurus">@kensaurus</a> · <a href="https://kensaur.us/mushi-mushi">Mushi Mushi</a> · <a href="CHANGELOG.md">What's new</a> · <a href="https://github.com/kensaurus/cursor-kenji/discussions">Discussions</a></em>
</p>
