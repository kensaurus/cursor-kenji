---
name: audit-monetization-iap
description: >
  Read-only audit of mobile IAP and subscriptions — StoreKit 2, Play Billing, or
  RevenueCat — for server receipt validation, restore, lifecycle sync, grace
  periods, and entitlements. Use when "audit our IAP", "restore purchases
  broken", or before a paid app. Web Stripe/ledgers → audit-payment-system.
license: MIT
---

# audit-monetization-iap — Store billing & entitlements

**Degree of freedom: MIXED** — Phases 0–1 `[HIGH freedom]`; Phase 2 sandbox
`[LOW freedom — run exactly]`. Never test against real billing.

Read-only. Entitlements must match what users paid for: no unlock-without-pay,
no paid-but-locked, no double-charge, no lost purchase on reinstall.

**The two revenue killers are client-trusted entitlements (piracy) and broken
restore (refunds + 1-star reviews).**

> **Present findings. Do not patch store/server code until approved.**
> Never test against real billing.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **audit-monetization-iap** (this) | App Store / Play IAP, restore, store notifications |
| `audit-payment-system` | Web money-movement, Stripe, ledgers, PCI |
| `plan-mobile-readiness` | Submission paperwork (IAP via official billing is a checkbox) |
| `plan-aso` | Store listing conversion, not receipt validation |
| `plan-privacy-compliance` | Purchase-data in privacy labels |

Do **not** fire for "Stripe webhook / double charge on the website" →
`audit-payment-system`.

## How to reason

1. **Observe** — quote where "is Pro?" is decided and whether a receipt/token is verified server-side
2. **Interpret** — can a client lie, or can a paid user lose access?
3. **Classify** — client-trust / missing restore / lifecycle hole / correct
4. **Severity** — client-trusted entitlement or broken restore = Critical

## Worked example

> **Observe:** `isPro` reads `RevenueCat.getCustomerInfo()` on-device only;
> no App Store Server Notification handler.
> **Interpret:** a patched client can unlock Pro; refunds never revoke.
> **Classify:** client-trust + missing lifecycle sync.
> **Severity:** Critical.
> **Finding:** entitlements | client-only | Critical | `lib/pro.ts:18` |
> verify on server + ASN V2 / RTDN

---

## Phase 0 — Detect the billing setup  [HIGH freedom]

- Layer: raw StoreKit 2 / Play Billing, or RevenueCat / Adapty / Glassfy
- Entitlement check: client-only vs server-verified
- Backend store of subscription state vs trust-the-SDK-at-runtime
- Products: consumable, non-consumable, auto-renewing sub, trial / intro

---

## Phase 1 — Correctness  [HIGH freedom]

**Receipt / token validation** — Server-side (App Store Server API / Play
Developer API). Client-trusted "purchase succeeded" is Critical. StoreKit 2
signed transactions still need verification, not just decode.

**Source of truth** — One place answers "does this user have Pro?" Backend
must hear App Store Server Notifications V2 / Play RTDN for cancel, refund,
billing failure — not only check at purchase time.

**Restore** — Discoverable Restore (Apple requires it). Recovers after
reinstall / new device / re-login.

**Lifecycle** — trial, active, grace (billing retry), on hold, paused
(Android), expired, refunded, up/downgrade. Missing grace locks paying users
out. Missing revoke leaves refunded users in.

**Trials** — One trial per user/family; no farm. UI must not promise a trial
the store will refuse.

**Cross-platform** — iOS + Android (+ web): one purchase unlocks via backend,
or the user is charged twice.

**Prices** — From the store (localized), never hardcoded.

**Edges** — Interrupted purchase resumes; sandbox vs prod receipt mix-up;
clock-gamed trials.

---

## Phase 2 — Sandbox only  [LOW freedom — never real billing]

Exercise: fresh purchase, restore on clean install, cancel → access ends at
period end, sandbox refund → revoke, trial → convert, interrupted purchase.
Confirm backend entitlement flips. Never real billing.

---

## Definition of Done

- [ ] Layer + products inventoried
- [ ] Every entitlement traced to server verify, or client-trust flagged Critical
- [ ] Store notifications wired or gap logged
- [ ] Restore present and sandbox-verified
- [ ] Lifecycle grid complete
- [ ] Cross-platform double-charge checked
- [ ] Prices from store
- [ ] Nothing patched

## Self-critique before reporting  [LOW freedom — do not skip]

1. **Evidenced** — file:line for the entitlement SoT, not "RevenueCat probably verifies"
2. **No real charges** — sandbox only
3. **Severity justified** — Critical = unlock-without-pay or paid-but-locked
4. **Right owner** — web Stripe → `audit-payment-system`
5. **Restore probed** — "button exists" is not restore-verified

## Output format

1. **Setup** — layer, products, entitlement SoT
2. **Findings** — issue | severity | `file:line` | fix shape
3. **Lifecycle grid** — state × handled?
4. **Sandbox log** — scenario | expected | actual
5. **Fix plan** — server verify + restore first

## Related

- `audit-payment-system` — web / Stripe / ledger
- `plan-mobile-readiness` — store review gates
- `plan-aso` — listing, not billing correctness
- `plan-privacy-compliance` — purchase data disclosure
