---
name: enhance-growth-loops
description: >
  Add growth loops to a live product: a "powered by" badge, shareable
  artifacts, invites and referral credit, each with K-factor events. Use when
  "referral program", "viral loop", "powered by badge", or "get users to
  invite".
license: MIT
---

# enhance-growth-loops — Output that recruits the next user

**Degree of freedom: MIXED.** Which loop fits the product `[HIGH freedom]`;
consent for invites, badge rules, event names, and per-loop measurement
`[LOW freedom — run exactly]`.

Apply-now. A funnel spends acquisition; a loop reinvests it — the output of
one user (a shared artifact, a badge on their site, an invite) becomes the
input for the next. Build one or two loops, measure each separately, and stop
calling a funnel step a loop.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **enhance-growth-loops** (this) | Badge, share, invite, referral mechanics and their events |
| `enhance-web-conversion` | Landing/pricing copy and upgrade prompts |
| `enhance-onboarding` | Getting the *invited* user to value (loop closes there) |
| `backend-patterns` | Referral credit ledger, idempotent reward grants |
| `audit-analytics` | Taxonomy the loop events must fit |
| `plan-gtm` | Chose the loop in its channel plan |

Do **not** fire for "write the referral email" alone → `design-email`.

## How to reason

1. **Loop** — what user output can carry the product to a stranger, and who sees it?
2. **Exposure** — how many strangers per active user per month, realistically?
3. **Conversion** — of those, how many can reach value without talking to anyone?
4. **Reinvest** — what does the new user produce that feeds the same loop?
5. **Measure** — K = exposures × conversion per user; one K per loop, never blended

## Worked example

> **Loop:** a photo-pairing app produces a shared result page per session.
> **Exposure:** ~3 recipients per session view the page; "Made with …" footer.
> **Conversion:** page has a one-tap "try it" that opens the product ungated → value before signup.
> **Reinvest:** the recipient's first session produces another shared page.
> **Measure:** `share_created`, `share_viewed { referrer }`, `loop_signup { loop: "share" }`; K ≈ 3 × 0.04 = 0.12 per session.

## Self-critique before reporting

- **One K per loop** — badge, share, and invite each have their own exposure and conversion events
- **Consent** — invites are user-initiated, single-send, with the recipient's opt-out; no contact-list scraping
- **Badge honest** — removable on paid plans; links to a page that says what the product did
- **Value before signup** — the landing side of every loop shows the artifact before asking for an account
- **Right owner** — copy → `enhance-web-conversion`; reward ledger → `backend-patterns`

---

## Loop catalogue  [HIGH freedom — choose one or two]

| Loop | Mechanism | Numbers to expect | Build notes |
|---|---|---|---|
| **Powered-by badge** | free plan shows "Made with X" on public output | 0.5–3% conversion, near-total exposure of every viewer | removable on paid; links to a "what this is" page with the artifact visible |
| **Shareable artifact** | result page / export / public dashboard | exposure = recipients per share | ungated view; one-tap "try with your own"; OG image of the artifact |
| **Templates & galleries** | users publish templates others clone | slow start, compounding | attribution to creator; clone = activation event |
| **Invite / collaboration** | product is better with a teammate | warm invites convert 10–25% | invite flow inside the value moment; invitee lands on the shared object |
| **Referral credit** | both sides get credit, storage, or a month | SaaS referral rate ~4.75%, referred conversion ~7.9%, top quartile 12%+ | idempotent grant on the *referred user's activation*, not signup; fraud cap per referrer |
| **Public changelog / build in public** | releases as content | content loop, not viral | pairs with `docs-launch-kit` |

Value before signup lifts referred conversion 2–5× — every loop's landing
side shows the artifact first.

## Procedure

### 1. Pick and size  [HIGH freedom]
Estimate exposure and conversion per active user from current data (or write
**unmeasured**). A loop with K < 0.05 is a nice touch, not a channel; say so.

### 2. Build the artifact side  [HIGH freedom]
Public route renders the artifact without auth; OG tags carry a real
screenshot (`enhance-web-seo` for meta); one primary "try it" action that
lands the stranger in the product's ungated path (`enhance-onboarding`).

### 3. Build the ask  [LOW freedom — rules]
- Badge: on free-plan output only; removable for paid; alt text says what the product is.
- Invite: user types or picks recipients; one email per recipient per invite; recipient can opt out of future invites; no address-book import without explicit per-send confirmation.
- Referral: unique link or code; reward granted once, idempotently, when the referred user hits `activated`; per-referrer cap; terms visible.

### 4. Events  [LOW freedom — names]

```
badge_viewed { host } · badge_clicked
share_created { kind } · share_viewed { referrer } · share_cta_clicked
invite_sent { count } · invite_accepted
referral_link_created · referral_signup · referral_activated · referral_reward_granted
loop_signup { loop }
```

Consent-gated; no recipient PII in properties. Reconcile with `audit-analytics`.

### 5. Verify
- Public artifact renders logged-out; OG preview shows the artifact
- Invite sends once per recipient; opt-out honored (test with a second inbox)
- Referral reward granted exactly once on activation; cap enforced
- K per loop computed from events after 7 days (or **unmeasured** with the date it will be)

## Guardrails

- **No dark patterns** — no pre-checked "invite all", no fake "3 friends joined", no unremovable badge on paid.
- **Anti-spam** — rate limits on invites and shares; report/opt-out link on every invite.
- **Rewards on activation, not signup** — signup rewards get farmed.
- **One K per loop** — never blend loops into one "viral coefficient".

## Chains with

- **`plan-gtm`** → the loop named in the channel plan.
- **`enhance-onboarding`** → the invitee's path to value.
- **`backend-patterns`** → credit ledger, idempotency, rate limits.
- **`enhance-web-seo`** → OG and meta on public artifact routes.
- **`test-playwright`** → logged-out artifact view and invite path.
