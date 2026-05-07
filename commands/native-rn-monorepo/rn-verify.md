# /rn-verify

Quick compile check across all locally-buildable targets. iOS is
verified via CI (use `/ios-ci-trigger`).

## Steps

Run in sequence. Stop and report at the first failure.

1. **TypeScript**:
   ```
   npx tsc --noEmit
   ```
2. **ESLint** (skip if no `lint` script):
   ```
   npm run lint
   ```
3. **Android compile only** (faster than full assembleDebug):
   ```
   cd android && ./gradlew :app:compileDebugKotlin :app:compileDebugJavaWithJavac --console=plain && cd ..
   ```
4. **Web** (skip if no `web/` directory):
   ```
   cd web && npm run typecheck && cd ..
   ```

Note: iOS is NOT compiled locally. The shared JS layer running
through `tsc` covers most iOS-relevant errors; native iOS bridge
code can only be verified by triggering CI.

## Output format

```
✓ TypeScript
✓ ESLint
✗ Android — compileDebugKotlin failed: <first error>
✓ Web
- iOS (skipped — verify via CI: `/ios-ci-trigger`)
```

## Don't

- Don't run full `assembleDebug` — that's `/android-build`. This is
  a smoke test.
- Don't keep going past the first failure unless asked for a full
  report.
- Don't pretend iOS is verified just because TS passed — bridge
  changes need CI.
