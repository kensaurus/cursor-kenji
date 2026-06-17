# Output Templates

## Taxonomy counts (output #2)

```markdown
| Type | Confirmed | Potential | Review required |
|------|-----------|-----------|-----------------|
| dead-btn | … | … | … |
| stub | … | … | … |
| fake | … | … | … |
| unwired-data | … | … | … |
| dead-link | … | … | … |
| orphan | … | … | … |
| severed | … | … | … |
```

## Per-surface inventory checklist

| Surface | dead-btn | stub | fake | unwired | dead-link | orphan | severed | Audited |
|---------|----------|------|------|---------|-----------|--------|---------|---------|

## Burndown table

| Surface | Element | Type | Classification | Intended target | Wiring gap | Severity | Effort | Risk | File:line |
|---------|---------|------|----------------|-----------------|------------|----------|--------|------|-----------|

**Severity:** P0 = looks functional but does nothing / silent data loss / swallowed errors · P3 = cosmetic placeholder behind flag  
**Intended target:** backend / Supabase / Sentry / pipeline / none  
**Quantify:** e.g. "12 dead buttons, 7 mock-data components, 3 missing RLS policies"

## Linkage map (output #5)

```markdown
### [Surface / feature]
- UI element: …
- Intended: Supabase `public.orders` SELECT via RLS
- Gap: no RLS policy for anon; fetch uses hardcoded mock
- Sentry: errors swallowed in empty catch at …
```

## Phased wiring plan

```markdown
### Phase 1 — Silent-failure P0s
Dead controls, swallowed errors, missing RLS

### Phase 2 — Mock → live data
Replace fixtures with real queries/mutations

### Phase 3 — Orphan cleanup (proposals only)
Unused exports with dependency check

### Phase 4 — Instrumentation gaps
Sentry, analytics, loading/error/empty states
```

## Guardrails checklist

- [ ] Lint: empty handlers, `href="#"`, `not implemented`
- [ ] CI: orphaned exports, mock-data imports in prod paths
- [ ] PR checklist: "no dead controls shipped"
- [ ] Typed Supabase client + generated types
- [ ] RLS test with non-owner user
