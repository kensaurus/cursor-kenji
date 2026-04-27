# review

# Pre-Commit Review

> Lint, build, test, and review all uncommitted changes before committing.

---

## Step 1: See What Changed

```bash
git diff --name-only
git diff --stat
git status --short
```

Group changed files by area (UI, API, lib, config, tests).

---

## Step 2: Lint All Changed Files

Run `ReadLints` on every changed file:

```
ReadLints(paths: [<list of changed files from git diff --name-only>])
```

If errors exist, list them with severity. Flag any that were introduced by the current changes (vs pre-existing).

---

## Step 3: Build and Test

```bash
npm run build
```

```bash
npm run test:unit
```

If either fails, report the error and stop the review.

---

## Step 4: Code Quality Scan

For each changed file, check for common issues:

### 4a. Debug artifacts

```
Grep(pattern: "console\\.(log|debug|warn|info)\\(", path: "<changed-file>")
```

Flag any `console.log` that isn't inside an error handler or explicitly marked `// keep`.

### 4b. TODO/FIXME/HACK comments

```
Grep(pattern: "(TODO|FIXME|HACK|XXX)", path: "<changed-file>")
```

List any new ones introduced in this diff.

### 4c. Hardcoded strings in UI

```
Grep(pattern: ">[A-Z][a-z].*<", glob: "**/*.tsx")
```

Flag user-facing text that should use `t()` from i18next.

### 4d. Missing error handling

Check for:
- `async` functions without try/catch or `.catch()`
- Supabase queries without checking `.error`
- `fetch()` calls without response status checks

### 4e. Design system violations

Check changed `.tsx` files against the patterns in `.cursor/rules/design-tokens-enforcement.mdc`:
- Raw Tailwind classes that should be tokens (`text-sm`, `rounded-xl`, `shadow-md`, etc.)
- Direct Radix imports instead of design system wrappers
- Raw HTML elements (`<button>`, `<input>`) outside `design-system/primitives/`

---

## Step 5: Accessibility Quick Check (if Playwright available)

If the changes touch UI components and the dev server is running:

```json
CallMcpTool(server: "user-playwright", toolName: "browser_navigate", arguments: {
  "url": "http://localhost:3000/<affected-route>"
})
```

```json
CallMcpTool(server: "user-playwright", toolName: "browser_evaluate", arguments: {
  "expression": "const script = document.createElement('script'); script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js'; document.head.appendChild(script); await new Promise(r => script.onload = r); const results = await axe.run(); JSON.stringify({ violations: results.violations.length, items: results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.length })) })"
})
```

---

## Step 6: Produce Review Summary

```markdown
## Review Summary

### Build & Test
- Build: PASS / FAIL
- Tests: PASS / FAIL (X passed, Y failed)
- Lint: X errors, Y warnings

### Issues Found

| Severity | File | Issue |
|----------|------|-------|
| error | path/to/file.tsx | [description] |
| warning | path/to/file.ts | [description] |
| info | path/to/file.tsx | [description] |

### Verdict
- READY TO COMMIT / NEEDS FIXES

### Suggested fixes (if any)
1. [fix description]
2. [fix description]
```

---

## Checklist

- [ ] All changed files linted
- [ ] Build passes
- [ ] Tests pass
- [ ] No stray console.logs
- [ ] No new TODOs without context
- [ ] No hardcoded UI strings
- [ ] Error handling present for async operations
- [ ] Design tokens used (no raw Tailwind overrides)
- [ ] Accessibility checked (if UI changes + dev server available)
