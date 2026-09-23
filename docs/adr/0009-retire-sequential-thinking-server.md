# 0009. Retire the Sequential Thinking MCP server

Status: Accepted            Date: 2026-09-23

## Context

`@modelcontextprotocol/server-sequential-thinking` shipped in
`mcp/mcp-full.json.template` and the pin list as an optional "reasoning
scratchpad": a tool the model calls once per thought, each call a round trip
that returns the thought back into context. Five skills and commands routed to
it conditionally ("if connected, use it for multi-file migrations"). On Claude
Opus 5.5 thinking is always on and effort is the only depth control; a
scratchpad server adds 5–15 tool calls (3–8k tokens) per research pass and no
depth. Its presence in a template also invites the retired "think step by
step" scaffolding back into skill prose.

## Decision

Remove the server from the full template, the pin list, `mcp/VERSIONS.md`,
README's Dev row and `mcp/README.md`; `check-mcp-pins` fails if it returns to
any template. Skills and commands that mentioned it now say that depth is set
with effort (`/effort`, or a skill's `effort:` frontmatter) and that
multi-file plans are written directly into the deliverable.

## Rejected alternatives

- **Keep it as an opt-in extra** — rejected: an extra nobody should route to
  is a trap for the next author; the template is the recommendation.
- **Replace it with a different reasoning server** — rejected: the model's own
  thinking is the reasoning surface; a server can only duplicate it at a cost.

## Consequences

11 npm pins instead of 12; `mcp/README.md`, README's Dev row and
`mcp/VERSIONS.md` no longer list it; `mcp/README.md` describes depth as
effort. Users who added it from an older template keep it — the essential
template never included it and merge installs never overwrite `mcp.json`.
