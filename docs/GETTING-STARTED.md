# Getting Started with cursor-kenji

A plain-language guide for non-technical users and Cursor beginners.

---

## What is this?

**cursor-kenji** is a collection of "skills" for [Cursor](https://cursor.com) — the AI-powered code editor.

Think of skills like apps on a phone. You install them once and they're there when you need them. When you type something in Cursor chat — like "audit my security" or "make this page look better" — the matching skill activates and tells the AI exactly how to do that job properly.

Without skills, the AI does its best. With skills, it follows a documented step-by-step workflow.

---

## Step 1: Install Cursor

If you don't have Cursor yet: [download it at cursor.com](https://cursor.com). It's free and it's basically VS Code with AI chat built in.

---

## Step 2: Install cursor-kenji

Open a terminal (on Mac: press `Cmd+Space`, type "Terminal", press Enter) and paste:

```bash
npx skills add kensaurus/cursor-kenji
```

If you get "command not found", run `npm install -g skills` first, then try again.

**Alternative — no npm:**

```bash
git clone https://github.com/kensaurus/cursor-kenji.git
cd cursor-kenji
./install.sh
```

**Or with npx directly:**

```bash
npx @kensaurus/cursor-kenji
```

**Windows:** `npx @kensaurus/cursor-kenji` can fail (`cursor-kenji` is not recognized). From a clone, run:

```bash
git clone https://github.com/kensaurus/cursor-kenji.git
cd cursor-kenji
node bin/install.mjs --all
```

---

## Step 3: Restart Cursor

Close and reopen Cursor. That's all — the skills are now active.

---

## Step 4: Use a skill

Open Cursor, open a project, and type in the chat. You don't have to remember skill names. Just describe what you want.

### Bundled workflows (do the most work with one phrase)

These chain multiple skills into a single tracked loop:

| Type this in chat… | What happens |
|:-------------------|:-------------|
| `build a feature: user notifications` | Spec → TDD → implement → smoke test → PR — the whole loop |
| `fix this Sentry error and ship it` | Triage → reproduce → fix → verify → PR → resolve issue |
| `is this ready to ship?` | Adversarial test + security + bundle + perf → go/no-go verdict |
| `prepare the app for launch` | SEO + PWA + bundle + quality gate + deploy smoke → launch checklist |
| `I'm new to this repo, orient me` | Reads the codebase and produces a 5-minute briefing |

### Copy-paste combo pipelines (most impact per phrase)

These chain several skills. Paste the whole sentence.

| Paste this… | What happens |
|:------------|:-------------|
| `monkey-test as guest and logged-in, ticket every real bug, then lock a Playwright pass on the worst ones` | Wander the live app twice → durable tickets → lock the worst bugs (`test-exploratory` → `workflow-feedback-to-closure` → `test-playwright`) |
| `wander the app as guest vs logged-in, then run the quality gate` | Identity probe first, then red-team / security / bundle / perf (`test-exploratory` → `workflow-quality-gate`) |
| `build this feature` | Spec → TDD → implement → smoke → PR |
| `complete everything` | Close the whole plan — no parked leftovers |

### Individual skills

| Type this in chat… | What happens |
|:-------------------|:-------------|
| `grill me about this plan` | The AI interviews **you** — one question at a time — until you're both sure what to build |
| `pin down our terminology` | Builds a project glossary (`CONTEXT.md`) so the AI stops using the wrong words |
| `resolve the merge conflicts` | Traces each conflict back to why the code was written, resolves with intent, re-runs checks |
| `audit my app's security` | Scans for OWASP vulnerabilities, checks auth, flags secrets in code |
| `make this page look better` | Improves layout, spacing, hierarchy — like a designer would |
| `commit my changes` | Writes a proper conventional commit message for you |
| `audit my database schema` | Checks naming, indexes, RLS policies, data types |
| `deploy my npm package` | Walks through Changesets → CI → publish, step by step |
| `write a PR` | Creates the pull request with a proper title and description |
| `red team this app` | Adversarial sweep — UX, data pipeline, security, performance |
| `monkey test the app as guest and logged in` | Unscripted wander twice, then a guest-vs-authed diff table |
| `make the app feel alive with motion` | Adds coherent, accessible animations that match your design system |
| `desktop looks like a stretched phone` | Unstacks the layout — max-width, side-by-side groups, hierarchy at 375 / 768 / 1440 |
| `what happens when this list is empty?` | Empty / loading / error / offline states for every screen |
| `why do our emails go to spam?` | SPF/DKIM/DMARC and bounce handling so mail lands in the inbox |
| `can we recover if the database dies?` | Backup + restore plan you approve before any infra change |
| `why did the wrong skill trigger?` | Finds overlapping descriptions and stale handoffs in the skill pack |
| `improve this form` | Accessible labels, real validation, error/success states, multi-step flows |
| `clean up our design system` | Consolidates drifted colors/components into one source of truth |
| `set up guardrails so AI doesn't break things` | Installs pre-commit + CI checks against secrets, bugs, and risky ops |
| `is my app production-ready?` | Checks timeouts, retries, idempotency — the reliability the happy path skips |

### Launch, ops, and the skill pack

| Type this in chat… | What happens |
|:-------------------|:-------------|
| `is my chatbot safe?` / `prompt injection` | OWASP LLM Top 10 on the AI features you ship |
| `check our privacy / GDPR / APPI` | Data-flow vs policy vs store labels — plan you approve first |
| `are we tracking the right events?` | Funnel coverage, event names, consent-gated analytics |
| `optimize our App Store listing` | Keywords, screenshots, ratings — ASO plan only |
| `restore purchases is broken` | StoreKit / Play / RevenueCat entitlements |
| `will it handle launch traffic?` | Load test — p95/p99 and the breaking point |
| `works locally but not in prod` | Env/config parity across local / staging / prod |
| `why is my hosting bill high?` | Egress, storage, zombie resources — plan cuts that keep backups |
| `why did a regression pass CI?` | Gate-logic audit — silent bypass, ratchet gaming, required-but-not |
| `we have three lint jobs` | Consolidate accreted CI gates into one aggregator |
| `are our tests real?` | Mutation testing — coverage theater vs assertions |
| `agents keep importing across features` | Mechanical architecture boundaries in CI |
| `the agent keeps suggesting Y again` | ADR decision memory — rejected alternatives |
| `did this codemod break anything?` | Bulk-transform behavior-preservation — compiles/lints is not same-behavior |
| `audit our auth` / `is getSession safe?` | Route×gate matrix — middleware is not a security boundary |
| `/privacy-plan` `/backup-plan` `/aso-plan` `/skill-conflicts` `/gate-logic` `/codemod-safety` `/housekeep-gates` `/test-mutation` `/arch-boundaries` `/adr` `/auth-flows` | Slash shortcuts for those same jobs |

Full phrase list → [TRIGGER-CHEATSHEET.md](TRIGGER-CHEATSHEET.md).

The AI picks the right skill automatically based on what you typed.

---

## A typical session, start to finish

The single biggest cause of bad AI output isn't bad code — it's the AI building
the wrong thing. This loop prevents that:

### 1. Get oriented (new repo only)

```
I'm new to this repo, orient me
```

The AI reads the codebase and gives you a 5-minute briefing.

### 2. Get grilled *before* any code

```
/grill-me I want to add a referral program
```

Instead of guessing, the AI interviews you — **one question at a time**, each
with a recommended answer so you can just say "yes" or push back:

> *"Should a referral reward fire on signup or on first payment? I'd recommend
> first payment — it prevents signup-farming. Agree?"*

It looks up facts in your codebase itself and only asks you the *decisions*.
Nothing is built until you confirm. The session ends with a decision log.

### 3. Build from the decisions

```
build the feature from those decisions
```

The `workflow-build-feature` loop takes over: spec → failing test → code →
smoke test → PR. Because you were grilled first, the spec matches what you
actually meant.

### 4. Hand off when you stop

Long session? Context getting full? Type:

```
/handoff finish the referral UI tomorrow
```

You get a compact handoff document (what's done, what's verified, exact next
steps, which skills to invoke) saved outside your repo. Tomorrow, paste its
path into a fresh chat and continue where you left off — no re-explaining.

**The rhythm: orient → grill → build → prove → hand off.** Skip the grilling
and you're back to the AI guessing.

---

## Updating

To get the latest skills:

```bash
npx skills add kensaurus/cursor-kenji
```

Running the same command again overwrites with the latest version.

---

## Frequently asked questions

**Do I need to configure anything?**
No, for most skills. Some skills use external services (Sentry, Supabase, Langfuse) — those need API keys in your environment. The skills tell you when that's needed.

**Will this slow down Cursor?**
No. Skills are just text files. They're loaded by the AI only when relevant.

**Can I delete skills I don't need?**
Yes — delete any folder from `~/.cursor/skills/`. The skill is gone.

**Can I add my own skills?**
Yes. See [CONTRIBUTING.md](../CONTRIBUTING.md) for the template.

**Does this work with Claude, GPT, etc.?**
cursor-kenji is built for Cursor's agent system. Skills are text files, so the format is readable by any model Cursor supports.

**Is it free?**
Yes, MIT licensed.

---

## Planning skills — audit first, fix after you approve

**20 `plan-*` skills** run **before** you change code. They produce burndowns and phased roadmaps. You approve each phase, then run the matching execution skills.

**Full guide:** [PLAN-LOOPS.md](PLAN-LOOPS.md) — grouped loops (not one mega-chain):

| Loop | When to run |
|:-----|:------------|
| **Six-skill loop** | UI/IA hardening on an inherited codebase |
| **Pre-launch hardening** | Security spine + dependency provenance |
| **Observability & spend** | Sentry/Langfuse gaps, LLM cost caps |
| **Mobile gate** | Capacitor native security, then App Store / Play paperwork |
| **Privacy & recovery** | Store labels / GDPR-APPI; restore drills + RPO/RTO |
| **Growth gate** | Answer-engine (AEO) visibility + store listing ASO |
| **Authenticity** | `plan-antislop` — prose/visual/code slop pass |

**Quick start (six-skill loop only):**

1. `plan-uiux-unification` — UI/UX + design system
2. `plan-stub-checker` — dead buttons, fake data, unwired handlers
3. `plan-test-coverage` — user stories → test matrix, fake-green gaps
4. `plan-perf-audit` + `plan-security-audit` — performance + security (parallel)
5. `plan-docs-sync` — docs match reality (**last**)

**Say in Cursor:**

```
Run the six-skill plan loop — plan only, no fixes until I approve each phase.
```

For security or launch prep, see the other loop prompts in [PLAN-LOOPS.md](PLAN-LOOPS.md).

---

## Get help

- [PLAN-LOOPS.md](PLAN-LOOPS.md) — how to chain the 20 planning skills
- [AGENTS.template.md](AGENTS.template.md) — project constitution for your app repo
- [GitHub Issues](https://github.com/kensaurus/cursor-kenji/issues) — bug reports, feature requests
- [GitHub Discussions](https://github.com/kensaurus/cursor-kenji/discussions) — questions, ideas
- [CATALOG.md](CATALOG.md) — full list of skills and their trigger phrases

---

## More from @kensaurus

Other free apps and tools from the same studio — all built with these skills. Full list with descriptions → [README § Also by @kensaurus](../README.md#also-by-kensaurus).

### Mushi Mushi — know when users hit a bug your monitoring missed

```bash
npx mushi-mushi
```

Shake-to-report widget → AI-classified bug reports → optional AI draft PR fix. Free tier 1,000 reports/month, MIT SDK.

- [kensaur.us/mushi-mushi](https://kensaur.us/mushi-mushi) — live demo
- [github.com/kensaurus/mushi-mushi](https://github.com/kensaurus/mushi-mushi) — source + issues
