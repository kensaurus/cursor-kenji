---
name: plan-error-handling
description: >
  Audit a codebase for silent failures, swallowed exceptions, and observability gaps
  across Sentry (errors) and Langfuse (LLM traces), then produce a phased fix plan. Use
  when the user says "errors arent showing in Sentry", "things fail silently", "empty
  catch blocks", "is my error handling good", "I cant tell when something breaks",
  "add error handling", "check my Langfuse tracing", or is hardening observability
  before launch. AI code has ~2x the error-handling gaps of human code. Also audits LLM
  observability: untraced model calls, missing cost/latency capture, no eval scores,
  prompts not version-linked in Langfuse. Plan only until each phase is approved. Pairs
  with backend-observability, debug-sentry-monitor, audit-langfuse-llm. Do NOT use for a
  live incident (debug-error) or security (plan-rls-audit).
license: MIT
---

# Error-Handling & Observability Audit + Fix Plan

**Role:** Senior reliability engineer + observability specialist.

**Task:** Map every silent-failure path across Sentry and Langfuse planes, score by
blast radius × invisibility, phase remediations, emit `plan-error-handling.md`.
**Audit & plan only — no code or SDK edits until each phase is approved.**

**Find what fails in silence. Make it observable. Change nothing until approved.**

AI coding agents optimize for *making the error message go away*, not for making
failure visible. **Error-handling gaps are nearly twice as common in AI-generated
pull requests** as in human ones — empty `catch` blocks, missing guards, unhandled
promise rejections, and handlers that leak stack traces into capture systems. The
dangerous part isn't the crash you see; it's the failure you *don't*.

This skill is the **audit-and-plan** half. Execution goes to `backend-observability` /
`audit-langfuse-llm` after you approve each phase.

---

## When this fires

Trigger phrases: *"errors don't reach Sentry"*, *"it fails silently"*, *"empty
catch blocks"*, *"add error handling"*, *"why can't I debug prod"*, *"check my
Langfuse traces"*, *"my LLM costs are a mystery"*, *"pre-launch observability"*.

Do **not** fire for: a specific firing incident (`debug-error`,
`debug-sentry-monitor`), or security gaps (`plan-rls-audit`,
`plan-security-audit`). This is the *coverage* audit, not incident response.

---

## Why a dedicated skill

`plan-stub-checker` finds *fake* functionality (dead buttons). This finds *real*
functionality that *fails invisibly*. Different failure mode: *"if this breaks in
production tonight, would you ever know?"*

---

## Plane 1 · Application errors (Sentry)

Walk every error path:

- **Swallowing catches** — `catch (e) {}`, `catch { return null }`,
  `catch (e) { console.log(e) }` with no rethrow and no Sentry capture.
- **Unreported catches** — handlers that *log* but never call
  `Sentry.captureException`. Local console ≠ production visibility.
- **Missing guards** — absent null checks, array-bounds validation, optional
  chaining gaps that throw at runtime on the unhappy path.
- **Async holes** — unhandled promise rejections, `await` without try/catch on
  fallible calls, floating promises, missing `.catch()` on fire-and-forget.
- **PII / secret leakage into events** — raw request bodies, tokens, emails,
  stack traces with internal paths captured into Sentry. Recommend
  `beforeSend` scrubbing.
- **Coverage holes** — is Sentry initialized on every surface (web, edge
  functions, RN/Capacitor, server actions)? Source maps uploaded?
- **User-facing vs internal split** — sanitized user message vs raw stack in UI?

## Plane 2 · LLM observability (Langfuse)

For any AI/LLM feature:

- **Untraced calls** — model/tool/retrieval calls with no `@observe` /
  Langfuse generation wrapping them.
- **Missing cost & token capture** — generations logged without usage/model
  params.
- **No eval scores** — faithfulness/relevance aren't on by default; you wire
  your own judges. Flag features shipping with zero quality signal.
- **Prompts not version-linked** — prompts inline in code instead of managed/
  versioned and linked to traces.
- **Sessions/users not propagated** — multi-turn flows without session/user
  attributes.
- **PII in traces** — confirm SDK-layer redaction before traces leave the env.
- **Sampling blind spots** — if sampling <100%, note which edge cases may be
  missed.

> Langfuse was acquired by ClickHouse (Jan 2026); if the user self-hosts, flag
> validating hosting/licensing — a note, not a code finding.

## Cross-plane

- **Error ↔ trace correlation** — can a Sentry error tie back to its Langfuse
  trace (shared request/trace id)?
- **Structured logging** — JSON + correlation ids vs `console.log` soup?

---

## Procedure

1. **Inventory surfaces.** Which planes exist (Sentry? Langfuse? both?). Skip absent
   planes. State assumptions.
2. **Sweep.** Collect findings with `path:line`. For each: *"If this fails in prod,
   what's the signal?"* — None / Console-only / Sentry / Langfuse.
3. **Score.** Severity = blast radius × invisibility.
4. **Phase** into shippable groups mapped to execution skills.
5. **Emit `plan-error-handling.md`. End the turn. Do not edit code.**

---

## Guardrails

- **Plan only.** No wrapping, no try/catch insertion, no SDK config edits.
- **Don't add noise.** Flag genuinely-silent real failures; don't recommend
  Sentry-spamming every validation miss.
- **Swallowing ≠ handling.** Intentional graceful degradation is fine *if*
  reported; blind swallowing is not.
- **Redaction is not optional.** PII/secret reaching Sentry or Langfuse = High
  minimum.
- **Observability ≠ prevention.** Pair with `plan-test-coverage`.
- **Minimal quoting** of source.

---

## Report template — `plan-error-handling.md`

```markdown
# Error-Handling & Observability Audit — <repo>

_Audit-only. Nothing changes until each phase is approved._

## Scope
- Planes: [ ] Sentry  [ ] Langfuse  | Surfaces: web / edge / RN / server actions
- Assumptions / not inspected: …

## Verdict
| Plane | Silent failures | PII leaks | Coverage holes |
|-------|-----------------|-----------|----------------|
| Sentry   | n | n | n |
| Langfuse | n | n | n |

## Findings — application errors (Sentry)
| # | path:line | Pattern | Signal today | Sev | Direction |
|---|-----------|---------|--------------|-----|-----------|
| E1 | api/pay.ts:88 | empty catch on charge | none | Crit | report + rethrow, surface to user |

## Findings — LLM observability (Langfuse)
| # | path:line | Gap | Sev | Direction |
|---|-----------|-----|-----|-----------|
| L1 | lib/ai.ts:40 | model call untraced | High | wrap with observe, capture usage |

## Phased burndown
- **Phase 1 — Stop silent failures** → `backend-observability` — E-tier swallows
- **Phase 2 — Close coverage holes** → `backend-observability` — init gaps, maps
- **Phase 3 — Redact PII** → `backend-observability` — beforeSend / SDK redaction
- **Phase 4 — LLM tracing & evals** → `audit-langfuse-llm` — L-tier items

## Execution handoff
Approve a phase to run it. Re-run after to confirm failures are now observable.
```

---

## Chains with

- **Security spine** — observability layer (`plan-error-handling`); complements
  `plan-test-coverage` (tests prevent; observability reveals).
- **Execution:** `backend-observability`, `audit-langfuse-llm`,
  `debug-sentry-monitor`.
- **Verify:** trigger a controlled failure post-fix; confirm Sentry/Langfuse capture.

> Plan with a strong model; execute with `composer-2.5-execution.mdc` riding
> along. The plan says *what* is invisible; the rule constrains *how* it's wired.
