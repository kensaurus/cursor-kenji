---
name: plan-llm-cost-guardrails
description: >
  Audit an LLM-powered app for runaway-cost and quota-abuse exposure, then produce a phased
  guardrail plan. Use when the user says "cap my AI costs", "my LLM bill could blow up",
  "rate limit my AI", "token budget", "drain my API quota", "runaway agent loop",
  "per-user AI limits", or is hardening LLM features before launch. Cost scales with
  tokens not request count — RPM limits miss the real risk. Audits 3-layer pattern: token-
  bucket limits, cost-velocity circuit breakers, fallback chain (cheaper model → cache → 503),
  plus Langfuse cost alerts and streaming usage accounting. Cross-hands prompt-injection
  and forged-webhook quota fraud to plan-input-validation. Plan only until approved. Pairs
  with audit-langfuse-llm, plan-input-validation. Do NOT use for output evals (audit-langfuse-llm).
license: MIT
---

# LLM Cost-Guardrail Audit + Remediation Plan

**Role:** Senior platform engineer (LLM spend + abuse resistance).

**Task:** Inventory every LLM call site, test against the 3-layer guardrail model,
score unbounded paths, phase remediations, emit `plan-llm-cost-guardrails.md`.
**Audit & plan only — no limits or routing changes until approved.**

**Find every path to a runaway bill. Cap it. Change nothing until approved.**

Token cost scales with **input + output tokens**, not request count — a single
50K-token context replayed three times can exhaust a budget while staying under any
RPM cap. Vibe-coded AI features ship with no spend cap, no per-user quota, no
`max_tokens`, no circuit breaker — compounded by prompt-injection cost amplification
and forged-webhook quota fraud (CVE-2026-41432 class).

This is the *prevention* counterpart to Langfuse observability: Langfuse tells you
what spend *happened*; this audits what's *capped*.

---

## When this fires

Trigger phrases: *"cap my AI costs"*, *"my LLM bill could explode"*, *"rate limit
my AI"*, *"token budget"*, *"someone could drain my quota"*, *"runaway agent
loop"*, *"per-user AI limits"*, *"pre-launch cost hardening"*.

Do **not** fire for: output quality/evals (`audit-langfuse-llm`), generic API
performance, or trace visibility (`plan-error-handling`). This owns *bounded spend*.

---

## The audit — 3-layer guardrail model

### Layer 1 · Limits (token-aware, not request-count)
- **Token-bucket / quota per (user, model)** — any per-identity limit?
- **Token-based, not just RPM** — prompt-TPM and output-TPM ceilings.
- **`max_tokens` / context caps** — bound worst-case cost; truncate RAG context.
- **Short + long windows** — per-minute burst *and* per-day/month budget.
- **Tiered limits** — free vs paid wired to Stripe entitlement.

### Layer 2 · Circuit breakers
- **Cost-velocity breaker** — spend/min threshold.
- **Loop / repeat detection** — retry-storms, growing-context loops.
- **Daily-spend kill switch** — hard cap backstop.
- **Error-rate breaker** — mostly-failing caller identity.

### Layer 3 · Fallback chain
- **Primary → cheaper model → cache → graceful 503.**
- **Semantic cache** before paid calls.
- **Model routing by complexity** — flag everything-to-Opus patterns.

### Cross-cutting
- **Streaming usage accounting** — `stream_options.include_usage` or spend is invisible.
- **Retry discipline** — token-aware backoff.
- **Abuse vectors** — unauthenticated AI endpoints; hand boundary fixes to
  `plan-input-validation`.
- **Langfuse cost alerts** — 50/75/90% thresholds; per-user attribution.

---

## Procedure

1. **Inventory LLM call sites** and public AI endpoints.
2. **Test each against Layers 1–3.**
3. **Score** = worst-case spend × reachability.
4. **Phase** — Layer 1 caps and daily kill switch first.
5. **Emit `plan-llm-cost-guardrails.md`. End the turn.**

---

## Guardrails

- **Plan only.** No limits, gateway config, or routing changes.
- **Spend cap is non-negotiable for launch** — flag absence as at least High.
- **Token-aware or it doesn't count** — don't credit RPM-only limits.
- **Bounded blast radius**, not zero runaways.
- **Cross-hand abuse** to `plan-input-validation`.

---

## Report template — `plan-llm-cost-guardrails.md`

```markdown
# LLM Cost-Guardrail Audit — <repo>

_Audit-only. No limits or routing change until each phase is approved._

## Scope
- LLM call sites: n  | Public AI endpoints: n  | Langfuse present: ☐

## Verdict
| Layer | Present? | Worst gap |
|-------|----------|-----------|
| 1 Limits (token-aware) | partial | unbounded max_tokens |
| 2 Circuit breakers     | ❌ | no daily kill switch |
| 3 Fallback chain       | ❌ | limit = hard error |

## Findings
| # | Call site | Unbounded path | Worst-case | Missing layer | Sev | Direction |
|---|-----------|----------------|------------|---------------|-----|-----------|

## Phased burndown
- **Phase 1 — Caps & kill switch** → `backend-patterns`
- **Phase 2 — Circuit breakers** → `backend-patterns`
- **Phase 3 — Fallback chain** → `backend-patterns`
- **Phase 4 — Visibility** → `audit-langfuse-llm` / `backend-observability`
- **Cross-hand** → `plan-input-validation`

## Execution handoff
Simulate a runaway in test env after Phase 1; confirm cap holds before bill moves.
```

---

## Chains with

- **Observability & spend loop** — pairs with `plan-error-handling` (visibility) and
  `audit-langfuse-llm` (quality); this owns *bounded spend*.
- **Execution:** `backend-patterns`, `audit-langfuse-llm`, `backend-observability`.
- **Verify:** sandbox load/abuse test — caps, breakers, fallback trip before spend escapes.

> Plan with a strong model; execute with `composer-2.5-execution.mdc`.
