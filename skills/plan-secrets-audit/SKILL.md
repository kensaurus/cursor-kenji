---
name: plan-secrets-audit
description: >
  Audit a codebase and git history for exposed credentials and mis-scoped keys, then
  produce a phased rotation-and-remediation plan. Use when the user says "check for
  hardcoded secrets", "are my API keys exposed", "did I commit a key", "secret scan",
  "is my .env safe", "rotate keys", or is hardening before launch or open-sourcing.
  Vibe-coded apps ship keys in client bundles; secrets committed once live in git history
  forever — ROTATE, not just relocate. Scans sk_/pk_/whsec_/service_role, separates
  safe-client (anon, publishable) from never-client (service_role, secret), flags history
  needing rotation, checks NEXT_PUBLIC_ exposure and Vercel/AWS env config. Plan only
  until approved. Pairs with plan-rls-audit. Do NOT use for RLS logic or input validation.
license: MIT
---

# Secrets & Key-Scope Audit + Rotation Plan

**Role:** Senior security engineer (credential exposure + key scoping).

**Task:** Scan working tree and git history, classify each credential (rotate vs
relocate), score by scope and permanence, emit `plan-secrets-audit.md`. **Audit & plan
only — no rotation, scrubbing, or env edits until each phase is approved.**

**Find every leaked key. Decide rotate vs relocate. Change nothing until approved.**

Moltbook's breach started with a hardcoded Supabase key in client JavaScript — combined
with RLS off, the public key became an admin backdoor. **A secret committed even once
lives in git history forever.** Moving it to `.env` later does nothing; the only real
fix is **rotation**.

---

## When this fires

Trigger phrases: *"scan for secrets"*, *"are my keys exposed"*, *"did I commit an
API key"*, *"is my .env safe"*, *"rotate keys"*, *"about to open-source this"*,
*"pre-launch secret check"*.

Do **not** fire for: RLS policy correctness (`plan-rls-audit`), input/webhook
validation (`plan-input-validation`). This skill owns *credential exposure and
key scoping* specifically.

---

## Why a dedicated skill

A grep finds strings. This skill adds the two judgments a grep can't: **scope**
(is this key *supposed* to be client-side?) and **permanence** (is it in history,
making relocation insufficient?).

---

## The audit

### A · Pattern scan (working tree)
Search outside `.env*` and server-only contexts for:
- Prefixes: `sk_`, `pk_`, `whsec_`, `service_role`, `eyJ...`, `AKIA`, `API_KEY`,
  `SECRET`, `TOKEN`, long random blobs.
- Supabase: anon vs `service_role`.
- Any key in files that ship to the browser.

### B · Scope classification
- **Safe client-side:** Supabase **anon**, Stripe **publishable** (`pk_`), public
  analytics keys — note the protector dependency (RLS, Stripe design).
- **Never client-side (Critical if exposed):** **service_role**, Stripe **secret**
  (`sk_`), **webhook secret** (`whsec_`), AWS secrets, DB URLs.
- **`NEXT_PUBLIC_` / `VITE_` / `EXPO_PUBLIC_` trap** — bundled into client.

### C · Git history (rotate vs relocate)
- Ever in committed history → **rotate** (relocation is theater).
- Scrubbing (filter-repo/BFG) is secondary — rotation first.

### D · Deployment env config (Vercel / AWS)
- Secrets in platform env store, not baked into build.
- `.env.example` not committed with real values.
- No secrets as build args (persist in image layers).

### E · `.gitignore` & hygiene
- `.env*` ignored; no secrets in README, comments, test fixtures.

---

## Procedure

1. **Scan** working tree (A), classify scope (B).
2. **Check history** for every credential (C).
3. **Review deploy + hygiene** (D, E).
4. **Score.** Never-client in client bundle or history = Critical.
5. **Phase.** **Emit `plan-secrets-audit.md`. End the turn.**

---

## Guardrails

- **Plan only.** No rotation, history rewriting, or env edits.
- **Never print the secret.** Type + location + last 4 chars at most.
- **Rotate beats relocate — always say which.**
- **Don't assume safe-client keys are fine.** Hand anon-key + no-RLS to
  `plan-rls-audit`.
- **Order:** rotate → update env store → redeploy → (optional) scrub history.

---

## Report template — `plan-secrets-audit.md`

```markdown
# Secrets & Key-Scope Audit — <repo>

_Audit-only. No key is rotated, moved, or scrubbed until each phase is approved._

## Scope
- Scanned: working tree ☐  git history ☐  deploy env (Vercel/AWS) ☐
- Assumptions / not inspected: …

## Verdict
| Severity | Count | Worst case |
|----------|-------|-----------|
| Critical | n | never-client secret exposed / in history |
| High     | n | committed .env values, public-prefix leak |
| Medium   | n | shared-env keys, hygiene |

## Findings
| # | Key type | Location | Scope bucket | In history? | Action | Sev |
|---|----------|----------|--------------|-------------|--------|-----|
| S1 | Supabase service_role | lib/admin.ts:4 | never-client | YES | ROTATE now | Crit |
| S2 | Stripe secret sk_ | api/pay.ts:2 | never-client | YES | ROTATE now | Crit |
| S3 | Supabase anon | client.ts:6 | safe-client | n/a | OK if RLS holds → plan-rls-audit | — |
| S4 | DB URL | .env.example | never-client | YES | ROTATE + remove from example | High |

## Phased burndown
- **Phase 1 — Rotate exposed never-client secrets** → dashboard rotation + Vercel/AWS env update (grace window)
- **Phase 2 — Relocate clean secrets** → move to env store, fix NEXT_PUBLIC_ leaks
- **Phase 3 — Hygiene** → .gitignore, remove committed examples, CI secret scanner
- **Phase 4 — (optional) Scrub history** → filter-repo/BFG, after rotation

## Execution handoff
Approve a phase to run it. Cross-hand safe-client keys to `plan-rls-audit`.
Add a pre-commit secret scanner (`create-hook`) so this can't regress.
```

---

## Chains with

- **Security spine** — credentials layer (**this skill**); cross-hand to
  `plan-rls-audit` for anon-key safety.
- **`create-hook`** — pre-commit secret-scanning hook as regression guard.
- **Execution:** provider dashboards, Vercel/AWS env, `audit-security`.
- **Verify:** re-scan working tree + history; confirm rotated keys are dead.

> Plan with a strong model; execute with `composer-2.5-execution.mdc` riding
> along. Rotation is irreversible-ish — the plan says *which* keys; the rule
> constrains *how* and *in what order*.
