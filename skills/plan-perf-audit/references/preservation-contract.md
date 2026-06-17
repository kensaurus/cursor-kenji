# Preservation Contract

## Never do in this pass

- **Behavior change disguised as optimization.** Output/contract/UX identical unless proposed + approved.
- **Fabricate metrics.** No invented bundle sizes or query times. Not measured → "not yet measured" or `[NEEDS PROFILING]` + how to measure.
- **Remove features/code** to speed up — dead code → proposal, not delete.
- **Guess** — ground every claim in measurement or path:line.
- **Optimize** in this pass. Fixes proposed with expected gain + risk on approval.

## Before any change proposal

One line: **what currently works here that must keep working.**
