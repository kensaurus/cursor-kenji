---
name: audit-doctrine
description: >
  Read-only audit of custom lint/ratchet doctrine — is each rule right on
  the merits, not merely enforced. Use when "is this lint rule wrong",
  "the ratchet banned a legitimate pattern", "audit our guardrail
  doctrine". Enforcement → audit-gate-logic. Consolidation →
  housekeep-gates.
license: MIT
---

# audit-doctrine — Is the rule right, not merely enforced?

**Degree of freedom: MIXED.**

- Reference-practice comparison and remedy judgment (Phases 1–2):
  **HIGH freedom** — weigh each rule against how top products actually
  build.
- Governance-contract checks (Phases 3–4): **LOW freedom** — the
  contract's clauses are pass/fail; check each exactly.

Read-only. **`audit-gate-logic` asks "can this gate be bypassed or
gamed?" — it assumes the rule is correct. This asks the harder
question: is the rule right on the merits?** A ratchet that flawlessly
enforces bad doctrine is worse than no ratchet, because greenness
certifies the mistake and the developer, given only a codemod list,
restyles legitimate work to appease a regex instead of fixing a real
problem. An unexplained lint rejection erodes trust at that decision
point until people "adopt their own truth." This audit finds the rules
that are measuring taste, not correctness.

Present findings. Do not rewrite detectors, baselines, or tokens here.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **audit-doctrine** (this) | Rule *content* — remedy, named token, Tier-D practice |
| `audit-gate-logic` | Rule *machinery* — bypass, gaming, required-but-not |
| `housekeep-gates` | Consolidate / delete duplicate gates (apply-now) |
| `enhance-arch-boundaries` | Install boundary *enforcement*, not judge doctrine |
| `housekeep-design` | Token/component SSOT — the sanctioned-form side |
| `docs-adr` | Record a justified divergence from Tier-D |
| `housekeep-backlog` | Un-remedied long-tail axes as `BL-` rows |

## The governance contract

A custom rule/axis is sound only if all hold:

1. **Has a remedy** — states the sanctioned alternative by name; a
   rule that only says "don't" is measuring taste.
2. **Sanctioned form is reachable** — the approved pattern exists as a
   named token/class, not folklore the developer must reverse-engineer.
3. **Teaches on failure** — the failure output prints the remedy AND
   the offending `file:line`, not just a codemod list.
4. **Agrees with Tier-D reference practice** — where the rule
   disagrees with how Stripe / Linear / GitHub / Docusaurus actually
   ship, the burden of proof is on the rule.
5. **Exceptions expire; baselines only shrink** — no permanent
   grandfather; the baseline cannot silently regrow (ratchet integrity
   still belongs to `audit-gate-logic`).

## How to reason (every axis)

1. **Observe** — what does the detector actually measure? Read the
   detector, not its name — the name may over-claim (e.g. "no bordered
   cards" that really counts rounded+border without overflow-clip).
2. **Interpret** — what real pattern does it catch, and what
   *legitimate* pattern does it also reject?
3. **Reference-check** — do top products ship the rejected pattern?
4. **Contract-check** — run the five clauses.
5. **Verdict** — sound / taste-measuring / false-positive /
   folklore-token / missing-remedy, with the fix.

## Worked example

> **Observe:** a `nested-rounded-box` axis counts rounded + border
> lines without overflow-clip.
> **Interpret:** it rejects bordered 前の章／次の章 chapter-link cards
> — but the doctrine's own shell recipe passes it, so the sanctioned
> form exists.
> **Reference-check:** bordered chaptered-nav cards are standard —
> Docusaurus `pagination-nav`, Stripe docs ship the same pattern.
> **Contract-check:** remedy missing; reachable token missing (the
> passing form was never named); failure printed only a codemod list.
> **Verdict:** false-positive + missing-remedy + folklore-token.
> **Fix:** name the sanctioned form (e.g. `PAGE_LINK_CARD_CLASS` —
> bordered, clipped, hover-tiered); print remedy + file:line. Baseline
> unchanged — the token already equals the baseline, proving the ban
> was never real.

---

## Phase 0 — Locate the doctrine  [LOW freedom — run exactly]

Find the rule surface: custom lint/ratchet axes, the detector suite,
the doctrine/governance doc (e.g. `MASTER.md`), baseline files,
exception lists, and the failure-output code. Enumerate every axis
with: what it detects, its remedy (if any), its baseline, and whether
a named sanctioned token exists. Record the count — a long tail of
un-remedied axes is the common state.

## Phase 1 — Separate correctness from taste  [HIGH freedom]

For each axis, classify:

- **Correctness** — catches a real bug / a11y / perf / security issue
  (missing focus, contrast fail, unclipped overflow that actually
  breaks layout). These may be stricter with less explanation.
- **Taste** — enforces a stylistic preference (radius scale, border
  style, card nesting). Not illegitimate, but they carry a higher
  burden: they **must** have a remedy and a reachable token, or they
  generate the appease-the-regex incident.

## Phase 2 — Reference-check taste rules  [HIGH freedom]

For each taste rule, check whether Tier-D products ship the pattern it
rejects. Use `research` / official docs against Stripe, Linear,
GitHub, Docusaurus, Radix, shadcn. Where a rule bans what Tier-D
ships, it is a false-positive *candidate* — the burden of proof is on
the rule. Document the shipping reference for each disagreement. No
reference → mark **needs-reference**, not a finding.

## Phase 3 — Run the governance contract  [LOW freedom — do not skip]

Check all five clauses per axis. State coverage honestly: *N of M
axes carry a remedy* (usually a small fraction — remedies get seeded
on the axes that bite during feature work; the long tail stays bare).
Every bare axis is a latent appease-the-regex incident. Flag:

- missing-remedy
- unreachable-sanctioned-form (folklore)
- non-teaching failure output
- unexpiring exceptions
- regrowable baselines

Un-remedied axes → `housekeep-backlog` as `BL-` rows (junior-PR
burndown).

## Phase 4 — Freeze against regression  [LOW freedom]

Confirm or recommend a test suite that freezes the governance
properties so remedies cannot be silently stripped and sanctioned
tokens cannot drift back into a false-positive form. Without this, the
fix decays.

## Self-critique before reporting  [LOW freedom — do not skip]

- **Evidence, not opinion** — every "false positive" cites a specific
  Tier-D reference that ships the pattern. No reference →
  needs-reference, not a finding.
- **Right axis** — content problem (this skill) vs enforcement
  problem (`audit-gate-logic`). Do not claim a bypass finding.
- **Remedy is real** — a proposed remedy names an existing or addable
  token, not "use the right style".
- **Baseline honesty** — confirm the sanctioned form actually passes
  at the current baseline before claiming the ban was illusory.

## Definition of Done

- [ ] Every axis enumerated: detect-target, remedy, baseline,
      sanctioned-token status
- [ ] Each axis classified correctness vs taste
- [ ] Taste rules reference-checked; disagreements cite a shipping
      reference
- [ ] Five contract clauses run per axis; remedy-coverage stated as
      N of M
- [ ] False-positives, folklore-tokens, missing-remedies,
      non-teaching failures, unexpiring exceptions, regrowable
      baselines flagged
- [ ] Freeze-test coverage confirmed or recommended
- [ ] Self-critique applied
- [ ] Read-only — propose, do not patch

## Output format

1. **Axis inventory** — axis | detects | correctness/taste | remedy?
   | reachable token? | teaches? | baseline-shrink-only?
2. **False-positive findings** — axis | legitimate pattern rejected |
   Tier-D reference | proposed remedy + token
3. **Governance gaps** — remedy-coverage (N/M), folklore tokens,
   non-teaching outputs, exception/baseline integrity
4. **Backfill burndown** — un-remedied long-tail axes as tracked
   items (→ `housekeep-backlog` `BL-` rows)
5. **Handoffs** — enforcement/bypass → `audit-gate-logic`; token
   SSOT → `housekeep-design`; justified divergence → `docs-adr`
