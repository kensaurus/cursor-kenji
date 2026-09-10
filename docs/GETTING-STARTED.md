# Getting Started with cursor-kenji

A short guide for first-time Cursor users.

---

## What is this?

**cursor-kenji** is not a prompt library. It is a set of installed playbooks for [Cursor](https://cursor.com), Claude Code, Codex CLI, and Gemini CLI. You describe the job in chat — "audit my security", "grill me before I build", "fix this and ship it" — and a named workflow runs: look first, change, prove it, then go live.

---

## Step 1: Install Cursor

If you don't have Cursor yet: [download it at cursor.com](https://cursor.com).

---

## Step 2: Install cursor-kenji

```bash
npx @kensaurus/cursor-kenji --all
```

That installs skills **and** slash commands (and agents/rules) for every tool the installer supports, then hash-checks the copies. Windows works too, including from a clone of this repo.

**Skills only** (no `/commands` — Vercel skills CLI, current project by default):

```bash
npx skills add kensaurus/cursor-kenji
```

Add `-g` to put skills in `~/.cursor/skills`. That CLI's `--all` means “all skills to all agents”, not the same as kenji `--all`.

**Alternative — clone:**

```bash
git clone https://github.com/kensaurus/cursor-kenji.git
cd cursor-kenji
./install.sh
```

From a clone you can also run `node bin/install.mjs --all`. Re-check anytime with `npx @kensaurus/cursor-kenji --verify --all`.

**Claude Code as a plugin** (this repo as a marketplace — not the Anthropic community catalog until they list it):

```
/plugin marketplace add kensaurus/cursor-kenji
/plugin install cursor-kenji@cursor-kenji
```

---

## Step 3: Restart Cursor

Close and reopen Cursor. The skills are now active.

---

## A typical session

The usual failure is the agent building the wrong thing. This loop prevents that.

### 1. Get oriented (new repo only)

```
I'm new to this repo, orient me
```

### 2. Get grilled before any code

```
/grill-me I want to add a referral program
```

The agent interviews you — **one question at a time**, each with a recommended answer:

> *"Should a referral reward fire on signup or on first payment? I'd recommend
> first payment — it prevents signup-farming. Agree?"*

It looks up facts in the codebase and only asks you the decisions. The session ends with a decision log.

### 3. Build from the decisions

```
build the feature from those decisions
```

`workflow-build-feature` takes over: spec → failing test → code → smoke test → PR.

### 4. Hand off when you stop

```
/handoff finish the referral UI tomorrow
```

You get a compact handoff document saved outside your repo. Tomorrow, paste its path into a fresh chat.

**The rhythm: orient → grill → build → prove → hand off.**

---

## Step 4: Say what you want

You don't have to remember skill names. A few phrases that do a lot of work:

| Type this in chat… | What happens |
|:-------------------|:-------------|
| `build a feature: user notifications` | Spec → TDD → implement → smoke → PR |
| `fix this Sentry error and ship it` | Triage → reproduce → fix → verify → PR |
| `is this ready to ship?` | Adversarial test + security + bundle + perf |
| `prepare this for a PR` | Review dirty tree → commit → push → open PR (does not merge) |
| `monkey-test as guest and logged-in, ticket every real bug, then lock a Playwright pass on the worst ones` | Wander twice → tickets → lock the worst bugs |
| `grill me about this plan` | One question at a time until you're aligned |
| `audit my app's security` | OWASP-style findings with file:line |
| `complete everything` | Close the plan — no parked leftovers |

Full phrase list → [TRIGGER-CHEATSHEET.md](TRIGGER-CHEATSHEET.md). Plan loops (approve before edits) → [PLAN-LOOPS.md](PLAN-LOOPS.md).

---

## Updating

```bash
npx @kensaurus/cursor-kenji --all
npx @kensaurus/cursor-kenji --verify --all
```

The installer merge-overwrites same-name files and hash-checks them. Extra personal skills are left alone.

Skills-only refresh: `npx skills add kensaurus/cursor-kenji` (does not update slash commands).

---

## Frequently asked questions

**Do I need to configure anything?**
No, for most skills. Skills that talk to Sentry, Supabase, or Langfuse tell you when they need API keys.

**Will this slow down Cursor?**
No. Skills are text files, loaded only when relevant.

**Can I delete skills I don't need?**
Yes — delete the folder from `~/.cursor/skills/`.

**Can I add my own skills?**
Yes. See [CONTRIBUTING.md](../CONTRIBUTING.md).

**Does this work with Claude, Codex, or Gemini?**
Yes. `npx @kensaurus/cursor-kenji --all` installs the full pack for Cursor and Claude Code, and ports rules plus a few commands to Codex CLI and Gemini CLI. Skills-only: `npx skills add kensaurus/cursor-kenji`. Claude Code plugin: `/plugin marketplace add kensaurus/cursor-kenji`. Cursor models still read the same skill text.

**Is it free?**
Yes, MIT licensed.

---

## Get help

- [PLAN-LOOPS.md](PLAN-LOOPS.md) — how to chain the 21 planning skills
- [AGENTS.template.md](AGENTS.template.md) — project constitution for your app repo
- [GitHub Issues](https://github.com/kensaurus/cursor-kenji/issues)
- [GitHub Discussions](https://github.com/kensaurus/cursor-kenji/discussions)
- [CATALOG.md](CATALOG.md) — full list of skills and trigger phrases

---

## More from @kensaurus

Other apps and tools from the same studio. Full list → [README § More from KENSAURUS](../README.md#more-from-kensaurus).

### Mushi Mushi — in-app bug reports your monitoring missed

```bash
npx mushi-mushi
npx skills add kensaurus/mushi-mushi
```

`npx mushi-mushi` is the published CLI. `npx skills add` installs the Cursor/Claude skills. Shake-to-report widget → AI-classified bug reports → optional AI draft PR. MIT SDK.

- [kensaur.us/mushi-mushi](https://kensaur.us/mushi-mushi)
- [github.com/kensaurus/mushi-mushi](https://github.com/kensaurus/mushi-mushi)
