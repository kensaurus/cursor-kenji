---
name: workflow-fix-and-ship
description: >-
  Complete bug-fix lifecycle in one sweep: triage production signals (Sentry /
  logs) → reproduce → fix (debug-error) → verify full-stack (test-playwright) →
  PR (workflow-pr) → post-deploy smoke (deploy-verify). Use when "fix this bug
  and close the ticket", "patch this and ship", "fix this Sentry issue", "bug
  report from user", or when a production error needs to go from alert to
  resolved in a single session.
license: MIT
---

# workflow-fix-and-ship — Bug Fix Lifecycle

Triage → fix → verify → ship. Every step leaves evidence.

---

## Phase sequence

```
1. TRIAGE     → pull Sentry + logs, reproduce locally
2. ROOT CAUSE → debug-error (isolate, identify, understand)
3. FIX        → surgical change, matching tests
4. VERIFY     → test-playwright (confirm fix, catch regressions)
5. PR         → workflow-pr
6. POST-SHIP  → deploy-verify (optional if deploy is immediate)
```

---

## Phase 1: Triage

Pull signals before touching code:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG>",
  "naturalLanguageQuery": "<describe the bug>",
  "projectSlugOrId": "<PROJECT>",
  "regionUrl": "<REGION_URL>",
  "limit": 5
})
```

Then pull Supabase logs if the bug may be data-related:
```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "get_logs", arguments: {
  "project_id": "<PROJECT_ID>",
  "service": "api"
})
```

**Reproduce locally before any code change.** State the exact repro steps.

---

## Phase 2: Root cause (read debug-error)

> Read `~/.cursor/skills/debug-error/SKILL.md` and follow it.

Required output: one-sentence root cause statement — "The bug is X because Y."

---

## Phase 3: Fix

Rules:
- Surgical change only — do not refactor unrelated code
- Add a regression test that would have caught this bug
- If the fix requires a schema change, apply via Supabase MCP and write the migration file

---

## Phase 4: Verify (read test-playwright)

> Read `~/.cursor/skills/test-playwright/SKILL.md` and follow it.

Drive the live app through the exact repro scenario. Confirm the fix resolves it. Check that nearby flows still work (regression scope = files touched ± 1 level).

---

## Phase 5: PR (read workflow-pr)

> Read `~/.cursor/skills/workflow-pr/SKILL.md` and follow it.

PR description must include:
- Root cause (one sentence)
- Sentry issue link or repro steps
- Screenshot/recording showing the fix working

---

## Phase 6: Post-deploy smoke (optional — read deploy-verify)

If deploying immediately after merge, read `~/.cursor/skills/deploy-verify/SKILL.md`.

Resolve the Sentry issue after confirming the fix is live in production.

---

## Done criteria

- [ ] Reproduced locally with exact steps
- [ ] Root cause identified (not just "it was broken")
- [ ] Regression test added
- [ ] Smoke test confirms fix and no new breakage
- [ ] PR open with root cause + evidence
- [ ] Sentry issue resolved (after deploy confirmation)
