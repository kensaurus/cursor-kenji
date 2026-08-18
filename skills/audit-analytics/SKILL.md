---
name: audit-analytics
description: >
  Read-only audit of product-analytics instrumentation: event taxonomy, funnel
  completeness, consent-gated firing, dead/duplicate/phantom events. Use when
  "audit our analytics", "are we tracking the right events", "funnel
  instrumentation", or before iterate-post-launch. PostHog/Amplitude/Mixpanel/GA4.
license: MIT
---

# audit-analytics — Product-event instrumentation

Read-only. You verify the app measures what the business needs to decide, with
one taxonomy, without leaking PII or firing before consent.

**The failure mode is silent:** the dashboard looks populated, but the key
funnel step was never instrumented, so every decision on it is guesswork.

> **Present findings. Propose a canonical taxonomy. Do not rewrite events
> until approved.**

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **audit-analytics** (this) | Event coverage, naming, consent-gated *firing* |
| `plan-privacy-compliance` | Legal data-flow + store labels; **run both** when consent is in play |
| `data-visualization` | Charts/dashboards as UI — not whether events exist |
| `iterate-post-launch` | What to fix next from *existing* prod signals |
| `audit-ux-journeys` | Task completion / IA; may recommend this skill when funnels are blind |
| `workflow-feature-flag` | Flag rollout; not event taxonomy |

Do **not** fire for "build me a chart" → `data-visualization`.
Do **not** fire for "GDPR / privacy labels" alone → `plan-privacy-compliance`
(then come back here for the event matrix).

---

## Phase 0 — Detect the analytics stack

- Provider: PostHog / Amplitude / Mixpanel / GA4 / Segment / custom table
- Where events are defined: central taxonomy vs scattered `track()` (scattered
  is itself a finding)
- Typed schema vs free-form string names
- Web vs iOS vs Android vs server

---

## Phase 1 — Reconstruct the intended funnel

From the product's core loop, list critical journeys as ordered steps
(e.g. install → signup → activation → first value → habit → conversion).
For each step, name the event(s) that *must* fire. This is the yardstick.

---

## Phase 2 — Coverage and correctness

**Funnel completeness** — Each intended step has an event in code. Missing Y
means you cannot answer "why drop between X and Y".

**Taxonomy** — One convention (`object_action`, case, tense). Mixed names
(`signup_completed` vs `Signup Success`) fragment analysis. Properties
consistent (`user_id` vs `userId`).

**Dead / duplicate / phantom** — Defined never fired; same action twice under
different names; fired on render instead of on action.

**Property hygiene** — Plan tier, platform, source present so cohorts work later.

**PII & consent** — No raw email/name/address in properties. Analytics SDK
gated behind consent — **not** initialized on boot. Cross-check
`plan-privacy-compliance` for the legal inventory; this skill owns the
event-level gate.

**Cross-platform parity** — Same action → same event name on each client.

**Identity** — Anonymous → identified stitch after signup. Broken stitch
double-counts users.

---

## Definition of Done

- [ ] Intended funnel(s) written with required event per step
- [ ] Each step instrumented or gap logged
- [ ] Naming checked against one convention
- [ ] Dead, duplicate, phantom fires listed
- [ ] PII in properties + consent-gating verified; privacy handoff written
- [ ] Cross-platform parity checked if multi-platform
- [ ] Anonymous→identified stitching verified
- [ ] Nothing rewritten without approval

## Output format

1. **Funnel coverage** — step | required event | present? | notes
2. **Taxonomy findings** — inconsistent/dead/duplicate/phantom | severity | fix
3. **PII/consent** — event | problem | handoff to `plan-privacy-compliance`
4. **Fix plan** — taxonomy → missing events → consent gate, severity-ordered

## Related

- `plan-privacy-compliance` — consent, deletion, store labels (run both)
- `iterate-post-launch` — consume a trustworthy data layer
- `audit-ux-journeys` — journeys that need funnel evidence
- `data-visualization` — rendering metrics, not collecting them
- `workflow-feature-flag` — flag exposure events
