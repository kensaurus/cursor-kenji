---
name: enhance-motion
description: >-
  Audit an existing app's design system and current motion, then apply coherent,
  performant, accessible motion using the right-sized 2026 stack — CSS/tw-animate-css
  for utility transitions, Auto-Animate for zero-config list/layout changes, Motion
  (motion.dev, ex-Framer Motion) for component transitions/gestures/presence, and GSAP
  only for complex timelines. Defines a motion-token SSOT (durations/easings) coherent
  with the app's existing scale, respects prefers-reduced-motion, and keeps everything on
  transform/opacity at 60fps. Use when "add motion", "animate the app", "make it feel
  alive", "motion pass", "add micro-interactions across the app", or "enhance-motion".
  Distinct from design-motion (from-scratch cookbook): this audits the existing system
  first and layers motion coherently on top. Applies changes and verifies them.
license: MIT
---

# enhance-motion — Coherent Motion for an Existing App

Add motion to an app that already exists, without fragmenting its visual language.
The failure mode this prevents: bolting on one hero animation, three different easing
curves, and a heavyweight library where a CSS class would do — motion that fights the
design system instead of reinforcing it.

> **Motion must be coherent, purposeful, reduced-motion-safe, and 60fps.** Pick the
> **lightest tool that fits** each interaction. Every animation gets its timing and
> easing from a **motion-token SSOT**, not ad-hoc magic numbers.

This skill **applies** motion and verifies it. For a from-scratch motion cookbook (no
existing system to respect), use `design-motion`. For pure animation-perf triage, use
`audit-performance`.

**Before any browser interaction, read `protocol-browser-anti-stall` and apply it.**

---

## Phase 0 — Detect the design system and current motion

### 0a. Applicability gate

This skill targets **web / React (or Vue/Svelte) UI**. If the repo is a CLI, library,
backend, or non-visual target, **bow out** and say so.

### 0b. Inventory the design system + motion state

Reuse the `audit-uiux-design-system` detection, then focus on motion:

```bash
# Libraries already present
cat package.json | grep -iE "motion|framer|gsap|auto-animate|tw-animate|animate.css|react-spring"
# Existing CSS motion + Tailwind config
rg -n "@keyframes|animation:|transition:" -g "*.css"
rg -n "animate-|transition-|duration-|ease-" -g "*.{tsx,jsx,vue,svelte}" -c
# Existing JS motion
rg -n "motion\.|useSpring|AnimatePresence|useScroll|gsap|autoAnimate" -g "*.{tsx,jsx}" -c
# Reduced-motion support (critical)
rg -n "prefers-reduced-motion|motion-safe|motion-reduce|useReducedMotion" -g "*.{tsx,jsx,css}"
```

### 0c. Record discovery

```
STACK: framework=<...> · CSS=<Tailwind v3/v4 / CSS Modules / ...> · UI lib=<...>
MOTION TODAY: libraries=<...> · easings in use=<list> · durations in use=<list>
REDUCED MOTION: honored? <yes/no — where>
INCOHERENCE FOUND: <e.g. 4 easing curves, 3 durations for the same interaction>
```

---

## Phase 1 — Choose the tier + define the motion-token SSOT

### 1a. Research (current)

Follow the `/research` protocol: Context7 for the chosen library's current API, Firecrawl
for current patterns dated to now. Anchor to versions actually installed. Motion (formerly
Framer Motion) is `motion` on npm.

### 1b. Right-size the library per interaction

Do **not** add every library. Pick the lightest tool that fits, and prefer what the repo
already uses if it's adequate:

| Tier | Tool | Use for |
|---|---|---|
| 1 — CSS utility | `tw-animate-css` (Tailwind v4 successor to `tailwindcss-animate`; shadcn's default) or existing Tailwind keyframes | fades, accordions, enter/exit utility classes, simple hovers |
| 2 — zero-config layout | `@formkit/auto-animate` | list/table add·remove·reorder, expanding sections — no config |
| 3 — component transitions | `motion` (motion.dev) — scoped to **component transitions, `AnimatePresence`, gestures, spring hovers** | modals, tabs, toasts, presence, drag |
| 4 — complex timelines | `gsap` — **only** when Tier 3 cannot express it | scroll narratives, sequenced SVG, scrubbed timelines |
| Reference | Kinetics (kinetics.colorion.co) | curated copy-paste pattern **source** — adapt to tokens; not a dependency |

State the chosen tier(s) and why. Keep the dependency footprint minimal.

### 1c. Define the motion-token SSOT

Motion values are tokens, coherent with the existing scale (collapse the incoherence found
in 0c into one set). Add to the token source (Tailwind theme / CSS variables):

```css
/* durations */ --motion-fast: 120ms; --motion-base: 200ms; --motion-slow: 320ms;
/* easings   */ --ease-standard: cubic-bezier(0.2,0,0,1);   /* enter/state */
                --ease-emphasized: cubic-bezier(0.3,0,0,1);  /* prominent   */
                --ease-exit: cubic-bezier(0.4,0,1,1);        /* exit        */
/* distance  */ --motion-shift: 8px;
```

All animations reference these — no inline magic numbers. Micro-interactions ≤ ~150ms,
entrances ~200–320ms, exits faster than entrances.

---

## Phase 2 — Apply motion, tier by tier

Work interaction-by-interaction; prefer mechanical, token-driven edits. For each element,
use the lightest fitting tier from 1b.

- **Buttons / links / cards:** Tier 1 CSS — `hover`, `active` (scale 0.98), `focus-visible`
  ring, using tokens. Distinct response per element type.
- **Lists / grids / expandable sections:** Tier 2 Auto-Animate — wrap the parent; items
  animate on add/remove/reorder with zero per-item code.
- **Modals / dialogs / toasts / tabs / dropdowns:** Tier 3 Motion — `AnimatePresence` for
  exit, backdrop fade + content scale/slide, tab indicator slide. Gestures (`drag`,
  `whileHover`, `whileTap`) where they add feel.
- **Page/route transitions:** template/layout-level fade+shift, kept subtle (respect the
  "component transitions only" scope — no heavyweight route choreography by default).
- **Scroll narratives / hero timelines:** Tier 4 GSAP only if genuinely needed.

Preserve all existing functionality and states — motion is additive. Never remove a
handler or state to "simplify."

---

## Phase 3 — Accessibility & performance gates (non-negotiable)

- **Reduced motion:** every animation degrades under `prefers-reduced-motion: reduce`.
  Use `useReducedMotion()` (Motion), `motion-safe:`/`motion-reduce:` (Tailwind), or a CSS
  media query that drops durations to ~0. Essential feedback stays (opacity), spatial
  movement is removed.
- **GPU-only:** animate `transform` / `opacity` only. No animating `width/height/top/left`.
- **No CLS:** transitions must not shift layout unexpectedly; reserve space.
- **Interruptibility:** enter/exit must not trap state if toggled rapidly.

```bash
rg -n "animate\[.*(width|height|top|left|margin)" -g "*.{tsx,css}"   # flag layout-triggering
rg -n "prefers-reduced-motion|useReducedMotion|motion-reduce" -g "*.{tsx,css}"  # confirm coverage
```

---

## Phase 4 — Verify and report

- **Browser MCP:** navigate touched routes, capture before/after screenshots to
  `.playwright-mcp/`, check `browser_console_messages` for errors, confirm animations run
  and reduced-motion drops them (toggle emulation).
- **60fps:** spot-check in DevTools Performance for any Tier 3/4 animation.
- **Build/typecheck:** run the repo's commands; fix anything introduced.

```markdown
## Motion Enhancement — report
**Stack:** [..]  **Tiers used:** CSS/tw-animate-css · Auto-Animate · Motion · (GSAP: y/n)
**Motion tokens:** durations [..] · easings [..] — single source in [file]
**Coherence fixed:** collapsed [N] easings → 3, [N] durations → 3
**Applied to:** buttons/cards (CSS), lists (Auto-Animate), modals/tabs/toasts (Motion), ...
**A11y:** prefers-reduced-motion honored across [N] components (evidence)
**Perf:** transform/opacity only; [component] verified 60fps; no CLS
**Verification:** build ✓ · console clean ✓ · before/after screenshots [paths]
```

---

## Related

- `design-motion` — from-scratch motion cookbook (Framer/Motion/GSAP/CSS patterns)
- `audit-uiux-design-system` — the broader visual coherency audit this builds on
- `audit-performance` — animation performance / Core Web Vitals triage
- `audit-accessibility` — reduced-motion and focus-order verification
- `housekeep-design` — if motion incoherence is part of wider design drift, consolidate first
- `protocol-browser-anti-stall` — required for the browser verification step
