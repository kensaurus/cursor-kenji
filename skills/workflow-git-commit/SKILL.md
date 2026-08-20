---
name: workflow-git-commit
description: >
  Create one conventional commit from an already-scoped change: stage
  named files/hunks, write the message, commit, never push. Use when
  "commit these files" or "write a commit message". Whole dirty tree to
  a merge-ready PR → workflow-release-prep.
license: MIT
---

# Git Commit Message Generator

Create one clear, meaningful conventional commit. This skill owns
deliberate staging + commit wording, not release preparation, pushing, or
PR creation. The change must already be logically scoped.

## Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | When to Use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change that neither fixes nor adds |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `chore` | Build, tooling, deps |
| `ci` | CI/CD changes |

### Scope (Optional)

Component or area affected:
```
feat(auth): add OAuth2 support
fix(api): handle rate limit errors
docs(readme): update installation steps
```

---

## Process

### 1. Analyze Changes

```bash
# Read-only: inspect the already-scoped change
git diff --staged

# View changed files
git status --short
```

If the intended scope is not already clear, stop and ask the caller to name
the files or hunks. Stage only those paths/hunks. Never widen scope with
`git add .` or `git add -A`, and never push from this skill.

### 2. Identify Type and Scope

- What kind of change? (feat/fix/refactor/etc.)
- What component is affected?

### 3. Write Subject Line

**Rules:**
- Max 50 characters
- Imperative mood ("add" not "added")
- No period at end
- Lowercase after type

**Good:**
```
feat(cart): add quantity selector to items
fix(auth): prevent session timeout during checkout
refactor(utils): extract date formatting logic
```

**Bad:**
```
Fixed the bug. # Vague, past tense
feat(cart): Added new feature # Past tense, vague
Update stuff # No type, vague
```

### 4. Write Body (If Needed)

When to include:
- Complex changes
- Non-obvious reasoning
- Breaking changes

Format:
```
feat(payments): add Stripe webhook handler

Implement webhook endpoint to process payment events.
Handles succeeded, failed, and refunded events.

Closes #123
```

---

## Examples

### Simple Feature
```
feat(dashboard): add dark mode toggle
```

### Bug Fix with Context
```
fix(api): handle null response from external service

The third-party API occasionally returns null instead of
an empty array. Add null check to prevent TypeError.

Fixes #456
```

### Refactoring
```
refactor(hooks): extract useDebounce from search component

Move debounce logic to reusable hook for consistency
across search inputs throughout the app.
```

### Breaking Change
```
feat(api)!: change response format for user endpoint

BREAKING CHANGE: The /api/users endpoint now returns
{ data: [...], meta: {...} } instead of a plain array.

Migration: Update clients to access users via response.data
```

### Multiple Changes (Avoid!)
If you need to describe multiple things, consider splitting into separate commits:
```
# Instead of:
"fix(auth): fix login and add logout button and update styles"

# Do:
git commit -m "fix(auth): handle expired token error"
git commit -m "feat(auth): add logout button to header"
git commit -m "style(auth): update login form spacing"
```

---

## Quick Reference

```bash
git add -- <named-path> [...]
git commit -m "$(cat <<'EOF'
feat(scope): concise imperative subject

Explain why the change is needed when the subject is not enough.

Refs: #123
EOF
)"
```
