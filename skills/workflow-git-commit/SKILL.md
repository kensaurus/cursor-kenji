---
name: git-workflow
description: Git branching, commits, and release workflows. Use when setting up branching strategies, writing commit messages, managing releases, merge conflicts, or when user mentions "git", "commit message", "branch", "PR", "pull request", "merge", "rebase", "release", or "changelog".
---

# Git Workflow Skill

Standardized git workflows for team collaboration and release management.

## When to Use

- Setting up branching strategy
- Writing commit messages
- Creating pull requests
- Managing releases
- Resolving merge conflicts
- Establishing git conventions

## CRITICAL: Check Existing First

**Before ANY git operations, verify:**

1. **Check existing conventions:**
```bash
cat CONTRIBUTING.md .github/pull_request_template.md 2>/dev/null
git log --oneline -20  # See existing commit message style
```

2. **Check for git hooks:**
```bash
ls -la .git/hooks/ .husky/ .github/hooks/ 2>/dev/null
cat package.json | grep -A5 "husky\|lint-staged\|commitlint"
```

3. **Check branch protection:**
```bash
git remote -v
gh repo view --json defaultBranchRef,branchProtectionRules 2>/dev/null
```

4. **Check for CI/CD requirements:**
```bash
ls -la .github/workflows/ .gitlab-ci.yml 2>/dev/null
```

**Why:** Projects often have established conventions. Follow existing patterns before imposing new ones.

## Branching Strategies

### GitHub Flow (Recommended for most projects)

```
main (always deployable)
  └── feature/add-user-auth
  └── fix/login-bug
  └── chore/update-deps
```

**Rules:**
- `main` is always deployable
- Branch from `main` for all work
- Use descriptive branch names
- Delete branches after merge

### GitFlow (For scheduled releases)

```
main (production)
  └── develop (integration)
        └── feature/new-feature
        └── release/v1.2.0
        └── hotfix/critical-bug
```

**When to use:** Apps with scheduled releases, mobile apps, versioned libraries

## Branch Naming

```
<type>/<description>

Types:
- feature/  - New functionality
- fix/      - Bug fixes
- chore/    - Maintenance, deps
- docs/     - Documentation
- refactor/ - Code restructuring
- test/     - Adding tests

Examples:
- feature/user-authentication
- fix/login-redirect-loop
- chore/upgrade-react-19
- docs/api-documentation
- refactor/extract-user-service
```

## Conventional Commits

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description | Bump |
|------|-------------|------|
| `feat` | New feature | MINOR |
| `fix` | Bug fix | PATCH |
| `docs` | Documentation only | - |
| `style` | Formatting, no code change | - |
| `refactor` | Code change, no feature/fix | - |
| `perf` | Performance improvement | PATCH |
| `test` | Adding tests | - |
| `chore` | Build, deps, config | - |
| `ci` | CI/CD changes | - |

### Examples

```bash
# Feature
feat(auth): add social login with Google OAuth

# Bug fix
fix(cart): prevent duplicate items on rapid clicks

# Breaking change
feat(api)!: change user endpoint response format

BREAKING CHANGE: User endpoint now returns `{ data: user }` instead of `user`

# With scope
fix(ui/button): correct hover state on disabled buttons

# With body
refactor(database): migrate from raw SQL to Prisma

- Add Prisma schema
- Generate migrations
- Update all database queries
- Remove pg client dependency

# With issue reference
fix(auth): handle expired refresh tokens

Closes #123
```

## Commit Best Practices

### Do
- Write in imperative mood ("add" not "added")
- Keep subject under 72 characters
- Separate subject from body with blank line
- Reference issues/PRs in footer
- Make atomic commits (one logical change)

### Don't
- Use vague messages ("fix bug", "update stuff")
- Mix unrelated changes in one commit
- Include generated files (build/, node_modules/)
- Commit broken code to main

## Pull Request Workflow

### Creating PRs

```bash
# Update branch with latest main
git checkout main
git pull origin main
git checkout feature/my-feature
git rebase main

# Push and create PR
git push -u origin feature/my-feature
gh pr create --title "feat: add user authentication" --body "..."
```

### PR Template

```markdown
## Summary
Brief description of changes

## Changes
- Added X
- Updated Y
- Fixed Z

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] No console errors

## Screenshots (if UI change)
Before | After
--- | ---
img | img

## Related Issues
Closes #123
```

### Code Review Checklist

**Reviewer should check:**
- [ ] Code follows project conventions
- [ ] No obvious bugs or edge cases
- [ ] Tests cover new functionality
- [ ] No security vulnerabilities
- [ ] Performance considerations
- [ ] Documentation updated if needed

## Merge Strategies

| Strategy | When to Use | Command |
|----------|-------------|---------|
| **Merge commit** | Preserve full history | `git merge` |
| **Squash merge** | Clean history, many small commits | `gh pr merge --squash` |
| **Rebase merge** | Linear history | `gh pr merge --rebase` |

**Recommended:** Squash merge for features, merge commit for releases

## Release Workflow

### Semantic Versioning

```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └── Bug fixes (backward compatible)
  │     └── New features (backward compatible)
  └── Breaking changes
```

### Creating a Release

```bash
# 1. Update version
npm version patch  # or minor, major

# 2. Update changelog
# (manual or use conventional-changelog)

# 3. Create release tag
git tag -a v1.2.3 -m "Release v1.2.3"

# 4. Push with tags
git push origin main --tags

# 5. Create GitHub release
gh release create v1.2.3 --title "v1.2.3" --notes "Release notes..."
```

### Changelog Format

```markdown
# Changelog

## [1.2.3] - 2024-01-15

### Added
- User authentication with OAuth

### Changed
- Updated dashboard layout

### Fixed
- Login redirect loop (#123)

### Deprecated
- Legacy API endpoints (removed in 2.0)

### Security
- Fixed XSS vulnerability in comments
```

## Handling Conflicts

### During Rebase

```bash
# Start rebase
git rebase main

# If conflict:
# 1. Open conflicted files
# 2. Resolve conflicts (keep/modify code)
# 3. Stage resolved files
git add <resolved-files>

# 4. Continue rebase
git rebase --continue

# Or abort if needed
git rebase --abort
```

### Conflict Resolution Tips

```
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name

# Resolution options:
# 1. Keep yours
# 2. Keep theirs
# 3. Keep both (if compatible)
# 4. Write new code combining both
```

## Git Hooks

### Pre-commit (lint & format)

```bash
#!/bin/sh
# .git/hooks/pre-commit or via husky

npm run lint-staged
```

### Commit-msg (validate message)

```bash
#!/bin/sh
# Validate conventional commit format

commit_msg=$(cat "$1")
pattern="^(feat|fix|docs|style|refactor|perf|test|chore|ci)(\(.+\))?: .{1,72}"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "Invalid commit message format"
  echo "Expected: type(scope): description"
  exit 1
fi
```

### Pre-push (run tests)

```bash
#!/bin/sh
# .git/hooks/pre-push

npm test
```

## Common Git Commands

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Amend last commit message
git commit --amend -m "new message"

# Interactive rebase (squash, reorder)
git rebase -i HEAD~3

# Cherry-pick commit to current branch
git cherry-pick <commit-hash>

# Stash changes
git stash
git stash pop

# View commit history
git log --oneline --graph

# Find commit that introduced bug
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
```

## Git Configuration

```bash
# Recommended settings
git config --global pull.rebase true
git config --global fetch.prune true
git config --global diff.colorMoved zebra
git config --global init.defaultBranch main

# Aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --decorate"
```

## Workflow Checklist

### Before Starting Work
- [ ] Pull latest main
- [ ] Create feature branch
- [ ] Understand requirements

### During Development
- [ ] Make atomic commits
- [ ] Use conventional commit format
- [ ] Keep branch up to date with main
- [ ] Write/update tests

### Before PR
- [ ] Rebase on latest main
- [ ] Squash fixup commits
- [ ] Run tests locally
- [ ] Self-review changes

### After Merge
- [ ] Delete feature branch
- [ ] Verify deployment
- [ ] Close related issues
