# Dependency Provenance & Supply-Chain Audit — cursor-kenji

_Audit-only. Nothing is installed, removed, or upgraded until each phase is approved._

## Scope

- **Ecosystems:** npm (tooling only) · no pip/Cargo/go deps in repo
- **Direct deps:** 0 runtime dependencies in `package.json`
- **Transitive:** none locked — `npm ls` empty
- **Lockfile(s):** **absent** (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock` not present)
- **Assumptions:** Skills are markdown; supply-chain risk is (1) npm publish tooling, (2) `npx -y` MCP templates users copy, (3) dev CI Node version only. Did **not** install any package to verify.

## Verdict

| Severity | Count | Worst case |
|----------|-------|-----------|
| Critical | 0 | — |
| High | 1 | No lockfile — CI/dev `npx` pulls unpinned MCP server versions |
| Medium | 2 | Unpinned `npx -y` in MCP templates; no npm audit surface (zero deps) |
| Low | 1 | `.mcp.json` uses env refs (good) but tracked in repo — document don't commit filled keys |

## Provenance table (notable)

| Package | Exists? | First pub | Weekly DLs | License | Repo | Verdict |
|---------|---------|-----------|------------|---------|------|---------|
| _(package.json deps)_ | — | — | — | — | — | **None declared** — scripts use Node built-ins only |
| `@modelcontextprotocol/server-sequential-thinking` | ✅ (npx) | MCP official | high | MIT | modelcontextprotocol | OK — pin version in templates (Med) |
| `firecrawl-mcp` | ✅ | npm registry | moderate | check at pin | firecrawl | OK — unpinned in template (Med) |
| `@playwright/mcp@latest` | ✅ | npm | high | Apache-2.0 | microsoft/playwright | **@latest** in template — pin semver (Med) |
| `@supabase/mcp-server-supabase@latest` | ✅ | npm | moderate | Apache-2.0 | supabase | **@latest** — pin semver (Med) |
| `@upstash/context7-mcp` | ✅ | npm | moderate | MIT | upstash | unpinned (Med) |

_Registry metadata resolved via npm registry API knowledge; no packages were installed._

## Findings

| # | Package / area | Issue | Evidence | Sev | Direction |
|---|----------------|-------|----------|-----|-----------|
| D1 | npm lockfile | No lockfile committed | `package-lock.json` missing; zero deps today but no integrity hashes for future deps | High | Add lockfile when adding devDeps; or document intentional zero-dep policy + CI Node pin |
| D2 | mcp/*.template | `npx -y` with `@latest` / unpinned packages | `mcp.json.template`, `.mcp.json` playwright/supabase use floating tags | Med | Pin known-good semver in templates; changelog when bumping |
| D3 | package.json | No `dependencies` or `devDependencies` | Scripts: node fs/path only — good minimal surface | Low | Keep zero runtime deps; use `engines.node` (already >=18) |
| D4 | npm publish | `@kensaurus/cursor-kenji` exists @ 1.1.0 public; local 1.2.1 | `npm view` vs package.json | Low | Publish sync — not supply-chain, release hygiene |
| D5 | skills/* | 89 skill folders — markdown, no npm imports | No hallucinated npm deps in repo code | — | OK |
| D6 | install.sh / bin | Shell + node installers, no curl\|bash remote deps | Read install paths | Low | OK |
| D7 | License | Root MIT; NOTICE file present | LICENSE + NOTICE | Low | OK for open-source toolkit |
| D8 | MCP env | Templates use `YOUR_*` placeholders; `.mcp.json` uses `${ENV}` refs | No real keys in tracked files | Low | Document in SECURITY.md: never commit filled `.mcp.json` with secrets |
| D9 | pre-commit | Validates skills spec; no dependency allowlist hook | `.githooks/pre-commit` | Med | Recommend `create-hook` pre-install allowlist if adding package.json deps |

## Phased burndown

- **Phase 1 — Verify/remove suspect packages** → none required (no suspect deps found)
- **Phase 2 — Lock & pin** → `workflow-housekeep`
  - D1: document zero-dep policy OR add lockfile when first devDependency added
  - D2: pin MCP template package versions
- **Phase 3 — License & advisories** → wire `npm audit` when deps exist; SBOM optional for npm publish
- **Phase 4 — De-bloat** → N/A (already minimal)
- **Gate** → `create-hook` if dependencies are ever added to package.json

## Execution handoff

This repo is unusually clean on declared deps — the real supply-chain surface is **MCP template `npx` pulls** users run locally. Approve Phase 2 pinning before the next MCP template change.

Re-scan after any `package.json` dependency addition; never install unknown packages to "verify."
