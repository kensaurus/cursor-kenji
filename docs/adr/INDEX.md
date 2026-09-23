# Architecture Decision Records — index

Decision memory for agents and humans. **Code shows what was decided; this
shows why, and what was rejected.** Read this before proposing a change to
architecture, dependencies, conventions, or distribution. An Accepted ADR
is not a suggestion. Re-proposing a rejected alternative is the slowest
form of drift.

If a change genuinely needs to contradict an Accepted ADR: **surface it, cite
the ADR, and ask.** Do not silently comply and do not silently override. A
reversal produces a new ADR that supersedes the old one, by the human, on
purpose.

| # | Title | Status | Decision |
|---|-------|--------|----------|
| [0001](0001-custom-npm-installer-ships-four-tools.md) | Custom npm installer ships four tools | Accepted | `--all` installs Cursor + Claude + Codex + Gemini; bare `npx` stays Cursor-only; skills.sh is skills-only |
| [0002](0002-description-house-budget-320.md) | Description house budget ≤320 chars | Accepted | `validate-skills` errors above 320; spec max 1024 is not the house cap |
| [0003](0003-merge-install-by-default.md) | Merge-install by default | Accepted | Default merges; `--clean` / `--mirror` is opt-in |
| [0004](0004-do-not-submit-official-mcp-registry.md) | Do not submit the Official MCP Registry | Accepted | This pack ships `mcp/*.json.template`, not a server |
| [0005](0005-one-pack-is-skills-commands-agents-rules.md) | One pack is skills + commands + agents + rules | Accepted | Do not split the npm package by artifact type |
| [0006](0006-effort-routing-by-skill-family.md) | Effort routing by skill family | Accepted | `effort: high` for audit/plan/judge/security/architecture/debug, `low` for mechanical work, omitted (medium) for implementation; no prose thinking scaffolds |
| [0007](0007-one-model-effort-routed.md) | One model, effort-routed | Accepted | Retires "plan with a strong model, execute with Composer 2.5"; rule renamed `approved-plan-execution.mdc`; guardrails unchanged |
| [0008](0008-auto-invocable-roster-budget.md) | Auto-invocable roster budget | Accepted | `validate-skills` fails above `ROSTER_MAX_CHARS`; `commands/*.md` are `/`-only except an allowlist; skills keep the auto-route |
| [0009](0009-retire-sequential-thinking-server.md) | Retire the Sequential Thinking MCP server | Accepted | Removed from the full template and pins; depth is set with effort |

## Conventions

- **File:** `docs/adr/NNNN-short-title.md`, numbered sequentially, one page.
- **Statuses:** Proposed → Accepted → Superseded by NNNN / Deprecated.
- **Never edit an Accepted ADR's decision** — supersede it with a new one that
  links back. The history is the point.
- **Same PR:** an ADR lands with the change it records, not afterwards.

## What gets an ADR

Anything an agent could plausibly reverse while "helping": stack and
dependency choices (and the rejected ones), architecture and layering,
conventions with non-obvious rationale, product/scope decisions that shape
code, distribution policy, and reversals of past attempts.

**Not** ADRs: routine implementation, anything a linter or CI gate already
enforces mechanically, TODOs, or meeting notes.
