---
name: enhance-capacitor-ui
description: >
  Cross-surface UIUX separation skill for hybrid web apps that ship as PWA +
  iOS + Android via Capacitor (or Tauri / Expo Web / Ionic / RN-Web). Use when
  the user reports that a previous UI/UX sweep "improved one surface and broke
  the other" — desktop got polished and mobile feels cramped, or mobile feels
  native but desktop wastes space. Also use proactively when the project has
  ANY of: ad-hoc `useIsMobile` / `isNative` / `pathname.startsWith("/desktop")`
  branches scattered across components, a single `md:` viewport breakpoint
  doing double duty as "is desktop" and "is wider component slot", design-system
  primitives that hardcode `lg:grid-cols-2`, or platform-specific styling
  (rounded-2xl on iOS, rounded-md on Android) inlined per component instead
  of mode tokens. The skill establishes three orthogonal axes — **form factor**
  (compact / medium / expanded), **platform** (web / ios / android), **pointer
  capability** (fine / coarse) — and a three-layer architecture (context hook,
  mode tokens, container-query primitives) that lets a single sweep enhance
  one axis without degrading the others. Catches the silent failures that
  surface as "looks great on my laptop, atrocious on my phone": axis
  conflation in a single boolean, viewport queries used for component
  micro-layout, hover-only affordances shipped to native shells, M3 form-factor
  heuristics applied to the wrong size class, hardcoded chrome dimensions
  (`md:pl-[72px]`) leaking into primitives, and SSR/Capacitor first-paint
  mismatch when form-factor is read in render. Generic across stacks
  (Tailwind 4 / Tailwind 3 / vanilla CSS variables, Next.js / Vite /
  React Router, Capacitor / Tauri / Expo Web / Ionic). For pure visual polish
  on a single surface, use enhance-web-ui first; this skill is the
  prerequisite *architecture* that makes per-surface polish safe.
---

> ### Which enhance skill? (surface router)
>
> | Your surface | Use |
> |:-------------|:----|
> | **Web** product page / dashboard — composition, hierarchy, spacing, motion | `enhance-web-ui` |
> | **Web** product page — UX heuristics, flows, data wiring | `enhance-web-ux` |
> | **Web** landing / marketing / portfolio (greenfield, anti-slop) | `enhance-web-landing` |
> | **Web** existing site upgrade (audit-first, preserve behavior) | `enhance-web-redesign` |
> | **React Native** screen (Expo / bare) | `enhance-rn-screen` |
> | **Capacitor / hybrid** shell (one web app shipped to iOS + Android) | `enhance-capacitor-ui` (axis architecture first) → then the web or rn skill |
> | Repo **README** showcase | `enhance-readme` |
>
> **You are here: `enhance-capacitor-ui`.** Native iOS/Android (SwiftUI / Compose, no web layer) is out of scope for all of these — use Apple HIG / Material directly.

# Enhance Web ↔ Mobile UI

Separate the mobile and desktop design contracts of a hybrid app so that a
UIUX sweep on one surface cannot silently degrade the other. This is not a
"add a `useIsMobile` hook" skill. It establishes three orthogonal axes,
one source of truth, mode tokens, container-query primitives, and a
chrome allow-list — so per-form-factor / per-platform polish is a
predictable, reviewable change instead of a regression.

> **Vague-but-visceral cross-surface feedback ("looks great on web,
> atrocious on iPhone", "the iPad version is just a stretched phone",
> "Android dock feels wrong", "everything wraps on tablet") almost always
> points to **axis conflation** — one boolean (`isMobile`) is being asked
> to answer three different questions. Start at the architecture, not at
> the broken page.**

> If browser/native automation is used, first follow
> `~/.cursor/skills/protocol-browser-anti-stall/SKILL.md` when present.

---

## Critical Rules

> **Three orthogonal axes — never conflate them.**
> 1. **Form factor** (compact / medium / expanded) = how much screen space
>    do I have? — drives layout density, chrome strategy, navigation
>    pattern (bottom dock vs side rail vs persistent sidebar).
> 2. **Platform** (web / ios / android) = which OS visual language am I
>    inside? — drives motion curves, tap-highlight, overlay radii,
>    safe-area math, haptic affordances.
> 3. **Pointer capability** (fine / coarse, hover / no-hover) = can the
>    user hover and click precisely? — drives hover-reveal affordances,
>    drag-handle sizes, hit-target floors.
> A single `useIsMobile` boolean answering all three is the root cause
> of most cross-surface regressions. Encode the three axes separately.

> **One source of truth.** Detect the three axes once, in a single
> `useViewportContext()` (or equivalent) hook, and write them to
> `<html data-form-factor data-platform data-can-hover>` so CSS, server
> components, and SSR-rendered HTML all read the same answer. Banning
> ad-hoc `useMatchMedia` / `pathname.startsWith("/desktop")` /
> `Capacitor.isNativePlatform()` branches scattered across components.

> **Token modes, not per-component conditionals.** Platform differences
> that are *visual* (overlay radius, press-scale, tap-highlight color)
> live in `:root[data-platform="ios"]` blocks as CSS variable overrides,
> not in `if (platform === "ios")` JSX branches. Components consume the
> token; the platform layer paints it. (Ionic Modes, Konsta UI pattern.)

> **Page chrome = viewport queries; component micro-layout = container
> queries.** App-level chrome (bottom dock vs side rail vs sidebar)
> reacts to the *viewport* — only the app shell knows the global form
> factor. Cards, tiles, grids, hero blocks inside the content column
> react to their *container* — they may be in the main column, a side
> panel, a split-pane, a modal. Use `md:` / `lg:` only in the chrome
> allow-list (typically: app-shell, bottom-nav, side-nav, side-rail).
> Use `@md:` / `@lg:` (container queries) everywhere else. Tailwind 4
> ships container queries built-in; Tailwind 3 needs the plugin.

> **Per-form-factor squint test.** "Looks good at 1440" is one cell of
> a six-cell grid (3 form factors × 3 platforms minimum, plus pointer
> on/off). Before declaring an enhancement done, view it at compact
> (≤640px), medium (768–1023px), and expanded (≥1024px), on web + iOS
> WebView + Android WebView (or the closest available native shell).
> Any cell that looks "templated" or "broken" was not actually
> enhanced — it was avoided.

> **Tier across surfaces, not across the app.** A learning / consumer
> / lifestyle app should be **tier-A vibrant** on the *compact* form
> factor (color carries gamification meaning — Duolingo) and may
> legitimately become **tier-C calm** on the *expanded* form factor
> (more chrome, more data density, less novelty). The mistake is
> applying one saturation tier across all surfaces. Pick a tier per
> form factor; document it. (See `enhance-web-ui` § Domain Colour
> Tier.)

> **Never ship mock, dead, or rogue platform branches.** Platform-mode
> tokens must be wired to the *real* `Capacitor.getPlatform()` result
> (or your stack's equivalent). Don't fork visual logic on a static
> `process.env.MODE === "ios"` literal — the same bundle ships to all
> three surfaces and the platform is only known at runtime.

> **Guardrail the chrome allow-list.** Once `md:` / `lg:` are restricted
> to the chrome allow-list, an ESLint `no-restricted-syntax` rule + a
> Cursor / AGENTS rule (`responsive-design-axes.mdc`) keeps them there.
> A future enhancer (human or AI) will reach for `lg:grid-cols-2` in a
> primitive within a week unless the rule warns them.

> **Patch the axis primitive, not the consumer.** Same rule as
> `enhance-web-ui` *Primitive-First Patch Rule*, scoped to axes: if
> twelve cards each carry their own `lg:flex-row` branch, the bug is
> that the card primitive isn't a `@container`. Patch the primitive
> once, delete the twelve consumer branches.

---

## Workflow Checklist

Copy and track:

```
WEB↔MOBILE SEPARATION /<repo or surface>
- [ ] 0. SURFACE INVENTORY: shipping targets (PWA / iOS / Android / Mac
       Catalyst / Tauri), Capacitor or shell version, breakpoint system,
       Tailwind 3 vs 4 (container queries built-in?)
- [ ] 1. AXES AUDIT: how does the codebase currently answer "is mobile?",
       "is iOS?", "can hover?" — count the call sites, list the helpers
- [ ] 2. CHROME vs CONTENT MAP: which files own page-level chrome (allow
       `md:`/`lg:`), which files are content/primitives (must use `@md:`)
- [ ] 3. PROBE: grep bare `md:`/`lg:` outside the allow-list, count
       `useIsMobile` / `isNative` / `pathname.startsWith` branches,
       inspect SSR first-paint at /compact and /expanded
- [ ] 4. GAP MAP: current state vs three-layer architecture (context →
       tokens → primitives) — what's missing, what's duplicated
- [ ] 5. PLAN: six-step rollout (context hook → mode tokens → form-factor
       gates → container-query primitives → heuristic guide → guardrail)
- [ ] 6. IMPLEMENT: smallest diff per step; SSR-safe defaults at every
       boundary
- [ ] 7. VERIFY: six-cell matrix (3 form factors × 3 platforms), plus
       SSR/first-paint check, plus reduced-motion, plus dark/light if
       supported
- [ ] 8. WRITE-UP: surface → before pain → axis violated → primitive →
       after behaviour
```

---

## Step 0 — Surface Inventory

Before any change, write down what the app actually ships to. This prevents
designing for surfaces that don't exist (and forgetting ones that do).

| Surface | Detection | Notes |
|---------|-----------|-------|
| PWA / browser | default | Includes desktop browser AND iOS/Android Safari/Chrome |
| iOS native (WebView) | `Capacitor.getPlatform() === "ios"` | Capacitor / Ionic shells |
| Android native (WebView) | `Capacitor.getPlatform() === "android"` | Capacitor / Ionic shells |
| Mac Catalyst | iPad-class iOS surface running on macOS | Form factor matters more than platform |
| iPad / large iOS | iOS + ≥768px | Often misses iPad-specific layout if you only test iPhone |
| Foldable / split-screen | window resize event mid-session | Form factor changes at runtime, must subscribe |

Extract from the project:

- `package.json` → Capacitor / Tauri / Ionic / Expo / RN-Web version.
- `capacitor.config.*` → `webDir`, deployment targets, custom URL scheme.
- `tailwind.config.*` or `globals.css` `@theme` → existing breakpoints,
  whether container queries are configured.
- Any `useIsMobile` / `useBreakpoint` / `usePlatform` hook → catalogue.

---

## Step 1 — Axes Audit (find the conflation)

Run these probes; expect to find 5–30 hits per probe in any non-trivial
hybrid app. Each hit is a candidate for axis-separation.

```bash
# How does the codebase currently answer "is mobile?" — count the call sites
rg -n 'useIsMobile|isMobile|isDesktop|breakpoint\.lg|matchMedia.*768|window\.innerWidth' \
  --glob '!**/node_modules/**' --glob '!**/dist/**' | wc -l

# How does it answer "is iOS?"
rg -n 'Capacitor\.getPlatform|isNativePlatform|navigator\.platform|isIOS|isAndroid' \
  --glob '!**/node_modules/**'

# How does it answer "can the user hover?"
rg -n 'matchMedia.*hover|useCanHover|"hover:|@media \(hover' \
  --glob '!**/node_modules/**'

# Bare viewport prefixes outside the chrome allow-list (proxy for
# axis-conflation in primitives)
rg -n '\b(md|lg|xl|2xl):' \
  --glob 'design-system/**' \
  --glob 'components/**/!(@(app-shell|bottom-nav|side-nav|side-rail))*' \
  | wc -l
```

Build the conflation table:

| Hit (file:line) | Question being asked | Axis it should map to | Current proxy | Fix shape |
|-----------------|----------------------|-----------------------|---------------|-----------|
| `Card.tsx:42` `lg:flex-row` | "is the card slot wide?" | container size | viewport `lg:` | `@md:flex-row` after Card becomes `@container` |
| `Toast.tsx:18` `useIsMobile()` | "should I show a sheet or a side toast?" | form factor | viewport `md:` | `data-form-factor="compact"` token + Tailwind `ff-compact:` variant |
| `Button.tsx:30` `if (Capacitor.getPlatform() === "ios")` rounded-2xl | "what's the OS visual language?" | platform | runtime branch | `--btn-radius` token under `:root[data-platform="ios"]` |
| `IconBtn.tsx:15` `hover:bg-muted` | "show hover paint" | pointer capability | bare `hover:` | `can-hover:hover:bg-muted` (axis-aware variant) |

If the table has > 10 rows, the project needs the full architecture; if
< 5, you may be able to land just steps 1–3 (context hook + mode tokens +
gate the chrome).

---

## Step 2 — Chrome vs Content Map (the allow-list)

The single most important architectural decision in this skill: **which
files are allowed to read the viewport, and which must read their
container.** Write the list down before touching anything.

Default allow-list (files that may use bare `md:` / `lg:` / `xl:`):

```
components/app-shell.tsx          # the only file that knows global form factor
components/bottom-nav.tsx         # mobile dock; `md:hidden` is correct here
components/side-rail.tsx          # tablet rail; `hidden md:flex` is correct
components/desktop-side-nav.tsx   # desktop sidebar; `hidden lg:flex`
app/layout.tsx                    # SSR root, sets data-form-factor first-paint fallback
```

Default content list (files that must use `@md:` / `@lg:` container
queries OR axis-token variants):

```
design-system/primitives/**       # Card, Button, Input, OptionCard, etc.
features/**/components/**         # feature-level UI
app/**/page.tsx                   # route content (page chrome lives in layout)
```

Any time someone adds a 5th file to the chrome allow-list, that's a code
review smell: usually it should have been a content file with a
container query, not a chrome file with a viewport query.

---

## Step 3 — Probe live (SSR first-paint + runtime axes)

### 3a. SSR / hydration first-paint check

Hybrid web apps render twice: first on the server (no `window`, no
`Capacitor.getPlatform()`), then on the client. If the form factor /
platform decision is made in *render*, you ship a flash of wrong
chrome on every navigation.

| Probe | Where to look | Failure shape |
|-------|---------------|---------------|
| First-paint at /compact | View page source (Next.js `?_rsc` or curl) | If both `<BottomNav>` AND `<DesktopSideNav>` render, then JS hides one — you have FOUC |
| First-paint at /expanded | Same | If neither renders, then JS reveals one — you have a 200ms gap of no nav |
| Capacitor first-paint | iOS/Android WebView devtools | If `data-platform=""` for the first 50ms, your platform-specific tokens haven't applied yet |

Fix shape: render *both* chrome variants on the server (dual-mount), gate
visibility purely with CSS via a viewport `@media` query. The CSS query
runs synchronously at first paint, no JS needed. The form-factor `data-`
attribute is then written by JS *after* hydration, used only for axis-
specific tweaks not chrome visibility.

### 3b. Runtime axes probe (in the browser console, in each shell)

```js
// Generic, framework-free; works in DevTools console / browser MCP / native WebView
const html = document.documentElement;
console.table({
  formFactor: html.dataset.formFactor || '(not set)',
  platform:   html.dataset.platform   || '(not set)',
  canHover:   html.dataset.canHover   || '(not set)',
  viewport:   `${innerWidth}x${innerHeight}`,
  ua:         navigator.userAgent.slice(0, 80),
});
// Then resize the window and re-run — does formFactor flip live?
// On iOS Safari: rotate device — does formFactor flip?
// On Capacitor iOS: send to background and resume — does any value get stale?
```

Any `(not set)` cell at first paint is a bug — your context hook is
running too late.

### 3c. Container-query gate

For any primitive you are about to convert from `lg:` to `@lg:`, measure
the rendered widths *before* the change and *after*. If the change is
correct, the primitive should:

- Render the wider layout when its parent slot is wide (container > N px).
- Render the narrower layout when its parent slot is narrow.
- Be **independent** of the global viewport — drop it inside a 320 px
  side panel on a 1920 px monitor and it should look like the compact
  variant.

```js
// In the browser console / Playwright evaluate
const cards = [...document.querySelectorAll('[data-card]')];
console.table(cards.map(c => ({
  rect: Math.round(c.getBoundingClientRect().width),
  layout: getComputedStyle(c).gridTemplateColumns || getComputedStyle(c).flexDirection,
})));
// Expect: layout flips at the container threshold, not the viewport
```

---

## Hidden Failure Modes (the cross-surface ones)

Parallel to `enhance-web-ui` H1–H16 but specific to multi-surface
contracts. Each entry has a **detection probe** and a **fix shape**.
Generic across stacks.

### M1. Axis conflation in a single boolean

**Symptom:** "Mobile sheet renders on iPad landscape", "desktop side
panel renders on touch laptop", "iOS-style overlay shows on Android".

**Detection:** `rg -n 'useIsMobile|isMobile' --type ts | wc -l` returns
> 5. Read each call site and ask: "is this asking about screen size,
about platform, about pointer capability, or about the *combination*?"

**Fix shape:** Replace the single boolean with three answers from
`useViewportContext()` (or equivalent). Update each call site
explicitly:

```ts
// before
if (isMobile) return <Sheet>{children}</Sheet>;
return <Popover>{children}</Popover>;

// after — three axes addressed independently
const { formFactor, canHover } = useViewportContext();
if (formFactor === "compact") return <Sheet>{children}</Sheet>;
if (!canHover) return <Sheet>{children}</Sheet>;
return <Popover>{children}</Popover>;
```

Most "mobile" branches are actually "compact form factor OR coarse
pointer", which is *not* the same as `viewport < 768`.

### M2. Tier-A heuristics applied to expanded form factor (or vice versa)

**Symptom:** "Phone looks like a B2B dashboard", "desktop looks like a
toy". Result of running a single UIUX sweep that picked one saturation
tier and applied it across all form factors.

**Detection:** Take the desktop screenshot, take the phone screenshot,
side by side. If both surfaces use the same `/8` background tint and
the same primary CTA chrome, you've ignored form factor. Tier-A on
phone (`/15–/25` tints, solid CTAs, semantic hue per category) and
tier-C on desktop (`/6–/12` tints, one accent, achromatic chrome) is
*correct* for a learning / consumer / lifestyle app — not a bug.

**Fix shape:** Document the per-form-factor tier in your `HEURISTICS.md`.
Pick the tier per `data-form-factor` selector at the token layer:

```css
:root[data-form-factor="compact"] {
  --surface-tier-mix: 0.20;   /* tier-A vibrant */
  --cta-bg: var(--color-cta);  /* solid */
}
:root[data-form-factor="expanded"] {
  --surface-tier-mix: 0.08;   /* tier-C restrained */
  --cta-bg: transparent;       /* outline */
  --cta-border: var(--color-cta);
}
```

Then primitives consume `--surface-tier-mix` and `--cta-bg` once;
the form factor decides which tier paints.

### M3. No `data-platform` on `<html>` (token forks living in components)

**Symptom:** Buttons forked per platform inside JSX
(`if (platform === "ios") rounded-2xl else rounded-md`). Five
components do this; the sixth forgets and the bug ships to one shell.

**Detection:** `rg -n 'getPlatform\(\)|isNativePlatform' --type tsx`
returns > 3 hits in component code (not in the context hook itself).

**Fix shape:** Detect platform once, write `<html data-platform>`,
declare per-platform token overrides in CSS:

```css
:root[data-platform="ios"] {
  --radius-overlay: 1.25rem;
  --press-scale: 0.96;
  --tap-highlight: transparent;
  -webkit-tap-highlight-color: transparent;
}
:root[data-platform="android"] {
  --radius-overlay: 1.75rem;   /* M3 corner-extra-large */
  --press-scale: 1;             /* Android uses ripple, not scale */
  --tap-highlight: rgba(0, 0, 0, 0.08);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.08);
}
```

Components reference `var(--radius-overlay)` once; the platform layer
picks which value paints. Delete the JSX forks.

### M4. Bare `md:` for component micro-layout

**Symptom:** A card that flips to two columns at viewport-`lg:` looks
broken when dropped into a 400 px side panel on a 1920 px monitor —
the card is narrow but the viewport says "go two-column", so the
content overflows.

**Detection:** Grep for `md:grid-cols-2` / `lg:flex-row` /
`xl:items-center` inside `design-system/primitives/**` or
`features/**/components/**`. Anything outside the chrome allow-list
is a candidate.

**Fix shape:** Make the primitive a `@container` and convert
`md:` → `@md:`, `lg:` → `@lg:`. Pick the container-query breakpoint
that matches the *effective slot width*, not the viewport:

```tsx
// before — viewport-coupled, breaks in side panels
<Card className="grid lg:grid-cols-[1fr_2fr]">…</Card>

// after — slot-coupled, works anywhere
<Card className="@container grid @4xl:grid-cols-[1fr_2fr]">…</Card>
//             ^^^^^^^^^^^                  ^^^^^^
//             container root              container threshold
```

Picking the threshold: if the previous viewport `lg:` (1024 px) worked
because the main column was ~896 px wide at that viewport, the new
container threshold is `@4xl:` (~896 px). Container queries don't
inherit Tailwind's viewport scale; they have their own (`@xs` 320, `@sm`
384, `@md` 448, `@lg` 512, `@xl` 576, `@2xl` 672, `@3xl` 768,
`@4xl` 896, `@5xl` 1024, `@6xl` 1152, `@7xl` 1280). Choose the one that
matches the slot's typical width, not the viewport's.

### M5. `(hover: hover)` media queries copy-pasted across components

**Symptom:** Hover states on touch shells (the hover paint sticks
because there's no `pointerleave` after a tap on iOS WebView).

**Detection:** `rg -n '@media \(hover|hover\):not\(:active' --type css`
in component-scope CSS, or bare `hover:` in primitives without a
pointer-axis gate.

**Fix shape:** Define a single `@custom-variant can-hover` (Tailwind 4)
or add a `hover-only` plugin (Tailwind 3) gated on the `data-can-hover`
attribute, then convert primitives:

```css
/* Tailwind 4 */
@custom-variant can-hover (&:where(html[data-can-hover="true"] *));
```

```tsx
// before — paints on tap on iOS WebView
<button className="hover:bg-muted">…</button>

// after — only paints on devices that actually hover
<button className="can-hover:hover:bg-muted">…</button>
```

Same applies to `group-hover:opacity-100` row actions: gate behind
`can-hover:` and provide a tap fallback (long-press menu, always-visible
on coarse pointer) — see `enhance-web-ui` H7.

### M6. Capacitor split-screen / iPad landscape / fold ignored

**Symptom:** On iPad landscape, the app renders as a stretched phone:
bottom dock 1024 px wide, side rail missing, content max-width
640 px floating in the middle of a 1024 px viewport.

**Detection:** Open the app on an iPad simulator (or Chrome DevTools
`iPad Pro (12.9") landscape` preset). Compare the rendered chrome to
the desktop chrome. If they don't match (modulo platform-mode tokens),
form factor is being computed from `Capacitor.isNativePlatform()` and
not from the actual viewport.

**Fix shape:** Form factor must be computed from `matchMedia` against
the viewport, **not** from `isNativePlatform()`. Native is a *platform*,
not a *form factor*. iPad landscape is `expanded` form factor on the
`ios` platform — both axes apply, separately:

```ts
// the context hook
const compactMql  = matchMedia("(max-width: 767.98px)");
const mediumMql   = matchMedia("(min-width: 768px) and (max-width: 1023.98px)");
const expandedMql = matchMedia("(min-width: 1024px)");

function resolveFormFactor() {
  if (compactMql.matches)  return "compact";   // phone
  if (mediumMql.matches)   return "medium";    // small tablet, foldable folded
  if (expandedMql.matches) return "expanded";  // iPad landscape, desktop
  return "compact";
}
```

The breakpoints align with Material Design 3 *Window Size Classes* and
match Tailwind's `md:` / `lg:` so the chrome allow-list and the context
hook never disagree.

### M7. SSR mismatch from form-factor switch in render

**Symptom:** Hydration warning in console; first-paint shows desktop
chrome for 200 ms then snaps to mobile chrome (or vice versa).

**Detection:** Open the app on a phone, view-source — what chrome is
in the SSR HTML? If it's wrong, your render path is reading
`window.matchMedia` (which doesn't exist on the server).

**Fix shape:** Two patterns, pick one:

1. **Dual-mount + CSS gate.** Always render *both* chrome variants
   on the server; gate their visibility with `md:hidden` / `hidden md:flex`
   so CSS resolves the visibility synchronously at first paint, no JS
   needed. The context hook still runs for *axis tweaks* (token
   overrides, axis-aware variants) but chrome visibility is CSS-only.
2. **Server-known form factor.** If your framework supports it
   (Next.js with a `Sec-CH-UA-Platform` / `Viewport-Width` header,
   Remix loaders, etc.), resolve the form factor server-side and write
   `<html data-form-factor>` directly into SSR HTML. CSS reads it
   without JS.

Either pattern eliminates the FOUC. The dual-mount + CSS gate is
simpler and works on any stack.

### M8. Token saturation single-tier across surfaces (see M2)

Already covered in M2 — restated here for the catalogue. The fix is
*per-form-factor* token overrides at the `:root[data-form-factor]`
selector, not per-component conditionals.

### M9. Hover-only affordance shipped to native shells

**Symptom:** A row delete button only appears on `:hover`; it ships
to iOS / Android WebViews where the user has no hover capability and
the button is invisible. Silent because users don't report features
they don't know exist.

**Detection:** `rg -n 'group-hover:opacity-100|opacity-0 hover:opacity-100' --type tsx`
inside primitives or feature components.

**Fix shape:** Same as M5 — gate hover-reveal behind `can-hover:` and
provide an always-visible affordance (or long-press / swipe menu) on
coarse-pointer devices:

```tsx
// before — invisible on touch
<RowAction className="opacity-0 group-hover:opacity-100">…</RowAction>

// after — always visible on touch, hover-revealed on pointer
<RowAction className="can-hover:opacity-0 can-hover:group-hover:opacity-100 focus-within:opacity-100">…</RowAction>
```

### M10. Chrome dimensions hardcoded as `md:pl-[72px]` literals

**Symptom:** Side rail width changes from 72 to 80 px → 47 component
files need editing. Or: a feature dialog forgets to add `md:pl-[72px]`
and overlaps the side rail.

**Detection:** `rg -n 'md:pl-\[72px\]|md:ml-\[72px\]|pl-\[var\(--side-rail' --type tsx`.
If > 3 hits, the chrome dimension has leaked.

**Fix shape:** Promote the dimension to a CSS variable in your `@theme`
or `:root` block:

```css
@theme {
  --side-rail-width: 0px;          /* default; compact has no rail */
}
:root[data-form-factor="compact"] { --side-rail-width: 0px; }
:root[data-form-factor="medium"],
:root[data-form-factor="expanded"] { --side-rail-width: 72px; }
```

Then in app-shell, exactly one consumer:

```tsx
<div className="pl-[var(--side-rail-width)]">…</div>
```

Resize the rail in one place; every layout follows.

### M11. Form-factor switch via `pathname.startsWith("/desktop")`

**Symptom:** Some routes look mobile, others look desktop, regardless
of actual viewport. Codebase has `/m/*` and `/d/*` route prefixes (or
similar) baked into the URL.

**Detection:** `rg -n 'pathname.*startsWith.*"/d"|pathname.*startsWith.*"/m"' --type tsx`.

**Fix shape:** Form factor is a *runtime* property of the current
window, not a property of the URL. Delete the URL-based branches; use
`useViewportContext().formFactor`. If the URL prefix exists for SEO /
analytics reasons, keep it but stop reading it for layout decisions.

### M12. `safe-area-inset-*` ignored or hardcoded

**Symptom:** On iPhone with the Dynamic Island, top content is hidden
under the status bar. Or: the bottom dock sits on top of the home
indicator. Or: the keyboard appears and the input scrolls off-screen.

**Detection:** Open the iOS Capacitor build, view a page with a
top-anchored element. Is it visible below the Dynamic Island? Then
view a page with the keyboard open — does the focused input remain
visible?

**Fix shape:** Use `env(safe-area-inset-*)` in the app shell + provide
fallback:

```css
@theme {
  --safe-area-top:    env(safe-area-inset-top, 0px);
  --safe-area-bottom: env(safe-area-inset-bottom, 0px);
}
```

```tsx
<header style={{ paddingTop: "var(--safe-area-top)" }}>…</header>
<nav style={{ paddingBottom: "var(--safe-area-bottom)" }}>…</nav>
```

Keyboard handling: register a `Keyboard.addListener("keyboardWillShow", …)`
in your Capacitor init module, write a `--keyboard-height` CSS variable
to `<html>`, scroll the focused input into view. Capacitor 6+ ships
this as the `@capacitor/keyboard` plugin — wire it once in
`capacitor-init.ts`, not per-page.

---

## Three-Layer Architecture (the deliverable shape)

Every cross-surface separation lands in three layers, in this order.
Skipping any layer is the source of the regressions catalogued above.

### Layer 1 — Context Primitive (the source of truth)

A single hook that owns axis detection. SSR-safe defaults; subscribes
to `matchMedia` change events; writes `<html data-*>` once on mount;
exposes a typed snapshot to React.

```ts
// hooks/use-viewport-context.ts (generic shape)
export type FormFactor = "compact" | "medium" | "expanded";
export type Platform   = "web" | "ios" | "android";

export interface ViewportContext {
  formFactor: FormFactor;
  platform:   Platform;
  canHover:   boolean;
  isNative:   boolean;       // convenience: platform !== "web"
}

export function useViewportContext(): ViewportContext;
export function useViewportContextEffects(): void; // mount once in app-shell
```

`useViewportContext` reads the shared snapshot; `useViewportContextEffects`
attaches the matchMedia listeners and writes `<html data-*>`. Mount the
effects exactly once near the root.

### Layer 2 — Mode Tokens (CSS variables, no JSX)

Every visual difference between platforms / form factors lives as a CSS
variable override at the `:root[data-platform=…]` or
`:root[data-form-factor=…]` selector. Components consume `var(--token)`;
the platform / form factor decides which value paints.

```css
@theme {
  --press-scale: 0.97;
  --overlay-radius: 1.125rem;
  --tap-highlight: transparent;
  --side-rail-width: 0px;
  --active-dock-height: var(--dock-height);
}

:root[data-platform="ios"]      { --press-scale: 0.96; --overlay-radius: 1.25rem; }
:root[data-platform="android"]  { --press-scale: 1;    --overlay-radius: 1.75rem;
                                  -webkit-tap-highlight-color: rgba(0,0,0,0.08); }
:root[data-form-factor="compact"]                     { --side-rail-width: 0px;  }
:root[data-form-factor="medium"],
:root[data-form-factor="expanded"]                    { --side-rail-width: 72px;
                                                        --active-dock-height: 0px; }
```

### Layer 3 — Axis-Aware Variants + Container-Query Primitives

Custom Tailwind variants make axis-specific styling discoverable in
component code without leaking the implementation:

```css
/* Tailwind 4 */
@custom-variant ff-compact   (&:where(html[data-form-factor="compact"] *));
@custom-variant ff-medium    (&:where(html[data-form-factor="medium"] *));
@custom-variant ff-expanded  (&:where(html[data-form-factor="expanded"] *));
@custom-variant platform-ios (&:where(html[data-platform="ios"] *));
@custom-variant platform-android (&:where(html[data-platform="android"] *));
@custom-variant platform-native  (&:where(html[data-platform="ios"] *,
                                          html[data-platform="android"] *));
@custom-variant can-hover    (&:where(html[data-can-hover="true"] *));
```

Primitives become `@container` roots and use `@md:` / `@lg:`:

```tsx
export function Card({ children, className }) {
  return (
    <div className={cn(
      "@container rounded-[var(--radius-card)] p-3",
      className,
    )}>
      {children}
    </div>
  );
}
```

```tsx
export function EditorialHero({ media, children }) {
  return (
    <div className={cn(
      "grid gap-5",
      media && "@4xl:grid-cols-[1.18fr_0.82fr] @4xl:items-center",
    )}>
      {children}
    </div>
  );
}
```

The hero now adapts to its slot. Drop it in the main column on desktop:
two-column. Drop it in a side panel: single-column. Drop it on mobile:
single-column. No viewport branch anywhere.

---

## Six-Step Rollout (the implementation sequence)

Apply in order. Each step is independently shippable and reversible.
Land step N + 1 only after step N is verified across the six-cell
matrix.

| # | Step | What lands | Risk | Verifies |
|---|------|------------|------|----------|
| 1 | Context primitive | `useViewportContext` + effects | low | `<html data-*>` populated at first paint |
| 2 | Platform mode tokens | `:root[data-platform=…]` overrides for radius / press / tap-highlight | low | iOS / Android visual differences without JS forks |
| 3 | Form-factor token gates + chrome dual-mount | `--side-rail-width`, `--active-dock-height`, dual-mount BottomNav/SideRail/SideNav with CSS visibility gate | low | No FOUC at first paint; iPad landscape gets the rail |
| 4 | Container-query primitives | Card / List / Hero / OptionCard become `@container`; convert `lg:` → `@4xl:` | medium | Same primitive in main column vs side panel renders correctly in both |
| 5 | Per-form-factor heuristic guide | `design-system/HEURISTICS.md` documenting the squint test per form factor + tier per surface | low (docs) | Future enhancers know which heuristic applies to which axis |
| 6 | Guardrail | ESLint `no-restricted-syntax` against bare `md:`/`lg:` in primitives + Cursor / AGENTS rule | low | Lint catches axis violations in PRs |

If you can only land 3 steps, land 1, 3, and 6 — context, dual-mount,
guardrail. The rest can come incrementally without regressions.

---

## Squint-Test Matrix (the verification grid)

After each enhancement, view the surface at every cell. Any cell that
"just looks templated" is a missed axis. Mark each cell pass / fail.

|              | Compact (≤640) | Medium (768–1023) | Expanded (≥1024) |
|--------------|----------------|-------------------|------------------|
| **Web**      |                |                   |                  |
| **iOS**      |                | (iPad portrait)   | (iPad landscape) |
| **Android**  |                | (small tablet)    | (large tablet / Chromebook) |

Per-cell checks:

- **Chrome** — correct nav pattern? (compact: bottom dock; medium:
  side rail; expanded: persistent sidebar). Active state is a
  micro-indicator, not a full-cell wash (see `enhance-web-ui` H1).
- **Hierarchy squint** — primary content obvious in 0.5 s? (see
  `enhance-web-ui` § 3a)
- **Category squint** — color tier matches the form factor? (compact
  vibrant for tier-A apps; expanded calmer)
- **Hit targets** — touch targets ≥ 44 px on coarse-pointer cells; no
  hover-only affordances on touch
- **Safe area** — no content under status bar / Dynamic Island /
  home indicator
- **First-paint** — no FOUC; both chrome variants ship in SSR HTML;
  CSS resolves visibility before JS

A passed matrix is a *prerequisite* for declaring the work done — not
a stretch goal.

---

## Pattern Library

### Context hook (Tailwind 4 + React 18+)

```ts
"use client";
import { useEffect, useSyncExternalStore } from "react";

export type FormFactor = "compact" | "medium" | "expanded";
export type Platform   = "web" | "ios" | "android";

const COMPACT_QUERY  = "(max-width: 767.98px)";
const MEDIUM_QUERY   = "(min-width: 768px) and (max-width: 1023.98px)";
const EXPANDED_QUERY = "(min-width: 1024px)";
const HOVER_QUERY    = "(hover: hover) and (pointer: fine)";

let snapshot: ViewportContext = {
  formFactor: "compact",
  platform:   "web",
  canHover:   false,
  isNative:   false,
};
const subscribers = new Set<() => void>();
const subscribe = (fn: () => void) => { subscribers.add(fn); return () => subscribers.delete(fn); };
const getSnapshot       = () => snapshot;
const getServerSnapshot = () => snapshot;
const emit = () => subscribers.forEach((fn) => fn());

function getPlatform(): Platform {
  if (typeof window === "undefined") return "web";
  // Replace with your stack's detection: Capacitor.getPlatform(), expo-constants, etc.
  // @ts-expect-error injected by Capacitor
  const cap = window.Capacitor?.getPlatform?.();
  if (cap === "ios" || cap === "android") return cap;
  return "web";
}

export function useViewportContext(): ViewportContext {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useViewportContextEffects(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const platform = getPlatform();
    const isNative = platform !== "web";

    const compactMql  = matchMedia(COMPACT_QUERY);
    const mediumMql   = matchMedia(MEDIUM_QUERY);
    const expandedMql = matchMedia(EXPANDED_QUERY);
    const hoverMql    = matchMedia(HOVER_QUERY);

    const resolveFormFactor = (): FormFactor => {
      if (compactMql.matches)  return "compact";
      if (mediumMql.matches)   return "medium";
      if (expandedMql.matches) return "expanded";
      return "compact";
    };

    const update = () => {
      const next: ViewportContext = {
        formFactor: resolveFormFactor(),
        platform,
        canHover: hoverMql.matches,
        isNative,
      };
      if (
        next.formFactor === snapshot.formFactor &&
        next.platform   === snapshot.platform &&
        next.canHover   === snapshot.canHover &&
        next.isNative   === snapshot.isNative
      ) return;
      snapshot = next;
      root.dataset.formFactor = next.formFactor;
      root.dataset.platform   = next.platform;
      root.dataset.canHover   = next.canHover ? "true" : "false";
      emit();
    };

    update();
    [compactMql, mediumMql, expandedMql, hoverMql].forEach(m =>
      m.addEventListener("change", update));
    return () => {
      [compactMql, mediumMql, expandedMql, hoverMql].forEach(m =>
        m.removeEventListener("change", update));
    };
  }, []);
}
```

### Platform mode tokens (CSS variables only)

See M3 fix shape above. Default tokens in `@theme`; overrides per
`:root[data-platform=…]` block. Components reference `var(--token)`;
zero JSX branches.

### Form-factor token gates + chrome dual-mount

```tsx
// app-shell.tsx
export function AppShell({ children }: PropsWithChildren) {
  useViewportContextEffects();
  return (
    <div className="min-h-dvh">
      {/* Both chrome variants ship in SSR; CSS gate resolves at first paint */}
      <DesktopSideNav className="hidden md:flex" />
      <main className="md:pl-[var(--side-rail-width)]">{children}</main>
      <BottomNav className="md:hidden" />
    </div>
  );
}
```

### Container-query primitive

See *Layer 3* above — `@container` on the root, `@md:` / `@lg:` /
`@4xl:` for slot-aware micro-layout. Pick the threshold by the slot's
typical width, not the viewport.

### Per-form-factor heuristic guide (`design-system/HEURISTICS.md`)

A short markdown file the team treats as canon. Sections:

- **Compact form factor** — vibrant tier, bottom dock, thumb targets,
  one-handed reach map, full-bleed media, sheet over popover, haptics on.
- **Medium form factor** — side rail, two-pane where it adds clarity,
  hover affordances allowed only with `can-hover:`, sheet remains
  default for transient surfaces.
- **Expanded form factor** — persistent sidebar, hover-reveal allowed,
  popover preferred over sheet, calmer tier, denser data tables ok,
  keyboard shortcuts surfaced.
- **Platform iOS** — overlay radius `1.25rem`, press-scale `0.96`,
  no tap-highlight, system font fallback `-apple-system`.
- **Platform Android** — overlay radius `1.75rem` (M3 corner-XL),
  ripple via `-webkit-tap-highlight-color`, no press-scale, Roboto
  fallback.
- **Squint-test protocol** — six-cell matrix, what to look for per cell,
  what counts as pass.
- **Adoption checklist** — "before adding a new primitive, can it use
  `@container`? Before adding `lg:` to a primitive, are you sure
  it's chrome?".

Keep it under 250 lines. The file's value is being read, not being
exhaustive.

### Guardrail (ESLint `no-restricted-syntax` + Cursor rule)

```js
// eslint.config.mjs
{
  files: ["design-system/primitives/**", "features/**/components/**"],
  rules: {
    "no-restricted-syntax": ["warn",
      {
        selector: "Literal[value=/(?:^|\\s)(?:md|lg|xl|2xl):/]",
        message: "Bare md:/lg:/xl:/2xl: viewport prefixes are reserved for app-level chrome (app-shell, bottom-nav, side-rail, desktop-side-nav). Primitives must adapt to their slot, not the viewport — use @md:/@lg:/@xl: (container query) for component micro-layout, ff-medium:/ff-expanded: for form-factor decisions, or platform-ios:/platform-android:/can-hover: for axis-specific behaviour. See design-system/HEURISTICS.md.",
      },
      {
        selector: "TemplateElement[value.raw=/(?:^|\\s)(?:md|lg|xl|2xl):/]",
        message: "Bare md:/lg:/xl:/2xl: viewport prefixes are reserved for app-level chrome — see design-system/HEURISTICS.md.",
      },
    ],
  },
},
```

```mdc
---
description: Responsive design uses three orthogonal axes — viewport prefixes (md:/lg:) reserved for chrome.
globs: ["design-system/**", "features/**/components/**", "components/**"]
alwaysApply: true
---
# Responsive Design Axes

Use the right axis for the right question:

- **Container queries (`@md:`/`@lg:`/`@4xl:`)** — component micro-layout. The
  primitive doesn't know the viewport; it knows its slot.
- **Form-factor variants (`ff-compact:`/`ff-medium:`/`ff-expanded:`)** — when
  the design heuristic genuinely depends on form factor, not slot width.
- **Platform variants (`platform-ios:`/`platform-android:`)** — visual
  differences mandated by OS guidelines (radius, press, tap-highlight).
- **Pointer variants (`can-hover:`)** — hover affordances only.
- **Bare viewport prefixes (`md:`/`lg:`)** — only in the chrome allow-list:
  `app-shell`, `bottom-nav`, `side-rail`, `desktop-side-nav`, `app/layout.tsx`.

See design-system/HEURISTICS.md for the squint-test protocol and per-axis
adoption checklist.
```

---

## Implementation Rules

1. **Detect axes once, write `<html data-*>`, never branch in JSX.** Every
   per-platform / per-form-factor / per-pointer JSX branch is a bug
   waiting to fork.
2. **Tokens are the contract; primitives are the consumer.** A primitive
   that hardcodes `rounded-2xl` for iOS and `rounded-md` for Android is
   broken; it should render `rounded-[var(--radius-card)]` and let the
   token decide.
3. **Container queries for slot, viewport queries for chrome.** Memorise
   this. Every other rule follows from it.
4. **Dual-mount chrome on the server, gate visibility with CSS.** Avoids
   FOUC; works without JS; passes hydration checks on every framework.
5. **SSR-safe defaults at every boundary.** Default `formFactor:
   "compact"`, `platform: "web"`, `canHover: false` — the most
   restrictive answer in each axis. The client snaps to the actual
   value once mounted.
6. **No new colour / radius / spacing values invented.** Add a token to
   `@theme`, override per `:root[data-…]`, consume `var(--token)`.
7. **Test on a real native shell, not just Chrome DevTools toggle.**
   The differences between Chrome's "iPhone 14 Pro" preset and an
   actual iOS WebView (font rendering, scroll inertia, tap-highlight,
   safe area) are exactly the bugs this skill prevents.
8. **Run the six-cell matrix before declaring done.** Three viewports
   × at least PWA + one native shell. Five cells passing is not done.
9. **Patch the primitive, not the call site.** Same rule as
   `enhance-web-ui` *Primitive-First Patch Rule* — if a `lg:` shows up
   in three feature components, the bug is that the underlying
   primitive isn't a `@container`.
10. **Document the why of every axis decision.** A comment on the
    `data-platform="ios"` block saying "iOS overlay radius is `1.25rem`
    per HIG, vs Android M3 `corner-extra-large` `1.75rem`" prevents the
    next enhancer from "harmonising" the values back to a single
    radius and breaking both platforms.

---

## Quick Sanity Checks Before You Stop

- [ ] **Source of truth**: a single `useViewportContext()` (or equivalent)
      hook owns all three axes; no `useMatchMedia` / `getPlatform()`
      branches scattered in components.
- [ ] **`<html data-*>` populated at first paint** in every shell
      (PWA, iOS WebView, Android WebView). No `(not set)` cells.
- [ ] **Chrome allow-list enforced**: `md:`/`lg:` only in app-shell,
      bottom-nav, side-rail, desktop-side-nav, layout root. ESLint rule
      catches new violations.
- [ ] **Container queries on primitives**: every reused card / list
      row / hero / option-card declares `@container` and uses `@md:` /
      `@lg:` / `@4xl:` for internal layout. Drop a primitive in a 320 px
      side panel on a 1920 px monitor → it looks like the compact
      variant, not the desktop variant.
- [ ] **Mode tokens for platform differences**: every `if (platform === …)`
      JSX branch replaced by a CSS variable defaulted in `@theme` and
      overridden in `:root[data-platform=…]`.
- [ ] **Mode tokens for form-factor chrome**: `--side-rail-width`,
      `--active-dock-height` (and any other chrome dimension) live as
      CSS variables, gated per `:root[data-form-factor=…]`. No
      `md:pl-[72px]` literal duplicated across files.
- [ ] **Hover gated on `can-hover:`**: no bare `hover:` paint or
      `group-hover:opacity-100` row action that ships to native shells
      without a touch fallback.
- [ ] **Safe area handled**: `env(safe-area-inset-*)` consumed in app
      shell; no content under Dynamic Island or home indicator on iOS.
- [ ] **Dual-mount chrome with CSS gate**: both `BottomNav` and
      `DesktopSideNav` render in SSR HTML; visibility resolved by
      `md:hidden` / `hidden md:flex`, not by JS. No FOUC.
- [ ] **Per-form-factor tier documented**: `design-system/HEURISTICS.md`
      names the saturation tier per form factor (e.g. compact = tier-A
      vibrant, expanded = tier-C calm) and per platform.
- [ ] **Six-cell matrix passed**: 3 form factors × at least PWA + iOS
      WebView + Android WebView. Each cell screenshot reviewed with
      the squint test from `enhance-web-ui` § 3a.
- [ ] **Guardrail in place**: ESLint `no-restricted-syntax` + Cursor /
      AGENTS rule (`responsive-design-axes.mdc`) live in the repo so
      the next enhancer can't reintroduce axis conflation.

### Cross-surface failure-mode audit (the difficult-to-spot ones)
- [ ] **M1 axis conflation**: every `useIsMobile` call site re-examined;
      replaced with explicit form-factor / platform / pointer answers.
- [ ] **M2 single-tier across surfaces**: per-form-factor tier explicitly
      chosen and documented; no tier-D `/8` tints painting a tier-A
      consumer surface on compact.
- [ ] **M3 platform JSX forks**: zero `if (platform === "ios")` JSX
      branches outside the context hook itself.
- [ ] **M4 viewport-coupled primitives**: zero bare `md:`/`lg:` inside
      `design-system/primitives/**`.
- [ ] **M5 ungated hover**: zero bare `hover:` in primitives without
      `can-hover:` gate (or always-visible touch fallback).
- [ ] **M6 iPad landscape ignored**: form factor on iPad landscape =
      `expanded`; side rail / sidebar render as on desktop.
- [ ] **M7 SSR mismatch**: view-source on a phone returns the right
      chrome HTML; no React hydration warnings for axis-related markup.
- [ ] **M9 hover-only on native**: every `group-hover:` / `opacity-0
      hover:opacity-100` has either `can-hover:` gate or always-visible
      touch fallback.
- [ ] **M10 chrome literals**: zero `md:pl-[72px]` literal duplicated;
      single `var(--side-rail-width)` token consumed everywhere.
- [ ] **M11 URL-coupled form factor**: zero
      `pathname.startsWith("/desktop")` reads for layout decisions.
- [ ] **M12 safe area + keyboard**: top / bottom safe-area insets
      consumed; keyboard plugin wired in capacitor-init.

### Repo health
- [ ] Lint passes on every modified file
- [ ] Six-cell matrix screenshots show no FOUC, no overlap, no wrap,
      no platform-mode mismatch
- [ ] `HEURISTICS.md` updated; `responsive-design-axes.mdc` rule lives
      in `.cursor/rules/` (or `AGENTS.md` for non-Cursor projects)

---

## When Not To Use This Skill

- Single-surface visual polish (web only or iOS only) → use
  `enhance-web-ui` directly; this skill is the *prerequisite
  architecture* but isn't needed if you only ship one surface.
- Pure heuristic audit (no code changes) → use `audit-uiux-design-system`
  or `audit-ux`.
- Brand-new app from scratch → use `design-frontend` and *bake the
  three-axis architecture in from day one* — this skill catalogues the
  remediation path, not the greenfield design.
- React Native / pure native (no web shell) → the axis taxonomy still
  applies but the implementation layer (CSS variables, container
  queries) doesn't; use a stack-native equivalent (NativeWind tokens,
  Reanimated, etc.).
- Pure backend / data-correctness work → out of scope.

---

## Companion / Sibling Skills

- [`enhance-web-ui`](../enhance-web-ui/SKILL.md) — single-surface
  artistic / composition skill. Read after this one when you're polishing
  *one cell* of the matrix; the H1–H16 hidden failure modes there
  catalogue *within-surface* bugs (active-state mass, chrome tautology,
  brand-color competition, wrapper-collapsed tiles, etc.) that this
  skill assumes are handled separately per surface.
- [`enhance-web-ux`](../enhance-web-ux/SKILL.md) — task-flow / data-
  correctness companion. Use *before* this skill to fix the *what*
  (pain → heuristic → primitive); use *this* skill to make the *how*
  (per surface) safe.
- [`audit-uiux-design-system`](../audit-uiux-design-system/SKILL.md) —
  pure-audit companion. Run after the six-step rollout to verify
  no design-token drift was introduced.

---

## Research Anchors

- **Material Design 3 — Window Size Classes** — canonical breakpoints
  for compact (≤600 dp) / medium (600–840 dp) / expanded (≥840 dp)
  form factors and the navigation pattern (bottom bar / nav rail /
  nav drawer) that maps to each. Aligned with Tailwind's `md:`/`lg:`
  and the breakpoints used in *Layer 1*.
  <https://m3.material.io/foundations/layout/applying-layout/window-size-classes>
- **Material Design 3 — NavigationBar / NavigationRail / NavigationDrawer** —
  per-form-factor navigation pattern; spec for active-indicator pill
  (32×16 wrapping the icon) referenced in `enhance-web-ui` H1.
  <https://m3.material.io/components/navigation-bar/overview>
  <https://m3.material.io/components/navigation-rail/overview>
- **Apple Human Interface Guidelines — Adaptive Layouts** — iOS form
  factor heuristics; reference for safe-area math, sheet vs popover,
  multitasking / split-view behaviour on iPad.
  <https://developer.apple.com/design/human-interface-guidelines/layout>
- **Ionic — Modes** — canonical "platform tokens, not platform JSX"
  pattern. Ionic ships separate iOS-mode and Android-mode CSS variable
  sets; components consume the variable. Reference for *Layer 2* and
  Hidden Failure Mode M3.
  <https://ionicframework.com/docs/theming/platform-styles>
- **Konsta UI — Mobile-first React with iOS / Material Design themes** —
  React-native rendering of the Ionic mode pattern; useful as a
  reference implementation when Ionic itself is too heavy.
  <https://konstaui.com/react/>
- **Tailwind CSS 4 — Container Queries** — built-in `@container` /
  `@md:` / `@lg:` utilities (no plugin needed in v4). Reference for
  *Layer 3* and Hidden Failure Mode M4.
  <https://tailwindcss.com/docs/responsive-design#container-queries>
- **MDN — `@media (hover)` and `@media (pointer)`** — pointer-axis
  detection. Reference for *Pointer capability* axis and the
  `can-hover:` variant.
  <https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover>
  <https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer>
- **MDN — `env(safe-area-inset-*)` + `viewport-fit=cover`** — canonical
  safe-area handling on iOS / Android WebViews. Reference for Hidden
  Failure Mode M12.
  <https://developer.mozilla.org/en-US/docs/Web/CSS/env>
- **Capacitor — Plugins / Keyboard / StatusBar / SafeArea** — runtime
  primitives for native-shell wiring. Reference for capacitor-init
  patterns mentioned in Hidden Failure Mode M12.
  <https://capacitorjs.com/docs/plugins>
- **Sec-CH-UA-Form-Factors / Sec-CH-UA-Platform** — Client Hints headers
  that allow server-side form-factor / platform resolution; reference
  for Hidden Failure Mode M7 fix shape #2.
  <https://wicg.github.io/client-hints-infrastructure/>
- **Linear — A calmer interface for a product in motion (2025)** —
  reference for chrome-as-recess across form factors; same principle
  applies whether the chrome is a desktop sidebar or a mobile dock.
  <https://linear.app/now/behind-the-latest-design-refresh>
- **NN/g — Responsive Design and Adaptive Design** — distinguishes
  responsive (one layout that flexes) from adaptive (different layouts
  per breakpoint); this skill argues hybrid apps need *adaptive* chrome
  + *responsive* content, with axes orthogonal.
  <https://www.nngroup.com/articles/responsive-design/>
