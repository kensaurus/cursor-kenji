---
description: "Fetch a GitHub issue, find the relevant code, implement the fix, verify, and open a PR"
argument-hint: "[issue number or url]"
---

# /fix-issue

> Fetch a GitHub issue, find the relevant code, implement the fix, verify, and open a PR.

Diagnosis follows **`debug-error`**. The ship loop follows **`workflow-fix-and-ship`** (reproduce before the first edit, a regression check, then `workflow-pr`). This command adds the GitHub issue fetch and the closing PR. It does not replace either skill.

Issue: the argument after `/fix-issue` (number or URL).

## Steps

### 1 — Read the issue

```bash
gh issue view <number> --json title,body,labels,assignees,comments
```

Extract the bug or request, reproduction steps, linked PRs, and labels.

### 2 — Find the code

Search for the component, route, or error text named in the issue. Read the surrounding file before editing. Use whichever search the session actually has. Do not call a tool name that is not in this session.

### 3 — Implement

- Make the minimal change that resolves the issue.
- Follow the repo's existing patterns.
- If UI: design tokens and `t()` keys — no hardcoded strings or hex colours.
- If DB or backend: ship the schema change with the code and verify it. Do not stop at a local migration file.
- Do not delete working code to make the fix smaller.

### 4 — Verify

Run the project's real checks, discovered from `package.json`, the Makefile, or CI. Names like `typecheck`, `lint`, `test`, and `build` are examples, not a required script list. Do not invent `npm run test:unit` when that script is absent.

If the fix touches a UI flow, verify that path the way a user would. A production error also goes through `debug-error` (Sentry context when Sentry is connected).

### 5 — Commit, push, and open the PR

Commit with **`workflow-git-commit`**: named paths only, conventional message, `Fixes #<number>` in the footer. This command then pushes and opens the PR. `/commit` by itself still does not push.

```bash
git push -u origin HEAD
gh pr create --title "fix(<scope>): <short description>" --body "$(cat <<'EOF'
## Summary
Fixes #<number>

<1-3 bullets: problem, root cause, fix>

## Test plan
- [ ] The repo's real checks passed (name them)
- [ ] The reported path was verified
EOF
)"
```

Return the PR URL.

## Checklist

- [ ] Issue read
- [ ] Relevant code read before the edit
- [ ] Reproduced before the edit when the issue is a bug (`workflow-fix-and-ship`)
- [ ] Fix follows existing patterns
- [ ] The repo's own checks passed
- [ ] UI path verified when the fix is user-visible
- [ ] Commit footer is `Fixes #<number>`
- [ ] PR URL returned
