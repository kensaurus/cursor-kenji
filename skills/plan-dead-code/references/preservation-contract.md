# Preservation contract — plan-dead-code

This pass produces a document. It changes no behavior and no files other than
writing `plan-dead-code.md`.

## Never do in this pass

- **Delete, `--fix`, `rm`, or edit `package.json` / the lockfile.** The
  deliverable is a report plus a *proposed* config.
- **Commit `knip.json`.** It lives in the report; `housekeep-dead-code`
  commits it.
- **Add an `ignore` glob** for anything other than a machine-generated file
  you regenerate rather than edit. `entry`, `paths`, `--production`, and the
  `@public` / `@internal` / `@alias` tags are the real remedies.
- **Report a chain child as its own finding.** Children live under their head.
- **Treat a passing test as proof something is alive.** Production mode
  decides reachability; a test that only imports dead code is dead too.
- **Print an env value, a token, or a connection string.** Names only.
- **Write to a database.** Every schema query in Phase 3g is read-only.
- **Estimate a count.** Every baseline number comes from an executed command.
  If a check could not run, the row reads `not run` with the reason.

## Before any change proposal

One line per phase: **what currently works here that must keep working.** The
router, the auth flow, the build, the scripts CI runs, the webhook nobody
imports. A phase without that line is not reviewable.

## Verdict buckets

| Bucket | Meaning |
|---|---|
| `kill` | Unreachable in production mode *after* the config was settled |
| `keep-tagged` | Reachable, or deliberately public — remedy is `@public` / `@internal` / `@alias` |
| `keep-config` | The finding is a gap in Knip's model — remedy is `entry`, `paths`, or a plugin |
| `chain` | Disappears when its parent goes; not counted separately |
| `needs-owner` | Plausibly dead, but a human must decide. Never upgraded to `kill` to shrink the list |
| `defer` | Real, but over M effort → `workflow-refactor` / `housekeep-backlog` |

## The failure this contract prevents

An agent runs `knip` on a vibe-coded repo, gets three hundred findings, and
starts deleting. Typecheck stays green and the unit tests stay green, because
neither can see a route loaded by template string, an Edge Function called by
a Stripe webhook, or an asset referenced from a CSS `url()`. The app breaks in
production, and the commit that broke it deleted forty other things at the same
time.

Configuration first, evidence per row, and one category per commit exist to
make that specific outcome impossible.
