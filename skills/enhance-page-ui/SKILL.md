---
name: enhance-page-ui
description: >
  Artistic, research-grounded UI enhancement skill for making an existing page feel
  intentional, spacious, and human-crafted. Use when the user asks to make a page
  nicer, more polished, more beautiful, more editorial, more premium, more artsy,
  less crowded, less AI-generated, better laid out, better balanced, or when they
  mention typography, visual hierarchy, progressive disclosure, empty/dead space,
  fades, scroll indicators, microinteractions, motion, hover states, cards, grids,
  density, or cosmetic UI polish. General across web repos. Focuses on content
  choreography, hierarchy, spacing, motion, and visual psychology; for task-flow
  usability/data correctness use enhance-page-ux first or alongside it.
---

# Enhance Page UI

Turn an existing screen into a composed interface: calmer hierarchy, smarter
content placement, expressive but purposeful motion, and artful transitions that
support comprehension. This is not a "add more chips/cards/shadows" skill. It
rearranges, subtracts, and stages information before adding decoration.

> If browser automation is used, first follow
> `~/.cursor/skills/protocol-browser-anti-stall/SKILL.md` when present.

---

## Critical Rules

> **Compose before decorating.** Fix hierarchy, grouping, alignment, and rhythm
> before adding gradients, motion, blur, masks, or shadows.

> **Replace clutter with structure.** Do not stack more badges, labels, cards,
> dividers, or helper text onto a crowded surface. Move secondary information
> to a quieter region, a footer band, a hover/focus reveal, a drawer, or a
> progressive disclosure layer.

> **Make hierarchy visible at a squint.** A user should know the focal element,
> supporting content, metadata, and actions before reading every word.

> **Motion must explain.** Animate only feedback, state change, spatial
> relationship, affordance, or attention. No looping sparkle unless it carries
> status or brand tone and respects reduced motion.

> **Use the local design system.** Reuse existing primitives, tokens, radius,
> spacing, typography, animation helpers, and dark/light surfaces. Extend a local
> primitive before inventing a one-off.

> **Never ship mock, dead, or rogue UI.** Enhancements must be wired to the
> product's real data contracts, backend/API state, database schema, or existing
> domain helpers. If the UI needs better visual feedback, first look for the real
> status, timestamp, count, owner, error, progress, permission, or lifecycle data
> that should drive it. If that data does not exist but is necessary for a robust
> user experience, propose or implement the smallest backend/schema/API extension
> instead of faking the state in the component.

> **Respect density by viewport.** Desktop can hold layered metadata. Tablet
> needs tighter grouping. Narrow screens need progressive disclosure and no
> wrapping CTAs.

---

## Workflow Checklist

Copy and track:

```
UI ENHANCE /<route-or-component>
- [ ] 1. RECON: route, component tree, data fields, tokens, primitives
- [ ] 2. CONTENT RANK: primary, secondary, metadata, actions, ambient
- [ ] 3. LIVE READ: 1440 / 1024 / 800 screenshots, console, scroll states
- [ ] 4. PAIN MAP: crowding, dead space, weak hierarchy, hard cuts, bland motion
- [ ] 5. COMPOSITION PLAN: move, group, pin, crop, reveal, fade, animate
- [ ] 6. IMPLEMENT: smallest diffs, no new visual language unless necessary
- [ ] 7. VERIFY: three viewports, reduced motion, dark/light if supported
- [ ] 8. WRITE-UP: before pain -> design principle -> after behavior
```

---

## Step 1 - Recon: Learn the Existing Visual System

Read the route/component in full. Then inspect:

- Layout primitives: `Card`, `Section`, `Drawer`, `Tabs`, `Badge`, `Button`,
  `Tooltip`, grid/list helpers.
- Styling system: Tailwind config, CSS variables, design tokens, theme context,
  animation utilities, existing radii/shadows.
- Data shape: all fields available, especially metadata currently shoved into
  titles or hidden in modals.
- Data source: API endpoints, loaders/actions, database schema, cache keys,
  backend status enums, validation errors, permissions, and lifecycle events that
  can make the UI's feedback real instead of decorative.
- Existing comments: search for "DO NOT", "avoid", "deprecated", "design",
  "layout", "spacing", "motion", "overflow".

Output a tiny component map:

```
<Page>
|-- Header          - title, context, primary action
|-- Body/Grid/List  - main content
|-- Detail/Drawer   - progressive disclosure
`-- Footer/Chrome   - metadata, controls, scroll status
```

---

## Step 2 - Content Rank Before Layout

Classify every visible element:

| Rank | Meaning | Default Treatment |
|------|---------|-------------------|
| Primary | What the page is about | largest scale, strongest contrast, best space |
| Secondary | Helps interpret primary | near primary, smaller, grouped |
| Metadata | Dates, counts, stats, status | pinned footer/rail/table column, not title stack |
| Actions | What user can do | close to target, stable hit area, no wrap |
| Ambient | Brand, mood, decorative signal | background, mask, low contrast, removable |

Rules:

- If everything is primary, nothing is primary.
- If metadata crowds the headline, move it to a bottom band, side rail, table
  column, tooltip, or detail drawer.
- If an action wraps, abbreviate progressively or icon+tooltip it.
- If a grid has dead space, adjust span, dense placement, aspect ratio, or
  content anchoring before adding more content.

---

## Step 3 - Live Read

Inspect the page at:

```
1440 x 900   desktop composition
1024 x 700   tablet / split-screen stress
800 x 700    narrow desktop / large mobile stress
```

For each viewport, note:

- First focal point.
- What feels crowded.
- What feels empty or unbalanced.
- Which labels wrap or truncate.
- Whether scroll edges are hard cuts or softly communicated.
- Whether hover/focus states explain interactivity.
- Console/runtime errors.

Use the squint test: mentally blur the screenshot. The page should still reveal
its main regions through scale, contrast, grouping, and whitespace.

---

## Step 4 - Composition Moves

Prefer these moves, in order:

1. **Subtract**: remove repeated hints, duplicate labels, low-value icons, noisy
   chrome, and "just in case" metadata.
2. **Group**: use proximity and common region to make related pieces read as one
   unit. Increase spacing between groups; decrease spacing inside groups.
3. **Pin**: move stats, code metadata, timestamps, or progress to a card footer,
   side rail, bottom band, sticky summary, or column.
4. **Stage**: reveal secondary content through hover, focus, tabs, accordions,
   drawers, details panels, or "show more" only when it helps.
5. **Rebalance**: change card spans, grid density, aspect ratio, order, or
   alignment so important items get room and empty space feels intentional.
6. **Soften**: replace hard clipping with fades, masks, scroll shadows, curtains,
   sticky gradients, or viewport-aware edge treatments.
7. **Animate**: add microinteractions only after the static composition works.

---

## Pattern Library

### Crowded Card

Before: title, subtitle, description, status, stats, tags, actions all top-stacked.

After:

- Top: eyebrow + title + one useful line.
- Middle: media or breathing room.
- Bottom: stats/metadata in a separated footer band.
- Action: stable corner, footer, or detail drawer CTA.

### Dead Grid Space

Try:

- `grid-auto-flow: dense` / masonry-like placement if supported by the stack.
- Resize spans by content importance, not by project age or arbitrary order.
- Use wide cards for rich horizontal screenshots; portrait/device galleries for
  mobile apps.
- Anchor content to top and metadata to bottom so empty space becomes rhythm.

### Hard Scroll Cut

Try:

- `mask-image: linear-gradient(...)` with `-webkit-mask-image`.
- Top/bottom "curtain" gradients matching the surface.
- Scroll shadows or slim progress rails.
- Extra padding so content is not permanently hidden under the fade.

### Flat Interaction

Try:

- 100-300ms ease-out feedback on direct actions.
- Slight lift/translate, underline draw, icon morph, or preview reveal.
- Motion that starts from the element the user acted on.
- Reduced-motion fallback that preserves state change without movement.

### Overexplained Page

Try:

- Keep only the highest-scent labels visible.
- Move explanation into tooltips, detail drawers, or empty-state education.
- Use progressive disclosure for advanced filters and rarely used controls.

---

## Visual Psychology Map

Use these as design justifications:

- **NN/g visual hierarchy**: use contrast, scale, and grouping to guide the eye.
- **NN/g heuristic #8**: maximize signal, minimize noise; clarity beats flourish.
- **Progressive disclosure**: defer secondary or advanced detail until needed.
- **Fitts's Law**: make important targets large, close, and stable.
- **Hick's Law**: reduce visible choices or stage them.
- **Proximity/Common Region**: group related elements with spacing or containers.
- **Aesthetic-usability effect**: polish can increase perceived trust, but only
  when the UI remains clear.
- **Change blindness**: subtle motion can confirm state changes users might miss.

---

## Motion Rules

- Direct feedback: 100-180ms.
- Small state change: 180-260ms.
- Drawer/modal/large spatial transition: 220-360ms.
- Prefer ease-out for entering/settling.
- Never animate layout so much that text being read moves unexpectedly.
- Avoid infinite motion except quiet status/progress.
- Always respect `prefers-reduced-motion` or the repo's motion abstraction.

Motion must answer at least one question:

- Did my action work?
- What changed?
- Where did this thing come from or go?
- What can I interact with?
- How far through this surface/process am I?

---

## Implementation Rules

1. Change layout and information placement before color/motion.
2. Keep edits local to the page and existing primitives.
3. Use existing design tokens. Do not invent new colors/radii/shadows unless the
   repo has no system.
4. Wire UI state to real backend/domain state. Do not add hardcoded counts,
   fake statuses, placeholder progress, decorative badges, or mock cards unless
   the user explicitly asks for a prototype.
5. When visual feedback needs data the frontend lacks, inspect the schema/API
   boundary and add the smallest durable field or derived helper needed.
6. Add comments only for non-obvious design intent.
7. Prefer CSS/Tailwind composition over bespoke JS. Use JS only for stateful
   scroll progress, measurement, or interaction state.
8. Avoid accessibility regressions: focus rings, keyboard access, color contrast,
   readable text, and reduced motion must survive.
9. If adding masks/fades, ensure content remains reachable and not permanently
   obscured at scroll boundaries.

---

## Enhancement Plan Template

```
## UI Enhancement Plan

Current state:
- [What the page visually does now]

Content rank:
- Primary:
- Secondary:
- Metadata:
- Actions:
- Ambient:

Planned changes:
| Pain | Principle | Move | File |
|------|-----------|------|------|
| Text is crowded at top | hierarchy, proximity | pin metadata to bottom band | ... |
| Footer cuts content | continuity | add scroll fade + padding | ... |
| Grid has dead space | balance | resize spans + dense placement | ... |

Verification:
- 1440:
- 1024:
- 800:
- Reduced motion:
- Dark/light:
```

---

## Quick Sanity Checks

- [ ] Primary content is obvious at a squint.
- [ ] Metadata does not compete with headings.
- [ ] At most 2-3 type scales dominate the page.
- [ ] Related elements are grouped by proximity or common region.
- [ ] Empty space feels intentional, not accidental.
- [ ] Secondary details are progressively disclosed.
- [ ] Scroll/overflow edges are communicated, not chopped.
- [ ] Microinteractions have a purpose and respect reduced motion.
- [ ] No CTA wraps or changes hit-area shape across viewports.
- [ ] Lints/build/tests pass for touched files.

---

## When Not To Use

- Pure workflow correctness, data modeling, or task usability: use
  `enhance-page-ux` first.
- Pure design-token compliance audit: use `audit-uiux-design-system`.
- Report-only heuristic audit: use `audit-ux`.
- Brand-new product/page from scratch: use `design-frontend`.

---

## Research Anchors

- NN/g visual hierarchy: contrast, scale, grouping, and whitespace guide focus.
- NN/g aesthetic/minimalist design: maximize high-value signal, minimize noise.
- NN/g animation guidance: motion should be brief, subtle, and communicative.
- MDN CSS masking: gradient `mask-image` can create soft edge fades.
