---
name: debug-sentry-monitor
description: >
  Monitor, triage, fix, and proactively enhance Sentry error monitoring for any project.
  Use when asked to: check Sentry, fix Sentry errors, triage Sentry issues,
  run post-deploy monitoring, review production errors, clean up Sentry noise,
  audit Sentry setup, improve monitoring coverage, enhance error tracking,
  or "run sentry check". Works with any GitHub repo — auto-detects org, project,
  framework, and config. Fetches issues via Sentry MCP, triages them,
  performs root cause analysis, fixes code bugs, updates noise filters,
  audits the monitoring architecture, and resolves issues only after verified fixes.
---

# Sentry Monitor

Automated Sentry issue triage, root cause analysis, fix, architecture audit, and monitoring enhancement workflow.
Works with **any project** — auto-detects configuration from the codebase.
Uses the `plugin-sentry-sentry` MCP server for all Sentry API operations.

## Critical Rules

> **NEVER resolve an issue without a verified fix.**
> Resolving means "this will not happen again." If you cannot prove that, leave it unresolved.

> **NEVER apply a band-aid fix.**
> Wrapping code in try/catch, adding `?.` chains, or guarding with `Array.isArray()` are symptom suppressors.
> Only use defensive coding *after* fixing the root cause, to harden against truly unpredictable external input.

> **Understand the WHY before touching any code.**

> **Research before fixing non-trivial bugs.**
> Use `firecrawl_search` + `firecrawl_scrape` to find best practices for the specific error pattern before implementing a fix.

---

## Step 0: Auto-Detect Project Configuration

Before making any Sentry MCP calls, discover the project's Sentry setup.

### 0a. Find Organization and Project

First, try to detect from local config files. Search for these (in order):

1. `.sentryclirc` — contains `[defaults]` with `org` and `project`
2. `sentry.properties` — contains `defaults.org` and `defaults.project`
3. `.env`, `.env.local`, `.env.production` — look for `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
4. `sentry.client.config.ts`, `sentry.client.config.js` — Next.js Sentry config
5. `sentry.server.config.ts`, `sentry.server.config.js` — Next.js server Sentry config
6. `next.config.js` / `next.config.mjs` — `withSentryConfig()` wrapper
7. `package.json` — check for `@sentry/*` packages to detect SDK

If local detection fails, use the MCP to discover:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "find_organizations")
```

Then for the target org:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "find_projects", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "regionUrl": "<REGION_URL>"
})
```

### 0b. Detect Framework and Platform

Read `package.json` (or equivalent) to determine:

| Package | Framework |
|---------|-----------|
| `@sentry/nextjs` | Next.js |
| `@sentry/react` | React SPA |
| `@sentry/vue` | Vue.js |
| `@sentry/svelte` | SvelteKit |
| `@sentry/node` | Node.js backend |
| `@sentry/browser` | Vanilla JS |
| `sentry-sdk` (pip) | Python |
| `sentry_sdk` (pip) | Python |
| `sentry-ruby` | Ruby |
| `@sentry/angular` | Angular |

### 0c. Locate Sentry Config Files

Search for the Sentry initialization and noise filtering:

```
Grep for: Sentry.init, sentryInit, initSentry
Grep for: ignoreErrors, beforeSend, denyUrls
Grep for: ErrorBoundary, error-boundary, errorBoundary
Grep for: logger, logging, winston, pino
Grep for: web-vitals, webVitals, reportWebVitals
```

### 0d. Record Detected Configuration

```
ORG_SLUG:        [detected or ask user]
PROJECT_SLUG:    [detected or ask user]
REGION_URL:      [detected or ask user — typically https://us.sentry.io or https://de.sentry.io]
FRAMEWORK:       [detected from packages]
PLATFORM:        [browser | server | hybrid]
SENTRY_CONFIG:   [path to Sentry.init file]
NOISE_FILTER:    [path to file with ignoreErrors/beforeSend]
ERROR_BOUNDARY:  [path to error boundary component, if any]
LOGGER:          [path to logging utility, if any]
```

If any critical values cannot be detected, ask the user.

---

## Step 1: Fetch Issues

Run these two MCP calls in parallel:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "projectSlugOrId": "<PROJECT_SLUG>",
  "regionUrl": "<REGION_URL>",
  "naturalLanguageQuery": "all unresolved issues from the last 7 days",
  "limit": 50
})

CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_events", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "projectSlug": "<PROJECT_SLUG>",
  "regionUrl": "<REGION_URL>",
  "naturalLanguageQuery": "count of errors grouped by error type in the last 7 days",
  "limit": 50
})
```

Also check for regressions (issues that were resolved but re-opened):

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "projectSlugOrId": "<PROJECT_SLUG>",
  "regionUrl": "<REGION_URL>",
  "naturalLanguageQuery": "regressed issues in the last 14 days",
  "limit": 20
})
```

If no issues are found, report "No unresolved issues in the last 7 days" and proceed to the Architecture Audit (Step 8).

---

## Step 2: Get Issue Details

For each issue with >1 event or >0 users impacted:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "get_sentry_resource", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "resourceType": "issue",
  "resourceId": "<ISSUE_ID>"
})
```

Batch up to 4 calls in parallel per round.

For hard-to-diagnose issues, also fetch breadcrumbs:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "get_sentry_resource", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "resourceType": "breadcrumbs",
  "resourceId": "<ISSUE_ID>"
})
```

And optionally use Seer for AI-assisted root cause analysis:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "analyze_issue_with_seer", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "regionUrl": "<REGION_URL>",
  "issueId": "<ISSUE_ID>"
})
```

For understanding issue distribution, check tag values:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "get_issue_tag_values", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "regionUrl": "<REGION_URL>",
  "issueId": "<ISSUE_ID>",
  "tagKey": "browser"
})
```

Common tag keys: `url`, `browser`, `browser.name`, `os`, `environment`, `release`, `device`, `user`.

---

## Step 3: Triage

Classify each issue into exactly one bucket:

| Bucket | Signals | Action |
|--------|---------|--------|
| **Noise** | Extension frames, chunk load errors, browser built-in errors, dev-only environment tag, no app frames in stacktrace | Add noise filter, resolve in Sentry |
| **Code Bug** | TypeError, ReferenceError, unhandled rejection with app frames, missing function/property | Full root cause analysis (Step 4), fix, verify, resolve |
| **Data Bug** | Unexpected null/undefined from API, malformed response, stale cache, race condition | Trace data flow end-to-end (Step 4), fix at source |
| **Performance** | Slow DB query, N+1 API calls, large HTTP payload, high LCP/INP | Do NOT resolve — flag for manual follow-up |
| **Regression** | Previously resolved issue that re-opened | Highest priority — the original fix was incomplete |
| **Config Gap** | Missing Sentry feature (logging, metrics, feedback, replay), bad sampling | Implement in config files, resolve |

Priority order: Regressions first, then Code Bugs and Data Bugs, then Noise, then Config Gaps. Performance is always deferred.

### 3a. Seer AI Analysis for High-Impact Issues

For any issue classified as **Code Bug**, **Data Bug**, or **Regression** that meets either threshold:
- **>10 events** (high frequency)
- **>5 affected users** (high impact)

Run Sentry's AI root-cause analysis before manual investigation:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "analyze_issue_with_seer", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "issueId": "<ISSUE_ID>"
})
```

Seer provides:
- Root cause explanation with code-level detail
- Specific file locations and line numbers where the error originates
- Concrete code fix suggestions you can apply directly

**How to use Seer results:**
- If Seer identifies a clear root cause with a specific fix → **start from that fix** in Step 4, validate it against the codebase, and apply if correct.
- If Seer's analysis is inconclusive or too generic → **proceed with manual root cause analysis** in Step 4 as normal.
- Always include Seer's analysis in the triage report (Step 8) regardless of whether you used the fix.

> **Note:** Seer results are cached — subsequent calls for the same issue return instantly. Analysis for new issues takes ~2-5 minutes.

---

## Step 4: Root Cause Analysis (for Code Bugs and Data Bugs)

Do NOT skip or shortcut this step.

### 4a. Read the Full Error Context

From the Sentry issue details, extract:
- **Exception type and message** — the exact error
- **Full stacktrace** — every frame, not just the top
- **Breadcrumbs** — what happened leading up to the error
- **Tags** — browser, OS, URL, user, environment, release
- **Additional data / context** — request payload, state snapshots
- **Event frequency pattern** — when did it start? Does it correlate with a deploy?

### 4b. Check Release Correlation

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "find_releases", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "regionUrl": "<REGION_URL>",
  "projectSlug": "<PROJECT_SLUG>"
})
```

If the issue started after a specific release, check what changed in that release:
```bash
git log --oneline <previous-release-tag>..<current-release-tag>
```

### 4c. Trace the Code Path

1. **Start from the crash site**: Read the full function where the error was thrown.
2. **Walk up the call chain**: For each app-code frame in the stacktrace, read the file and function.
3. **Walk down to the data source**: If the error involves unexpected data, trace where that data comes from:
   - Database query? Read the query, check the schema.
   - React state/props? Find where the state is set.
   - URL param or user input? Check validation/parsing.
   - Cache or store? Check invalidation and staleness.
4. **Check recent changes**: `git log --oneline -20 -- <file>` on culprit files.

### 4d. Research Best Practices Before Fixing

For non-trivial bugs, research the correct fix pattern:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<framework> <error-type> best practice fix <current year>",
  "limit": 5,
  "sources": [{ "type": "web" }]
})
```

Then scrape the most authoritative result:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "<best-result-url>",
  "formats": ["markdown"],
  "onlyMainContent": true
})
```

### 4e. Formulate the Root Cause

Before writing any fix, state:
1. **What happened**: The specific runtime state that caused the error
2. **Why it happened**: The upstream reason that state was possible
3. **Where to fix it**: The correct layer — usually NOT the crash site, but where bad state originates

### 4f. Validate Against Anti-Patterns

| Anti-Pattern | Why It's Wrong | Do Instead |
|-------------|---------------|------------|
| Adding `?.` to suppress TypeError | Hides the null; downstream gets undefined | Fix why the value is null |
| try/catch that swallows | Error still happens, user sees broken state | Fix the error; if unrecoverable, show user-facing message + re-report |
| `Array.isArray()` guard | Checking consumer instead of fixing producer | Fix the producer |
| `?? []` or `?? {}` fallback | Masks data loading issues | Handle loading/error states explicitly |
| Filtering in `beforeSend` | Muting a real bug | Only filter genuinely external noise |
| Resolving without deploying | Error recurs next session | Only resolve after fix is committed |

### 4g. Check for Side Effects

Before applying the fix:
- Are there other callers of the function you're changing?
- Will the fix change return type or behavior for other consumers?
- Does the fix require updating types, tests, or related components?

---

## Step 5: Apply Fixes

### Noise Fixes

Read the project's Sentry config file (detected in Step 0c). Locate the `ignoreErrors` array or `beforeSend` function.

**Universal noise patterns** (safe to add to any web project):

```javascript
// Browser/extension noise
/^Script error/,
"ResizeObserver loop",
"Non-Error promise rejection captured",
/vid_mate_check/,
/_avast_submit/,

// Network noise (external)
"Failed to fetch",
"Load failed",
"net::ERR_",
"AbortError",
"The operation was aborted",
"cancelled",

// Chunk loading (deployment race)
"ChunkLoadError",
"Loading chunk",
"Failed to fetch dynamically imported module",
```

**Framework-specific noise** (add only if the framework is detected):

React/Next.js:
```javascript
"Hydration failed",
"server rendered HTML didn't match",
"Minified React error #418",
"Minified React error #423",
"Minified React error #425",
```

HMR/Dev-only:
```javascript
"Fast Refresh",
"performing full reload",
"Parsing ecmascript source code failed",
```

Service Worker:
```javascript
"ServiceWorker",
"Failed to register a ServiceWorker",
```

**Noise validation**: Before classifying something as noise, verify:
- The error message does NOT originate from app code
- There are NO app frames in the stacktrace
- The error cannot be triggered by a real user action

### Code Bug / Data Bug Fixes

1. Fix at the root cause layer identified in Step 4e.
2. Make invalid state unrepresentable where possible.
3. Follow project conventions (read README files, existing patterns).
4. If the fix requires schema changes or infra work, flag for manual follow-up.

### Performance Fixes

Do NOT attempt. Do NOT resolve. Leave unresolved. Note in the summary.

### Config Gap Fixes

Implement in the relevant config file based on detected framework.

---

## Step 6: Verify Before Resolving

You may only resolve an issue if ALL of the following are true:

- [ ] Root cause identified (not just the symptom)
- [ ] Fix addresses root cause (not just suppresses the error)
- [ ] Fix does not introduce new issues for other callers
- [ ] For Noise: error genuinely originates outside app code
- [ ] For Code/Data Bugs: full code path read, fix is logically correct
- [ ] You have NOT merely added `?.`, try/catch, or type guards as the sole fix

If any checkbox fails, leave the issue **unresolved** and add it to "Requires Manual Follow-Up."

---

## Step 7: Resolve in Sentry

For each verified fix:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "update_issue", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "regionUrl": "<REGION_URL>",
  "issueId": "<ISSUE_ID>",
  "status": "resolved"
})
```

Batch up to 4 calls in parallel. Do NOT resolve performance issues.

---

## Step 8: Architecture Audit (Proactive Enhancement)

After triaging existing issues (or if no issues exist), audit the Sentry setup itself to identify monitoring gaps and architectural shortcomings.

### 8a. SDK Configuration Audit

Read the Sentry config file(s) detected in Step 0c. Check each setting:

| Setting | What to Check | Recommendation |
|---------|--------------|----------------|
| `dsn` | Is it set from env var, not hardcoded? | Use `process.env.SENTRY_DSN` or equivalent |
| `environment` | Is it dynamic? | Must read from env var, not hardcoded |
| `release` | Is it set? | Required for deploy correlation and regression detection |
| `tracesSampleRate` | Is it > 0? Is it < 1.0 in production? | 0.1-0.3 for production, 1.0 for dev |
| `replaysSessionSampleRate` | Is it configured? | 0.1 for production |
| `replaysOnErrorSampleRate` | Is it configured? | 1.0 (capture all error replays) |
| `integrations` | Are framework-appropriate integrations present? | See framework-specific recommendations below |
| `beforeSend` | Is it filtering too aggressively? | Should only filter genuinely external noise |
| `ignoreErrors` | Are patterns appropriate? | Cross-check against universal noise list |

**Framework-specific integration checks:**

| Framework | Expected Integrations |
|-----------|----------------------|
| Next.js | Auto-configured by `@sentry/nextjs` — check `withSentryConfig` in `next.config` |
| React SPA | `BrowserTracing`, `Replay` |
| Node.js | `Http`, `Express`/`Fastify`/`Koa`, `Postgres`/`Prisma` |
| Python | `DjangoIntegration` / `FlaskIntegration`, `SqlalchemyIntegration` |
| Vue | `BrowserTracing`, `Replay`, `Sentry.vueRouterInstrumentation` |

### 8b. Monitoring Coverage Audit

Check what IS and IS NOT being monitored:

**Error Monitoring:**
- [ ] Global error handler configured (browser: `window.onerror`; Node: `process.on('unhandledRejection')`)
- [ ] Error boundaries catch all component trees (React) / global error handler (Vue/Angular)
- [ ] API error responses are captured with context
- [ ] Background job/worker errors are captured

**Performance Monitoring:**
- [ ] `tracesSampleRate > 0` (performance monitoring is ON)
- [ ] Key transactions instrumented (API routes, DB queries, external calls)
- [ ] Web Vitals being reported (LCP, INP, CLS)
- [ ] Custom spans for business-critical operations

**Session Replay:**
- [ ] Replay SDK installed and configured
- [ ] `replaysOnErrorSampleRate` set to 1.0 (capture replays when errors occur)
- [ ] Privacy masking configured appropriately

**Contextual Data:**
- [ ] User identity set (`Sentry.setUser()` after auth)
- [ ] Custom tags for business context (feature flags, plan tier, locale)
- [ ] Breadcrumbs rich enough (not just defaults — custom breadcrumbs for key user actions)
- [ ] Structured context (`Sentry.setContext()`) for debugging

**Source Maps:**
- [ ] Source maps uploaded during build (check for `@sentry/webpack-plugin`, `@sentry/cli`, or framework-specific upload)
- [ ] Verify stacktraces in Sentry show original source, not minified code
- [ ] `.sentryclirc` or auth token configured for uploads

### 8c. Research Current Best Practices

Search for the latest Sentry recommendations for the detected framework:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<FRAMEWORK> sentry best practices configuration <current year>",
  "limit": 5,
  "sources": [{ "type": "web" }]
})
```

Scrape the Sentry official docs for the framework:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "https://docs.sentry.io/platforms/<platform>/",
  "formats": ["markdown"],
  "onlyMainContent": true
})
```

Platform paths: `javascript/nextjs`, `javascript/react`, `javascript/vue`, `python/django`, `python/flask`, `node`, `go`, `java/spring-boot`, `ruby/rails`.

### 8d. Alerting Audit

Check if alert rules exist and are useful:
- Are there alerts for error spikes? (e.g., >10x normal rate in 5 min)
- Are there alerts for new issue types?
- Are there alerts for regression (previously resolved issue re-opening)?
- Are there alerts for performance degradation (p95 response time)?

Recommend alert rules if none exist.

---

## Step 9: Summary Report

Output this report after all work is complete:

```markdown
## Sentry Monitor Report — [Project Name]

### Configuration Detected
- Organization: [org slug]
- Project: [project slug]
- Framework: [framework]
- Platform: [browser/server/hybrid]
- Sentry Config: [file path]

### Issues Addressed

| Issue ID | Title | Events | Users | Bucket | Root Cause | Fix Applied | Status |
|----------|-------|--------|-------|--------|-----------|-------------|--------|
| XX-123 | ... | N | N | Bug | "query returns null when..." | "added explicit empty state..." | resolved |
| XX-124 | ... | N | N | Noise | "browser extension injects..." | "added ignoreErrors pattern" | resolved |

### Seer AI Analysis

| Issue ID | Seer Root Cause | Seer Suggested Fix | Used? | Notes |
|----------|----------------|--------------------|-------|-------|
| XX-123 | [Seer's root cause explanation] | [Seer's code fix summary] | Yes/No | [why used or why overridden] |

### Root Cause Analysis Details

For each Code Bug / Data Bug:

**XX-123: [Title]**
- **Seer analysis**: [summary of Seer's findings, or "N/A — below threshold"]
- **What happened**: [runtime state that caused the crash]
- **Why it happened**: [upstream reason — the actual root cause]
- **Fix location**: [file(s) changed and what was changed]
- **Why this fix is correct**: [1-2 sentences]
- **Blast radius check**: [other callers verified unaffected]

### Architecture Audit

#### SDK Configuration
- Current: [what's configured]
- Gaps: [what's missing or suboptimal]
- Recommended changes: [specific code changes]

#### Monitoring Coverage
- Covered: [what's being monitored]
- Blind spots: [what's NOT being monitored but should be]
- Recommended instrumentation: [specific additions]

#### Alerting
- Current alerts: [if any]
- Recommended alerts: [with thresholds]

#### Source Maps
- Status: [working / broken / not configured]
- Fix: [if needed]

### Files Modified
- [path] — [description]

### Requires Manual Follow-Up
- XX-125: [Title] — [why it cannot be fixed automatically]
```

---

## Decision Tree: Is This Noise or a Bug?

```
1. Does the stacktrace contain ANY frame from your app code?
   YES → likely a Bug, go to 2
   NO  → likely Noise, go to 5

2. Does the error reference a variable, function, or component YOU wrote?
   YES → Code Bug (proceed to Root Cause Analysis)
   NO  → go to 3

3. Is the error triggered by a user action in your app?
   YES → Code Bug or Data Bug (your code should handle this)
   NO  → go to 4

4. Does the error only happen in specific browsers/OS or with specific extensions?
   YES → likely Noise (browser/extension incompatibility)
   NO  → treat as Code Bug to be safe

5. Is the error from a browser extension, ad blocker, or third-party script?
   YES → Noise (add to ignoreErrors)
   NO  → go to 6

6. Is the error a known framework issue (React hydration, HMR, chunk loading)?
   YES → Noise (add framework-specific filter)
   NO  → treat as Code Bug to be safe (investigate before filtering)
```
