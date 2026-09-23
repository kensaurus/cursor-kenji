# 0007. One model, routed by effort — retire the two-model premise

Status: Accepted            Date: 2026-09-23

## Context

Since v1.7.0 the pack said "plan with a strong reasoning model, execute with
Composer 2.5": the execution rule was named `composer-2.5-execution.mdc`, and
README, `docs/PLAN-LOOPS.md`, `docs/AGENTS.template.md`, 13 `plan-*` references
and the rule's own intro repeated the split. With Claude Opus 5.5 the default on
Claude Code and available in Cursor, the same model plans, implements, and
judges; a filename that names a retired model dates every document that cites
it. The rule's content — anti-reward-hacking, anti-feature-deletion,
checkpoints, terminal caution, STOP-and-ask on auth/RLS/secrets/payments — is
model-agnostic and still earns its place.

## Decision

One model. Routing is by effort: plan and audit at `high` (or `xhigh` where
measured), implement at the default, judge in a fresh context at `high`
(ADR-0006). The rule is renamed `rules/approved-plan-execution.mdc`; its body
keeps every guardrail and drops "stronger model", "implementation model", and
"200k window" phrasing. `bin/install.mjs` prunes the old file on merge installs
(`RENAMED_RULES`). Every "plan with a strong model; execute with
`composer-2.5-execution.mdc`" line becomes "planned at high effort; executed at
the default effort under `approved-plan-execution.mdc`". Anything that would
have been "routed to a stronger model" is instead a STOP-and-ask or a higher
effort level.

## Rejected alternatives

- **Keep the filename for stability** — rejected: the name is the fossil; every
  citation inherits it.
- **Keep "stronger model" as generic advice** — rejected: on one model it reads
  as a routing instruction the host cannot follow.
- **Delete the rule** — rejected: its guardrails target failures that are
  model-independent (reward hacking, silent deletion).

## Consequences

Rename plus prune; README, PLAN-LOOPS, CATALOG, AGENTS.template, the
`burndown-full` command and the plan-* footers reworded in the same PR;
`check-docs-facts` fails if the retired framing returns.
