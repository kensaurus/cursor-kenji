# Promotion Checklist

Everything you need to submit and announce cursor-kenji. Repo-side requirements (plugin manifest, docs, npm OIDC) are done. External listings may take manual review.

**Tracking:** [DISTRIBUTION.md](DISTRIBUTION.md) · Maintainer releases: [PUBLISHING.md](PUBLISHING.md)

---

## 1. cursor.directory

**URL:** https://cursor.directory/plugins/new

**What to fill in:**
- Repository URL: `https://github.com/kensaurus/cursor-kenji`
- The site auto-detects skills from `skills/*/SKILL.md`, rules from `rules/`, agents from `agents/`, MCP config from `.mcp.json`
- No extra config needed — the repo structure matches the Open Plugins standard

**Status:** [x] Submitted — https://cursor.directory/plugins/cursor-kenji (pending security scan)

---

## 2. skills.sh listing

**URL:** https://skills.sh

**Install command already works:**
```bash
npx skills add kensaurus/cursor-kenji
```

**Issue opened:** https://github.com/vercel-labs/skills/issues/1499

**Status:** [x] Submitted — awaiting index merge

---

## 3. awesome-cursorrules

**URL:** https://github.com/PatrickJS/awesome-cursorrules

**How:** Open a PR adding cursor-kenji to the Directories section.

**PR copy:**
```markdown
- [cursor-kenji](https://github.com/kensaurus/cursor-kenji) — 90 production-ready agent skills,
  13 slash commands, 5 subagents, and MCP configs for React/Next.js/Supabase development.
  `npx skills add kensaurus/cursor-kenji`
```

**Status:** [x] PR opened — https://github.com/PatrickJS/awesome-cursorrules/pull/320

---

## 4. npm publish

**Prerequisite:** npm account in the `@kensaurus` org.

**Preferred — Trusted Publishing (OIDC):** configured ✅

- Publisher: `kensaurus/cursor-kenji` · workflow `npm-publish.yml` · permission `npm publish`
- Create a GitHub Release (tag `v1.4.x`) → `.github/workflows/npm-publish.yml` publishes with `--provenance`

**Fallback — `NPM_TOKEN` secret:** optional; CI uses OIDC when the secret is unset.

**Verify at:** https://www.npmjs.com/package/@kensaurus/cursor-kenji

**Status:** [x] Published — `@kensaurus/cursor-kenji@1.4.1` ([npm](https://www.npmjs.com/package/@kensaurus/cursor-kenji))

---

## 5. Cursor Marketplace (official)

**URL:** https://cursor.com/marketplace/publish

**Repo requirement:** [`.cursor-plugin/plugin.json`](../.cursor-plugin/plugin.json) at repo root ✅

Submit the GitHub repo URL; Cursor reviews manually.

**Status:** [x] Submitted — publisher application received (awaiting Cursor review)

---

## 6. CursorList / Enterprise DNA directory

**URLs:**
- https://cursorlist.com
- https://enterprisedna.co/directories/submit (alternative submission form)

**One-liner description:**
> 90 Cursor agent skills for React/Next.js/Supabase — installs in one command.

**Status:** [x] Submitted via fallback form at enterprisedna.co/directories/submit (Skills directory; email draft to directories@enterprisedna.co)

---

## 7. agentskills.io

**URL:** https://agentskills.io

All skills validate against the [Agent Skills specification](https://agentskills.io/specification) in CI.

**Showcase request:** https://github.com/agentskills/agentskills/issues/432

**Status:** [x] Submitted — awaiting showcase listing

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

## 8. Cross-promote via Mushi Mushi

Mushi Mushi's README already mentions cursor-kenji skills:
> "Install Mushi skills in your Cursor or Claude Code project"
> `npx skills add kensaurus/mushi-mushi`

Reciprocal links are live in cursor-kenji's README ("Also by @kensaurus" section).

**Optional:** Add a note to Mushi's GitHub Issues template pointing users to cursor-kenji's `debug-sentry-monitor` skill for Sentry triage from Cursor.

**Status:** [x] Done (reciprocal links live)

---

## Post-launch tracking

- Watch GitHub stars (badge in README)
- Watch npm download count: https://www.npmjs.com/package/@kensaurus/cursor-kenji
- Check skills.sh install count (if they expose it)
- Monitor GitHub Issues for user feedback
- Directory status table: [DISTRIBUTION.md](DISTRIBUTION.md)
