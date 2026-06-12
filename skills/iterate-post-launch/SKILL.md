---
name: iterate-post-launch
description: >-
  Close the post-launch improvement loop for any shipped app. Pulls Sentry for
  top errors and performance regressions, Supabase for slow queries, failed API
  calls, and advisor warnings, Firecrawl for current best-practice patterns.
  Identifies the top user pain points, ranks them by impact × effort, plans
  concrete improvements, implements fixes, and verifies them with Playwright.
  Generic across any stack. Use when asked to "improve the app after launch",
  "fix the top issues", "post-launch polish", "what should I fix next",
  "production issues", "iterate on feedback", "post-release improvements",
  "what is broken in prod", "ship a polish pass", or "make it better based on
  real usage".
license: MIT
---

# iterate-post-launch — Production Signal → Prioritised Fix Loop

**You shipped. That is the beginning, not the end.** Real users hit real paths
you did not test. Sentry, Supabase logs, and the live UI tell you exactly what
to fix next — if you know how to read them. This skill turns those signals into
a ranked, actionable improvement plan and then implements it.

> **Plan → Signal → Triage → Fix → Verify.** Do not guess what to improve.
> Let production data point to the highest-impact work first.

**Before ANY browser action, read `protocol-browser-anti-stall`.**

---

## Phase 0: Context

Read the stack before pulling any signals:

```
package.json → framework, Sentry SDK, Supabase client version
.env.local    → SENTRY_ORG, SENTRY_PROJECT, SUPABASE_PROJECT_ID (name only)
README        → any known issues the team is tracking
```

Confirm available MCPs: `plugin-sentry-sentry`, `plugin-supabase-supabase`,
`user-firecrawl`, `user-playwright`.

---

## Phase 1: Pull production signals

Run all signal sources in parallel, then synthesise.

### 1a. Sentry — errors and performance

Look up tool schemas under `mcps/plugin-sentry-sentry/tools/` first.

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG>",
  "naturalLanguageQuery": "unresolved issues last 14 days sorted by frequency",
  "projectSlugOrId": "<PROJECT>",
  "regionUrl": "<REGION_URL>",
  "limit": 25
})
```

For each top-5 issue, get root-cause analysis:
```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "analyze_issue_with_seer", arguments: {
  "organizationSlug": "<ORG>",
  "issueId": "<ISSUE_ID>",
  "regionUrl": "<REGION_URL>"
})
```

Record per issue: title, frequency (events/users), first/last seen, component.

### 1b. Supabase — query performance and API failures

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "get_logs", arguments: {
  "project_id": "<PROJECT_ID>",
  "service": "api"
})
```

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "get_logs", arguments: {
  "project_id": "<PROJECT_ID>",
  "service": "postgres"
})
```

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "get_advisors", arguments: {
  "project_id": "<PROJECT_ID>"
})
```

Flag:
- API: repeated 5xx, slow responses (>1 s), CORS errors, RLS denies
- Postgres: sequential scans on large tables, missing indexes, bloated RLS policies
- Advisors: ERROR-level items = immediate action; WARN = scheduled

### 1c. Live UX walkthrough (Playwright)

Navigate the app's 3–5 most-used flows as a real user. Look for:
- Anything that is obviously broken, slow, or confusing
- Empty/error states that have no message
- Console errors and network failures during normal use

```
browser_navigate → primary pages
browser_console_messages → capture errors
browser_network_requests → capture 4xx/5xx
browser_take_screenshot → visual evidence per page
```

### 1d. Research best practices for flagged areas

For each signal category that surfaced issues:
```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<framework> <issue-type> fix best practices 2026",
  "limit": 3,
  "sources": [{ "type": "web" }]
})
```

---

## Phase 2: Triage — rank by impact × effort

Build an improvement backlog. For each finding:

| Field | What to fill |
|-------|-------------|
| Source | Sentry / Supabase logs / Advisor / Live walkthrough |
| Finding | One sentence describing what is wrong |
| Affected users | High (blocks most users) / Medium (hits some) / Low (edge case) |
| Effort | S (< 1 h) / M (half day) / L (multi-day, consider splitting) |
| Priority | Critical / High / Medium / Low |

**Priority mapping**:
- Critical: production crash or data loss affecting real users
- High: broken feature, significant UX failure, missing index on hot query
- Medium: degraded experience, slow query, console error not shown to user
- Low: cosmetic issue, info-only log noise, minor UX annoyance

Sort the backlog: Critical first, then by impact ÷ effort (quick wins above hard ones).

---

## Phase 3: Plan the improvement sprint

For the top 5–10 items, map each to specific code:

```
Improvement: [title]
Root cause: [1 sentence]
Fix: [file path + what to change]
Verify: [how to confirm it is fixed]
Risk: [low / medium — explain if medium+]
```

Present the plan to the user. Get confirmation before making changes.

---

## Phase 4: Implement fixes

Work through the approved list one by one, following
`workflow-coding-discipline` principles:

1. Read the file before editing. Understand the existing pattern.
2. Make the surgical change. No refactoring unrelated code.
3. `ReadLints` after each edit. Fix introduced linter errors.
4. For Supabase schema fixes (missing index, RLS policy):
   - Deploy via MCP: `apply_migration` for DDL, `execute_sql` for data fixes
   - Write the matching versioned migration file under `supabase/migrations/`
   - Verify the object exists: query `information_schema` / `pg_indexes` / `pg_policies`

---

## Phase 5: Verify each fix

After each fix, drive the specific flow that was broken:

```
browser_navigate → affected page
browser_snapshot → confirm page renders correctly
[reproduce the original scenario]
browser_console_messages → green (no new errors)
browser_network_requests → 2xx where it was failing
browser_take_screenshot → evidence of fixed state
```

For Supabase fixes, re-run the failing query with `execute_sql` and confirm
the performance improvement or policy correction.

For Sentry issues: mark as resolved only after live verification confirms the
fix, not before:
```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "update_issue", arguments: {
  "organizationSlug": "<ORG>",
  "issueId": "<ISSUE_ID>",
  "status": "resolved",
  "regionUrl": "<REGION_URL>"
})
```

---

## Phase 6: Improvement report

```markdown
## Post-Launch Improvement Report — [App] — [Date]

### Signal sources checked
- Sentry: [issue count, date range]
- Supabase logs: [service, date range]
- Supabase advisors: [ERROR count / WARN count]
- Live walkthrough: [pages tested]

### Improvements implemented
| # | Source | Finding | Fix (file) | Verified |
|---|--------|---------|-----------|---------|
| 1 | Sentry | [error] | [file:line] | ✅ |

### Deferred (needs more investigation or is out of scope)
| # | Finding | Why deferred | Recommendation |
|---|---------|-------------|----------------|

### Remaining Sentry noise
- [issues that are known / won't-fix / need tracking ticket]

### Before / after summary
- Errors resolved: [count]
- Queries improved: [count, estimated ms saved]
- UX issues fixed: [count]
```

---

## Guardrails

- **No speculative improvements** — only act on signal from production data.
- **Ask before deleting or restructuring** — fixes should be surgical.
- **Schema the user asked for ships; DELETE/UPDATE on real rows asks first.**
- **Re-test every fix live** — a fix is not done until Playwright confirms it.
