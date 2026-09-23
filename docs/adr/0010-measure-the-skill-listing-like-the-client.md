# 0010. Measure the skill listing the way Claude Code does

Status: Accepted            Date: 2026-09-23

Supersedes decision 1 of [ADR-0008](0008-auto-invocable-roster-budget.md)
(the roster measure and its targets). ADR-0008's other decisions stand:
commands are `/`-only, skills keep the auto-route, reference-only skills use
`user-invocable: false`, and per-project bundles never install globally.

## Context

ADR-0008 summed description characters over skills, commands, and agents and
treated 40,000 as "the listing budget". Reading Claude Code 2.1.280 (its
skill-listing code and debug log) and running it headless showed the measure
was off in four ways:

- The client lists each model-invocable skill or command as
  `- name: description` (the description plus ` - when_to_use`, capped at
  1,536 chars), one per line. The name and separator count. Agents are not in
  this listing; the Agent tool describes them.
- The budget is context window × chars-per-token ×
  `skillListingBudgetFraction` (default 0.01). The client counts 3 chars per
  token for current models (Opus 4.7 and later, Opus 5.5 included) and 4 for
  older ones, so a 1M Opus 5.5 session has 30,000 chars.
  `SLASH_COMMAND_TOOL_CHAR_BUDGET` overrides the whole budget.
- Built-in skills share the budget and always keep their descriptions; on
  the measured account they took about 11k chars. Over budget, the client
  keeps descriptions for the most-used skills (usage count with a 7-day
  half-life) and lists the rest by name only, with a warning in the debug
  log. Nothing is dropped.
- The "57 of 156 skills visible" observation in ADR-0008 came from 123
  `skillOverrides: off` entries in one user's settings, not from the budget.

Measured with the client's formula, the pack's listing on 1.37.1 was 45,573
chars. With every pack skill enabled on Opus 5.5 1M, the client reported
49,218 chars against the 30,000 budget.

## Decision

1. `validate-skills` measures the pack's listing with the client's formula
   over skills, skills-cursor, and model-invocable top-level commands, and
   fails above `LISTING_MAX_CHARS`: a ratchet that is lowered, never raised.
   Agent description chars are printed separately.
2. Descriptions were trimmed about 15% (45,573 → 38,979 chars;
   `LISTING_MAX_CHARS` 39,000). The trim kept the distinct trigger phrases
   and the handoffs that separate overlapping triggers, and dropped filler,
   synonyms, and lists of chained skills.
3. Full descriptions for the whole pack are the user's choice, not the
   default: `"skillListingBudgetFraction": 0.02` in
   `~/.claude/settings.json` (60,000 chars on Opus 5.5 1M) held the pack plus
   built-ins with no over-budget warning. The installer prints the installed
   listing size and this setting; it does not write it.

## Rejected alternatives

- **Trim until the pack plus built-ins fit 30,000** — rejected: that leaves
  about 19k chars for 155 entries, so every description would lose half its
  triggers. The client already keeps descriptions for the skills a user
  actually uses.
- **Keep the old measure** — rejected: it ignored names, counted agents, and
  assumed 4 chars/token, so the check could pass while the real listing was
  over budget.
- **Installer writes `skillListingBudgetFraction`** — rejected, as in
  ADR-0008: it raises every session's cost for every pack; the user decides.

## Consequences

At the default fraction, the least-used pack skills show by name only on a
1M Opus 5.5 session, and most of the pack does on a 200K model. The formula,
the chars-per-token split, and the defaults come from reading client 2.1.280
and are not in the docs. Re-verify at each client release: run a headless
session with `--debug-file` (optionally `SLASH_COMMAND_TOOL_CHAR_BUDGET=100`)
and read the "Skill listing over budget" line.
