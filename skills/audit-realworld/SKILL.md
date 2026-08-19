---
name: audit-realworld
description: >
  Audit a full-stack app against the RealWorld ("Conduit") reference — its formal API
  spec, shared Bruno/Hurl E2E suite, and closest-stack reference implementation — to find
  what is. Use when "audit against realworld", "compare my app to realworld", "conduit
  conformance", "is my full-stack app complete", "full-stack gap.
license: MIT
---

# audit-realworld — Full-Stack Gap Audit vs the RealWorld Reference

**Degree of freedom: MIXED** — Mode, parity, and routing `[HIGH freedom]`;
Phase 4 contract-suite run `[LOW freedom — run exactly]` when a server or
suite exists.

Read-only. Findings and a prioritized gap report only — no code changes.
Remediation goes to the skill named per finding.

RealWorld ("Conduit") is an objectively testable full-stack benchmark: formal
API spec, shared E2E suite, shared CSS theme, hosted API at
`api.realworld.show`.

> **The RealWorld API spec and its E2E suite are the source of truth — not any
> single community implementation.** Reference repos vary; the spec and the
> passing suite do not.

> **RealWorld is a demo spec, not a production bar.** It omits rate limiting,
> observability, caching, CI/CD, secrets, and deployment. Report *feature/
> pattern parity*, then delegate hardening to `audit-security`,
> `plan-security-audit`, `plan-perf-audit`, `plan-rls-audit`, and
> `full-stack-ship-discipline`.

## How to reason — Observe → Interpret → Classify → Severity

1. **Observe** — quote the spec contract (or pattern) and the repo's `file:line` (or suite result)
2. **Interpret** — does this layer implement the contract, or only the UI/route?
3. **Classify** — Implemented / Partial / Missing / Diverges — or Bow-out if the repo is not a web CRUD+auth app
4. **Severity** — core Conduit / authz / list-contract gaps = High; production-omitted concerns are routed, not scored as RealWorld misses

## Worked example

> **Observe:** Conformance mode. `GET /api/articles` returns `{ articles }`
> with no `articlesCount` and no `limit`/`offset` (`app/api/articles/route.ts`).
> Bruno list request fails the count assertion. Auth header is `Token <jwt>`.
> **Interpret:** the list contract is partial; clients cannot paginate. Auth
> scheme matches the spec.
> **Classify:** Partial (pagination / `articlesCount`); auth Implemented.
> **Severity:** High — feed is a core Conduit surface.
> **Finding:** Article list | no pagination / articlesCount | High | complete-everything

---

## Phase 0 — Detect the stack and gate applicability  [HIGH freedom]

Read the dependency manifest and source before comparing anything (reuse the
`audit-fe-api` detection approach).

### 0a. Classify the stack

- **Frontend:** framework (React/Next/Vue/Nuxt/Svelte/Angular/Solid), router,
  state/data layer (TanStack Query, SWR, RTK, Pinia), HTTP client.
- **Backend:** framework (Express/Hono/Fastify/Nitro/NestJS/Django/Rails/Go/
  Laravel/Spring), routing style, auth mechanism.
- **Data layer:** database + ORM/query builder (Prisma/Drizzle/TypeORM/Sequelize/
  SQLAlchemy/ActiveRecord/Supabase), migration tool.
- **Tests:** unit runner, and any API/E2E harness (Bruno, Hurl, Postman/Newman,
  Playwright, Cypress).

### 0b. Applicability gate

Decide the mode — state which one and why, out loud:

| Condition | Mode |
|---|---|
| Repo is a RealWorld/Conduit build (articles, profiles, favorites/follow, tags, JWT `Token` scheme) | **Conformance** |
| Web full-stack CRUD app with auth + owned resources, but a different domain | **Benchmark** |
| Not a web app, no HTTP API, no auth/resources (CLI, library, static site, pure ML) | **Bow out** |

**If you bow out, say so plainly** and recommend the fitting skills instead
(`audit-security`, `audit-performance`, `plan-perf-audit`, `audit-code-quality`,
`audit-fe-api`). Do not force a RealWorld comparison onto a repo it does not fit.

### 0c. Record the discovery

```
STACK: FE=<...> · BE=<...> · DB/ORM=<...> · tests=<...>
MODE: Conformance | Benchmark | Bow-out (reason)
RealWorld reference chosen: <stack impl> (spec-compliant? maintained?)
```

---

## Phase 1 — Pull the reference (current)  [HIGH freedom]

### 1a. Spec + test suite (source of truth)

- API spec and shared E2E suite live in the `realworld-apps/realworld` repo
  (`specs/`, Bruno `.bru`, Hurl `.hurl`) with a Postman collection for endpoint
  testing. The hosted API at `api.realworld.show` needs no keys.
- Fetch the current spec and note the exact endpoint/response/error contracts
  (summarized in Phase 2). Prefer the live spec over memory in case it has
  evolved.

### 1b. Closest-stack reference implementation

- Find the nearest implementation on `codebase.show/projects/realworld`, filter
  by the detected FE/BE stack. **Prefer spec-compliant, recently maintained
  implementations** (only a subset are verified spec-compliant at any time).
- Treat the reference as a *pattern* yardstick (folder structure, auth wiring,
  validation, error mapping) — not as gospel. When the reference and the spec
  disagree, the spec wins.

### 1c. Research current best practices

Follow the `/research` protocol for the detected stack (Context7 for library
docs; Firecrawl for current patterns, dated to now). Anchor recommendations to
the versions actually installed in the repo.

---

## Phase 2 — Parity / pattern matrix  [HIGH freedom]

### Conformance mode — audit against the RealWorld contract

Enumerate the spec surface and mark each **Implemented / Partial / Missing /
Diverges**, with `file:line` evidence:

**Auth & users**
- `POST /api/users` (register), `POST /api/users/login`
- `GET /api/user`, `PUT /api/user` (current user)
- Auth header scheme: `Authorization: Token <jwt>` (not `Bearer`)

**Profiles**
- `GET /api/profiles/:username`
- `POST` / `DELETE /api/profiles/:username/follow`

**Articles**
- `GET /api/articles` (filters: `tag`, `author`, `favorited`, `limit`, `offset`)
- `GET /api/articles/feed` (auth, followed authors)
- `GET` / `POST` / `PUT` / `DELETE /api/articles/:slug`
- `POST` / `DELETE /api/articles/:slug/favorite`

**Comments & tags**
- `GET` / `POST /api/articles/:slug/comments`, `DELETE .../comments/:id`
- `GET /api/tags`

**Cross-cutting contracts**
- Response envelopes: `{ user }`, `{ profile }`, `{ article }`,
  `{ articles, articlesCount }`, `{ comment(s) }`, `{ tags }`
- Validation errors: `422` with `{ "errors": { "body": [ ... ] } }`
- Auth failures: `401`; missing resources: `404`
- Pagination: `limit` / `offset`, with `articlesCount` for lists
- Slug generation, `favoritesCount`, `following`/`favorited` booleans reflect
  the requesting user

### Benchmark mode — map the patterns onto the repo's own domain

The repo isn't Conduit, so audit whether it exhibits the same *production-
relevant patterns* RealWorld demonstrates, for its own resources:

| Pattern | What to check in this repo |
|---|---|
| Auth flow | Register/login/current-user; token issue + attach + refresh; protected routes |
| Owned resources + authz | CRUD on user-owned entities; ownership enforced server-side, not just UI |
| List semantics | Pagination, filtering, total counts, empty states |
| Relations | Follow/favorite-style join semantics done correctly (no N+1, correct counts) |
| Consistent envelopes | Uniform response + error shape across endpoints |
| Validation | Server-side validation with structured field errors |
| Contract tests | An API/E2E suite that proves the contract, not just unit tests |

---

## Phase 3 — Full-stack coverage sweep  [HIGH freedom]

Audit all three layers, not just whichever is easiest to read:

- **Frontend:** routes for each resource; auth flow (login/register/logout,
  token persistence, guarded routes); data layer (caching, error/loading/empty
  states); forms with validation and server-error surfacing.
- **Backend:** every spec/pattern endpoint present; auth middleware; input
  validation; consistent error mapping; pagination; correct status codes.
- **Data layer:** schema covers the entities and relations; migrations exist and
  are current; indexes on foreign keys and hot query paths; constraints
  (unique, not-null, FK) enforce integrity. Verify live via Supabase MCP when
  applicable.
- **Tests:** unit coverage on core logic, plus the RealWorld contract suite (or
  the repo's equivalent E2E harness).
- **Build/config:** app builds; env contract documented (names only).

---

## Phase 4 — Live conformance test (optional but decisive)  [LOW freedom — run exactly]

If a server is running or the E2E suite is present, run the objective proof:

- Run the RealWorld Bruno collection (`bru run`), the Hurl files
  (`hurl --test`), or the Postman collection (`newman run`) against the local
  API base URL. Report pass/fail per endpoint.
- If no server is available, state exactly how to run it (base URL, seed/demo
  credentials) rather than guessing conformance from code alone.

A passing contract suite is stronger evidence than any static reading. Save any
run artifacts under `.playwright-mcp/` if using playwright-cli.

---

## Phase 5 — Production layering (the honest part)  [HIGH freedom]

RealWorld parity is necessary breadth, not sufficient depth. Enumerate what
RealWorld does **not** cover and route each to the right skill — do not imply
parity means production-ready:

| Concern RealWorld omits | Route to |
|---|---|
| AuthN/AuthZ hardening, secrets, injection, OWASP | `audit-security`, `plan-security-audit` |
| Row-level security / access control (Supabase) | `plan-rls-audit` |
| Performance, Core Web Vitals, query cost | `plan-perf-audit`, `audit-performance`, `backend-db-performance` |
| FE↔BE contract drift and runtime errors | `audit-fe-api`, `debug-fe-be-integration` |
| Rate limiting, observability, error handling | `backend-observability`, `backend-error-handling` |
| Deploy + migration/edge-function verification | `full-stack-ship-discipline`, `deploy-verify` |

---

## Phase 6 — Report (read-only)  [HIGH freedom]

```markdown
## RealWorld Full-Stack Audit — [repo] — [date]

**Mode:** Conformance | Benchmark
**Stack:** FE [..] · BE [..] · DB/ORM [..] · tests [..]
**Reference:** [closest-stack impl] (spec-compliant: yes/no)
**Live contract suite:** ran (N/M passed) | not run — [how to run]

### Implemented correctly
- [feature/pattern] — [file:line]

### Partial (works but incomplete or diverges)
| Feature/Pattern | Gap | file:line | Severity | Fix via |
|---|---|---|---|---|
| Article feed | No pagination / articlesCount | ... | High | complete-everything |

### Missing
| Feature/Pattern | file:line (where it should live) | Severity | Fix via |
|---|---|---|---|
| DELETE comment authz | ... | High | workflow-fix-and-ship |

### Diverges from spec (Conformance mode)
| Endpoint | Spec says | Repo does | file:line |
|---|---|---|---|
| Auth header | `Token <jwt>` | `Bearer <jwt>` | ... |

### Production gaps (NOT covered by RealWorld — separate hardening)
- Security → `audit-security` · Perf → `plan-perf-audit` · RLS → `plan-rls-audit` · ...

### Recommended order
1. [Critical conformance/parity gaps] → complete-everything / workflow-fix-and-ship
2. [Production hardening] → audit-security → plan-perf-audit → ...
```

**Forbidden:** claiming production-readiness from RealWorld parity alone;
inventing conformance without running or precisely describing the contract test;
silently skipping a layer (FE, BE, or DB).

---

## Self-critique before reporting  [LOW freedom — do not skip]

1. **Evidenced** — `file:line` or suite pass/fail, not "looks like Conduit"
2. **Mode honest** — Bow-out if no HTTP API + auth + owned resources; do not force a comparison
3. **Suite honesty** — ran N/M or stated exactly how to run; never invent conformance
4. **All three layers** — FE, BE, and data; skipping one is a failed audit
5. **Not production-ready** — RealWorld parity is never a security / perf / RLS pass
6. **Nothing changed** until approved

## Related

- `audit-fe-api` — FE↔BE contract detail once endpoints are inventoried
- `debug-fe-be-integration` — reactive debugging of contract mismatches
- `audit-security` / `plan-security-audit` — the security depth RealWorld omits
- `plan-rls-audit` — Supabase access control
- `plan-perf-audit` / `audit-performance` — the performance depth RealWorld omits
- `test-unit` / `test-playwright` — write the coverage this audit finds missing
- `complete-everything` — close the parity + hardening gaps to done
- `workflow-fix-and-ship` — fix a single missing endpoint/feature and ship it
- `full-stack-ship-discipline` (rule) — migrations/functions must actually deploy
