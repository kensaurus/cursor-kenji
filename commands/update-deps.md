# update-deps

# Safe Dependency Update

> Check for outdated dependencies, research breaking changes, update one at a time, verify each, and commit separately.

---

## Step 1: Check What's Outdated

```bash
npm outdated
```

Categorize the output:

| Update Type | Risk | Action |
|------------|------|--------|
| Patch (1.2.3 -> 1.2.4) | Low | Update in batch |
| Minor (1.2.3 -> 1.3.0) | Low-Medium | Update individually |
| Major (1.2.3 -> 2.0.0) | High | Research first |

---

## Step 2: Research Breaking Changes (Major Updates Only)

For each major version bump, research what changed:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<package-name> v<new-major> migration guide breaking changes",
  "limit": 3
})
```

Scrape the changelog or migration guide:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "<changelog-or-migration-url>",
  "formats": ["markdown"],
  "onlyMainContent": true
})
```

If Firecrawl unavailable:

```
WebSearch(search_term: "<package-name> v<new-major> migration breaking changes")
```

Summarize:
- What APIs changed
- What was removed
- What new patterns are required
- Whether the project uses any affected APIs

---

## Step 3: Update One at a Time

### 3a. Patch and minor updates (low risk)

```bash
npm install <package>@latest
```

### 3b. Major updates (after research)

```bash
npm install <package>@<new-version>
```

Apply any migration steps identified in Step 2.

---

## Step 4: Verify After Each Update

```bash
npm run build
```

```bash
npm run test:unit
```

```
ReadLints(paths: [<files that import this package>])
```

If anything fails:
1. Read the error
2. If it's a quick fix (import path change, API rename), fix it
3. If it requires significant refactoring, rollback and skip:

```bash
git checkout -- package.json package-lock.json
npm install
```

Report the skipped package and why.

---

## Step 5: Commit Each Successful Update

```bash
git add package.json package-lock.json <any migration files>
git commit -m "$(cat <<'EOF'
chore(deps): update <package> to v<version>

<one line about what changed, if notable>
EOF
)"
```

---

## Step 6: Security Audit

After all updates:

```bash
npm audit
```

If vulnerabilities found:

```bash
npm audit fix
```

For vulnerabilities that `audit fix` can't resolve, report them with severity and affected package.

---

## Step 7: Summary Report

```markdown
## Dependency Update Report

### Updated
| Package | From | To | Type | Notes |
|---------|------|----|------|-------|
| ... | ... | ... | patch/minor/major | ... |

### Skipped (need manual intervention)
| Package | From | To | Reason |
|---------|------|----|--------|
| ... | ... | ... | [breaking change description] |

### Security
- Vulnerabilities before: X
- Vulnerabilities after: Y
- Remaining issues: [list if any]
```

---

## Checklist

- [ ] `npm outdated` run
- [ ] Major updates researched for breaking changes
- [ ] Updates applied one at a time
- [ ] Build passes after each update
- [ ] Tests pass after each update
- [ ] Each update committed separately
- [ ] `npm audit` run after all updates
- [ ] Summary report produced
