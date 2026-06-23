# Security

How to handle secrets when using cursor-kenji skills, MCP templates, and the npm installer.

## Reporting vulnerabilities

Email or open a **private** [GitHub Security Advisory](https://github.com/kensaurus/cursor-kenji/security/advisories/new) for credential leaks, malicious skill content, or installer issues. Do not post live tokens in public issues.

## Where secrets belong

| Location | Purpose | Commit? |
|----------|---------|---------|
| `~/.cursor/mcp.json` | Your personal MCP config with real API keys | **Never** |
| `.env` (gitignored) | Local publish tokens (`NPM_TOKEN`) for maintainers | **Never** |
| `mcp/mcp.json.template` | Placeholders (`YOUR_*`) for copy-paste | Yes — templates only |
| Repo root `.mcp.json` | Shared example using `${ENV}` refs | Yes — **no literal secrets** |

Real keys live only on your machine. Forks must not commit filled MCP configs.

## MCP supply chain

MCP templates pin semver versions in [`mcp/pinned-versions.json`](mcp/pinned-versions.json). When copying a template:

1. Replace every `YOUR_*` placeholder or `${ENV}` variable with env vars — not inline secrets in tracked project files.
2. Prefer pinned `@version` over `@latest` when adding servers manually.
3. AWS servers use `uvx` with PyPI packages documented in `mcp/pinned-versions.json` (legacy `awslabs.s3-mcp-server` / `lambda-mcp-server` names are **not** valid on PyPI).

## Pre-commit protection

This repo runs `scripts/scan-secrets.mjs` on staged files before commit. It blocks common patterns (GitHub PATs, npm tokens, Stripe live keys, AWS access keys, private key blocks). Placeholders like `ghp_your_token_here` and `YOUR_*` are allowed.

Enable hooks after clone:

```bash
npm run prepare   # sets core.hooksPath → .githooks
```

## npm publish (maintainers)

**Primary:** npm Trusted Publishing (OIDC) — configured for `kensaurus/cursor-kenji` + workflow [`npm-publish.yml`](.github/workflows/npm-publish.yml). Releases publish with `--provenance` via GitHub Actions; no long-lived token required.

**Fallback:** `NPM_TOKEN` in GitHub Actions secrets (optional). The workflow only sets `NODE_AUTH_TOKEN` when the secret is non-empty so OIDC is not blocked.

Local emergency publish: copy a granular token to gitignored `.env` as `NPM_TOKEN=…` and run `npm publish --access public --//registry.npmjs.org/:_authToken="$NPM_TOKEN"`.

## Zero runtime dependencies

`package.json` declares no runtime or dev dependencies — install/validate scripts use Node built-ins only. If you add dependencies, add a lockfile and run `npm audit` before merging.

## Consumer projects

Skills that touch Supabase, Stripe, or auth (`plan-secrets-audit`, `plan-rls-audit`, `audit-security`) assume **your app repo** follows the same rules: service-role keys never in client bundles, RLS on every table, env vars in deployment secrets — not in git.
