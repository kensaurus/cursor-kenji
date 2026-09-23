# 0011. The routing rule keeps only what a skill name cannot say

Status: Accepted            Date: 2026-09-23

## Context

`rules/skill-workflows.mdc` is agent-requested in Cursor (`alwaysApply: false`),
but Claude Code installs it as `~/.claude/rules/skill-workflows.md`, which has
no `paths:` and so loads in every session. The Codex and Gemini installers
already leave it out. At 3,246 bytes it listed 18 workflow mappings, optional
skill combos, naming conventions, the closure-mode completion-judge
requirement, and a rules-vs-skills note.

Most of that is said elsewhere:

- skill descriptions now carry handoffs between overlapping skills (1.38.0);
- the always-on verification rule already requires `completion-judge` for
  approved plans and closure modes;
- `docs/CONTRIBUTING.md` owns the naming conventions.

One part is not said elsewhere. Claude Code lists the least-used skills by
name only once its skill listing is over budget (ADR-0010). A name then has to
carry the routing on its own, and some names mislead: `workflow-release-prep`
never releases, `workflow-onboard` is not product onboarding, and
`complete-everything`, `burndown-full`, and `housekeep-backlog` all sound like
"finish the work".

## Decision

Keep `skill-workflows.mdc` as a rule. Cut it to the mappings where a name
alone misleads or says nothing, plus the multi-phase → bundled-workflow
principle, the six audit-and-fix exceptions, and one line on rules vs
skills. The result is 1,614 bytes, down from 3,246.

A new skill is added to the rule only when its name would send a request to
the wrong place. Otherwise its description carries the routing.

The heading is now "Skill Routing Index". `scripts/test-install.mjs` already
asserts that this string stays out of the merged Codex/Gemini rules file.
Before the rename the assertion could not fail.

## Rejected alternatives

- **Drop it from the Claude Code install** — rejected: the name-only listing
  is exactly when the disambiguation matters.
- **Turn it into a `user-invocable: false` reference skill** — rejected: its
  description would sit in the same budgeted listing, and could be cut to a
  name at the moment it is needed.
- **Scope it with `paths:`** — rejected: no file path signals a routing
  decision, which happens before any file is read.

## Consequences

About 1.6 KB less always-on context in every Claude Code session. The rule no
longer lists every workflow, so its contents are chosen by how misleading a
name is, not by how important the skill is.
