# /ios-ci-logs

Fetch logs from the latest failed iOS CI build and diagnose.

## Steps

1. Find the latest failed run:
   ```
   gh run list --workflow=ios.yml --limit=10 --json databaseId,conclusion,displayTitle,headBranch
   ```
   Pick the most recent with `"conclusion": "failure"`.

2. Get the failed job(s) and steps:
   ```
   gh run view <run-id> --log-failed
   ```

3. Identify the failure category. Common iOS CI failure modes for
   RN projects:

   | Symptom in logs | Likely cause |
   |---|---|
   | `No matching provisioning profiles found` | Profile expired or bundle ID mismatch |
   | `Code signing is required for product type 'Application'` | Missing/wrong signing identity in CI |
   | `error: Sandbox: bash(...) deny(1) file-write-create` | Hermes/RN script needs entitlements or permissions tweak |
   | `ld: framework not found` | Pod install missed a transitive dep — bump pod cache invalidation |
   | `RCT-Folly compile error` | Xcode version mismatch with RN version |
   | `pod install` fails with `CDN: trunk URL couldn't be downloaded` | CocoaPods CDN flake — retry |
   | `Apple ID authentication failed` (during TestFlight upload) | App-specific password expired or App Store Connect API key rotated |
   | `ITMS-90xxx` errors | Apple's validation rejected the build — read the message; usually missing usage strings or icon dimensions |
   | `EX_BAD_ACCESS` during build | Random Xcode flake — re-run before investigating |

4. Report:
   - The failed step name and 5–15 lines of the failure context
     (not the whole log).
   - Categorized cause (from the table above or a new diagnosis).
   - Concrete fix suggestion. For "random flake" categories,
     suggest re-running before code changes.

5. If the failure looks transient, suggest:
   ```
   gh run rerun <run-id> --failed
   ```
   This re-runs only the failed jobs without re-doing successful
   ones.

## Don't

- Don't dump the entire log — summarize.
- Don't propose code changes for transient/infra failures (cert
  renewal, CDN flakes, runner issues).
- Don't suggest bumping Xcode or RN versions to "fix" a build error
  without verifying that's actually the cause.
