# research

# Production Research Protocol

> Before implementing anything non-trivial, research current best practices using MCP tools and built-in search. Understand the codebase first, then discover what the industry recommends, then map findings back to specific code changes.

---

## Step 1: Understand the Codebase Context (ALWAYS FIRST)

Before any external research, understand what you're working with.

### 1a. Discover Tech Stack

Read the dependency manifest to get exact library names and versions:

```
package.json          (Node/JS/TS)
requirements.txt      (Python)
pyproject.toml        (Python)
Cargo.toml            (Rust)
go.mod                (Go)
build.gradle          (Java/Kotlin)
Gemfile               (Ruby)
```

Extract: framework, major libraries, their exact versions.

### 1b. Read the Existing Implementation

Read the specific file(s) related to the topic being researched. Read the FULL file, not just a snippet. Understand:

- What pattern is currently used?
- What dependencies does it rely on?
- What are the known limitations or TODOs?
- What conventions does the project follow?

### 1c. Formulate Research Questions

Write out explicitly:

```
Current state: [what the project does now]
Gap/goal: [what needs to improve or be added]
Specific questions:
  1. [question about best practice]
  2. [question about alternative approach]
  3. [question about edge cases]
```

---

## Step 2: Context7 — Official Documentation

Fetch current docs for the libraries involved. Use the Context7 MCP (if available).

### Resolve Library ID

```json
CallMcpTool(server: "context7", toolName: "resolve-library-id", arguments: {
  "libraryName": "<library-name>",
  "query": "<your specific question>"
})
```

### Fetch Documentation

Pick the best match from the resolution results, then:

```json
CallMcpTool(server: "context7", toolName: "query-docs", arguments: {
  "libraryId": "<selected-id>",
  "query": "<your specific question>"
})
```

Run Context7 for each major library involved. Prefer version-specific IDs when available.

**If Context7 is unavailable**, skip to Step 3 and use Firecrawl to search official documentation sites directly.

---

## Step 3: Firecrawl — Three-Phase Deep Research

Use the `user-firecrawl` MCP server. The research happens in three phases: broad search, deep scrape, then discovery.

### Phase 1: Broad Search (find what's out there)

Search without scraping first — get URLs and snippets to evaluate:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "[library] [topic] best practices [current year]",
  "limit": 5,
  "sources": [{ "type": "web" }]
})
```

Run 2-3 search queries with different angles:

| Angle | Query Pattern |
|-------|---------------|
| Best practices | `[tech] [topic] best practices [current year]` |
| Implementation guide | `[tech] [topic] production implementation guide` |
| Common mistakes | `[tech] [topic] common mistakes pitfalls avoid` |
| Migration/upgrade | `[tech] [topic] migration guide from [old version]` |
| Security | `[tech] [topic] security OWASP [current year]` |
| Performance | `[tech] [topic] performance optimization production` |

Use search operators for precision:

- `site:` to target specific docs sites (e.g., `site:react.dev`, `site:nextjs.org`)
- `""` for exact phrases
- `-` to exclude irrelevant results

### Phase 2: Deep Scrape (read the best sources thoroughly)

From Phase 1 results, pick the 2-3 most authoritative URLs (official docs, maintainer blogs, engineering blogs). Scrape each for full content:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "<authoritative-url>",
  "formats": ["markdown"],
  "onlyMainContent": true
})
```

For extracting specific data points (config options, API parameters, migration steps):

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "<docs-url>",
  "formats": ["json"],
  "jsonOptions": {
    "prompt": "Extract the recommended configuration options and their default values",
    "schema": {
      "type": "object",
      "properties": {
        "options": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": { "type": "string" },
              "recommended": { "type": "string" },
              "description": { "type": "string" }
            }
          }
        }
      }
    }
  }
})
```

If a documentation site is large and you're not sure which page has the answer, use `firecrawl_map` first to discover the right page:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_map", arguments: {
  "url": "https://docs.example.com",
  "search": "[your topic]",
  "limit": 20
})
```

Then scrape the specific page(s) found.

### Phase 3: Discovery (find reference implementations)

Search for real-world codebases that solved the same problem:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "[tech] [topic] example implementation github",
  "limit": 5,
  "sources": [{ "type": "web" }]
})
```

Also try:

| Discovery Query | Purpose |
|-----------------|---------|
| `[tech] [topic] open source example` | Find real implementations |
| `[tech] [topic] starter template boilerplate` | Find scaffolded patterns |
| `[tech] [topic] "how we" OR "how I" production` | Find experience reports |
| `site:github.com [tech] [topic] in:readme` | Find repos directly |

Scrape the README or relevant docs of promising repos to extract their architectural decisions.

---

## Step 4: Gap Analysis (the core of research-driven enhancement)

Compare what the project currently does against what research found. Produce a structured gap analysis:

```
## Gap Analysis: [Topic]

### What the project does correctly
- [pattern 1]: aligns with [source] recommendation
- [pattern 2]: follows current best practice

### What the project is missing
- [gap 1]: [source] recommends X, project does Y or nothing
- [gap 2]: [source] warns against current pattern, suggests Z

### Anti-patterns detected
- [anti-pattern 1]: project uses [old pattern], [source] recommends [new pattern] because [reason]

### New capabilities available
- [capability 1]: [library] now supports [feature] as of v[X], not yet adopted
- [capability 2]: [new approach] reduces complexity, project uses legacy pattern
```

---

## Step 5: Fallback — WebSearch + WebFetch

When Firecrawl MCP is unavailable, use built-in tools with the same three-phase approach:

### Phase 1: Broad Search
```
WebSearch(search_term: "[tech] [topic] best practices [current year]")
```

### Phase 2: Deep Read
```
WebFetch(url: "<authoritative-url-from-search>")
```

### Phase 3: Discovery
```
WebSearch(search_term: "[tech] [topic] github example implementation")
```

---

## Step 6: Synthesize and Decide

### Trust Hierarchy (when sources conflict)

1. Official documentation (highest trust)
2. Core maintainer posts / RFCs / changelogs
3. Engineering blogs from major companies (Vercel, AWS, Google, Meta)
4. GitHub discussions on official repos
5. Community articles with high engagement (current year, verified working)

### Conflict Resolution

When two authoritative sources recommend different approaches:

1. Check which source matches the project's installed version
2. Check which approach aligns with the project's existing patterns
3. Check which approach has fewer trade-offs for the project's scale
4. If still tied, prefer the simpler approach

### Validation Gates

| Gate | Check |
|------|-------|
| Fresh | Published current year or previous year, matches installed version |
| Secure | No known CVEs, follows OWASP guidelines |
| Typed | Full TypeScript support, no `any` escape hatches |
| Tested | Can be unit/integration tested, doesn't break existing tests |
| Compatible | Works with the project's other dependencies and patterns |

**Reject a pattern if:** it uses a deprecated API, has known vulnerabilities, skips error handling, requires a major refactor with unclear benefit, or conflicts with the project's architecture.

---

## Step 7: Sequential Thinking — Plan Complex Implementations

For complex changes that touch multiple files or have architectural implications, use the Sequential Thinking MCP to reason through the implementation step by step:

```json
CallMcpTool(server: "user-sequential-thinking", toolName: "sequentialthinking", arguments: {
  "thought": "Step 1: The research recommends [pattern]. The project currently uses [old pattern] in [files]. The migration path is...",
  "nextThoughtNeeded": true,
  "thoughtNumber": 1,
  "totalThoughts": 5
})
```

Use Sequential Thinking when:
- The change touches 3+ files
- There are dependency ordering concerns
- The migration has intermediate states that must work
- You need to reason about side effects across the codebase

---

## Step 8: Apply to Codebase

Map every research finding to specific, actionable code changes:

```
## Implementation Plan

### Changes (ordered by priority)

1. **[file path]** — [what to change and why]
   - Before: [current pattern]
   - After: [recommended pattern]
   - Risk: [low/medium/high] — [explanation]

2. **[file path]** — [what to change and why]
   ...

### New dependencies (if any)
- [package@version] — [why needed]

### Breaking changes
- [description of what breaks and how to migrate]

### Edge cases to handle
- [edge case 1]
- [edge case 2]

### Verification
- [how to verify the change works]
```

---

## Output Template

After completing research, produce this summary:

```markdown
## Research: [Topic]

### Context
- Tech stack: [framework, libraries, versions]
- Current implementation: [brief description]
- Research goal: [what we're trying to learn/improve]

### Findings
[Key patterns and recommendations from research]

### Recommended Approach
[Pattern name] — [one-line why this is best for this project]

### Gap Analysis
- Missing: [what the project should add]
- Replace: [what the project should change]
- Keep: [what the project already does well]

### Implementation Plan
[Ordered list of file changes with before/after]

### Gotchas
- [Edge case or risk 1]
- [Edge case or risk 2]

### Sources
- [URL] — [what it provided]
- [URL] — [what it provided]
```

---

## Pre-Implementation Checklist

- [ ] Codebase context understood (tech stack, current patterns, specific files read)
- [ ] Context7 docs fetched (or skipped if unavailable)
- [ ] Firecrawl broad search completed (2-3 queries)
- [ ] Firecrawl deep scrape completed (2-3 best URLs)
- [ ] Discovery search completed (reference implementations found)
- [ ] Gap analysis produced (current vs recommended)
- [ ] Sources cross-referenced (3+ sources agree)
- [ ] Validation gates passed (fresh, secure, typed, tested, compatible)
- [ ] Implementation plan maps findings to specific files
- [ ] Edge cases identified
