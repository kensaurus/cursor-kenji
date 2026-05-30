---
name: meta-mcp-builder
description: Guide for creating MCP (Model Context Protocol) servers that enable LLMs to interact with external services. Use when building MCP servers, integrating external APIs, or creating tools for AI agents.
---

# MCP Server Development Guide

Create MCP servers that enable LLMs to interact with external services.

## Overview

MCP (Model Context Protocol) servers expose tools that AI agents can use. Quality is measured by how well they enable agents to accomplish real tasks.

---

## Quick Start

### 1. Choose Stack

**Recommended:** TypeScript with MCP SDK
- High-quality SDK support
- Good compatibility across environments
- Strong type safety

**Alternative:** Python with FastMCP
- Good for Python-heavy workflows

### 2. Project Structure

```
my-mcp-server/
├── src/
│   ├── index.ts        # Entry point
│   ├── tools/          # Tool implementations
│   │   ├── search.ts
│   │   └── create.ts
│   └── utils/          # Shared utilities
│       ├── api-client.ts
│       └── error-handler.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Tool Design Principles

### 1. Clear Naming
```typescript
// ✅ Good - action-oriented, prefixed
'github_create_issue'
'github_list_repos'
'slack_send_message'

// ❌ Avoid - vague
'process'
'handle'
'do_thing'
```

### 2. Concise Descriptions
```typescript
{
  name: 'github_search_issues',
  description: 'Search GitHub issues by query, state, and labels. Returns issue title, number, and URL.',
}
```

### 3. Typed Parameters

```typescript
import { z } from 'zod';

const searchIssuesSchema = z.object({
  query: z.string().describe('Search query string'),
  state: z.enum(['open', 'closed', 'all']).default('open'),
  labels: z.array(z.string()).optional().describe('Filter by labels'),
  limit: z.number().min(1).max(100).default(10),
});
```

### 4. Actionable Errors

```typescript
// ❌ Bad
throw new Error('Failed');

// ✅ Good
throw new Error(
  `GitHub API rate limit exceeded. ` +
  `Resets at ${resetTime}. ` +
  `Try again later or authenticate for higher limits.`
);
```

---

## Implementation Pattern

### Basic Tool Structure

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'my-service',
  version: '1.0.0',
});

// Define tool
server.tool(
  'service_action',
  'Description of what this tool does and when to use it',
  {
    param1: z.string().describe('What this param is for'),
    param2: z.number().optional().describe('Optional param'),
  },
  async ({ param1, param2 }) => {
    // Implementation
    const result = await performAction(param1, param2);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);
```

### Tool Annotations

```typescript
server.tool(
  'delete_item',
  'Delete an item permanently',
  { id: z.string() },
  async ({ id }) => { /* ... */ },
  {
    annotations: {
      readOnlyHint: false,      // Modifies data
      destructiveHint: true,    // Cannot be undone
      idempotentHint: true,     // Safe to retry
      openWorldHint: false,     // Closed set of operations
    },
  }
);
```

---

## Best Practices

### API Coverage vs Workflow Tools

| Approach | When to Use |
|----------|-------------|
| Comprehensive API coverage | Agent needs flexibility to compose operations |
| Workflow tools | Specific task needs multi-step automation |

**Default:** Start with comprehensive API coverage, add workflow tools for common patterns.

### Response Formatting

```typescript
// Return structured data
return {
  content: [{
    type: 'text',
    text: JSON.stringify({
      success: true,
      data: results,
      metadata: { count: results.length },
    }, null, 2),
  }],
};
```

### Pagination Support

```typescript
const listItemsSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional().describe('Pagination cursor from previous response'),
});

// Return cursor in response
return {
  items: results,
  nextCursor: hasMore ? lastId : null,
};
```

---

## Testing

### 1. Build Check
```bash
npm run build  # Must pass without errors
```

### 2. Test with Inspector
```bash
npx @modelcontextprotocol/inspector
```

### 3. Test Each Tool
- Valid inputs → expected output
- Invalid inputs → helpful error
- Edge cases → graceful handling

---

## Quality Checklist

- [ ] All tools have clear, descriptive names
- [ ] All parameters have descriptions
- [ ] Error messages are actionable
- [ ] Pagination for list operations
- [ ] No hardcoded credentials
- [ ] TypeScript types for all inputs/outputs
- [ ] README documents all tools
- [ ] Examples provided for complex tools

---

## Common Patterns

### Authentication
```typescript
const apiKey = process.env.SERVICE_API_KEY;
if (!apiKey) {
  throw new Error('SERVICE_API_KEY environment variable required');
}
```

### Rate Limiting
```typescript
import { RateLimiter } from 'limiter';

const limiter = new RateLimiter({
  tokensPerInterval: 100,
  interval: 'minute',
});

async function callApi() {
  await limiter.removeTokens(1);
  // Make API call
}
```

### Caching
```typescript
const cache = new Map<string, { data: any; expiry: number }>();

async function getCached(key: string, fetcher: () => Promise<any>) {
  const cached = cache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }
  const data = await fetcher();
  cache.set(key, { data, expiry: Date.now() + 60000 });
  return data;
}
```

---

## Resources

- MCP Specification: https://modelcontextprotocol.io
- TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
- Python SDK: https://github.com/modelcontextprotocol/python-sdk
