# fix-issue

# Fix GitHub Issue

> Fetch a GitHub issue, understand it, find the relevant code, implement the fix, verify, and open a PR.

---

## Step 1: Fetch Issue Details

```bash
gh issue view <number> --json title,body,labels,assignees,comments
```

Extract:
- What the issue is about
- Steps to reproduce (if bug)
- Expected behavior
- Any labels (bug, feature, enhancement)

---

## Step 2: Find Relevant Code

Use the issue title and description to search the codebase:

```
SemanticSearch(query: "<issue description summarized as a question>", target_directories: [])
```

Also try targeted searches:

```
Grep(pattern: "<key symbol or error message from the issue>")
```

Read all relevant files fully before making changes.

---

## Step 3: Implement the Fix

- Follow existing patterns in the codebase
- Keep changes minimal and focused on the issue
- If the fix touches UI, ensure design system tokens are used
- If the fix touches text, ensure i18n `t()` keys are used

---

## Step 4: Verify

### 4a. Lint

```
ReadLints(paths: [<list of changed files>])
```

Fix any lint errors introduced.

### 4b. Build

```bash
npm run build
```

### 4c. Test

```bash
npm run test:unit
```

If a relevant test file exists, run it specifically:

```bash
npx vitest run <path/to/related.test.ts>
```

### 4d. Sentry Check (if available)

Search for related Sentry issues in the changed module:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "projectSlug": "<PROJECT_SLUG>",
  "query": "is:unresolved <module_keyword>"
})
```

---

## Step 5: Commit

```bash
git add <changed files>
git commit -m "$(cat <<'EOF'
fix(<scope>): <short description>

<body explaining why, not what>

Fixes #<number>
EOF
)"
```

---

## Step 6: Push and Open PR

```bash
git push -u origin HEAD
gh pr create --title "fix(<scope>): <short description>" --body "$(cat <<'EOF'
## Summary
Fixes #<number>

<1-3 bullet points explaining the change>

## Test plan
- [ ] Build passes
- [ ] Lint passes
- [ ] Unit tests pass
- [ ] Manual verification of the fix
EOF
)"
```

Return the PR URL when done.

---

## Checklist

- [ ] Issue details read and understood
- [ ] Relevant code found and read fully
- [ ] Fix implemented following existing patterns
- [ ] `ReadLints` passes on changed files
- [ ] `npm run build` passes
- [ ] `npm run test:unit` passes
- [ ] Sentry checked for related issues (if available)
- [ ] Committed with `Fixes #<number>` footer
- [ ] PR opened with summary and test plan
