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

## CI fix loops seen in this run

The `Build & Test` / `typecheck` / `lint` / `size-limit` / docs jobs failed in
these shapes before the feature PR went green. They are specific to this
stack and era; check current tool versions before reusing a fix.

1. **`Build & Test` fails on a test** → `pnpm --filter <pkg> test` locally; fix; commit; push.
2. **`typecheck` fails but tests pass** → an inline `import('...')` type annotation leaked; switch to `import type { X } from '...'` (`@typescript-eslint/consistent-type-imports`).
3. **`lint` fails on `next lint`** on Next.js ≥ 15.5 → `next lint` was removed; replace with `eslint . --ext .ts,.tsx` in `package.json` and add `eslint` + the workspace eslint-config to `devDependencies`.
4. **`lint` fails on `// eslint-disable-next-line unknown-rule`** under ESLint 10 → remove the directive; ESLint 10 treats unknown-rule disables as errors.
5. **`Check bundle sizes` fails** → bump the package's `size-limit` config only after `pnpm --filter <pkg> exec size-limit --why` confirms the growth is intentional new code.
6. **Docs build (Nextra) fails with Zod `expected nonoptional, received undefined → at children`** → patch `nextra-theme-docs/dist/schemas.js` to `children: reactNode.optional()` in `LayoutPropsSchema`; register the patch under root `package.json` `pnpm.patchedDependencies`.
7. **MDX build error "import statement after heading"** → move every `import ... from '...'` above the first heading or JSX in the MDX file.

## Live links

- **npm:** <https://www.npmjs.com/package/mushi-mushi>
- **GitHub repo:** <https://github.com/kensaurus/mushi-mushi>
