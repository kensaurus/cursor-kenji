# Promotion Checklist

Everything you need to submit and announce cursor-kenji. All repo-side requirements are already done. The items below require your account/login.

---

## 1. cursor.directory

**URL:** https://cursor.directory/plugins/new

**What to fill in:**
- Repository URL: `https://github.com/kensaurus/cursor-kenji`
- The site auto-detects skills from `skills/*/SKILL.md`, rules from `rules/`, agents from `agents/`, MCP config from `.mcp.json`
- No extra config needed — the repo structure matches the Open Plugins standard

**Status:** [ ] Submitted

---

## 2. skills.sh listing

**URL:** https://skills.sh

**Install command already works:**
```bash
npx skills add kensaurus/cursor-kenji
```

If skills.sh has a submit/index page, submit via:
- https://github.com/vercel-labs/skills/issues → open an issue requesting indexing of `kensaurus/cursor-kenji`

**Copy for the issue:**
```
Title: Add kensaurus/cursor-kenji

90 Cursor agent skills for React/Next.js/Supabase development.
Install: `npx skills add kensaurus/cursor-kenji`
Repo: https://github.com/kensaurus/cursor-kenji
```

**Status:** [ ] Submitted

---

## 3. awesome-cursorrules

**URL:** https://github.com/PatrickJS/awesome-cursorrules

**How:** Open a PR adding cursor-kenji to the appropriate section.

**PR copy:**
```markdown
## cursor-kenji

- [cursor-kenji](https://github.com/kensaurus/cursor-kenji) — 90 production-ready agent skills,
  13 slash commands, 5 subagents, and MCP configs for React/Next.js/Supabase development.
  `npx skills add kensaurus/cursor-kenji`
```

**Status:** [ ] PR opened

---

## 4. npm publish

**Prerequisite:** npm account in the `@kensaurus` org.

**Preferred — Trusted Publishing (OIDC):** configured ✅

- Publisher: `kensaurus/cursor-kenji` · workflow `npm-publish.yml` · permission `npm publish`
- Create a GitHub Release (tag `v1.4.x`) → `.github/workflows/npm-publish.yml` publishes with `--provenance`

**Fallback — `NPM_TOKEN` secret:** optional; CI uses OIDC when the secret is unset.

**Verify at:** https://www.npmjs.com/package/@kensaurus/cursor-kenji

**Status:** [x] Published — `npm view @kensaurus/cursor-kenji version` (latest **1.4.x**)

---

## 5. CursorList

**URL:** https://cursorlist.com (or check current URL)

Submit the repo link via their submission form.

**One-liner description:**
> 90 Cursor agent skills for React/Next.js/Supabase — installs in one command.

**Status:** [ ] Submitted

---

## 6. agentskills.io

**URL:** https://agentskills.io

Submit via their listing form.

**Status:** [ ] Submitted

---

## Launch copy drafts

### Reddit (r/cursor, r/ChatGPT, r/webdev)

```
Title: I packaged 90 Cursor AI skills so you don't have to build them yourself

I got tired of writing the same Cursor prompts every time I started a debugging session
or wanted to polish a UI. So I built cursor-kenji — a collection of 90 agent skills that
Cursor picks automatically based on what you type.

Say "audit my security" → it runs an OWASP scan.
Say "make this page nicer" → it applies NN/g heuristics.
Say "commit my changes" → it writes a proper conventional commit.

Install in one line:
npx skills add kensaurus/cursor-kenji

Covers: React, Next.js, Supabase, TypeScript, React Native, Capacitor, debugging,
testing, deploy, MCP, and more. MIT licensed.

GitHub: https://github.com/kensaurus/cursor-kenji
```

### X / Twitter

```
I built 90 Cursor agent skills so you don't have to:

• audit security → OWASP scan runs
• "make this nicer" → NN/g UX polish
• "commit" → proper conventional commit message

One install, 90 skills auto-activate:
npx skills add kensaurus/cursor-kenji

→ github.com/kensaurus/cursor-kenji
```

### dev.to / Hashnode article outline

```
Title: 90 Cursor AI Skills That Fire Automatically (No Prompting Required)

1. The problem: writing the same prompts over and over
2. What Cursor skills are and how they work
3. What's in cursor-kenji (90 skills, 13 commands, 5 subagents)
4. How to install (one line)
5. Demo: 5 skills in action with example prompts
6. How to add your own skills
```

---

## 7. Cross-promote via Mushi Mushi

Mushi Mushi's README already mentions cursor-kenji skills:
> "Install Mushi skills in your Cursor or Claude Code project"
> `npx skills add kensaurus/mushi-mushi`

Reciprocal links are live in cursor-kenji's README ("Also by @kensaurus" section).

**Optional:** Add a note to Mushi's GitHub Issues template pointing users to cursor-kenji's `debug-sentry-monitor` skill for Sentry triage from Cursor.

**Status:** [ ] Done (links already live)

---

## Post-launch tracking

- Watch GitHub stars (badge in README)
- Watch npm download count: https://www.npmjs.com/package/@kensaurus/cursor-kenji
- Check skills.sh install count (if they expose it)
- Monitor GitHub Issues for user feedback
