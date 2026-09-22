---
description: "Fetch a GitHub issue, find the relevant code, implement the fix, verify, and open a PR"
argument-hint: "[issue number or url]"
---

# Fix GitHub Issue

Issue number or URL: $ARGUMENTS

---

## Steps

### 1 — Read the issue

```bash
gh issue view <number> --json title,body,labels,assignees,comments
```

Extract:
- The exact bug or feature request
- Reproduction steps (if a bug)
- Any linked PRs or related issues
- Labels that indicate severity or area

### 2 — Find the relevant code

- Search for the component / function / route mentioned in the issue.
- `grep -rn '<error message or symbol>'` to locate the exact line.
- Read the surrounding file to understand context (what must stay identical).

### 3 — Implement the fix

- Make the minimal change that resolves the issue.
- Follow the repo's existing patterns, naming, and style exactly.
- If UI: use design tokens and `t()` i18n keys — no hardcoded strings or hex colours.
- If DB/backend: deploy schema changes, verify with `SET ROLE`, check RLS.
- Never delete working code to make a fix simpler.

### 4 — Verify

Run the project's real checks, in the order its manifest or CI uses them, and fix any failure before continuing. These names are examples — skip any script the repo does not define:

```bash
npm run typecheck       # or: npx tsc --noEmit
npm run lint
npm run build
npm test                # or the unit command the repo actually ships
```

If the fix touches a UI flow, verify the user-visible path works end-to-end.

### 5 — Commit

```bash
git add -p
git commit -m "fix: <short summary>"
```

Include the root cause and why the fix is correct in the commit body, and reference the issue with `Fixes #<number>`.

### 6 — Push and open PR

```bash
git push -u origin HEAD
gh pr create --title "fix: <short summary> (#<number>)" --body "<problem / root cause / fix / testing — closes #<number>>"
```
