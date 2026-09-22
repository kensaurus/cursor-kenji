# 0005. Keep one pack: skills, commands, agents, and rules

Status: Accepted            Date: 2026-09-19

## Context

The installer `--only` flag can limit groups (`skills,commands,agents,rules,hooks`).
A session will propose four npm packages or a "skills-only" default so
Cursor users skip the rest. The product is one playbook: you say the
job, the matching skill **and** slash command / agent / rule are there.

## Decision

`@kensaurus/cursor-kenji` is **one pack**. A full install writes skills,
slash commands, subagents, and rules (plus a merge of `hooks.json` and
a missing-only `mcp.json` template). `--only` and `--skill` are
escape hatches, not the product.

## Rejected alternatives

- **Skills-only package (or skills.sh as the product)** — rejected:
  commands and rules would drift to a second version (ADR 0001).
- **Split npm packages per group** — rejected: one version, one
  hash-check, one restore stamp.
- **Rules-as-always-on copies of every skill** — rejected: skills stay
  on-demand; rules stay short always-on policy.

## Consequences

Count ratchets and README tallies cover all four artifact types.
Agents must not extract `/commands` into a sibling package. Revisit
only with a superseding ADR.
