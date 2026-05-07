# /rn-reset

Full reset of React Native caches when builds misbehave with
stale-state symptoms.

Linux/Windows version — no iOS local steps. iOS cache resets happen
on the CI runner.

## When to use

Symptoms that warrant this command:

- "Unable to resolve module" for a module that exists
- Metro showing stale code after edits
- Android build fails with `Duplicate class` errors after a
  dependency change
- Hermes crashes that don't reproduce on a fresh checkout

If symptoms are NOT cache-related, do NOT run this — it's slow and
destructive.

## Steps

1. Stop Metro: `pkill -f "react-native start" || true` (Linux) or
   `taskkill /F /IM node.exe` (Windows, careful — kills all node).
2. Clear Watchman if installed:
   `watchman watch-del-all 2>/dev/null || true`
3. Clear Metro cache: `rm -rf $TMPDIR/metro-* $TMPDIR/haste-map-*`
   (Linux) or `del /s /q %TEMP%\metro-* %TEMP%\haste-map-*`
   (Windows).
4. Reinstall node_modules — match the lockfile present:
   - `package-lock.json` → `rm -rf node_modules && npm install`
   - `yarn.lock` → `rm -rf node_modules && yarn install`
   - `pnpm-lock.yaml` → `rm -rf node_modules && pnpm install`
5. Android Gradle: `cd android && ./gradlew clean && cd ..`
6. Restart Metro: `npx react-native start --reset-cache`

For iOS: a CI re-run with caches cleared. Trigger via
`/ios-ci-trigger` with the `clear-cache` input if your workflow
supports it.

## Don't

- Don't run this in CI — it's a local-debugging tool.
- Don't do this without committing or stashing in-flight changes
  first.
