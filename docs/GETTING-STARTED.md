# Getting Started with cursor-kenji

A plain-language guide for non-technical users and Cursor beginners.

---

## What is this?

**cursor-kenji** is a collection of "skills" for [Cursor](https://cursor.com) — the AI-powered code editor.

Think of skills like apps on a phone. You install them once and they're there when you need them. When you type something in Cursor chat — like "audit my security" or "make this page look better" — the matching skill activates and tells the AI exactly how to do that job properly.

Without skills, the AI does its best. With skills, it follows a specific, production-tested workflow.

---

## Step 1: Install Cursor

If you don't have Cursor yet: [download it at cursor.com](https://cursor.com). It's free and it's basically VS Code with a very capable AI built in.

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

Open Cursor, open a project, and type in the chat. You don't have to remember skill names. Just describe what you want:

| Type this in chat… | What happens |
|:-------------------|:-------------|
| `audit my app's security` | Scans for OWASP vulnerabilities, checks auth, flags secrets in code |
| `make this page look better` | Improves layout, spacing, hierarchy — like a designer would |
| `fix this bug` | Reproduces, finds root cause, patches, verifies |
| `commit my changes` | Writes a proper conventional commit message for you |
| `audit my database schema` | Checks naming, indexes, RLS policies, data types |
| `add a feature: user notifications` | Runs spec → plan → TDD loop before writing a line |
| `deploy my npm package` | Walks through Changesets → CI → publish, step by step |
| `write a PR` | Creates the pull request with a proper title and description |

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

## Get help

- [GitHub Issues](https://github.com/kensaurus/cursor-kenji/issues) — bug reports, feature requests
- [GitHub Discussions](https://github.com/kensaurus/cursor-kenji/discussions) — questions, ideas
- [CATALOG.md](CATALOG.md) — full list of skills and their trigger phrases
