---
name: audit-auth-flows
description: >
  Read-only audit of app-layer auth — route×gate matrix, session lifecycle,
  OAuth, and provider traps (getSession vs getUser, middleware-as-only-gate,
  CVE-2025-29927). Use when "audit our auth", "check middleware protection".
  RLS → plan-rls-audit. OWASP checklist → audit-security.
license: MIT
---

# audit-auth-flows — Middleware is edge routing, not a security boundary

Read-only. Map the auth surface and prove, route by route, that identity is
verified where it matters. Then stop. Hand fixes to a follow-up session.

**2026 consensus (official, post CVE-2025-29927):** Next.js middleware
runs before cache and routing. Vercel: *"We do not recommend Middleware
to be the sole method of protecting routes in your application."* An
audit that only reads `middleware.ts` and declares the app safe has
missed the point. Defense in depth: edge + route handler / server action
+ data layer. Each layer covers a different part of the request path.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **audit-auth-flows** (this) | Session lifecycle, route×gate matrix, OAuth, provider traps |
| `audit-security` | OWASP checklist (injection, headers, deps) — may fix inline |
| `plan-security-audit` | Plan-only hardening burndown |
| `plan-rls-audit` | Data-layer who-can-read-which-rows |
| `plan-secrets-audit` | Where `service_role` / keys live |
| `plan-privacy-compliance` | Consent / policy vs collection — not session gates |
| `backend-patterns` | Building the middleware / guard fixes after this audit |

---

## Phase 0 — Detect the auth stack

Identify: provider (Supabase Auth / NextAuth / Clerk / Auth0 / custom),
framework protection (Next.js middleware + `matcher`, route guards,
server-action checks), session transport (cookie vs `localStorage` vs
`Authorization` header), token model (JWT vs server session). Enumerate
pages, API routes, server actions, edge functions, admin areas. Record
the pinned framework version — auth CVEs are version-gated.

---

## Phase 1 — Route × gate coverage matrix (the centerpiece)

Every protected route / action, one row:

| route/action | intended access | gate that protects it | verified server-side? | data-layer backstop? |

Hunt the gaps this exposes:

- **Matcher holes** — `config.matcher` misses a protected path. API
  routes and server actions often bypass page middleware — each needs
  its own check.
- **Layout-only protection** — a layout/wrapper is a client-side
  illusion. It does not gate data fetches or direct API/action calls.
- **Middleware-as-only-gate** — the CVE-2025-29927 class. Any route
  where middleware is the *sole* authorization layer is a finding
  **regardless of framework version or host**. Patching the CVE is not
  defense in depth.
- **Server action exposure** — Next.js server actions are POST
  endpoints callable directly. Each mutating action must check identity
  itself.
- **Unlisted routes** — grep the router; do not trust the matcher list.

---

## Phase 2 — Provider and framework traps

**Supabase (check first on this stack):**

- `getSession()` used for a **server-side authorization** decision →
  **critical**. Official JS docs: cookie/storage values *may not be
  authentic*; `getSession()` is strongly advised against for
  authorization. `getUser()` performs a network request to the Auth
  server and *can* be used to base authorization rules. Grep
  `getSession(` in server code; treat each hit as a finding until
  proven client-side-only. Newer SSR guides also use `getClaims()` to
  *refresh* cookies — that is not a substitute for verifying identity
  at the handler.
- Service-role key on any client-exposed path → `plan-secrets-audit`.
  RLS assumed but not enforcing → `plan-rls-audit` (data-layer
  backstop; this skill is the app layer above it).
- `autoRefreshToken` disabled without manual refresh; JWT expiry
  absurdly short (<300s) hammering refresh.

**Next.js CVE-2025-29927** (GHSA-f82v-jwr5-mffw, critical): bypass
authorization if the check occurs only in middleware, via the internal
`x-middleware-subrequest` header. **Patched:** 12.3.5 / 13.5.9 /
14.2.25 / 15.2.3. **Impacted:** self-hosted `next start` and
`output: 'standalone'`. Vercel-hosted apps were incidentally
protected; Netlify and Cloudflare Workers were not affected. Workaround
if unpatched: drop `x-middleware-subrequest` before it hits Next.
If below the fix → P0 *and* a defense-in-depth finding. Also sweep
later Next.js auth CVEs (do not treat 29927 as the only one).

**General rule:** any "the framework enforces auth at the edge"
assumption is a finding, whatever the framework.

**NextAuth / Clerk / Auth0** — session strategy (JWT vs database),
callback / redirect validation, and whether `auth()` / session checks
actually run server-side per protected operation.

---

## Phase 3 — Session lifecycle

**Cookies** — `HttpOnly`, `Secure`, `SameSite` (Lax min, Strict for
sensitive); scoped path/domain; not readable by JS. Token in
`localStorage` is XSS-exfiltratable — flag it; CSRF-vs-XSS must be a
deliberate choice.

**Logout that actually logs out** — a stateless JWT stays valid until
expiry if logout only clears the client. Confirm server-side
invalidation (Supabase `signOut` revokes the refresh token). Probe it
(Phase 5). Official sessions FAQ: access tokens can still be presented
after sign-out unless the app also checks revocation / uses
`getUser()`.

**Rotation & timeouts** — rotate on privilege change (login, role
elevation) to kill fixation; idle timeout and absolute-max lifetime
both present. 2026 norm: short access tokens, longer **rotated**
refresh tokens with reuse detection, capped absolute session.

**Refresh-token rotation + reuse detection** — official Supabase
sessions docs: a refresh token is single-use, with two exceptions
(default **10s reuse interval** — do not widen; parent-token retry for
lost responses). Outside those exceptions the **whole session family
is revoked**. Disabling that in Advanced Settings is "generally not
recommended" — flag if widened or disabled.

---

## Phase 4 — Credentials, OAuth, authorization

**OAuth / OIDC** — `state` (CSRF on the callback), PKCE for public
clients, redirect-URI allowlist exact-match, provider `email_verified`
checked before trust, account-linking collisions handled.

**Credential flows** — reset tokens single-use + expiring + not leaked
in URL/referrer; **user enumeration** via differing error text or
timing on login/reset/signup; rate limiting on auth endpoints
specifically; MFA state cannot be skipped mid-flow.

**Authorization above the data layer** — not just "is logged in" but
"is allowed"; IDOR on API params (`/api/orders/:id` scoped to caller?);
admin routes gated by role server-side. Name which layer each control
lives in. `plan-rls-audit` owns the data-layer half.

---

## Phase 5 — Live probes (non-prod only)

Force the failures rather than only reading code:

- Hit each protected route / API / action **unauthenticated** → expect
  deny (not a redirect that still returns data).
- Replay a **logged-out** session token → expect reject.
- Tamper the session cookie / swap another user's identifier → reject.
- IDOR: as user A, request user B's object by id → deny.
- If Next.js is version-vulnerable or self-hosted: send
  `x-middleware-subrequest` and confirm WAF/edge *and* a route-handler
  check still stop it.
- User-enumeration: compare wrong-password vs nonexistent-user
  (text + timing).

Do not run these against production. Do not write exploit PoCs into
the repo.

---

## Definition of Done

- [ ] Auth stack + framework version recorded
- [ ] Route×gate matrix complete for every protected route / API / action
- [ ] Matcher holes, layout-only, middleware-as-sole-gate, unprotected server actions surfaced
- [ ] `getSession()`-for-authz grepped; `getUser()` confirmed on every server gate
- [ ] CVE-2025-29927 (and later auth CVEs) checked against the pinned version
- [ ] Cookie flags, localStorage exposure, CSRF pairing assessed
- [ ] Server-side logout invalidation confirmed by probe; rotation + idle/absolute timeouts present
- [ ] Refresh reuse interval not widened; family revocation not disabled
- [ ] OAuth state / PKCE / redirect-allowlist / email_verified checked
- [ ] User-enumeration, reset tokens, auth-endpoint rate limits, MFA-skip checked
- [ ] App-layer authorization (roles, IDOR, admin) split from the RLS half
- [ ] Live probes run non-prod; each logged pass/fail
- [ ] Read-only — findings presented, not patched

## Output format

1. **Route × gate matrix** — the table, gaps highlighted
2. **Findings** — issue | layer (edge/route/data) | severity (critical = unauth access / auth bypass) | file:line or probe | fix shape
3. **Provider-trap list** — exact call to change (`getSession` → `getUser`, etc.)
4. **Probe log** — probe | expected | actual | evidence
5. **Fix plan** — auth-bypass and getSession-authz first, then session lifecycle, then enumeration/OAuth. Handoffs: `plan-rls-audit`, `plan-secrets-audit`, `plan-security-audit`, `backend-patterns`. Present and stop.
