# 0008. Bound the auto-invocable roster; commands are `/`-only

Status: Accepted            Date: 2026-09-23

## Context

Measured 2026-09-23: 156 skills carry 42,704 chars of auto-invocable
description, 12 skills-cursor 194, 62 commands 5,808, 6 agents 1,123 — 49,829
chars (~12.5k tokens) that ride in the host's skill listing on every request.
Claude Code trims that listing to a fixed budget and drops what does not fit
with no user-visible warning (observed in the client; not a documented
setting). On the Opus 5.5 default host this session's system prompt listed
about 57 of the 156 pack skills with descriptions and about 20 commands with
none: the model could not auto-route to most of the pack. ADR-0002 caps each
description at 320 chars; it does not cap the sum. Cache reads on Opus 5.5 are
0.05x, so a stable, bounded roster is also the cheapest one.

## Decision

1. `scripts/validate-skills.mjs` sums description chars over skills,
   skills-cursor, top-level commands and agents, excluding
   `disable-model-invocation: true`. It fails above `ROSTER_MAX_CHARS` (set at
   adoption to the measured post-flip total rounded up to the next 500; a
   ratchet that is lowered, never raised) and warns above `ROSTER_TARGET_CHARS`
   (40,000 — the listing budget on a 1M window).
2. Every top-level `commands/*.md` carries `disable-model-invocation: true`:
   commands are the `/` surface and the skill twin carries the auto-route.
   Exceptions are listed in `MODEL_INVOCABLE_COMMANDS`: `gtm-weekly` (a
   scheduled-task prompt), `fix-issue` (the GitHub fetch has no skill twin),
   `mcp-guide` (routing table).
3. Skills keep the auto-route. `complete-everything` and `burndown-full` stay
   auto-invocable: their descriptions carry the natural-language phrases by
   which a user enters closure mode. User-only rituals (`handoff`,
   `deploy-npm`, `iterate-gtm-weekly`, `mushi-health`, `mushi-integration`)
   are `/`-only.
4. Reference-only skills use `user-invocable: false` (hidden from the menu; no
   budget effect).
5. Per-project command bundles never install globally; the Claude installer
   prints the installed roster size.

## Rejected alternatives

- **Installer writes a listing-budget override into settings.json** —
  rejected: undocumented, invasive, hides the cost instead of bounding it.
- **Make closure-mode skills `/`-only** — rejected: users enter closure mode
  by saying "complete everything" or "finish the burndown".
- **Shorten every description further** — rejected: the average is 275 chars
  and the trigger phrases are the value (ADR-0002).
- **Split the pack** — rejected by ADR-0005.

## Consequences

Roster total printed on every `npm test`; this pass takes the roster from
49,829 to 43,224 chars; the 40,000 target remains a warning until a
follow-up trims the longest descriptions. README index marks `/`-only skills.
