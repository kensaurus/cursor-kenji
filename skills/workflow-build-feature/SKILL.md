---
name: workflow-build-feature
description: >-
  End-to-end feature build workflow: spec → TDD → implement → smoke test → PR.
  Sequences workflow-spec-tdd, test-unit, test-playwright, and workflow-pr into
  a single tracked loop. The single entry point for "build a feature",
  "implement this", "add X", "ship a new capability", or any non-trivial
  feature request. Asks for scope clarification before starting if the request
  is ambiguous. Generic across web, mobile, and full-stack repos.
license: MIT
---

# workflow-build-feature — End-to-End Feature Build

One command that runs the full feature loop. Don't skip phases — each gate
catches a class of defects the next phase can't.

---

## Phase sequence

```
1. SPEC        → workflow-spec-tdd (contract, plan, RED test)
2. BUILD       → implement against the spec (GREEN)
3. UNIT TEST   → test-unit (edge cases, mocks, coverage)
4. SMOKE       → test-playwright (drive the live app as a real user, fix pain points)
5. PR          → workflow-pr (create PR with test evidence)
```

---

## Phase 1: Spec (read workflow-spec-tdd)

> Read `~/.cursor/skills/workflow-spec-tdd/SKILL.md` and follow it.

Key outputs:
- Written spec (what it does, what it doesn't do, acceptance criteria)
- File-mapped implementation plan (which files to create/edit)
- A RED failing test that encodes the acceptance criteria

**Do not write implementation code until the spec and RED test exist.**

---

## Phase 2: Build

Implement against the spec. Rules:
- One logical change per commit
- Match the file patterns already in the repo — no new abstractions unless the spec calls for them
- Full-stack: if the feature reads/writes data, verify the DB migration is applied before the frontend ships (see full-stack-ship-discipline rule)

---

## Phase 3: Unit tests (read test-unit)

> Read `~/.cursor/skills/test-unit/SKILL.md` and follow it.

Focus on:
- The new code's happy path, error paths, and edge cases
- Any shared utility functions introduced

---

## Phase 4: Smoke test (read test-playwright)

> Read `~/.cursor/skills/test-playwright/SKILL.md` and follow it.

Drive the live app through the new feature as a real user. Fix pain points inline (full-stack: UI + API + DB). Capture screenshots as evidence.

Before any browser action, apply `protocol-browser-anti-stall` rules.

---

## Phase 5: PR (read workflow-pr)

> Read `~/.cursor/skills/workflow-pr/SKILL.md` and follow it.

Include in the PR description:
- Link to the spec / acceptance criteria
- Screenshots or screen recording from Phase 4
- Migration notes if schema changed

---

## Done criteria

- [ ] Spec written and agreed
- [ ] RED test exists and was failing before implementation
- [ ] Implementation makes test GREEN
- [ ] Unit tests cover happy path + at least one error path
- [ ] Smoke test drove the live app and found no blockers
- [ ] DB migration applied and verified (if applicable)
- [ ] PR open with description and evidence
