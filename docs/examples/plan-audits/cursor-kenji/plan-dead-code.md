# plan-dead-code — cursor-kenji (2026-09-17, HEAD 4357adf)

_Audit of the pack's own repository. Executed the same day by `housekeep-dead-code` at the user's request; kept here as a worked example._

## Phase 0 — Stack

| Fact | Value |
|---|---|
| Package manager | npm; zero `dependencies` / `devDependencies` by design (installer is plain Node) |
| Module graph | 16 `.mjs` / `.js` files: `bin/`, `hooks/`, `scripts/`, `skills/enhance-readme/scripts/`; no bundler, no TS, no tests framework |
| Non-Node arms | `install.sh`, `shell-aliases/*.sh`, `scripts/render-brand-assets.py`, `skills/thirdparty-ui-ux-pro-max/scripts/*.py` — outside Knip's graph, checked by reference grep |
| Content surface | 156 skills, 62 commands, docs — reachability is by name (`check-skill-refs.mjs`, `check-skill-count.mjs`, `generate-skill-index.mjs --check` already gate this) |
| Dynamic reference | none (`import.meta.glob`, `require.context`, `lazy(` absent) |
| Existing config | none before this audit; `knip.json` authored in Phase 1 |
| Tests locked? | `npm test` = 10 gates incl. install smoke test; green at baseline |

## Phase 1 — Knip config and baseline

`knip.json`: entries `bin/cursor-kenji.js`, `bin/install.mjs`, `hooks/completion-gate.mjs`, `scripts/*.mjs`, `skills/*/scripts/*.mjs`; project = the same globs.

| Run | Files | Exports | Types | Deps | Unlisted | Hints |
|---|---|---|---|---|---|---|
| default | 0 | 0 | 0 | 0 | 2 | 0 |
| `--production` | 0 | 0 | 0 | 0 | 0 | 0 |

The two `unlisted` hits are `playwright` and `@ffmpeg-installer/ffmpeg` imported by `skills/enhance-readme/scripts/record-readme-tour.mjs` — a helper the **consumer** runs inside their own project (its header documents the install). They are not pack dependencies. **Classification: `keep-config`** → `ignoreDependencies` for exactly those two names, with the reason in `knip.jsonc`.

## Surfaces Knip cannot see

| Surface | Method | Result |
|---|---|---|
| Orphan scripts | grep each basename across repo (excluding itself) | `scripts/migrate-browser-mcp-to-cli.mjs` — referenced only by a CHANGELOG line; `scripts/shorten-skill-descriptions.mjs` — CHANGELOG only; `gen-brand-assets.mjs` / `gen-brand-candidates.mjs` / `render-brand-assets.py` — reference each other's usage headers |
| Debug residue | `console.*` outside CLI output, `debugger`, `.only/.skip`, commented-out code, TODO/FIXME | none (all `console.*` is CLI output by design) |
| Suppression debt | `@ts-ignore`, `eslint-disable` | none (no TS, no ESLint) |
| Orphan assets | grep each `assets/*`, `docs/screenshots/*` basename | all referenced (README, docs, CHANGELOG); `assets/candidates/` is gitignored and untracked |
| Orphan docs | `docs/HOUSEKEEP-REPORT.md`, `docs/PLAN-SKILL-PACK-ENHANCEMENT.md` | both indexed in `docs/README.md` as historical — not dead |
| Root `plan-*.md` | `plan-antislop.md`, `plan-docs-sync.md` | gitignored local artifacts of earlier plan runs — not repo content |
| Duplication | `commands-portable/` vs `commands/` | intentional dual-runtime copies, gated by the `commands-portable/research` sync note in CHANGELOG 1.34.0 |
| Schema | — | no database arm in this repo |

## Keep / kill list

| # | Item | Class | Evidence | Direction |
|---|---|---|---|---|
| 1 | `scripts/migrate-browser-mcp-to-cli.mjs` | **kill** | one-off migration (Playwright MCP → playwright-cli) completed in 1.2x; no script, CI, or doc runs it; CHANGELOG 1.2x line stays as history; git keeps the file | delete (C1) |
| 2 | `scripts/shorten-skill-descriptions.mjs` | keep | reusable maintainer tool for the 320-char description budget; unreferenced but not dead — a tool, not a leftover | keep; mention in CONTRIBUTING when next edited |
| 3 | brand pipeline (`gen-brand-assets.mjs`, `gen-brand-candidates.mjs`, `render-brand-assets.py`) | keep | generates the tracked `assets/*`; scripts reference one another; `gen-brand-candidates.mjs` has uncommitted user edits | keep; do not touch the dirty file |
| 4 | `record-readme-tour.mjs` unlisted deps | keep-config | consumer-side runtime deps by design | `ignoreDependencies` in `knip.jsonc` |
| 5 | historical docs (#HOUSEKEEP-REPORT, #PLAN-SKILL-PACK-ENHANCEMENT) | keep | indexed as historical in `docs/README.md` | none; `plan-docs-sync` owns any future pruning |

## Ratchet (Phase 2 of the housekeep)

- `package.json` script `check:dead-code` → `npx -y knip@6.36.0 --max-issues 0` (pinned; the repo has no devDependencies and stays that way)
- Joined to the existing aggregator: appended to `npm test` and as a step in `.github/workflows/validate.yml`
- Baseline after cleanup: **0 issues** default and production → `--max-issues 0`; only ever lower (already at floor)
- Other counts to ratchet: none applicable (no duplication tool, no suppressions, `console.*` is output)

## Probes (Phase 3)

- Fresh clone → `npm test` (now includes the dead-code gate) must be green
- Deliberate violation → an unreferenced `scripts/zz-probe.mjs` must make `check:dead-code` exit 1
