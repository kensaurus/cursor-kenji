---
name: audit-backend-architecture
description: >
  Read-only audit AND decision advisor for backend/distributed-systems architecture,
  topology-gated so a Next.js/Supabase monolith and a Kubernetes fleet each see only
  relevant. Use when "audit backend architecture", "which pattern should I use", "am I
  over-engineering", "sync vs event-driven".
license: MIT
---

# audit-backend-architecture — Distributed-Systems Pattern Maturity Audit

Agents ship the happy-path CRUD and call it done. What decides whether a backend survives scale is
the **architecture**: is there one place that enforces auth/rate-limit/CORS, or is it copy-pasted per
route? Does a payment write and its event commit atomically, or can one succeed while the other fails
(the dual-write problem)? Does a slow dependency trip a breaker and stay in its own resource pool, or
does it exhaust the shared thread/connection pool and take everything down?

This skill works in two lenses:

1. **Conformance** (Phase 2) — which patterns are present, marked **Implemented / Partial / Missing /
   N/A** with `file:line`.
2. **Fit / decision** (Phase 3) — for each pattern, **Adopt now / Adopt when [trigger] / Defer
   (premature)** given the codebase's actual stage and pains. The most valuable output is often
   *"don't build this yet"* — the audit is as much a guard against over-engineering as a gap report.

> **Read-only.** This skill assesses and recommends; it does not change code. For the *runtime*
> resilience knobs on individual calls (per-call timeouts, retry backoff+jitter, idempotency keys,
> cancellation), defer to **`audit-resilience`** — this skill checks whether the *patterns* exist and
> whether they *fit*, not per-call tuning, and explicitly avoids duplicating it.

---

## Core principle — start simple, earn every pattern

Each pattern solves a *specific* problem and carries a *specific* cost. The 2026 consensus is
**modular-monolith-first**: >90% of systems are well served by a well-structured monolith, and
**premature decomposition is the #1 failure mode**. A pattern is only "Missing" if the codebase has
the **measurable trigger** that justifies it — otherwise adopting it is *over-engineering*, which this
audit flags just as loudly as a real gap.

- **Fit beats presence.** "No service mesh / no CQRS" is a finding *only* when a trigger is present.
  Never recommend a pattern the stage doesn't warrant.
- **Decide per interaction, not per system.** Sync vs. event-driven is chosen for *each* call that
  crosses a boundary, not adopted wholesale (see references/patterns.md → Communication style).
- **Distributed monolith is worse than a monolith.** Services that share a database and must deploy
  together pay the distributed tax with none of the independence — call it out explicitly.
- **Reversible steps.** Prefer changes that keep boundaries adjustable (modular monolith, façade,
  outbox) over irreversible bets (premature service split, event-sourcing everywhere).

---

## Phase 0 — Detect topology (gates every later finding)

Architecture advice is only correct in context. Flagging "no service mesh" on a Next.js + Supabase
app is noise; missing it on a 40-service Kubernetes fleet is critical. **Classify the repo first**,
then apply only the patterns that fit. Never report a pattern as "Missing" if its topology tier is
`N/A`.

```bash
# Deploy target / runtime
rg -n --hidden -g '!node_modules' -l "vercel\.json|netlify\.toml|next\.config|supabase/config" # serverless/PaaS
fd -H -t f 'Dockerfile|docker-compose\.ya?ml|Containerfile'                                     # containers
fd -H -t d 'k8s|kustomize|charts|helm' ; rg -n "apiVersion:\s*(apps|networking)" -g '*.{yaml,yml}' -l # kubernetes
# Service count / boundaries
fd -H -t f 'package.json|go.mod|pyproject.toml|pom.xml|Cargo.toml' | rg -v node_modules         # count deployable units
# Messaging / eventing
rg -n "kafka|rabbitmq|amqp|nats|sqs|sns|pubsub|kinesis|redpanda|temporal|inngest|trigger\.dev" -l
# Inter-service transport
rg -n "grpc|@grpc|protobuf|\.proto|graphql|apollo|federation|trpc" -l
# Mesh / gateway infra
rg -n "istio|linkerd|consul|envoy|kong|apisig|traefik|nginx-ingress|api-?gateway|ztunnel|waypoint" -l
```

Record a **topology profile** and pick the tier:

| Tier | Signals | Patterns in scope |
|---|---|---|
| **T1 — Serverless / modular monolith** | single deployable, Next/Supabase/edge fns, no broker | Gateway concerns (as middleware), BFF-lite, circuit breaker, idempotency/outbox-lite, hexagonal, strangler, tracing/SLO, contract tests |
| **T2 — Containers, few services** | Dockerfiles, 2–10 services, maybe a broker | + real gateway, BFF-per-client, bulkhead, outbox+relay, saga, backpressure, ACL, mTLS |
| **T3 — Kubernetes / microservices / event-driven** | k8s manifests, broker, gRPC/federation, 10+ services | + sidecar/service mesh (ambient), CQRS/event-sourcing, cell-based, full saga orchestration, CDC |

If there are **no** backend services (static site / pure frontend), stop and report reduced
applicability — hand any API-client concerns to `audit-fe-api`.

---

## Phase 1 — Research current patterns

Follow `/research`: confirm current-year conventions and the *installed* libraries for the detected
stack (gateway/proxy, breaker/bulkhead libs, outbox/CDC tooling, saga/workflow engines, mesh mode).
Anchor recommendations to versions actually in the manifest — never propose a library the repo can't
run.

---

## Phase 2 — Architecture maturity matrix

For **each in-scope pattern**, mark `Implemented / Partial / Missing / N/A` with `file:line`, a
one-line "why it matters", and the fix-delegate. **Detailed detection commands, "good vs. red-flag"
signals, and fix targets for every pattern are in [references/patterns.md](references/patterns.md)** —
load it and work through the applicable rows.

| # | Pattern | Tier | This audit checks (structural) | Fix via |
|---|---|---|---|---|
| 1 | **API gateway** | T1+ | Auth, rate-limit, CORS, transform, logging, monitoring, caching enforced in **one** edge layer, not per-route copy-paste | `backend-patterns`, `audit-security` |
| 2 | **BFF / API composition** | T1+ | Per-client shaping vs. one general API; over/under-fetch; who owns aggregation; federation at 5+ teams | `backend-patterns`, `design-api` |
| 3 | **Circuit breaker** | T1+ | A breaker exists around downstream calls (presence/architecture only) | `audit-resilience` → `backend-patterns` |
| 4 | **Bulkhead** | T2+ | Per-dependency resource pools; one slow dep can't exhaust shared pool | `backend-patterns` |
| 5 | **Backpressure / load shedding** | T2+ | Queue-based load leveling, bounded queues, shed/429 under overload | `backend-patterns` |
| 6 | **Outbox + relay/CDC** | T1+ | Dual-write closed: state + event commit atomically; relay (poll/Debezium) publishes | `backend-patterns` |
| 7 | **Saga** | T2+ | Multi-service workflows use local txns + **compensation**; saga-pivot ordering; orchestration vs choreography | `backend-patterns` |
| 8 | **CQRS + event sourcing** | T3 (selective) | Applied only where read/write loads diverge; immutable event log + materialized views | `backend-patterns`, `audit-db-schema` |
| 9 | **Hexagonal / ports-and-adapters** | T1+ | Domain logic isolated from framework/IO behind ports; adapters swappable; testable without infra | `workflow-refactor`, `backend-patterns` |
| 10 | **Anti-corruption layer** | T2+ | 3rd-party/legacy models translated at the boundary, not leaked into the domain | `backend-patterns` |
| 11 | **Strangler-fig migration** | any (if legacy) | Incremental replacement behind a façade vs. big-bang rewrite | `workflow-refactor` |
| 12 | **Sidecar / service mesh** | T3 | mTLS, retries, L7 policy via mesh; prefer **ambient/sidecarless** for net-new; not hand-rolled per service | `backend-patterns`, `audit-security` |
| 13 | **Cell-based architecture** | T3 (scale) | Blast-radius isolation, shared-nothing cells, cell-scoped routing/identity | `backend-patterns` |
| 14 | **Zero-trust / mTLS / service identity** | T2+ | Service-to-service auth, no implicit trust inside the network | `audit-security` |
| 15 | **Distributed tracing + SLOs** | T1+ | OpenTelemetry trace/correlation IDs across hops; RED/USE metrics; SLOs/error budgets | `backend-observability` |
| 16 | **Contract testing** | T2+ | Consumer-driven contracts (Pact/OpenAPI) between clients↔BFF and service↔service | `test-unit`, `audit-fe-api` |

### Communication & data-flow choices (decide per interaction, not per system)

These are *selection* decisions, not "missing features" — the answer depends on each interaction and
the stage. Detection + trade-offs in references/patterns.md.

| # | Pattern | Tier | This audit checks | Fix via |
|---|---|---|---|---|
| 17 | **Communication style** (sync request/response vs async event-driven) | T1+ | Each cross-boundary call fits the interaction: sync for "need the answer now / strong consistency / query"; async for "multiple reactors / independent scaling / background". Symptom to flag: one request making 5 blocking downstream calls | `backend-patterns` |
| 18 | **Cache-aside** | T1+ | Hot read-heavy paths (product/profile/config) check cache→DB-on-miss with a TTL/invalidation story; no stale-forever or thundering-herd | `backend-patterns`, `backend-db-performance` |
| 19 | **Database-per-service / data ownership** | T2+ (owned schemas at T1) | Each service/module owns its data; no cross-service table reads. **Anti-pattern:** shared DB + coupled deploys = distributed monolith | `backend-patterns`, `audit-db-schema` |

Rules:
- **Evidence or it didn't happen** — every verdict cites `file:line` or "searched, none found".
- **N/A is a first-class verdict** — record *why* (topology tier), don't silently drop a row.
- **Don't double-count** `audit-resilience`'s per-call concerns; link to it instead.

---

## Phase 3 — Decide: fit, not just presence

A pattern being "Missing" is only actionable if the codebase has the **trigger** that justifies it.
For every candidate pattern, classify it into one of three buckets from the detected symptoms:

- **Adopt now** — a real, present pain maps to this pattern (evidence: `file:line` + the symptom).
- **Adopt when [trigger]** — not yet, but name the concrete signal that should flip it on.
- **Defer (premature)** — no trigger present; adopting now is over-engineering. Say so plainly.

### Maturity ladder (climb only when the rung's trigger fires)

| Stage | Shape | Add these when the trigger appears |
|---|---|---|
| **0. Modular monolith** | one deploy, clean module boundaries, owned schemas | this is the correct default for most systems |
| **1. Fast & reliable monolith** | + **cache-aside** (read latency/DB load), **outbox** (dual-write), sync request/response with timeouts + a breaker | reads are hot / an event must not be lost |
| **2. Decoupled** | + **async event-driven** for side effects, **BFF** per client, **CQRS** on the *one* read/write-divergent area | a request fans out to many blocking calls; reads & writes scale differently |
| **3. Distributed** | + **database-per-service**, **saga** for multi-step transactions, **backpressure** | a module needs independent deploy/scale; a workflow spans services |
| **4. Fleet** | + **service mesh** (ambient), **cell-based**, full orchestration | 10+ services, ~50+ engineers, blast-radius/residency needs |

### Symptom → pattern (the decision table)

| Observed symptom | Likely pattern | Not this (yet) |
|---|---|---|
| Repeated 100ms DB hits on hot read paths | **cache-aside** | CQRS, read replicas |
| DB write + broker publish as two steps | **outbox (+CDC)** | 2PC, event sourcing |
| One request makes 5 blocking downstream calls | **async event-driven** for non-critical hops | full EDA rewrite |
| Reads and writes scale/optimize very differently | **CQRS** on that slice | event sourcing everywhere |
| Multi-step transaction across services can half-complete | **saga + compensation** | distributed 2PC |
| Modernizing a legacy system with risk | **strangler-fig** behind a façade | big-bang rewrite |
| Two teams blocked on one deploy cadence | **database-per-service** split | service-per-noun |
| Services share tables and deploy together | **fix the distributed monolith** (own schemas first) | more services |

**Over-engineering guardrails (flag these as findings too):**
- CQRS / event sourcing where reads and writes don't actually diverge → remove complexity.
- Microservices / mesh / cell-based below the size + differential-scaling threshold → stay modular monolith.
- Wholesale event-driven for simple two-party interactions → a single durable queue (or a sync call) is enough.
- A split that produces a distributed monolith (shared DB, coupled deploys) → worse than the monolith.

---

## Phase 4 — Prioritized report + decision (read-only)

```markdown
## Backend Architecture Audit — [repo] — [date]
**Topology:** [tier + evidence: N services · broker? · k8s? · transport]
**Stage on the ladder:** [0–4]  ·  **In scope:** [patterns]  ·  **N/A (out of tier):** [list + why]

### Adopt now (present pain → pattern, with evidence)
| Pattern | Symptom (file:line) | Payoff | Fix via |
|---|---|---|---|
| Cache-aside | product page: 100ms DB read per request, no cache (api/products.ts:40) | ~10ms cached reads, DB load ↓ | backend-patterns |

### Adopt when (named trigger, not yet)
| Pattern | Trigger to watch for |
|---|---|
| Database-per-service | orders + billing need independent deploy cadence / separate teams |

### Defer — would be over-engineering now
| Pattern | Why premature |
|---|---|
| CQRS / event sourcing | reads and writes don't diverge; a repository is simpler |
| Service mesh / cell-based | single modular deploy; no 10+-service fleet |

### Critical (data loss / cascading outage / silent inconsistency)
| Gap | Pattern | file:line | Why it bites in prod | Fix via |
|---|---|---|---|---|
| Payment writes DB then publishes to Kafka separately | Outbox (#6) | orders/service.ts:88 | Dual-write: crash between = paid order, no fulfillment event | backend-patterns |
| No breaker/bulkhead around payment provider | #3/#4 | ... | One slow provider exhausts the pool → whole API 503s | audit-resilience/backend-patterns |

### High / Medium (maturity matrix)
| Pattern | Implemented | Partial | Missing | N/A | Fix via |
|---|---|---|---|---|---|
| API gateway | ... | ... | ... | | backend-patterns |
| BFF / composition | ... | ... | ... | | design-api |
| Hexagonal | ... | ... | ... | | workflow-refactor |

### Lift-to-production roadmap (ordered)
1. Close dual-write with Outbox (+ idempotent consumers) → backend-patterns
2. Breaker + bulkhead on every external dependency → audit-resilience → backend-patterns
3. Centralize gateway concerns (auth/rate-limit/CORS/logging) → backend-patterns / audit-security
4. Distributed tracing + SLOs before scaling → backend-observability
5. [T3] Adopt ambient mesh for mTLS/L7 instead of hand-rolled retries → backend-patterns
```

**Forbidden:** declaring "production-grade" from passing tests alone; flagging T3-only patterns
(mesh, cell-based, CQRS) against a T1 monolith; re-auditing per-call timeouts/retries that
`audit-resilience` owns; recommending a saga without compensation logic; recommending CQRS/event
sourcing where read and write loads don't actually diverge; **recommending any pattern without naming
its trigger** (fit before presence — a "Missing" with no trigger is over-engineering, not a gap);
recommending a service split that yields a **distributed monolith** (shared DB + coupled deploys).

---

## Related

- `audit-resilience` — per-call runtime resilience (timeouts, retry+backoff+jitter, idempotency keys, cancellation, PII); this audit defers those to it
- `backend-patterns` — implement the architecture: gateway, BFF, outbox, saga, bulkhead, hexagonal (see its `references/architecture-patterns.md`)
- `design-api` — API contract, versioning, error shapes, pagination
- `audit-security` — auth, CORS, rate-limit-as-abuse-control, mTLS/zero-trust, injection
- `backend-observability` — tracing, correlation IDs, RED/USE metrics, SLOs, PII redaction
- `audit-db-schema` — the data-model side of CQRS / event sourcing / outbox tables / db-per-service
- `backend-db-performance` — cache-aside, query optimization, read replicas for hot paths
- `workflow-refactor` — hexagonal restructure and strangler-fig migration; modular-monolith boundaries
- `complete-everything` — close the audited gaps to done with verification
