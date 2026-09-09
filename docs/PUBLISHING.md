# Publishing cursor-kenji

How maintainers ship a new npm version. Consumers who want skills **and** slash commands run `npx @kensaurus/cursor-kenji --all`. `npx skills add kensaurus/cursor-kenji` installs skills only.

## Prerequisites

- Write access to `kensaurus/cursor-kenji`
- npm package `@kensaurus/cursor-kenji` with **Trusted Publisher** configured:
  - Repo: `kensaurus/cursor-kenji`
  - Workflow: `npm-publish.yml`
  - Permission: `npm publish`

No long-lived `NPM_TOKEN` is required when OIDC is configured.

## Pre-release checklist

1. Bump `version` in `package.json`, `.cursor-plugin/plugin.json`, and `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json` `metadata.version` (keep in sync)
2. Add a `[x.y.z]` section to [CHANGELOG.md](../CHANGELOG.md)
3. Run the full gate:

```bash
npm test
```

This runs skill spec validation, count sync, README skill-index sync, secret-scanner self-test, MCP pin check, docs-facts check, completion-gate tests, and install smoke test.

4. Update derived counts if needed: `npm run fix:skills`

## Ship

```bash
# Tag must match package.json version
TAG="v$(node -p "require('./package.json').version")"
gh release create "$TAG" --title "$TAG" --notes "$(cat <<EOF
## Summary
- …

## Install
npx @kensaurus/cursor-kenji --all
npx @kensaurus/cursor-kenji --verify --all
EOF
)"
```

Creating the release triggers [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml), which:

1. Validates skills + counts + MCP pins
2. Publishes to npm with `--provenance` via OIDC

## Verify

```bash
npm view @kensaurus/cursor-kenji version
npm view @kensaurus/cursor-kenji bin
```

Confirm the [GitHub Actions publish run](https://github.com/kensaurus/cursor-kenji/actions/workflows/npm-publish.yml) succeeded.

## Emergency local publish

Only if CI is broken. Requires a granular npm token with publish access (never commit it):

```bash
npm test
npm publish --access public --//registry.npmjs.org/:_authToken="$NPM_TOKEN"
```

Prefer fixing CI + OIDC over local publishes.

## Optional: Cursor Marketplace

Official marketplace submission uses the same repo — [`.cursor-plugin/plugin.json`](../.cursor-plugin/plugin.json) at the root. Submit at https://cursor.com/marketplace/publish after each meaningful release; Cursor reviews manually.

## Optional: Claude Code plugin

This repo is already a marketplace: `.claude-plugin/marketplace.json` + `.claude-plugin/plugin.json`. Users can add it with `/plugin marketplace add kensaurus/cursor-kenji`.

To apply to Anthropic’s **community** catalog (separate from this repo marketplace):

1. `claude plugin validate .` (and `claude plugin validate . --strict`)
2. Submit the public GitHub URL at https://platform.claude.com/plugins/submit

Do not claim community-catalog listing until that page shows the plugin.
