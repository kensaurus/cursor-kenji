---
name: enhance-skill-prompts
description: >
  Upgrade an existing SKILL.md prompt (not its behavior) to 2026 practice:
  degrees of freedom, structured CoT, one worked example, self-critique
  rubric, term consistency. Use when "enhance this skill's prompts",
  "upgrade skill authoring", or "apply the prompt playbook". New skill
  from scratch → meta-skill-creator.
license: MIT
---

# enhance-skill-prompts — Upgrade HOW a skill instructs, never WHAT it does

**Degree of freedom: LOW-to-MEDIUM.** This is a fragile transformation. A
well-meant rewrite can change behavior. Follow the phases in order. Preserve
intent, scope, and family semantics exactly. If a change would alter
behavior, scope, or read-only / plan-only / apply-now stance, stop and flag
it instead.

Grounded in [docs/PROMPT-ENHANCEMENT-PLAYBOOK.md](../../docs/PROMPT-ENHANCEMENT-PLAYBOOK.md)
and the annotated exemplar
[references/exemplar-audit-auth-flows.md](references/exemplar-audit-auth-flows.md).
Live reference after the exemplar was applied:
`skills/audit-auth-flows/SKILL.md`. New skill from scratch →
`meta-skill-creator`.

## Phase 0 — Classify the skill  [HIGH freedom]

Read the target SKILL.md and determine:

- **Family & register:** audit/plan (interpretive → mostly HIGH) vs
  housekeep/deploy/migration (fragile sequences → LOW where a step must be
  exact).
- **Judgment points:** triage, severity, root cause, winner-selection → T2/T3.
- **Fragile steps:** probes, baseline capture, destructive ops → T1 LOW.
- **Existing examples:** most have none — that is usually the biggest gap.

State the classification before editing. It decides which techniques apply.

## Phase 1 — Apply T1–T6 (only where they fit)  [HIGH freedom]

Apply in this order. Skip any technique that does not fit and record why.

**T1 — Declare degrees of freedom.** Short register line under the H1.
Where mixed, tag fragile phases `[LOW freedom — run exactly]` and
interpretive ones `[HIGH freedom]`. Do not over-constrain interpretive
audits or under-constrain fragile sequences.

**T2 — One structured reasoning scaffold.** Named-stage chain the agent
runs before concluding (audits: Observe → Interpret → Classify → Severity;
plans: Propose → Risk → Keep-working → Phase). Place it ONCE near the top
and reference it. Do not sprinkle generic "think step by step".

**T3 — Exactly one worked example.** Few-shot + CoT: the chain AND the
output shape on a realistic case. Put it right after the scaffold.

**T4 — Self-critique rubric before output.** Explicit, answerable checks
(evidenced-not-assumed, reproducible, severity-justified, right-owner,
no-false-safety). Plan skills: run this before presenting the burndown.
This is where principle-based ("constitutional-style") checking belongs —
a rubric, not a label.

**T5 — Terminology consistency.** One term per concept. Unify
gate/check/guard, finding/issue/problem, user/caller/client to the skill's
dominant term.

**T6 — Conciseness.** Cut restated context the agent already has. Never
trim a fragile step's exactness. Net tokens should usually drop even after
T2+T3.

## How to reason

1. **Observe** — existing H1 register, phases, examples, body length
2. **Interpret** — which of T1–T6 are missing vs already present as headings
3. **Classify** — apply / skip-with-reason / stop (would change behavior)
4. **Severity** — a trigger or stance change is an invalid edit

## Worked example

> **Observe:** `meta-skill-creator` has T1 and a T1–T6 table; no `## Worked example`.
> **Interpret:** the table mention is not T3; the agent still has no few-shot.
> **Classify:** add one `## Worked example` + `## Self-critique` after the table; do not rewrite Anatomy or frontmatter.
> **Invariant:** description triggers unchanged; still "create a pack SKILL.md".

## Self-critique before reporting

- **Headings exist** — T3 is `## Worked example`, T4 is `## Self-critique…`, not a table cell
- **Behavior same** — no phase-order, stance, or trigger change
- **One example** — not a second tutorial
- **Right owner** — new skill from scratch → `meta-skill-creator`

## Phase 2 — Preserve invariants  [LOW freedom — run exactly]

The edit is invalid if any of these break:

- Same **name, description triggers, and scope** — routing must not change.
- Same **behavior and stance** — read-only stays read-only; apply-now stays
  apply-now; plan-only stays plan-only; phase order and Definition-of-Done
  coverage unchanged in substance.
- **House limits** — description ≤320 chars (same folding as
  `scripts/validate-skills.mjs`), body <500 lines, name matches dir.
- **Frontmatter untouched** unless a within-budget description change is
  explicitly requested. Default for this pass: do not touch frontmatter.
- Never write the retired layout alias — use `audit-responsive`.
- Strip `<!-- TECHNIQUE -->` comments from live SKILL.md (they belong only
  in the exemplar).

If any invariant would break, revert that change and note it.

## Phase 3 — Report the diff  [LOW freedom — do not skip]

Do not silently rewrite. Present, per skill:

1. **Classification** — family | register | judgment points | fragile steps | has-example?
2. **Technique table** — technique | applied? | where | why-skipped-if-not
3. **Section diffs** — before/after for each change
4. **Invariant check** — each invariant | holds?

Apply on approval. For a batch, finish one skill as reference, get
sign-off, then proceed.

## Definition of Done

- [ ] Skill classified before editing
- [ ] T1–T6 applied or skipped with a reason
- [ ] Invariants verified; frontmatter triggers unchanged
- [ ] Diff reported; applied only on approval

## Related

- `meta-skill-creator` — new SKILL.md from scratch
- `audit-skill-conflicts` — routing / coherence after a batch
- `validate:skills` — per-file spec after edits
