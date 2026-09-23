---
name: enhance-lifecycle-email
description: >
  Lifecycle email from product events: activation nudges, trial expiry split
  by activated vs stalled, limit-reached upgrades, win-back, with exits and
  consent. Use when "onboarding emails", "trial expiry emails", "drip
  sequence", or "win-back email". Templates → design-email.
license: MIT
---

# enhance-lifecycle-email — Emails that arrive because something happened

**Degree of freedom: MIXED.** Sequence content and cadence `[HIGH freedom]`;
trigger-before-timer rule, exit conditions, consent, idempotent sends, and
event names `[LOW freedom — run exactly]`.

Apply-now. Behavior-triggered sends are the primary path; timers are the
fallback for users who produce no signal. Every email is gated on a product
event, exits the moment the user does the thing, and reports its own
open/click/conversion. Templates come from `design-email`; inbox placement
from `enhance-email-deliverability`.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **enhance-lifecycle-email** (this) | Which email fires on which event, exits, cadence, measurement |
| `design-email` | Template design and copy craft for each message |
| `enhance-email-deliverability` | SPF/DKIM/DMARC, bounces, list hygiene |
| `enhance-onboarding` | The in-app path the emails point back to |
| `data-pipeline` | Idempotent scheduling / cron correctness for sends |
| `plan-privacy-compliance` | Consent basis and retention for marketing mail |

Do **not** fire for "design the welcome email" alone → `design-email`.

## How to reason

1. **Signal** — which product event (or its absence for N hours) says this user needs this email?
2. **Exit** — which event ends the sequence because the goal was reached?
3. **Track** — activated vs stalled users get different messages at the same calendar point
4. **Cadence** — spacing follows the product's time-to-value, not a default day-0/3/7
5. **Measure** — each send has delivered / opened / clicked / converted events tied to the trigger

## Worked example

> **Signal:** `signup_completed` with no `activated` after 24 h → "the one thing to try" email with a deep link to the sample-data path.
> **Exit:** `activated` fires → the activation track stops; the habit track starts.
> **Track:** trial day 11 — activated users get "here is what you built and what happens to it"; stalled users get "let us set it up with you" — no discount for an empty account.
> **Cadence:** TTV median for this product is ~2 h, so the fallback nudge is at 24 h, not day 3.
> **Measure:** `email_sent { sequence, step, trigger }` … `email_converted { goal }`; activation nudge → 14% of stalled users activate within 48 h.

## Self-critique before reporting

- **Trigger first** — every email names its product-event trigger; timers appear only as "no signal after N h" fallbacks
- **Exits present** — every sequence lists the event that stops it
- **Two tracks at expiry** — activated and stalled users receive different messages
- **Consent and unsubscribe** — transactional vs marketing classification stated; one-click unsubscribe on marketing; suppression list respected
- **Idempotent** — a retried job cannot send twice (`data-pipeline` pattern)
- **Right owner** — template craft → `design-email`; deliverability → `enhance-email-deliverability`

---

## Sequences  [HIGH freedom — choose; each row optional]

| Sequence | Trigger | Exit | Notes |
|---|---|---|---|
| **Welcome** | `signup_completed` | — | one email; the single next action, not a feature tour |
| **Activation nudge** | no `activated` within TTV × 3 (fallback ≈ 24 h) | `activated` | deep link to the shortest path; users without the core action in 48 h are the highest churn risk |
| **Setup stall** | `setup_started` without `setup_completed` for 24 h | `setup_completed` | name the exact step left |
| **Habit** | `activated` | `habit_reached` | day-3 / day-7 value reminders keyed to what they created |
| **Trial expiry** | `trial_ends_at − 3d`, `−1d`, `0`, `+3d` | `checkout_completed` | **split by `activated`**: activated → what you built and what happens to it, price, one CTA; stalled → help to value, no discount |
| **Limit reached** | `limit_reached { resource }` | `checkout_completed` | what unlocks, price, one-click; mirrors the in-app prompt |
| **Win-back** | no session for 30 d (activated users only) | any session | one email, then stop; new-feature framing |
| **Dunning** | `payment_failed` | `payment_succeeded` | day 0 / 3 / 7; transactional |

Behavior-triggered sequences report roughly 3× the click-through and
markedly higher conversion than calendar drips (vendor-reported; treat as a
reason to test, not a board number). Late-trial emails matter: most trial
conversions happen in the second half — do not stop the sequence on day 7.

## Procedure

### 1. Map events  [LOW freedom]
Confirm the product emits `signup_completed`, `setup_completed`, `activated`,
`habit_reached`, `limit_reached`, `trial_ends_at`, `checkout_completed`,
`payment_failed` (or their equivalents). Missing ones → `enhance-onboarding`
/ `audit-analytics` first; an email on an unmeasured trigger is a timer in
disguise.

### 2. Design the tracks  [HIGH freedom]
Pick sequences from the table; write trigger, exit, audience, message goal,
and CTA for each step. Cadence from the measured TTV. Hand the copy brief to
`design-email`.

### 3. Wire  [LOW freedom — rules]
- Provider: the one already in the repo (Resend, Postmark, SES, Customer.io, Loops); no second ESP.
- Each send keyed by `(user_id, sequence, step)` — idempotent; retries cannot double-send.
- Classification per email: transactional (dunning, expiry-day facts) vs marketing (nudges, win-back); marketing carries one-click unsubscribe and honors the suppression list; consent basis recorded (`plan-privacy-compliance` if unclear).
- Exits evaluated at send time, not enqueue time.
- Quiet hours and per-user daily cap (≤ 1 marketing email per day).

### 4. Events  [LOW freedom — names]

```
email_sent { sequence, step, trigger }
email_delivered · email_opened · email_clicked { link }
email_converted { sequence, goal_event }
email_unsubscribed { sequence }
```

### 5. Verify
- Test user: trigger → email within the window; performing the exit event stops the next step (observe no send)
- Retry the job: exactly one send per `(user, sequence, step)`
- Unsubscribe → no further marketing mail; transactional still delivered
- Report: sequences, triggers, exits, first-week `email_converted` by sequence (or **unmeasured** with date)

## Guardrails

- **No timers as the default.** A calendar drip is the fallback for silence.
- **No discount for an empty account.** Stalled users get help, not a coupon.
- **Consent and classification stated per email.** Marketing without an unsubscribe does not ship.
- **One ESP.** Do not add a second provider to get a feature.

## Chains with

- **`enhance-onboarding`** → the events and the in-app path every email links to.
- **`design-email`** → templates and copy.
- **`enhance-email-deliverability`** → before the first sequence goes live.
- **`data-pipeline`** → idempotent scheduling.
- **`iterate-gtm-weekly`** → reads `email_converted` by sequence.
