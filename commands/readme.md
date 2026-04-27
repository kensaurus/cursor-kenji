# readme

# Session Documentation Sync

> Detect what changed, auto-discover README conventions, update affected docs, verify links, optionally verify live routes via Playwright.

---

## Trigger

Run at end of coding session or when requested.

---

## Step 1: Scan Session Changes

```bash
git diff --name-only HEAD~5    # recent committed changes
git status --short              # uncommitted changes
```

Group changed files by folder.

---

## Step 2: Auto-Detect README Convention

Different projects use different naming patterns. Detect the project's convention before creating new READMEs:

```
Glob("**/README*")
Glob("**/*README*")
```

| Pattern Found | Convention |
|---------------|-----------|
| `README.md` in root only | Standard — one root README |
| `README.md` in subfolders | Standard — per-folder READMEs |
| `@_[folder]-README.md` | Cursor convention — prefixed per-folder |
| `docs/*.md` | Docs folder convention |
| No READMEs in subfolders | Don't create new ones — update root only |

**Follow whatever convention the project already uses.** Never introduce a new convention.

---

## Step 3: Smart Change Detection

### 3a. Detect what actually changed (not just file names)

For each changed file, understand the impact:

```
Grep(pattern: "export (function|class|const|type|interface)", path: "<changed-file>")
```

| Change Type | README Action |
|-------------|---------------|
| New export added | Document it |
| Export renamed | Update references |
| Export removed | Remove from docs |
| API/props changed | Update usage examples |
| File added | Add new entry |
| File deleted | Remove stale references |
| Internal-only change | No README update needed |

### 3b. Check for stale references

Search existing READMEs for references to deleted or renamed exports:

```
Grep(pattern: "<deleted-or-renamed-symbol>", glob: "**/README*")
```

Remove or update any stale references found.

---

## Step 4: Update Each Affected README

### Writing Rules

- Bullets over paragraphs
- Cut filler words — every word must earn its place
- Minimal complete examples (compilable, copy-pasteable)
- Remove empty sections entirely
- No redundant descriptions (don't repeat what the code already says)
- Imperative mood for action items

### Template (for projects that use per-folder READMEs)

```markdown
# [Folder Name]

## Overview
One-line folder purpose.

## Contents

### [ExportName]
Brief description.

**API / Props:**
| Name | Type | Default | Description |
|------|------|---------|-------------|

**Usage:**
\`\`\`tsx
<MinimalExample />
\`\`\`

**Notes:**
- Non-obvious gotchas only
```

For root README updates, preserve the existing structure and only update the sections affected by the changes.

---

## Step 5: Verify Links

### 5a. Check internal links

Search for broken internal links (references to files, anchors, or paths that no longer exist):

```
Grep(pattern: "\\]\\((?!https?://)", glob: "**/README*")
```

For each link found, verify the target exists:

```
Glob("<linked-path>")
```

Fix or remove any broken links.

### 5b. Check external links (if Firecrawl available)

For any external URLs in READMEs, spot-check that they still resolve:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "<external-url>",
  "formats": ["markdown"],
  "onlyMainContent": true,
  "timeout": 5000
})
```

If a URL 404s or redirects to a generic page, update or remove it.

### 5c. Verify live routes (if Playwright MCP available and project is a web app)

For READMEs that reference specific app routes or pages, verify they actually render:

```json
CallMcpTool(server: "user-playwright", toolName: "browser_navigate", arguments: {
  "url": "<local-dev-url><route-from-readme>"
})
```

```json
CallMcpTool(server: "user-playwright", toolName: "browser_snapshot", arguments: {})
```

Only do this for routes explicitly mentioned in READMEs — not exhaustive testing.

---

## Checklist

- [ ] Session changes scanned (`git diff` + `git status`)
- [ ] README convention auto-detected (don't invent new patterns)
- [ ] Changed exports identified (not just file names)
- [ ] Stale references found and removed
- [ ] Affected READMEs updated
- [ ] New folders get READMEs only if the convention calls for it
- [ ] Internal links verified
- [ ] External links spot-checked (if tools available)
- [ ] Format consistent with existing READMEs
