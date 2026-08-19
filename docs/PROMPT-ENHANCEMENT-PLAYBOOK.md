# Prompt-Enhancement Playbook for cursor-kenji Skills

**Purpose.** Upgrade how a skill in this pack instructs the agent — not what
it does — against 2026 prompt-engineering practice. This is a prompt-craft
pass, distinct from `audit-skill-conflicts` (routing/coherence) and
`validate:skills` (spec compliance).

**Who runs it.** A dev, or an agent running `enhance-skill-prompts`, working
one skill at a time. Reference implementation:

- Annotated teaching copy:
  [`skills/enhance-skill-prompts/references/exemplar-audit-auth-flows.md`](../skills/enhance-skill-prompts/references/exemplar-audit-auth-flows.md)
- Live shipped skill (no teaching comments):
  [`skills/audit-auth-flows/SKILL.md`](../skills/audit-auth-flows/SKILL.md)

**Core principle (from Anthropic's skill-authoring guidance).** Match the
*degree of freedom* to the task's fragility. Interpretive tasks (audits,
planning) want high-freedom text that lets the agent reason; fragile tasks
(exact probe sequences, destructive ops, baseline capture) want low-freedom
exact steps. The biggest quality loss in a uniform-register pack is applying
one voice everywhere. Everything below serves this principle.

**House limits.** Description ≤320 chars (same folding as
`scripts/validate-skills.mjs`), body <500 lines, `name` matches the directory.
Never write `audit-responsive-layout` — the live name is `audit-responsive`.

---

## Part 1 — The technique set (what "good" looks like in 2026)

Six techniques, each with the evidence, where it applies, and the trap to
avoid. Apply only where it fits — Phase 0 of each enhancement decides which.

### T1 — Declare & match degrees of freedom  *(Anthropic official — highest leverage)*

Every skill states its register under the H1, and mixed skills annotate
phases: `[HIGH freedom]` for judgment, `[LOW freedom — run exactly]` for
fragile steps.

- **Applies to:** all skills. Audits are mostly HIGH; housekeep / deploy /
  migration have LOW-freedom sequences inside them.
- **Trap:** over-constraining an interpretive audit (kills judgment) or
  under-constraining a fragile sequence (agent improvises a break). Both fail.

### T2 — Structured chain-of-thought at judgment points  *(structured CoT)*

A named-stage reasoning chain the agent runs *before* concluding — e.g.
**Observe → Interpret → Classify → Severity** for audits. Placed once near
the top, referenced by each phase.

- **Applies to:** any skill with real judgment (triage, severity, root-cause,
  winner-selection). That's every `audit-*` and most `plan-*`.
- **Plan-family scaffold:** **Propose → Risk → Keep-working → Phase**
  (what to change, what it risks, what must stay working, which burndown
  phase). Plan skills stay plan-only.
- **Trap:** generic "think step by step" sprinkled everywhere. It bloats
  context and duplicates extended thinking. Scaffold *only* the genuine
  judgments.

### T3 — One few-shot + CoT worked example  *(combination beats either alone)*

A single concrete example that demonstrates the reasoning chain AND the
output shape on a realistic case. Usually the highest-value single edit to
an audit skill.

- **Applies to:** every skill producing structured findings / output.
- **Trap:** more than one or two examples — burns context for diminishing
  return. One good exemplar is the target.

### T4 — Self-critique rubric before output  *(self-refinement)*

An explicit rubric the agent challenges its own output against before
reporting: evidenced-not-assumed, reproducible, severity-justified,
right-owner, no-false-safety.

- **Applies to:** all `audit-*` and `test-*`. Plan skills run T4 before
  presenting the burndown. This is also where principle-based
  ("constitutional-style") checking belongs — a concrete rubric, *not* a
  buzzword. Constitutional AI is a training method; as a prompt it degrades
  to exactly this rubric-driven self-check.
- **Trap:** vague "double-check your work". The rubric must be specific and
  answerable.

### T5 — Terminology consistency  *(Anthropic official)*

One term per concept throughout a skill. Unify synonym drift
(gate/check/guard; finding/issue/problem; user/caller/client).

- **Applies to:** all skills. Cheap, mechanical, real.
- **Trap:** none — but do it last, after structural edits, so you normalize
  the final text.

### T6 — Conciseness pass  *(the context window is a shared public good)*

Cut context the agent already has; collapse redundancy. Net tokens should
usually *drop* even after adding T2+T3, because most skills over-explain.

- **Trap:** never trade a fragile step's exactness for brevity. Low-freedom
  steps stay verbatim.

### Explicitly NOT adopted (and why)

- **Tree-of-Thoughts / self-consistency** (sample many paths, vote): real
  gains but multiplies cost per run — wrong for expensive multi-turn coding
  loops. Reserve for the hardest planning skills only, if ever.
- **DSPy / automated prompt optimization**: optimizes programmatic prompt
  pipelines, not human-readable SKILL.md. Wrong artifact.
- **"Constitutional AI" as a named technique**: folded into T4 as a rubric.
  Naming it would overclaim.
- **Prefilling**: an API-call technique, not applicable to skill documents.

---

## Part 2 — The per-skill enhancement procedure

Run this on one skill at a time (this is what `enhance-skill-prompts`
automates).

**Step 0 — Classify.** Family & register (audit/plan = interpretive;
housekeep/deploy/migration = fragile). List the judgment points (→ T2/T3)
and the fragile steps (→ T1 LOW). Note whether it already has an example.
*Output the classification before editing.*

**Step 1 — Apply techniques where they fit.** In this order: T1 (declare
freedom) → T2 (add the reasoning scaffold, once) → T3 (insert one worked
example) → T4 (add the self-critique rubric) → T5 (unify terms) → T6
(trim). Skip any technique that doesn't fit and record why.

**Step 2 — Verify invariants (the edit is invalid if any breaks):**

- Same name, description triggers, scope → routing unchanged.
- Same behavior & stance → read-only stays read-only; apply-now stays
  apply-now; plan-only stays plan-only; phase order and DoD coverage
  unchanged in substance.
- House limits → description ≤320 chars, body <500 lines, name matches dir.
- Frontmatter untouched except a genuine within-budget description
  improvement. This pass's default is **frontmatter untouched**.

**Step 3 — Report the diff, don't silently rewrite.** Classification, which
techniques applied/skipped, before/after of each section, invariant check.
Apply on approval.

---

## Part 3 — The reference implementation

Read the annotated exemplar before enhancing anything else. Key additions
to study:

- The **"Degree of freedom: MIXED — declared per phase"** header (T1) and
  the per-phase `[HIGH]` / `[LOW]` tags.
- The **"How to reason in this audit"** Observe → Interpret → Classify →
  Severity scaffold (T2), placed once.
- The **worked example** block showing that chain on a real matcher-hole
  finding (T3).
- The **"Self-critique before reporting"** rubric (T4).
- The `getSession` grep promoted to an explicit **[LOW freedom — run
  exactly]** step, plus labeled P5 probes (T1 on the fragile bits).

The live `audit-auth-flows` file keeps the pack's official facts (neighbor
table including `test-exploratory`, `getSession` / `getUser` / `getClaims`,
CVE-2025-29927 patched versions + GHSA, 10s refresh reuse interval, "do
not write exploit PoCs", present-then-stop). Strip `<!-- TECHNIQUE -->`
comments before shipping a live SKILL.md — they are teaching annotations.

---

## Part 4 — Rollout (listed skills only)

Enhance in waves. After each wave, run `npm run validate:skills` and
spot-check behavior on one skill per wave against a real repo.

**Wave 1 — audit family (biggest win from T2+T3+T4).**
`audit-auth-flows` (exemplar + live rewrite), `audit-llm-security`,
`audit-gate-logic`, `audit-codemod-safety`, `audit-analytics`,
`audit-ui-states`, `audit-monetization-iap`, `audit-env-parity`,
`audit-infra-cost`, `audit-responsive`, `audit-skill-conflicts`.

**Wave 2 — plan family (T2+T4; they already burndown-structure well).**
`plan-privacy-compliance`, `plan-backup-dr`, `plan-aso`. Stay plan-only.
T2 scaffold: Propose → Risk → Keep-working → Phase. T4 before presenting
the burndown.

**Wave 3 — test family (T1 LOW-freedom probes + T4 triage rubric).**
`test-exploratory` (already has triage — formalize it as T4; add T1 MIXED;
keep playwright-cli / three sessions), `test-mutation`, `test-load`,
`test-visual-regression`.

**Wave 4 — apply-now / enhance family (T1 is the priority — tag fragile
sequences LOW).**
`housekeep-gates`, `enhance-arch-boundaries`,
`enhance-email-deliverability`, `docs-adr`.

**Wave 5 — propagate to the factory.** Update `meta-skill-creator` so *new*
skills are born with T1–T6, and add a prompt-enhancement bullet to
`docs/CONTRIBUTING.md`. This is what makes the enhancement permanent
instead of a one-time cleanup.

**Wave 6 — validate the listed set.** Run `validate:skills` (and the repo
test script) on the enhanced pack. Confirm no description drifted over
budget, no body over 500 lines, `enhance-skill-prompts` description folds
to ≤320 with the same logic as `scripts/validate-skills.mjs`. Routing
coherence of the new skill is wired in CATALOG / TRIGGER-CHEATSHEET /
skill-workflows.

**Wave 7 — remaining first-party families** (complete-everything closure).
Every other first-party `audit-*`, `plan-*`, and `test-*` (not
`thirdparty-*`). Same invariants. `validate-skills.mjs` fails the pack if
any of these three families lacks Degree of freedom + Worked example +
Self-critique.

---

## Part 5 — Acceptance (this pass)

First-party `audit-*` / `plan-*` / `test-*` families, plus the factory
(`meta-skill-creator`, `enhance-skill-prompts`) and validate. Not
`thirdparty-*`, not Tree-of-Thoughts / DSPy / named Constitutional AI.

- [ ] Every first-party `audit-*` / `plan-*` / `test-*` skill declares its
      degree of freedom; fragile sub-steps tagged LOW
- [ ] Every judgment-bearing skill in those families has one reasoning
      scaffold (not generic, not repeated per phase)
- [ ] Every findings-producing skill in those families has exactly one
      few-shot+CoT worked example
- [ ] Every first-party `audit-*` / `test-*` skill has a specific
      self-critique rubric before its output; `plan-*` skills critique
      before the burndown
- [ ] Terminology unified within each enhanced skill (one term per concept)
- [ ] Conciseness pass done; net tokens not increased without cause
- [ ] All invariants held: names, descriptions, scope, behavior, stance
      unchanged; house limits pass
- [ ] `meta-skill-creator` and `docs/CONTRIBUTING.md` updated so new skills
      inherit T1–T6
- [ ] `enhance-skill-prompts` shipped; `npm run validate:skills` (via
      `npm test`) passes

---

## Appendix — Quick reference card

| # | Technique | Applies to | One-line rule | Trap |
|---|-----------|-----------|---------------|------|
| T1 | Degrees of freedom | all | Declare register; tag fragile steps LOW, interpretive HIGH | Over/under-constraining |
| T2 | Structured CoT | judgment skills | One named-stage chain, referenced not repeated | Generic "think step by step" everywhere |
| T3 | Few-shot + CoT example | output skills | Exactly one worked example, reasoning + output shape | More than 1–2 examples |
| T4 | Self-critique rubric | audit/test (+ plan before burndown) | Specific answerable rubric before output | Vague "double-check" |
| T5 | Terminology consistency | all | One term per concept | (none; do it last) |
| T6 | Conciseness | all | Cut known context; net tokens drop | Trimming a fragile step's exactness |
