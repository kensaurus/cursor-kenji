---
name: test-red-team
description: >-
  Adversarial red-team of a running web, React Native, or Capacitor hybrid app.
  Drives Playwright browser MCP (web/PWA), Playwright Android WebView attach
  (Capacitor), or adb tap-walk (native chrome) against a feature-first coverage
  matrix: each feature decomposed to surfaces, sub-pages, components, and
  states, attacked across 4 dimensions — UI/UX, data pipeline, security
  (OWASP-mapped), and performance. Cross-references Sentry for production
  telemetry, Supabase for DB-layer mutation truth and RLS verification, and
  Firecrawl for current OWASP/MASVS guidance. Produces a severity-ranked defect
  list with repro steps and evidence. Generic across any repo and stack. Use
  when asked to "red team this app", "attack my app", "break it", "find all the
  defects", "adversarial test", "pre-launch hardening", "pentest the app", or
  "full app QA". Distinct from test-playwright (session PDCA), test-qa
  (happy-path crawl), and audit-security (static code review).
license: MIT
---

# test-red-team — Adversarial Full-App Defect Sweep

**The job is not done when the code compiles or even when the happy path works.
It is done when a hostile, skeptical attacker has tried every angle — UI/UX,
data pipeline, security, and performance — and the defect list is in the user's
hands.** This skill exists because nobody ships a perfect first pass. Red teaming
finds the gaps before real users do.

> **This skill produces a defect list.** Unlike `test-playwright` (fix-as-you-go
> PDCA), the default output is a severity-ranked report, not inline fixes. Offer
> to fix after the report is delivered; ask which defects to prioritize.

**Before ANY browser action, read `protocol-browser-anti-stall`
(`~/.cursor/skills/protocol-browser-anti-stall/SKILL.md`) and apply every rule.**

---

## Coverage model

Do NOT do a blind structural DOM crawl — that is `test-qa`. Traverse a
**coverage matrix** instead:

```
feature/capability
  → surfaces (routes, sub-pages, API endpoints, RPCs, tables)
    → components + states (forms, tables, modals, empty/error/loading, role variants)
      → 4 attack dimensions: UI/UX · data pipeline · security · performance
```

Each cell in the matrix (`feature × surface × component-state × dimension`) is
marked **PASS / DEFECT / N-A**. The matrix is both the traversal plan and the
audit trail in the final report.

**Graceful fallback:** if no discernible features exist (pure marketing site),
degrade to route → component structural traversal.

---

## Phase 0: Scope & rules of engagement

### 0a. Detect the stack

```
package.json             → framework, auth, ORM, RN/Expo, test port
capacitor.config.ts/.json → Capacitor hybrid (web + native shell)
app.json / app.config.*  → Expo / React Native
android/                 → native Android target
```

Record:
- **Target type**: web-only | RN/Expo | Capacitor hybrid | mixed monorepo
- **Dev URL / port** (`scripts.dev`, default 3000 / 5173 / 8081)
- **Auth pattern** (Supabase Auth, NextAuth, Clerk, custom JWT)
- **Test credentials** (`.env.local`, `.env.test`, README)
- **Backend MCPs available**: Supabase (`plugin-supabase-supabase`), Sentry
  (`plugin-sentry-sentry`), Firecrawl (`user-firecrawl`)

### 0b. Pick the automation driver

| Target | Driver |
|--------|--------|
| Web / PWA / Next.js / SvelteKit / Remix | Playwright browser MCP (`user-playwright`) |
| Capacitor WebView on Android emulator | Playwright `_android` WebView attach over ADB (see Phase 0c) |
| Native chrome: system dialogs, bottom sheets, permission prompts | `adb shell input tap` walk (see `mobile-emulator-test` skill) |
| Pure-native iOS/Android (Swift/Kotlin UI) | **Out of scope** — needs Appium; document as limitation |

### 0c. Capacitor WebView attach (when target includes Capacitor)

Ensure the app is running, then in a script or shell:

```javascript
const { _android } = require('playwright');
const [device] = await _android.devices();
// requires: ADB device online, Chrome ≥ 87, WebView debuggable flag
const webview = await device.webView({ pkg: 'com.your.app.id' });
const page = await webview.page();
// page is a standard Playwright Page — all browser MCP methods apply
```

For native chrome outside the WebView, fall back to `adb shell input tap`
with coordinates from `adb shell uiautomator dump`.

### 0d. Rules of engagement

- All test data prefixed `RT-TEST-` for easy cleanup
- Do NOT mutate production data; ask before any non-reversible operation
- Confirm exploits with evidence; no destructive PoCs against real rows
- Secrets referenced by name only — never printed in chat

---

## Phase 1: Recon & build the coverage matrix

Before opening the browser, build the matrix from source code. This is the
most important phase — the matrix determines what you attack.

### 1a. Enumerate features / capabilities

Sources to check (read, do not shell-grep unless necessary):

| Source | What to extract |
|--------|----------------|
| `src/app/**/page.tsx` (Next.js App Router) | Routes → feature groupings |
| `src/routes/**/*.tsx` (Remix / RN Router) | Route tree |
| `features/*/`, `modules/*/`, `src/*/` dirs | Feature boundary names |
| `supabase/migrations/*.sql`, `prisma/schema.prisma` | Data entities + relationships |
| `src/app/api/**`, `supabase/functions/**` | API endpoints + RPCs |
| README / feature-level docs | Business capability names |
| Nav component / sidebar / tab bar | User-visible feature map |

### 1b. For each feature, decompose

```
Feature: [name]
  Surfaces:
    - Routes/pages: [list]
    - Sub-pages / deep links: [list]
    - API endpoints / RPCs called: [list]
    - DB tables touched: [list]
  Components + states:
    - [component name]: states=[default, empty, loading, error, role-A, role-B, ...]
    - Forms: [list fields + validation rules]
    - Modals / drawers: [list + triggers]
    - File upload surfaces: [list]
  Roles / tenants:
    - [role list — anon, user, admin, org-member, etc.]
  Input surfaces (for injection testing):
    - [input fields, URL params, query strings, headers, file content]
```

### 1c. Output the matrix

Print the matrix before starting Phases 2–5. Example:

```
COVERAGE MATRIX
| Feature       | Surface/Component+State          | UI/UX | Pipeline | Security | Perf |
|---------------|----------------------------------|-------|----------|----------|------|
| Auth          | Login form / empty               |       |          |          |      |
| Auth          | Login form / error (wrong creds) |       |          |          |      |
| Documents     | List page / empty state          |       |          |          |      |
| Documents     | List page / 100+ items           |       |          |          |      |
| Documents     | Create modal / all fields        |       |          |          |      |
| Documents     | Share flow / other-user role     |       |          |          |      |
...
```

Fill each cell with ✅ PASS / ❌ DEFECT(#N) / — N-A as you work through Phases 2–5.

---

## Phase 2: UI/UX red team (per matrix cell)

For each cell, navigate to the surface, reach the component state, and attack.

**Driver**: Playwright browser MCP tools — `browser_navigate`, `browser_snapshot`,
`browser_take_screenshot`, `browser_click`, `browser_type`, `browser_fill_form`,
`browser_console_messages`, `browser_network_requests`, `browser_resize`.

Per cell checklist:

| Attack | What to do |
|--------|-----------|
| 3-second clarity | Navigate cold. Can a new user understand the purpose in 3 s? |
| Primary action | Is the CTA obvious, above the fold, reachable in 1 tap/click? |
| Empty state | Remove all data (or use a fresh account). Is there a helpful empty-state message? |
| Loading state | Throttle network (`browser_evaluate` to `navigator.serviceWorker` or DevTools API). Does a skeleton/spinner appear? |
| Error state | Trigger a backend error (kill the API, bad payload). Is the error message human-readable? |
| Dead buttons | Click every button and link. Does each one produce a visible response? |
| Form labels | Every `<input>` has a visible label or `aria-label`. |
| Responsive | `browser_resize` to 1280×800, 768×1024, 375×812. Layout must not break. |
| Dark mode | Toggle if supported. No white flash, no invisible text. |
| Role variant | Test the same surface as each role. Different roles must see different data/controls. |
| Overflow | Long strings (200 chars), numbers with many digits. No clipping without ellipsis. |

Capture a `browser_take_screenshot` as evidence for every DEFECT. Note the
component file path if identifiable from the DOM or source tree.

---

## Phase 3: Data pipeline red team (per matrix cell)

Every mutation surface (create / update / delete / upload) gets attacked here.

**Verify mutations at 3 layers**: (1) UI feedback, (2) network call, (3) DB row.

### DB verification via Supabase MCP

Look up the tool schema first:
```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "list_tables", arguments: {
  "project_id": "<PROJECT_ID>"
})
```

Then verify the mutation:
```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "execute_sql", arguments: {
  "project_id": "<PROJECT_ID>",
  "query": "SELECT * FROM <table> WHERE <col> LIKE 'RT-TEST-%' ORDER BY created_at DESC LIMIT 10"
})
```

RLS role verification (confirm what the client can actually read/write):
```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "execute_sql", arguments: {
  "project_id": "<PROJECT_ID>",
  "query": "SET ROLE authenticated; SELECT * FROM <table> WHERE user_id != auth.uid() LIMIT 5"
})
```

### Attack patterns

| Attack | How |
|--------|-----|
| Double-submit dupe | Click submit twice in rapid succession. Does a duplicate row appear? |
| Optimistic-update lie | Submit → immediately check DB. Did the row actually land? |
| Stale cache | Mutate in one tab / session, reload the other. Does it refresh? |
| Ghost delete | Delete an item, reload the page. Does it reappear? |
| Race condition | Submit two conflicting mutations in quick succession. Which wins? Any partial writes? |
| Partial write | Kill the network mid-request (`browser_evaluate` `fetch` override). Is the record consistent? |
| Idempotency | Retry the same request (Replay in DevTools or Playwright network intercept). Is it safe? |
| Relationship integrity | Delete a parent record. Are orphaned children cleaned up or guarded? |
| Pagination consistency | Create a record while on page 2. Does it appear in the right position? |

### Supabase logs check

After running attack patterns, pull API + postgres logs:
```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "get_logs", arguments: {
  "project_id": "<PROJECT_ID>",
  "service": "api"
})
```

Flag any unexpected 5xx, unhandled exceptions, or RLS deny events.

### Supabase advisors

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "get_advisors", arguments: {
  "project_id": "<PROJECT_ID>"
})
```

New ERROR-level advisors count as pipeline defects.

---

## Phase 4: Security red team (per matrix cell, OWASP-mapped)

Full payload tables and OWASP/MASVS mapping: `references/owasp-attack-checklist.md`.

Priority order (highest real-world impact first):

| # | Class (OWASP) | Key test |
|---|---------------|----------|
| 1 | Authorization / IDOR (A01) | User B reads/mutates User A's resource by ID; verify at DB layer with `SET ROLE authenticated` |
| 2 | Authentication (A07) | Password-reset token reuse, session fixation, JWT payload tampering, missing brute-force lockout |
| 3 | Injection (A03) | XSS `<img src=x onerror=alert(1)>`, SQLi `' OR 1=1--`, path traversal `../../etc/passwd` in every input |
| 4 | Sensitive data (A02) | API responses include `password`/`token`/PII? `localStorage` stores tokens? Env vars in bundle? |
| 5 | Security headers | Missing `CSP`, `HSTS`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` |
| 6 | Capacitor MASVS | `allowUniversalAccessFromFileURLs`? Bridge calls lack input validation? XSS can invoke native plugin? |

Correlate with Sentry (search 401/403/CSP violations last 30 days) and research current OWASP guidance via Firecrawl.

---

## Phase 5: Performance red team (per matrix cell)

Focus on the conditions real users hit: cold start, slow network, large data.

### Network throttling

Use Playwright's CDP layer via `browser_evaluate`:

```javascript
// Simulate Slow 3G
const client = await page.context().newCDPSession(page);
await client.send('Network.emulateNetworkConditions', {
  offline: false, downloadThroughput: 50 * 1024 / 8,
  uploadThroughput: 20 * 1024 / 8, latency: 300
});
```

On Capacitor/Android, use `adb shell tc qdisc add dev wlan0 root netem delay 300ms`.

### Attacks per surface

| Attack | What to look for |
|--------|-----------------|
| Cold load (hard refresh) | Time-to-interactive > 3 s on simulated 3G? Visible content flash / layout shift? |
| Large list (50+ items) | Scroll jank? Does it virtualize or render all DOM nodes? |
| Pagination / infinite scroll | Duplicate items on page boundary? Missing items? |
| Payload size | `browser_network_requests` → any response > 500 KB for a list endpoint? |
| Memory growth | Load a large list, scroll to bottom, back to top × 5. JS heap grows without bound? |
| Simultaneous requests | Rapid navigation between pages. Race conditions in loading states? |
| Supabase N+1 | Check `get_logs(service: 'postgres')` after exercising a feature. Repeated identical queries = N+1. |

### Supabase query performance

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "get_advisors", arguments: {
  "project_id": "<PROJECT_ID>"
})
```

Advisors flag missing indexes, sequential scans on large tables, and bloated
RLS policies. Each is a Medium–High performance defect.

---

## Phase 6: Finding-chaining & triage

Before writing the report, scan all DEFECT cells for chains:

- Two Medium findings often combine into a High or Critical path.
  Example: "reflected input in URL param" + "CSP missing" = stored XSS → data theft.
- Auth weakness + IDOR = full account takeover chain.
- Stale cache + no optimistic revert = silent data corruption.

For each finding, assign:

| Field | Options |
|-------|---------|
| Severity | Critical / High / Medium / Low / Info |
| Likelihood | High (trivial to exploit) / Medium (requires access) / Low (theoretical) |
| Impact | Data loss / account takeover / PII leak / UX degradation / performance SLA breach |
| Affected component | `src/components/Foo.tsx`, `supabase/functions/bar`, etc. |
| Remediation | Specific fix at the file/function level, not vague advice |

---

## Phase 7: Defect report (the deliverable)

```markdown
## Red-Team Defect Report — [App / Repo] — [Date]

### Scope
- Target type: [web | RN | Capacitor | mixed]
- Dev URL: [...]  Auth: [...]
- Features red-teamed: [list]
- Coverage matrix: [link or inline]

### Critical Defects (fix before any release)
| # | Feature | Surface / Component+State | Finding | Evidence | File | Remediation |
|---|---------|--------------------------|---------|----------|------|-------------|
| 1 | Auth | Login / error state | IDOR: User B can read User A documents via GET /api/docs/:id | Screenshot+network | src/app/api/docs/[id]/route.ts | Add ownership check: `WHERE user_id = auth.uid()` |

### High Defects
| # | Feature | Surface / Component+State | Finding | Evidence | File | Remediation |

### Medium Defects
| # | Feature | Surface / Component+State | Finding | Evidence | File | Remediation |

### Low / Info
| # | Feature | Surface / Component+State | Finding | Evidence | File | Remediation |

### Attack chains identified
1. [Finding #N] + [Finding #M] → [combined impact and attack path]

### Coverage matrix (final)
| Feature | Surface/Component+State | UI/UX | Pipeline | Security | Perf |
|---------|------------------------|-------|----------|----------|------|
...

### Backend truth-check
- Sentry: [new/related issues — count + highest severity]
- Supabase: [advisors, logs, RLS test results]

### Launch-readiness verdict
**Ready / Ready after Critical fixes / Not ready** — [2-sentence justification]

### Test data cleanup
- RT-TEST-* rows deleted: [Y/N / N-A]
```

---

## Guardrails

1. **Anti-stall always** — never block >3 s on a browser action; incremental
   wait → snapshot → check; max 4 attempts per goal; mark `[TIMEOUT]` and move on.
2. **Evidence for every DEFECT** — screenshot + console + network + DB query
   result. "It looked broken" is not a defect.
3. **No destructive PoCs** — confirm XSS/SQLi with a benign payload
   (`document.title='XSS'`, `SELECT 1`), never `DROP TABLE` or real data exfil.
4. **Ask before mutating production rows** — DDL (schema changes) for a requested
   fix ships; `DELETE`/`UPDATE`/`TRUNCATE` on real production data asks first.
5. **Secrets by name only** — never print `.env` values in chat or screenshots.
6. **Honest verdict** — do not declare "no defects" if any cell is untested. Mark
   untested cells N-A with a note explaining why (auth blocked, no data, etc.).
7. **Offer to fix after the report** — ask which Critical/High defects to address
   first; use `test-playwright` PDCA discipline when applying fixes.
8. **MCP schemas first** — always check tool schemas under `mcps/<server>/tools/`
   before calling any MCP tool.
9. **Pure-native iOS/Android out of scope** — document it in the report if relevant.

