# 0001. Ship Cursor, Claude, Codex, and Gemini from the custom npm installer

Status: Accepted            Date: 2026-09-19

## Context

Vercel `skills.sh` already lists this repo. A new session will tell users
to run `npx skills add kensaurus/cursor-kenji` and stop there. That CLI
copies skills. It does not install slash commands, agents, rules, or
Codex/Gemini ports. `--all` on that CLI means "all skills to all agents,"
not "all four tools."

## Decision

The supported full install is `npx @kensaurus/cursor-kenji --all`
(`bin/install.mjs`). That flag targets Cursor, Claude Code, Codex CLI,
and Gemini CLI. A bare `npx` stays Cursor-only for backward compatibility.
`npx skills add` remains documented as **skills only**. Do not replace the
custom installer with skills.sh.

## Rejected alternatives

- **skills.sh / `npx skills add` as the only installer** — rejected: users
  lose `/commands`, agents, rules, and the Codex/Gemini merges.
- **Document Cursor only and drop `--all`** — rejected: the pack is
  multi-tool; README lead command is `--all`. The bare invocation stays
  Cursor-only so existing one-tool installs do not change.
- **Four separate packages** — rejected: one pack, one version, one
  hash-check (see ADR 0005).

## Consequences

Docs and `check:docs-facts` must keep the two `--all` meanings distinct.
Agents must not delete `bin/install.mjs` in favor of the Vercel CLI.
Revisit only with a superseding ADR.
