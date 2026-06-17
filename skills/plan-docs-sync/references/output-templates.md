# Output Templates

## Drift counts

| Type | Count |
|------|-------|
| stale | … |
| missing | … |
| phantom | … |
| contradictory | … |
| onboarding-breaking | … |
| inline-rot | … |
| api-contract | … |

## Per-doc inventory

| Doc | Section | Drift type | Audited |
|-----|---------|------------|---------|

## Burndown

| Doc location | Claim | Drift type | Code truth (path:line) | Severity | Effort | Proposed fix | Risk |

P0 = onboarding-breaking or misleading security/setup · P3 = minor wording

## Phased sync plan

1. Onboarding-breaking + misleading-security docs
2. Phantom + contradictory
3. Missing docs for shipped features
4. Inline rot

Each item: before/after grounded in cited code + "what's still accurate here"
