---
name: test-emulator
description: >
  Comprehensive on-device QA for any native mobile build (React Native / Expo,
  Capacitor, Flutter, Tauri-mobile, native Android) running on a local Android
  emulator, paired with backend-truth verification via the Supabase MCP and
  error telemetry via the Sentry MCP. Covers generic Android bootstrap gotchas:
  tall-handset AVD preset (1080×4000 logical display), `_no_skin` / invalid skin
  failures on current emulator builds + minimal custom skin layout, adb reverse /
  adb-server churn, “device enumerated once” helper scripts missing reverse /
  launch when the emulator arrives late, emulator-before-connectivity ordering,
  and polling Metro / Expo `/status` before deep-link launch to avoid
  “Cannot connect to Expo CLI” / localhost races — then walks every tab/route,
  CRUD checks, DB + Sentry loop. Auto-detects the app stack; use when asked to
  test the emulator, native build, QA mobile, white screen / Metro disconnect,
  adb reverse, smoke-test Android, etc. Generic across repos and schemes.
---

# test-emulator — Native build QA on Android emulator + MCP loop

End-to-end verification of any native mobile build through a real Android
emulator session, with backend truth (Supabase MCP) and crash telemetry
(Sentry MCP) wired into the same loop. Catches the failure modes that pure
unit tests and CI bundle builds miss: white screens, prototype-stripped
cache rehydration, missing migrations, sync-disabled empty states, infinite
refetch loops, and silent error swallows.

## Critical Rules

> **Test as a real signed-in user AND as a brand-new guest.**
> Walk the app the way a paying customer would — sign in, browse every tab,
> add a real entry, edit it, delete it — AND the way a new user would —
> open the app fresh, hit the guest path, drive a CRUD round-trip without
> any account. Both paths exercise different code (sync replica vs cloud
> direct vs local-only adapter) and both regress independently. While
> walking, watch logcat, Sentry, and the DB at the same time.

> **Always verify the build under test is the latest source.**
> A "nothing changed" report is almost always a stale build: Metro served
> a cached bundle, the dev launcher cached a JS-bundle URL, or the
> emulator is running a previously-installed APK while the new one sits
> in `android/app/build/outputs/`. Phase 1.5 is non-negotiable.

> **Every mutation gets verified at three layers.**
> A create/edit/delete is not "tested" until: (1) the app shows success,
> (2) the row exists/changes/disappears in the DB via Supabase MCP, and
> (3) re-opening the screen reflects the same state from a cold fetch.

> **Evidence for every finding.**
> Each bug needs: `screencap` PNG, last 30 lines of `logcat ReactNativeJS`,
> the failing Sentry issue ID (if captured), and the exact reproduction taps.

> **Don't trust a "white screen".**
> A blank surface is almost always one of three things: Metro died, the
> bundle threw inside the React tree (caught by ErrorBoundary into Sentry),
> or the persisted cache hydrated a class instance as a plain object.
> Diagnose, don't restart blindly.

> **Clean up server state.**
> Anything you POST during the walk gets deleted before you finish, via the
> same Supabase MCP that verified it.

---

## Phase 0: Codebase + Environment Discovery

Before launching anything, understand the build.

### 0a. Detect the native stack

| Signal | Stack |
|---|---|
| `apps/*/app.json` or `apps/*/app.config.{js,ts}` + `expo` in deps | **Expo / React Native** |
| `react-native` in deps but no `expo` | **bare React Native** |
| `capacitor.config.{ts,json}` + a `web/` or `dist/` build | **Capacitor** |
| `pubspec.yaml` with `flutter:` block | **Flutter** |
| `src-tauri/` with `tauri.conf.json` | **Tauri mobile** |
| `android/app/src/main/AndroidManifest.xml` only | **native Android** |

Read the dependency manifest (`package.json`, `pubspec.yaml`, etc.) to extract:
- bundler / dev server (Metro, Vite, Capacitor Live Reload, Flutter daemon)
- bundler port (Metro defaults to 8081; check `scripts.start` / `expo start --port`)
- backend client (Supabase, Firebase, Amplify, custom REST)
- error tracker (Sentry, Bugsnag, Crashlytics) — needed for Phase 5
- offline/sync layer (PowerSync, Watermelon, Realm) — needed for Phase 4 fallback
- query cache (TanStack Query, RTK Query, SWR) — needed for Phase 6 cache audit

### 0b. Inventory routes / tabs / mutation surfaces

| Stack | Where routes live |
|---|---|
| Expo Router | `app/**/*.{tsx,ts}` (file-based) |
| React Navigation | grep `createNativeStackNavigator`, `Tab.Screen`, `Stack.Screen` |
| Capacitor + React Router | `src/App.tsx` route table |
| Flutter | `lib/**/router.dart`, `MaterialApp.routes` |

For each route record: path, dynamic params, auth guard, primary CRUD entity.
Also list the **bottom tabs** explicitly — they are the spine of the walk.

### 0c. Discover backend + telemetry config

```bash
# Supabase project ref
grep -r "EXPO_PUBLIC_SUPABASE_URL\|SUPABASE_URL" .env .env.local apps/*/app.config.* 2>/dev/null
# Sentry DSN + project slug
grep -r "EXPO_PUBLIC_SENTRY_DSN\|SENTRY_DSN" .env .env.local 2>/dev/null
# PowerSync (or other sync) URL
grep -r "POWERSYNC_URL\|FIREBASE_DATABASE_URL" .env .env.local 2>/dev/null
```

Also list available MCP servers:
- **plugin-supabase-supabase** → `list_tables`, `execute_sql`, `apply_migration`, `get_logs`, `get_advisors`
- **plugin-sentry-sentry** → `find_organizations`, `search_issues`, `get_sentry_resource`, `update_issue`

If either MCP is missing, mark that verification path BLOCKED but keep walking.

### 0d. Test account

Find or ask for a **real signed-in user** with a non-trivial dataset. The
empty-state path is its own test (Phase 7), but the main walk MUST exercise
populated screens — that is where the cache-corruption, FX-conversion, and
sync-empty-state bugs live.

---

## Phase 0.5: Tall-handset AVD + skin/display truth (any Android app)

Use this whenever layout QA benefits from extra vertical runway (multi-section
homes, drawers, FAB stacks) or whenever the emulator exits immediately / shows
the wrong logical resolution after editing `hw.lcd.*`.

### 0.5a. Target profile (recommended debug geometry)

Goal: **`Physical size: 1080x4000`** (or `4000x1080` in landscape — verify with
`adb shell wm size` after boot).

Typical knobs live in **`%USERPROFILE%\.android\avd\<Something>.avd\config.ini`**
(or `~/Library/Android/avd/` on macOS). Set at least:

- `hw.lcd.width=1080`
- `hw.lcd.height=4000`
- `hw.lcd.density=<match your production class, often 420–480>`
- `showDeviceFrame=no` *(optional but keeps focus on pixels, not chrome)*

**Authoritative display check** (never trust the window chrome alone):

```bash
adb shell wm size
adb shell wm density
```

### 0.5b. The `_no_skin` / invalid-skin trap (recent emulator builds)

Older templates or blog posts recommend `skin.name=_no_skin` and
`skin.path=_no_skin` to silence device frames on custom resolutions. Current
Studio / emulator builds often terminate with **`unknown skin name '_no_skin'`**
and **`exit_code: 1`** — so the emulator never joins `adb devices`, and helper
scripts that wait for reverse / intent time out.

**Rule:** Pick a skin path that resolves to an **existing** SDK skin directory,
or ship a **minimal custom skin** next to the AVD.

### 0.5c. Minimal custom skin folder (generic pattern for any app)

Problem: pointing `skin.path` at a stock skin like `WXGA720` can force the guest
framebuffer to **`720×1280`** even when `config.ini` declares `hw.lcd.*`;
`adb shell wm size` will disagree with what you configured.

Mitigation:

1. Create e.g.
   **`%USERPROFILE%\.android\avd\<YourAvdFolder>\emulator_skin_1080x4000/`**
   (name is arbitrary; keep it alphanumeric + underscores).
2. Copy **all PNG + `hardware.ini`** from any stock SDK skin (for example
   `platforms/android-*/skins/WXGA720/`) so background assets exist — the emulator
   parser expects referenced files.
3. Replace **`layout`** in that folder with a definition whose `device.display`
   block matches **1080×4000** and whose **portrait** canvas includes small
   margins (≈ 27 px gutters mirror stock skins):

```txt
parts {
    portrait {
        background { image background_port.png }
    }
    landscape {
        background { image background_land.png }
    }

    device {
        display {
            width   1080
            height  4000
            x       0
            y       0
        }
    }
}

layouts {
    portrait {
        width     1134       # 1080 + 27*2 gutters
        height    4054       # 4000 + 27*2 gutters
        color     0xe0e0e0
        event     EV_SW:0:1
        part1 { name portrait;  x 0;    y 0 }
        part2 { name landscape; x 4000; y 0 } # parked off-screen; adjust if emulator complains
        part3 { name device;    x 27;   y 27 }
    }

    landscape {
        width     4055       # swapped-ish canvas — tune if rotating AVD heavily
        height    1175
        color     0xe0e0e0
        event     EV_SW:0:0
        dpad-rotation 3
        part1 { name portrait;  x 4000; y 0 }
        part2 { name landscape; x 0;    y 0 }
        part3 {
            name     device
            x        26
            y        26
            rotation 3
        }
    }
}

keyboard { charmap qwerty2 }
network  { speed full; delay none }
```

4. Update **`config.ini`**:

```
skin.dynamic=no
skin.name=emulator_skin_1080x4000
skin.path=C:\\Users\\<you>\\.android\\avd\\<YourAvdFolder>\\emulator_skin_1080x4000
```

Reboot the AVD after edits. Expect first boot warnings about **unable to resume
snapshot** after geometry/skin changes (`default_boot`) — cold boot once is OK.

### 0.5d. adb / emulator ergonomics reminders

| Issue | Typical fix |
|------|-------------|
| Stuck transports / duplicate `adb.exe` orphans on Windows | `taskkill /IM adb.exe /F /T` then `adb start-server` (prefer one supervised helper than many shells) |
| Need to recycle guest without wiping data | `adb emu kill`, relaunch same AVD |
| Ensure bundler reachable from emulator | `adb reverse tcp:<metroPort> tcp:<metroPort>` *per device attachment* |

These apply equally to RN, Flutter, Compose, Kotlin XML, Cordova/Ionic shells,
and Expo dev-client builds — only the URLs / ports change.

---

## Phase 1: Bring the loop online

### 1a. Verify the emulator + adb

```bash
adb devices
# Expect: emulator-5554   device      (transport_id ...)
```

If no device appears **within the script’s polling window**:

- Boot/repair the AVD (Phase 0.5 if emulator exits instantly or wrong `wm size`).
- Re-run **`adb reverse tcp:<port> tcp:<port>` after the serial shows `device`** — reverse mappings do not magically backfill when a late emulator attaches.

If an automation script enumerated devices **once at startup**, it may skip
reverse + deeplink when the emulator was offline. Prefer **polling** or a
manual second step: reverse + intent once `adb devices` is non-empty.

### 1b. Confirm the bundler is alive *(and reachable from the emulator)*

```bash
METRO_PORT=8081
curl -sf "http://localhost:${METRO_PORT}/status"
# PASS: contains "packager-status:running" (Metro/Expo) or HTTP 200 with running flag
```

**Other stacks:**

- Capacitor / Vite: usually `5173` / dev server ping you choose (`curl /`).
- Flutter: tool-specific (often aggregator on `localhost`).

If dead, boot the bundler in the background, then **poll aggressively** (`2–5s`
backoff up to **`~180s` on cold cache wipes**):

```bash
while ! curl -sf "http://127.0.0.1:${METRO_PORT}/status" | grep -q running; do sleep 4; done
```

Only after **`/status`** is green should you fire a dev-client deeplink /
reload — launching first produces logcat variants of **Cannot connect** /
**ECONNREFUSED** to **`127.0.0.1:<port>`** even when Metro comes up seconds later.

When the emulator is attached:

```bash
adb reverse tcp:${METRO_PORT} tcp:${METRO_PORT}
```

Re-run whenever `adb reconnect` / `adb kill-server` / new emulator session clears
the tunnel.

### 1c. Launch the app *(scheme-agnostic placeholders)*

| Stack | Intent pattern |
|---|---|
| Expo dev client | Replace `<SCHEME>` with `app.json`/`app.config.*` **`scheme`** (often **without** literal `exp+` unless using classic Expo Go tokens — follow the repo’s deeplink snippet). Typical shape: `"<SCHEME>://expo-development-client/?url=http%3A%2F%2Flocalhost%3A<PORT>"` |
| Bare RN Android | `adb shell am start -W -n <applicationId>/.MainActivity` (+ dev menu attach if configured) |
| Flutter | `adb shell am start -W -n <bundleId>/<activity>` or `flutter run` |
| Capacitor / WebView shells | `-n <appId>/.MainActivity` plus ensure dev server URL reachable (reverse or LAN IP in config) |

**Example (substitute placeholders):**

```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "<SCHEME>://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"
```

If `am start` reports the intent delivered to an already-running activity,
that is OK — Metro may still hot-reload afterward.

After launch, wait `~12-15s` for the JS bundle (longer cold start), then
`screencap` to disk.

### 1d. Health-check the first paint

The first screen MUST be:
1. Not pure white (= Metro died OR JS threw before mount)
2. Not the dev launcher's "Error loading app · unexpected end of stream"
   (= bundler unreachable from device — fix `adb reverse`, wrong port, **or**
   dev client opened before `curl /status` showed running — see Phase `1b`)
3. Not the dev launcher's "last time you tried to open … crashed" warning
   left as the only content (= a recent change crashed before mount)

If any of those: collect logcat, fix, relaunch — do **not** start walking
on a half-broken app.

```bash
# Tail JS errors only
adb logcat -d ReactNativeJS:V '*:S' | tail -50
# Or for Capacitor / Cordova:
adb logcat -d Capacitor:V SystemWebChromeClient:V '*:S' | tail -50
```

---

## Phase 1.5: Build-freshness verification (mandatory)

> If you skip this phase you WILL waste a debugging session on a stale
> build. The user's report of "nothing changed" is almost never the patch
> failing — it is the device running yesterday's bytecode.

The fundamental risk: **three separate caches** can each serve stale code
to the device. They must each be invalidated explicitly, in order, before
trusting any walkthrough finding.

### 1.5a. Source freshness — does the file on disk reflect the patch?

```bash
# Confirm the change you "just made" is actually saved
git diff --stat HEAD -- <changed_file>
# Or grep for a unique string from the patch
grep -n "<unique_string_from_patch>" <changed_file>
```

If the file shows no change, the editor lost the buffer or the StrReplace
silently no-op'd. Re-apply the patch before going further.

### 1.5b. Bundler freshness — is Metro/Vite serving the new source?

For Metro:
```bash
# Hit the bundle URL the device uses; the body should contain the unique
# string from the patch. Use the device's bundle URL, NOT just /status.
curl -s "http://localhost:8081/index.bundle?platform=android&dev=true" \
  | grep -c "<unique_string_from_patch>"
# Expect: ≥1
```

If the count is 0, Metro served a cached bundle. Restart Metro with a
hard cache wipe:

```bash
# Kill the Metro process holding port 8081
lsof -i :8081 -t | xargs -r kill -9    # macOS / Linux
# Windows / Git-Bash:
netstat -ano | grep :8081 | awk '{print $5}' | sort -u | xargs -r -I{} taskkill //F //PID {}

# Restart with cache wipe (Expo example; adapt for bare RN / Capacitor)
( cd apps/<mobile-app> && npx expo start --clear --port 8081 ) &
```

Wait for Metro to print `Bundling complete` then re-curl the bundle to
confirm the unique string is now present.

### 1.5c. Device freshness — is the device running the new bundle?

The dev launcher caches the bundle URL between sessions. Even with fresh
Metro, the device may still hold the old JS in memory. Force a reload:

```bash
# Method 1: Metro reload endpoint (best — works without device interaction)
curl -s -X POST http://localhost:8081/reload && echo "reload triggered"

# Method 2: Send the React Native dev-menu R+R shortcut
adb shell input keyevent 46   # send 'R' once
sleep 0.1
adb shell input keyevent 46   # send 'R' twice → reload

# Method 3: Force-stop the app and re-launch via deep link
adb shell am force-stop <app.id>
adb shell am start -W -a android.intent.action.VIEW \
  -d "exp+<scheme>://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"

# Method 4 (nuclear): Wipe app data, including persisted query cache
adb shell pm clear <app.id>
# Then relaunch — note this also signs the user out
```

After reload, wait `~10s` and `screencap`. The unique change you patched
should be visible.

### 1.5d. Native-code freshness — for changes that touch `android/`

If the patch modified anything under `android/`, `ios/`, or any native
module (`react-native-*` with autolinked native code), Metro reload is
**not enough**. The Hermes bytecode and the APK both need rebuilding:

```bash
# Bare RN
( cd android && ./gradlew installDebug )
adb shell am force-stop <app.id>
adb shell am start -n <app.id>/.MainActivity

# Expo dev client
npx expo run:android --variant debug --no-install   # build only
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
adb shell am force-stop <app.id>
adb shell monkey -p <app.id> 1
```

### 1.5e. Verify-by-evidence

The build is "fresh" only when ALL of the following are true:
- ✅ Source file on disk contains the patched string (`git diff` shows it)
- ✅ Bundle served by Metro contains the patched string (curl + grep ≥1)
- ✅ A unique on-screen marker from the patch is visible in `screencap`
- ✅ Logcat shows the new bundle hash in the `Running application` line

If any of those fails, do not start Phase 2 — the walk will report stale
behaviour and waste cycles.

### 1.5f. Stale-build smell tests

Run these whenever the user says "nothing changed" or a fix appears not
to have landed:

| Smell | Likely cause | Fix |
|---|---|---|
| Same screen pixels after patch | Metro served cached bundle | 1.5b restart with `--clear` |
| Patch visible in some sessions only | Two Metro instances on different ports | `lsof -i :8081 -i :19000 -i :19001`, kill all, restart one |
| Hot reload silently broken | File-watcher hit OS handle limit | Restart Metro; on Linux `sysctl fs.inotify.max_user_watches=524288` |
| New Sentry capture has old source-map line numbers | Sentry source-maps not re-uploaded for the dev build | Acceptable for dev; flag for release builds |
| Native module change doesn't take effect | APK still old | 1.5d full Gradle build |
| `pm clear` didn't fix it either | Wrong `app.id` (release vs debug variant) | `adb shell pm list packages \| grep <project>` |

---

## Phase 2: Tap-driven walk of every tab

### 2a. Coord math (don't skip this — most failed taps come from getting it wrong)

`adb exec-out screencap -p > snap.png` writes a PNG at the device's full
logical resolution (**Phase 0.5 preset: 1080×4000**; stock Pixels often
1080×2400). When the agent reads the PNG it's downsampled for chat display.
Scale taps back using the **ADB-reported size**, not the preview thumbnail:

```
adb shell wm size   # authoritative WxH for coord math
```

To click an element you saw on screen:

```
real_x = display_x * (device_width  / display_width)
real_y = display_y * (device_height / display_height)
```

Pass `real_x real_y` to `adb shell input tap`. If a tap appears to do
nothing, **dump the UI tree** rather than guessing:

```bash
adb shell "uiautomator dump /sdcard/ui.xml && cat /sdcard/ui.xml" \
  | head -200
# Search for the bounds="[x1,y1][x2,y2]" of the element you want.
```

### 2b. Walk every tab in order

For each tab in the bottom navigation:

1. `adb shell input tap <tab_x> <tab_y>` — switch tab
2. `sleep 5-7` — let the tab's `useFocusEffect` refetch settle
3. `adb exec-out screencap -p > tab-<n>.png`
4. `adb logcat -d ReactNativeJS:V '*:S' | grep -iE 'TypeError|Error|column|exception|isZero|getDate|Render Error|Property' | tail -10`
5. **Read the screenshot.** Look for:
   - Empty state where data should exist (signed-in user, dataset > 0)
   - "—" / "0" / "undefined" / "NaN" in numeric cells
   - Stuck skeleton (no data after 8s)
   - Error boundary fallback
   - Layout overflow / misaligned text
6. **Read logcat.** Any `TypeError`, `column does not exist`, or
   `ErrorBoundary` line is a finding even if the screen looks OK.

### 2c. Drill into one detail row per tab

Tab-level screens hide bugs that only show on item detail. For each tab
that lists items, tap the first real (non-test) row and verify the detail
screen renders without "Couldn't load that entry" or skeleton lock.

---

## Phase 2.5: Auth area — walk both guest AND signed-in paths

> A native budgeting / productivity / journaling app typically supports a
> **guest path** (local-only, no auth) and a **signed-in path** (cloud
> sync). They share UI but route through completely different adapters
> (`localAdapter` vs `cloudAdapter`/PowerSync), so a fix that lands one
> path commonly regresses the other. **Both must be walked every session.**

### 2.5a. Inventory the auth surface

Find the auth entry point and its branches:

```bash
# Expo Router
ls apps/<mobile-app>/app/auth/    # index.tsx, callback.tsx, etc.
# React Navigation
grep -rn "AuthStack\|SignInScreen\|<Stack.Screen.*name=.\"auth" apps/<mobile-app>/src/
```

List every auth entry point: magic-link email, OAuth (Apple/Google/etc.),
passkey, biometric unlock, **and** the guest-mode entry. Note the
SignedOut → SignedIn transition (`session.refresh()` in Zustand,
`onAuthStateChange` in Supabase, etc.).

### 2.5b. Cold-start: signed-out auth screen

```bash
adb shell pm clear <app.id>     # nuclear: wipes session + cache
adb shell am start -n <app.id>/.MainActivity   # or deep-link launcher
sleep 12
adb exec-out screencap -p > auth-cold.png
```

The first screen MUST be the auth landing surface (NOT a stuck splash,
NOT a half-rendered tab bar). Verify visually:
- All advertised auth methods are present (no missing OAuth button)
- "Continue as guest" / equivalent is reachable
- No console warnings about missing OAuth client IDs

### 2.5c. Walk A — guest path

1. Tap "Continue as guest" (`uiautomator dump` for exact bounds, then
   `input tap`).
2. Wait for the home/today tab to paint, `screencap`.
3. Walk every tab as in Phase 2 — confirm guest data flows through the
   local adapter (no Supabase calls in logcat: `adb logcat -d | grep -i
   "supabase\|fetch.*supabase\|GoTrue"` should be empty post-launch).
4. CRUD round-trip (Phase 3) with **`QA-GUEST-`** prefix.
5. Verify the row exists in the on-device store (SQLite / MMKV /
   AsyncStorage), NOT in cloud:
   ```text
   execute_sql(query: "select count(*) from <main_table>
                       where notes ilike 'QA-GUEST-%'")
   ```
   Expect: `0`. (Guest writes must not hit cloud.)
6. Confirm no Sentry events were captured for this guest session that
   reference cloud APIs — if so, a cloud call leaked into the guest path.

### 2.5d. Walk B — signed-in path (via magic link or test creds)

1. From the guest session, find the "Sign in" / "Sync your data" entry
   (often Settings → Sign in, or auth screen → Sign in tab).
2. **Magic-link path:**
   - Enter the test email.
   - Use Supabase MCP to retrieve the link from auth.users:
     ```text
     execute_sql(query: "select id, email, last_sign_in_at,
                                confirmation_sent_at
                         from auth.users
                         where email = '<test@…>'
                         order by created_at desc limit 1")
     ```
   - For local development, magic-link emails are usually intercepted by
     Supabase Inbucket / Mailpit at `http://localhost:54324` — fetch the
     latest message's HTML and extract the `?token_hash=…&type=magiclink`
     URL. Open it via `adb`:
     ```bash
     adb shell am start -W -a android.intent.action.VIEW \
       -d "<deep-link-from-email>"
     ```
   - Watch logcat for `[supabase] auth state change → SIGNED_IN`.
3. **OAuth path (when the test account supports it):**
   - Tap the provider button.
   - Browser intent opens; the in-emulator browser will redirect back via
     the app's deep-link scheme.
   - If the redirect doesn't fire (common on emulators without Play
     Services), record this as a known-failure-on-emulator and use
     magic-link instead.
4. After SIGNED_IN, verify the signed-in path:
   - `screencap` shows the post-auth home with **server-truth data**
     (not the empty-state guest UI).
   - Logcat shows TanStack queries firing against the cloud adapter.
   - Run Phase 4 (sync-empty-state checklist) — this is where the
     PowerSync-disabled bug lives and you must confirm cloud-direct
     fallback engages.
5. CRUD round-trip with **`QA-CLOUD-`** prefix → SQL must show `1` row.

### 2.5e. Walk C — guest-to-cloud migration (if supported)

If the app supports promoting a guest workspace into a cloud workspace
(common in finance / journal / note apps), test it explicitly:

1. Start fresh: `pm clear`, enter guest, create 3 `QA-GUEST-` rows.
2. Sign in (Walk B).
3. Confirm the migration prompt appears ("Bring in your local data?").
4. Tap "Bring it all in".
5. SQL-verify the rows now exist in cloud:
   ```text
   execute_sql(query: "select count(*) from <main_table>
                       where workspace_id = '<new_cloud_ws>'
                         and notes ilike 'QA-GUEST-%'")
   ```
6. Confirm the on-device guest workspace is either deleted or marked
   migrated (and never re-imports on the next launch).

### 2.5f. Walk D — sign-out and re-sign-in

1. From the signed-in state, Settings → Sign out.
2. Confirm the app returns to the auth screen and **all signed-in caches
   are cleared** (no flash of stale data on the next sign-in).
3. Sign back in. Cold-fetch should re-hydrate from cloud, not from a
   stale persisted blob. Watch logcat for any
   `TypeError: x.<method> is not a function` — that means the persister
   served a corrupted post-sign-out cache (Phase 5).

### 2.5g. Auth-area-specific failure modes to look for

| Symptom | Likely cause | Where to look |
|---|---|---|
| Magic-link button tap → nothing | `EXPO_PUBLIC_SUPABASE_URL` missing | `apps/*/.env.local`, `app.config.*` extras |
| OAuth redirect lands on dev launcher, not the app | scheme not registered in `AndroidManifest.xml` | `intent-filter` for `<scheme>://` |
| Biometric gate shown but cancel bricks the app | no escape hatch in BiometricGate | grep `LocalAuthentication` / `BiometricPrompt` for `dismissed` state |
| Signed-in user sees guest UI on first launch | Zustand session restore racing the first render | session bootstrap should set `loading=true` until first `getSession()` resolves |
| Signed-in user sees "No accounts" | sync layer disabled — Phase 4 | Phase 4 cloud-direct fallback |
| Sign-out leaves user on the home tab | navigation reset missing in the auth listener | grep `onAuthStateChange` → look for `router.replace('/auth')` |
| Persisted cache survives sign-out and corrupts the next user | persister not bound to the user id, no clear on SIGNED_OUT | wipe persister in the auth listener |

---

## Phase 3: Full CRUD round-trip with three-layer verification

Pick the app's primary mutation surface (FAB → "New X", or the equivalent).

### 3a. Create

1. Open the FAB / "+" / new-entry sheet.
2. Fill required fields with `QA-TEST-` prefixed text + a memorable amount
   (e.g. `S$ 12345`) so you can grep both UI and DB.
3. Tap Save. Note the timestamp.
4. Watch for the success toast/snackbar in the next `screencap`.

### 3b. Verify in the DB via Supabase MCP

```text
CallMcpTool(server: "plugin-supabase-supabase", toolName: "execute_sql",
  arguments: {
    "project_id": "<ref>",
    "query": "select id, amount, currency, posted_at, notes
              from <main_table>
              where workspace_id = '<ws>'
                and (notes ilike '%QA%' or amount = -12345)
              order by created_at desc limit 5;"
  })
```

A row with the exact amount and the `QA-TEST-` payee/note must exist. If
two rows came back, the Save button double-fired — log a P2 finding.

### 3c. Verify it's visible in the list view

Navigate to the list, `screencap`, find the `QA-TEST-` row visually. If the
list cache wasn't invalidated after the mutation, this is the bug — log it
and pull-to-refresh / kill+relaunch to confirm.

### 3d. Edit (when supported)

Tap the row → edit one field → Save → SQL-verify the change → re-open the
detail to confirm the new value persists across a cold render.

### 3e. Delete

Use the in-app delete affordance (swipe / sheet button). Verify:
- snackbar / undo banner appears
- list view no longer contains the row
- SQL: `select count(*) from <main_table> where id = '<id>'` returns 0

If in-app delete is not yet wired, delete via Supabase MCP and verify the
app handles the missing row gracefully ("Couldn't load that entry" empty
state, not a crash).

---

## Phase 4: The "looks empty even though signed in" failure mode

This is the canonical native bug pattern and deserves its own phase.

### Symptoms

- Home shows real net worth / KPIs from a server RPC, but the Accounts /
  Transactions tab shows "No accounts yet" / "No transactions yet"
- The DB has hundreds of rows for this user (verify with Supabase MCP)
- No error in logcat or Sentry — just an empty state painted over real data

### Root cause checklist

1. **Sync layer disabled.** Many RN apps read the local SQLite replica
   (PowerSync / Watermelon / Realm) on the cloud-session path and the cloud
   directly only on the guest path. If the sync URL env var is unset, the
   replica is empty and the screen renders an empty state. Grep:
   ```bash
   grep -rn "POWERSYNC_URL\|isPowerSyncEnabled\|sync.*disabled" apps/*/lib/ packages/*/src/ 2>/dev/null
   ```
   Fix: add a runtime `isSyncEnabled()` check and fall back to the
   adapter's direct cloud fetcher when false.

2. **Missing DB columns.** If `select *` returns the rows but a downstream
   filter (`.eq('parent_account_id', …)`) hits a column that hasn't been
   migrated to cloud, the query returns `[]` silently. Verify with:
   ```text
   list_tables(schemas: ["public"]) → check column list
   ```
   Fix: apply the missing migration via `apply_migration`.

3. **PostgREST OR-syntax against a non-existent column.** Same shape as
   above but the failure is loud (`column foo does not exist`). Surfaces in
   `get_logs(service: "postgres")`.

### Mitigation pattern (works across stacks)

Always provide a "cloud-direct fallback" hook the screen can opt into:

```ts
// pseudo
const useCloudFallback = !isGuest && !isSyncEnabled()
const direct = useTabQuery(['<entity>-direct', wsId], () => listFromCloud(ctx),
                           [wsId], !!ctx && (isGuest || useCloudFallback))
const data = (isGuest || useCloudFallback) ? direct : useSyncReplica(wsId)
```

---

## Phase 5: Cache-rehydration crashes (`isZero is not a function`)

Persistent query caches (`@tanstack/query-sync-storage-persister` + MMKV /
AsyncStorage / Drift) JSON-stringify everything they store. **Class
instances and Date objects lose their prototypes on rehydration**, so on
the next cold boot the first method call (`Money.isZero()`,
`Date.getDate()`) throws inside the React tree and the screen goes blank.

### Diagnosis

`adb logcat -d ReactNativeJS:V` shows lines like:
```
TypeError: x.isZero is not a function (it is undefined)
TypeError: start.getDate is not a function (it is undefined)
```
…always under the same screen's `componentStack`.

### Two complementary fixes

1. **Skip persistence for cache keys that hold non-JSON-safe values.** In
   the persister config:
   ```ts
   dehydrateOptions: {
     shouldDehydrateQuery: (q) =>
       !NON_PERSISTABLE_KEY_PREFIXES.includes(q.queryKey[0] as string)
   }
   ```
   …and bump `buster: 'v2-…'` so existing devices wipe the corrupted blob.

2. **Defensive re-wrap at the consumer.** For Date fields that survive
   round-trips (e.g. weekStart/weekEnd from a chart series):
   ```ts
   const start = f.weekStart instanceof Date ? f.weekStart : new Date(f.weekStart)
   ```

Both belong in the codebase: (1) prevents new corruption, (2) is the
seatbelt for any path that still flows through a persisted cache.

---

## Phase 6: Sentry MCP loop

Run the Sentry MCP **before**, **during**, and **after** the walk.

### Before — baseline

```text
search_issues(organizationSlug, regionUrl,
  naturalLanguageQuery: "issues from <project> in the last 24 hours, sorted by most recent")
```
Note the issue IDs and event counts so post-walk drift is attributable.

### During — confirm new captures

After each crash logged in logcat, search for a matching Sentry title
(`TypeError: x.isZero is not a function` etc.). If Sentry didn't capture it
the SDK isn't initialised on this build path — that itself is a finding.

### After — resolve what you fixed

```text
update_issue(issueId: "<PROJECT>-<NUM>", status: "resolved")
```
Resolve only the IDs whose stack-trace + message exactly match the patch
you shipped this session. Never resolve speculatively — Sentry will
auto-reopen if the same fingerprint reappears.

---

## Phase 7: Edge cases the walk should not skip

| Scenario | How to trigger |
|---|---|
| Cold start with empty cache | `pm clear <app.id>` then relaunch |
| Sign out / sign in | Settings → Sign out → re-auth → verify Today re-hydrates |
| Background → foreground | `adb shell input keyevent KEYCODE_HOME` then relaunch |
| Offline | `adb shell svc wifi disable && svc data disable`, walk one tab, re-enable |
| Biometric gate cancel | When the gate appears, dismiss and verify the escape hatch (Try again / Disable lock) |
| Slow network | `adb shell tc qdisc add dev wlan0 root netem delay 2000ms` (clean up after) |
| Discard dialog from FAB | Open new entry, tap back, expect "Discard this entry?" |

---

## Phase 8: Cleanup

```text
execute_sql(query:
  "delete from <child_table> where <fk> in (select id from <main_table>
                                            where notes ilike 'QA-TEST-%');
   delete from <main_table> where notes ilike 'QA-TEST-%' returning id;")
```
Confirm the returned id list matches what you created. Also delete any test
payees / categories you created if the schema treats them as side rows.

Then leave the app on the home tab so the next session starts clean.

---

## Phase 9: Report

```markdown
## Native build QA — <project> on Android emulator

### Environment
- Stack: <Expo SDK / RN version / Capacitor version>
- Bundler: <metro:8081 ok | dead | restarted>
- Device: <emulator-5554, Android <ver>>, `adb shell wm size` (**expect 1080×4000 if using Phase 0.5 preset**)
- Account: <user@…> (workspace <id>) — <N> rows in primary table
- MCPs available: <supabase, sentry>

### Walk results
| Surface | Render | Logcat | Notes |
|---|---|---|---|
| Today / Home | ✅ | clean | net worth ¥578k, chart W12-W19 |
| Activity | ✅ | clean | 50 rows, IN/OUT/NET correct |
| Accounts | ✅ after fix | (was empty) | required cloud-direct fallback (Phase 4) |
| Plan | ✅ | clean | budgets card "1 active" |
| Insights | ✅ | clean | 8-week money-in/out chart |

### CRUD round-trip
- Created: <id> via FAB → DB row present → list visible → ✅
- Updated: field X — UI ✅, DB ✅, cold re-open ✅
- Deleted: undo banner shown, DB row gone, count(*) = 0

### Patches shipped this session
1. <file:line> — <one-liner>; resolves Sentry <ISSUE-ID>
2. …

### Sentry hygiene
- Resolved: <list of IDs>
- New unresolved: <list, with first-seen timestamps>

### Known follow-ups
- <PowerSync URL not provisioned — cloud fallback in place>
- <migrations 0083–0086 partial; full apply needs CHECK-constraint refactor>
```

---

## Anti-pattern catalogue (ship-blockers I want the agent to spot fast)

| Symptom on screen | Real cause | First fix |
|---|---|---|
| "Nothing changed after my patch" | Stale Metro bundle, stale APK, or stale dev-launcher cache | Run **Phase 1.5** — re-curl bundle, `--clear` Metro, `pm clear` if needed |
| White screen after dev-launcher tap | Metro died OR JS threw before mount | `curl localhost:8081/status` → restart bundler / read logcat for the throw |
| Emulator exits <1s / `adb devices` stays empty (`exit 1`) | Invalid `skin.name` / `skin.path` (often `_no_skin` on newer emulator) | Phase **0.5b–c** — valid SDK skin dir or minimal **1080×4000** custom skin folder |
| `adb shell wm size` shows **`720×1280`** despite `hw.lcd` edits | Stock skin `layout` overriding guest resolution | Phase **0.5c** custom skin with **1080×4000** `device.display`; re-verify **`wm size`** |
| "Error loading app · unexpected end of stream" / Expo cannot connect | `adb reverse` never set, Metro bound after deeplink fired, stale port | **`curl /status`** until running, **`adb reverse tcp:<p> tcp:<p>`**, relaunch deeplink (`Phase 1b–c`); emulator boot **before** one-shot launch scripts (`Phase 0.5`, `§1a`) |
| Blank where data should be (signed-in, populated user) | Sync replica empty; screen reads only from local SQLite | Add `isSyncEnabled()` runtime check + cloud-direct fallback |
| Persistent skeletons that never resolve | `useFocusEffect(refetch)` with an unstable refetch identity → infinite invalidate→refetch loop | Wrap `refetch` in `useCallback` with stable deps |
| `TypeError: x.isZero is not a function` after cold boot | Persisted cache rehydrated a `Money`/`Date` as a plain object | Skip persistence for that key + bump persister `buster` |
| `Property 'X' doesn't exist` ErrorBoundary | Renamed a hook return value, missed downstream callers | Grep the old name across the file before declaring the rename done |
| `column "Y" does not exist` in logcat / Sentry | Mobile shipped a migration that hasn't reached cloud | `list_tables` to confirm, `apply_migration` to ship the missing column |
| Tap does nothing | Wrong real-coord math from downscaled screenshot | `uiautomator dump` → read `bounds="[x1,y1][x2,y2]"` |
| Guest works but signed-in shows empty UI | Sync replica path not reached; cloud-direct fallback missing | Phase 2.5d + Phase 4 |
| Signed-in works but guest crashes / cloud-leaks | Adapter path imports `supabase` at module load instead of behind `if (cloud)` | Lazy-import cloud adapter; gate calls on `ctx.kind === 'cloud'` |
| Sign-out leaves stale data on next sign-in | Persister cache scoped to app, not to user id | Clear persister in `onAuthStateChange('SIGNED_OUT')` |

---

## Important rules

1. **Read the codebase first** — Phase 0 is mandatory. Never test blindly.
2. **Emulator/skin/`wm size` first** — Phase 0.5. If AVD exits instantly (`_no_skin`),
wrong **`Physical size`** (stock skin overriding `hw.lcd`), or adb never sees a device,
fix that loop before blaming Metro / JS.
3. **Verify the build is fresh — Phase 1.5 is mandatory.** Confirm the
   patch is on disk, in the bundle, and on the device before walking.
   Skipping this phase is the #1 source of false "nothing changed"
   reports.
4. **Walk both auth paths every session — Phase 2.5 is mandatory.** Guest
   and signed-in route through different adapters; a fix on one regresses
   the other. Always exercise both, plus the migration path between them.
5. **Prefer `am start -W`** for intents / activities — **`monkey -p` is unreliable**
   and silently no-ops on some dev-client configurations.
6. **Always pair UI screencap with logcat** — a screen can lie, a
   stack-trace cannot.
7. **Verify mutations against the DB**, not just the UI cache.
8. **Bump the persister buster** whenever you change what gets persisted,
   so existing devices wipe corrupted blobs on first cold boot.
9. **Resolve Sentry only what you actually fixed.** Auto-reopens are
   louder than over-eager closures.
10. **Clean up server state at the end** — leave the workspace exactly as
   you found it, minus the bugs you patched.
