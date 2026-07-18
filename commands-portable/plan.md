---
description: "Research, clarify requirements, and produce an approved implementation plan before writing code"
argument-hint: "[task or feature]"
---

# Plan Before Coding

Task / feature: $ARGUMENTS

---

## When to use

- New features or significant changes (not a one-liner fix)
- Ambiguous requirements where multiple valid designs exist
- Any change touching auth, DB schema, payments, or public API

## When to skip

- Obvious bug fix with a clear cause and a single correct fix
- Pure copy/text change with no logic involved

---

## Steps

### 1 — Clarify requirements

Before designing, confirm:
- What problem does this solve for the user?
- What is explicitly out of scope?
- Are there existing patterns in the codebase that should be followed?
- What are the acceptance criteria?

### 2 — Research (if non-trivial technology involved)

- Scan `README.md`, `package.json`, existing code for the relevant area.
- Check docs for any library or API involved.
- Look for prior art in the repo (`grep -rn 'similar pattern'`).

### 3 — Draft implementation plan

Write a step-by-step plan covering:

```
## Implementation Plan: <task name>

### Problem
<one sentence>

### Approach
<why this approach vs alternatives>

### Steps
1. <atomic unit of work — file / function / migration>
2. ...

### Files affected
- `path/to/file.ts` — what changes and why
- ...

### Backend dependencies
- [ ] New table / column / RPC / policy / bucket needed? (list each)
- [ ] Migration required?
- [ ] Edge function deploy required?

### Risks & open questions
- <list anything uncertain>

### Definition of done
- [ ] UI compiles without type errors
- [ ] Backend changes deployed and verified
- [ ] Tests pass
- [ ] Real user flow works end-to-end
```

### 4 — Get approval before executing

Share the plan. Do not start implementation until the plan is confirmed.
Changes to auth, RLS, secrets, payments, or data mutations require explicit sign-off.

### 5 — Execute in checkpointed units

Work through one step at a time. After each step: verify (compile / test / lint), then pause at phase boundaries.

### 6 — Verify end-to-end

- Every new RPC / table / column / policy exists on the remote backend.
- Anonymous + authenticated callers can reach the new surface.
- The frontend error path exercises the new backend, not a stale fallback.
