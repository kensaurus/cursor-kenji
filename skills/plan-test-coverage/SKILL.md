---
name: plan-test-coverage
description: >
  User-story-driven test coverage audit and plan — no test writing in this pass. Use when
  "test coverage plan", "coverage audit", "traceability matrix", "fake-green tests",
  "uncovered user stories", "plan tests for critical flows", or "whats not tested".
  Mutation score / assertion theater → test-mutation.
license: MIT
---

# Test Coverage Audit + Plan (User-Story-Driven)

**Degree of freedom: MIXED** — story derivation and fake-green judgment are HIGH;
coverage commands run exactly. Stay **plan-only**. No tests written in this pass.

**Role:** Senior QA / test engineer.

**Task:** Audit the test suite against **user stories and critical flows**, not just line %.
Find untested, weakly tested, and fake-green tests. Build traceability matrix + burndown.
**Audit & plan only — do not write tests in this pass.**

## This skill vs neighbors

| Skill | Does |
|-------|------|
| **plan-test-coverage** (this) | Story-driven coverage plan |
| `test-unit` | Write unit/integration tests (execution) |
| `test-qa` | Live QA crawl |
| `test-playwright` | E2E verification after changes |
| `workflow-spec-tdd` | Spec + TDD during feature build |
| `plan-stub-checker` | Finds unwired UI — feed into critical-path tests here |

**Loop position:** `plan-stub-checker` → wiring approval → **plan-test-coverage** → `plan-perf-audit` / `plan-security-audit` → `plan-docs-sync`

## How to reason (every plan item)

1. **Propose** — the given/when/then spec for a gap or a fake-green replacement
2. **Risk** — critical flow ships untested, or a green suite that cannot fail
3. **Keep-working** — stories that already have honest, asserting tests
4. **Phase** — Critical+fake-green → Error-edge → Important → Minor (do not execute)

## Worked example

> **Propose:** add an e2e for "authed user exports data" covering the newly wired Settings control; replace `expect(true).toBe(true)` in `export.test.ts`.
> **Risk:** stub-checker wired the button; coverage % is 82 but the critical path has no test — fake-green hides it.
> **Keep-working:** login happy-path Playwright spec already asserts a session cookie.
> **Phase:** Phase 1 — Critical uncovered + fake-green.
> **Spec:** given authed session / when Export clicked / then `POST /api/export` 200 and a file download.

---

## ⛔ Preservation Contract

Read `references/preservation-contract.md`. Acknowledge in output #1.

---

## References

| File | Contents |
|------|----------|
| `references/methodology.md` | Stories from code, traceability, multi-lens, fake-green |
| `references/output-templates.md` | Matrix, burndown, phased plan |

---

## Phase flow

```
0. Derive user stories from code (FIRST)
1. Inventory existing tests + coverage baseline
2. Traceability matrix (story ↔ test)
3. Multi-lens coverage audit
4. Fake-green / weak-test detection
5. Burndown + phased coverage plan
6. Guardrails (mutation CI, coverage ratchet)
7. Research citations
```

Detail: `references/methodology.md`

---

## Phase 0 — Stories from code (before judging coverage)  [HIGH freedom]

Reconstruct what the app **promises** from routes, handlers, flows — not invented stories.

Each story: acceptance criteria + criticality + cited implementing code.

---

## Phase 1 — Test inventory  [LOW freedom — run exactly]

Discover test files; map to stories. Run coverage tool if available:

```
npm test -- --coverage
npx vitest run --coverage
```

Not run → `[NEEDS RUN]` with command to run.

---

## Phase 2 — Traceability matrix  [HIGH freedom]

Core artifact. Every critical story with no test = top-priority gap.

Template: `references/output-templates.md`

---

## Phase 3–4 — Depth + fake-green  [HIGH freedom]

Judge branch/path/risk/integration/error paths — not just line %.

Flag fake-green: over-mocks, `expect(true)`, implementation-detail tests.

Recommend mutation testing on critical modules for blind spots.

---

## Burndown + plan  [HIGH freedom — plan only]

Phases:

1. Critical uncovered + fake-green (especially newly wired stubs from stub-checker)
2. Error/edge + integration boundaries
3. Important stories
4. Minor branches

Per gap: given/when/then spec + "what must keep working". **Plan only.**

## Self-critique before the burndown  [LOW freedom — do not skip]

1. **evidenced-not-assumed** — stories cited from routes/handlers; coverage numbers from a real run or `[NEEDS RUN]`
2. **plan-only** — no tests written, deleted, or skipped
3. **severity/phase justified** — untested critical stories and fake-green outrank line-% gaps
4. **right-owner** — mutation score / assertion theater → `test-mutation`; writing tests → `test-unit` / `test-playwright`; unwired UI → `plan-stub-checker`
5. **no-false-safety** — coverage % is not depth; never invent stories or counts

---

## Required output (in order)

1. Preservation-contract acknowledgment
2. Derived user stories + AC + criticality (cited)
3. Existing-test inventory + baseline or `[NEEDS RUN]`
4. Traceability matrix
5. Multi-lens coverage audit
6. Fake-green / weak-test findings
7. Burndown table
8. Coverage + enhancement plan, phased
9. Guardrails/tooling
10. Research notes + citations
11. Open questions / `[NEEDS PRODUCT INPUT]` / `[NEEDS RUN]`

---

## Rules

- Plan only — do not write tests until approved.
- User stories first, from real code.
- Coverage ≠ single %. Judge depth + mutation honesty.
- Never fabricate stories, tests, or numbers.
- Separate true gap vs test-quality issue.
