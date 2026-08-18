---
name: domain-modeling
description: >-
  Build and sharpen a project's domain model — a CONTEXT.md glossary and
  ubiquitous language. Use when pinning down terminology, or the agent "uses the
  wrong words". Repo decision-memory system (INDEX.md, rejected alternatives) →
  docs-adr.
license: MIT
---

# Domain Modeling

> A shared language between user, agent, and codebase pays off every session:
> consistent naming, fewer tokens spent describing concepts, and a codebase the
> agent can navigate by vocabulary. Adapted from
> [mattpocock/skills](https://github.com/mattpocock/skills) (MIT).

This is the *active* discipline — challenging terms, inventing edge-case
scenarios, and writing the glossary and decisions down the moment they
crystallize. Merely *reading* `CONTEXT.md` for vocabulary is a one-line habit any
skill can do; this skill is for **changing** the model, not consuming it.

## File structure

```
/
├── CONTEXT.md            ← the glossary (create on first resolved term)
├── docs/adr/             ← architectural decision records
│   └── 0001-<dash-case-title>.md
└── src/
```

Create files lazily — only when there is something to write. `CONTEXT.md` is a
glossary and nothing else: no implementation details, no spec content, no
scratch notes.

### CONTEXT.md entry format

```markdown
**<Canonical term>**:
<One- or two-line definition in domain language, not implementation language.>
_Avoid_: <rejected synonyms, comma-separated>
```

## During the session

- **Challenge against the glossary.** When the user uses a term that conflicts
  with `CONTEXT.md`, call it out immediately: "Your glossary defines
  'cancellation' as X, but you seem to mean Y — which is it?"
- **Sharpen fuzzy language.** When a term is vague or overloaded, propose a
  precise canonical term: "You're saying 'account' — do you mean the Customer or
  the User?"
- **Stress-test with concrete scenarios.** Invent edge-case scenarios that force
  precision about the boundaries between concepts.
- **Cross-reference with code.** When the user states how something works, check
  whether the code agrees, and surface contradictions.
- **Update `CONTEXT.md` inline.** Capture each resolved term the moment it is
  resolved — don't batch.

## ADRs — offer sparingly

Only offer to create an ADR when **all three** hold:

1. **Hard to reverse** — changing your mind later costs something real.
2. **Surprising without context** — a future reader will ask "why this way?"
3. **A real trade-off** — genuine alternatives existed and one was picked for
   specific reasons.

ADR body: Status, Context (the forces), Decision (what and why), Consequences
(what becomes easier/harder). Number sequentially in `docs/adr/`.

**Related:** `grilling` (use both in one session to interview *and* capture the
language), `design-prd`, `docs-coauthor`.
