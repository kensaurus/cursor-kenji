# Update Dependencies

## Purpose
Safely check for outdated dependencies and update them one by one, running checks after each to catch breaking changes early.

## Process

### 1. Audit Current State
```bash
npm outdated                    # See what's outdated
npm audit                       # Security vulnerabilities
npx npm-check-updates --peer    # See available versions
```

Prioritise:
1. Security vulnerabilities (`npm audit`)
2. Patch updates (safe, bug fixes)
3. Minor updates (new features, non-breaking)
4. Major updates (breaking changes — handle separately)

### 2. Update Strategy

**Patch & minor (safe to batch):**
```bash
npx npm-check-updates --target minor -u
npm install
npx tsc --noEmit && npm run lint && npm run test
```

**Major updates (one at a time):**
```bash
npm install <package>@latest
# Check changelog for breaking changes
npx tsc --noEmit
npm run lint
npm run test
# Fix any breakage before moving to next
```

### 3. Check Changelogs for Major Bumps
For each major version change:
- Read `CHANGELOG.md` or GitHub releases
- Note breaking changes and migration steps
- Update code as needed before moving on

Key packages to check carefully:
- `next` — App Router changes, config API changes
- `react` / `react-dom` — Hook behaviour changes
- `@supabase/ssr` / `@supabase/supabase-js` — Client API changes
- `prisma` — Schema or client API changes
- `tailwindcss` — Config syntax changes (v3→v4 is a full rewrite)
- `zod` — Schema API changes

### 4. Verify After All Updates
```bash
npx tsc --noEmit
npm run lint
npm run test
npm run build
```

Build must pass cleanly.

### 5. Commit
```bash
git add package.json package-lock.json
git commit -m "chore: update dependencies

- <package>: x.x.x → y.y.y
- <package>: x.x.x → y.y.y"
```

## Checklist
- [ ] `npm audit` clean (or known exceptions documented)
- [ ] All patch/minor updates applied
- [ ] Major updates handled one at a time with changelog review
- [ ] Type check passes
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Commit message lists key version changes
