# Preservation Contract

## Never do in this pass

- **Fabricate** stories, tests, or coverage numbers. Stories from real features (routes, handlers) cited in code. Coverage from real run or `[NEEDS RUN]`.
- **Claim** a test exists or passes without reading it.
- **Delete or weaken** existing tests — flawed tests get fix proposals; removal needs approval.
- **Change app code** for testability in this pass — note refactor as proposal.
- **Enshrine bugs** — wrong behavior flagged, not locked in tests.
- **Write tests** in this pass. Specs (given/when/then) on approval.

## Buckets

- **True coverage gap** — story has no/partial test
- **Test-quality issue** — fake-green, over-mocked, implementation-detail test
