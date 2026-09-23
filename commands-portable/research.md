---
description: "Research current best practices with official docs and web search before implementing anything non-trivial"
argument-hint: "[topic or question]"
---

# Production Research Protocol

Topic / question: $ARGUMENTS

Do not implement until the user asks or approves. This prompt is the tool-agnostic copy of the `research` skill for hosts that cannot load skills.

---

## Steps

### 1 — Understand the codebase first

Before any external search:

- Read the dependency manifest (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) for exact names and versions.
- Read the existing implementation related to the topic. Read the whole file, not a snippet.
- Write the current state, the gap, and the specific questions.

### 2 — Official docs for the pinned version

For every library involved:

1. If Context7 (or another docs MCP) is connected, query it for this version.
2. Otherwise open the canonical docs URL for the pinned version, not "latest" in general.
3. Note which version the page covers.
Recognizing a library or product name is not knowing its current state — search the name as written and read the pinned version's page, even when you know the tool well.

### 3 — Web research when docs are not enough

If Firecrawl is connected, use it: broad search, then scrape the two or three best official pages, then a discovery search for a real implementation. If it is not connected, use the host's web search and page fetch the same three ways.

Angles: best practices, a production implementation, and common mistakes. Prefer `site:` on the official docs host.

### 4 — Gap analysis

- What this repo already does that matches the docs
- What is missing or contradicted
- What to keep, replace, or reject (deprecated API, CVE, untyped, conflicts with this repo)

### 5 — Decide

Trust, in order: official docs for the pinned version, the maintainer changelog, a vendor engineering post, the official repo's issues, then a dated community article with working code.

Reject a pattern that uses a deprecated API, has a known vulnerability, skips errors, or needs a large rewrite for an unclear gain.

### 6 — Plan, then stop

For a non-trivial change, list the files, the before/after, the risks, and how to verify. Do not edit the repo in this step.

---

## Output

```
## Research: <topic>

### Context
- Pinned versions: ...
- Current implementation: ...

### Findings
...

### Recommended approach
...

### Gap analysis
- Keep / replace / missing: ...

### Implementation plan
1. path — change — risk

### Sources
- URL — what it provided
```

---

## Checklist

- [ ] Repo files were read before the first external search
- [ ] Docs match the pinned version
- [ ] At least one official source backs the recommendation
- [ ] The plan names concrete files
- [ ] No code was changed
