---
description: "Pricing and packaging audit — value metric, tiers, price corridor, research plan — plan only, no price edits"
argument-hint: "[product or pricing route]"
disable-model-invocation: true
effort: high
---

# Pricing Plan

Run the **`plan-pricing`** skill: inventory the plans, gates, metering, and
price points in the repo, score candidate value metrics, design ≤3 tiers with
an anchor, propose a price corridor with the research that confirms it
(Van Westendorp → Gabor-Granger → MaxDiff → conjoint), and emit
`plan-pricing.md`. **Plan only — no prices, plan enums, Stripe objects, or
copy change until approved.**

After approval: `enhance-web-conversion` (page), `audit-payment-system`
(billing), `audit-analytics` (pricing events).

The full playbook lives in the **`plan-pricing`** skill.
