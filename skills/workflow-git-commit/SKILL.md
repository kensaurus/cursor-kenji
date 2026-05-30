---
name: workflow-git-commit
description: Generate clear, descriptive commit messages following conventional commits format. Use when committing code, writing commit messages, or when the user asks for help with git commits.
---

# Git Commit Message Generator

Generate clear, meaningful commit messages following best practices.

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
# View staged changes
git diff --staged

# View changed files
git status
```

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
Fixed the bug.                    # Vague, past tense
feat(cart): Added new feature     # Past tense, vague
Update stuff                      # No type, vague
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
# Stage and commit
git add .
git commit -m "feat(scope): description"

# Amend last commit message
git commit --amend -m "new message"

# Interactive staging
git add -p

# View commit history
git log --oneline -10
```

## Commit Message Template

Create `~/.gitmessage`:
```
# <type>(<scope>): <subject>
# |<----  Using a Maximum Of 50 Characters  ---->|

# Explain why this change is being made
# |<----   Try To Limit Each Line to a Maximum Of 72 Characters   ---->|

# Provide links or keys to any relevant tickets, articles or other resources
# Example: Fixes #23

# --- COMMIT END ---
# Type can be:
#    feat     (new feature)
#    fix      (bug fix)
#    refactor (refactoring code)
#    style    (formatting, missing semi colons, etc)
#    docs     (changes to documentation)
#    test     (adding or refactoring tests)
#    chore    (updating grunt tasks etc)
# --------------------
```

Set as default:
```bash
git config --global commit.template ~/.gitmessage
```
