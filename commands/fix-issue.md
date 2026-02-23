# Fix GitHub Issue

## Purpose
Fetch an issue, understand it fully, implement a fix, and open a pull request — in one workflow.

## Usage
```
/fix-issue 123
```

## Process

### 1. Fetch Issue Details
```bash
gh issue view <number> --json title,body,labels,assignees,comments
```

Read the full issue including comments — often the comments contain reproduction steps, context, or constraints the original body missed.

### 2. Understand the Scope
- What is the expected vs actual behavior?
- Is this a bug, enhancement, or regression?
- Are there linked PRs or related issues?
- What is the acceptance criteria?

### 3. Find Relevant Code
Search the codebase using the issue's described behavior, error messages, or affected feature name. Let the agent find files via grep and semantic search — don't manually tag unless you know the exact file.

### 4. Reproduce (if bug)
- Write a failing test or identify the failing scenario
- Confirm you can reproduce before fixing
- Note the root cause explicitly

### 5. Implement the Fix
- Match existing patterns exactly
- Minimal change — fix only what the issue describes
- Add a test covering the fixed case
- Don't refactor unrelated code in the same PR

### 6. Verify
```bash
npx tsc --noEmit
npm run lint
npm run test
```

Check the specific scenario from the issue is resolved.

### 7. Open Pull Request
```bash
git add .
git commit -m "fix: <short description> (#<issue-number>)"
git push origin HEAD
gh pr create \
  --title "fix: <short description> (#<issue-number>)" \
  --body "Closes #<issue-number>

## What changed
- <bullet>

## How to test
- <step>"
```

Return the PR URL.

## Checklist
- [ ] Issue fully read including comments
- [ ] Root cause identified (not just symptom fixed)
- [ ] Test added for the fixed case
- [ ] All checks pass
- [ ] PR references the issue number
- [ ] No unrelated changes included
