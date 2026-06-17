# Output Templates

## Surface inventory checklist

| Surface | Route / entry | Sub-screens / states | Mobile | Dark | Audited |
|---------|---------------|----------------------|--------|------|---------|
| Example | `/settings` | tabs, empty, error | ✓ | ✓ | ☐ |

Include: modals, drawers, sheets, popovers, tooltips, toasts, tabs, accordions, auth, onboarding, skeleton/loading/error/403/404.

## Burndown table

| Surface | Violation | Category | Severity (P0–P3) | Effort (S/M/L) | Risk (Low/Med/High) | Canonical fix | File path(s) |
|---------|-----------|----------|----------------|-----------------|---------------------|---------------|--------------|

**Severity:** P0 = broken/inaccessible/brand-breaking · P3 = cosmetic  
**Risk:** flags fixes that touch working behavior  
**Quantify** where possible (e.g. "37 hardcoded colors across 12 files")

## Phase 0 — IA summary (per major area)

```markdown
### [Area name]
- **User goal:** …
- **Primary task / key action:** …
- **IA map:** primary / secondary / tertiary content
- **Relationships:** group together · progressive disclosure · noise
- **Current anti-pattern:** (e.g. flat vertical stack, left-align, no hierarchy)
- **Proposed layout direction:** columns/cards/whitespace — using **real content** from code
```

## Design-system spec (short)

```markdown
### Canonical source
- Tokens: [paths]
- Theme: [tailwind.config / globals.css / tokens.ts]
- Primitives: [component paths]
- Lint / STYLEGUIDE: [paths]

### Gaps (enhance, don't replace)
- Missing semantic tokens: …
- Weak scales: elevation / type / spacing: …

### Competing systems
| System | Where used | Status (canonical / legacy) | Collision points |
```

## Phased roadmap

```markdown
### Phase A — Quick wins (reviewable, revertible)
- …

### Phase B — Structural (token migration, primitive consolidation proposals)
- …

### Phase C — Polish (high-traffic layouts from Phase 0 IA)
- …
```

## Guardrails checklist

- [ ] ESLint / Stylelint token rules
- [ ] No raw hex rule
- [ ] Visual regression snapshots
- [ ] PR checklist items
