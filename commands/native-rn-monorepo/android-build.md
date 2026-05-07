# /android-build

Build the Android app in debug mode and verify success.

## Steps

1. From repo root: `cd android && ./gradlew :app:assembleDebug --console=plain`
2. Parse the output for `BUILD SUCCESSFUL` or `BUILD FAILED`.
3. If `BUILD FAILED`, identify the first compilation error in the
   output, propose a fix, and re-run after applying it.
4. If `BUILD SUCCESSFUL`, report the APK path:
   `android/app/build/outputs/apk/debug/app-debug.apk`.
5. If the build is slow (>2 min), check the Gradle daemon status
   with `./gradlew --status`.

## Don't

- Don't declare success without seeing `BUILD SUCCESSFUL` in stdout.
- Don't suggest cleaning + rebuilding as a first response to errors
  — fix the actual error.
- Don't bump SDK or AGP versions to "fix" build errors unless the
  user explicitly asks.
