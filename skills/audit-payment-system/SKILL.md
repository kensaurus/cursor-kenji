---
name: audit-payment-system
description: >
  Read-only audit for payment/money-movement systems, scope-gated so a simple
  Stripe-Checkout site and an in-house ledger/gateway each see only relevant findings. Use
  when "audit payment system", "payment gateway audit", "double charge / idempotency",
  "ledger / reconciliation", "webhook / 3DS / PCI", or.
license: MIT
---

# audit-payment-system — Money-Movement Correctness & Compliance Audit

Payment code fails differently from normal CRUD. A dropped `PUT` is an annoyance; a **retried charge**
is a double-charge, a **lost ledger write** is money that vanished, a **logged PAN** is PCI liability,
and an **unverified webhook** is a spoofed "payment succeeded". The bugs are silent — everything looks
green until a customer is charged twice or the month-end books don't balance. This audit checks the
controls that keep every cent accounted for and every charge exactly-once.

The 2026 consensus is consistent across sources: a payment system rests on three pillars —
**idempotency**, a **double-entry ledger**, and **reconciliation** — with **PCI DSS v4.0.1** as a
non-negotiable floor and **webhooks as the source of truth** (never trust the synchronous API response
alone).

> **Read-only.** This skill assesses and prioritizes; it does not change code. Payment code is a
> STOP-and-confirm surface (see the composer execution rule) — findings here feed a human-reviewed
> remediation, ideally with a stronger model, not an unattended edit. Delegations: per-call runtime
> resilience → **`audit-resilience`**; PCI/secrets/authz/injection → **`audit-security`**; ledger &
> partitioning schema → **`audit-db-schema`**; outbox/saga *structure* → **`audit-backend-architecture`**;
> destructive/append-only integrity → **`plan-data-integrity`**; Stripe-specific integration →
> the Stripe plugin skills. This skill owns the *payment-domain correctness* layer and links out rather
> than duplicating.

---

## Core principle — earn each control by scope; every gap is money or liability

Not every app needs an in-house double-entry ledger. A shop using Stripe Checkout offloads the ledger,
settlement, and most PCI scope to Stripe — flagging "no double-entry ledger" there is noise. But
**idempotency, webhook verification, state sync, and tokens-only** apply to *everyone* who moves money.
Gate depth by scope (Phase 0), then treat every in-scope gap by its blast radius: **Critical = a
customer is charged twice, money is lost/unaccounted, or card data is exposed.** There is no "low
severity" for a double-charge.

---

## Phase 0 — Detect payment surfaces & scope (gates every later finding)

Find the money paths and the provider first; the scope tier decides which controls are in play. Never
report an in-house-ledger control as "Missing" on a pure merchant-integrator (`N/A` with a reason).

```bash
# Provider / SDK
rg -n --hidden -g '!node_modules' -i "stripe|paypal|braintree|adyen|square|payjp|paypay|razorpay|checkout\.com|worldpay|mollie|@stripe/|payment_intent|paymentintent" -l
# Money-movement verbs
rg -n -i "\b(charge|capture|authoriz|refund|void|payout|settle|chargeback|dispute|reversal)\b" -l
# Webhook endpoints + signature
rg -n -i "webhook|/webhooks?|constructEvent|verifyHeader|Stripe-Signature|x-signature|hmac" -l
# Idempotency
rg -n -i "idempotenc|idempotency[-_]?key|Idempotency-Key" -l
# Ledger / accounting
rg -n -i "ledger|double[-_ ]entry|debit|credit|journal|balance|posting|book(keeping)?" -l
# Reconciliation / settlement
rg -n -i "reconcil|settlement|settle|payout report|balance_transaction|three[-_ ]way" -l
# Money type (float smell = red flag)
rg -n -i "amount|price|money|currency|minor[-_ ]unit|cents" -g '*.{ts,tsx,js,py,go,java,rb,cs,sql}' -l
# Fraud / risk / SCA
rg -n -i "fraud|risk|velocity|3ds|3-?d ?secure|sca|radar|device.?fingerprint" -l
# Card-data smell (should find NOTHING raw)
rg -n -i "card[-_ ]?number|\bpan\b|cvv|cvc|card\.number|primary_account" -l
```

Record a **payment profile** and pick the tier — apply only in-scope rows:

| Tier | Signals | In scope |
|---|---|---|
| **P0 — Merchant integrator** | uses hosted Checkout / PaymentIntents / a PSP SDK; PSP holds the money & ledger | Idempotency on mutations, webhook verify+dedup, payment-state sync (pull-based recovery), refund/void idempotency, tokens-only/PCI-SAQ scope, light recon vs PSP dashboard, resilience around PSP calls |
| **P1 — Platform / marketplace** | Connect-style split payments, payouts to sellers, multi-party balances | + payout/clawback **saga**, an **internal ledger** for balances owed, multi-party reconciliation, dispute→clawback flow |
| **P2 — Gateway / PSP / wallet / fintech** | own ledger, direct acquirer/bank/card-network, issues balances | + full **double-entry append-only ledger**, **3-way reconciliation** (ledger↔settlement↔bank), settlement-file ingestion, sharding/serialized balance updates, in-house **fraud engine**, AML/sanctions, PCI DSS Level 1 |

If there is **no** money movement (no PSP, no charge/ledger paths), stop and report reduced
applicability. If card data appears in the last `rg` above, that is **Critical, report immediately**.

---

## Phase 1 — Research (version-anchored, provider-aware)

Follow `/research`. Anchor to the **installed** SDK version and the provider's *current* API (e.g.
Stripe **PaymentIntents**, not the legacy Charges API, which lacks native SCA/3DS2). Confirm the
current-year shape of the controls before judging the code.

**When the provider is Stripe, use the Stripe MCP as the authoritative source:**

- Concepts / best practice (idempotency keys, webhook signature verification, PaymentIntents lifecycle,
  SCA/3DS2, Radar) — `search_stripe_documentation` with `search_only_api_ref: false`, e.g.
  `{ "question": "verify webhook signatures and prevent duplicate event processing", "language": "node" }`.
- Exact API params the integration should be sending — `stripe_api_search` (intent + resource) then
  `stripe_api_details` on the operation id (e.g. confirm `PaymentIntent.create` is called with an
  idempotency key and amounts in minor units).

For **PayPal / Square / Adyen / PayPay / Braintree / others**, the Stripe MCP does not apply — use
`/research` against the provider's official docs (idempotency header, webhook/HMAC verification, 3DS/SCA,
settlement report format). Never invent a param or endpoint the provider doesn't expose.

---

## Phase 2 — Payment correctness matrix

For **each in-scope row**, mark `Implemented / Partial / Missing / N/A` with `file:line`, a one-line
"why it bites in prod", and the fix-delegate. **Full detection commands, good-vs-red-flag signals, and
fix targets are in [references/checklist.md](references/checklist.md)** — load it and work the applicable
groups.

### A. Money-movement correctness (P0+)
| # | Control | Bites in prod if missing | Fix via |
|---|---|---|---|
| A1 | **Idempotency on every mutation** (charge/capture/refund/void) — key from business intent, enforced at gateway **and** a DB **unique constraint** | Network retry → **double charge**; the DB constraint is the last line of defense | `audit-resilience`, `backend-patterns` |
| A2 | **Dedup / stored result** — reused key returns the prior result; reused key + *different* payload is rejected | Retry runs the charge twice; or a bug reuses a key for a new amount | `audit-resilience` |
| A3 | **Payment state machine** — explicit permitted/prohibited transitions; capture-twice is idempotent (2nd returns success, no re-process); no `SETTLED→AUTHORIZED`, no re-capture of `REFUNDED` | Double-capture, refund-after-refund, stuck-in-limbo payments | `backend-patterns` |
| A4 | **Money as integer minor units** (never float); currency travels with amount | Float rounding silently loses/creates fractions of a cent at scale | `audit-db-schema` |
| A5 | **Multi-currency & FX** — no cross-currency arithmetic; FX rate captured at posting time; explicit rounding (e.g. bankers') | Mixed-currency sums, rounding drift, unreproducible historical amounts | `backend-patterns` |

### B. Ledger & data integrity (P1 internal balances · P2 full ledger)
| # | Control | Bites in prod if missing | Fix via |
|---|---|---|---|
| B1 | **Double-entry** — every movement writes balanced debit+credit; sum of all entries = 0 (the invariant that proves nothing leaked) | Money "vanishes" or is created; books never balance; undetectable until audit | `audit-db-schema`, `backend-patterns` |
| B2 | **Append-only / immutable** transaction & ledger tables — corrections are reversing entries, never `UPDATE`/`DELETE` | An edited/deleted row destroys the audit trail; disputes become unwinnable | `plan-data-integrity`, `audit-db-schema` |
| B3 | **Balance = derived, snapshotted separately** — current balance is a snapshot/materialization of ledger entries, not a hand-updated column | Balance column drifts from the ledger; two sources of "truth" | `audit-db-schema` |
| B4 | **Auditability** — event-sourced/immutable history reconstructs any transaction; every access to txn data is logged | Can't answer "what happened to charge X"; fails compliance audit | `backend-observability`, `audit-security` |
| B5 | **Schema for scale** — partition by date (manageable rows/day), indexed for recon queries | Unbounded hot table; recon and reporting time out | `audit-db-schema` |

### C. Async orchestration & webhook delivery (P0+)
| # | Control | Bites in prod if missing | Fix via |
|---|---|---|---|
| C1 | **Sync-auth vs async-everything** — authorization is synchronous; settlement, webhooks, reporting, recon are async | Slow downstream blocks the checkout; or status trusted from a response that lied | `audit-backend-architecture` |
| C2 | **Webhook signature verified** (HMAC / provider `constructEvent`) before any processing | Spoofed "payment succeeded" → goods shipped for free | `audit-security` |
| C3 | **Webhook event-id dedup + 200-then-process** — record processed event ids; ack 200 immediately, process async | PSP retries for days → the same event processed twice (double ledger post) | `audit-resilience` |
| C4 | **Atomic state+ledger+outbox** — the state transition, ledger posting, and outbound event commit in one DB transaction (outbox relay publishes) | Dual-write: crash mid-way = captured payment with no fulfillment event, or vice versa | `audit-backend-architecture`, `backend-patterns` |
| C5 | **Pull-based recovery for stuck payments** — a worker scans transitional states past a timeout and queries the PSP as source of truth | A lost webhook leaves a payment stuck forever; user re-tries → double charge | `backend-patterns` |
| C6 | **Refund/dispute/payout as saga** — multi-service steps with compensations (reverse auth, negative ledger entry, payout clawback, notify) | A half-done refund claws back money but never notifies, or refunds twice | `backend-patterns` |

### D. Reconciliation & settlement (P1/P2)
| # | Control | Bites in prod if missing | Fix via |
|---|---|---|---|
| D1 | **Automated daily reconciliation** vs the PSP settlement file — the single most important control | Ledger and PSP silently diverge (timing, lost webhooks); discrepancies compound | `backend-patterns`, `data-pipeline` |
| D2 | **3-way match** (internal ledger ↔ card-network/PSP ↔ bank statement) with a **break report** | Missing/extra/mismatched txns go unnoticed; revenue leakage & fraud hidden | `data-pipeline` |
| D3 | **Discrepancy handling** — missing txn escalated; extra bank txn found-or-reversed; amount mismatch checks FX; rounding-only auto-resolved | Every break needs a human; or breaks silently ignored | `backend-patterns` |
| D4 | **Safety brake** — unreconciled balance over a threshold halts new captures / alerts | Losses accumulate faster than they're caught | `audit-resilience` |

### E. Fraud, risk & SCA (P0 delegate · P1/P2 in-house)
| # | Control | Bites in prod if missing | Fix via |
|---|---|---|---|
| E1 | **Risk scoring pre-auth** — velocity, geolocation, amount, device fingerprint via rules engine (+ ML score where present) | Card-testing / stolen-card attacks; chargebacks | `backend-patterns` |
| E2 | **3DS2 / SCA step-up** — high-risk/PSD2-region → 3D Secure challenge; low-risk → frictionless via exemptions | Non-compliant in EU (declines) or friction everywhere (lost conversion) | provider docs / `backend-patterns` |
| E3 | **Fraud-service failure policy** — explicit fail-open vs fail-closed when the risk service is down (breaker) | Fraud service down → either block all revenue or wave through all fraud | `audit-resilience` |
| E4 | **Chargeback / dispute monitoring** — track ratio, react before acquirer watchlist (VAMP/VDMP) thresholds | Program placement / fines; account termination | `backend-observability` |
| E5 | **AML / sanctions screening** (P2 / regulated) | Regulatory exposure for regulated flows | `/research` + human |

### F. Compliance & security — PCI DSS v4.0.1 (all tiers)
| # | Control | Bites in prod if missing | Fix via |
|---|---|---|---|
| F1 | **Never store/log PAN or CVV** — tokens only; card data never touches your servers/logs (scope reduction) | PCI breach liability; CVV storage is flatly prohibited | `audit-security` |
| F2 | **Tokenization** — hosted fields / PaymentIntents so raw card data bypasses your infra | Balloons PCI scope from SAQ-A to full audit | provider docs |
| F3 | **Key rotation & secret handling** — API/signing keys rotated, never in code/logs | Leaked long-lived key = unlimited charges/refunds | `audit-security`, `plan-secrets-audit` |
| F4 | **Access audit** — every read/write of transaction/PII data is logged & attributable | Can't prove who touched payment data; fails audit | `audit-security`, `backend-observability` |

### G. Error handling & resilience (P0+)
| # | Control | Bites in prod if missing | Fix via |
|---|---|---|---|
| G1 | **PSP/bank API timeout + retry with backoff** and a **circuit breaker** | One slow provider exhausts the pool → whole checkout 503s | `audit-resilience` |
| G2 | **Bulkhead / pool isolation** — PSP calls can't starve the DB/other deps | Timeout storm cascades across the system | `audit-backend-architecture` |
| G3 | **Partial-write safety** — state + ledger commit atomically; no "charged but not booked" | Money taken, ledger never posted (or reverse) | `backend-patterns` |
| G4 | **Graceful degradation** for non-critical deps (fraud/notification down ≠ block auth, per policy) | A non-critical outage takes payments offline | `audit-resilience` |

Rules:
- **Evidence or it didn't happen** — every verdict cites `file:line` or "searched, none found".
- **N/A is first-class** — record *why* (scope tier), don't drop the row.
- **No double-counting** — link per-call resilience to `audit-resilience`, PCI to `audit-security`.

---

## Phase 3 — Prioritized report (read-only)

```markdown
## Payment System Audit — [repo] — [date]
**Provider(s):** [Stripe/PayPal/…]  ·  **Scope tier:** [P0/P1/P2 + evidence]
**In scope:** [groups]  ·  **N/A (out of tier):** [rows + why]

### Critical — money loss / double-charge / card-data exposure (fix before ship)
| Finding | Control | file:line | Why it bites | Fix via |
|---|---|---|---|---|
| Charge has no idempotency key; no unique constraint | A1 | pay/charge.ts:52 | Retry double-charges the customer | audit-resilience |
| Webhook processed without signature check | C2 | api/webhook.ts:9 | Spoofed "paid" → free goods | audit-security |
| Card number written to app log | F1 | pay/log.ts:20 | PCI breach liability | audit-security |
| DB write then broker publish (not atomic) | C4 | ledger.ts:88 | Captured, never booked → money unaccounted | backend-patterns |

### High / Medium (correctness & compliance matrix)
| Group | Implemented | Partial | Missing | N/A | Fix via |
|---|---|---|---|---|---|
| A Money-movement | … | … | … | | audit-resilience |
| B Ledger | … | … | … | (P0) | audit-db-schema |
| C Webhooks/async | … | … | … | | backend-patterns |
| D Reconciliation | … | … | … | (P0) | data-pipeline |
| E Fraud/SCA | … | … | … | | backend-patterns |
| F PCI/compliance | … | … | … | | audit-security |
| G Resilience | … | … | … | | audit-resilience |

### Lift-to-production roadmap (ordered by blast radius)
1. Idempotency (gateway + DB unique constraint) on every mutation → audit-resilience
2. Verify + dedup webhooks, 200-then-process async → audit-security / audit-resilience
3. Atomic state+ledger+outbox; pull-based recovery for stuck payments → backend-patterns
4. [P1/P2] Double-entry append-only ledger + daily reconciliation w/ break report → audit-db-schema / data-pipeline
5. Tokens-only + key rotation + access audit (PCI v4.0.1) → audit-security
6. Breaker/bulkhead + fraud fail-policy around every external call → audit-resilience
```

**Forbidden:** declaring "production-grade" from passing tests alone; flagging P2-only controls
(in-house ledger, 3-way bank match, sharding) against a P0 merchant integrator; re-auditing per-call
timeouts/retries `audit-resilience` owns; assigning any severity below Critical to a double-charge,
lost-money, or PAN-exposure finding; recommending a refund/payout saga without compensation logic;
**editing payment code** — this skill reports; remediation is human-reviewed (route to a stronger model
per the composer execution rule).

---

## Related
- `audit-resilience` — per-call idempotency keys, timeouts, retry+backoff+jitter, circuit breaker, cancellation
- `audit-security` — PCI/PAN handling, webhook auth, secrets, key rotation, injection, access logging
- `audit-db-schema` — double-entry ledger schema, append-only constraints, money types, partitioning
- `audit-backend-architecture` — outbox/saga/breaker *structure* and topology fit (this skill checks payment *correctness* on top)
- `plan-data-integrity` — append-only/immutability guarantees and destructive-op safety
- `plan-secrets-audit` — rotate vs relocate provider API/signing keys
- `backend-patterns` / `backend-patterns/references/architecture-patterns.md` — implement idempotency, outbox, saga, state machine
- `data-pipeline` — reconciliation/settlement ingestion jobs
- the Stripe plugin skills (`stripe-best-practices`, `connect-recommend`, `upgrade-stripe`) — Stripe-specific integration
- `audit-monetization-iap` — StoreKit / Play Billing / RevenueCat (not Stripe/web)
- `complete-everything` — close audited gaps to done with verification (human-reviewed for payment code)
