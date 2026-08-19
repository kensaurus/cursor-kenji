---
name: plan-aso
description: >
  Audit App Store and Google Play listings for discoverability and conversion —
  keywords, localized metadata, screenshots, ratings prompts — then emit a
  prioritized ASO plan. Use when "optimize our store listing", "improve app
  downloads", or "ASO". Submission mechanics → plan-mobile-readiness. Plan only.
license: MIT
---

# plan-aso — Store listing growth plan

**Degree of freedom: HIGH** — audit the listing, emit a plan. Stay
**plan-only**. No metadata, screenshot, or prompt edits until approved.

**Role:** Mobile growth / ASO specialist.

**Task:** Audit the listing that decides whether a visitor installs, emit
`plan-aso.md`. **Plan only — no metadata, screenshot, or prompt edits until
approved.**

**ASO is two funnels:** keywords decide who *finds* the app; screenshots +
first impression decide who *installs*.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **plan-aso** (this) | Find + install conversion of the *listing* |
| `plan-mobile-readiness` | Submission mechanics, privacy manifest, demo account |
| `plan-privacy-compliance` | Honest privacy labels (don't ASO-lie about data) |
| `enhance-web-seo` / `plan-aeo-readiness` | Web / answer-engine discoverability |
| `audit-monetization-iap` | Whether IAP actually works |
| `design-frontend` | Asset production after the plan is approved |

Do **not** fire for "will Play reject us / Guideline 2.5.2" →
`plan-mobile-readiness`.

## How to reason (every plan item)

1. **Propose** — keyword, locale, screenshot order, or ratings-prompt change
2. **Risk** — find vs install: who never sees the app, or who sees it and bounces
3. **Keep-working** — locales/assets that already convert
4. **Phase** — quick / medium / ongoing (do not execute)

## Worked example

> **Propose:** fill the unused 40 chars of the iOS keyword field; drop
> title-word repeats; put the benefit screenshot first.
> **Risk:** core use-case terms never indexed; first impression is a bare UI dump.
> **Keep-working:** JP long description already locale-native.
> **Phase:** quick — keywords + screenshot reorder.
> **Find vs install:** find (keywords) + install (shot 1).

---

## Phase 0 — Gather the current listing  [HIGH freedom]

Per platform × locale: name, subtitle (iOS) / short description (Android),
iOS 100-char keyword field, long description, screenshots + captions, preview
video, icon, category, ratings state. Note machine-translated or EN-only
locales.

---

## Phase 1 — Discoverability (find)  [HIGH freedom]

**iOS keywords** — 100 chars fully used, comma-separated, no wasted spaces, no
repeats of title/subtitle words, no plural+singular waste. Core use-case terms
present.

**Title & subtitle** — Title carries the #1 keyword beyond brand. Subtitle is
a keyword-bearing value line, not a slogan.

**Android** — Play indexes the long description. Core terms in the first lines,
natural density, not stuffed.

**Localization** — Each locale is a separate keyword surface. JP + EN need
*locale-native* keywords, not translated English. Untapped locales are the
cheap win.

**Category & competitors** — Right primary category? Terms competitors rank
that this listing ignores?

---

## Phase 2 — Conversion (install)  [HIGH freedom]

**Screenshots** — First 2–3 (no scroll) lead with benefit captions, not bare
UI. Narrative across the set. Localized text for key markets.

**Icon** — Distinct at thumbnail size.

**Preview video** — Value in the first seconds (often muted autoplay).

**Above-the-fold copy** — One-line hook, not "Welcome to…".

**Ratings** — In-app prompt at a *positive* moment (after value, not on
launch). Reviews responded to.

**Trust** — No leftover screenshots from an old version.

---

## Phase 3 — Prioritized plan (approve before executing)  [HIGH freedom — plan only]

- **Quick** — fill keyword field, drop redundant title words, add missing
  core-market locale, reorder screenshots value-first
- **Medium** — benefit captions, localized screenshot text, preview video,
  well-timed rating prompt
- **Ongoing** — locale expansion, review cadence, store A/B on icon/shots,
  keyword iteration

Each item: current → change → find vs install → effort. Asset work flagged
for `design-frontend`.

## Self-critique before the burndown  [LOW freedom — do not skip]

1. **Per platform × locale** — do not audit EN-only and call JP done
2. **Find vs install labeled** — every item says which funnel it moves
3. **No ASO-lie** — privacy labels stay honest (`plan-privacy-compliance`)
4. **Right owner** — Guideline 2.5.2 / demo account → `plan-mobile-readiness`
5. **Nothing edited** on the listing until approved

## Definition of Done

- [ ] Listing inventory per platform × locale
- [ ] iOS keywords + title/subtitle audited
- [ ] Android description placement checked
- [ ] Localization gaps with locale-native keyword notes
- [ ] Screenshots / icon / video / hook / ratings reviewed
- [ ] Plan prioritized; approved before listing edits

## Output format

1. **Inventory** — field × platform × locale
2. **Find findings** — issue | severity | fix
3. **Install findings** — issue | severity | fix
4. **Plan** — quick / medium / ongoing
5. Await approval.

## Related

- `plan-mobile-readiness` — get into the store
- `plan-privacy-compliance` — labels must match collection
- `audit-monetization-iap` — paid features actually unlock
- `enhance-web-seo` / `plan-aeo-readiness` — web counterparts
- `design-frontend` — produce approved assets
