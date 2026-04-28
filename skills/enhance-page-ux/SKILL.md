---
name: enhance-page-ux
description: >
  Generative, NN/g-grounded page enhancement skill. Given a route, screen, or component, this
  produces concrete, design-system-compliant code changes that replace generic, AI-templated, or
  "stacked" UI with intelligent, context-aware, human-centric layouts. Inventories the page's
  data domain and primitives FIRST, then maps every observed pain point to a Nielsen Norman
  heuristic, then proposes the smallest change that uses an existing primitive (Badge, Button,
  Card, Tooltip, semantic token). Replaces empty cells with semantic data instead of stacking
  more chips on top, color-codes by user mental model not technical type, fixes label-wrap and
  overflow at the helper level not row-by-row, and verifies live at desktop / tablet / narrow
  viewports via the browser MCP. Use when the user says "enhance this page", "make /xxx better",
  "this page feels AI-generated", "fix UX of /xxx", "improve information density", "icons all
  look the same", "buttons wrap to 2 lines", "empty columns", "I can't tell which is which",
  or asks for any non-trivial UX improvement on a specific screen. Generic — works on any
  webapp regardless of stack. Now also catches the "vague but visceral"
  failures (`clunky`, `atrocious`, `wasted space`, `incoherent`) that survive
  a normal audit: third-party CSS specificity wars (TanStack Table / AG-Grid
  inline width override), chrome tautology on root routes, card-on-card
  layering, brand-color competition, full-cell active-state washes where a
  micro-indicator belongs, and hover-only affordances on touch devices. For
  pure visual-token compliance audit (no enhancement), use
  audit-uiux-design-system. For pure heuristic evaluation report, use
  audit-ux.
---

# Enhance Page UX

A generative companion to the audit skills. **Audits diagnose; this skill enhances.** It
takes a single route or screen and produces a concrete, design-system-compliant set of
code changes that make the page feel hand-crafted — not template-generated.

> **Before any browser interaction, follow the rules in
> `~/.cursor/skills/protocol-browser-anti-stall/SKILL.md`.**

---

## Critical Rules — Read First

> **Replace, don't stack.** When you find an empty column, redundant header, or a duplicated
> hint row, REPLACE it with semantic data. Never pile new chips on top of a layout that
> already wastes space.

> **No band-aid fixes.** If a problem (label wraps, generic icon, missing AI indicator)
> shows up on multiple rows / pages / components, fix it at the helper / token level — not
> by patching one site at a time.

> **Inventory primitives before inventing.** The design system already has Badge, Button,
> Card, Tooltip, semantic colour tokens, animation utilities, etc. Use them. If none fits,
> extend the existing primitive — don't sidestep with a one-off `<div className="…">`.

> **Never ship mock, dead, or rogue UX.** Enhancements must be connected to the
> real product system: existing primitives, design tokens, domain helpers, API
> contracts, backend state, database schema, validation rules, permissions, and
> lifecycle events. Do not fake progress, status, counts, ownership, errors, or
> empty states in the component unless the user explicitly asks for a prototype.

> **Make feedback data-backed.** If users need clearer feedback to know what is
> happening, first find the real data that should drive it (status enum,
> timestamp, count, queue state, error code, audit trail, sync state, etc.). If
> the data does not exist but is necessary for robust UX, propose or implement
> the smallest schema/backend/API enhancement rather than layering decorative UI
> over missing product state.

> **Every change must cite a heuristic.** "Looks bad" is not a justification. "Violates NN/g
> #6 Recognition not Recall — all folder icons identical, forces reading names" is.

> **Verify at three viewports.** Desktop (1440), tablet (1024), narrow (800). Catch
> wrap / overflow / collision before claiming done.

> **Anti AI-tells:** identical-padding sections, generic 3-column icon-title-description grids,
> uniform border-radius on everything, every status the same colour, primary colour painted on
> every clickable element, lorem-ipsum empty states, and stock illustrations are all forbidden.
> If the page has them, they are part of the work.

> **Screenshots are necessary but not sufficient.** Many of the worst pains
> are *silent* — wrapper-collapsed tiles, dead conditional slots, the same
> datum repeated 3× in one fold, monochromatic surfaces on a tier-A
> consumer product. None of these are reported by users and most of them
> survive a cursory screenshot review. **Add the DOM Forensics pass
> (Step 2.5) and the Silent-Pain Catalogue (Step 3b) on every enhancement.**

> **Patch the primitive, not the consumer.** When a layout, colour, or
> wrap bug repeats across multiple call sites, the wrapper / helper /
> token is broken — fix it once at the definition. A `Tooltip` defaulting
> to `inline-flex`, an `EditorialHero` with an unconditional 160px media
> floor, a `Badge` without `whitespace-nowrap` — every band-aid you apply
> at the consumer leaves the bug live for the next page.

> **Audit the library-vs-CSS specificity war.** Headless data-grid
> libraries (TanStack Table, AG-Grid, MUI DataGrid, Chakra DataTable,
> react-table) emit inline `style={{ width: header.getSize() + 'px' }}`
> on every cell. Inline styles beat your CSS unless you use `!important`,
> `table-layout: fixed`, or drive widths through CSS variables that the
> rule then overwrites. A "wasted space + truncated content" report on a
> table page is almost always this gotcha — the fix is **not** another
> wrapper, it's auditing the column-meta CSS rules at every viewport with
> DevTools `Computed → width` open. Same audit applies to Chart.js / D3
> defaults, Mantine SegmentedControl, MUI Tabs (`MuiTab-root` width), etc.

> **Chrome is wayfinding, not content.** Header rows, breadcrumb chains,
> tab strips, dock cells, sidebars, toolbars all *support* the content —
> they should *recede*. If chrome competes for visual weight with the
> page body (full-cell brand-color washes, bordered card-on-card chips,
> heavy Home-as-button chrome, redundant breadcrumbs on root routes), the
> user reports "atrocious" / "clunky" / "heavy". Calm protocol: strip
> backgrounds → borders → tints → fills, in that order, until the chrome
> reads as a tonal recess that frames the content. For active-state
> signaling, prefer micro-indicators (underline, M3 32×16 pill on icon,
> count-badge tint, font-weight bump) over full-cell fills — see Hidden
> Failure Modes H1, H2, H3 in `enhance-page-ui`.

> **One brand-color element per visual zone.** A page should have ONE
> brand/accent-tinted element per zone (header, breadcrumb, tab row, dock,
> body). If breadcrumb chips, tab badges, AND the actual primary CTA all
> wear the brand color, the actual CTA loses scent. Demote the chrome
> ones to neutral typography; reserve brand color for the action the user
> is here to take + status chips that *carry* meaning + the active
> micro-indicator.

---

## Workflow Checklist

Copy this to track progress across the enhancement:

```
ENHANCE /<route>
- [ ] 0. PRODUCT TIER: domain class → colour-tier (A vibrant / B expressive /
       C productive / D restrained) — see enhance-page-ui §1.5
- [ ] 1. RECON: route, components, data shape, primitives, tokens, wrappers
- [ ] 2. LIVE: browser MCP at 1440 / 1024 / 800, screenshots, console
- [ ] 2.5 DOM FORENSICS: rect widths/heights for repeated tiles, conditional
       slot zero-state, dup-datum scan per fold (see Step 2.5)
- [ ] 3. PAIN INVENTORY: user-reported + silent issues + DOM forensics, with
       viewport (see Silent-Pain Catalogue in Step 3b)
- [ ] 4. HEURISTIC MAP: each pain → NN/g # + Law of UX (HEURISTICS.md)
- [ ] 5. PRIMITIVE MATCH: each fix → existing component / token / helper;
       prefer wrapper-level patch when bug repeats (see Step 5b)
- [ ] 6. ENHANCEMENT PLAN: table of pain → heuristic → primitive → file → diff
- [ ] 7. IMPLEMENT: smallest possible diffs, primitive fixes first, intent
       comments only
- [ ] 8. VERIFY: re-screenshot at 3 viewports + DOM uniformity recheck +
       category-squint pass + lint, compare before/after
- [ ] 9. WRITE-UP: pain → heuristic → fix, with screenshots
```

---

## Step 1 — RECON: Understand the Page Before Touching It

### 1a. Read the route entry

```
Glob: **/pages/**/<route>*.tsx OR **/app/<route>/page.tsx
Read: the route file in full (not snippets)
```

Extract:

- **Workflow position**: where does this page sit in the user journey? (entry, processing,
  outcome, hub)
- **Primary task**: what is the ONE thing a user comes here to do?
- **Data domain**: what entities are displayed? (files / invoices / messages / tax forms / …)
- **Adjacent screens**: what page do users come from / go to next?

### 1b. Map the component tree

```
Grep: imports inside the route file
Read: each top-level child component
```

Build a small ASCII tree of components and what each owns:

```
<RoutePage>
├── <PageHeader>           — title + breadcrumbs + summary KPIs
├── <Toolbar>              — filters + actions
├── <FolderTree>           — hierarchical list (the meat)
│   └── <TreeNode>         — single row renderer
└── <DetailPanel>          — selection-driven inspector
```

### 1c. Inventory the data shape

For every entity rendered, list ALL fields available — including the ones the page does NOT
currently show. Many enhancement opportunities are "we already have this data, we just don't
display it" (AI metadata, link status, aggregates, last-modified, owner, …).

```
Read: src/types/<entity>.ts
Read: src/features/<feature>/types.ts
Read: API loaders/actions/routes that fetch or mutate the entity
Read: schema/migrations/models when UI state depends on persisted status
```

Also identify whether each visual cue is backed by real product state. Badges,
progress, alerts, disabled states, empty states, and "recent" indicators should
map to data contracts or domain helpers, not hardcoded component guesses.

### 1d. Inventory primitives + tokens (THIS IS NON-NEGOTIABLE)

```
Glob: src/components/ui/*.tsx       — Badge, Button, Card, Tooltip, …
Read: tailwind.config.* OR globals.css — semantic colour tokens (signal-*, ai, brand, muted)
Glob: src/features/<feature>/helpers/*  — domain helpers already available
```

Write the list down. You will refer to it in step 5 — every fix must use one of these.

### 1e. Look for usage docs / forbidden patterns

```
Grep: "NEVER|FORBIDDEN|DO NOT|avoid" in **/*.md AND component file headers
Grep: "@deprecated" in src
```

A common find: a primitive that documents "do NOT use bg-X with text-X" — respect it.

---

## Step 2 — LIVE: Observe the Real Page, Not the Code

### 2a. Three-viewport screenshot pass

Use the browser MCP. Always in this order, always with viewport set BEFORE navigate:

```
1440 × 900   — desktop, full data density
1024 × 700   — tablet / split-screen — first place buttons & badges break
 800 × 700   — narrow — first place column truncation & wrap appear
```

For each viewport: navigate → wait → snapshot → screenshot → console messages.

### 2b. Click into representative items

A list page hides most of its bugs in the **expanded / selected / empty** states.
Programmatically click into:

- An empty container / folder / thread
- A populated container with diverse children
- A row with the maximum number of badges / metadata
- A search-with-no-results state

### 2c. Record what you see, not what you expect

For each screenshot capture, write 2-3 lines:

```
1440 — toolbar fits, but `通知書ZIP` button label competes with primary CTA
1024 — `アップロード` button is OK, `通知書ZIP` collapses to icon (no label)
 800 — folder badges (経費 / 通知書) wrap to 2 lines under the name; status
       chip wraps 未処→理 onto a new line because column is 64px
```

---

## Step 2.5 — DOM FORENSICS (catch the silent bugs)

Screenshots show *what looks weird*. DOM forensics shows *why*. Run this
pass before declaring the page understood, especially when a user
reports "looks weird", "feels off", "stacked", or "monochromatic" — those
are usually symptoms of one of the four silent bugs below.

### 2.5a — Repeated-element uniformity gate

For every group that *should* render with uniform widths/heights — grid
tiles, segmented-control segments, table columns, sidebar nav rows, form
fields, stat cards — measure them. Run this in the browser MCP / console
/ Playwright `evaluate`:

```js
// Generic, framework-free — works on any web stack
const tiles = [...document.querySelectorAll('<your-tile-selector>')]
  .map(el => {
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x) };
  });
const widths = tiles.map(t => t.w);
const widthSpan = Math.max(...widths) - Math.min(...widths);
console.table(tiles);
console.log({ widthSpan, uniform: widthSpan <= 1 });
// widthSpan > 1 on tiles that share `grid-cols-N` parent === wrapper-collapse bug
```

If `widthSpan > 1`, walk *up* the DOM tree from one of the leaf tiles
and `getComputedStyle()` each ancestor until you find one with `display:
inline-flex` / `inline-block`, or a flex parent without `min-width: 0`,
or a `grid-template-columns` that uses bare `1fr` with intrinsic-content
children. That ancestor is the bug — see Step 5b for the fix.

### 2.5b — Conditional-slot zero-state probe

For every slot/region defined as optional in the component (`media`,
`aside`, `cover`, `eyebrow`, `secondaryCTA`, `illustration`,
`footerSlot`, `extra`, `actions[1]`), inspect its **sparse** state. Open
the page as a brand-new user / empty account / fresh route and screenshot
at 800px. Look for slots that are *reserving floor space they don't fill*.

Symptoms (any one of these → confirmed dead slot):

- A region card that is >120px tall but contains <40 chars of content.
- A two-column grid where one column has just an icon and a number
  taking <20% of its track height.
- A `min-h-[Npx]` / `aspect-ratio` floor whose visible content occupies
  <40% of it.

Generic rule: if the slot was sized for *illustrations* / *charts* /
*device mockups*, it must be tested with *no illustration*. Many heroes
look great in marketing screenshots and become dead conditional slots
on a real first-run page.

### 2.5c — Information-duplication scan per fold

For every viewport-height fold of the rendered page, list every datum
(numbers, status words, dates, percentages, counts) and how many times
it appears:

```
Fold 1 of /home @ 390×844:
- "0/10 words today"  ×3 (eyebrow metric, action pill, footer strip)
- "0%"                 ×2 (action pill, Today metric tile)
- streak count "1d"    ×2 (eyebrow metric, Streak tile)
```

Anything that appears ≥2 times in a single fold is a duplicate. The
duplication is the diagnosis: pick the *most actionable* placement, keep
that one, replace the others with complementary data (or delete and
absorb the space into the chosen instance).

Cite NN/g #8 (Aesthetic & Minimalist) when documenting these.

### 2.5d — Category-squint colour pass

After the layout passes, take the desktop screenshot and apply a 10–15px
Gaussian blur (any image tool). For tier-A / tier-B products (consumer,
gamified, learning, lifestyle — see *Domain Colour Tier* in
`enhance-page-ui`), check that:

- A 3-up or 4-up of category tiles renders as 3–4 *distinct* colour
  blobs after blur. If they all blur to the same neutral, the tile
  tints are too faint for the product domain → bump from `/5–/10` to
  `/15–/25` per the tier-A scale.
- The primary CTA blurs to its own colour blob distinct from
  surrounding chrome. If it disappears into the surface tint, contrast
  is too low for a saturated-colour product.

For tier-D products (data dashboards, finance, admin) the *opposite*
result is correct — tiles *should* blur to near-uniform achromatic
neutrals with colour reserved for status pills. Tier mismatch is a
diagnosis, not just an aesthetic preference.

---

## Step 3 — PAIN INVENTORY (don't hand-wave)

Maintain a single table. Include user-reported pains AND silent ones you discovered.

| # | Source | Pain | Viewport | Notes |
|---|--------|------|----------|-------|
| 1 | user | Can't tell linked-document folders from regular | all | "many doc types" |
| 2 | user | Can't see which folders had AI analysis | all | inline chip needed |
| 3 | user | Toolbar button text wraps to 2 lines | 1024 | `通知書ZIP` |
| 4 | live | `金額` and `サイズ` columns are EMPTY for folder rows | desktop | wasted real estate |
| 5 | live | `未処理` status badge wraps 未処/理 inside 64px column | desktop | column too narrow |
| 6 | live | Hint row "☐チェックで選択 …" repeats forever above every list | all | violates #8 minimal |
| 7 | live | All folder icons are the same blue folder glyph | all | violates #6 recognition |

**Do not skip silent pains.** The user reports the loudest issue but rarely the worst one.

### 3b — Silent-Pain Catalogue (always check these)

The most damaging UX pains are usually *not* user-reported because users
don't have the vocabulary to describe them. After the user-reported
pains are listed, walk this catalogue and add every match as a separate
row in the inventory table:

| # | Silent pain class | Where to look | NN/g | Symptom example |
|---|-------------------|---------------|------|-----------------|
| S1 | **Wrapper-collapsed tiles** | Step 2.5a (rect widths) | #4 Consistency, #8 Minimalist | 3-up of equal tiles renders 80px / 80px / 80px in a 358px row, huge gaps between |
| S2 | **Dead conditional slot** | Step 2.5b (zero-state probe) | #8 Aesthetic & Minimalist | 160px-tall hero `media` slot containing only "0%" + an icon |
| S3 | **Information duplication per fold** | Step 2.5c (dup-datum scan) | #8 Aesthetic & Minimalist | "0/10 words today" appears in eyebrow + pill + footer strip |
| S4 | **Monochromatic surface (tier mismatch)** | Step 2.5d (category squint) | #1 Visibility, #6 Recognition | tier-A product with `/5–/8` tints; tiles blur to one neutral hue |
| S5 | **Left-anchored stack** | Live screenshot | #4 Consistency | every card full-width, every label left, no right-side anchors → "templated" feel |
| S6 | **Helper-row recall load** | Live screenshot | #6 Recognition over Recall | always-on hint row above every list ("☐ check to select…") |
| S7 | **Generic icon stack** | Live screenshot | #2 Match real world, #6 Recognition | every category uses the same `Folder` / `File` / `Item` glyph |
| S8 | **Async result invisible** | Read state contracts in step 1c | #1 Visibility of System Status | AI summary, link, sync, error happened but no UI signal |
| S9 | **Wrapping CTA / wrapping label** | Step 2c (3-viewport notes) | #4 Consistency, Fitts's | button text breaks to 2 lines at 1024px |
| S10 | **Empty column / zero cell stuck on screen** | Live screenshot at desktop | #8 Aesthetic & Minimalist | `Amount` / `Size` columns rendered for folder rows that don't have one |
| S11 | **Library-vs-CSS specificity war** | DevTools `Computed → width` on `<th>`/`<td>` at every viewport; check whether your responsive rule is crossed-out in favor of `element.style` | #4 Consistency, #8 Minimalist | TanStack Table / AG-Grid / MUI DataGrid emits inline `style="width:150px"` from `header.getSize()`; your `[data-priority="primary"]{width:auto}` rule loses without `!important` or `table-layout:fixed`. Symptom: "wasted space + truncation" at tablet widths only. |
| S12 | **Active-state mass mismatch** | Compare bounding boxes of active vs inactive sibling tabs / dock cells / nav items at the same viewport; squint test | #4 Consistency, NN/g *Navigation: You Are Here* | Active tab uses full-cell `bg-brand-soft` while siblings have transparent bg → active reads as 1.5× heavier even at identical layout dimensions. Symptom: "clunky", "weirdly big", "heights are incoherent". |
| S13 | **Chrome tautology on root / index route** | Open `/` (or the app root); count chrome zones that say the same word as the page H1 | #8 Aesthetic & Minimalist, NN/g *Visibility* | `🏠 › Home` breadcrumb under a header that already has a Home dock-active and a "Home" H1 → 3 instances of the same word in one fold. Symptom: "atrocious", "redundant", "useless row". |
| S14 | **Card-on-card chrome** | Inspect every chip / pill / badge — does it sit on a row whose own background is already a tonal recess? | #8 Aesthetic & Minimalist | Active breadcrumb chip with `bg-card border-brand/25 shadow-sm` sits on a row already painted `bg-muted/40` → two distinct elevations within 6 px. Symptom: chrome "feels heavy", "stuck on", "buttoned-up". |
| S15 | **Hover-only affordance with no touch fallback** | Grep `group-hover:opacity-100`, `opacity-0 hover:opacity-100`, `md:opacity-0` and check the parent for `focus-within:` / always-visible alternative below the pointer breakpoint | #6 Recognition over Recall, #7 Flexibility & Efficiency | Row action buttons (delete, archive, edit) only appear on `:hover`; on a touch device the user can't tap them. Symptom: silent — user never reports it because they don't know the action exists. |
| S16 | **Brand-color competition** | In a single viewport screenshot, count surfaces tinted in the brand color (border / fill / ring / text) within one zone; subtract the intended primary CTA + meaningful status chips | NN/g *Visual Hierarchy*, #4 Consistency | Brand-mint border on the breadcrumb home icon + brand-mint border on active page chip + brand-mint primary CTA → user's eye can't find the primary action. Symptom: "noisy even though it's clean", "I can't tell what to click". |
| S17 | **Hit area baked into visual chrome** | Inspect icon buttons; is the *visible* surface (background, border, padding) sized for the touch target (`w-11 h-11`) instead of the icon's optical weight? | NN/g *Visual Hierarchy*, Fitts's | A 14 px icon sits in a 44 px bordered card; the chrome is sized for the thumb, not the eye. Symptom: "icon button feels chunky" / "buttons everywhere". |
| S18 | **Inverted responsive visibility** | List every column's `hideBelowMd`/`mobile:hidden`/className per viewport in a table; look for columns that appear at one breakpoint and disappear at the next *up* | #4 Consistency | Column tagged `hideBelowMd: true` but rendered via `sm:hidden` → appears on `sm`, hides on `md+`. Symptom: "missing column at wide viewport" / "duplicate column on mobile". |

A good enhancement plan typically catches **2–4 silent pains per
user-reported pain.** If your final pain inventory has *only* user-reported
rows, you skipped Step 2.5.

---

## Step 4 — HEURISTIC MAP (every fix needs a WHY)

For each pain, name the violated heuristic. Use `HEURISTICS.md` for the canonical list.
A pain that cannot be tied to a heuristic is probably a personal taste call — defer it.

| # | Pain | NN/g # | Law of UX | Why it violates |
|---|------|--------|-----------|-----------------|
| 1 | linked-doc folders look like all others | #1 Visibility, #6 Recognition | Hick's | system state hidden, user must read names to discriminate |
| 2 | no AI marker | #1 Visibility | — | hides the result of an async, expensive operation |
| 3 | button wraps to 2 lines | #4 Consistency, #8 Minimalist | Fitts's | breaks rhythm; hit target shape unstable across widths |
| 4 | empty cells in `金額` / `サイズ` | #8 Aesthetic & Minimalist | — | "every extra unit of information competes with the relevant ones" |
| 5 | status badge wraps onto two lines | #4 Consistency | — | Japanese 2-character labels need `whitespace-nowrap` + sized column |
| 6 | always-on hint row | #6 Recognition over Recall, #8 Minimalist | — | repeated affordance hint = recall, not recognition; wastes a row forever |
| 7 | all folders same icon | #2 Match real world, #6 Recognition | Miller's | mental categories collapse; cognitive load to scan |

---

## Step 5 — PRIMITIVE MATCH (no inventions)

For each fix, match an existing primitive. If none fits, extend the closest one — never
reach for a raw `<div>` styled inline.

| # | Fix idea | Primitive / token | Where it lives |
|---|----------|-------------------|----------------|
| 1 | category-aware folder icon + chip | `Badge` (variant=outline) + `lucide-react` icon | new helper `getFolderCategory` |
| 2 | "AI" chip on folder + file | `Badge` size=xs + token `bg-ai-soft text-ai` | extend `tree-node.tsx` |
| 3 | toolbar buttons one-line | `AnimatedButton` + `whitespace-nowrap flex-shrink-0` + progressive `md:inline / lg:inline` | `<route>-page.tsx` |
| 4 | replace empty `金額` with folder total | aggregate helper `getFolderAggregates` (compute) + tabular-num cell | new helper |
| 5 | non-wrapping status badge | `Badge` + `whitespace-nowrap px-1.5` | `tree-node.tsx`; consider patching `Badge` base |
| 6 | drop the always-on hint row | delete + replace with `Tooltip` on column header `?` glyph | `folder-management.tsx` |
| 7 | category icon stack | switch on category, render `Icon` + bg tint via token | `getFolderCategory.tsx` |

If a fix would add a new primitive, STOP and ask: "could this be a variant on an existing
primitive?" Almost always: yes.

### 5b — Primitive-First Patch Decision

Before writing the diff, decide: **does this bug live at the leaf I'm
looking at, or at a wrapper / token / helper higher up?** Use this
decision tree:

```
Is the bug visible on more than one page / route / row?
├── Yes → Walk UP the component tree from the broken leaf.
│        Find the first wrapper / helper / token that hosts the bug.
│        Search for other consumers of that wrapper.
│        If consumers ≥ 3 → fix at the wrapper (with a backward-compatible
│                          prop / opt-in behaviour / new default).
│        If consumers ≤ 2 → fix at each call site, but file a TODO to
│                          extract the wrapper when a 3rd consumer appears.
└── No  → Fix at the consumer. But still ask: "what shape of bug would
         appear if a 2nd consumer reused this pattern?" Document it.
```

Concrete cues that the wrapper is broken (not the leaf):

- Same primitive used N times, only some sites display the bug → **the
  bug is in a *combination* of wrapper default + consumer assumption**.
  Fix by making the consumer assumption explicit (new prop) and changing
  the default to match the common case.
- The leaf has `w-full` / `min-w-0` / `flex-1` already and is *still*
  collapsing → the wrapper is content-sizing the leaf. Patch the wrapper.
- The leaf has correct semantic tokens but renders monochromatically →
  the *token scale* is too faint for the product tier. Bump the token,
  not the leaf.
- A `min-h` / `aspect-ratio` floor reserves space for content the leaf
  doesn't have → the wrapper's *layout contract* assumes rich content.
  Patch the wrapper to make the floor conditional.

Anti-pattern (do not do this): adding `!w-full` / `!min-h-0` / inline
overrides to one specific site to force-fix the page you're looking at.
The bug lives on every other consumer page — you've just hidden it
locally.

**Document the why in a code comment on the wrapper change.** Future
enhancers must understand *why* the prop / default exists, or they will
revert it. Comment template:

```ts
// `block` makes the Tooltip wrapper a full-width flex column so a child
// `w-full` button actually fills its grid cell. Without this, the wrapper
// defaults to `inline-flex` and every stat tile shrinks to content width,
// leaving huge gaps in the 3-up grid (visible bug on /account → This Week
// before this fix). Repro: 3 StatExplainer tiles in `grid-cols-3 gap-2`
// — measure rect widths, expect uniform thirds.
```

---

## Step 6 — ENHANCEMENT PLAN (the deliverable)

A single, reviewable table. Order by impact / risk:

```
| Pri | File | Change | Heuristic | Risk |
|-----|------|--------|-----------|------|
| 1 | helpers/get-folder-category.tsx (NEW) | category → {icon, label, tone} | #2,#6 | low |
| 2 | helpers/get-folder-aggregates.tsx (NEW) | files[] + folderId → { count, ai, ¥, bytes } | #1,#8 | low |
| 3 | components/tree-node.tsx | use category icon + chips, drop empty cells | #1,#6,#8 | med |
| 4 | components/folder-management.tsx | drop hint row, retitle columns | #6,#8 | low |
| 5 | pages/<route>.tsx | toolbar nowrap + progressive labels | #4,#8 | low |
| 6 | components/ui/badge.tsx | (optional) add `whitespace-nowrap` to base | #4 | med |
```

For each row also note: edge cases, what to test, what NOT to touch.

---

## Step 7 — IMPLEMENT (smallest possible diffs)

Rules during implementation:

1. **Helper-first**. Land helpers (pure functions, no JSX) before touching the component
   that uses them. They're easier to lint, test, and review.
2. **One concern per edit**. If a single diff changes layout AND data AND tokens, split it.
3. **Data contract before decoration**. If the enhancement depends on status,
   progress, ownership, counts, validation, permissions, or timestamps, wire it
   to the existing backend/schema/API or add the smallest durable field/helper
   needed. Do not create mock arrays or fake visual state to make the screen
   look richer.
4. **Comment the WHY only**. Code that says "added `whitespace-nowrap`" is noise; a comment
   that says "Japanese 2-character labels in a 64px column wrap to 2 lines without nowrap"
   is gold. Future you (or another agent) won't undo it.
5. **Use semantic tokens**. `bg-signal-warn/10 text-signal-warn` not `bg-orange-100 text-orange-700`.
   Honour any "do NOT pair bg-X with text-X" warnings on the primitives you use.
6. **No new colours, no new sizes, no new radii.** If you reach for one, you missed step 1d.
7. **Empty / zero-state de-emphasis.** Apply `opacity-70` or a `muted` variant to rows with
   zero children / zero amount / zero activity. Don't hide them — the user still needs them
   in the count, but they shouldn't fight for attention.
8. **Density gradient via Tailwind breakpoints.** Show full labels at `lg:`, abbreviate at
   `md:`, icon-only at default. Never let a label wrap.
9. **Stack tight columns vertically.** A 64-78px status column with TWO chips (AI + status)
   stacks vertically (`flex-col gap-0.5`) — never horizontally.
10. **Match colour saturation to product tier.** Tier A/B (vibrant /
    consumer / learning / lifestyle) needs `/15–/25` tints with `/30–/40`
    rings to read as semantic categories at a squint. Tier C/D
    (productive / data-dense) keeps `/5–/10` for restraint. Tier mismatch
    = monochromatic / washed-out feel even when every token is correct.
    See *Domain Colour Tier* in `enhance-page-ui` SKILL.md.
11. **Make conditional slots collapse when empty.** Any optional region
    (`media`, `aside`, `cover`, `eyebrow`, `secondaryCTA`) must drop its
    wrapper or its `min-h` floor when its content is sparse. Reserve
    space only at densities where the slot will be filled. Inline
    sparse data into the action row instead of letting it float in a
    half-empty card.
12. **Delete duplicate datums; replace with complementary data.** When
    the same number/word/status appears twice in one fold, keep the
    most actionable placement and replace the others with a sibling
    datum (streak, "vs last week", reviews-due, etc.). Each delete is
    a hierarchy upgrade for what stays.
13. **Override third-party inline styles explicitly.** Headless data-grid
    libraries (TanStack Table, AG-Grid, MUI DataGrid, Chakra DataTable,
    react-table) emit inline `style={{ width: header.getSize() + 'px' }}`
    on every `<th>` / `<td>` from a JS API. Inline styles beat scoped
    CSS unless you use one of: (a) `!important` on the property, (b)
    `table-layout: fixed` on the parent table so intrinsic widths are
    ignored, or (c) drive widths through CSS variables that your rule
    overwrites. Apply at **every viewport**, not just the one you tested.
    Verify via DevTools `Computed → width`: your rule must not appear
    crossed-out at 1440 / 1024 / 800. Same gotcha applies to MUI Tabs,
    Mantine SegmentedControl, Chart.js / D3 default sizing, etc. — any
    library that injects layout from JS.
14. **Calm chrome before touching content.** If the brief includes chrome
    (header / breadcrumb / tab / dock / sidebar / toolbar) the first move
    is **subtraction**: strip backgrounds → borders → tints → fills, in
    that order, until chrome reads as a tonal recess that frames content.
    For active states, prefer micro-indicators (underline, M3 32×16 pill
    on icon, count-badge tint, font-weight bump) over full-cell fills —
    see "Heavy Active State" pattern + Hidden Failure Modes H1, H3 in
    `enhance-page-ui`. On root / index routes, actively suppress the
    breadcrumb / context row — the dock active indicator + page H1
    already answer "where am I?", and the breadcrumb on root is pure
    tautology (Failure Mode H2 / S13).
15. **Audit the brand-color budget per zone.** Before adding a brand-tinted
    surface (border / fill / ring / text in the brand color) anywhere in
    chrome, count existing brand-tinted surfaces in that visual zone. If
    ≥ 1 already exists for non-CTA reasons (a brand-bordered home icon,
    a brand-tinted breadcrumb chip, a brand-tinted tab background),
    **demote it** to neutral typography first. The brand color is
    finite — spend it on the action the user came to take, status chips
    that *carry* meaning, and the active micro-indicator only.
16. **Set aria-current parity with the visual active state.** Whenever
    you paint an active tab / nav link / breadcrumb crumb / dock cell,
    also set `aria-current="page"` (or `aria-selected="true"` for tabs).
    Visual + AT treatment must agree; keyboard and screen-reader users
    depend on it. Grep for active-state classNames; for each, confirm
    the same JSX node carries the matching ARIA attribute.

After every meaningful edit:

```
ReadLints on the modified files — fix anything you introduced.
```

---

## Step 8 — VERIFY (the same three viewports, before/after)

```
Re-screenshot at 1440 × 900, 1024 × 700, 800 × 700.
Click into the same representative items as step 2b.
Check: no wrap, no overflow, no collision, no jarring state change, console clean.
```

If any pain from step 3 still shows visually, do not declare done. Iterate.

### 8b — Re-run the silent-bug gates

Screenshots prove the surface; the gates from Step 2.5 prove the
underlying contract. After each enhancement, re-run:

| Gate | What to re-check | Pass criterion |
|------|------------------|----------------|
| Uniformity | rect widths of every repeated tile group you fixed | `widthSpan ≤ 1px` per group |
| Conditional slot | sparse / zero-state render of every slot you touched | no `min-h` reservation > 1.5× actual content height |
| Dup-datum | each fold of the page | every datum (number, word, status) appears exactly once |
| Category squint | desktop screenshot at 10–15px Gaussian blur | tier-A/B: distinct colour blobs per category. tier-C/D: near-uniform achromatic with saturated alerts only |
| Wrapper-fix consumers | every other consumer of any wrapper you patched | same wrapper, different page, no regression |

A passed silent-bug gate is *worth more than a clean screenshot*: it
prevents the bug class from re-appearing on adjacent pages your future
enhancers never thought to check.

---

## Step 9 — WRITE-UP

Use the template in `examples.md`. Each user-facing pain gets:

- a one-line **before** description
- the **NN/g heuristic** it violated
- the **primitive / token** used in the fix
- the **after** behaviour
- a small screenshot or code reference

Keep the message structured so the user can scan it in 30 seconds.

---

## Heuristic Mapping Cheat Sheet (quick reference)

| Symptom on screen | Likely NN/g heuristic |
|-------------------|------------------------|
| Async result invisible (AI ran, link made, file processed) | #1 Visibility of System Status |
| Domain term feels engineering-y (`fileStatus=unlinked`) | #2 Match Real World |
| No way to undo / cancel / back out | #3 User Control & Freedom |
| Two pages style the same thing differently | #4 Consistency & Standards |
| Destructive action with no confirm; mis-keyable forms | #5 Error Prevention |
| All items look identical, must read names to find one | #6 Recognition over Recall |
| No keyboard shortcut, no bulk action, no saved filters | #7 Flexibility & Efficiency |
| Empty columns, repeating hints, decorative chrome | #8 Aesthetic & Minimalist |
| Error messages with codes, no suggested next step | #9 Help Users Recover |
| Onboarding with no in-context help, opaque controls | #10 Help & Documentation |
| Active tab/dock/nav painted heavier than siblings (full-cell wash) | #4 Consistency + NN/g *Navigation: You Are Here* (too loud) |
| Same word ("Home") echoed in breadcrumb + dock + H1 on root route | #8 Aesthetic & Minimalist (chrome tautology) |
| Brand color on chrome chips dilutes the actual primary CTA | NN/g *Visual Hierarchy* (every brand-tinted thing claims primacy) |
| Card-on-card chip (`bg-card border` on a `bg-muted` row) | #4 Consistency, #8 Minimalist (one elevation per row) |
| Hover-only row action with no touch fallback | #6 Recognition over Recall, #7 Flexibility (silent on touch) |
| Library inline `width` beats your CSS at one viewport but not another | #4 Consistency (rule loses specificity war) |
| Column with 44px content reserves 150px while sibling truncates | #8 Aesthetic & Minimalist (allocation mismatch) |

### Silent-bug → heuristic shortcuts

| Silent-bug class (Step 3b) | Likely NN/g heuristic | Why |
|----------------------------|------------------------|-----|
| Wrapper-collapsed tiles | #4 Consistency, #8 Minimalist | hit area unstable across rows; whitespace doesn't communicate grouping |
| Dead conditional slot | #8 Aesthetic & Minimalist | reserved space competes with focal content but holds no signal |
| Information duplication per fold | #8 Aesthetic & Minimalist | every duplicate steals attention from primary copy |
| Monochromatic surface (tier mismatch) | #1 Visibility, #6 Recognition | category signal hidden in the design-token scale |
| Left-anchored stack (no horizontal balance) | #4 Consistency | uniform layout hides true content hierarchy |
| Generic icon stack | #2 Match real world, #6 Recognition | mental categories collapse; user must read every name |

For depth on each heuristic and the supporting Laws of UX, read `HEURISTICS.md`.
For specific anti-patterns and their replacements, read `PATTERNS.md`.
For complete before/after enhancement examples, read `examples.md`.

---

## Quick Sanity Checks Before You Stop

- [ ] Product tier identified (A/B/C/D) and applied consistently
- [ ] Every change cites a heuristic in the write-up
- [ ] No new colour / spacing / radius value invented
- [ ] No new top-level primitive invented
- [ ] No mock/dead/rogue UI state introduced
- [ ] Feedback indicators are backed by real schema/API/domain state
- [ ] **DOM uniformity gate passed**: rect widths within 1px on every
      repeated tile group fixed
- [ ] **Conditional-slot zero-state gate passed**: no slot reserves >1.5×
      its actual content height on mobile
- [ ] **Dup-datum gate passed**: no datum (number, word, status) appears
      more than once per fold
- [ ] **Category-squint gate passed**: tier-A/B → distinct colour blobs;
      tier-C/D → near-uniform achromatic
- [ ] All labels stay on one line at 800 / 1024 / 1440
- [ ] Empty / zero-state rows are visually de-emphasised
- [ ] No always-on instruction row that repeats affordance text
- [ ] Async results (AI, link, error) are visible inline as chips, not behind a click
- [ ] **Repeating bug → patched at the wrapper / token / helper, not the
      consumer** (with intent comment on why)

### Hidden-failure-mode audit (the difficult-to-spot ones)
- [ ] **S11 Library specificity**: every responsive table/grid CSS rule was
      verified at all 3 viewports via DevTools `Computed → width`; the
      rule is *not* crossed-out by inline `style.width` from the
      data-grid library at any viewport.
- [ ] **S12 Active-state mass**: bounding box of active tab / dock cell /
      nav item ≈ bounding box of inactive sibling (within ~15 % painted
      area). No active sibling reads as "weirdly big" at the squint test.
- [ ] **S13 Chrome tautology**: on root / index routes, the page name does
      not appear in ≥ 2 chrome zones. Suppress the breadcrumb / context
      row when redundant with the page H1 + dock active indicator.
- [ ] **S14 Card-on-card**: no chip with `bg-card border` sits on a row
      whose own background is already a tonal recess. One elevation per row.
- [ ] **S15 Hover-only affordance**: every hover-revealed action has a
      tap-only fallback below the pointer breakpoint
      (`focus-within:opacity-100` or always-visible at `<sm`).
- [ ] **S16 Brand-color budget**: ≤ 1 brand-tinted surface per visual zone
      excluding the active micro-indicator and meaningful status chips.
- [ ] **S17 Hit area vs visual chrome**: 44 px touch targets achieved via
      invisible negative-margin extension, not by inflating the visual
      chrome (no `w-11 h-11 bg-card border` icon buttons).
- [ ] **S18 Responsive visibility**: column-meta `hideBelowMd` flags and
      className breakpoints are not inverted (no column appearing at `sm`
      and disappearing at `md+`).
- [ ] **aria-current parity**: every visually-active nav / tab / dock /
      breadcrumb item carries the matching `aria-current` /
      `aria-selected` attribute.
- [ ] **S19 wrapper-collapsed tiles** (Step 2.5a / 3b S1): rendered
      widths of every repeated tile group are within 1 px of each other.
      No `inline-flex` / `inline-block` ancestor between grid cell and
      tile is silently shrinking the children.
- [ ] **S20 dead conditional slot** (Step 2.5b / 3b S2): every optional
      region tested with sparse / zero-state content; no slot reserves
      `min-h` > 1.5× actual content height on mobile.
- [ ] **S21 information duplication per fold** (Step 2.5c / 3b S3): each
      datum (number, word, status, date) appears exactly once per
      viewport fold; duplicates deleted or replaced with complementary
      data.
- [ ] **S22 monochromatic surface / domain-tier mismatch** (Step 2.5d /
      3b S4): category-squint at 10–15 px blur shows distinct colour
      blobs (tier A/B) or near-uniform achromatic with status-only
      colour (tier C/D).
- [ ] **S23 left-anchored stacked cards** (Step 3b S5): every stacked
      card has at least one right-anchored piece of metadata tied to
      data — no decorative right-side icons.

### Repo health
- [ ] Lint passes on every modified file
- [ ] Three-viewport screenshots show no wrap / overflow / collision
- [ ] Write-up table maps each pain → heuristic → primitive → file → after

---

## When NOT to Use This Skill

- The user wants a **report only** (no code changes) → use `audit-ux` or
  `audit-uiux-design-system`
- The user wants to **build a brand new feature** from scratch → use `design-frontend`
- The change is a single-line **bug fix** with no UX dimension → just fix it
- The user wants a **README / marketing page** prettied up → use `enhance-readme`

---

## Companion Files

- [`HEURISTICS.md`](HEURISTICS.md) — NN/g 10 + Laws of UX, condensed
- [`PATTERNS.md`](PATTERNS.md) — anti-pattern → replacement library
- [`examples.md`](examples.md) — complete before / after enhancement walkthroughs
- [`enhance-page-ui` SKILL.md](../enhance-page-ui/SKILL.md) — companion
  artistic/composition skill. The §"Hidden Failure Modes" section there
  enumerates H1–H12 with detection probes and fix shapes that this skill's
  S11–S18 reference. Read both together when feedback is vague-but-visceral
  ("clunky", "atrocious", "wasted space", "incoherent height").

---

## Research Anchors (for the new failure-mode rules)

- **Linear — A calmer interface for a product in motion (2025)**: the
  canonical reference for the *Calm Chrome* rule. Names the principle
  "structure should be felt, not seen"; chrome recedes, content
  takes precedence. <https://linear.app/now/behind-the-latest-design-refresh>
- **Material 3 — NavigationBar spec**: active indicator is a 64×32
  `cornerFull` pill in `SecondaryContainer` color wrapping the **icon**,
  not the cell. Reference for the *Heavy Active State* fix shape (S12).
  <https://m3.material.io/components/navigation-bar/overview>
- **NN/g — Navigation: You Are Here**: prominence (color, weight, offset)
  must be present, but not so loud it competes with content. Reference
  for active-state tuning. <https://www.nngroup.com/articles/navigation-you-are-here/>
- **NN/g — Visual Hierarchy in UX**: contrast/scale/grouping create rank;
  the squint test reveals real (vs intended) hierarchy. Reference for the
  brand-color-budget audit (S16).
  <https://www.nngroup.com/articles/visual-hierarchy-ux-definition/>
- **TanStack Table — Column Sizing Guide** + **Issue #5870**:
  `header.getSize()` emits inline `style={{ width }}` per cell that beats
  unscoped CSS unless `!important` or `table-layout: fixed`. Same gotcha
  applies to AG-Grid, MUI DataGrid, Chakra DataTable, and most headless
  data-grid libraries. Canonical reference for S11.
  <https://tanstack.com/table/v8/docs/guide/column-sizing>
- **Adam Argyle (Chrome DevRel) — 3 Unintuitive CSS Layout Solutions**:
  the `min-width: 0` / `min-height: 0` / `flex-shrink: 0` /
  `repeat(N, minmax(0, 1fr))` recipe for grid/flex children that won't
  shrink or fill evenly. Canonical reference for S19 (wrapper-collapsed
  tiles).  <https://nerdy.dev/3-unintuitive-layout-solutions>
- **Playwright — Locator boundingBox / evaluateAll**: programmatic API
  for measuring rendered widths across repeated elements (the DOM
  uniformity gate in §2.5a). Same pattern works in DevTools console
  with `getBoundingClientRect()`.
  <https://playwright.dev/docs/locators>
- **YOOtheme Pro — Collapsing Layouts**: explicit "collapsing cascade"
  contract for editorial layouts — element collapses if empty → column
  collapses if all elements collapsed → row collapses → section
  collapses. Reference for S20 (dead conditional slot).
  <https://yootheme.com/support/yootheme-pro/wordpress/collapsing-layouts>
- **NN/g — Defer Secondary Content for Mobile**: first screen ruthlessly
  focused on the minimum information needed; duplication is a
  wall-of-text by another name. Reference for S21 (information
  duplication per fold).
  <https://www.nngroup.com/articles/defer-secondary-content-for-mobile>
- **NN/g — Content Dispersion (mobile-first on desktop)**: stretching
  mobile-first patterns wastes space on wide viewports; the inverse
  failure is dense conditional slots wasting space on narrow viewports.
  Reference for S20.
  <https://www.nngroup.com/articles/content-dispersion/>
- **Duolingo — Core Tabs Redesign + Gamification as Design Language**:
  reference for tier-A vibrant semantic palettes (green=correct,
  red=hearts, orange=streak, yellow=XP, purple=premium). Each colour
  carries a system meaning; muted palettes undermine the playful tone.
  Reference for S22 (monochromatic surface).
  <https://blog.duolingo.com/core-tabs-redesign/>
- **Stripe / Vitality / ColorArchive — SaaS Dashboard Color**: reference
  for tier-D restraint — 60-30-10 rule, semantic colour reserved for
  status, achromatic chrome. The other end of the same axis as
  Duolingo. Use to diagnose whether you're applying tier-D tints to a
  tier-A product (the "monochromatic" failure).
  <https://vitalitydesignsystem.com/foundations/colour/>
- **Figma — 2026 Web Design Trends**: vibrant maximalist palettes
  returning, especially for lifestyle / youth / learning brands.
  Validates the *Domain Colour Tier* framing in `enhance-page-ui`.
  <https://www.figma.com/resource-library/web-design-trends/>
