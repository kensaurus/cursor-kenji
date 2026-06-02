---
name: enhance-rn-screen
description: >
  Polish an existing React Native screen to feel intentional, native, and
  human-crafted. Catches RN-specific silent failures — safe area violations,
  sub-minimum touch targets, keyboard occlusion, JS-thread animation jank,
  gesture conflicts, tab-bar content clipping, double safe-area insets, and
  FlatList re-render storms — alongside the platform-agnostic composition
  failures shared with the web skills (active-state mass mismatch, brand-color
  competition, monochromatic surfaces, information duplication per screen,
  left-anchored stacks). Use for "this screen looks off", "feels clunky on
  iOS", "Android version looks wrong", "jank when scrolling", "button is
  unreachable", or any RN-specific UX polish pass. Applies to bare React
  Native, Expo bare workflow, and Expo managed workflow. Pairs with
  start-emulator and test-emulator. For web/PWA surfaces use enhance-web-ui
  or enhance-web-ux instead.
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
> | **React Native** screen (Expo / bare) | `enhance-rn-screen` |
> | **Capacitor / hybrid** shell (one web app shipped to iOS + Android) | `enhance-capacitor-ui` (axis architecture first) → then the web or rn skill |
> | Repo **README** showcase | `enhance-readme` |
>
> **You are here: `enhance-rn-screen`.** Native iOS/Android (SwiftUI / Compose, no web layer) is out of scope for all of these — use Apple HIG / Material directly.

# Enhance Screen — React Native

Turn an existing RN screen into a composed, native-feeling interface:
calmer hierarchy, correct platform idioms, tight safe-area and keyboard
handling, purposeful motion, and component primitives that work on both
iOS and Android without forking.

> **Vague-but-visceral native feedback ("button is weirdly big", "text
> gets cut off on my phone", "scrolling feels janky", "can't tap that",
> "looks like a web page") almost always maps to one of the Hidden
> Failure Modes (N1–N15) below — start there, not at decoration.**

> Before taking any screenshots, follow `start-emulator` SKILL.md to
> bring up a working dev loop on the Android emulator. For iOS, trigger
> a CI build and install via TestFlight; the JS layer is verified on
> Android first (90%+ of "iOS bugs" are platform-agnostic RN/JS bugs).

---

## Critical Rules

> **Compose before decorating.** Fix hierarchy, grouping, alignment,
> safe-area handling, and touch targets before adding colour, motion, blur,
> or shadows. An overlapping status bar is worse than a dull palette.

> **iOS and Android are co-equal targets.** Every change must be verified
> on both platforms. Shadow props are platform-split (iOS: `shadow*`; Android:
> `elevation`). Haptics are iOS-first. Ripple is Android-first. Write both.

> **No hex literals in screen/component code.** Route all colours through the
> design-token system (`theme.colors.*`, `withAlpha`, named constants from
> `@<org>/design-tokens`). Hard-coded hex values bypass dark/high-contrast
> mode support and make tier-A → tier-B colour scaling impossible.

> **Touch targets: 44×44 pt (iOS HIG) / 48×48 dp (M3) minimum.** A 16 dp
> icon inside a 40×40 dp Pressable is too small. Extend invisibly with
> `hitSlop` or a negative-margin Pressable wrapper; do not inflate the
> visual chrome to achieve the target.

> **Safe area is ScreenContainer's job — never add it twice.** If
> `ScreenContainer` (or your repo's equivalent) already applies
> `useSafeAreaInsets()`, adding insets again in a child component produces
> a double-counted gap. `ScreenBackButton` uses `top: 8`, not
> `top: 8 + insets.top`, for exactly this reason.

> **Primitive-first patch.** When a layout, colour, or wrap bug appears on
> multiple screens, fix the shared primitive — not every consumer site.
> A `HubRowItem` with wrong spacing fixed in one place heals every screen
> that uses it.

> **Never ship mock, dead, or rogue UI.** Visual feedback must be backed by
> real data contracts, backend state, or domain helpers. Don't fake progress
> bars, streak counts, or status chips in the component; wire them to the
> real source or add the smallest schema extension needed.

> **Respect `ReduceMotion`.** Every animation must check
> `AccessibilityInfo.isReduceMotionEnabled()` (or your repo's
> `ReduceMotionContext`) and fall back to an instant state change. This is
> non-negotiable; it is required by both Apple HIG and Android accessibility
> guidelines.

> **Use the local design system.** The repo's token system and component
> primitives exist for a reason. Extend an existing primitive before
> inventing a one-off `<View style={{...}}>`.

---

## Workflow Checklist

Copy and track:

```
RN ENHANCE /<ScreenName>
- [ ] 0. PLATFORM TIER: domain class → colour-tier (A vibrant / B expressive /
       C productive / D restrained) — see §1.5
- [ ] 1. RECON: screen file, component tree, navigation type, data shape, tokens,
       primitives, ScreenContainer/safe-area wrapper chain
- [ ] 2. CONTENT RANK: primary / secondary / metadata / actions / ambient
- [ ] 3. LIVE READ: screenshots at 3 device configs (small / standard / large phone)
       + tablet if relevant; inspect safe area, keyboard behaviour, landscape
- [ ] 3.5 DEVICE FORENSICS: onLayout measurements for repeated elements, conditional-
       slot zero-state, dup-datum scan per screen, accessibility large-text probe
- [ ] 4. PAIN INVENTORY: user-reported + silent issues from forensics pass
- [ ] 5. HEURISTIC MAP: each pain → NN/g # + RN-specific failure mode
- [ ] 6. PRIMITIVE MATCH: each fix → existing component / token / helper
- [ ] 7. IMPLEMENT: primitive-level fixes first, smallest per-screen diffs after
- [ ] 8. VERIFY: re-screenshot at 3 configs + keyboard up + large-text + dark/light +
       Android + iOS (TestFlight or CI screenshot)
- [ ] 9. WRITE-UP: pain → heuristic → fix → before/after
```

---

## Step 1 — Recon: Understand the Screen Before Touching It

### 1a. Read the screen file

```
Glob: apps/mobile/src/screens/**/<ScreenName>.tsx
Read: the screen file in full
```

Extract:

- **Navigation context**: native stack / modal / bottom sheet / tab root?
  What presents this screen, what does it navigate to?
- **Primary task**: the ONE thing a user comes here to do.
- **Data shape**: entities displayed, all fields available (not just shown).
- **ScreenContainer / SafeAreaView chain**: which wrapper handles safe-area
  insets? Is `headerShown: false`? Are there nested scroll containers?

### 1b. Map the component tree

Build a small ASCII tree:

```
<ScreenContainer>
├── <BlurHeader>           — title + back button
├── <EditorialScrollView>  — main scrollable body
│   ├── <HubRowItem>       — list rows (repeated)
│   └── <FooterBand>       — stats / actions
└── <FloatingCTA>          — primary action
```

Also note every **wrapper in the layout chain** from the outer safe-area
provider down to the leaf Pressable. This is where double-inset bugs and
gesture conflicts hide.

### 1c. Inventory the data shape

For every entity rendered, list ALL fields available — including unused ones.
Many enhancement opportunities are "we already have this data, we just don't
show it" (e.g. `lastStudied`, `masteryPercent`, `streakCount`).

```
Read: packages/api/src/<entity>/index.ts
Read: apps/mobile/src/state/<entity>.ts
Read: packages/core/src/<entity>/ helpers
```

### 1d. Inventory primitives + tokens (NON-NEGOTIABLE)

```
Glob: apps/mobile/src/components/ui/*.tsx
Glob: apps/mobile/src/components/layout/*.tsx
Read: packages/design-tokens/src/ — semantic colour tokens, grove tokens,
      market-card constants, shadow tokens
Read: apps/mobile/src/lib/theme.ts (or your repo's theme hook)
```

Write the token/primitive list down. Every fix in Step 7 must reference one
of these — never invent a one-off `{backgroundColor: '#2C2C2E'}`.

### 1e. Check forbidden patterns

```
Grep: "DO NOT|FORBIDDEN|avoid|deprecated" in the screen file + component headers
Grep: hex literals in apps/mobile/src/ (ESLint no-restricted-syntax should catch these)
```

---

## Step 1.5 — Domain Colour & Density Tier

Before touching any colour, name the product class. The same `/8` tint that
reads "premium and restrained" on a B2B dashboard reads "monochromatic and
dead" on a learning app.

| Tier | Examples | Surface bg tint | Accent fill | Categorical hue use |
|------|----------|-----------------|-------------|---------------------|
| **A — Vibrant / Gamified** | Duolingo, language learning, fitness, casual games | `/15–/25` + ring `/30–/40` | solid token, white-on-solid | every meaningful category has a distinct hue (correct/error/streak/xp/premium) |
| **B — Expressive Consumer** | Spotify, Notion playful, lifestyle apps | `/10–/18` + ring `/20–/28` | semi-solid | 3–5 semantic hues, decorative palette restrained |
| **C — Productive / Pro Tools** | Linear, GitHub Mobile, design tools | `/6–/12` tint + ring `/15` | one accent + 4 semantic states | accent for primary action only |
| **D — Restrained / Data-Dense** | Finance, analytics, healthcare, admin | mostly neutral; `/4–/8` on status only | one accent for CTA | colour reserved for data signal |

**How to detect tier:**
1. Read the app's onboarding — "play, streak, level, fun, journey, master" → A/B; "workspace, dashboard, report, audit, pipeline" → C/D.
2. Look at the primary CTA: solid saturated with chunky shadow → A; solid muted → B/C; outline/ghost → D.
3. Count semantic hues in the token set. More than 5 with brand meaning (xp, streak, premium, tone-1..6, correct, error) → tier A.

**Tier mismatch is the top hidden cause of "looks dull" feedback on consumer apps.**
A tier-A app with tier-D `/8` tints will look washed-out even though every
token is technically "correct".

---

## Step 2 — Content Rank Before Layout

Classify every visible element:

| Rank | Meaning | Default treatment in RN |
|------|---------|--------------------------|
| Primary | What the screen is about | largest `fontSize`, strongest contrast, most vertical space |
| Secondary | Helps interpret primary | near primary, smaller, grouped |
| Metadata | Dates, counts, stats, status | bottom row of a card, trailing Text in a row |
| Actions | What user can do | stable `Pressable` hit area, no overlap with keyboard |
| Ambient | Brand, mood, decorative | background, low-opacity, non-tappable |

Rules:
- If everything is primary, nothing is primary.
- Never stack metadata above the headline; pin it to the row's trailing edge or a card footer.
- If an action has `numberOfLines={1}` and still wraps on a small phone, abbreviate it.
- If a grid has dead space, adjust `numColumns`, card `flex`, or aspect ratio before adding more content.

---

## Step 3 — Live Read: Screenshot on Real Devices

### 3a. Three-device-config pass

Use the `start-emulator` SKILL.md to bring up the Android emulator.
Take screenshots at these three configs (change with `adb shell wm size`):

```
360×800    compact phone (Android S, older iPhones at ~375pt)
412×917    standard phone (Pixel 7 / iPhone 16 default) — PRIMARY test target
430×932    large phone (iPhone 16 Plus / large Android)
```

For tablet-relevant screens add:
```
768×1024   tablet portrait (iPad / Android medium tablet)
```

Screenshot commands:
```bash
adb shell screencap -p /sdcard/sc.png && adb pull /sdcard/sc.png ./screenshot-360.png
adb shell wm size 412x917 && adb shell screencap -p /sdcard/sc.png && adb pull /sdcard/sc.png ./screenshot-412.png
adb shell wm size 430x932 && adb shell screencap -p /sdcard/sc.png && adb pull /sdcard/sc.png ./screenshot-430.png
adb shell wm size reset
```

### 3b. What to note per screenshot

For each config, write 2–3 lines:

```
360×800 — "XP bar truncates label to 2 lines; bottom CTA hidden behind tab bar"
412×917 — "Layout looks clean; streak count duplicated in header AND in hero card"
430×932 — "Dead space in the 2-up grid; right card 40px wider than left"
```

### 3c. Keyboard probe

Tap the first text input on any screen that has one. Note:
- Does `KeyboardAvoidingView` / `KeyboardAwareScrollView` scroll the focused input into view?
- Does the primary CTA remain tappable above the keyboard?
- On Android: `behavior='height'`. On iOS: `behavior='padding'`.

### 3d. Squint test — two passes

Run both; the second is the one most enhancers skip:

| Pass | Question | Failure |
|------|----------|---------|
| **Hierarchy squint** | "Where is my eye pulled first?" | Multiple elements equally loud — primary not chosen |
| **Category squint** | "Can I tell related items apart by colour alone, without reading?" | All tiles same neutral → must read every label (NN/g #6 violation) |

---

## Step 3.5 — Device Forensics (catch the silent bugs)

Screenshots show *what looks wrong*. Device forensics shows *why*. Run this
before declaring the screen understood.

### 3.5a — Repeated-element measurement gate

For every group that should render with uniform widths/heights — grid cards,
tab bar items, stat chips, row cells — measure them with `onLayout`:

```tsx
// Drop this temporarily on any repeated component to measure it:
<View onLayout={e => console.log('MEASURE', e.nativeEvent.layout)} />
```

Or use a quick probe in the JS console (Metro/Hermes debugger):

```js
// In Metro remote debugger / React DevTools
// Add onLayout logging to the repeated element, trigger a render,
// read the Metro output for { x, y, width, height } per instance.
```

Expected: widths within 1–2dp of each other for elements in the same row or grid.
Width spread > 4dp on elements that *should* be equal → Yoga flex bug (see N-F1).

### 3.5b — Conditional-slot zero-state probe

For every optional region (media slot, illustration, `aside`, `footerBand`,
`secondaryCTA`), test with the smallest realistic content (empty account,
zero streak, no achievements). Look for:

- A `minHeight` floor reserving space when the slot's content is absent.
- A `View` that renders an empty container with visible padding.
- A card that is ≥ 120 dp tall but contains only an icon and "0".

Fix: conditionally render the wrapper (`{slot && <Region>{slot}</Region>}`)
or collapse the floor on compact screens.

### 3.5c — Information-duplication scan per screen

List every datum (number, percentage, status word, streak count) visible on
the screen and how many times it appears:

```
HomeScreen @ 412×917:
- "12 words today"   ×3 (hero chip, progress bar label, footer row)
- streak "5d"        ×2 (hero badge, streak section title)
- "68%"              ×2 (progress bar, Today metric tile)
```

Anything appearing ≥2× on the same screen is a duplicate. Pick the most
actionable placement; delete the others. Each delete is a hierarchy upgrade
for what stays. (NN/g #8 Aesthetic & Minimalist.)

### 3.5d — Category-squint colour pass

For a tier-A/B product, take the standard-phone screenshot and apply a
10–15px blur. A 3-up or 4-up of category tiles should show as 3–4 *distinct*
colour blobs. If they blur to the same neutral → token tints are the wrong
tier (see H15 in this skill's Hidden Failure Modes).

### 3.5e — Large dynamic type probe

In the emulator: Settings → Accessibility → Font size → set to the largest
option. Reload the app and screenshot. Look for:

- Text overflowing its container (fixed-height Views with Text inside).
- Row items wrapping to 2 lines when they should stay on one.
- Buttons that clip their label.

Fix: remove fixed heights on Text containers; use `numberOfLines={1}` +
`adjustsFontSizeToFit` for labels that must stay on one line;
`maxFontSizeMultiplier={2}` on critical UI labels.

---

## Step 4 — Pain Inventory

Maintain a single table. Include user-reported pains AND silent ones from Step 3.5.

| # | Source | Pain | Config | Notes |
|---|--------|------|--------|-------|
| 1 | user | "Back button overlaps the header title" | 390pt | double safe-area inset |
| 2 | user | "Streak number shows up twice on the home screen" | all | dup-datum — H14 |
| 3 | live | Tab bar clips last row of FlatList | 360px | missing contentInset |
| 4 | live | CTA wraps to 2 lines on 360px | compact | label too long — S9 |
| 5 | live | All 3 tone cards blur to same neutral | 412px | tier-A with tier-D tints |

**Do not skip silent pains.** The user reports the loudest issue; the worst ones
are often invisible to them.

### 4b — Silent-Pain Catalogue for RN (always check these)

| # | Pain class | Where to look | NN/g | Symptom |
|---|-----------|---------------|------|---------|
| S1 | Safe area violation | Screenshot on notched device; check top/bottom edges | #1 Visibility | Status bar overlaps content; home indicator covers CTA |
| S2 | Sub-minimum touch target | `onLayout` on Pressable; < 44×44pt (iOS) / 48×48dp (Android) | Fitts's, #4 | Users mis-tap; icon buttons always affected |
| S3 | Keyboard occlusion | Tap input, keyboard opens; is the field visible? | #1 Visibility | Active input hidden behind keyboard |
| S4 | Tab bar content clipping | Scroll FlatList to last item | #8 Minimalist | Bottom card partially hidden behind tab bar |
| S5 | Large text breakage | Enable Accessibility → largest font size | #4 Consistency | Labels wrap; containers clip; icons misalign |
| S6 | Platform shadow mismatch | Compare iOS and Android screenshots | #4 Consistency | Cards flat on Android, lifted on iOS (or vice versa) |
| S7 | Gesture conflict | Try swipe on a SwipeRow inside a ScrollView | #3 User Control | Swipe opens but also scrolls; one gesture cancels the other |
| S8 | JS-thread jank | Trigger animation while scrolling a long list | #1 Visibility | Animation stutters; 60fps drops below 30fps |
| S9 | Wrapping label / CTA | Screenshot at 360×800 | #4 Consistency, Fitts's | Button text breaks to 2 lines at compact width |
| S10 | Information duplication | Step 3.5c scan | #8 Minimalist | Same count/status shown 2–3× on one screen |
| S11 | Wrapper-collapsed tiles | Step 3.5a onLayout measurements | #4 Consistency | Grid tiles uneven; some narrower than expected |
| S12 | Dead conditional slot | Step 3.5b zero-state probe | #8 Minimalist | Reserved space for absent illustration/media |
| S13 | Active-state mass mismatch | Compare active vs inactive tab/dock items | #4 Consistency | Active tab uses full-cell background fill — looks 1.5× heavier |
| S14 | Brand-color competition | Count brand-tinted elements per zone | Visual hierarchy | Multiple brand-colored surfaces in one region; CTA loses scent |
| S15 | Monochromatic surface | Step 3.5d category squint | #1 Visibility, #6 Recognition | Tier-A app with tier-D /5–/8 tints; tiles all same neutral |
| S16 | Left-anchored stacked cards | Screenshot | #4 Consistency | Every card full-width, every label left; no horizontal balance |
| S17 | Missing Android ripple | Tap Pressable on Android with ripple=null | #1 Visibility | No visual feedback on Android tap |
| S18 | Double safe-area inset | Check wrapper chain for 2× useSafeAreaInsets | #4 Consistency | Extra gap at top/bottom; ScreenBackButton appears too low |

---

## Step 5 — Heuristic Map

For each pain, name the violated heuristic. A pain that cannot be tied to
a heuristic is probably a personal taste call — defer it.

| # | Pain | NN/g # | RN failure mode | Why it violates |
|---|------|--------|-----------------|-----------------|
| 1 | Back button overlaps title | #4 Consistency | N13 (double inset) | Two inset additions produce layout inconsistency |
| 2 | Streak shown twice | #8 Minimalist | S10 (info duplication) | Redundant copies fragment attention |
| 3 | Tab bar clips FlatList | #1 Visibility | N4 (tab bar clipping) | System-status element (tab bar) hides content |
| 4 | CTA wraps at 360px | #4 Consistency, Fitts | S9 (wrapping CTA) | Hit-target shape unstable across screen widths |
| 5 | All tone cards same neutral | #1 Visibility, #6 Recognition | S15 (monochromatic) | Category signal hidden; user must read every label |

---

## Step 6 — Primitive Match (no inventions)

For each fix, match an existing primitive or token:

| # | Fix | Primitive / token | File |
|---|-----|-------------------|------|
| 1 | Remove double inset | ScreenContainer already applies insets; remove the extra `useSafeAreaInsets().top` from the child | ScreenName.tsx |
| 2 | Delete duplicate streak display | Remove the footer strip; keep the hero badge (most actionable placement) | HomeScreen.tsx |
| 3 | Add `contentInsetAdjustmentBehavior` or `contentInset` to FlatList | `FlatList` prop | ScreenName.tsx |
| 4 | Abbreviate CTA label or use `numberOfLines={1}` + icon | existing `Button` primitive | ScreenName.tsx |
| 5 | Bump tile tint from `/8` to `/20` + ring | design-token constants from `@org/design-tokens` | tile component |

**If a fix would add a new primitive, stop and ask: "could this be a variant on
an existing component?" Almost always: yes.**

### 6b — Primitive-First Patch Decision

Same rule as `enhance-web-ui` — fix the wrapper, not the consumer:

```
Does the bug appear on more than one screen?
├── Yes → Walk UP the component tree. Find the first shared component
│         that hosts the bug. If ≥ 3 screens use it → fix at the primitive.
└── No  → Fix at the consumer. Document: "if a 2nd screen reuses this
          pattern, move the fix to the primitive."
```

Concrete RN cues that the primitive is broken:

- `FlatList` on 3 screens all missing `contentInset` → add it to a shared `ScreenList` wrapper.
- Every `Pressable` in the codebase has `hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}`
  copy-pasted → make it the default in a `TouchablePrimitive` wrapper.
- Every screen's `Text` for metadata has `fontSize: 12, color: theme.colors.secondary` inline
  → create a `MetaText` primitive.

---

## Step 7 — Enhancement Plan

A single, reviewable table ordered by impact / risk:

```
| Pri | File | Change | Heuristic | Risk |
|-----|------|--------|-----------|------|
| 1   | components/layout/ScreenContainer.tsx | Audit: confirm it handles all four safe-area edges | #1 | low |
| 2   | screens/home/HomeScreen.tsx | Remove duplicate streak display in footer | #8 | low |
| 3   | screens/home/HomeScreen.tsx | Add contentInset={{ bottom: tabBarHeight }} to FlatList | #1 | low |
| 4   | components/ui/Button.tsx | Add numberOfLines={1} to label; abbreviate if > 18 chars on compact | #4 | low |
| 5   | components/orchard/ToneCard.tsx | Bump bg tint /8 → /20, add ring-tone/30 | #1, #6 | low |
```

---

## Step 8 — Implement (smallest possible diffs)

Rules during implementation:

1. **Safe area first.** Audit the wrapper chain before any visual work. Getting
   the safe area right unlocks the rest of the layout.
2. **One concern per edit.** Layout change separate from colour change separate
   from animation change.
3. **No hex literals.** Use `theme.colors.*`, `withAlpha(theme.colors.X, n)`,
   or named constants from `@org/design-tokens`. The ESLint
   `no-restricted-syntax` rule should catch violations.
4. **Platform shadows in both props.** Every `View` that should cast a shadow
   needs both the iOS `shadow*` props AND `elevation` for Android:
   ```tsx
   style={{
     // iOS
     shadowColor: theme.colors.shadow,
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.12,
     shadowRadius: 8,
     // Android
     elevation: 4,
   }}
   ```
5. **`hitSlop` not visual inflation.** Touch targets ≥ 44×44pt achieved via
   `hitSlop`, negative-margin wrappers, or a pressable region sized for the
   thumb — never by making the visible element 44×44.
6. **`useNativeDriver: true` on every Animated call.** Unless the animation
   changes layout properties (width, height, padding — which are JS-only),
   always add `useNativeDriver: true`. This moves the animation to the UI
   thread and prevents jank.
7. **`numberOfLines` + `ellipsizeMode` on all single-line labels.** Prevents
   wrapping at compact screen widths.
8. **Match colour saturation to domain tier.** Tier A/B needs `/15–/25` tints
   with `/30–/40` rings to read as semantic categories at a squint. See
   `§1.5 Domain Colour Tier`.
9. **Collapse conditional slots when empty.** `{slot && <Wrapper>{slot}</Wrapper>}`.
   Never pay vertical real estate for absent content.
10. **Delete duplicate datums; replace with complementary data.** When the same
    number appears twice on one screen, keep the most actionable placement and
    replace the other with a sibling datum.
11. **`accessibilityLabel` and `accessibilityRole` on all interactive elements.**
    VoiceOver (iOS) and TalkBack (Android) need explicit labels for non-text
    Pressables. `role="button"` on custom Pressables.
12. **Respect `ReduceMotion` in every animation.**
    ```tsx
    const { reduceMotionEnabled } = useReduceMotion(); // or useAnimatedStyle
    const animValue = withTiming(to, {
      duration: reduceMotionEnabled ? 0 : 300,
    });
    ```

After every meaningful edit: `npm run rn:typecheck` + `npm run rn:lint` on
modified files. Fix anything you introduced before moving on.

---

## Step 9 — Verify

### 9a. Three-device re-screenshot

Re-take the screenshots from Step 3a. Compare side-by-side with the originals.
Check: no wrapped labels, no clipped content, no overlapping elements,
safe area correct on notched device.

### 9b. Re-run the device forensics gates

| Gate | What to re-check | Pass criterion |
|------|-----------------|----------------|
| Measurement | `onLayout` widths of every repeated element you fixed | Spread ≤ 2dp per group |
| Conditional slot | Zero-state render of every slot you touched | No `minHeight` reservation for absent content |
| Dup-datum | Each screen | Every datum appears exactly once |
| Category squint | Standard-phone screenshot at 10–15px blur | Tier-A/B: distinct colour blobs. Tier-C/D: near-uniform achromatic |
| Large text | Enable Accessibility → max font size | No overflow, no clipped labels |
| Keyboard | Tap every input | Active field stays above keyboard |
| Safe area | Screenshot at top and bottom edges | No content under status bar or home indicator |

### 9c. iOS CI gate

For any change that affects a screen's layout, navigation, or safe-area
handling, trigger the iOS CI build (`.github/workflows/build-mobile-rn.yml`)
and install via TestFlight. Do NOT claim "iOS verified" from the Android
emulator alone.

---

## Hidden Failure Modes — RN-Specific (N1–N15)

These are the "difficult-to-spot" patterns for React Native screens. When
feedback is vague-but-visceral ("button is too far down", "can't reach that",
"jank", "looks like a web page"), walk this list first.

### N1. Safe area inset violation

**Symptom:** Content hidden under the status bar, Dynamic Island, or home
indicator. Users can't tap the top CTA. Text is partially invisible.

**Detection:** Take a screenshot on a notched device (iPhone 14 Pro or
later, any Dynamic Island model) or an Android phone with a status bar.
Does the top of the content region start *below* the status bar? Does the
bottom CTA sit *above* the home indicator (iOS) or system navigation bar (Android)?

**Fix shape:** Wrap the screen root in `<SafeAreaView edges={['top','bottom']}>` or
consume `useSafeAreaInsets()` at the layout root. In repos with a
`ScreenContainer` primitive, verify it applies all four edges. Do NOT add
insets a second time inside the content — see N13.

---

### N2. Touch target below platform minimum

**Symptom:** Users mis-tap icon buttons, especially on smaller phones. Reported
as "hard to press" or silently as abandoned actions. Most common on close/dismiss
icons, navigation arrows, and inline quick-action buttons.

**Detection:** Add a temporary `onLayout` to the `Pressable` and log its
`width × height`. Apple HIG minimum: 44×44pt. M3 minimum: 48×48dp.
Visual icons are typically 20–28dp — they almost always need `hitSlop`.

**Fix shape:**
```tsx
// Wrong — visual chrome sized for the touch target
<Pressable style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: ... }}>
  <Icon size={20} />
</Pressable>

// Correct — icon is visually correct; touch area extended invisibly
<Pressable
  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
  style={{ width: 24, height: 24 }}
>
  <Icon size={20} />
</Pressable>
```

Or use a Pressable region sized for the thumb (44×44) with `alignItems/justifyContent: 'center'`
and a smaller visual indicator inside. The point is: **visual chrome ≠ touch target**.

---

### N3. Keyboard occlusion on input screens

**Symptom:** Tapping a text input on a form screen causes the keyboard to
slide up and cover the input. User must scroll manually or cannot see what
they're typing.

**Detection:** Open the screen, tap the first input, observe whether the
active field is above the keyboard.

**Fix shape:** Wrap the screen content in `KeyboardAvoidingView`:
```tsx
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <ScrollView keyboardShouldPersistTaps="handled">
    {/* inputs here */}
  </ScrollView>
</KeyboardAvoidingView>
```

For complex nested scrolls: `react-native-keyboard-controller` (preferred for New
Architecture) or `react-native-keyboard-aware-scroll-view`. Ensure the
`ScrollView` has `keyboardShouldPersistTaps="handled"` so tapping a button
above the keyboard doesn't dismiss it unexpectedly.

---

### N4. Tab bar obscuring bottom content

**Symptom:** The last row of a FlatList or the bottom section of a
ScrollView is permanently hidden behind the tab bar. Users can't reach
the last card.

**Detection:** Scroll to the very bottom of the list. If the last item
is only 50% visible, the scroll content is not accounting for the tab
bar height.

**Fix shape:**
```tsx
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

function ScreenWithList() {
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      contentInset={{ bottom: tabBarHeight }}           // iOS
      contentContainerStyle={{ paddingBottom: tabBarHeight }} // Android
      scrollIndicatorInsets={{ bottom: tabBarHeight }}
    />
  );
}
```

Or apply via `ScreenContainer`'s `scrollInset` prop if your repo abstracts
this. Fix once at the shared list primitive so all screens benefit.

---

### N5. Text truncation at large dynamic type sizes

**Symptom:** On iOS with Accessibility → Display & Text Size → Larger Text
enabled (or on Android with a very large system font size), row labels wrap
to 2 lines, containers clip content, and grid cards overflow their bounds.

**Detection:** Enable the largest system font size in Settings (iOS:
Accessibility → Larger Text → max slider; Android: Settings → Font size
→ largest). Reload the app. Screenshot every screen.

**Fix shape:**
- Never set a fixed height on a `View` that contains `Text` that users type
  or that comes from data (variable length).
- For labels that *must* stay on one line: `numberOfLines={1}` +
  `ellipsizeMode="tail"` + `adjustsFontSizeToFit={true}` (iOS) or cap
  with `maxFontSizeMultiplier` on the `Text`:
  ```tsx
  <Text numberOfLines={1} maxFontSizeMultiplier={1.5}>
    {label}
  </Text>
  ```
- For icons next to labels: use a `flexShrink: 1` on the text container so
  it yields space to a fixed-width icon, not the other way around.

---

### N6. Platform shadow inconsistency (iOS vs Android)

**Symptom:** Cards appear lifted on iOS but flat on Android (or vice versa),
making the visual hierarchy differ between platforms.

**Detection:** Compare iOS and Android screenshots of the same screen. If
card depth / elevation reads differently, the shadow props are incomplete.

**Fix shape:** Always apply both the iOS shadow set AND `elevation` for Android:
```tsx
const cardShadow = {
  // iOS
  shadowColor: theme.colors.shadow, // use the token, never '#000'
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.10,
  shadowRadius: 6,
  // Android
  elevation: 3,
};
```
Note: `elevation` on Android also creates a clipping region. If the card has
rounded corners, add `overflow: 'hidden'` to prevent the elevation shadow
from leaking past the rounded boundary on older Android versions.

---

### N7. Gesture conflict (horizontal swipe vs vertical scroll)

**Symptom:** Trying to swipe a row action (delete, archive) also triggers
vertical scrolling. Or: the React Navigation swipe-back gesture conflicts
with an in-screen horizontal PanGestureHandler.

**Detection:** Wrap a `PanGestureHandler` (or `SwipeableRow`) inside a
`ScrollView` and test: does swiping horizontally also scroll the list?
Does the iOS swipe-back gesture (from the left edge) conflict with
an in-screen swipe?

**Fix shape — list row swipe:**
```tsx
<PanGestureHandler
  activeOffsetX={[-10, 10]}   // must move 10dp horizontally before gesture activates
  failOffsetY={[-5, 5]}        // fail if user moves vertically first (yields to scroll)
>
  <Animated.View>...</Animated.View>
</PanGestureHandler>
```

**Fix shape — navigation swipe-back conflict:**
Use `gestureEnabled: false` on the screen that owns the conflicting gesture,
or use `simultaneousHandlers` to let both fire and filter in the gesture
handler's `onGestureEvent`.

---

### N8. Missing press feedback on Android

**Symptom:** Tapping a `Pressable` on Android produces no visual feedback.
The action fires but there's no ripple or press state. Users can't tell if
the tap registered.

**Detection:** Tap any tappable element on the Android emulator with the
touch indicator overlay on (Developer Options → Show tap locations). Does a
ripple or press state appear? If not, `android_ripple` is missing or `null`.

**Fix shape:**
```tsx
<Pressable
  android_ripple={{ color: withAlpha(theme.colors.primary, 0.12), borderless: false }}
  style={({ pressed }) => [
    styles.item,
    pressed && Platform.OS === 'ios' && { opacity: 0.7 }, // iOS press state
  ]}
>
  {children}
</Pressable>
```

If your repo has a `TouchablePrimitive`, add these defaults once there.

---

### N9. Back button / swipe-back leaves stale screen state

**Symptom:** Navigate to a screen, fill a form, tap Android hardware back.
Return to the same screen — the form is not reset. Or: a counter that should
reset on `focus` still shows the old value.

**Detection:** Navigate to the screen, mutate state, press back, re-navigate
to the screen. Does the screen show fresh data?

**Fix shape:**
```tsx
// Subscribe to focus events to reset or re-fetch
useFocusEffect(
  useCallback(() => {
    // reset form or refetch data
    return () => { /* cleanup on blur */ };
  }, [])
);
```

Note: `useEffect(() => {}, [])` runs only on mount — it does NOT re-run when
navigating back to the screen. Always use `useFocusEffect` for screen-scoped
side effects that should run on every visit.

---

### N10. JS-thread animation jank

**Symptom:** Animations stutter or drop frames, especially when they run
concurrently with a heavy JS operation (list render, API fetch, state update).
Visible as choppy transitions, spring animations that lag behind touch input.

**Detection:** Toggle the Perf Monitor in the developer menu (Shake → Perf
Monitor or `adb shell input keyevent 82`). Does the JS FPS drop to < 50fps
during the animation? If yes, the animation is running on the JS thread.

**Fix shape:**
1. Add `useNativeDriver: true` to all `Animated.spring` / `Animated.timing`
   calls that only animate `transform` and `opacity` (not layout props).
2. For layout animations, use `LayoutAnimation.configureNext()` (runs on UI
   thread for the next single layout pass).
3. For complex, gesture-driven animations: migrate to Reanimated 3
   worklets — these run entirely on the UI thread and are immune to JS jank.

```tsx
// Avoid
Animated.spring(anim, { toValue: 1, useNativeDriver: false }); // JS thread

// Prefer
Animated.spring(anim, { toValue: 1, useNativeDriver: true });  // UI thread

// Best for gesture-driven
const anim = useSharedValue(0);
const style = useAnimatedStyle(() => ({
  transform: [{ translateX: anim.value * 100 }],
}));
// anim.value = 100; (worklet, runs on UI thread)
```

---

### N11. FlatList / SectionList re-rendering every row on scroll

**Symptom:** Scrolling a list is janky. Profiling shows every row
re-rendering on each scroll event, not just the rows entering the viewport.

**Detection:** In React DevTools Profiler (or add `console.log('row rendered', item.id)`
inside the row component), scroll the list. If all rows log on every scroll,
renderItem is not memoized.

**Fix shape:**
```tsx
// Memoize the row component
const Row = React.memo(({ item }) => <View>...</View>);

// Memoize renderItem
const renderItem = useCallback(
  ({ item }) => <Row item={item} />,
  []  // stable reference; no deps unless renderItem logic depends on something
);

// Stable keyExtractor
const keyExtractor = useCallback((item) => item.id.toString(), []);

// For very long lists, consider FlashList (Shopify) instead of FlatList —
// it recycles cells and dramatically reduces re-render cost.
```

Also: avoid inline anonymous functions in `renderItem` and `keyExtractor` —
they create new references on every render and defeat memoization.

---

### N12. Skia / GPU component re-renders unnecessarily

**Symptom:** An animated or Skia-rendered component (background gradient,
canvas drawing, particle system) updates on every parent state change,
causing unnecessary GPU repaints and battery drain.

**Detection:** Wrap the Skia component in `React.memo` and add a
`console.log('skia re-render')` inside. Does it log on every keystroke in
an input above it? If yes, it's not properly isolated.

**Fix shape:**
- Wrap the component in `React.memo` with a custom comparator if the
  props are complex objects.
- Drive Skia parameters via Reanimated `SharedValue` — changes to a
  `SharedValue` do NOT cause React re-renders. Only the Skia canvas
  re-paints.
- Gate expensive GPU effects behind `PerformanceProvider` — only render
  them when the device is capable (check `useDeviceCapabilities()`).

```tsx
// Drive animation without causing React re-render
const progress = useSharedValue(0);
// progress.value = 0.8;  ← no re-render, just repaints the Skia canvas

const SkiaBackground = React.memo(() => (
  <Canvas style={StyleSheet.absoluteFill}>
    <AnimatedRect progress={progress} />
  </Canvas>
));
```

---

### N13. Double safe-area inset (the wrapper-chain trap)

**Symptom:** Unexpected large gap at the top of the screen. A custom header
sits too far below the status bar. `ScreenBackButton` appears in the wrong
position. Reported as "the back button is too low" or "why is there so much
empty space at the top?"

**Detection:** Walk the wrapper chain from the top-level navigator screen
option down to the child view. Count how many of these are in the chain:
`useSafeAreaInsets()`, `<SafeAreaView>`, `<SafeAreaProvider>`,
`useSafeAreaFrame()`, a `ScreenContainer` that applies `paddingTop: insets.top`.

If the count is ≥ 2 and they both affect the same edge, you have double-counting.

**Fix shape:** Pick ONE place to apply safe-area insets per edge — typically
the outermost `ScreenContainer` or layout wrapper. Children must not apply
their own insets unless they explicitly need to handle an edge the parent
does *not* cover.

Concretely: if `ScreenContainer` already pads `top: insets.top`, then
`ScreenBackButton` must use `top: 8` — NOT `top: 8 + insets.top`. Document
this in the `ScreenContainer` component header.

---

### N14. Deep link navigates to wrong stack depth

**Symptom:** Opening a deep link from cold start lands on the correct screen
but the back button does nothing (pops to blank), or navigates to an unrelated
screen. Swiping back from the deep-linked screen exits the app entirely.

**Detection:** Kill the app completely. Trigger the deep link via ADB:
```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "yourscheme://screen/id123"
```
Press back. Where do you land?

**Fix shape:** Deep links must initialise the full navigation stack above
the target screen. In React Navigation's linking config, use `initialRouteNames`
or provide the `screens` nesting that mirrors the full stack shape:

```ts
// linking.ts
const linking = {
  screens: {
    HomeStack: {
      screens: {
        StudyScreen: {
          path: 'study/:lessonId',
          // Deep-linking here initialises HomeStack so back works correctly
        },
      },
    },
  },
};
```

Validate with a test — see `linking-coverage.test.ts` in repos that enforce this.

---

### N15. Tab-switch animation competing with screen entrance animation

**Symptom:** Switching tabs shows a flash of blank before the incoming screen
appears, or two animations run simultaneously producing a double-fade or
z-index conflict.

**Detection:** Rapidly switch between tabs. Does the incoming screen flash
white before its content appears? Does the transition look "doubled"?

**Fix shape:** React Navigation's native stack (`react-native-screens`) handles
the screen entrance animation at the OS level. Do NOT add a JS-side
`Animated.View` or Reanimated entrance animation to the screen's root View —
this creates two simultaneous animations on the same layer.

If a screen needs a content-reveal animation (e.g. staggered list items),
trigger it in `useFocusEffect`, not in a `useEffect([], [])` mount effect.
Mount effects run once and don't re-trigger when a tab is revisited.

---

## Pattern Library

### Safe Area Wrapper Chain (correct)

```
Navigator (headerShown: false)
└── ScreenContainer (applies insets.top + insets.bottom)
    ├── BlurHeader (top: 0 — ScreenContainer already padded)
    ├── ScrollView (contentInsetAdjustmentBehavior: 'automatic' on iOS)
    └── FloatingCTA (bottom: 16 — ScreenContainer already padded)
```

ScreenBackButton: `top: 8` flat. NOT `top: 8 + insets.top`.

### Correct Touch Target Shape

```tsx
// Visual: 24×24 icon
// Touch: 44×44pt via hitSlop
<Pressable
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  onPress={onPress}
  android_ripple={{ color: withAlpha(theme.colors.primary, 0.12) }}
>
  <Icon name="close" size={24} color={theme.colors.foreground} />
</Pressable>
```

### FlatList with Tab Bar Clearance

```tsx
const tabBarHeight = useBottomTabBarHeight();

<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  contentInset={{ bottom: tabBarHeight }}
  contentContainerStyle={{ paddingBottom: tabBarHeight }}
  scrollIndicatorInsets={{ bottom: tabBarHeight }}
  removeClippedSubviews   // Android performance
  maxToRenderPerBatch={10}
  initialNumToRender={12}
/>
```

### Platform-Correct Shadow

```ts
const shadow = StyleSheet.create({
  card: {
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
});
```

### Reanimated 3 Reduced Motion

```tsx
import { useReducedMotion } from 'react-native-reanimated';

function AnimatedChip({ active }) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{
      scale: withSpring(active ? 1.04 : 1, {
        duration: reduceMotion ? 0 : 300,
      }),
    }],
  }));

  return <Animated.View style={[styles.chip, style]} />;
}
```

---

## Motion Rules

- **Direct feedback** (tap confirmation, toggle): 100–180ms
- **Small state change** (counter increment, pill swap): 180–260ms
- **Screen entrance / large spatial transition**: 220–360ms (or defer to native stack)
- **Prefer `withSpring`** for anything the user drags (gesture-driven).
- **Prefer `withTiming` ease-out** for programmatic state changes.
- **Never animate layout props** (`width`, `height`, `padding`, `margin`) with
  `useNativeDriver: true` — they require the JS thread. Use `LayoutAnimation`
  or Reanimated `useAnimatedStyle` with `transform` equivalents instead.
- **Always check `useReducedMotion()`** (Reanimated) or
  `AccessibilityInfo.isReduceMotionEnabled()` and set `duration: 0` when true.
- Motion must answer at least one question:
  - Did my action work? (tap feedback)
  - What changed? (state transition)
  - Where did this come from / go? (spatial relationship)
  - What can I interact with? (affordance signal)

---

## Quick Sanity Checks Before You Stop

- [ ] Safe-area wrapper chain audited; insets applied exactly once per edge.
- [ ] Every `Pressable` / `TouchableOpacity` has a minimum 44×44pt touch area
      (via `hitSlop` or explicit size; NOT by inflating visual chrome).
- [ ] Every text input screen tested with keyboard open; active field visible.
- [ ] FlatList bottom content not clipped by tab bar (`contentInset` applied).
- [ ] Large-text (Accessibility max font size) tested; no overflow or clipping.
- [ ] Platform shadow applied in both iOS `shadow*` props AND Android `elevation`.
- [ ] Every `Animated.spring/timing` has `useNativeDriver: true` (or justified exception).
- [ ] Every `Pressable` on Android has `android_ripple` (or justified exception).
- [ ] `useFocusEffect` used for screen-scoped data fetching / form resets (not `useEffect([], [])`).
- [ ] `renderItem` memoized with `useCallback`; row component wrapped in `React.memo`.
- [ ] `useReducedMotion()` / `AccessibilityInfo.isReduceMotionEnabled()` respected.
- [ ] `accessibilityLabel` and `accessibilityRole` set on all non-text Pressables.
- [ ] Domain colour tier identified (A/B/C/D) and applied consistently.
- [ ] Primary content obvious at a hierarchy squint (first eye target).
- [ ] Tier-A/B: categories distinguishable at a category squint (colour alone).
- [ ] No datum (number, word, date, status) appears more than once on the same screen.
- [ ] Every conditional slot tested in zero-state; no dead `minHeight` floors.
- [ ] At least one piece of trailing/right-anchored metadata per stacked card row.
- [ ] Repeated-element `onLayout` measurements within 2dp of each other.
- [ ] Repeating bug patched at the shared primitive, not every consumer screen.
- [ ] `rn:typecheck` and `rn:lint` pass on all modified files.
- [ ] Android emulator screenshots taken at 360×800, 412×917, 430×932 (or platform equivalent).
- [ ] iOS CI triggered for any change affecting layout, safe area, or navigation.

### Hidden failure-mode audit (RN-specific)

- [ ] **N1 safe area**: content starts below status bar; home indicator not covered.
- [ ] **N2 touch target**: every `Pressable` ≥ 44×44pt via `hitSlop` or size.
- [ ] **N3 keyboard**: active input visible above keyboard on all input screens.
- [ ] **N4 tab bar**: FlatList last item scrollable above tab bar.
- [ ] **N5 large text**: no overflow or clipping at max system font size.
- [ ] **N6 shadow**: card depth consistent on iOS and Android.
- [ ] **N7 gesture conflict**: `activeOffsetX` / `failOffsetY` on swipeable rows inside scroll views.
- [ ] **N8 Android ripple**: every `Pressable` has `android_ripple` or documents why not.
- [ ] **N9 stale screen state**: `useFocusEffect` used (not `useEffect([])`); data resets on re-visit.
- [ ] **N10 JS-thread animation**: `useNativeDriver: true` on all `Animated` calls.
- [ ] **N11 FlatList re-renders**: `renderItem` and row component memoized; logged render count ≤ visible rows.
- [ ] **N12 Skia / GPU**: Skia components wrapped in `React.memo`; driven by `SharedValue`, not state.
- [ ] **N13 double safe-area inset**: wrapper chain has insets applied exactly once per edge.
- [ ] **N14 deep link stack depth**: back after cold-start deep link lands on correct parent screen.
- [ ] **N15 tab-switch animation**: no JS entrance animation on the screen root competing with native stack transition.

### Repo health

- [ ] Lint and typecheck pass for all touched files.
- [ ] Three-config screenshots show no clipping, no overlap, no wrapped labels.
- [ ] Write-up table maps each pain → heuristic → primitive → file → after behaviour.

---

## When Not To Use This Skill

- **Web / PWA surface (Next.js, browser)** → use `enhance-web-ui` + `enhance-web-ux`.
- **Hybrid web app (Capacitor, Ionic, RN-Web)** with web and native surfaces → use
  `enhance-capacitor-ui` first (separates the axis architecture), then this skill
  for the native-specific polish.
- **Pure UX audit (no code changes)** → use `audit-ux` or `audit-uiux-design-system`.
- **Brand-new screen from scratch** → use `design-frontend` for the web equivalent;
  there is no dedicated "native greenfield" skill — start from the repo's `HubScreen`
  / `ScreenContainer` primitive and the design tokens.
- **Single-line bug fix** (e.g. wrong colour on one element) → just fix it.
- **Performance profiling and optimisation** beyond the basics in N10–N12 →
  use Flipper / Android Studio Profiler / Xcode Instruments directly.

---

## Companion Skills

- [`start-emulator`](../start-emulator/SKILL.md) — bring up the Android emulator
  dev loop cleanly; run this first before taking screenshots.
- [`test-emulator`](../test-emulator/SKILL.md) — full QA walk on the emulator;
  use after this skill to verify the enhanced screen end-to-end.
- [`enhance-web-ui`](../enhance-web-ui/SKILL.md) — web companion for the same
  composition and colour-tier principles. The H1–H16 hidden failure modes there
  catalogue *web-specific* bugs; many of the underlying principles (active-state
  mass, brand-color budget, monochromatic tier mismatch, information duplication,
  left-anchored stacks) apply to RN with adapted detection probes.
- [`enhance-web-ux`](../enhance-web-ux/SKILL.md) — web companion for heuristic-
  driven task-flow improvements. The NN/g heuristic framework and content-rank
  methodology apply identically to RN screens.
- [`enhance-capacitor-ui`](../enhance-capacitor-ui/SKILL.md) — prerequisite for
  hybrid apps (Capacitor / Ionic / RN-Web) that ship both a web PWA and a native
  shell from the same codebase. Establishes the three-axis architecture (form
  factor / platform / pointer) before per-surface polish.

---

## Research Anchors

- **Apple Human Interface Guidelines — Layout and Adaptivity**:
  44×44pt minimum touch target, safe-area handling, Dynamic Island insets,
  adaptive layout patterns for iPhone and iPad.
  <https://developer.apple.com/design/human-interface-guidelines/layout>
- **Apple Human Interface Guidelines — Accessibility**:
  `accessibilityLabel`, `accessibilityRole`, Dynamic Type, Reduce Motion,
  minimum legibility sizes.
  <https://developer.apple.com/design/human-interface-guidelines/accessibility>
- **Material Design 3 — NavigationBar spec**: active indicator is a 64×32
  `cornerFull` pill in `SecondaryContainer` colour wrapping the icon — never
  a full-cell fill. Reference for N-S13 active-state mass.
  <https://m3.material.io/components/navigation-bar/overview>
- **Material Design 3 — Touch Targets**: 48×48dp minimum for all interactive
  controls; use a 48×48dp `box` with padding to achieve target size without
  changing visual size.
  <https://m3.material.io/foundations/interaction/states/overview>
- **React Native — Reanimated 3 — useReducedMotion**:
  `useReducedMotion()` hook returns `true` when the user has enabled Reduce
  Motion; animations should set `duration: 0` or skip entirely.
  <https://docs.swmansion.com/react-native-reanimated/docs/device/useReducedMotion>
- **React Native — New Architecture (Fabric) — Layout**:
  `useSafeAreaInsets()` via `react-native-safe-area-context` is the correct
  way to consume safe-area data in Fabric; direct `SafeAreaView` can cause
  double-inset in nested navigators.
  <https://reactnative.dev/docs/the-new-architecture/landing-page>
- **React Navigation — Linking**:
  Deep-link config must mirror the full nested navigator shape so cold-start
  links initialise the correct parent stack.
  <https://reactnavigation.org/docs/deep-linking>
- **React Navigation — `useFocusEffect`**:
  Runs on every screen focus (not just mount). Use for data re-fetching,
  form resets, and analytics events that must fire on every visit.
  <https://reactnavigation.org/docs/use-focus-effect>
- **Shopify — FlashList**:
  `RecyclerListView`-based replacement for `FlatList` with significantly
  reduced re-render count and memory footprint for large lists.
  <https://shopify.github.io/flash-list/>
- **Shopify — react-native-skia**:
  Skia-based drawing surface that runs on both the JS thread and a dedicated
  GPU thread. Drive parameters via Reanimated `SharedValue` to avoid React
  re-renders. Reference for N12.
  <https://shopify.github.io/react-native-skia/>
- **NN/g — Visual Hierarchy in UX**:
  Contrast, scale, grouping, and whitespace guide focus; squint with 5–10 px
  blur to verify intended hierarchy. Platform-agnostic; applies to native
  screens exactly as to web pages.
  <https://www.nngroup.com/articles/visual-hierarchy-ux-definition/>
- **NN/g — Recognition over Recall (#6)**:
  Users should not need to remember information — category colour, icon
  shape, and position should signal meaning without reading labels.
  Primary reason for tier-A vibrant palettes on learning apps.
  <https://www.nngroup.com/articles/ten-usability-heuristics/>
- **Duolingo — Core Tabs Redesign + Gamification as Design Language**:
  Reference for tier-A vibrant semantic palettes (green=correct, red=hearts,
  orange=streak). Each colour carries system meaning; muted palettes undermine
  the gamification signal. Canonical tier-A reference for §1.5.
  <https://blog.duolingo.com/core-tabs-redesign/>
