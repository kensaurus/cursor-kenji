# 0004. Do not submit this pack to the Official MCP Registry

Status: Accepted            Date: 2026-09-19

## Context

Promotion checklists include MCP catalogs (Official MCP Registry,
Smithery, mcp.so, PulseMCP). Those catalogs want a runnable MCP server
(`server.json`, npm package or remote URL). This repo ships
`mcp/*.json.template` — config the installer copies if missing, never
overwrites.

## Decision

**Do not submit** cursor-kenji to the Official MCP Registry or the
other "Submit MCP" catalogs listed in `docs/DISTRIBUTION.md` and
`docs/PROMOTION.md`. Listing there would claim we publish a server.

## Rejected alternatives

- **Submit templates as a server** — rejected: false listing; reviewers
  would expect a process that is not in this package.
- **Build a kenji MCP server just to list** — rejected: out of scope;
  the pack is skills + commands + agents + rules (ADR 0005).
- **Overwrite the user's `mcp.json` on install** — rejected: the
  installer only writes the template when the file is missing.

## Consequences

Agents running a listing pass must skip MCP registries. A real kenji
MCP server would be a new artifact and a superseding ADR.
