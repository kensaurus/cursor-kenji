# MCP Server Configuration

Model Context Protocol (MCP) servers extend Cursor's AI capabilities with external tools.

## Setup

1. Copy the template to your Cursor config:

```bash
cp mcp.json.template ~/.cursor/mcp.json
```

2. Edit `~/.cursor/mcp.json` and replace placeholder values with your actual API keys.

3. Restart Cursor to activate MCP servers.

## Servers

### Sequential Thinking
**Purpose:** Step-by-step reasoning for complex tasks.
**API Key Required:** No
**Package:** `@modelcontextprotocol/server-sequential-thinking`

Use before any complex implementation to plan steps, identify dependencies, and order operations.

### Context7
**Purpose:** Fetch live, up-to-date library documentation.
**API Key Required:** No
**Package:** `@upstash/context7-mcp`

Use before writing code with any external library. Training data may be outdated — Context7 fetches current API references.

### Firecrawl
**Purpose:** Web scraping for research and documentation.
**API Key Required:** Yes — get one at [firecrawl.dev](https://firecrawl.dev)
**Package:** `firecrawl-mcp`

Use when researching new patterns, checking latest best practices, or gathering implementation examples.

### Chrome DevTools MCP
**Purpose:** Browser automation, testing, and debugging.
**API Key Required:** No (requires Chrome with remote debugging)
**Package:** `chrome-devtools-mcp`

**Prerequisites:** Launch Chrome with remote debugging:

```bash
# Linux
google-chrome --remote-debugging-port=9222

# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```

Use after any UI implementation to check console errors, test interactions, and take screenshots.

### Supabase MCP
**Purpose:** Direct database access, auth management, storage operations.
**API Key Required:** Yes — Supabase access token and project ref
**Package:** `@supabase/mcp-server-supabase`

**Setup:**
1. Get your project ref from your Supabase dashboard URL
2. Generate an access token at [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)

Use for querying data, checking schema, verifying RLS policies, and debugging data issues.

## Workflow Integration

These MCP servers integrate with the skills in this repo:

| Workflow Step | MCP Server | Skill |
|---------------|------------|-------|
| Plan implementation | Sequential Thinking | `creative-workflow` |
| Fetch library docs | Context7 | All coding skills |
| Research patterns | Firecrawl | `research` command |
| Check database | Supabase | `database-optimization` |
| Test in browser | Chrome DevTools | `webapp-testing` |
| Verify UI | Chrome DevTools | `uiux-enhancement` |
| Debug data | Supabase | `error-handling` |

## Adding More MCP Servers

To add a new MCP server, add an entry to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "my-new-server": {
      "command": "npx",
      "args": ["-y", "my-mcp-package@latest"],
      "env": {
        "API_KEY": "your-key-here"
      }
    }
  }
}
```

See the `mcp-builder` skill for how to create custom MCP servers.
