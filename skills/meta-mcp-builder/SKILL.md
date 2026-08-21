---
name: meta-mcp-builder
description: >
  Scaffold and implement Model Context Protocol (MCP) servers that expose external
  services, APIs, and data sources as typed tools and resources for LLM agents. Use when
  the user says "build an MCP server", "give Claude access to X", "create an MCP tool",
  "expose my API to an agent", or "AI agent integration".
license: MIT
---

# MCP Server Development Guide

**Degree of freedom: MIXED.** Which tools to expose `[HIGH freedom]`;
SDK tool shape, annotations, env-based auth, and Inspector
`[LOW freedom — run exactly]`.

Create MCP servers that enable LLMs to interact with external services.

## How to reason

1. **Observe** — the real agent job (search, create, send), not the raw API catalog
2. **Interpret** — compose-from-primitives vs one workflow tool
3. **Classify** — prefixed action names, typed params, annotations (readOnly / destructive / idempotent)
4. **Verify** — Inspector + valid/invalid/edge; errors tell the agent what to do next

## Worked example

> **Observe:** "give Claude access to Linear"; agents will search issues and file one — not walk the full GraphQL schema.
> **Interpret:** start with workflow-shaped tools, not 40 raw endpoints.
> **Classify:** `linear_search_issues`, `linear_create_issue`; zod params; `create` is `readOnlyHint: false`.
> **Ship:** env `LINEAR_API_KEY` (throw if missing); Inspector on both tools; no hardcoded token.

## Self-critique before reporting

- **Names** — action-oriented and service-prefixed
- **Errors actionable** — next step in the message; no hardcoded credentials
- **Annotations match** — destructive tools say so
- **Right owner** — pack SKILL.md authoring → `meta-skill-creator`; calling an existing MCP is not this skill

## Overview

MCP (Model Context Protocol) servers expose tools that AI agents can use. Quality is measured by how well they enable agents to accomplish real tasks.

---

## Quick Start  [HIGH freedom]

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
│ ├── index.ts # Entry point
│ ├── tools/ # Tool implementations
│ │ ├── search.ts
│ │ └── create.ts
│ └── utils/ # Shared utilities
│ ├── api-client.ts
│ └── error-handler.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Tool Design Principles  [HIGH freedom]

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

## Implementation Pattern  [LOW freedom — this shape]

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
 readOnlyHint: false, // Modifies data
 destructiveHint: true, // Cannot be undone
 idempotentHint: true, // Safe to retry
 openWorldHint: false, // Closed set of operations
 },
 }
);
```

---

## Best Practices  [HIGH freedom]

### API Coverage vs Workflow Tools

| Approach | When to Use |
|----------|-------------|
| full API coverage | Agent needs flexibility to compose operations |
| Workflow tools | Specific task needs multi-step automation |

**Default:** Start with full API coverage, add workflow tools for common patterns.

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

## Testing  [LOW freedom — run exactly]

### 1. Build Check
```bash
npm run build # Must pass without errors
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

## Quality Checklist  [LOW freedom — do not skip]

- [ ] All tools have clear, descriptive names
- [ ] All parameters have descriptions
- [ ] Error messages are actionable
- [ ] Pagination for list operations
- [ ] No hardcoded credentials
- [ ] TypeScript types for all inputs/outputs
- [ ] README documents all tools
- [ ] Examples provided for complex tools

---

## Common Patterns  [HIGH freedom]

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
