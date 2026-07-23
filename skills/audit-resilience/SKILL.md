---
name: audit-resilience
description: >-
  Read-only audit for the non-functional "20%" AI agents systematically skip: timeouts,
  retries with backoff+jitter, circuit breakers, idempotency keys, rate limiting, graceful
  degradation/fallbacks, cancellation, audit logging on sensitive actions, and PII handling in
  logs. Inventories every external call, mutation, webhook, and payment path and marks each
  concern Implemented/Partial/Missing with file:line, severity, and the exact skill to fix it.
  Use when "is this production-ready", "resilience audit", "will this survive real traffic",
  "audit retries/timeouts/idempotency", "reliability review", "the 80% problem", or
  "audit-resilience". Produces a prioritized report only — remediation is delegated to
  backend-error-handling / backend-observability / backend-patterns / plan-* skills.
license: MIT
---

# audit-resilience — The "80% Problem" Non-Functional Audit

Agents nail the happy path (CRUD, passing tests) and silently skip what decides whether code
survives real traffic: a webhook with no idempotency key double-charges; a fetch with no
timeout hangs the request; a retry storm with no backoff takes down the dependency; PII lands
in plaintext logs. This audit finds those gaps before production does.

> **Read-only.** This skill inventories resilience gaps and hands each to the right fix skill.
> It does not change code.

---

## Phase 0 — Detect the surfaces

```bash
# Outbound calls + clients
rg -n "fetch\(|axios|got\(|httpx|requests\.|HttpClient|ky\(" -g "*.{ts,tsx,js,py,go}" -l
# Mutations / writes / external effects
rg -n "prisma\.|\.insert\(|\.update\(|\.delete\(|supabase\.|INSERT|UPDATE|DELETE" -g "*.{ts,py,sql}" -l
# Webhooks / payments / queues
rg -n "webhook|stripe|paypal|queue|kafka|sqs|bull|cron|schedule" -g "*.{ts,tsx,js,py}" -l
# Logging (for PII / audit-log review)
rg -n "console\.(log|error)|logger\.|logging\.|print\(" -g "*.{ts,tsx,js,py}" -c
```

Record: HTTP clients, external services, mutation/webhook/payment paths, queue/cron jobs,
and the logging approach. If there are no external calls or mutations (pure static site /
library), note reduced applicability.

---

## Phase 1 — Research current patterns

Follow `/research`: current-year resilience patterns for the detected stack (retry/backoff
libraries, circuit-breaker options, idempotency-key conventions, the platform's rate-limit
primitives). Anchor to installed versions.

---

## Phase 2 — Resilience matrix (per external call / mutation / endpoint)

For each surface, mark **Implemented / Partial / Missing** with `file:line`:

| Concern | What to check | Why it matters |
|---|---|---|
| **Timeout** | Every outbound call has an explicit timeout | No timeout = hung requests exhaust the pool |
| **Retry + backoff** | Transient failures retried with exponential backoff **+ jitter**, capped | Naive retries cause retry storms |
| **Circuit breaker** | Repeated downstream failure trips a breaker / stops hammering | Prevents cascading failure |
| **Idempotency** | Writes/webhooks/payments use an idempotency key or dedupe | Prevents double-charge / double-write on retry |
| **Rate limiting** | Public/expensive endpoints are rate-limited per client | Prevents abuse and cost blowups |
| **Cancellation** | Long/aborted requests are cancellable (`AbortSignal`/context) | Frees resources on navigation/timeout |
| **Graceful degradation** | Fallback/empty/cached path when a dependency is down | App stays usable, not white-screen |
| **Error propagation** | Failures surface as structured errors, not swallowed | Silent catch hides outages |

```bash
rg -n "timeout|AbortController|AbortSignal|signal:" -g "*.{ts,tsx,js}" -c   # timeouts/cancellation
rg -n "retry|backoff|p-retry|exponential|jitter" -g "*.{ts,tsx,js,py}" -c    # retry policy
rg -n "idempotenc|dedupe|Idempotency-Key" -g "*.{ts,tsx,js,py}" -c           # idempotency
rg -n "rate.?limit|rateLimit|throttle|Ratelimit" -g "*.{ts,tsx,js,py}" -c    # rate limiting
rg -n "catch\s*\([^)]*\)\s*\{\s*\}" -g "*.{ts,tsx,js}"                        # empty catch (swallowed errors)
```

---

## Phase 3 — Observability & sensitive-data handling

| Concern | What to check |
|---|---|
| **Audit logging** | Sensitive/mutating actions (auth, payment, role change, delete) are logged with actor + timestamp |
| **PII in logs** | No emails/tokens/card data/passwords logged in plaintext; redaction in place |
| **Structured errors** | Errors carry codes/context (not bare strings); correlation/trace id present |
| **Health/timeouts surfaced** | Failures are observable (Sentry/logs), not only user-visible |

```bash
rg -n "password|token|secret|email|ssn|card|cvv" -g "*.{ts,tsx,js,py}" | rg -n "log|console|print"
```

---

## Phase 4 — Prioritized report (read-only)

```markdown
## Resilience Audit — [repo] — [date]
**Surfaces:** [N outbound calls · M mutations · K webhooks/payments · queues/cron]

### Critical (data loss / double-charge / outage risk)
| Gap | Surface | file:line | Fix via |
|---|---|---|---|
| No idempotency key on payment webhook | /api/webhooks/stripe | ... | backend-patterns |

### High / Medium
| Concern | Implemented | Partial | Missing | Fix via |
|---|---|---|---|---|
| Timeouts | [n] | [n] | [n] | backend-error-handling |
| Retry+backoff | ... | ... | ... | backend-patterns |
| PII in logs | ... | ... | ... | backend-observability |

### Recommended order
1. [Critical idempotency/timeout gaps] → backend-patterns / backend-error-handling
2. [Rate limiting + LLM cost] → plan-llm-cost-guardrails
3. [Observability + PII redaction] → backend-observability
```

**Forbidden:** claiming production-readiness from passing tests alone; treating an empty
`catch` as handled; skipping the payment/webhook idempotency check.

---

## Related

- `backend-error-handling` — implement timeouts, retries, structured errors, fallbacks
- `backend-patterns` — circuit breakers, idempotency, queue/retry architecture
- `backend-observability` — audit logging, PII redaction, tracing, alerting
- `plan-llm-cost-guardrails` — rate limiting + quota abuse for LLM/expensive endpoints
- `plan-input-validation` — the trust-boundary validation side of hardening
- `plan-data-integrity` — destructive-op and data-loss protections
- `complete-everything` — close the audited gaps to done with verification
