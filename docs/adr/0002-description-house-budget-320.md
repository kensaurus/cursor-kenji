# 0002. Keep skill descriptions at a 320-character house budget

Status: Accepted            Date: 2026-09-19

## Context

The Agent Skills spec allows `description` up to 1024 characters. Long
descriptions crowd the agent's skill picker and were shortened in release
notes (86 descriptions; bodies unchanged). A session that only reads the
spec will pad copy back to 1024.

## Decision

House budget is **≤320 characters** (warn under 315 for edit headroom).
`scripts/validate-skills.mjs` sets `DESC_MAX = 320` and fails CI above
it. Spec max 1024 is a ceiling we do not use.

## Rejected alternatives

- **Spec max 1024 as the gate** — rejected: we already paid the
  shortening pass; 1024-char blurbs hide the trigger phrase.
- **No numeric cap (reviewer judgment)** — rejected: every PR re-argues
  length; the validator is the contract.
- **320 on `skills/` only, 1024 on `skills-cursor/`** — rejected: both
  groups share the same validator.

## Consequences

New or edited frontmatter must fold to ≤320. Agents must not raise
`DESC_MAX` "to match the spec." Revisit only with a superseding ADR.
