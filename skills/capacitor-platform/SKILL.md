---
name: capacitor-platform
description: Capacitor platform + pipeline depth — plugins, OTA/live updates, deep links, push, offline-first, safe-area, native build CI/CD, App Store / Play Store submission + Apple preflight, security scanning, and web-to-Capacitor / Cordova / SPM migrations. Use for any Capacitor (or Ionic) app task beyond UI layout: "add push notifications", "deep linking", "ship an OTA update", "set up native build CI", "submit to the App Store", "fix an App Store rejection", "make the app work offline", "migrate my web app to a Capacitor app". For cross-surface layout architecture use enhance-capacitor-ui; for visual polish use the enhance-web-* skills.
---

# Capacitor Platform & Pipeline

> The native-runtime and shipping layer for Capacitor apps. `enhance-capacitor-ui` handles cross-surface *layout architecture*; this skill handles *platform features, native builds, store submission, and migrations*.
>
> Distilled from [cap-go/capgo-skills](https://github.com/cap-go/capgo-skills) (48 skills, MIT). For deep per-task playbooks, install the full pack: `npx skills add Cap-go/capgo-skills` or `claude plugin marketplace add Cap-go/capgo-skills`.

## Version discipline (do this first)
- Read `package.json`: the Capacitor major (`@capacitor/core`) drives everything. Match plugin majors to it (Capacitor 8 → plugin v8).
- Check `capacitor.config.ts` for `appId`, `webDir`, `server.url` (live-reload vs bundled), and plugin config.
- Confirm the target platforms present (`ios/`, `android/`) before suggesting platform-specific steps.

## Pick the right area

| Task | Approach |
|:-----|:---------|
| Choose a plugin | Prefer official `@capacitor/*`; for gaps check Capgo's 80+ plugin catalog. Verify the plugin major matches your Capacitor major and has active maintenance. |
| **Deep / universal links** | iOS Associated Domains + `apple-app-site-association`; Android intent filters + `assetlinks.json`. Handle cold-start vs warm via `appUrlOpen` listener. Test both install states. |
| **Push notifications** | `@capacitor/push-notifications` → FCM (Android) + APNs (iOS). Register token, handle foreground vs background, deep-link from tap. Verify entitlements + `GoogleService-Info.plist` / `google-services.json`. |
| **Offline-first** | Cache + queue writes; reconcile on reconnect. Use a real DB plugin (SQLite / Fast SQL), not localStorage, for structured data. Define the conflict-resolution rule explicitly. |
| **Keyboard** | `@capacitor/keyboard` — resize mode, scroll-into-view on focus, accessory bar. The #1 source of "input hidden behind keyboard" bugs. |
| **Safe area / notch** | Use safe-area insets (env vars / plugin), not hardcoded padding. Account for notch, Dynamic Island, home indicator, Android gesture nav. (Pairs with `enhance-capacitor-ui`.) |
| **Splash screen** | Configure via plugin + native assets; hide programmatically after first paint to avoid white flash. |

## Shipping pipeline

### Live / OTA updates (the Capacitor superpower)
- Push JS/HTML/CSS instantly without store review (Capgo or equivalent). **Native code changes still require a store build.**
- Gate updates by channel (production / beta), run compatibility checks, and keep a rollback path. Never OTA a bundle that assumes a newer native plugin than the installed binary.

### Native build CI/CD
- GitHub Actions / GitLab CI / Fastlane for signed iOS + Android artifacts. iOS signing needs certs + provisioning profiles in CI secrets (never commit `*.keystore`, `*.p12`, `local.properties`).
- Standard chain: `npm ci` → web build → `npx cap sync` → native build (xcodebuild / Gradle) → sign → upload (TestFlight / Play internal track).
- For Linux/Windows devs: iOS builds run on **macOS CI runners**, not locally — declare "ready for CI", never "iOS verified" locally.

### Store submission
- **Apple preflight before every submit:** privacy manifest (`PrivacyInfo.xcprivacy`), ATT prompt if tracking, permission usage strings, no private APIs, account-deletion path if there are accounts. Most rejections are preflightable.
- Play Store: target API level current, data-safety form, 16KB page-size alignment for native libs.

### Security
- Run a Capacitor security scan (Capsec: `npx capsec scan --ci`) — catches hardcoded secrets, insecure storage, network security, auth weaknesses. Wire into CI to fail on high/critical.

## Migrations
| From | To | Notes |
|:-----|:---|:------|
| Web app / PWA | Capacitor | `npx cap init` → add platforms → wire plugins for native bits → store-ready. |
| Cordova / PhoneGap | Capacitor | Map plugins to Capacitor equivalents; many Cordova plugins still work but prefer native Capacitor ones. |
| CocoaPods | Swift Package Manager | iOS dependency migration; check each plugin supports SPM. |
| SQLite plugin | Fast SQL | Performance migration for data-heavy apps. |

## Definition of done (Capacitor)
- [ ] Plugin majors match the Capacitor major; `npx cap sync` run after any native dep change.
- [ ] Feature tested on a real device or emulator for **both** iOS and Android (or CI for iOS).
- [ ] Permissions / entitlements / native config present for any native capability used.
- [ ] Secrets are in CI/Keychain, never in the repo or the JS bundle.
- [ ] If OTA: the bundle is compatible with the shipped native binary.

## Composes with
- `enhance-capacitor-ui` — form-factor / platform / pointer layout architecture.
- `workflow-spec-tdd` — spec + TDD spine for the feature itself.
- `full-stack-ship-discipline` — backend deps deployed + verified.
- `enhance-web-*` — the underlying web UI the Capacitor shell renders.
