---
name: audit-skill-conflicts
description: >
  Read-only audit of an agent-skill pack for contradictory directives, overlapping
  triggers, stale cross-refs, and context bloat. Use when "audit my skills",
  "conflicting skills", "wrong skill triggered", or after adding a batch.
  Per-file spec → validate:skills. How to write one → meta-skill-creator.
license: MIT
---

# audit-skill-conflicts — Pack coherence, not product QA

**Degree of freedom: MIXED** — Phases 0–1 `[HIGH freedom]`; Phase 2 routing
dry-run `[LOW freedom]` — skip explicitly if the harness cannot show
selection. Never write `audit-responsive-layout`.

Read-only. Every other `audit-*` inspects an app you ship. This one inspects
**the skill pack it lives in**.

`npm run validate:skills` checks each file in isolation (name = dir, description
≤320, body <500). It cannot see two skills giving opposite advice, six
descriptions all matching "audit my UI", a handoff to a renamed skill, or a
greedy description that fires constantly and burns context.

**A skill collection is a system. Its failure modes are between files.**

> **Present findings. Rewrite nothing until approved.** Highest-leverage
> first: description rewrites (routing) — they change which skill fires
> without changing any skill's behavior.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **audit-skill-conflicts** (this) | Cross-skill contradictions, routing, dangling refs, bloat |
| `meta-skill-creator` | How to *write* a SKILL.md |
| `validate:skills` (script) | Per-file spec lint — not semantic coherence |
| `enhance-agent-guardrails` | Guardrails in an *app* repo, not this pack |
| `plan-docs-sync` | Docs vs code drift — not skill vs skill |

Do **not** fire for "create a skill" → `meta-skill-creator`.
Do **not** fire for "audit my app's UI" → `audit-ux` / `audit-responsive` /
`audit-ui-states` (this skill would *flag* that cluster).

## How to reason

1. **Observe** — quote both descriptions (or rule vs skill) that appear to collide
2. **Interpret** — can one user phrase honor both, or do they contradict / steal routing?
3. **Classify** — contradiction / trigger overlap / stale ref / bloat / correct carve-out
4. **Severity** — opposite stance on the same situation, or a greedy description, first

## Worked example

> **Observe:** "audit my UI" matches `audit-ux`, `audit-responsive`,
> `audit-ui-states` with no carve-out in two of the three descriptions.
> **Interpret:** the agent cannot know whether to score heuristics, breakpoints,
> or empty states.
> **Classify:** trigger overlap without disambiguation.
> **Severity:** major — wrong skill fires; wasted context.
> **Fix:** each description names when *it* wins (layout vs heuristics vs states).

---

## Phase 0 — Load the corpus  [HIGH freedom]

Enumerate:

- `skills/*/SKILL.md` and `skills-cursor/*/SKILL.md`
- `commands/*.md`
- `agents/*.md`
- `rules/*.mdc` — **highest-risk**. Always-on rules silently override a
  skill's intent.

For each skill extract: `name`, `description` (routing surface), claimed
triggers, cross-referenced skills, core directives (read-only vs apply-fixes,
plan-first vs edit, hard always/never). One index. Compare the set, not
pairwise guesswork.

House names in *this* repo: linearized desktop is `audit-responsive` (not
`audit-responsive-layout` or `responsive-audit`). Flag any leftover old name.

---

## Phase 1 — Conflict and drift  [HIGH freedom]

**Contradictory directives** — Opposite behavior for an overlapping situation
(e.g. "fix inline" vs "never edit in the audit pass"). Rules-vs-skill is
worst. List every pair that cannot both be honored.

**Trigger overlap / mis-routing** — Phrases that match many skills. Example
cluster in this pack:

> "audit my UI" → `audit-ux`, `audit-uiux-design-system`, `audit-responsive`,
> `audit-ui-states`, `thirdparty-web-interface-guidelines`,
> `plan-uiux-unification`

Overlap is fine **if** each description carves out *when it, specifically,*
applies. Flag members that do not disambiguate.

**Duplicated guidance** — The same block copy-pasted across skills. Drift
risk. Name an extraction target (shared rule or one canonical skill).

**Stale cross-references** — Handoff to a renamed/removed skill. Resolve every
backtick skill name against the live directory list.

**Scope gaps & double-coverage** — Two skills claiming the same task with no
delineation, or a chain step no skill owns. This is *pack* coverage, not
product gaps.

**Context-budget bloat** — Over-broad descriptions (narrow skill, greedy
triggers). Bodies near the 500-line cap that a 60-line skill could hold.
Headroom exists because context is scarce; the pack should respect that.

**Convention drift** — Family-placement (audit-and-fix under `enhance-*` is
OK when called out, like `enhance-email-deliverability`). Inconsistent
read-only/plan-only semantics inside a family. Description-voice drift.

---

## Phase 2 — Routing dry-run (optional)  [LOW freedom — skip honestly]

If a harness can show which skill the agent selects for a phrase, feed
realistic user lines and record matches. Ambiguous phrases that should map to
one skill but match several confirm Phase 1 empirically.

**Cursor / Claude Code usually do not expose selection.** Skip this phase
explicitly; static description analysis still stands. Do not pretend a
dry-run ran.

---

## Definition of Done

- [ ] Corpus indexed: skills + commands + subagents + rules
- [ ] Contradictory-directive pairs listed (rules-vs-skill included)
- [ ] Trigger-overlap clusters identified; carve-outs checked
- [ ] Duplicated blocks + extraction targets named
- [ ] Cross-refs resolved; dangling listed (incl. old `responsive-audit` /
      `audit-responsive-layout` names)
- [ ] Double-coverage and handoff gaps surfaced
- [ ] Bloat / convention drift noted
- [ ] Routing dry-run run **or** explicitly skipped
- [ ] Nothing edited without approval

## Self-critique before reporting  [LOW freedom — do not skip]

1. **Quoted pair** — every contradiction cites both texts
2. **Dry-run honesty** — skipped if no harness; do not pretend it ran
3. **Name hygiene** — leftover `audit-responsive-layout` / `responsive-audit` listed
4. **Right owner** — how to *write* a skill → `meta-skill-creator`; how to
   upgrade prompts → `enhance-skill-prompts`
5. **Nothing rewritten** until approved; description fixes first (routing)

## Output format

1. **Conflict table** — A | B (or rule) | type | why they can't coexist | severity
2. **Trigger-overlap clusters** — phrase | skills | who should win | description fix
3. **Dangling references** — skill | broken ref | correct target
4. **Coverage map** — double-coverage + gaps
5. **Bloat / convention** — item | issue | fix
6. **Fix plan** — description rewrites first, then dedupe/extraction, then
   convention. Propose only.

## Related

- `meta-skill-creator` — write a new SKILL.md
- `enhance-skill-prompts` — upgrade an existing skill's prompt (T1–T6), not its behavior
- `validate:skills` — per-file spec after description edits
- `enhance-agent-guardrails` — app-repo policy, not pack coherence
- `plan-docs-sync` — docs vs code
- `audit-responsive` / `audit-ux` / `audit-ui-states` — the UI-audit cluster this skill is expected to flag
