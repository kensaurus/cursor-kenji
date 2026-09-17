---
name: iterate-gtm-weekly
description: >
  Weekly go-to-market review for a shipped product: funnel by source,
  activation cohort, top drop-off, launch results, then one experiment and one
  post, scorecard row appended. Use when "weekly growth review", "what should
  we do this week for growth", "GTM check-in". Production bugs →
  iterate-post-launch.
license: MIT
---

# iterate-gtm-weekly — One number, one fix, one post

**Degree of freedom: MIXED.** Which lever to pull `[HIGH freedom]`; the
five-line review, the single-experiment rule, and the scorecard update
`[LOW freedom — run exactly]`.

The loop after `workflow-gtm`. Thirty minutes a week: read what the funnel
did, name the one step that lost the most, ship one experiment against it,
publish one thing, write it down. `iterate-post-launch` owns production
defects; this owns growth.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **iterate-gtm-weekly** (this) | Weekly funnel read → one experiment → one post → scorecard |
| `iterate-post-launch` | Sentry / production signals → fix |
| `workflow-gtm` | The initial plan-to-apply run this loop follows |
| `audit-analytics` | When a funnel cell is blind, add the event first |
| `docs-launch-kit` | The post, when it is a launch |
| `workflow-feedback-to-closure` | Turning user feedback into tickets |

Do **not** fire for "errors spiked in production" → `iterate-post-launch`.

## How to reason

1. **Read** — the six funnel cells by source for the last 7 days vs the prior 7
2. **Locate** — the single step with the largest absolute loss (not the smallest percentage)
3. **Attribute** — did last week's experiment or post move anything; say so with the number
4. **Choose** — one experiment on the losing step, one post, both small enough for this week
5. **Record** — scorecard row appended; next review scheduled

## Worked example

> **Read:** visits 4,120 (+9%), signups 310 (−4%), activated 71 (23%, flat), paid 6, refer 2; Show HN source dried up, organic docs traffic up.
> **Locate:** signup → activated loses 239 users; visit → signup lost 22 more than last week but far fewer in absolute terms.
> **Attribute:** last week's hero rewrite: visit→signup 7.9% → 7.5% — no lift; keep for one more week (sample small).
> **Choose:** experiment — pre-fill the workspace with sample data for the "explore" JTBD answer (`enhance-onboarding`); post — a short comparison page announcement.
> **Record:** row appended to `plan-gtm.md` scorecard; review next Monday.

## Self-critique before reporting

- **Five lines** — the review fits: funnel by source · activation cohort · top drop-off · last experiment result · one post
- **One experiment** — exactly one, with a metric and a stop date; a second becomes next week's
- **Attributed** — last week's change has a number beside it, even if "no change" or "unmeasured"
- **Recorded** — scorecard row appended in `plan-gtm.md` (or the file `workflow-gtm` produced)
- **Right owner** — production errors → `iterate-post-launch`; new events → `audit-analytics`

---

## Procedure  [LOW freedom — run exactly]

1. **Pull numbers** — analytics dashboard or export for Visit → Signup →
   Activated → Habit → Paid → Refer, by `utm_source` / referrer, this week vs
   last. Blind cell → write **unmeasured** and file the event with
   `audit-analytics` as this week's experiment if it is the losing step.
2. **Launch results** — fill any `docs/launch/*.md` Results table older than 7 days.
3. **Locate the loss** — absolute users lost per step; pick the largest.
4. **Attribute** — last week's experiment: metric before / after; keep, revert, or extend.
5. **Choose** — one experiment (owner skill named) + one post (channel named).
6. **Write the row** and schedule next week.

## Levers by losing step  [HIGH freedom]

| Losing step | First levers | Skill |
|---|---|---|
| Visit → Signup | hero five-second test, CTA verb, "no card" line, ungated try | `enhance-web-conversion` |
| Signup → Activated | cut a field, sample data, checklist end = activation, day-1 nudge | `enhance-onboarding`, `enhance-lifecycle-email` |
| Activated → Habit | day-3/7 nudges, saved-state reminder, second aha | `enhance-lifecycle-email` |
| Habit → Paid | limit-moment prompt, price shown, annual toggle wording | `enhance-web-conversion`, `plan-pricing` |
| Paid → Refer | badge, share artifact, referral credit on activation | `enhance-growth-loops` |
| Visits themselves | one comparison page, one launch post, registry listing | `docs-comparison-pages`, `docs-launch-kit`, `audit-registry-listing` |

## Scorecard row  [LOW freedom — shape]

```markdown
| Week | Visit | Signup | Activated | Habit | Paid | Refer | Top loss | Experiment (metric, stop date) | Post | Last week's result |
```

## Guardrails

- **One experiment.** Two changes on one step make attribution impossible.
- **Absolute loss, not percentage.** A 90% drop on 10 users is not the priority.
- **Numbers or "unmeasured".** No estimates presented as measurements.
- **Thirty minutes.** If the review grows, the instrumentation is the problem — file it.

## Chains with

- **`workflow-gtm`** → produces the scorecard this loop appends to.
- **`audit-analytics`** → blind cells.
- **`enhance-onboarding`**, **`enhance-web-conversion`**, **`enhance-lifecycle-email`**, **`enhance-growth-loops`**, **`docs-comparison-pages`**, **`docs-launch-kit`** → the levers.
