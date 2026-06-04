---
name: workflow-spec-tdd
description: Stop vibe-coding with a spec → plan → TDD loop before writing a line. Use for any non-trivial feature, refactor, or bug fix on web, React Native, or Capacitor. Use when asked to "build", "implement", "add a feature", "this keeps breaking", "do it properly", or when LLM output keeps being wrong.
license: MIT
---

# Spec → Plan → TDD Workflow

> The antidote to vibe-coding. LLMs fail not because they can't write code, but because they skip the thinking: they guess requirements, write code before tests, and declare victory without verification. This skill forces the discipline. Stack-agnostic — works for web, React Native, and Capacitor.
>
> Adapted from [obra/superpowers](https://github.com/obra/superpowers) (MIT) and the Karpathy LLM-coding guardrails.

## When this fires

Use for: a new feature, a multi-file refactor, a recurring bug, anything ambiguous, or any task where "looks done" has burned you before.

Skip for: one-line edits, pure formatting, a single obvious fix. Don't ceremony-tax trivial work.

## The loop (do not skip phases)

```
0. Read the room → understand repo + exact ask
1. Brainstorm → surface assumptions, explore alternatives
2. Spec → write the contract: behavior, inputs, outputs, edge cases
3. Plan → ordered, file-mapped steps with a verification per step
4. TDD → RED (failing test) → GREEN (minimal code) → REFACTOR, per step
5. Self-review → spec coverage + quality gate before "done"
```

### Phase 0 — Read the room (always first)
- Read the dependency manifest for exact versions; read the files you'll touch in full.
- Restate the ask in one sentence and name the surface (web / RN / Capacitor). If the surface has a domain skill (`mobile-mobile-capacitor-platform`, `mobile-mobile-rn-performance`, `enhance-*`), note it.
- If the request is genuinely ambiguous, ask **exactly one** clarifying question. Otherwise state your reading and proceed.

### Phase 1 — Brainstorm (before any code)
- List the **hidden assumptions** the naive implementation would make. Each is a future bug.
- Explore 2–3 approaches; pick one and say why in one line. Prefer the existing repo pattern over a new abstraction.
- Apply **YAGNI**: build only what the spec needs. No speculative config, flags, or layers.

### Phase 2 — Spec (the contract)
Write a short spec before coding. Template:

```markdown
## Spec: [feature]
- Behavior: [what it does, observable]
- Inputs: [shape, types, sources]
- Outputs / side effects: [returns, DB writes, navigation, events]
- Edge cases: [empty, error, offline, large, concurrent, unauthorized]
- Out of scope: [what this explicitly does NOT do]
- Done when: [the concrete, checkable success criteria]
```

"Done when" must be **verifiable**, not "it works". Weak criteria produce weak code.

### Phase 3 — Plan (file-mapped, ordered)
```markdown
## Plan
1. [file] — [change] — verify: [test/command]
2. [file] — [change] — verify: [test/command]
...
- New deps (if any): [pkg@version — why]
- Migrations / schema / RLS / edge fns touched: [list — deploy in same turn per full-stack-ship-discipline]
- Risk: [low/med/high per step]
```
For 3+ files or ordering concerns, reason through with the Sequential Thinking MCP if available.

### Phase 4 — TDD (RED → GREEN → REFACTOR)
For each plan step:
1. **RED** — write the failing test first. Run it. **Watch it fail** (proves the test tests something).
2. **GREEN** — write the *minimal* code to pass. No extra. Run it. Watch it pass.
3. **REFACTOR** — clean up with tests green. Commit the step.

Rules:
- The first implementation task is always "write the failing test."
- Never write code with no test path unless the repo has zero test setup — then add the smallest harness first, or explicitly flag that you're skipping TDD and why.
- One concern per test. Test behavior, not implementation details.
- Surface-specific runners: web → vitest/jest/playwright; RN → jest + RNTL, `mobile-emulator-test` for device; Capacitor → vitest + `mobile-mobile-capacitor-platform` E2E.

### Phase 5 — Self-review (gate before "done")
Run this checklist. If any box fails, you are not done:

```
- [ ] Every "Done when" criterion is met and verified (not assumed)
- [ ] Every spec edge case is handled or explicitly deferred in the spec
- [ ] Tests fail without the change and pass with it (RED was real)
- [ ] No placeholder / TODO / dead code / stubbed return left behind
- [ ] No unrequested scope crept in (YAGNI held)
- [ ] Backend deps deployed + verified on the remote, not just on disk
- [ ] Error path actually exercises the new code (logs/network confirm, not a stale 404)
- [ ] Narrowest verification command for the surface was run and is green
```

## Anti-patterns this kills
- "Here's the implementation" with no test and no spec → **vibe code**.
- Plausible code that compiles but mishandles empty/error/offline → **missing edge cases**.
- "It should work now" with nothing run → **unverified claim**.
- Drive-by refactors of unrelated code → **scope creep**.
- A migration file written but never deployed → see `full-stack-ship-discipline`.

## References

- [TDD patterns & test examples by type](references/workflow-spec-tdd-patterns.md)
- [Spec template & writing principles](references/spec-template.md)

## Composes with
- `workflow-coding-discipline` — behavioral guardrails (this skill operationalizes them).
- `full-stack-ship-discipline` — Phase 5 backend-deploy gate.
- `mobile-mobile-capacitor-platform` / `mobile-mobile-rn-performance` / `enhance-*` — surface domain knowledge for the plan.
- `test-playwright` / `mobile-emulator-test` / `test-unit` — the verification runners for Phase 4–5.
