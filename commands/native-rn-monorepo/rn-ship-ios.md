# /rn-ship-ios

End-to-end: verify locally what can be verified, push, trigger iOS
CI, and watch.

Use this when you've made changes that need to reach TestFlight
(bridge changes, RN version bumps, `Podfile` edits, or any
cross-platform feature where iOS-specific verification is needed).

## Steps

1. **Pre-flight verification** (delegates to `/rn-verify` checks):
   - `npx tsc --noEmit`
   - `npm run lint` if available
   - `cd android && ./gradlew :app:compileDebugKotlin && cd ..` —
     Kotlin failure means a likely RN-version or Gradle issue that
     probably hits iOS too.
   - Stop here if anything fails.

2. **Confirm git state**:
   - `git status` — must be clean OR all relevant changes
     committed.
   - `git log --oneline -5` — confirm the last commit is what you
     expect to ship.

3. **Push to the working branch**:
   ```
   git push origin <branch>
   ```

4. **Trigger iOS CI** (delegates to `/ios-ci-trigger` logic):
   ```
   gh workflow run ios.yml --ref <branch>
   sleep 10
   gh run list --workflow=ios.yml --limit=1
   ```

5. **Watch the run**:
   ```
   gh run watch <run-id>
   ```
   Or, for a non-blocking flow, just print the run URL and let the
   user check later.

6. **On success**:
   - Confirm the TestFlight upload step ran (check the job list).
   - Remind the user that Apple processing takes 5–30 min before
     the build is installable.
   - Print bundle version + build number from the workflow output
     if the workflow surfaces them.

7. **On failure**:
   - Delegate to `/ios-ci-logs` for diagnosis.
   - Do not auto-rerun without user confirmation.

## Don't

- Don't ship a dirty working tree.
- Don't ship without TS + Android compile passing — the iOS macOS
  runner is expensive (10x Linux), don't burn it on shipping
  known-broken code.
- Don't skip step 1 even if "it's a small change."
