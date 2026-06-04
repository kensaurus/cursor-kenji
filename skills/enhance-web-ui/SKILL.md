---
name: enhance-web-ui
description: >
  Artistic, research-grounded UI enhancement skill for making an existing page feel intentional, spacious, and human-crafted. Use when the user asks to make a page nicer, more polished, more premium, more editorial, less crowded, less AI-generated, better laid out or balanced, or mentions typography, visual hierarchy, spacing, empty/dead space, motion, hover states, cards, grids, or density — especially vague-but-visceral feedback ("clunky", "heavy", "incoherent", "wasted space", "feels AI-generated", "monochromatic", "everything stacked left"). Catches hard-to-spot failures: active-state mass mismatch, chrome tautology, card-on-card layering, brand-color competition, full-cell wash where a micro-indicator belongs, wrapper-collapsed tiles, conditional slots reserving space for absent content, and the same datum repeated 3× in one fold. General across web repos. Focuses on content choreography, hierarchy, spacing, and motion; for task-flow usability/data correctness use enhance-web-ux first or alongside it.
license: MIT
---

> ### Which enhance skill? (surface router)
>
> | Your surface | Use |
> |:-------------|:----|
> | **Web** product page / dashboard — composition, hierarchy, spacing, motion | `enhance-web-ui` |
> | **Web** product page — UX heuristics, flows, data wiring | `enhance-web-ux` |
> | **Web** landing / marketing / portfolio (greenfield, anti-slop) | `enhance-web-landing` |
> | **Web** existing site upgrade (audit-first, preserve behavior) | `enhance-web-redesign` |
> | **Web** 3D / WebGL / cinematic scroll on an existing site (audit-first) | `enhance-web-web3d` |
> | **React Native** screen (Expo / bare) | `mobile-rn-screen` |
> | **Capacitor / hybrid** shell (one web app shipped to iOS + Android) | `enhance-capacitor-ui` (axis architecture first) → then the web or rn skill |
> | Repo **README** showcase | `enhance-readme` |
>
> **You are here: `enhance-web-ui`.** Native iOS/Android (SwiftUI / Compose, no web layer) is out of scope for all of these — use Apple HIG / Material directly.

# Enhance Page UI

Turn an existing screen into a composed interface: calmer hierarchy, smarter
content placement, expressive but purposeful motion, and artful transitions that
support comprehension. This is not a "add more chips/cards/shadows" skill. It
rearranges, subtracts, and stages information before adding decoration.

> **Vague-but-visceral user feedback ("clunky", "atrocious", "wasted space",
> "incoherent height") almost always points to a `Hidden Failure Mode` from §X
> below — start there, not at the surface decoration the user named.**

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
> that should drive it. If that data does not exist but is necessary for a solid
> user experience, propose or implement the smallest backend/schema/API extension
> instead of faking the state in the component.

> **Respect density by viewport.** Desktop can hold layered metadata. Tablet
> needs tighter grouping. Narrow screens need progressive disclosure and no
> wrapping CTAs.

> **Tune saturation to product domain.** A consumer learning, kids, fitness,
> or gamified app needs a *vibrant, semantic* palette where each colour
> carries meaning (Duolingo: green=correct, red=hearts, orange=streak). A
> B2B/SaaS/finance dashboard needs *restrained* colour reserved for status
> only (NN/g 60–30–10, Stripe-style). Faint `/5–/10` tints on a playful
> consumer surface read as monochromatic and dead. Pick a saturation tier
> for the product first, then apply it consistently — see *Domain Colour
> Tier* below.

> **Audit conditional slots for dead-state.** Any optional region — `media`,
> `aside`, `eyebrow`, `footerSlot`, `cover`, `illustration`, `secondaryCTA`
> — must be tested with sparse / zero-state content. A slot that reserves
> `min-h: 160px` for a rich illustration becomes a giant empty card when
> the only content is "0%". Make the slot *conditional on content* (drop
> the wrapper when empty) or *collapse the floor* (`min-h-0` on mobile),
> never reserve space for absent content.

> **Scan for information duplication within one viewport.** The same number,
> word, date, or status appearing twice in the same fold means one of them
> is wasted ink. Eyebrow shows "0/10 today" + inline pill shows "0/10
> today" + footer bar shows "0/10 today" → keep the most actionable copy
> and delete the rest. Duplicates fragment attention (NN/g #8) and signal
> that the content rank in step 2 was skipped.

> **Patch the primitive, not the site.** If a layout/colour/wrap bug
> repeats, fix it where the wrapper, helper, or token lives — not at the
> consumer. A single `Tooltip` defaulting to `inline-flex` will silently
> shrink every `w-full` child across the app; one prop fix beats N
> per-page band-aids. See *Primitive-First Patch Rule* below.

> **Calm chrome before you decorate content.** Wayfinding chrome (header,
> breadcrumb, tabs, dock, toolbar) should *recede*, not announce itself —
> Linear's 2025 refresh names this "structure should be felt, not seen". If
> chrome competes with content for visual weight, it has too much paint:
> strip backgrounds → borders → tints → fills, in that order, until the
> chrome reads as a tonal recess that frames the content. The squint test
> applies to chrome too: at 10 px blur, the page content should dominate;
> the chrome should look like a quiet frame, not a stack of buttons.

> **One brand-color element per visual zone.** A page should have ONE
> brand/accent-tinted element per zone (header strip, breadcrumb row, tab
> row, dock, page body). If breadcrumb chips, tab badges, AND the actual
> primary CTA all use the brand color, the actual CTA loses scent — every
> brand-tinted thing claims primacy and the user's eye can't pick a target.
> Audit the brand budget per zone: count brand-tinted surfaces in the
> screenshot; if > 1 per zone (excluding the count badge / underline / status
> chip that *carries* meaning), demote the chrome ones to neutral
> typography. The brand color is a finite resource — spend it on the action
> the user is here to take.

> **Active ≠ heavier layout — active = different cue.** When an element
> moves to active state, its **layout dimensions must not change** (no
> taller, no wider, no extra padding). The active *signal* should come from
> a micro-cue: text-color shift + font-weight bump (`font-medium` →
> `font-semibold`), an underline, an icon-wrapping pill (Material 3
> NavigationBar pattern: 32×16 `bg-secondaryContainer` rounded-full pill
> wrapping the icon, NOT the whole cell), or a count-badge tint swap. Full
> background washes on active tabs/buttons/cells inflate *perceived weight*
> 50%+ even when the bounding box is identical; the user reads the active
> sibling as "weirdly big and clunky". Linear, Stripe Apps, Vercel, M3 all
> obey this — copy them.

---

## Workflow Checklist

Copy and track:

```
UI ENHANCE /<route-or-component>
- [ ] 0. DOMAIN: product class -> colour-tier + density-tier (see Domain Colour Tier)
- [ ] 1. RECON: route, component tree, data fields, tokens, primitives, wrappers
- [ ] 2. CONTENT RANK: primary, secondary, metadata, actions, ambient
- [ ] 3. LIVE READ: 1440 / 1024 / 800 screenshots + DOM rect measurements
- [ ] 4. PAIN MAP: crowding, dead space, weak hierarchy, dup info, wrapper collapse,
 conditional-slot zero-state, monochromatic surfaces, hard cuts, bland motion
- [ ] 5. COMPOSITION PLAN: move, group, pin, crop, reveal, fade, animate
- [ ] 6. IMPLEMENT: primitive-level fixes first, smallest site-level diffs after
- [ ] 7. VERIFY: three viewports + DOM uniformity + squint-for-colour-distinction
 + reduced motion + dark/light if supported
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
|-- Header - title, context, primary action
|-- Body/Grid/List - main content
|-- Detail/Drawer - progressive disclosure
`-- Footer/Chrome - metadata, controls, scroll status
```

Also list every **wrapper / layout primitive** in the chain from grid cell
down to the rendered child: `Tooltip`, `Trigger`, `Popover`, `Slot`,
`AnimatedDiv`, `Tippy`, `motion.div`, etc. Note the default `display`,
`width`, and `flex-shrink` of each. This is where wrapper-collapse bugs
hide and where the *primitive-first patch* in step 6 is decided.

---

## Step 1.5 - Domain Colour & Density Tier

Before touching any colour, name the product class. The same `/8` tint
that reads "premium and restrained" on a finance dashboard reads
"monochromatic and dead" on a learning app. Pick a tier, then apply it
consistently — never blend tiers in one product.

| Tier | Examples | Surface bg tint | Accent fill | Categorical hue use | Source |
|------|----------|-----------------|-------------|---------------------|--------|
| **A — Vibrant / Gamified** | Duolingo, Drops, Habitica, Strava, kids/learning, fitness, casual gaming | `/15–/25` gradient + ring `/30–/40` | solid token (`bg-success`, `bg-cta`), white-on-solid text | every meaningful category gets a distinct hue (success/error/streak/xp/info/premium) — colour *is* the gamification | Duolingo design system; Figma 2026 trend report |
| **B — Expressive Consumer** | Spotify, Notion playful surfaces, Robinhood onboarding, content/lifestyle apps | `/10–/18` gradient + ring `/20–/28` | semi-solid (`bg-cta/85`) | 3–5 semantic hues, decorative palette restrained | Spotify, Notion |
| **C — Productive / Pro Tools** | Linear, GitHub, Vercel, Figma chrome, design tools | `/6–/12` tint + ring `/15` | one accent + 4 semantic states | accent reserved for primary action; semantic states only for status | Linear, Radix |
| **D — Restrained / Data-Dense** | Stripe dashboard, AWS console, observability/finance/admin/healthcare | mostly neutral surfaces; `/4–/8` only on status pills | one accent for CTA; semantic states 4-slot (success/warn/error/info) | colour reserved for *data signal*; chrome stays achromatic — NN/g 60-30-10 | Stripe, ColorArchive SaaS dashboards |

**How to detect tier (do this before designing):**

1. Read the product's marketing copy, README, or onboarding — words like
 *play, streak, level, fun, journey, daily, habit, master* → tier A or B;
 *workspace, dashboard, report, audit, query, pipeline* → tier C or D.
2. Look at the existing primary CTA: solid saturated colour with chunky
 shadow → A; solid muted → B/C; outline or ghost dominates → D.
3. Look at semantic state tokens (`success`, `warning`, `error`,
 `info`, plus app-specific `xp`, `streak`, `premium`, `ai`, `tone-1..6`).
 More than 5 semantic hues with brand meaning → tier A. Just the basic 4
 → tier C/D.

**Tier mismatch is the top hidden cause of "monochromatic" feedback on
consumer apps.** A tier-A product with tier-D `/8` tints will look
washed-out and AI-generated even though every token is technically
"correct".

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
1440 x 900 desktop composition
1024 x 700 tablet / split-screen stress
800 x 700 narrow desktop / large mobile stress
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

### 3a - Two squint passes, not one

Run the squint test twice — both passes are necessary, and the second is
the one most enhancers skip:

| Pass | Question | Failure looks like |
|------|----------|--------------------|
| **Hierarchy squint** | "Where is my eye pulled first?" | Several elements equally loud → primary not chosen |
| **Category squint** | "Can I tell related items apart by colour/shape alone, without reading?" | All tiles same neutral grey → user must read every label = NN/g #6 violation |

For a Tier A/B product (see *Domain Colour Tier*), a 2-up or 3-up of
metric tiles that all read the same hue when blurred is a bug — colour is
your category signal. For a Tier D product, the same blur should show
*near-uniform* tiles with colour reserved only for the alert row.

### 3b - DOM uniformity gate (catches silent wrapper collapse)

Screenshots are necessary but not sufficient. When a page has *repeated
elements that should be the same width / height* — grid tiles, segmented
control segments, table columns, sidebar nav rows, form fields — measure
them. Many "weird-looking" layouts come from a wrapper higher in the tree
silently collapsing children to content width.

For each repeated group, query rendered rects and assert uniformity:

```js
// Browser MCP / Playwright / DevTools console — generic, framework-free
const rects = [...document.querySelectorAll('<your-tile-selector>')]
 .map(el => el.getBoundingClientRect());
const widths = rects.map(r => Math.round(r.width));
const heights = rects.map(r => Math.round(r.height));
const span = Math.max(...widths) - Math.min(...widths);
console.table({ widths, heights, widthSpan: span });
// span > 1px on tiles that share a `grid-cols-N` parent === wrapper-collapse bug
```

Common wrapper-collapse causes (generic, language/framework agnostic):

- Tooltip / Popover / Trigger primitive defaults to `display: inline-flex`
 or `inline-block` → child `width: 100%` collapses to content width.
- Grid template uses `1fr` (which is `minmax(auto, 1fr)`) and a child has
 intrinsic content wider than expected → cell expands beyond `1fr`. Fix:
 `repeat(N, minmax(0, 1fr))`.
- Flex child without `min-width: 0` or `flex: 1 1 0` → content size
 dictates layout instead of the flex track.
- Animation libraries (Framer Motion `m.div`, Reanimated, GSAP wrappers)
 that inject inline `display: inline-block` for transform performance.
- Slot patterns (`<Slot>`, `asChild`, `cloneElement`) where the consumer
 drops `w-full` because the inner component doesn't forward `className`.

Fix at the wrapper, not the leaf: see *Primitive-First Patch Rule*.

### 3c - Conditional-slot zero-state pass

For every conditional region (`media`, `aside`, `cover`, `eyebrow`,
`secondaryCTA`, `illustration`, `footerSlot`), inspect its **sparse
state** — render the page with the slot's smallest realistic content
(empty, "0%", a single icon, one short word). If the slot still reserves
its `min-h` / `aspect-ratio` / `min-w` floor, you have a dead-conditional
slot. Move to *Composition Move 4 (Stage)* and either:

1. Drop the wrapper when the slot is empty (`{slot && <Region>{slot}</Region>}`).
2. Collapse the floor on narrow viewports (`min-h-0 lg:min-h-[160px]`).
3. Inline the data into the body (chip / pill next to the action).

### 3d - Information-duplication scan

Within every fold (one viewport-height slice top-to-bottom), search for
the same number, word, date, or status appearing more than once. List
duplicates explicitly:

```
Fold 1 of /home @ 390×844:
- "0/10 words today" ×3 (eyebrow metric, action pill, footer strip)
- "0%" ×2 (action pill, Today metric tile)
- streak count ×2 (eyebrow metric, Streak tile)
```

The duplication itself is the diagnosis — pick *one* canonical home for
each datum (usually the most actionable one) and delete the others. Each
delete is a hierarchy upgrade for whatever stays.

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

## Hidden Failure Modes (the difficult-to-spot ones)

These are the "user said it but you missed it on first pass" patterns. When
feedback is vague-but-visceral ("clunky", "atrocious", "wasted space",
"incoherent height", "feels AI-generated"), walk this list before you touch
decoration. Each entry has a **detection probe** (what to look for) and a
**fix shape** (the smallest move that resolves it). Generic across stacks.

### H1. Active-state mass mismatch

**Symptom:** "Tab/button/dock cell looks weirdly big and clunky", "highlight
area is huge", "heights are incoherent".

**Detection:** Take a screenshot. Compare bounding boxes of active vs inactive
siblings (DevTools → element rect, or just eyeball). If layout dimensions
match but the active one *feels* 1.5× heavier, the active state is using a
full-cell background fill. Grep your active state for `bg-*` on the
container element. If found AND the inactive sibling has `bg-transparent`,
that's the bug.

**Fix shape:** Move the active signal to a **micro-indicator** wrapped *inside*
the cell, not painted *over* it:
- Tab → underline + text-color + count-badge swap (Stripe / Vercel pattern).
- Bottom dock → 32×16 `rounded-full` pill wrapping the **icon only**, not
 the whole button (Material 3 `SecondaryContainer` pattern).
- Sidebar item → leading 2px brand rail + bg-muted hover only.
- Button → solid fill is fine for primary CTAs (they SHOULD be heavy);
 forbidden for navigation siblings (they should NOT compete).

### H2. Chrome tautology on root / index routes

**Symptom:** "Breadcrumb is atrocious", "header is too much", "why is 'Home'
shown 3 times".

**Detection:** On the root route (`/`, `/dashboard`, `/home`), count how many
chrome zones display the page name or home affordance: company-as-home link,
breadcrumb chip, page title H1, dock active-item label, tab name. If ≥ 2
zones say the same word for the *current* page, you have tautology.

**Fix shape:** On root routes, **suppress** redundant chrome — pass
`showContextRow={false}` (or your equivalent) to the page-layout wrapper, or
gate the breadcrumb on `pathname !== "/"`. The dock indicator + page H1 +
greeting copy already answer "where am I?". The breadcrumb's job is "how do
I go back?" — at the root, there is no back, so the row is dead weight.

### H3. Card-on-card chrome

**Symptom:** Active page chip "feels heavy", "looks like a button stuck on
another button", a chip on a tonally-recessed row reads as one elevation too
many.

**Detection:** Inspect the row's background (e.g. `bg-muted`, `bg-chrome-subtle`,
or any tonal recess). Then inspect the chip inside that row (e.g. `bg-card
border`). Two distinct elevations within ~6 px of each other = card-on-card.

**Fix shape:** The chip must adopt the row's elevation, not introduce its own.
Either drop the chip's `bg-*` + `border` and let typography (`font-semibold`
+ `text-foreground`) carry the active signal, OR drop the row's tonal recess
and let the chip be the only painted surface. Pick one elevation per row.

### H4. Brand-color competition

**Symptom:** "Page feels noisy even though it's clean", "I can't tell which
button is the primary action", "everything looks important".

**Detection:** Take a desktop screenshot. Count surfaces tinted in the brand
color (border, fill, ring, text) within one visual zone. Subtract: the
single intended primary CTA + status chips that *carry* meaning. Anything
left over (a brand-tinted breadcrumb chip, a brand-tinted tab background, a
brand-tinted home icon border) is competition.

**Fix shape:** Demote the chrome surfaces to neutral (`text-muted-foreground`,
`bg-transparent`, `border-border/40`). Reserve the brand color for: the
single primary CTA per fold, real status indicators (success / progress /
new), and the active-item *micro-indicator* (not the cell background).

## Further reading

- [H5. Library-injected inline width beats your CSS rule and more](references/details.md)
