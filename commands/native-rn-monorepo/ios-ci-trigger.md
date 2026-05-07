# /ios-ci-trigger

Kick off the iOS build on GitHub Actions. Use after any change that
could affect iOS (native bridge code, `ios/` files, `Podfile`, RN
version bumps, or shared JS that's iOS-sensitive).

## Prereq

- `gh` CLI installed and authenticated: `gh auth status` should
  show your account.
- The iOS workflow file exists at `.github/workflows/<filename>.yml`.
  Confirm by listing: `gh workflow list`.

## Steps

1. Confirm clean working tree — uncommitted changes won't reach CI:
   ```
   git status
   ```
   If dirty, ask the user whether to commit/push first.
2. Confirm pushed:
   ```
   git rev-parse HEAD
   git ls-remote origin HEAD
   ```
   These should match. If not, `git push` first.
3. Trigger the workflow (replace `ios.yml` with the actual filename
   from `gh workflow list`):
   ```
   gh workflow run ios.yml --ref <branch>
   ```
   For workflow with inputs (e.g., a `clear-cache` flag):
   ```
   gh workflow run ios.yml --ref <branch> -f clear-cache=true
   ```
4. Wait briefly for the run to register (workflow_dispatch can take
   5–15s):
   ```
   sleep 10
   gh run list --workflow=ios.yml --limit=1
   ```
5. Report the run URL: `gh run view <run-id> --web` or just print
   the URL.
6. Suggest follow-up: `/ios-ci-status` to check progress,
   `/ios-ci-logs` if it fails.

## Don't

- Don't trigger on every commit — this burns macOS minutes (10x the
  cost of Linux runners).
- Don't trigger from a dirty working tree without committing first
  — CI builds the pushed HEAD, not your local files.
- Don't kick off duplicate runs while one is in progress — cancel
  the old one or wait.
