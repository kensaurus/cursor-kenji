# Fix Build & Push

## Purpose
Resolve all build errors, lint issues, type errors, then commit and push to main.

## Process

### 1. Run Build Check
- Execute `npm run build` (or project equivalent)
- Capture all errors and warnings
- Note file locations and error types

### 2. Fix by Priority

**Order:**
1. Type errors (TypeScript)
2. Import/export issues
3. Missing dependencies
4. Lint errors (ESLint)
5. Formatting issues (Prettier)
6. Warnings (address or suppress with reason)

**Common Fixes:**
| Error Type | Action |
|------------|--------|
| Missing type | Add type or import |
| Unused import | Remove |
| Unused variable | Remove or prefix `_` |
| Missing dep | Install or fix import |
| Any type | Add proper type |
| Hook dependency | Fix deps array |

### 3. Verify Clean Build
- Re-run `npm run build`
- Re-run `npm run lint`
- Re-run `npm run typecheck` (if separate)
- Confirm zero errors

### 4. Commit & Push

**Commit Message Format:**
```
<type>: <short summary>

- fix 1
- fix 2
```

**Types:**
- `fix:` bug fixes
- `feat:` new feature
- `refactor:` code cleanup
- `chore:` build/config changes
- `style:` formatting only

**Example:**
```
fix: resolve build errors and type issues

- fix missing Props type in Button component
- remove unused imports in utils
- add null check in useAuth hook
```

### 5. Push
```bash
git add .
git commit -m "fix: resolve build errors"
git push origin main
```

## Checklist
- [ ] Build passes with zero errors
- [ ] Lint passes
- [ ] Types pass
- [ ] No unrelated changes included
- [ ] Commit message clear and descriptive
- [ ] Pushed to main
