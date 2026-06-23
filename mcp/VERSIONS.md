# MCP pinned versions

Single source of truth: [`pinned-versions.json`](pinned-versions.json). Templates (`mcp.json.template`, `mcp-full.json.template`, repo `.mcp.json`) must match.

**Last verified:** 2026-06-23

## npm packages (npx -y)

| Package | Pin | Notes |
|---------|-----|-------|
| `@modelcontextprotocol/server-sequential-thinking` | 2025.12.18 | |
| `@modelcontextprotocol/server-github` | 2025.4.8 | full template only |
| `@modelcontextprotocol/server-postgres` | 0.6.2 | |
| `@modelcontextprotocol/server-redis` | 2025.4.25 | |
| `@modelcontextprotocol/server-slack` | 2025.4.25 | |
| `@modelcontextprotocol/server-memory` | 2026.1.26 | |
| `@upstash/context7-mcp` | 3.2.2 | |
| `firecrawl-mcp` | 3.21.3 | |
| `chrome-devtools-mcp` | 1.3.0 | Requires Chrome `--remote-debugging-port=9222` |
| `@supabase/mcp-server-supabase` | 0.8.2 | |
| `@playwright/mcp` | 0.0.76 | |
| `@notionhq/notion-mcp-server` | 2.4.1 | |

## PyPI packages (uvx)

| Template key | Package | Pin | Notes |
|--------------|---------|-----|-------|
| `aws-lambda` | `awslabs.lambda-tool-mcp-server` | 2.0.19 | Replaces yanked `lambda-mcp-server` |
| `aws-s3` | `awslabs.aws-api-mcp-server` | 1.3.45 | S3/CLI via AWS API MCP (no standalone `s3-mcp-server` on PyPI) |
| `aws-cloudwatch` | `awslabs.cloudwatch-mcp-server` | 0.0.8 | Replaces deprecated `cloudwatch-logs-mcp-server` |

## Bump procedure

1. Check registry: `npm view <pkg> version` or [PyPI](https://pypi.org/)
2. Update `pinned-versions.json`
3. Sync `mcp.json.template`, `mcp-full.json.template`, `.mcp.json`, and examples in this README
4. Run `node scripts/check-mcp-pins.mjs`
5. Note the bump in root `CHANGELOG.md`

## CI

`npm test` runs `scripts/check-mcp-pins.mjs` — commits with `@latest` or drifted pins fail.
