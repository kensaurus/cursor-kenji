---
name: enhance-web-conversion
description: >
  Conversion pass for landing, pricing, and upgrade paths: a positioned hero,
  one CTA, real proof, anchored tiers, upgrade prompts at value moments. Use
  when "pricing page", "improve conversion", "free to paid", or "paywall UX".
  Page build → enhance-web-landing.
license: MIT
---

# enhance-web-conversion — Message, offer, proof, prompt

**Degree of freedom: MIXED.** Copy angle, packaging, and proof selection
`[HIGH freedom]`; the hero five-second check, the dark-pattern ban, and the
event names `[LOW freedom — run exactly]`.

Apply-now. `enhance-web-landing` makes the page look hand-crafted; this skill
makes it **say the right thing to the right person and ask once**. It touches
hero copy, CTA, pricing packaging, social proof, trust signals, and in-app
upgrade moments — and measures each with an event.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **enhance-web-conversion** (this) | What the page claims, offers, proves, and asks |
| `enhance-web-landing` | Layout, type, motion, visual system of the page |
| `enhance-onboarding` | Getting the free user to first value (before any ask) |
| `audit-payment-system` | Whether checkout, webhooks, and refunds actually work |
| `audit-monetization-iap` | Mobile store purchases |
| `plan-gtm` | Chose the model and the ICP this skill writes for |
| `plan-antislop` | Voice audit when the copy reads generated |
| `enhance-web-seo` | Titles, meta, schema for the same pages |

Do **not** fire for "make the pricing page prettier" alone → `enhance-web-landing`.

## How to reason

1. **Message** — does the hero state who it is for, what it does, why not the alternative — in five seconds?
2. **Offer** — does the packaging match the monetization model and make one tier the obvious pick?
3. **Proof** — is every claim backed by a named person, a number, or a screenshot?
4. **Prompt** — does the upgrade ask appear where value was just felt, and say what unlocks?
5. **Measure** — does each of the above fire an event so the change can be judged?

## Worked example

> **Message:** hero reads "145 skills · 57 commands"; the positioning says
> "refuses done while unchecked work remains". Rewrite: *"Coding agents call it
> done when it compiles. These playbooks don't."* CTA "Install in 30 seconds".
> **Offer:** free forever — so the only ask is the install; remove the second CTA.
> **Proof:** replace "used by developers" with the skills.sh install badge (live
> number) and one named quote from an issue thread.
> **Prompt:** none — no paid tier; add a "star if this saved you a rework" line
> after the first successful run (in-app, not on the landing page).
> **Measure:** `cta_clicked { location }`, `install_copied`; before/after
> visit→install unmeasured → measured.

## Self-critique before reporting

- **Five-second pass** — a stranger reading only the hero can say who/what/why-different
- **One primary CTA per screen** — its verb matches the model ("Start free" / "Start 14-day trial" / "Book a demo")
- **Every proof is real** — names, logos, numbers, and quotes exist in the repo or were supplied
- **No dark patterns** — cancel path visible; no fake timers, confirm-shaming, or pre-checked add-ons
- **Events added** — pricing and upgrade events listed with where they fire
- **Right owner** — visual system → `enhance-web-landing`; checkout bugs → `audit-payment-system`

---

## Procedure

### 1. Hero and CTA  [LOW freedom — check; HIGH freedom — write]

Five-second check on the current hero: **who** (ICP named or implied), **what**
(outcome, not feature count), **why not the alternative**, **one CTA** above the
fold. Rewrite what fails. Sub-headline carries the mechanism; the H1 carries the
outcome. Model-matched CTA copy:

| Model | Primary CTA | Under it |
|---|---|---|
| Freemium / ungated | Start free · Try it now | "No account needed" / "Free forever for …" |
| Trial, no card | Start 14-day trial | "No credit card required" (lifts visit→signup) |
| Trial, card | Start trial | Price after trial + cancel-anytime, visible |
| Open-core / hosted | Deploy on cloud · Self-host | Link to the other path |
| Sales-assisted | Book a demo | Who it is for (team size / ACV) |

### 2. Pricing page  [HIGH freedom]

- **≤3 self-serve tiers** good-better-best; the recommended middle tier is
  visually and verbally the default; the higher tier sits on the right as the
  anchor. An enterprise column shows "from $X" — hiding its price removes the
  anchor and hurts middle-tier conversion.
- **Same CTA verb on every column**; "No credit card required" under the
  button when true.
- **Annual toggle** — default monthly for self-serve products with a free
  tier; state the saving as "2 months free", not "save 17%" (norm 15–25%).
- **Free tier limits explicit** — what runs out (seats, rows, runs), never vague "basic".
- **Usage / credits** — if the model meters, show the unit, the included
  amount, and a live estimate; bill shock is the top objection.
- **Feature table** lists outcomes people search for; hide internals.
- **FAQ** answers cancel, refund, data export, security — the objections that stall checkout.
- A dual CTA (free plan **or** 14-day card trial) lifted premium trial starts
  26% in one 2026 case; offer it only when `plan-gtm` chose both paths.
- Benchmarks to set expectations (2026, ChartMogul × Kyle Poyar × ProductLed):
  freemium good 3–5%, trial no-card 4–6%, card-required 25–35%; median 8%.
  Judge the change by Signup→Paid, not visits. Rows and URLs:
  `plan-gtm/references/benchmarks-2026.md`.

### 3. Proof and trust  [HIGH freedom]

Order of strength: live numbers (installs, stars, customers) → named quotes with
role → recognizable logos → screenshots of the real product → security/privacy
pages. Place the strongest one directly under the hero CTA and again beside the
pricing CTA. Fabricated or anonymous "Jane D., CEO" quotes are removed, not kept.

### 4. In-app upgrade prompts  [HIGH freedom]

Ask at **value moments**: a limit reached, a premium feature touched, a result
worth keeping. The prompt names what unlocks, shows price, and completes in one
step. Dismiss is one click and remembered. Never interrupt the activation path
(`enhance-onboarding` owns that stretch). For a free tier, a "powered by"
badge on shared output is the cheapest loop (0.5–3% conversion, near-total
exposure); a referral credit follows once activation is measured.

### 5. Events  [LOW freedom — names]

```
cta_clicked { location, label }
pricing_viewed · plan_selected { plan, interval }
checkout_started · checkout_completed { plan, interval }
upgrade_prompt_shown { trigger } · upgrade_prompt_clicked { trigger }
```

Reconcile with `audit-analytics`; consent-gated; no PII.

### 6. Verify

- Five-second read of the new hero by someone outside the project (or a fresh model with only the screenshot): what is it, for whom, what outcome — then the doppelganger check with the logo removed (could this be a competitor's page?)
- Playwright: pricing → checkout start path; cancel/downgrade path still reachable
- Events observed in the debug view
- Report: before/after copy, packaging diff, proof sources, events, files

## Guardrails

- **No dark patterns** — no fake countdowns or scarcity, hidden cancel, confirm-shaming, pre-checked upsells, or bait pricing.
- **Claims need evidence** — a number or a name; otherwise cut the claim.
- **Model is not yours to change** — packaging follows the `plan-gtm` decision.
- **Voice** — if it reads like every other SaaS page, hand the copy to `plan-antislop`.

## Chains with

- **`plan-gtm`** → positioning statement and monetization verdict this skill implements.
- **`enhance-web-landing`** → visual pass on the same pages.
- **`enhance-web-seo`** → title/meta/schema for landing and pricing.
- **`audit-payment-system`** → before turning on a card-required trial.
- **`test-playwright`** → lock checkout and cancel paths.
