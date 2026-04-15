---
name: deploy-verify
description: >
  Post-deploy smoke test combining all 5 MCPs (Sentry + Supabase + Langfuse CLI +
  Playwright + Firecrawl) into one workflow. Auto-detects deployment context, checks
  Sentry for new errors (with Seer AI root-cause on P0s), verifies Supabase migration
  health and logs, confirms Langfuse trace pipeline, runs Playwright smoke test on
  critical paths, and produces a ship-or-rollback verdict. Works with any project.
  Use when asked to: "verify deploy", "post-deploy check", "smoke test production",
  "check if deploy is healthy", "ship or rollback", "post-release check",
  "verify release", "deploy health check", or "run post-deploy".
---

# Post-Deploy Verification

Automated post-deploy health check across all services. Run after every deploy to catch
regressions before users do. Works with **any project** — auto-detects configuration.

## Critical Rules

> **Run within 15 minutes of deploy.** The sooner you check, the smaller the blast radius.

> **Parallel where possible.** Sentry, Supabase, and Langfuse checks are independent — run them in parallel to save time.

> **The verdict must be binary.** SHIP, ROLLBACK, or MONITOR (with clear criteria for when MONITOR escalates to ROLLBACK).

> **Evidence over opinion.** Every check produces a PASS/FAIL with specific data. Never say "looks fine."

> **Always use the `browser-anti-stall` protocol** when using Playwright browser MCP tools.

---

## Phase 0: Auto-Detect Deployment Context

### 0a. Detect Deployment Platform

```
Grep(pattern: "vercel\\.json|netlify\\.toml|fly\\.toml|render\\.yaml|railway\\.json|Dockerfile|docker-compose|appspec\\.yml", output_mode: "files_with_matches")
Grep(pattern: "VERCEL_URL|RENDER_EXTERNAL_URL|FLY_APP_NAME|RAILWAY_STATIC_URL", glob: ".env*")
```

### 0b. Find Production URL

```
Grep(pattern: "NEXT_PUBLIC_APP_URL|NEXT_PUBLIC_BASE_URL|VITE_APP_URL|PUBLIC_URL|PRODUCTION_URL|APP_URL", glob: ".env*")
Grep(pattern: "https://.*\\.vercel\\.app|https://.*\\.netlify\\.app|https://.*\\.fly\\.dev|https://.*\\.railway\\.app", glob: ".env*")
```

Also check framework config files:

```
Grep(pattern: "url|domain|hostname", glob: "{vercel.json,netlify.toml,next.config.*}")
```

### 0c. Detect Sentry Release Tracking

```
Grep(pattern: "SENTRY_ORG|SENTRY_PROJECT|SENTRY_DSN|SENTRY_AUTH_TOKEN|@sentry/nextjs|@sentry/react|@sentry/node|sentry-cli", glob: "{.env*,package.json,.sentryclirc,sentry.*.config.*}")
```

### 0d. Detect Supabase Project

```
Grep(pattern: "SUPABASE_URL|NEXT_PUBLIC_SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY|SUPABASE_ANON_KEY", glob: ".env*")
```

To get the project ID for MCP calls:

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "list_projects", arguments: {})
```

Match the detected URL to a project to get `project_id`.

### 0e. Detect Langfuse Integration

```
Grep(pattern: "LANGFUSE_PUBLIC_KEY|LANGFUSE_SECRET_KEY|LANGFUSE_HOST|@langfuse", glob: "{.env*,package.json}")
```

### 0f. Find Critical User Flows

Detect the app's route structure to identify critical paths for smoke testing:

```
Glob("**/app/**/page.{tsx,jsx,ts,js}")
Glob("**/pages/**/*.{tsx,jsx,ts,js}")
Glob("**/src/routes/**/*.{tsx,jsx,svelte}")
```

Identify the critical paths (prioritized):
1. Landing/home page
2. Authentication (login/signup)
3. Main feature (the primary value proposition)
4. One CRUD operation (create or update something)
5. Any AI/LLM feature (if present)

Record all detected values:
- `PRODUCTION_URL`
- `SENTRY_ORG`, `SENTRY_PROJECT`
- `SUPABASE_PROJECT_ID`
- `LANGFUSE_AVAILABLE` (boolean)
- `CRITICAL_PATHS` (list of URLs to smoke test)

---

## Phase 1: Sentry Error Check

### 1a. Find Organization and Project

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "find_organizations", arguments: {})
```

Use the detected org slug and project slug from Phase 0c.

### 1b. Check Recent Releases

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "find_releases", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "projectSlug": "<PROJECT_SLUG>"
})
```

Verify:
- [ ] Latest release matches the deploy (commit hash or version tag)
- [ ] Release was created within the expected deploy window

### 1c. Search for New Issues Since Deploy

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "projectSlug": "<PROJECT_SLUG>",
  "query": "is:unresolved firstSeen:>1h",
  "sortBy": "freq"
})
```

Also check for regressions (previously resolved issues that re-opened):

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "projectSlug": "<PROJECT_SLUG>",
  "query": "is:regressed",
  "sortBy": "freq"
})
```

### 1d. Seer Analysis on P0 Issues

For any new issue with high event count or critical severity, run Sentry's AI root-cause analysis:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "analyze_issue_with_seer", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "issueId": "<ISSUE_ID>"
})
```

This provides:
- Root cause explanation with code-level detail
- Specific file locations and line numbers
- Concrete code fix suggestions

**Decision criteria:**
- 0 new issues → **PASS**
- New issues but low frequency (<5 events) and non-critical → **MONITOR**
- New high-frequency issues or regressions → **FAIL** (potential rollback trigger)
- Seer identifies a one-line fix → **APPLY FIX** instead of rollback

---

## Phase 2: Supabase Health Check

Skip this phase if no Supabase integration detected.

### 2a. Migration Health

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "list_migrations", arguments: {
  "project_id": "<PROJECT_ID>"
})
```

Verify:
- [ ] Latest migration matches what the deploy expected
- [ ] No failed or pending migrations

### 2b. API Logs (last 30 minutes)

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "get_logs", arguments: {
  "project_id": "<PROJECT_ID>",
  "service": "api"
})
```

Check for:
- 5xx errors (server errors)
- Unusual 4xx spike (broken client code)
- Slow queries (>1s response time)

### 2c. Edge Function Logs

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "get_logs", arguments: {
  "project_id": "<PROJECT_ID>",
  "service": "edge-function"
})
```

Check for:
- Function boot errors
- Runtime exceptions
- Timeout errors

### 2d. Auth Logs

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "get_logs", arguments: {
  "project_id": "<PROJECT_ID>",
  "service": "auth"
})
```

Check for:
- Auth failures unrelated to wrong credentials
- Token refresh errors
- RLS policy violations

### 2e. Security and Performance Advisors

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "get_advisors", arguments: {
  "project_id": "<PROJECT_ID>",
  "type": "security"
})
```

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "get_advisors", arguments: {
  "project_id": "<PROJECT_ID>",
  "type": "performance"
})
```

Flag any new warnings that weren't present before the deploy.

### 2f. Critical Data Integrity

Run a quick data integrity check on the most important tables:

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "execute_sql", arguments: {
  "project_id": "<PROJECT_ID>",
  "query": "SELECT schemaname, relname, n_dead_tup, last_autovacuum FROM pg_stat_user_tables WHERE n_dead_tup > 10000 ORDER BY n_dead_tup DESC LIMIT 5"
})
```

**Decision criteria:**
- All logs clean, migrations applied, no advisor warnings → **PASS**
- Minor warnings in logs but no 5xx → **MONITOR**
- 5xx errors in API/Edge logs or failed migrations → **FAIL**

---

## Phase 3: Langfuse Health Check

Skip this phase if no Langfuse integration detected.

### 3a. Check Recent Traces

```bash
npx langfuse-cli api traces list --limit 10
```

Verify:
- [ ] New traces are arriving (timestamps within last 15 minutes)
- [ ] Trace names match expected AI features
- [ ] No error status on traces

### 3b. Check Latency and Errors

From the trace list, examine:
- Average latency compared to baseline (is it significantly higher post-deploy?)
- Any traces with error status or missing generations
- Token usage anomalies (sudden spike could indicate prompt regression)

### 3c. Verify Prompt Versions

```bash
npx langfuse-cli api prompts list
```

Confirm that active prompt versions match what the deploy should be using (check the `production` label).

**Decision criteria:**
- Traces flowing, normal latency, correct prompt versions → **PASS**
- No new traces but deploy just happened → **MONITOR** (wait 5 more minutes)
- Error traces or latency spike → **FAIL**

---

## Phase 4: Playwright Smoke Test

### 4a. Navigate to Production

```json
CallMcpTool(server: "user-playwright", toolName: "browser_navigate", arguments: {
  "url": "<PRODUCTION_URL>"
})
```

**Important**: Apply the `browser-anti-stall` protocol:
- Set 15-second timeout expectations
- Skip `browser_wait_for` on navigation
- Use `browser_snapshot` to detect ready state

### 4b. Test Critical Paths

For each critical path identified in Phase 0f:

1. **Navigate** to the page
2. **Snapshot** to verify it loaded (not a blank page or error screen)
3. **Check console** for errors:

```json
CallMcpTool(server: "user-playwright", toolName: "browser_console_messages", arguments: {})
```

4. **Check network** for failed requests:

```json
CallMcpTool(server: "user-playwright", toolName: "browser_network_requests", arguments: {})
```

### 4c. Test Authentication (if applicable)

If the app has auth:
1. Navigate to login page
2. Verify login form renders
3. (If test credentials available) Log in and verify redirect to authenticated area

### 4d. Test Main Feature

Navigate to the primary feature and perform one basic interaction:
- If it's a form: fill and submit
- If it's a list: verify items render
- If it's a dashboard: verify data loads (not empty state when data should exist)
- If it's an AI feature: trigger one generation and verify response appears

### 4e. Take Evidence Screenshot

```json
CallMcpTool(server: "user-playwright", toolName: "browser_take_screenshot", arguments: {})
```

**Decision criteria:**
- All critical paths load, no console errors, no 5xx network requests → **PASS**
- Minor visual glitches but functional → **MONITOR**
- Pages fail to load, 5xx errors, or auth broken → **FAIL**

---

## Phase 5: Ship-or-Rollback Verdict

Aggregate all phase results into a final verdict.

### Decision Matrix

| Scenario | Verdict |
|----------|---------|
| All phases PASS | **SHIP** — Deploy is healthy |
| All phases PASS except 1-2 MONITOR items | **MONITOR** — Watch for 1 hour, re-check |
| Any phase FAIL with a quick fix available | **HOTFIX** — Apply fix and re-verify |
| Any critical phase FAIL (auth broken, data loss, 5xx on main feature) | **ROLLBACK** — Revert immediately |
| Seer identifies a simple root cause for the only FAIL | **HOTFIX** — Apply Seer's fix, re-verify |

### Report

```
═══════════════════════════════════════════════════════
   POST-DEPLOY VERIFICATION REPORT
   Project: <PROJECT_NAME>
   Deploy Time: <TIMESTAMP>
   Production URL: <URL>
   Checked At: <CHECK_TIMESTAMP>
═══════════════════════════════════════════════════════

## HEALTH CHECK RESULTS

| Check                        | Status  | Details                              |
|------------------------------|---------|--------------------------------------|
| Sentry: new errors           | ✅/❌  | [0 new / N new — list top issues]    |
| Sentry: regressions          | ✅/❌  | [0 regressed / N regressed]          |
| Sentry: release tracked      | ✅/❌  | [release ID and timestamp]           |
| Supabase: migrations         | ✅/❌  | [all applied / N pending/failed]     |
| Supabase: API logs           | ✅/❌  | [clean / N errors in last 30m]       |
| Supabase: Edge Function logs | ✅/❌  | [clean / N errors]                   |
| Supabase: Auth logs          | ✅/❌  | [clean / N errors]                   |
| Supabase: advisors           | ✅/❌  | [no new warnings / N new warnings]   |
| Langfuse: traces flowing     | ✅/❌  | [N traces in last 15m / no traces]   |
| Langfuse: latency            | ✅/❌  | [normal / Xms above baseline]        |
| Langfuse: prompt versions    | ✅/❌  | [match expected / mismatch on N]     |
| Smoke: home page             | ✅/❌  | [loads in Xs / error]                |
| Smoke: auth flow             | ✅/❌  | [works / broken]                     |
| Smoke: main feature          | ✅/❌  | [works / broken]                     |
| Smoke: console errors        | ✅/❌  | [0 errors / N errors]                |
| Smoke: network 5xx           | ✅/❌  | [0 / N failed requests]              |

## SEER ANALYSIS (if any P0 issues)

Issue: <ISSUE_ID>
Root Cause: <SEER_EXPLANATION>
Suggested Fix: <CODE_FIX>
Files Affected: <FILE_LIST>

## VERDICT

┌─────────────────────────────────────────────────┐
│                                                 │
│   [SHIP / MONITOR / HOTFIX / ROLLBACK]          │
│                                                 │
│   Reason: <one-line explanation>                │
│                                                 │
│   Next action: <what to do now>                 │
│                                                 │
└─────────────────────────────────────────────────┘

## MONITOR ESCALATION (if verdict is MONITOR)

Re-check in: [30 minutes / 1 hour]
Escalate to ROLLBACK if: [specific condition, e.g., error count exceeds 50]
Watch: [specific metrics to monitor]

═══════════════════════════════════════════════════════
```
