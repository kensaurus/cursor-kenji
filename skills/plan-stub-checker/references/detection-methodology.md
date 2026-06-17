# Detection Methodology

Run all six passes. **Trace before flagging** — conservative on deletion, aggressive on finding.

## 1. Entry-point trace

From routes / `main` / app root, trace reachable components + handlers.

```
Glob: **/app/**/page.{tsx,jsx}
Glob: **/routes/**/*.{tsx,jsx}
Glob: **/screens/**/*.{tsx,jsx}
Glob: **/navigation/**/*.{tsx,jsx}
```

Unreached exports/components = **orphan** candidates (not confirmed until pass 5).

## 2. Static analysis

Trace imports, calls, instantiations, references, exports.

- Never-called functions after export
- Code after unconditional `return`
- Impossible branches
- Unused exports (`grep` + import graph)

## 3. Handler-binding check

Every interactive element → does handler reach a real effect (network / state / nav)?

Empty, `console.log`, or mock-only → **stub** or **dead-btn**.

Optional Playwright pass: read `protocol-browser-anti-stall` + session coordination; click controls, confirm no network/nav effect.

## 4. Data-flow check

Every data-displaying component → trace source to query/fetch/prop chain.

Hardcoded/mock/fixture in prod path → **fake** or **unwired-data**.

```
Grep: "useQuery|useMutation|fetch\\(|axios\\.|supabase\\.from" glob "*.{tsx,jsx}"
```

## 5. Dynamic-invocation filter (false-positive pass)

Before confirming dead/orphan, rule out:

- Event handlers registered at runtime
- Callback props from parents
- String-based / reflection calls
- Feature-flag-gated code paths
- Registry / plugin / inheritance patterns

**Uncertain → `Review required`, not `Confirmed`.**

## 6. Config / env trace

```
Glob: **/.env.example **/env.{ts,js}
Grep: "createClient|@sentry|Sentry\\.init|analytics" glob "*.{ts,tsx}"
```

Confirm referenced integrations have client init + env wiring. Missing → **severed**.

## Backend / pipeline linkage

For each stub that *should* be live, map:

- Intended endpoint or server action — exists? contract? auth?
- Data pipeline hop (ingest → transform → store → read) — which hop is broken?
- Supabase table + RLS — use Supabase MCP `list_tables`, `pg_policies` when available
- Sentry — use Sentry MCP for production errors on related paths when available

Missing target → `[NEEDS REAL TARGET]` — never invent.
