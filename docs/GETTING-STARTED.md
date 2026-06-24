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

### Individual skills

| Type this in chat… | What happens |
|:-------------------|:-------------|
| `audit my app's security` | Scans for OWASP vulnerabilities, checks auth, flags secrets in code |
| `make this page look better` | Improves layout, spacing, hierarchy — like a designer would |
| `commit my changes` | Writes a proper conventional commit message for you |
| `audit my database schema` | Checks naming, indexes, RLS policies, data types |
| `deploy my npm package` | Walks through Changesets → CI → publish, step by step |
| `write a PR` | Creates the pull request with a proper title and description |
| `red team this app` | Adversarial sweep — UX, data pipeline, security, performance |

The AI picks the right skill automatically based on what you typed.

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

**17 `plan-*` skills** run **before** you change code. They produce burndowns and phased roadmaps. You approve each phase, then run the matching execution skills.

**Full guide:** [PLAN-LOOPS.md](PLAN-LOOPS.md) — grouped loops (not one mega-chain):

| Loop | When to run |
|:-----|:------------|
| **Six-skill loop** | UI/IA hardening on an inherited codebase |
| **Pre-launch hardening** | Security spine + dependency provenance |
| **Observability & spend** | Sentry/Langfuse gaps, LLM cost caps |
| **Mobile gate** | Capacitor native security, then App Store / Play paperwork |
| **Growth gate** | Answer-engine (AEO) visibility |
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

- [PLAN-LOOPS.md](PLAN-LOOPS.md) — how to chain the 17 planning skills
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
