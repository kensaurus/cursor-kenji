# /android-logcat

Tail Android logcat scoped to this app and surface anything
notable.

## Steps

1. Read package name from
   `android/app/src/main/AndroidManifest.xml` (`package=`
   attribute).
2. Get the running PID: `adb shell pidof -s <package_name>`
3. If a PID exists:
   ```
   adb logcat --pid=<pid>
   ```
4. If no PID (app not running), use a tag-based filter:
   ```
   adb logcat *:S ReactNative:V ReactNativeJS:V AndroidRuntime:E
   ```
5. Capture ~50 lines, then summarize:
   - Any `FATAL EXCEPTION` or `AndroidRuntime` crashes (with stack
     trace summary)
   - Any `ReactNative` bridge errors
   - Any `ANR` (Application Not Responding) warnings
   - Any obvious permission denials

## Don't

- Don't dump raw logcat output without summarizing.
- Don't run `adb logcat` without a filter — it's overwhelming.
- Don't `adb logcat -c` (clear buffer) unless explicitly asked —
  it loses context.
