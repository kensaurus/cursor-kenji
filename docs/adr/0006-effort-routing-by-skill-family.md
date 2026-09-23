# 0006. Route effort by skill family

Status: Accepted            Date: 2026-09-23

## Context

Claude Opus 5.5 is the default model in Claude Code 2.1.280+ (2026-09-22) and
is available in Cursor. Its effort default is `medium` (every other model
defaults to `high`); thinking is always on and effort is the only depth control
— "think step by step", "double-check", "don't overthink" prose does nothing.
Anthropic's numbers: at medium it matches or beats Opus 5 at high on agentic
coding in fewer steps and about half the tokens; at xhigh/max it thinks more per
turn than Opus 5. Claude Code reads `effort:` from skill, command, and sub-agent
frontmatter; Cursor ignores keys it does not list (the pack already ships
`license:` this way).

## Decision

Effort is declared per family in frontmatter, not steered in prose:

| Family | `effort:` | Why |
|---|---|---|
| `audit-*`, `plan-*`, `debug-*`, security and architecture skills, judge/verdict skills (`deploy-verify`, `workflow-quality-gate`, `workflow-release-prep`), `completion-judge`, `code-reviewer`, `research` | `high` | judgment over evidence; false negatives cost more than tokens |
| the hardest planning skills, only with a measured gain | `xhigh` | longer turns; none declared until measured |
| `workflow-*`, `enhance-*`, `design-*`, `backend-*` implementation | omitted (`medium`) | the documented default matches Opus 5 high at half the tokens |
| `handoff`, inventory, formatting, smoke checks, scripted bring-up, `deploy-checker` | `low` | mechanical or read-only work with exact steps |

Reference-only skills loaded by other skills (`protocol-*`) carry no effort
key; the caller's effort governs. Read-only inventory skills may add
`context: fork` + `agent: Explore` so the inventory does not sit in the main
context. `validate-skills` accepts only `low|medium|high|xhigh|max` and warns
on `context: fork` without `agent:`. Skill bodies carry no thinking scaffolds;
a skill that needs more depth raises its `effort:`. The per-skill table lives
in each skill's frontmatter; `docs/MODEL-AND-EFFORT.md` states the convention.

## Rejected alternatives

- **No keys; rely on `/effort`** — rejected: the intent is per skill, and the
  user must remember to switch before every audit.
- **`high` everywhere** — rejected: roughly double the tokens and slower turns
  for work the default already does well.
- **`model:` pins per skill** — rejected: pins rot at every release; one model
  is the policy (ADR-0007).

## Consequences

Per-family keys set in one pass; the validator checks values; re-audit at the
next model release (a level that is right on one generation is wrong on the
next).
