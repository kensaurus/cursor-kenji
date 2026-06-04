---
name: mobile-rn-performance
description: Fix React Native / Expo performance, build, and upgrade issues. Use for jank, frame drops, slow startup, large bundles, memory leaks, Hermes, FlashList, Reanimated, Turbo Modules, Android 16KB alignment, or RN/Expo version upgrades.
license: MIT
---

# React Native Performance & Build

> The performance, bundling, and upgrade layer for React Native / Expo. `mobile-rn-screen` handles screen layout and native feel; this skill handles *speed, size, and version moves*.
>
> Distilled from [Callstack's React Native best-practices skill](https://github.com/callstackincubator/agent-skills) (MIT) and the Ultimate Guide to RN Optimization.

## Diagnose first, then fix
Never optimize blind. Identify the symptom, then apply the matching category. Measure before/after.

| Symptom | Category | Impact |
|:--------|:---------|:-------|
| Janky scroll/animation, dropped frames | FPS & re-renders | CRITICAL |
| Large download / install size | Bundle size | CRITICAL |
| Slow cold start (high TTI) | TTI / startup | HIGH |
| Slow native operations | Native performance | HIGH |
| Memory grows over time / crashes | Memory management | MED-HIGH |
| Choppy gestures/transitions | Animations | MEDIUM |

## 1. FPS & re-renders (CRITICAL)
- Profile with React DevTools + the RN perf monitor before changing code. Find the component re-rendering, don't guess.
- Memoize hot paths: `React.memo`, `useMemo`, `useCallback` — but only where a profile shows wasted renders (over-memoization adds its own cost).
- Stable references: don't create new objects/arrays/functions inline in props of list rows or memoized children.
- **Lists:** use `FlashList` (Shopify) over `FlatList` for long/heterogeneous lists. Provide stable `keyExtractor`, avoid anonymous `renderItem` closures, and give size hints. A FlatList re-render storm is the #1 RN list perf bug.
- Move continuous values (scroll, gesture, animation) off React state — see Animations.

## 2. Bundle & app size (CRITICAL)
- Enable Hermes (default on modern RN) — smaller, faster startup.
- Audit the bundle: tree-shake, avoid pulling whole libraries for one function, lazy-load heavy screens.
- Ship per-architecture / split APKs; drop unused locales and assets.
- **Android 16KB page-size alignment** — required for Google Play; verify all third-party native libs are aligned or builds get rejected.

## 3. TTI / startup (HIGH)
- Defer non-critical work past first paint (analytics, feature flags, heavy init).
- Lazy-init native modules; don't block the JS thread on startup.
- Measure TTI on a real low-end device, not a flagship or simulator.

## 4. Native performance (HIGH)
- Prefer native (Turbo Modules / JSI) over JS polyfills for hot, frequent operations.
- Minimize bridge traffic: batch calls, avoid chatty per-frame round-trips.
- Profile with Xcode Instruments / Android Studio profiler for native hotspots.

## 5. Memory (MED-HIGH)
- Clean up listeners, timers, and subscriptions in effect cleanup. Leaked listeners are the common JS leak.
- Watch image caches and large in-memory data; page or virtualize.
- Profile native leaks with platform tools when JS looks clean.

## 6. Animations (MEDIUM)
- Use `react-native-reanimated` on the **UI thread** (`useSharedValue` / `useAnimatedStyle` / worklets). Never drive continuous animation through `setState` — it re-renders the tree every frame and collapses FPS.
- Use the native driver for `Animated` when staying on the core API.

## React Native / Expo upgrades
- Use the official **RN Upgrade Helper** diff for the exact version jump; apply native-side changes (`android/`, `ios/`, Podfile, Gradle) deliberately — these are where upgrades break.
- Bump Expo SDK via `expo install --fix`; align all `expo-*` and third-party native deps to the SDK's supported ranges.
- After upgrade: clean caches (`watchman watch-del`, Metro cache, Pods, Gradle), rebuild, and smoke-test on both platforms via `mobile-emulator-test`.
- For Linux/Windows devs: iOS-affecting upgrade changes verify on **macOS CI**, not locally.

## Definition of done (RN perf)
- [ ] Measured before/after on a real device (numbers, not vibes).
- [ ] The fix targets the profiled hotspot, not a guess.
- [ ] No new re-render storms introduced (re-profile the changed screen).
- [ ] Android 16KB alignment holds if native libs changed.
- [ ] Both platforms still build and run.

## Composes with
- `mobile-rn-screen` — layout, safe-area, touch-target, native feel.
- `mobile-emulator-start` / `mobile-emulator-test` — boot + on-device verification.
- `workflow-spec-workflow-spec-tdd` — spec + test the perf fix so it doesn't regress.
- `enhance-capacitor-ui` — if the app is hybrid rather than bare RN, the axis architecture differs.
