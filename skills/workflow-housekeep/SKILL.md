---
name: workflow-housekeep
description: >
  Comprehensive repo housekeeping: update stale READMEs to match current architecture,
  remove dead files (logs, screenshots, deprecated code, build artifacts),
  update npm/pip/cargo dependencies to latest and fix vulnerabilities,
  and research-driven general cleanup. Works with any project — auto-detects
  tech stack, package manager, and repo structure. Use when asked to:
  "housekeep", "clean up repo", "update README", "update dependencies",
  "fix vulnerabilities", "remove dead code", "tidy up", "repo maintenance",
  "spring clean", "prune", "declutter", or "modernize the repo".
---

# Repo Housekeep

Full-cycle repository maintenance: documentation sync, dead file removal, dependency updates, and research-driven cleanup.
Works with **any project** — auto-detects tech stack, package manager, and structure.

## Critical Rules

> **NEVER delete files without confirming they are truly unused.**
> Check imports, references, git blame, and config entries before removing anything.

> **NEVER blindly upgrade a major version.**
> Major bumps may have breaking changes. Research the changelog before upgrading.

> **README must reflect reality, not aspiration.**
> Only document what currently exists in the codebase.

> **Commit each phase separately.**
> Documentation, cleanup, and dependency updates are independent concerns.

---

## Step 0: Auto-Detect Project Configuration

### 0a. Detect Tech Stack

Read the dependency manifest to determine the ecosystem:

| File | Ecosystem | Package Manager |
|------|-----------|-----------------|
| `package.json` + `package-lock.json` | Node.js | npm |
| `package.json` + `pnpm-lock.yaml` | Node.js | pnpm |
| `package.json` + `yarn.lock` | Node.js | yarn |
| `package.json` + `bun.lockb` | Node.js | bun |
| `requirements.txt` / `pyproject.toml` | Python | pip / poetry / uv |
| `Cargo.toml` | Rust | cargo |
| `go.mod` | Go | go mod |
| `Gemfile` | Ruby | bundler |
| `build.gradle` / `pom.xml` | Java/Kotlin | gradle / maven |
| `pubspec.yaml` | Dart/Flutter | pub |
| `composer.json` | PHP | composer |

### 0b. Detect Project Structure

```
Glob("README*")
Glob("**/*readme*")
Glob("**/CHANGELOG*")
Glob("**/.env*")
Glob("**/*.log")
Glob("**/dist/**")
Glob("**/build/**")
Glob("**/*.screenshot*")
Glob("**/*.png", in test/debug/temp folders)
```

### 0c. Record Configuration

```
ECOSYSTEM:       [Node.js / Python / Rust / Go / etc.]
PKG_MANAGER:     [npm / pnpm / yarn / bun / pip / poetry / cargo / etc.]
MANIFEST:        [package.json / requirements.txt / Cargo.toml / etc.]
LOCKFILE:        [package-lock.json / yarn.lock / etc.]
README_PATH:     [README.md or detected path]
SRC_DIR:         [src/ / app/ / lib/ / etc.]
BUILD_DIR:       [dist/ / build/ / .next/ / out/ / etc.]
FRAMEWORK:       [Next.js / React / Vue / Django / FastAPI / etc.]
```

---

## Phase 1: README Sync

Update the root README (and any folder-level READMEs) to reflect the **current** architecture.

### 1a. Discover Current Architecture

Read these files to understand what actually exists:

```
- Package manifest (package.json, etc.) — dependencies, scripts, name, description
- Entry point (src/index.ts, app/layout.tsx, main.py, etc.)
- Config files (next.config.*, vite.config.*, tsconfig.json, etc.)
- CI/CD (.github/workflows/*, vercel.json, netlify.toml, Dockerfile, etc.)
- Environment files (.env.example, .env.local) — list expected env vars
- Folder structure (top-level ls, then 2-level deep ls of src/)
```

### 1b. Cross-Check README Against Reality

For each section in the existing README, verify:

| README Section | Verify Against |
|---------------|----------------|
| Project description | `package.json` name/description, actual functionality |
| Tech stack | Installed dependencies in manifest |
| Getting started / Setup | Actual scripts in `package.json`, required env vars |
| Folder structure | Real directory listing |
| API endpoints | Route files, API handlers |
| Features list | Actual implemented features (not planned/removed) |
| Environment variables | `.env.example` or config files |
| Deployment | CI/CD config, hosting config |
| Contributing | Linter config, test setup, pre-commit hooks |

### 1c. Rewrite Stale Sections

For each discrepancy found:
- **Missing feature in README**: Add it with accurate description
- **Removed feature still in README**: Delete the section
- **Outdated instructions**: Update to match current setup
- **Missing sections**: Add standard sections (see template below)

### 1d. README Template (adapt to project)

```markdown
# Project Name

Brief description from package manifest + actual functionality.

## Tech Stack

[List ONLY what's in the dependency manifest — framework, UI lib, DB, auth, etc.]

## Getting Started

### Prerequisites
[Node version from .nvmrc/engines, other requirements]

### Installation
[Exact commands from package.json scripts]

### Environment Variables
[List from .env.example with descriptions]

### Development
[Dev server command, test command, lint command]

## Project Structure
[Actual directory tree, 2 levels deep]

## Deployment
[From CI/CD config — where it deploys, how]

## Scripts
[All scripts from package.json with descriptions]
```

### 1e. Folder READMEs

Check for any `*_readme.md` or `README.md` files in subdirectories. Update them if the folder contents have changed.

---

## Phase 2: Dead File Cleanup

Remove files that serve no purpose in the repository.

### 2a. Scan for Candidates

Search for these categories of dead files:

**Logs and debug output:**
```
Glob("**/*.log")
Glob("**/npm-debug.log*")
Glob("**/yarn-debug.log*")
Glob("**/yarn-error.log*")
Glob("**/debug.log")
Glob("**/.pnpm-debug.log*")
```

**Screenshots and temp images:**
```
Glob("**/screenshot*")
Glob("**/Screenshot*")
Glob("**/*.png", in root or non-asset directories)
Glob("**/*.jpg", in root or non-asset directories)
Glob("**/temp/**")
Glob("**/tmp/**")
```

**Build artifacts committed by mistake:**
```
Glob("**/dist/**")
Glob("**/build/**")
Glob("**/.next/**")
Glob("**/node_modules/**")
Glob("**/__pycache__/**")
Glob("**/*.pyc")
Glob("**/target/debug/**")  (Rust)
```

**Deprecated / dead code:**
```
Glob("**/*.bak")
Glob("**/*.old")
Glob("**/*.orig")
Glob("**/*deprecated*")
Glob("**/*DEPRECATED*")
Glob("**/*.backup")
Glob("**/*_old.*")
Glob("**/*_backup.*")
Glob("**/*.tmp")
```

**IDE and OS artifacts:**
```
Glob("**/.DS_Store")
Glob("**/Thumbs.db")
Glob("**/*.swp")
Glob("**/*.swo")
```

**Stale config files:**
```
Glob("**/.env.local")     (should not be committed)
Glob("**/.env.production") (check if contains secrets)
```

### 2b. Validate Before Deleting

For each candidate file:

1. **Check git blame**: When was it last modified? By whom?
2. **Check imports/references**: Is any code importing or referencing this file?
   ```
   Grep for the filename across the codebase
   ```
3. **Check .gitignore**: Should this file type already be ignored?
4. **Check CI/CD**: Does any workflow reference this file?

**Classification:**

| Category | Action |
|----------|--------|
| Log files | Delete + add to `.gitignore` |
| Screenshots in non-asset dirs | Delete (or move to docs/ if referenced) |
| Build artifacts | Delete + verify in `.gitignore` |
| `.bak` / `.old` / `.orig` files | Delete (git has history) |
| IDE/OS artifacts | Delete + add to `.gitignore` |
| Secret files committed | Delete + rotate secrets + add to `.gitignore` |
| Deprecated code files | Verify unused → delete |

### 2c. Update .gitignore

After cleanup, ensure `.gitignore` prevents reoccurrence:

```
Check existing .gitignore covers:
- logs/          *.log
- build output   dist/ build/ .next/ out/
- env files      .env.local .env.production
- OS files       .DS_Store Thumbs.db
- IDE files      .idea/ .vscode/ (unless project uses shared settings)
- temp files     *.tmp *.bak *.swp
- dependencies   node_modules/ __pycache__/ target/
```

### 2d. Find Dead Exports / Unused Code

For TypeScript/JavaScript projects:

```
Run: npx knip (if available) or npx ts-prune
```

For Python:
```
Run: vulture . (if available)
```

If these tools aren't available, do a manual check:
- Find all exported functions/components
- Check if each has at least one import elsewhere
- Flag unused exports for review

---

## Phase 3: Dependency Updates

### 3a. Audit Current State

**Node.js:**
```bash
npm outdated              # see what's behind
npm audit                 # check vulnerabilities
```

**Python:**
```bash
pip list --outdated
pip-audit                 # or safety check
```

**Rust:**
```bash
cargo outdated
cargo audit
```

**Go:**
```bash
go list -m -u all
govulncheck ./...
```

### 3b. Classify Updates

| Update Type | Risk | Action |
|-------------|------|--------|
| Patch (1.2.3 → 1.2.4) | Low | Auto-update |
| Minor (1.2.3 → 1.3.0) | Low-Medium | Auto-update, verify build |
| Major (1.2.3 → 2.0.0) | High | Research changelog first |
| Security fix (any) | Critical | Update immediately |

### 3c. Update Strategy

**Step 1: Fix vulnerabilities first**
```bash
npm audit fix                    # safe fixes only
npm audit fix --force            # ONLY if safe fixes insufficient, review changes
```

**Step 2: Update patch + minor**
```bash
npm update                       # updates within semver range
```

Or for more control:
```bash
npx npm-check-updates -u -t minor   # update package.json to latest minor
npm install                           # install updated versions
```

**Step 3: Research major updates**

For each major version bump available:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<package-name> v<new-major> migration guide changelog breaking changes",
  "limit": 3,
  "sources": [{ "type": "web" }]
})
```

Only apply major updates if:
- The migration is straightforward (no breaking API changes affecting this project)
- The current major version is EOL or has known security issues
- The project has tests to verify nothing breaks

**Step 4: Verify after updates**
```bash
npm run build        # or equivalent
npm run lint         # or equivalent
npm test             # if tests exist
```

### 3d. Lock File Hygiene

- Ensure lock file is committed and up to date
- If lock file has conflicts or corruption: delete and regenerate
- Verify lock file matches the package manager in use

---

## Phase 4: Research-Driven General Cleanup

### 4a. .gitignore Best Practices

Research the recommended `.gitignore` for the detected ecosystem:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<framework> gitignore best practices <current year>",
  "limit": 3,
  "sources": [{ "type": "web" }]
})
```

Cross-check with https://github.com/github/gitignore templates.

### 4b. Config File Audit

Check for stale or redundant config:

| Config | Check |
|--------|-------|
| `tsconfig.json` | Target and lib match Node/browser version in use |
| `eslint` config | Not using deprecated rules or legacy config format |
| `prettier` config | Exists and is consistent with eslint |
| `.nvmrc` / `engines` | Matches current LTS or team's Node version |
| `browserslist` | Not targeting dead browsers |
| CI/CD config | Not using deprecated actions or outdated Node versions |

### 4c. Script Audit

Review all scripts in `package.json` (or equivalent):
- Remove scripts that reference deleted files or tools
- Verify all scripts actually work
- Add missing standard scripts (dev, build, lint, test, typecheck)

### 4d. Environment Variable Audit

- Verify `.env.example` lists all required vars
- Check no `.env` files with real secrets are committed
- Ensure env var names are consistent with usage in code

### 4e. TypeScript / Lint Config Modernization

If the project uses TypeScript:
- Check for `any` type usage that could be tightened
- Verify `strict` mode settings
- Check for unused `@ts-ignore` or `@ts-expect-error` comments

### 4f. License and Metadata

- `package.json`: verify `name`, `version`, `description`, `license`, `repository` are accurate
- `LICENSE` file: exists and matches `package.json` license field
- `CONTRIBUTING.md`: exists if the project accepts contributions

---

## Phase 5: Summary Report

```markdown
## Housekeep Report — [Project Name]

### Configuration
- Ecosystem: [Node.js / Python / etc.]
- Package Manager: [npm / pnpm / yarn / etc.]
- Framework: [Next.js / React / Django / etc.]

### Phase 1: README Sync
- [x] Root README updated: [list of sections changed]
- [x] Folder READMEs updated: [list]
- Stale sections removed: [list]
- New sections added: [list]

### Phase 2: Dead File Cleanup
| File | Category | Action |
|------|----------|--------|
| path/to/file.log | Log | Deleted |
| path/to/screenshot.png | Screenshot | Deleted |

- .gitignore updated: [patterns added]
- Dead exports found: [list or "none"]

### Phase 3: Dependency Updates
- Vulnerabilities fixed: [count] ([critical/high/moderate])
- Packages updated: [count]
  - Patch: [list]
  - Minor: [list]
  - Major: [list with migration notes]
- Build verified: [pass/fail]
- Tests verified: [pass/fail/no tests]

### Phase 4: General Cleanup
- Config files updated: [list]
- Scripts cleaned: [list]
- .gitignore modernized: [yes/no]
- Env vars audited: [findings]

### Files Modified
- [path] — [description]

### Files Deleted
- [path] — [reason]

### Requires Manual Follow-Up
- [item] — [why it cannot be automated]
```

---

## Quick Reference: Common Cleanup Commands

| Ecosystem | Outdated | Audit | Update | Build Verify |
|-----------|----------|-------|--------|--------------|
| npm | `npm outdated` | `npm audit` | `npm update && npm audit fix` | `npm run build` |
| pnpm | `pnpm outdated` | `pnpm audit` | `pnpm update && pnpm audit --fix` | `pnpm build` |
| yarn | `yarn outdated` | `yarn audit` | `yarn upgrade` | `yarn build` |
| pip | `pip list --outdated` | `pip-audit` | `pip install -U <pkg>` | `python -m pytest` |
| cargo | `cargo outdated` | `cargo audit` | `cargo update` | `cargo build` |
| go | `go list -m -u all` | `govulncheck ./...` | `go get -u ./...` | `go build ./...` |
