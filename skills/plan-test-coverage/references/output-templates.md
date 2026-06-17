# Output Templates

## Story list (Phase 0)

```markdown
### Story S-01 [Critical]
- As a … I want … so that …
- Acceptance criteria: …
- Code: path:line
```

## Coverage baseline

| Metric | Value | Tool | `[NEEDS RUN]` |
|--------|-------|------|---------------|
| Line % | … | vitest/jest/coverage | |
| Branch % | … | | |

## Traceability matrix

| Story | AC | Criticality | Code | Test(s) | Coverage | Quality |

## Burndown

| Story/Area | Gap type | Criticality | Evidence | Proposed test (G/W/T) | Severity | Effort | Risk |

Gap types: uncovered / partial / fake-green / missing-edge

## Phased plan

1. Critical uncovered + fake-green on critical paths (esp. newly wired stubs)
2. Error/edge + integration boundaries
3. Important stories
4. Minor branches
