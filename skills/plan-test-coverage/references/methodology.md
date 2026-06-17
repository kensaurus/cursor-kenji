# Traceability & Coverage Methodology

## Phase 0 — Derive stories from code

For each feature area:

- *As a [user], I want [action], so that [outcome]* + **acceptance criteria**
- Tie to implementing code (route/screen/handler/query) — cited
- Criticality: **Critical** (auth, payments, mutations, RLS reads, irreversible) / Important / Minor
- Unknown intent → `[NEEDS PRODUCT INPUT]`

## Phase 1 — Inventory tests

```
Glob: **/*.{test,spec}.{ts,tsx,js,jsx}
Glob: **/__tests__/**
Glob: **/e2e/** **/playwright/**
```

Map each suite to story/feature. Run suite + coverage if available → baseline or `[NEEDS RUN]`.

## Phase 2 — Traceability matrix (core artifact)

| Story | Acceptance criteria | Criticality | Implementing code | Existing test(s) | Coverage verdict | Test-quality verdict |

Coverage verdict: Covered / Partial / **Uncovered**

## Phase 3 — Multi-lens coverage (not just %)

- Statement/branch/condition — happy path only?
- Path/flow — full journeys (guest vs auth, success vs failure)?
- Risk — crash-prone / irreversible / security paths first?
- Integration — Supabase, RLS, payment/auth boundaries (real or proper mocks)?
- Error/edge — failures, empty, network, permission denials

## Phase 4 — Fake-green detection

- `expect(true)` or no meaningful assertion
- Over-mocked — mocks the unit under test
- Tests implementation detail, not behavior
- Skipped-but-counted, never exercised
- **Mutation testing** on critical modules — surviving mutants = blind spots

## Guardrails (research-backed)

- Traceability matrix maintained: new story → mapped test
- Risk-based targets, not blind 100% line chase
- Mutation testing in CI on critical modules (kill-rate)
- Coverage gate ratchet in CI; test in same PR as feature
- Unit / integration / e2e layers; behavior + acceptance criteria

## Chain position

After `plan-stub-checker` wiring approval → **plan-test-coverage** locks behavior before perf/security hardening and docs sync.
