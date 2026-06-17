---
name: plan-test-coverage
description: >
  User-story-driven test coverage audit and plan — no test writing in this pass. Derives
  stories from real code, builds story-to-test traceability matrix, detects fake-green and
  weak tests, multi-lens coverage (branch/path/risk/integration/mutation). Coverage numbers
  from real runs or [NEEDS RUN]. Natural lock-in after stub-wiring. Use when asked to "test
  coverage plan", "coverage audit", "traceability matrix", "fake-green tests", "uncovered
  user stories", "plan tests for critical flows", "mutation testing plan", or "what's not
  tested".
license: MIT
---

# Test Coverage Audit + Plan (User-Story-Driven)

**Role:** Senior QA / test engineer.

**Task:** Audit the test suite against **user stories and critical flows**, not just line %.
Find untested, weakly tested, and fake-green tests. Build traceability matrix + burndown.
**Audit & plan only — do not write tests in this pass.**

## vs neighbors

| Skill | Does |
|-------|------|
| **plan-test-coverage** (this) | Story-driven coverage plan |
| `test-unit` | Write unit/integration tests (execution) |
| `test-qa` | Live QA crawl |
| `test-playwright` | E2E verification after changes |
| `workflow-spec-tdd` | Spec + TDD during feature build |
| `plan-stub-checker` | Finds unwired UI — feed into critical-path tests here |

**Loop position:** `plan-stub-checker` → wiring approval → **plan-test-coverage** → `plan-perf-audit` / `plan-security-audit` → `plan-docs-sync`

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

## Phase 0 — Stories from code (before judging coverage)

Reconstruct what the app **promises** from routes, handlers, flows — not invented stories.

Each story: acceptance criteria + criticality + cited implementing code.

---

## Phase 1 — Test inventory

Discover test files; map to stories. Run coverage tool if available:

```
npm test -- --coverage
npx vitest run --coverage
```

Not run → `[NEEDS RUN]` with command to run.

---

## Phase 2 — Traceability matrix

Core artifact. Every critical story with no test = top-priority gap.

Template: `references/output-templates.md`

---

## Phase 3–4 — Depth + fake-green

Judge branch/path/risk/integration/error paths — not just line %.

Flag fake-green: over-mocks, `expect(true)`, implementation-detail tests.

Recommend mutation testing on critical modules for blind spots.

---

## Burndown + plan

Phases:

1. Critical uncovered + fake-green (especially newly wired stubs from stub-checker)
2. Error/edge + integration boundaries
3. Important stories
4. Minor branches

Per gap: given/when/then spec + "what must keep working". **Plan only.**

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
