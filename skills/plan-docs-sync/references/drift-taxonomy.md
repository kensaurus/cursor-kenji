# Drift Taxonomy & Methodology

## Types

| Type | Definition |
|------|------------|
| **stale** | Doc describes old behavior (renamed params, changed defaults, moved files) |
| **missing** | Shipped feature/flag/endpoint/env with no docs |
| **phantom** | Doc describes feature/route/option that no longer exists or never shipped |
| **contradictory** | Two docs disagree, or doc vs inline comment disagree |
| **onboarding-breaking** | Setup steps fail — wrong install cmd, env var mismatch, dead link, outdated version |
| **inline-rot** | Comments/docstrings lie; `@param`/`@returns` ≠ signature |
| **api-contract** | Documented request/response ≠ actual endpoint/schema |

## Detection passes

1. **Code-as-source-of-truth:** for each doc claim, find proving/disproving code. Cite both.
2. **Reverse pass (missing docs):** routes, exported APIs, env vars, CLI commands, flags, config keys → zero docs?
3. **Onboarding replay:** setup docs vs `package.json` scripts, `.env.example`, install/run, CLI `--help`.
4. **Onboarding-drift CI pattern:** correlate doc env/setup claims against live `.env.example` + `npm run … -- --help` output.
5. **Signature check:** JSDoc/docstring vs real function signature.
6. **Cross-doc consistency:** README vs CONTRIBUTING vs inline vs API docs.
7. **Link/asset check:** internal links, anchors, referenced files resolve.

## Discovery commands

```
Glob: **/*.md **/docs/**
Glob: **/.env.example
Read: package.json scripts
Shell: npm run <cli> -- --help  (when safe)
Grep: "@param|@returns" glob "*.{ts,tsx,js,py}"
Glob: **/openapi.* **/swagger.*
```

## Guardrails (research-backed)

- **Docs-as-code:** doc updates in same PR as behavior change
- PR checklist: "did behavior change? update doc in this PR"
- CI: correlate onboarding docs vs `.env.example` + CLI help
- Auto-generate API reference from OpenAPI/source where possible
- Hand-written = *why*; generated = *what*
- `llms.txt` for external AI-readable docs when applicable
