---
name: audit-backend-architecture
description: >-
  Read-only, topology-gated audit of backend/distributed-systems architecture patterns — so a
  Next.js/Supabase monolith and a Kubernetes fleet each see only relevant findings. Covers API
  gateway (auth, rate-limit, CORS, transform, logging, caching), BFF / API composition, circuit
  breaker, bulkhead, backpressure, outbox + CDC, saga (compensation + saga-pivot), CQRS / event
  sourcing, hexagonal / ports-and-adapters, anti-corruption layer, strangler-fig, sidecar / service
  mesh, cell-based, zero-trust/mTLS, distributed tracing + SLOs, and contract testing. Produces a
  per-pattern maturity matrix (Implemented/Partial/Missing/N-A) with file:line and the fix skill. Use
  when "audit backend architecture", "is my backend production-grade", "check
  gateway/BFF/outbox/circuit-breaker/bulkhead/hexagonal/saga", "microservices resilience review", or
  "audit-backend-architecture". Read-only — defers per-call resilience to audit-resilience and
  delegates fixes to backend-patterns.
license: MIT
---

# audit-backend-architecture — Distributed-Systems Pattern Maturity Audit

Agents ship the happy-path CRUD and call it done. What decides whether a backend survives scale is
the **architecture**: is there one place that enforces auth/rate-limit/CORS, or is it copy-pasted per
route? Does a payment write and its event commit atomically, or can one succeed while the other fails
(the dual-write problem)? Does a slow dependency trip a breaker and stay in its own resource pool, or
does it exhaust the shared thread/connection pool and take everything down? This audit inventories
those structural decisions and marks each **Implemented / Partial / Missing / N/A** with evidence.

> **Read-only.** This skill assesses architecture and hands each gap to the right fix skill. It does
> not change code. For the *runtime* resilience knobs on individual calls (per-call timeouts, retry
> backoff+jitter, idempotency keys, cancellation), defer to **`audit-resilience`** — this skill checks
> whether the *patterns* exist, not per-call tuning, and explicitly avoids duplicating it.

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

Rules:
- **Evidence or it didn't happen** — every verdict cites `file:line` or "searched, none found".
- **N/A is a first-class verdict** — record *why* (topology tier), don't silently drop a row.
- **Don't double-count** `audit-resilience`'s per-call concerns; link to it instead.

---

## Phase 3 — Prioritized report (read-only)

```markdown
## Backend Architecture Audit — [repo] — [date]
**Topology:** [tier + evidence: N services · broker? · k8s? · transport]
**In scope:** [patterns for this tier]  ·  **N/A (out of tier):** [list + why]

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
sourcing where read and write loads don't actually diverge (it adds complexity, not value).

---

## Related

- `audit-resilience` — per-call runtime resilience (timeouts, retry+backoff+jitter, idempotency keys, cancellation, PII); this audit defers those to it
- `backend-patterns` — implement the architecture: gateway, BFF, outbox, saga, bulkhead, hexagonal (see its `references/architecture-patterns.md`)
- `design-api` — API contract, versioning, error shapes, pagination
- `audit-security` — auth, CORS, rate-limit-as-abuse-control, mTLS/zero-trust, injection
- `backend-observability` — tracing, correlation IDs, RED/USE metrics, SLOs, PII redaction
- `audit-db-schema` — the data-model side of CQRS / event sourcing / outbox tables
- `workflow-refactor` — hexagonal restructure and strangler-fig migration
- `complete-everything` — close the audited gaps to done with verification
