# /ios-ci-status

Check the status of the most recent iOS CI build.

## Steps

1. List recent runs of the iOS workflow:
   ```
   gh run list --workflow=ios.yml --limit=5
   ```
   (Replace `ios.yml` with the actual filename — confirm with
   `gh workflow list` once.)

2. Identify the latest run's status. Possible states:
   - `queued` / `in_progress` → still running
   - `completed` + conclusion `success` → built and (likely)
     uploaded to TestFlight
   - `completed` + conclusion `failure` → failed, recommend
     `/ios-ci-logs`
   - `completed` + conclusion `cancelled` → manually cancelled

3. For an in-progress run, optionally watch:
   ```
   gh run watch <run-id>
   ```

4. For a completed successful run, summarize:
   - Run duration
   - Commit SHA being built (from
     `gh run view <run-id> --json headSha,displayTitle`)
   - Whether TestFlight upload step ran (look for it in the job
     list: `gh run view <run-id>`)
   - Suggest checking TestFlight directly for processing status
     (Apple's processing takes 5–30 min after upload)

5. If multiple recent runs failed, report the trend, not just the
   latest. Repeated failures on the same step often indicate a
   systemic issue (cert expired, provisioning profile mismatch,
   dependency drift).

## Don't

- Don't poll repeatedly in a tight loop — once or twice is enough;
  use `gh run watch` for live updates.
- Don't claim success based on workflow status alone if the
  TestFlight upload step is in a separate job — verify that job
  specifically.
