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

> **Test as a real signed-in user, think as an engineer.**
> Walk the app the way a paying customer would — sign in, browse every tab,
> add a real entry, edit it, delete it. While walking, watch logcat,
> Sentry, and the DB at the same time.

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
| White screen after dev-launcher tap | Metro died OR JS threw before mount | `curl localhost:8081/status` → restart bundler / read logcat for the throw |
| "Error loading app · unexpected end of stream" | `adb reverse` lost / Metro restarted on a new port | `adb reverse tcp:8081 tcp:8081`, relaunch via deep-link |
| Blank where data should be (signed-in, populated user) | Sync replica empty; screen reads only from local SQLite | Add `isSyncEnabled()` runtime check + cloud-direct fallback |
| Persistent skeletons that never resolve | `useFocusEffect(refetch)` with an unstable refetch identity → infinite invalidate→refetch loop | Wrap `refetch` in `useCallback` with stable deps |
| `TypeError: x.isZero is not a function` after cold boot | Persisted cache rehydrated a `Money`/`Date` as a plain object | Skip persistence for that key + bump persister `buster` |
| `Property 'X' doesn't exist` ErrorBoundary | Renamed a hook return value, missed downstream callers | Grep the old name across the file before declaring the rename done |
| `column "Y" does not exist` in logcat / Sentry | Mobile shipped a migration that hasn't reached cloud | `list_tables` to confirm, `apply_migration` to ship the missing column |
| Tap does nothing | Wrong real-coord math from downscaled screenshot | `uiautomator dump` → read `bounds="[x1,y1][x2,y2]"` |

---

## Important rules

1. **Read the codebase first** — Phase 0 is mandatory. Never test blindly.
2. **Use `am start -W -n <pkg>/.MainActivity`** — `monkey -p` is unreliable
   and silently no-ops on dev clients.
3. **Always pair UI screencap with logcat** — a screen can lie, a
   stack-trace cannot.
4. **Verify mutations against the DB**, not just the UI cache.
5. **Bump the persister buster** whenever you change what gets persisted,
   so existing devices wipe corrupted blobs on first cold boot.
6. **Resolve Sentry only what you actually fixed.** Auto-reopens are
   louder than over-eager closures.
7. **Clean up server state at the end** — leave the workspace exactly as
   you found it, minus the bugs you patched.
