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
  webapp regardless of stack. For pure visual-token compliance audit (no enhancement), use
  audit-uiux-design-system. For pure heuristic evaluation report, use audit-ux.
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

---

## Workflow Checklist

Copy this to track progress across the enhancement:

```
ENHANCE /<route>
- [ ] 1. RECON: route, components, data shape, primitives, tokens
- [ ] 2. LIVE: Playwright at 1440 / 1024 / 800, screenshots, console
- [ ] 3. PAIN INVENTORY: user-reported + silent issues, with viewport
- [ ] 4. HEURISTIC MAP: each pain → NN/g # + Law of UX (HEURISTICS.md)
- [ ] 5. PRIMITIVE MATCH: each fix → existing component / token / helper
- [ ] 6. ENHANCEMENT PLAN: table of pain → heuristic → primitive → file → diff
- [ ] 7. IMPLEMENT: smallest possible diffs, intent comments only
- [ ] 8. VERIFY: re-screenshot at 3 viewports, lint, compare before/after
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

For depth on each heuristic and the supporting Laws of UX, read `HEURISTICS.md`.
For specific anti-patterns and their replacements, read `PATTERNS.md`.
For complete before/after enhancement examples, read `examples.md`.

---

## Quick Sanity Checks Before You Stop

- [ ] Every change cites a heuristic in the write-up
- [ ] No new colour / spacing / radius value invented
- [ ] No new top-level primitive invented
- [ ] No mock/dead/rogue UI state introduced
- [ ] Feedback indicators are backed by real schema/API/domain state
- [ ] All labels stay on one line at 800 / 1024 / 1440
- [ ] Empty / zero-state rows are visually de-emphasised
- [ ] No always-on instruction row that repeats affordance text
- [ ] Async results (AI, link, error) are visible inline as chips, not behind a click
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
