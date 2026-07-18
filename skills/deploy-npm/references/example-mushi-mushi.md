# Reference: mushi-mushi release (v0.7.3, 2026-05-27)

This document captures how the `deploy-npm` workflow was applied to the
[mushi-mushi](https://github.com/kensaurus/mushi-mushi) monorepo. Use it as
an annotated reference when adapting the skill to a similar stack.

## Repo profile

| Attribute | Value |
|-----------|-------|
| Package manager | `pnpm` + `turbo` |
| Versioning | `@changesets/cli` + `@changesets/action` |
| Release workflow | `.github/workflows/release.yml` (trigger: push to `master`) |
| npm auth | OIDC Trusted Publisher — no long-lived `NPM_TOKEN` |
| Runner hardening | `step-security/harden-runner` (blocks git tag ref writes → Phase 8 required) |
| First version published | v0.7.3 on 2026-05-27 |

## Key lessons from this run

1. **`harden-runner` blocks `changesets/action` from pushing tags.** The
   action's tag-push fails silently. Workaround: Phase 8 (manual `gh api`
   tag + release creation per package).

2. **Node 22 ships npm 10, which breaks OIDC.** `setup-node@v4` with
   `node-version: 22` ships npm 10, which had a broken OIDC handshake with
   npm registry. Pinning `node-version: 24` ships npm ≥ 11.5 and resolves
   the issue.

3. **`github-actions[bot]` squash-merges suppress downstream `Release`
   workflow triggers.** When `changesets/action` commits the version PR,
   GitHub does not re-fire workflows triggered by `push` to `master` for
   bot-authored commits. Workaround: add `workflow_dispatch:` to
   `release.yml` and dispatch via `gh workflow run Release` (Phase 6).

## Live links

- **npm:** <https://www.npmjs.com/package/mushi-mushi>
- **GitHub repo:** <https://github.com/kensaurus/mushi-mushi>
