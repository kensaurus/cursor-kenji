---
name: plan-dead-code
description: >
  Configuration-first dead-code audit — Knip baseline for unused files,
  exports and deps, plus duplication, debug residue, suppression debt,
  orphan assets, env and schema drift. Emits a ratchet plan; deletes
  nothing. Use when "find dead code", "is this code used", "unused
  exports". Apply → housekeep-dead-code.
license: MIT
---

# plan-dead-code — Prove it is dead before anyone deletes it

**Degree of freedom: MIXED.** Tool config authoring and the baseline
command set `[LOW freedom — run exactly]`; judging *reachable vs
proven-dead*, and what must keep working, `[HIGH freedom]`.

**Plan-only. This pass deletes nothing** — not a file, not an export, not
a dependency, not a row. It produces `plan-dead-code.md`: a reviewed
keep/kill list plus a ratchet baseline.

The failure mode this skill exists to prevent: an agent runs `knip` on a
vibe-coded repo, gets 300 findings, and starts deleting. **On a first run,
most findings are misconfiguration, not dead code.** Knip's own docs are
explicit — running `--fix` "before your configuration is fully settled is
dangerous", and `ignore` patterns are "a last resort" because "hiding a
result is not the same as resolving it."

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **plan-dead-code** (this) | *Nothing reaches this* — unreachable files/exports/deps/assets/schema (plan only) |
| `housekeep-dead-code` | Execute this plan — delete by category, install the ratchet |
| `plan-stub-checker` | *This reaches nothing* — dead buttons, unwired handlers |
| `plan-antislop` | *Looks machine-authored* — a taste judgment, not reachability |
| `plan-dependency-provenance` | Package **existence**, integrity, licensing, slopsquatting |
| `audit-code-quality` | Repo-wide smells and consistency drift |
| `workflow-refactor` | Restructuring live code that stays |
| `enhance-arch-boundaries` | Circular deps and layer direction (dependency-cruiser) |
| `audit-db-schema` | Schema design, constraints, naming |
| `housekeep-backlog` | The TODO/skipped-test register |
| `workflow-housekeep` | README, build artifacts, dependency bumps |

Boundary with `plan-dependency-provenance`: it owns *manifest facts* (does
this package exist, is it licensed). This owns the *graph fact* (nothing
imports it). A package that is real, licensed, and unimported is this
skill's finding.

## How to reason (every candidate)

1. **Observe** — which tool reported it, at what path, in which mode
2. **Interpret** — is it unreferenced, or referenced in a way the tool
   cannot see? (dynamic import, string route, generated types, Deno)
3. **Classify** — proven-dead / config-gap / intentional-public / needs-owner
4. **Severity** — deleting a dynamically-imported module is a runtime
   break that typecheck and unit tests both pass

Skipping **Interpret** is what turns a cleanup into an outage. A tool
finding is evidence, not a verdict.

## Worked example

> **Observe:** first `npx knip` on a Vite + React + Supabase app: 312
> findings — 47 unused files, 180 unused exports, 61 unused types, 24 deps.
> **Interpret:** `src/routes/**` is loaded via `import.meta.glob`, so no
> file imports it; `src/types/supabase.ts` is generated; every `ui/*.tsx`
> re-exports through a barrel; `supabase/functions/**` is Deno, never in
> the Vite graph.
> **Classify:** config-gap, not dead code. Add `entry` for the route glob,
> `ignoreExportsUsedInFile` for interfaces/types, a separate workspace for
> `supabase/functions`, and tag the design-system barrel `@public`.
> **Re-run:** 41 findings — 9 unused files, 22 exports, 6 types, 4 deps.
> **Baseline:** 41 default / 12 `--production`. That 12 is the highest-
> confidence set: dead in shipped code.
> **Plan:** kill the 9 files (7 are unused shadcn components — re-addable
> with `npx shadcn add`), 4 deps; `@public` the barrel; 2 exports
> `needs-owner` (look like a half-built public API).

---

## Phase 0 — Detect the stack before running anything  [LOW freedom — run exactly]

Config quality decides whether every later number means anything. Read,
don't guess:

- **Bundler / framework** — `vite.config.*`, `next.config.*`, `astro.config.*`,
  `remix.config.*`, `expo`/`metro.config.*`, `nest-cli.json`
- **Workspaces** — `pnpm-workspace.yaml`, `package.json#workspaces`, `nx.json`,
  `turbo.json`. A monorepo configured as one root project reports the whole
  repo as dead.
- **Non-Node graphs** — `supabase/functions/**` (Deno), Cloudflare Workers,
  `*.sql`, native shells. These are never in the app's module graph and must
  be separate workspaces or they report 100% unused.
- **Generated code** — `types/supabase.ts`, `*.gen.ts`, GraphQL codegen,
  Prisma client, route trees
- **Dynamic reference** — `rg "import\.meta\.glob|require\.context|await import\(|lazy\(" `
- **Existing config** — `knip.json`, `knip.jsonc`, `package.json#knip`,
  `.jscpd.json`, `tsconfig` `noUnusedLocals`/`noUnusedParameters`
- **Test/coverage state** — is behavior locked by tests yet? Record it.
  Deleting before coverage exists means deletion has no safety net.

Record: package manager, framework, workspace layout, non-Node arms,
generated paths, dynamic-import mechanisms, whether tests pass today.

> **Sequencing note.** In the plan loop, `plan-test-coverage` (step 3)
> locks behavior in tests. Running this audit is safe any time; **executing
> it before behavior is locked is the risky order.** Say so in the plan.

---

## Phase 1 — Author the config, then trust the output  [LOW freedom — config before findings]

Install as a devDependency (never a global): `npm i -D knip`. Requires the
project's own TypeScript.

**1a. First run, read hints only.**

```
npx knip
```

Configuration hints print at the top. **Resolve those before reading a
single finding.** Hints are Knip telling you your config is wrong.

**1b. Fix hints in `knip.json` — not with `ignore`.**

| Symptom | Correct fix | Not this |
|---|---|---|
| Whole directory unused | Add `entry` pattern for its real entry | `ignore` the directory |
| `vite.config.ts` reported unused | Enable/disable that plugin explicitly | `ignore` the file |
| Flood of unused `interface`/`type` | `ignoreExportsUsedInFile: { interface: true, type: true }` | `--exclude types` |
| Unresolved path-alias imports | Add `paths` (tsconfig semantics) | `ignore` the importer |
| Node builtins as unused deps | `ignoreDependencies` | blanket `ignore` |
| Test files reported | `--production` | negated `project` patterns |
| Generated file's exports unused | `ignore` that one file *(legitimate)* | — |

Knip already respects `.gitignore` — do not re-list `node_modules`,
`dist`, `build`. Do not duplicate entry points that auto-detected plugins
already add.

**1c. Repeat 1a–1b until hints are clean.** This loop is the skill. Config
recipes for Vite+React+Supabase, Next.js App Router, and monorepos are in
[`references/knip-config.md`](references/knip-config.md).

---

## Phase 2 — Baseline the module graph  [LOW freedom — run exactly]

Run **both** modes; Knip's CI guide suggests considering a default run
alongside a production run.

```
npx knip --production   # shipped code only: no tests, config, stories, devDeps
npx knip                # everything
```

Read findings in Knip's documented order, because it cascades — "getting
the list of unused files right trickles down into the other issue types":

1. **Unused files** — one dead file manufactures phantom unused exports
   *and* phantom unused deps downstream
2. **Unresolved imports** — usually a `paths` gap, not dead code
3. **Unused exports / types**
4. **Unused dependencies**

Scope with `--files`, `--exports`, `--dependencies` to read one class at a
time. `--production` excludes test files, config files, stories and
devDependencies; `--strict` additionally isolates workspaces to direct
dependencies.

**Build the keep-working list.** For every finding, ask what would break.
Named suspects, each needing a positive reason to keep:

- Glob/dynamic-imported routes and pages
- String-referenced handlers, feature-flag targets, job names
- Generated types (regenerate, don't hand-edit)
- Deliberate public API → tag `@public` (Knip then stops reporting it)
- Test-only exports that production mode flags → tag `@internal`
- Duplicate default+named export pairs → tag `@alias`

Tags beat config here: they live next to the code and Knip reports a **tag
hint** when a tag becomes unnecessary, so the exemption cannot rot.

---

## Phase 3 — The seven surfaces Knip cannot see  [MIXED — greps run exactly]

Knip owns the module graph. These are the classes a vibe-coded repo
accumulates that it will never report. Count each; fix nothing.

**3a. Unused variables and imports inside files.** Knip explicitly does
not do this. Baseline with `tsc --noEmit` under `noUnusedLocals` +
`noUnusedParameters`, or your linter's unused rule. Record the count and
whether the compiler flags are even on.

**3b. Copy-paste duplication.** The class AI-assisted repos are worst at,
and no other skill in this pack detects it. `npx jscpd src --min-tokens 50
--reporters json` (50 is the default; raising it cuts boilerplate noise).
Record duplication % and the top clone pairs. **Duplication is a refactor
finding, not a deletion finding** — route to `workflow-refactor`.

**3c. Debug residue.** Mechanical and countable:

```
rg -n "console\.(log|debug|warn)|debugger" --glob '!*test*' --glob '!*spec*'
rg -n "\.(only|skip|todo)\(|xit\(|xdescribe\(|fdescribe\("
```

Plus commented-out code blocks and `utils`/`helpers` dumping grounds.
`.only` in a committed test is worse than dead code — it silently disables
the rest of the file. Flag those **high**.

**3d. Suppression debt.** The count that must only ever shrink. Use
`rg -o … | wc -l` for a repo total — `rg -c` prints per-file counts of
*matching lines*, which is not a number you can ratchet:

```
rg -o "@ts-ignore|@ts-expect-error|eslint-disable|biome-ignore" | wc -l
rg -o ":\s*any\b|as any\b" | wc -l
```

Also catch stale suppressions: a `@ts-expect-error` on a line that no
longer errors is itself dead code, and TypeScript reports it.

**3e. Orphan assets.** Knip reads the module graph, so it cannot see
binaries. Cross-reference every filename under `public/`, `assets/`,
`static/` against source, CSS, and HTML. Beware hashed and templated
references (`` `/img/${name}.png` ``) — those make a name-based scan
report false orphans, so a folder referenced only by template string is
`needs-owner`, not dead.

**3f. Env var drift, both directions.** Referenced-but-undeclared is a
production break; declared-but-unreferenced is dead config:

```
rg -o "import\.meta\.env\.[A-Z0-9_]+|process\.env\.[A-Z0-9_]+" -r '$0' --no-filename | sort -u
```

Diff that set against `.env.example`. Report names only — **never print
values.**

**3g. Dead database schema.**  [read-only this pass]

These three commands only read, so they are safe against any target
including production — and index-scan statistics are *only* meaningful
against real traffic, so prefer production and record the stats window.
The non-production gate applies to anything that writes.

```
supabase db lint                            # plpgsql_check: dead code after RETURN, unused variables
supabase inspect db unused-indexes          # indexes with low scan counts
supabase inspect db seq-scans
```

Then cross-reference client usage to find orphans the database cannot know
about: `rg -o "\.from\('[^']+'\)|\.rpc\('[^']+'\)|functions\.invoke\('[^']+'\)"`
against the table/function/Edge-Function inventory. Also: Edge Functions
deployed but never invoked, migration sprawl, and whether generated types
still match the schema (`supabase gen types` diff).

**Low index scans on a young or read-light database is not evidence of a
dead index.** Record the stats window. Every schema finding lands in the
plan as a proposal — **no `DROP` is authored in this pass**, and destructive
migrations route to `plan-data-integrity` and `db-migrator`.

---

## Phase 4 — Write `plan-dead-code.md`  [LOW freedom on format]

**4a. Baseline table** — the ratchet's starting line. Numbers only ever go down.

| Metric | Command | Today |
|---|---|---|
| Knip issues (production) | `knip --production` | |
| Knip issues (default) | `knip` | |
| Unused files / exports / types / deps | `knip --files` etc. | |
| Unused locals | `tsc --noEmit` | |
| Duplication % | `jscpd` | |
| `console.*` / `debugger` | `rg -o … \| wc -l` | |
| `.only` / `.skip` / `.todo` / `x`-prefixed | `rg -o … \| wc -l` | |
| Suppressions / `any` | `rg -o … \| wc -l` | |
| Orphan assets | asset scan | |
| Env drift (missing / unused) | env diff | |
| Unused indexes / orphan tables / functions | `supabase inspect` | |

**4b. Keep/kill list** — one row per finding:
`path:line | class | evidence | verdict | risk | what must keep working`

Verdicts: `kill` · `keep-tagged` (`@public`/`@internal`/`@alias`) ·
`keep-config` (config gap, fix the config) · `needs-owner` (a human must
decide). Never guess `kill` to shrink the list.

**4c. Phased burndown** — ordered so each phase's verification is
meaningful, cheapest-to-review first, and the pre-approved file list going
first so later phases do not churn files that are about to be deleted.

**4d. Ratchet proposal** — the `knip` script, the CI job with
`--max-issues` set to today's count, and which aggregator gate it joins.

**4e. Cause-not-count callouts.** If 40 exports come from one barrel
`index.ts`, the finding is *the barrel*, not 40 exports. Name the root
cause so execution fixes one thing instead of forty.

---

## Self-critique before delivering  [LOW freedom — do not skip]

1. **Config settled** — hints resolved; no `ignore` used where `entry`,
   `paths`, `--production`, or a tag was the real fix
2. **Both modes run** — `--production` and default, reported separately
3. **Interpreted, not transcribed** — every `kill` names its evidence;
   dynamic/generated/Deno paths were actively checked
4. **Nothing deleted** — no file, export, dep, asset, or row changed
5. **Non-graph surfaces counted** — all seven of Phase 3, or explicitly
   `not run` with a reason
6. **No secret values** — env findings are names only
7. **Baseline is real** — every number came from an executed command, not
   an estimate
8. **Right owner** — duplication → `workflow-refactor`; unwired UI →
   `plan-stub-checker`; slop taste → `plan-antislop`; package existence →
   `plan-dependency-provenance`; circular deps → `enhance-arch-boundaries`;
   destructive SQL → `plan-data-integrity`
9. **Safety net stated** — whether tests currently lock the behavior being
   deleted

## Definition of Done

- [ ] Stack, workspaces, non-Node arms, generated and dynamic paths recorded
- [ ] `knip.json` authored; configuration hints clean
- [ ] Both `--production` and default baselines captured
- [ ] Findings read files → unresolved → exports → deps
- [ ] Keep-working list built; tags proposed instead of config where they fit
- [ ] Seven non-graph surfaces counted or marked `not run` with a reason
- [ ] `plan-dead-code.md` written: baseline, keep/kill list, phases, ratchet
- [ ] Root causes named (barrels, dumping grounds) — not just item counts
- [ ] Zero deletions this pass; execution handed to `housekeep-dead-code`

## Output format

1. **Config diff** — what `knip.json` changed and which hint each resolved
2. **Before/after finding counts** — first run vs configured run (the honest
   measure of how much was never dead)
3. **Baseline table** — 4a, fully populated
4. **Keep/kill list** — 4b, grouped by class
5. **Phased burndown** — 4c with risk per phase
6. **Ratchet proposal** — 4d
7. **Handoffs** — per the self-critique owner list

Plan only. Deletion begins in `housekeep-dead-code`, after approval.
