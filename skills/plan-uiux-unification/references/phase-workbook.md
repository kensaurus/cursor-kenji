# Phase Workbook (detailed)

## Phase 0 — Context & IA FIRST

For each major area, from actual code:

- User goal, primary task, key action on the screen
- IA map: content, grouping, importance (primary/secondary/tertiary), first-scan priority
- Content relationships: belongs together, progressive disclosure, noise
- **Only then** propose layout. **Hierarchy drives layout, not the reverse.**
- Name anti-patterns explicitly: everything stacked vertically + left-aligned with no hierarchy/grouping → core finding
- Propose layouts (columns, cards, whitespace, alignment, emphasis) using **real content** from the repo

## Phase 1 — Design-system ground truth

- Read canonical tokens: color, spacing, radius, elevation, type scale, z-index
- Theme config: Tailwind / CSS vars / `tokens.ts` / platform theme
- Component primitives, `CONTRIBUTING` / `STYLEGUIDE` / lint rules
- Critique: incomplete vs inconsistent vs weak — **enhance** (missing semantic tokens) vs **enforce**
- Multiple competing systems → canonical vs legacy/deprecated + collision map
- Output short **design-system spec** (current + proposed enhancements)

## Phase 2 — Full surface inventory

Enumerate every surface; mark audited only after review:

- All routes/screens + nested sub-screens/flows
- Modals, dialogs, drawers, bottom sheets, popovers, tooltips, toasts, action sheets
- Side panels, tabs, accordions, expandable sections
- Empty / loading / skeleton / error / not-found / permission states
- Auth, onboarding, settings sub-screens
- Responsive breakpoints (mobile sizes, orientation, safe areas) + dark/light per surface

**Discovery commands (adapt to stack):**

```
Glob: **/app/**/page.{tsx,jsx,vue,svelte}
Glob: **/routes/**/*.{tsx,jsx}
Glob: **/screens/**/*.{tsx,jsx}
Grep: "Modal|Dialog|Drawer|Sheet|Popover|Toast" glob "*.{tsx,jsx,vue}"
```

## Phase 3 — Per-surface audit categories

Log violations per surface:

| Category | Examples |
|----------|----------|
| IA & hierarchy | flat stacks, left-align, missing grouping, no primary action, poor scan path |
| Tokens | hardcoded hex/px, off-scale spacing, non-token colors, ad-hoc shadows/radii |
| Typography | family/size/weight/line-height off scale |
| Layout/spacing | grid/container widths, padding rhythm, alignment, safe areas |
| Content & tone | jargon, dev-speak, inconsistent voice; rewrites preserve meaning |
| AI-generic look | centered hero, 3 equal cards, indigo gradients, emoji bullets, no POV |
| Components | one-off reimplementations, divergent variants, duplicates |
| Interaction/states | hover/focus/active/pressed/disabled, loading/error/empty, gestures |
| Accessibility | contrast, focus order, ARIA, keyboard/SR, alt text, touch targets (WCAG 2.2) |
| Conflicting/deprecated | competing systems, deprecated components/APIs/deps |
| Tech debt | dead code, `!important`, inline escapes, copy-paste drift, TODO/HACK |

Optional live pass: read `protocol-browser-anti-stall` + `playwright-session-coordination` before browser MCP.

## Phase 4 — Burndown

See `output-templates.md`. Group by severity; quantify; include risk column.

## Phase 5 — Unification & enhancement plan

- Target DS: consolidate conflicts, deprecate loser + migration path, additions for Phase 1 gaps
- High-traffic screens: layouts from Phase 0 IA + real content + grouping rationale
- Content/voice guideline: tone, reading level, error/empty/CTA phrasing, jargon→plain glossary
- Token migration / codemod: value-for-value, no visual change unless intended
- Primitive consolidation as **proposals** with dependency checks
- Regression guardrails: lint, token lint, visual regression, PR checklist
- Phased roadmap: quick wins → structural → polish; each phase independently reviewable + revertible

## Phase 6 — Best-practice research (current year)

Use Firecrawl / web research; cite findings; note where this app diverges:

- Design-system governance + token architecture (layered/semantic, W3C DTCG)
- IA + visual hierarchy
- UX writing / plain language
- Avoiding generic "AI-generated" aesthetic
- Accessibility (WCAG 2.2)
