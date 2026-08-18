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

---

## Phase 0 — Detect the billing setup

- Layer: raw StoreKit 2 / Play Billing, or RevenueCat / Adapty / Glassfy
- Entitlement check: client-only vs server-verified
- Backend store of subscription state vs trust-the-SDK-at-runtime
- Products: consumable, non-consumable, auto-renewing sub, trial / intro

---

## Phase 1 — Correctness

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

## Phase 2 — Sandbox only

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
