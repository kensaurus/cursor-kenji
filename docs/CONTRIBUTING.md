# Contributing to cursor_kenji

Guide for adding, updating, and maintaining skills and commands.

---

## Adding a New Skill

### 1. Create the Directory

```bash
mkdir -p skills/my-skill-name
```

Naming: `<prefix>-<topic>`, lowercase, hyphens only. 13 prefixes:

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
| `protocol-` | Procedural guardrails |
| `test-` | QA, unit tests, acceptance tests |
| `workflow-` | Dev-process skills (git, refactor, PR, spec-TDD) |

Examples: `audit-performance`, `backend-realtime`, `mobile-rn-screen`.

### 2. Create SKILL.md

Every skill needs a `SKILL.md` with YAML frontmatter:

```markdown
---
name: my-skill-name
description: Clear description with trigger words. Use when user mentions "keyword1", "keyword2", or wants "specific task".
license: MIT
---

# My Skill Name

One-line purpose.

## CRITICAL: Check Existing First

**Before ANY action, verify:**

1. **Check for existing patterns:**
```bash
rg "relevant-pattern" --type ts
ls -la relevant/directories/ 2>/dev/null
```

**Why:** [Reason not to duplicate]

## Core Content

### Pattern 1
[Code examples, explanations]

### Pattern 2
[Code examples, explanations]

## Related Skills

- `skill-a` — How it relates
- `skill-b` — How it relates

## Validation

After using this skill:

1. **Check 1** → What to verify
2. **Check 2** → What to verify
3. **Check 3** → What to verify
```

### 3. Quality Checklist

Every skill MUST have:

- [ ] **Frontmatter** with `name` and `description` (include trigger keywords)
- [ ] **"Check Existing First"** section at the top
- [ ] **Production-ready code examples** (no placeholders)
- [ ] **TypeScript** in all code examples (strict, no `any`)
- [ ] **Related Skills** section for cross-referencing
- [ ] **Validation** section with post-implementation checks

### 4. Description Guidelines

The `description` field is critical — it's how Cursor decides when to use the skill.

**Rules:**
- Open with an action verb (`Fix`, `Wire`, `Build`, `Audit`, `Release` …)
- Keep under 300 characters
- Include 3-6 trigger keywords/phrases users actually type
- Never write "This skill provides…" or "This skill should be used when…"
- No AI-tells: avoid `leverage`, `seamless`, `robust`, `powerful`, `elevate`, `cutting-edge`, `delve`, `comprehensive solution`

**Good:**
```yaml
description: Fix slow Postgres queries and N+1 problems. Use when asked about "slow query", "add index", "database timeout", "optimize query", schema design, or RLS policies.
```

**Bad:** <!-- intentional anti-pattern — do not copy -->
```yaml
description: This comprehensive skill leverages powerful AI capabilities to seamlessly help with database stuff.
```

### 5. Voice & tone

- Imperative, direct: "Fix X", "Wire Y", "Run Z"
- No hedging: ~~"This might help with…"~~ → "Use when…"
- No filler: ~~"In order to…"~~ → "To…"
- Body prose: short sentences, bullet points preferred over dense paragraphs

### 6. Language

- `SKILL.md` bodies: English only (SEO + Cursor intent matching)
- `references/*.md` detail files: English tight prose (reference files are link-only, not auto-loaded; Japanese would save zero tokens for typical sessions)

---

## Adding a New Command

### 1. Create the File

```bash
touch commands/my-command.md
```

### 2. Structure

Commands are plain markdown (no frontmatter). They're triggered via `/my-command` in Cursor.

```markdown
# Command Title

## Purpose
One-line description of what this command does.

## Process

### 1. First Step
- Action items
- Commands to run

### 2. Second Step
[...]

## Checklist
- [ ] Verification step 1
- [ ] Verification step 2
```

### 3. Command Design Principles

- **Actionable** — Each step produces a concrete output
- **Sequential** — Steps build on each other
- **Verifiable** — Includes a checklist at the end
- **Self-contained** — Doesn't require external context

---

## Updating Existing Skills

### When to Update

- Library API changed (React 19, Next.js 15+, etc.)
- New patterns emerged as best practice
- Missing coverage for common use case
- Code examples have bugs or are outdated

### Update Process

1. Read the existing skill fully
2. Identify what needs changing
3. Make targeted edits (don't rewrite everything)
4. Ensure backward compatibility
5. Update "Related Skills" if new cross-references exist
6. Test code examples are syntactically valid

### Version Tracking

Use git commit messages to track skill evolution:

```
feat(skills): add React 19 use() patterns to data-visualization
fix(skills): update design-motion for Framer Motion v11 API
docs(skills): add cross-references to enhance-web-web3d
```

---

## Style Guide

### Code Examples

- Use TypeScript, strict mode
- Include type annotations
- Show complete, copy-pasteable examples
- Add comments for non-obvious code
- Use existing project conventions (`@/` imports, `cn()` utility)

### Formatting

- Use tables for comparisons and checklists
- Use code blocks with language tags
- Keep paragraphs short (2-3 sentences max)
- Use headers to create scannable structure
- Avoid filler words

### Naming

| Element | Convention | Example |
|---------|------------|---------|
| Skill name | lowercase-hyphen | `data-visualization` |
| Command name | lowercase | `commit.md` |
| Directory | lowercase-hyphen | `skills/mobile-first/` |
| Code identifiers | Follow TypeScript conventions | `useMediaQuery`, `ButtonProps` |

---

## Testing Skills

### Quick Validation

1. **Syntax check:** Ensure YAML frontmatter is valid
2. **Code check:** Code examples should compile (no syntax errors)
3. **Completeness:** Has all required sections
4. **Accuracy:** Code patterns match current library versions

### In Cursor

1. Copy skill to `~/.cursor/skills/` or run `./install.sh`
2. Start a conversation that should trigger the skill
3. Verify Cursor uses the skill appropriately
4. Check that code suggestions match the skill's patterns

---

## Repository Maintenance

### Git hooks (clone contributors)

After cloning, enable pre-commit validation:

```bash
git config core.hooksPath .githooks
```

This is not run automatically on `npm install` — only set it when working from a git clone.

### Regular Tasks

- [ ] Quarterly: Check all skills against latest library versions
- [ ] Monthly: Review git log for skill-related commits
- [ ] On major release: Update affected skills (React, Next.js, Tailwind, etc.)

### Adding to CATALOG.md

When adding a new skill, also update `docs/CATALOG.md` with:
- Skill entry under appropriate category
- Trigger phrases
- Related skills
- Brief description

### Updating README.md

When adding a new skill:
1. Add to the appropriate category table in README
2. Update the skill count in the file tree
3. Add to "What's Inside" tree if it's a new directory
