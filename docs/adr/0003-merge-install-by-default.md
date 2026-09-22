# 0003. Merge-install by default; make `--clean` opt-in

Status: Accepted            Date: 2026-09-19

## Context

Users keep personal skills, commands, and hooks next to kenji copies.
A mirror install (`rm` then copy) would wipe those. `--clean` exists
for people who want the machine to match this repo exactly, and it
backups first unless `--no-backup`.

## Decision

Default `npx @kensaurus/cursor-kenji` **merges**: write packaged files,
leave extra personal files, hash-check what we own. `--verify` is
merge-compatible (extras allowed). `--clean` / `--mirror` / `--force`
is opt-in wipe-and-rebuild.

## Rejected alternatives

- **Clean/mirror as the default** — rejected: one curious `npx` would
  delete the user's other skills.
- **Never offer clean** — rejected: maintainers and "make it match the
  pack" users need `--clean` plus `--restore`.
- **`--link` as default** — rejected: that is repo-dev only (symlink /
  junction).

## Consequences

Docs and help text lead with merge. Agents must not flip the default to
clean "to avoid leftover files." Revisit only with a superseding ADR.
