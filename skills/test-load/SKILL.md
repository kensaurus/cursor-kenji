---
name: test-load
description: >
  Design and run a k6/Artillery load profile that measures throughput, latency
  percentiles, error rate, and the breaking point under concurrent traffic. Use
  when "load test this", "will it handle launch traffic", or "find the breaking
  point". Resilience-by-reading-code → audit-resilience. Never hit prod unsigned.
license: MIT
---

# test-load — Measured concurrency, not a guess

Turn "I think it'll hold" into numbers: at N concurrent users, p95 is X, error
rate is Y, it falls over at Z.

**`audit-resilience` tells you retries exist; this proves whether they save you
when 500 people arrive at once.**

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **test-load** (this) | Concurrent traffic profiles + measured SLO |
| `audit-resilience` | Timeouts/retries/idempotency *in code* |
| `audit-infra-cost` | Consumes these capacity numbers to right-size |
| `audit-performance` | Single-user Web Vitals / bundle |
| `backend-db-performance` | Query/index fixes after this names the bottleneck |
| `plan-llm-cost-guardrails` | Model-token spend, not HTTP concurrency |

**Never production without explicit sign-off and rate caps.** Prefer prod-like
staging.

---

## Phase 0 — Detect stack and set targets

- Tool: **k6** preferred (scriptable, CI-friendly); Artillery as fallback
- Target env + auth method
- **Goal first** (without it the test is noise):
  - Expected peak concurrency (ads / launch)
  - Acceptable p95/p99 and max error rate (SLO)
  - Capacity (hold at peak) vs breaking point (where it fails)

---

## Phase 1 — Model realistic load

- **Journeys, not one URL** — signup → browse → action, with think-time
- **Mix** — weight by real traffic (mostly reads)
- **Data variety** — pool of users/inputs, not one cached row
- **Auth** — real login or pre-provisioned tokens (unauthenticated misses RLS cost)

---

## Phase 2 — Graduated profiles

1. **Smoke** — few VUs; script + baseline healthy
2. **Load** — ramp to expected peak, soak several minutes (SLO pass/fail)
3. **Stress** — past peak until degrade; name the failing resource
4. **Spike** — instant jump (viral ad); does it recover?
5. Optional **soak** — 30+ min for leaks / pool exhaustion

---

## Phase 3 — Measure the right things

- Latency **percentiles** (p50/p95/p99) — averages hide pain
- Error rate **and types** (timeout vs 5xx vs refused)
- Throughput (req/s) per level
- Bottleneck: DB pool, function concurrency, rate limiter, memory, cold start
- Correlate Supabase / Sentry / host metrics during the run

Commit the reusable script. Hand capacity numbers to `audit-infra-cost`.

---

## Definition of Done

- [ ] Tool + env chosen; prod excluded or signed + capped
- [ ] SLO stated before running
- [ ] Journeys weighted, think-time, varied data, real auth
- [ ] Smoke → load → stress → spike run
- [ ] Percentiles, errors, throughput captured
- [ ] Breaking point + failing resource named
- [ ] SLO verdict + fix handoff
- [ ] Script committed

## Output format

1. **Design** — SLO, journeys, env, profiles
2. **Results** — profile | VUs | throughput | p50/p95/p99 | errors | vs SLO
3. **Breaking point** — where, why, graceful vs cascade
4. **Handoff** — `backend-db-performance`, `backend-patterns`, `audit-resilience`, `audit-infra-cost`

## Related

- `audit-resilience` — code-level NFRs
- `audit-infra-cost` — right-size from these numbers
- `backend-db-performance` / `backend-patterns` — fix the named bottleneck
- `audit-performance` — single-user frontend
