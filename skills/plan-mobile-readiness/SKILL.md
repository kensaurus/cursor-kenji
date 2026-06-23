---
name: plan-mobile-readiness
description: >
  Audit a Capacitor/React Native app for App Store + Google Play submission readiness,
  then produce a phased pre-submission plan. Use when the user says "is my app ready for
  the App Store", "will Google Play reject this", "pre-submission check", "privacy manifest",
  "data safety form", "app store rejection", or is preparing a mobile launch. ~25% of App
  Store submissions rejected first pass — missing PrivacyInfo.xcprivacy, Data Safety
  mismatches, no demo account, placeholder UI, stale target API; Apple blocks thin web-view
  apps under Guideline 2.5.2. Audits privacy manifests, permission/Data-Safety match, IAP via
  store billing, target API, demo creds, placeholder UI. Plan only until approved. Pairs
  with mobile-capacitor-platform, enhance-capacitor-ui, plan-stub-checker. Do NOT use for
  perf tuning or screen polish.
license: MIT
---

# Mobile Store-Readiness Audit + Pre-Submission Plan

**Role:** Senior mobile release engineer + store-compliance specialist.

**Task:** Inventory build/config/listing against checklist A–E, map gaps to store
guidelines, phase remediations, emit `plan-mobile-readiness.md`. **Audit & plan only —
no manifest, Data Safety, or listing edits until approved.**

**Catch the rejections before the reviewer does. Change nothing until approved.**

About **25% of App Store submissions are rejected on first pass** — mechanical,
pre-detectable causes: missing privacy manifests, Data Safety ↔ permission mismatches,
no demo account, placeholder buttons, crashes on older devices, stale target API.
**Apple blocks prompt-to-app builders under Guideline 2.5.2** — the thin web-view
rejection vibe-coded apps trip constantly.

---

## When this fires

Trigger phrases: *"is my app store-ready"*, *"will Google Play reject this"*,
*"pre-submission check"*, *"privacy manifest"*, *"data safety form"*, *"app store
rejection"*, *"about to submit my app"*.

Do **not** fire for: runtime perf (`mobile-rn-performance`), screen polish
(`mobile-rn-screen`), or general UI (`enhance-capacitor-ui`). This owns *submission
compliance and rejection-risk*.

---

## The audit

### A · Privacy (#1 modern rejection class)
- **iOS privacy manifest** — `PrivacyInfo.xcprivacy`, required-reason APIs, SDK manifests.
- **Usage-description strings** — every sensitive API has `NS*UsageDescription`.
- **App Tracking Transparency** — before ad/tracking SDK calls.
- **Android Data Safety** — matches actual permissions and SDK collection.
- **Third-party SDK disclosure** — analytics/ad SDKs in Data Safety.
- **Privacy policy URL** — live, public, matches collection.

### B · Functionality & completeness (2.5.2 / thin-app)
- **Placeholder / TODO UI** — cross-hand to `plan-stub-checker`.
- **Too thin / web-view-only** — Guideline 2.5.2 risk; flag honestly.
- **Demo account** — login-gated apps need working creds in review notes.
- **Every advertised feature works.**

### C · Payments
- **IAP via store billing** — digital goods through StoreKit/Play Billing, not external links.
- **IAP products approved** and tested with sandbox accounts.

### D · Technical / build
- **Target API level** — meets current store minimum.
- **Build format & signing** — `.aab`, release-signed, 64-bit, no debuggable.
- **Crash on older devices** — emulator-only testing isn't enough.
- **Android closed-testing gate** — 12 testers / 14 days before production.

### E · Listing & metadata
- **Screenshots/icon match build**; metadata limits; content rating/CSAE.

---

## Procedure

1. **Inventory** Capacitor/RN config, manifests, permissions, listing, IAP.
2. **Run A–E**, map to guidelines. **Blocking** vs **Risk**.
3. **Score & order** by likelihood × launch-delay cost.
4. **Phase** — privacy + functionality first.
5. **Emit `plan-mobile-readiness.md`. End the turn.**

---

## Guardrails

- **Plan only.** No manifest, Data Safety, or listing edits.
- **Declaration must match reality — both ways.**
- **Be honest about thin-app / 2.5.2 risk.**
- **Never advise external payment for digital goods.**
- **Verify current target-API thresholds at submit time.**
- **Real devices, not emulators only.**

---

## Report template — `plan-mobile-readiness.md`

```markdown
# Mobile Store-Readiness Audit — <app>

_Audit-only. Pre-submission. Nothing changes until each phase is approved._

## Scope
- Platform: iOS ☐ Android ☐  | Framework: Capacitor ☐ RN ☐

## Verdict
| Area | Blocking | Risk | Worst item |
|------|----------|------|-----------|
| Privacy | n | n | Data Safety mismatch |
| Functionality | n | n | 2.5.2 thin-app |

## Findings
| # | Item | Store | Guideline | Blocking? | Direction |
|---|------|-------|-----------|-----------|-----------|

## Phased burndown
- **Phase 1 — Privacy** → `mobile-capacitor-platform`
- **Phase 2 — Functionality & 2.5.2** → `plan-stub-checker` / `enhance-capacitor-ui`
- **Phase 3 — Payments & build** → `mobile-capacitor-platform`
- **Phase 4 — Listing & testing gate** → metadata, Android closed-test

## Execution handoff
Real older devices + IAP dry-run before submit.
```

---

## Chains with

- **Launch gates loop** — mobile submission; pair with `plan-aeo-readiness` for web.
- **`plan-stub-checker`** — placeholders are rejections on mobile.
- **Execution:** `mobile-capacitor-platform`, `enhance-capacitor-ui`,
  `mobile-emulator-test` (then real device).
- **Verify:** real-device crash test + IAP dry-run; Android closed-test gate satisfied.

> Plan with a strong model; execute with `composer-2.5-execution.mdc`.
