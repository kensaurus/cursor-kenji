---
name: test-emulator
description: >
  Comprehensive on-device QA for any native mobile build (React Native / Expo,
  Capacitor, Flutter, Tauri-mobile, native Android) running on a local Android
  emulator, paired with backend-truth verification via the Supabase MCP and
  error telemetry via the Sentry MCP. Auto-detects the app stack, boots
  Metro/the bundler if needed, launches the build through the dev launcher or
  installed APK, walks every tab/route as a real signed-in user, triggers
  full CRUD round-trips, verifies each mutation reached the database AND came
  back to the UI, watches logcat + Sentry for crashes, and patches the most
  common native failure modes (white screen, persisted-cache prototype loss,
  missing migrations, sync-disabled empty states, stale tap coords). Use when
  asked to "test the emulator", "test the native build", "test on Android",
  "QA the mobile app", "walk through the app", "test signed-in flow",
  "test mobile CRUD", "fix homepage blank", "diagnose freeze on emulator",
  "smoke-test before TestFlight", or any request to verify a React Native /
  Expo / Capacitor build end-to-end on a local emulator with backend +
  observability MCPs in the loop. Generic across native stacks — not pinned
  to any single repo.
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

## Phase 1: Bring the loop online

### 1a. Verify the emulator + adb

```bash
"$ANDROID_HOME/platform-tools/adb.exe" devices
# Expect: <serial>  device
```

If no device, prompt the user to boot the AVD. Do not block waiting.

### 1b. Confirm the bundler is alive

```bash
# Metro
curl -sf http://localhost:8081/status >/dev/null && echo "metro=ok" || echo "metro=DEAD"
# Capacitor live-reload usually 5173/3000
# Flutter typically 8080
```

If dead, start it in the background and `adb reverse tcp:8081 tcp:8081`
(adapt port). Do **not** block the foreground on the bundler — background it
and poll `/status` every 5s for up to 60s.

### 1c. Launch the app

| Stack | Launch command |
|---|---|
| Expo dev client | `am start -W -a android.intent.action.VIEW -d "exp+<scheme>://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"` |
| Installed APK | `am start -n <app.id>/.MainActivity` |
| Capacitor | `am start -n <app.id>/.MainActivity` then point at live-reload server |

After launch, wait `~12-15s` for the JS bundle, then `screencap` to disk.

### 1d. Health-check the first paint

The first screen MUST be:
1. Not pure white (= Metro died OR JS threw before mount)
2. Not the dev launcher's "Error loading app · unexpected end of stream"
   (= bundler is unreachable from device — fix `adb reverse`)
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
resolution (e.g. 1080×2400 on a Pixel emulator). When the agent reads the
PNG it's downsampled to display (often ≈460×1024). To click an element you
saw on screen:

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
- Device: <emulator-5554, Android <ver>>
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
| "Error loading app · unexpected end of stream" | `adb reverse` lost / Metro restarted on a new port | `adb reverse tcp:8081 tcp:8081`, relaunch via deep-link |
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
2. **Verify the build is fresh — Phase 1.5 is mandatory.** Confirm the
   patch is on disk, in the bundle, and on the device before walking.
   Skipping this phase is the #1 source of false "nothing changed"
   reports.
3. **Walk both auth paths every session — Phase 2.5 is mandatory.** Guest
   and signed-in route through different adapters; a fix on one regresses
   the other. Always exercise both, plus the migration path between them.
4. **Use `am start -W -n <pkg>/.MainActivity`** — `monkey -p` is unreliable
   and silently no-ops on dev clients.
5. **Always pair UI screencap with logcat** — a screen can lie, a
   stack-trace cannot.
6. **Verify mutations against the DB**, not just the UI cache.
7. **Bump the persister buster** whenever you change what gets persisted,
   so existing devices wipe corrupted blobs on first cold boot.
8. **Resolve Sentry only what you actually fixed.** Auto-reopens are
   louder than over-eager closures.
9. **Clean up server state at the end** — leave the workspace exactly as
   you found it, minus the bugs you patched.
