---
description: "Reference for the essential MCP set (Firecrawl, Context7, Supabase) and headed playwright-cli — not the host /mcp manager"
---

# MCP-Powered Development

> **Named `/mcp-guide` (not `/mcp`).** Claude Code and the Cursor CLI both reserve `/mcp` for managing MCP servers. This file says which connection to use. It does not start or list servers.

The default template (`mcp/mcp.json.template`) is three servers. Prefer a Cursor plugin when that plugin is already connected, and skip the matching stdio server.

## Essential

### Context7 — library docs

Current docs for the version this repo has pinned. Use it before implementing an unfamiliar library API.

### Firecrawl — web research

Authenticated search and page scrape. Keep `FIRECRAWL_NO_SEARCH_FEEDBACK=1` and `FIRECRAWL_NO_ENDPOINT_FEEDBACK=1`. The `research` skill owns the broad-search → deep-scrape → discovery sequence, including the WebSearch / WebFetch fallback when Firecrawl is not connected.

### Supabase — project data

Queries, auth, storage, and migrations for the configured project. Do not invent a project ref.

## Browser

Skills drive a **visible** browser with `playwright-cli` (`npx --yes @playwright/cli@latest`, `--headed` on `open`). Read `protocol-browser-anti-stall` first. The Playwright MCP is not the default and is not what the skills call.

## Not installed by default

Sequential Thinking and the Playwright MCP exist only in `mcp/mcp-full.json.template`. Do not plan on them. A research or debug pass that needs a reasoning scratchpad writes the steps in the transcript.

## Which one

| Job | Use |
|-----|-----|
| Unfamiliar library API | Context7 for the pinned version, then Firecrawl if the docs page is not enough |
| Implementation patterns on the web | Firecrawl, or the host web search if it is not connected |
| Live database or auth state | Supabase |
| Click through a UI | playwright-cli, one user action at a time |
