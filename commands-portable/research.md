---
description: "Research current best practices with official docs and web search before implementing anything non-trivial"
argument-hint: "[topic or question]"
---

# Production Research Protocol

Topic / question: $ARGUMENTS

---

## Steps

### 1 — Understand codebase context

Before external research:
- Read `package.json` / `Cargo.toml` / `pyproject.toml` to discover the tech stack and pinned versions.
- Find and read existing implementations related to the topic (`grep -rn '<topic>'`).
- Formulate specific research questions.

### 2 — Check official docs

For every library or framework involved:
1. Find the canonical docs URL for the pinned version.
2. Query docs with the specific question.
3. Note the version the docs cover — confirm it matches the project's pinned version.

### 3 — Web research (if needed)

Use three angles:
- **Broad search:** `site:docs.<library>.dev <topic>` or `<library> <topic> best practices`
- **Deep read:** target the exact page most likely to have the answer
- **Discovery:** `<library> <topic> changelog OR migration OR breaking` to catch version-specific gotchas

### 4 — Gap analysis

After collecting sources, answer:
- What is definitively confirmed? (with source URL)
- What is uncertain or contradicted across sources?
- What is missing and needs a fallback or assumption?

### 5 — Fallback: targeted search

If official docs and reading don't resolve it:
- Search `<library> <version> <specific question> github issue OR stackoverflow OR discussion`
- Prefer primary sources (official repo issues, changelogs) over blog posts.

### 6 — Synthesize & decide

Trust hierarchy:
1. Official docs for the pinned version (highest)
2. Official changelog / migration guide
3. Official repo issues / discussions
4. Popular community resources with verifiable code
5. Blog posts / tutorials (verify code runs)

Validation gates before adopting:
- **Fresh:** documented for the version in use (not a deprecated API)
- **Secure:** no known CVEs, no exposed secrets
- **Typed:** types available or wrappable
- **Tested:** example code is testable
- **Compatible:** does not conflict with other pinned dependencies

### 7 — For complex changes: think step-by-step

Before writing code:
- What existing code must stay identical?
- What is the minimal surface of change?
- What could go wrong and how would you detect it?

### 8 — Apply to codebase

Only after completing the above:
- State the decision and rationale.
- List exact files to change and what each change achieves.
- Begin implementation per the approved plan.

---

## Output template

```
## Research Summary: <topic>

**Pinned version:** X.Y.Z
**Confirmed answer:** <one sentence>
**Source(s):** <URL>, <URL>
**Version caveat (if any):** <e.g., API changed in vX.Y>
**Decision:** <what we will do and why>
**Rejected alternatives:** <what we considered and why not>
```

---

## Pre-implementation checklist

- [ ] Docs read for the exact pinned version (not latest)
- [ ] No deprecated APIs used
- [ ] Types confirmed available
- [ ] Existing tests still pass with this approach
- [ ] No new dependency added without checking existing libraries first
