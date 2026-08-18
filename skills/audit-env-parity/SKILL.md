---
name: audit-env-parity
description: >
  Read-only audit of config/env parity across dev, staging, and prod — missing
  or misnamed vars, drifted flags, hardcoded values, secrets reused across
  environments. Use when "works locally but not in prod", "audit our
  environments", or "config drift". Local runnability → workflow-environment-ready.
license: MIT
---

# audit-env-parity — Environments that agree

Read-only. Find where environments disagree in ways that cause "works on my
machine", silent prod misbehavior, or leaked secrets.

**The classic outage:** a new env var added locally, referenced in code, never
set in prod — deploy is green, feature is broken.

> **Never print secret values.** Present the gap matrix; do not change host
> config until approved.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **audit-env-parity** (this) | Same keys exist (and mean the same) in every env |
| `workflow-environment-ready` | *Local* machine can build/test/reach services |
| `plan-secrets-audit` | Credential *exposure* in git / over-scoped keys |
| `plan-data-integrity` | Destructive ops; staging pointing at prod is shared |
| `workflow-feature-flag` | Flag rollout process, not "staging flag ≠ prod flag" |

Do **not** fire for "did I commit a key" → `plan-secrets-audit`.
Do **not** fire for "prove this laptop can run the suite" →
`workflow-environment-ready`.

---

## Phase 0 — Enumerate environments and sources

- Envs: local, preview/staging, prod
- Sources: `.env*`, `.env.example`, Vercel/Supabase/Fly dashboards, CI secrets,
  runtime config
- Demanded set: every `process.env.X` / `import.meta.env` / config object read

---

## Phase 1 — Parity and correctness

**Referenced-but-unset** — Code reads it; an env that runs that path lacks it.
P0 if prod-missing. Diff `.env.example` against real usage.

**Set-but-unreferenced** — Dead vars. Low severity; they hide real config.

**Naming drift** — `API_URL` vs `NEXT_PUBLIC_API_URL` vs `VITE_API_URL`.
Public prefixes shipping a *secret* → Critical; hand to `plan-secrets-audit`.

**Value drift that invalidates staging** — Flags, timeouts, model names that
make staging a different app than prod.

**Hardcoded-should-be-config** — URLs, regions, magic values in code. Prod
pointing at a dev resource (or reverse).

**Secret reuse** — Same secret across dev/staging/prod (a dev leak is prod).
Prod secrets reachable from a dev context.

**Service targeting** — Staging DB/bucket/queue must not be prod
(`plan-data-integrity` if a test would hit real data).

---

## Phase 2 — Three-way gap

Diff names only (never values) between code-demands × local-has × prod-has.
A name present in all three with unknown value mismatch is still a manual
review flag.

---

## Definition of Done

- [ ] Envs + sources enumerated
- [ ] Code-referenced keys extracted
- [ ] Every referenced key checked in every env that runs it
- [ ] `.env.example` drift flagged
- [ ] Naming + public-prefix leaks identified
- [ ] Flag/value drift + hardcoded config found
- [ ] Cross-env secret reuse + staging→prod services checked
- [ ] Three-way gap produced with **no secret values**
- [ ] Nothing changed without approval

## Output format

1. **Parity matrix** — key × env (present/absent/unknown) + demanded-by-code
2. **Findings** — missing/dead/misnamed/leaked-prefix/hardcoded/drift
3. **Secret handoff** — `plan-secrets-audit`
4. **Fix plan** — prod-missing first, then leaks, then drift

## Related

- `workflow-environment-ready` — local preflight
- `plan-secrets-audit` — exposure / rotation
- `plan-data-integrity` — staging hitting prod
- `plan-backup-dr` — reconstructability of config after loss
- `workflow-feature-flag` — rollout, not parity
