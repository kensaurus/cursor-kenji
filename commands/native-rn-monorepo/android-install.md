# /android-install

Install the debug build on a connected device or emulator and
launch it.

## Steps

1. Confirm a device is connected: `adb devices`.
   - If output shows no devices, ask the user to start an emulator
     or plug in a device.
   - If multiple devices, ask which one (or confirm the first
     listed).
2. Read the package name from `android/app/src/main/AndroidManifest.xml`
   (`package=` attribute) or from `android/app/build.gradle`
   `applicationId`.
3. Install: `cd android && ./gradlew :app:installDebug`
4. If install fails with `INSTALL_FAILED_VERSION_DOWNGRADE` or
   `INSTALL_FAILED_UPDATE_INCOMPATIBLE`:
   - Run `adb uninstall <package_name>` then retry installDebug.
5. Launch: `adb shell monkey -p <package_name> -c android.intent.category.LAUNCHER 1`
6. Optionally tail logs (use `/android-logcat` separately).

## Don't

- Don't `adb uninstall` without warning — it wipes app data.
- Don't install on multiple devices simultaneously without
  confirming.
