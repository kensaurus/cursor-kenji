# Create Pull Request

## Purpose
Commit current changes, push the branch, and open a pull request with a clear title and description.

## Process

### 1. Pre-flight
```bash
git diff --stat          # Confirm scope of changes
npx tsc --noEmit         # No type errors
npm run lint             # No lint issues
npm run test             # Tests pass
```

### 2. Commit
```bash
git add .
git diff --staged        # Review what's staged
```

Write a commit message following this format:
```
<type>: <short summary>

- change 1
- change 2
```

Types: `feat` | `fix` | `refactor` | `chore` | `docs` | `style` | `test`

```bash
git commit -m "feat: <summary>"
```

### 3. Push
```bash
git push origin HEAD
```

If the branch doesn't exist remotely yet:
```bash
git push -u origin HEAD
```

### 4. Open PR
```bash
gh pr create \
  --title "<type>: <summary>" \
  --body "$(cat <<'EOF'
## Summary
- <what changed>
- <why>

## Test plan
- [ ] <how to verify>
- [ ] Checked console for errors
- [ ] Tested on mobile (if UI change)

EOF
)"
```

Return the PR URL.

### 5. Checklist
- [ ] All checks pass (types, lint, tests, build)
- [ ] Commit message is clear and follows convention
- [ ] PR title matches commit type
- [ ] PR description explains the why, not just the what
- [ ] Test plan covers the change
- [ ] No debug logs, commented-out code, or temporary hacks
- [ ] No unrelated changes in the PR
