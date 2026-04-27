# commit

# Smart Pre-Commit & Commit

> Lint, check for related Sentry issues, auto-detect scope, build, and commit with a conventional message.

---

## Step 1: Analyze Changes

### 1a. See what changed

```bash
git status
git diff --stat
git diff --name-only
```

### 1b. Auto-detect scope

From the changed file paths, determine the commit scope:

| Changed Files Pattern | Scope |
|----------------------|-------|
| `app/` or `src/components/` | `ui` or the specific component/page name |
| `api/` or `server/` or `supabase/functions/` | `api` or the specific endpoint |
| `lib/` or `utils/` | `lib` or the specific utility name |
| `hooks/` | `hooks` |
| `stores/` or `store/` | `store` |
| `types/` or `*.types.ts` | `types` |
| `*.config.*` or `.env*` | `config` |
| `docs/` or `*.md` | `docs` |
| `tests/` or `*.test.*` or `*.spec.*` | `test` |
| `package.json` / lock files | `deps` |
| Multiple unrelated areas | Use the most impactful area, or omit scope |

If all changes are in one folder like `app/settings/`, use that as scope: `feat(settings): ...`

### 1c. Auto-detect commit type

| Change Pattern | Type |
|---------------|------|
| New file(s) added, new feature logic | `feat` |
| Bug fixed (error handling, wrong behavior) | `fix` |
| Code restructured, no behavior change | `refactor` |
| Build/config/tooling changes | `chore` |
| Documentation only | `docs` |
| Formatting/whitespace only | `style` |
| Performance improvement | `perf` |
| Test added or fixed | `test` |

---

## Step 2: Pre-Commit Quality Checks

### 2a. Lint all changed files

Run `ReadLints` on every changed file to catch errors before committing:

```
ReadLints(paths: [<list of changed files from git diff --name-only>])
```

If lint errors exist:
- **Fix them** before proceeding
- Re-run `ReadLints` to confirm they're resolved

### 2b. Build check

Detect and run the project's build command:

```bash
npm run build       # or: pnpm build / yarn build / bun build
npm run lint        # if separate from build
npm run typecheck   # if available
```

If any fail, fix the errors before proceeding.

### 2c. Sentry pre-commit check (if Sentry MCP available)

Check if any changed files have related unresolved Sentry issues:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "projectSlug": "<PROJECT_SLUG>",
  "query": "is:unresolved <filename_or_module_keyword>"
})
```

If related issues exist:
- Mention them in the commit body (e.g., `Related: PROJ-123`)
- If the commit fixes the issue, use `Fixes: PROJ-123` in the footer

### 2d. Changelog check

```
Glob("CHANGELOG*")
Glob("constants/changelog*")
```

If a changelog file exists and the commit is `feat` or `fix`:
- Remind to update the changelog
- Check if it was already modified in this commit: `git diff --name-only | grep -i changelog`

---

## Step 3: Craft the Commit Message

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Rules

- **Subject**: imperative mood ("add feature" not "added feature"), max 72 chars, no period
- **Body**: explain WHY, not WHAT (the diff shows what changed)
- **Footer**: references to issues, breaking changes

### Type Reference

| Type | When to Use |
|------|-------------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `refactor` | Code restructuring (no behavior change) |
| `chore` | Build, config, tooling, deps |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (no logic change) |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |

### Examples

```
feat(chat): add streaming response support

Enable real-time token streaming for AI chat responses using
Vercel AI SDK's useChat hook with onStream callback.

Related: PROJ-456
```

```
fix(auth): resolve session timeout on mobile browsers

Safari on iOS aggressively evicts cookies after 7 days of
inactivity. Switch to localStorage fallback with encrypted
token storage.

Fixes: PROJ-123
```

---

## Step 4: Stage and Commit

```bash
git add <specific files>    # prefer explicit over `git add .`
git commit -m "<message>"
```

Use a HEREDOC for multi-line messages:

```bash
git commit -m "$(cat <<'EOF'
feat(scope): subject line

Body explaining why this change was made.

Footer: PROJ-123
EOF
)"
```

---

## Step 5: Push

```bash
git push origin <branch>
```

If the branch doesn't have an upstream yet:

```bash
git push -u origin HEAD
```

---

## Checklist

- [ ] `ReadLints` passes on all changed files
- [ ] Build passes (zero errors)
- [ ] Types pass (if TypeScript)
- [ ] No unrelated changes staged
- [ ] Sentry issues checked (if available)
- [ ] Changelog updated (if `feat` or `fix` and changelog exists)
- [ ] Commit message follows conventional format
- [ ] Scope auto-detected from changed files
- [ ] Pushed to remote
