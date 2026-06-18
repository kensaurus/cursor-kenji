---
name: test-playwright
description: >-
  Close the PDCA loop on the work you just did. After implementing changes, drive
  the LIVE app on localhost through the Playwright browser MCP like a real end user —
  manually, in a visible (headed) browser, clicking and typing one action at a time,
  NEVER through scripts or test runners — exercising every page, component, and flow
  the current session touched. Reproduce real user journeys, hunt for pain points, and
  FIX them as you go (full-stack: UI/UX + backend + DB), using already-enabled MCP
  servers (Sentry for production errors, Supabase for schema/logs/data, Firecrawl for
  research). Red-team your own work, give brutally honest critique, and suggest
  feature/UX improvements. Generic across any repo and stack. Use after building or
  changing a feature, or when the user says "test this with playwright", "test my
  changes", "test on localhost like a user", "PDCA this", "did you actually test it",
  "red-team this feature", or "verify the work end-to-end".
license: MIT
---

# test-playwright — Develop → Test → Fix (PDCA)

**The job is not done when the code compiles. It is done when you have driven the
live app as a user, found what's broken or clunky, and fixed it.** This skill exists
because agents implement a change, declare victory, and skip the *Check* and *Act*
phases of PDCA. You will not skip them.

> **Plan** = the change you just made.
> **Do** = it's already in the code.
> **Check** = drive the live app as a real user (this skill).
> **Act** = fix every pain point and error you find, in the same turn.

**Before ANY browser action, read `protocol-browser-anti-stall`
(`~/.cursor/skills/protocol-browser-anti-stall/SKILL.md`) and apply every rule** —
especially **Rule 0 (manual & headed, never scripted)**, plus the navigation guard,
≤3s waits, fresh `browser_snapshot` after every state change, max-4-attempts-per-goal,
timeout budgets, tab discipline, and persisted auth
(`references/playwright-session-coordination.md`).

---

## Core principles

> **Drive a visible browser by hand, never a script.**
> Headed (never `--headless`). Click, type, scroll, read, react — one real action at a
> time, as someone discovering the feature for the first time. `browser_evaluate` /
> `browser_run_code_unsafe` are inspection-only; never write `*.spec.ts` or run
> `npx playwright test`. You're here to *feel* the pain points, not pass a green check.

> **Test only what this session changed — plus its blast radius.**
> Not a full-app crawl (that's `test-qa`). Scope to the files you edited and the
> pages/flows/APIs that consume them. Touch a shared component → test every page that
> renders it.

> **Fix as you go — full-stack.**
> Hit a bug, 500, confusing label, dead button, ugly layout → fix the root cause now
> (frontend, backend, migration, RLS, config), then re-test the same flow. Don't batch
> fixes for "later".

> **Evidence or it didn't happen.**
> Every finding needs a screenshot + console + network. Every fix needs a live re-test
> that proves it against the real backend (a 200, persisted data, clean console).

> **Red-team your own work.**
> Assume your change is subtly wrong. Try to break it. Be the harshest critic of the
> UX you just shipped.

---

## Workflow checklist

```
PDCA Progress:
- [ ] Phase 1: Scope — what did this session change? (blast radius)
- [ ] Phase 2: Environment — dev server up, app loads, authenticated
- [ ] Phase 3: Walk the changed flows as a real user
- [ ] Phase 4: Fix pain points + errors as you find them (full-stack)
- [ ] Phase 5: Backend truth-check (Sentry / Supabase / logs)
- [ ] Phase 6: Red-team + critique + enhancement ideas
- [ ] Phase 7: Re-test everything you fixed; report
```

---

## Phase 1: Scope the session changes

Figure out exactly what to test. Do NOT test the whole app.

1. **Get the diff** — what changed in this session:

```bash
git status --short
git diff --stat HEAD
git diff HEAD --name-only
```

 If work spans multiple repos in the workspace, run this in each repo root.

2. **Map files → user-facing surfaces.** For each changed file, ask:
 - Is it a page/route? → test that page.
 - Is it a shared component/hook/util? → find every page that imports it and test
 each one (`grep -rl "ComponentName" src/`). This is the **blast radius**.
 - Is it an API route / controller / service? → test every UI flow that calls it.
 - Is it a migration / schema / RLS change? → test the read AND write paths that
 touch those tables, as the role the client actually uses.
 - Is it config / env / pricing / prompt? → test the feature it drives.

3. **Detect the stack & dev URL** (only what you need):
 - Framework + dev port from `package.json` `scripts.dev` (3000 / 5173 / etc.).
 - Auth method + test credentials (`.env.local`, `.env.test`, README). If none,
 ask the user once.
 - Backend MCPs available this session: Supabase (`plugin-supabase-supabase`),
 Sentry (`plugin-sentry-sentry`), Firecrawl (`user-firecrawl`).

4. **Write the test plan** before opening the browser:

```
SESSION SCOPE:
- Repos touched: [list]
- Changed surfaces (pages/flows): [list]
- Blast radius (shared code → consumers): [list]
- Backend paths touched (APIs/tables/RPCs): [list]
- Dev URL: http://localhost:[port] Auth: [method / test account]
- User journeys to drive: [ordered list of 2–6 real flows]
```

---

## Phase 2: Environment verification

**Read `protocol-browser-anti-stall/references/playwright-session-coordination.md`
before opening the browser** — shared Playwright instance, tab claiming, Google/OAuth
session reuse.

1. Check the `terminals/` folder for a running dev server (`npm run dev`, `next dev`,
 `vite`, etc.). If none is running, start it (`block_until_ms` sized to startup) and
 wait until it serves, or tell the user and stop.
2. `browser_tabs` → `list` — note open tabs; read `.playwright-mcp/session.json` if present.
3. **Claim or create your tab** — `select` the auth tab from `session.json`, or `new` with
 the dev URL. Do not hijack another agent's tab.
4. `browser_navigate` (in your tab only) → anti-stall (wait 2s → `browser_snapshot` →
 verify content).
5. `browser_console_messages` + `browser_network_requests` → baseline before touching the
 changed feature.
6. **Auth (log in once, by hand — it persists):**
   - Hit a protected route → if already signed in, continue. The Playwright MCP uses a
     **persistent profile by default**, so a one-time manual login survives across turns
     and sessions — you rarely re-login.
   - Else complete login **manually in the visible window** like a user (Google/OAuth may
     need you to approve in the browser). Then verify a protected route loads.
   - Only restore `.playwright-mcp/auth/<host>.json` via `browser_run_code_unsafe` if the
     server runs `--isolated` (no persistent profile) — see coordination reference.
   - Do **not** log out at end unless testing logout. Leave the tab open for the next agent.

---

## Phase 3: Walk the changed flows as a real user

For each user journey from the Phase 1 plan, live it step by step.

Per step, follow this cycle (anti-stall applies throughout):

```
1. browser_navigate (if moving pages)
2. wait 2s → browser_snapshot → confirm the page/feature rendered
3. browser_take_screenshot → visual evidence
4. Interact like a user: browser_click / browser_type / browser_fill_form /
 browser_select_option / browser_hover / browser_press_key / browser_drag
5. browser_snapshot (FRESH refs) after every interaction
6. browser_console_messages → any NEW error vs baseline?
7. browser_network_requests → any 4xx/5xx, CORS, timeout, or missing call?
8. Judge it: does it WORK and does it feel GOOD? PASS or PAIN POINT.
```

What to hunt for on every changed surface:

| Category | Look for |
|----------|----------|
| **Broken** | Blank screen, error boundary, 404/500, stuck spinner, dead button, no-op submit |
| **Data wrong** | `undefined` / `null` / `NaN` / `[object Object]` / `Invalid Date` on screen, totals that don't add up, stale data after a mutation |
| **Pipeline** | Mutation shows in UI but API failed; created item not in list until refresh; deleted item reappears; optimistic update never confirms |
| **Validation** | Empty/invalid submit gives no feedback; no inline errors; silent backend rejection |
| **UX friction** | Confusing label/copy, no loading state, no success/error feedback, hidden primary action, too many clicks, surprising navigation |
| **Visual** | Overflow/clipping, cramped or wasted space, broken images/icons, dark-mode breakage, layout shift, misalignment (verify in screenshot) |
| **A11y basics** | Inputs without labels, controls without accessible names, focus not visible, low contrast |

**Mutations must be verified end-to-end:** after create/update/delete, confirm (a)
the network call returned 2xx, (b) the UI reflects it, (c) it survives a hard
`browser_navigate` reload, and (d) — if Supabase MCP is available — the row actually
changed in the DB. Prefix any test data with `QA-TEST-` and clean it up at the end.

---

## Phase 4: Fix pain points and errors — as you go

This is the **Act** phase agents skip. The moment you find a problem, fix its root
cause before moving on. Do not just log it.

1. **Diagnose to root cause** — don't patch symptoms.
 - Frontend bug → fix the component/hook/state.
 - 4xx/5xx → read the request payload + backend log; fix the controller/service/
 validation/serialization. Use `debug-fe-be-integration` mindset if FE↔BE mismatch.
 - `relation does not exist` / `function not found` / missing column → the migration
 wasn't deployed. **Deploy it via the Supabase MCP** (`apply_migration` for DDL,
 `execute_sql` for data) AND keep the versioned migration file on disk in sync.
 (See the always-on `full-stack-ship-discipline` rule — schema the user just asked
 for ships without re-asking; `DELETE`/`UPDATE`/`TRUNCATE` on real rows asks first.)
 - RLS/permission error → verify as the client's role (`SET ROLE anon;` /
 `authenticated;`), fix the policy, re-verify.
 - Config/env/CORS → fix and note what the user must set in other environments.
2. **Apply the fix** with the normal edit tools (surgical, repo conventions, no
 unrelated refactors). Run `ReadLints` on files you edited.
3. **Re-drive the exact same flow** in the browser to confirm the fix — green console,
 2xx network, correct UI, persisted data. A fix is not done until re-tested live.
4. If a fix is genuinely out of scope or risky, STOP and surface it explicitly with a
 recommendation rather than silently shipping a broken flow.

Keep a running fix log:

```
FIX LOG:
- [surface] [symptom] → root cause: [...] → fix: [file(s)] → re-test: PASS/▢
```

---

## Phase 5: Backend truth-check (full-stack)

Don't trust the UI alone. Confirm against the systems of record using enabled MCPs.

**Sentry** — did your session introduce or relate to production errors? Look up tool
schemas under `mcps/plugin-sentry-sentry/tools/` first, then:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
 "organizationSlug": "<ORG>", "naturalLanguageQuery": "unresolved issues in the last 7 days",
 "projectSlugOrId": "<PROJECT>", "regionUrl": "<REGION_URL>", "limit": 25
})
```

 Cross-reference issues with the surfaces you touched. Use `analyze_issue_with_seer`
 for root cause on anything that maps to your change. Only `update_issue` to resolve
 AFTER a verified fix.

**Supabase** — verify schema, data, and logs for the paths you touched. Check tool
schemas under `mcps/plugin-supabase-supabase/tools/` first, then use `list_tables`,
`execute_sql`, `get_logs(service: 'api'|'postgres')`, and `get_advisors`. Treat new
ERROR-level advisors from your change as part of your work. Confirm any migration you
deployed actually exists on the remote (`information_schema` / `pg_proc` / `pg_policies`).

**App logs / terminal** — read the dev-server terminal file for server-side stack
traces that never reached the browser.

---

## Phase 6: Red-team and critique

Switch hats: you are now a skeptical senior reviewer + a demanding user who is hard to
impress. For the changed surfaces, push hard:

- **Break it:** double-click submits (dupes?), rapid toggling, back/forward buttons,
 direct-URL deep links, empty states, huge inputs, special chars
 (`<script>`, `'; DROP TABLE`, emoji, very long strings), slow/failed network.
- **Question the UX:** Is the primary action obvious in 3 seconds? Is feedback
 immediate and clear? Is anything redundant, cramped, or confusing? Would a real user
 get stuck? (Lean on `enhance-web-ux` / `enhance-web-ui` heuristics if deep polish
 is warranted.)
- **Question the design:** Does it match the rest of the app's patterns and tokens, or
 did this change introduce drift?
- **Research when unsure:** if you're not certain what "good" looks like for this
 feature/pattern, use Firecrawl (`user-firecrawl`) to check current best practices,
 then map findings back to concrete changes:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
 "query": "[pattern/feature] best practices [current year]", "limit": 5,
 "sources": [{ "type": "web" }]
})
```

Capture **enhancement ideas** — concrete, not vague. For each: what to add/change, why
it helps the user, and rough effort. Distinguish "fix now" (done in Phase 4) from
"suggested next" (proposed in the report).

---

## Phase 7: Re-test and report

1. Re-drive every flow you fixed, end to end, one final time. Confirm green.
2. Clean up `QA-TEST-` data; reset any settings you changed; verify cleanup in DB if
 applicable.
3. Produce the report:

```markdown
## PDCA Test Report — [feature / session summary]

### Scope (what this session changed)
- Repos: [...] Surfaces tested: [...] Backend paths: [...]
- Dev URL: [...] Auth: [...]

### Flows driven (as a user)
| # | Journey | Result | Evidence |
|---|---------|--------|----------|
| 1 | [...] | PASS / FIXED / BLOCKED | [screenshot/console/network] |

### Fixed this turn (Act)
| # | Surface | Symptom | Root cause | Fix (files) | Re-tested |
|---|---------|---------|-----------|-------------|-----------|
| 1 | [...] | [...] | [FE/BE/DB/config] | [...] | ✅ |

### Still broken / out of scope (needs decision)
| # | Surface | Issue | Why not fixed | Recommendation |
|---|---------|-------|---------------|----------------|

### Backend truth-check
- Sentry: [new/related issues + status]
- Supabase: [schema/data/logs/advisors verified — migration deployed? Y/N]

### Red-team findings
| # | Surface | Severity | Finding | Evidence |
|---|---------|----------|---------|----------|

### Enhancement suggestions (Plan the next cycle)
1. [concrete idea] — why it helps — rough effort
2. ...

### Verdict
**Ship / Ship after fixes / Not ready** — [1–2 sentence justification]
Console clean: [Y/N] · All flows green on re-test: [Y/N] · Test data cleaned: [Y/N]
```

---

## Playwright MCP tools (server: `user-playwright`)

Headed by default; snapshot/ref-based (accessibility tree), no lock/unlock — just
snapshot freshly after each change.

**Drive with these (real user actions):** `browser_navigate`, `browser_navigate_back`,
`browser_click`, `browser_type`, `browser_fill_form`, `browser_select_option`,
`browser_hover`, `browser_drag`, `browser_drop`, `browser_press_key`,
`browser_file_upload`, `browser_handle_dialog`, `browser_resize`, `browser_tabs`.

**Observe with these:** `browser_snapshot`, `browser_take_screenshot`, `browser_wait_for`,
`browser_console_messages`, `browser_network_requests`, `browser_network_request`.

**Inspection-only (never to drive the UI):** `browser_evaluate`, `browser_run_code_unsafe`.

---

## Guardrails

1. **Manual & headed, never scripted** — visible browser, one real user action at a
 time; `browser_evaluate` / `browser_run_code_unsafe` for inspection only; no
 `*.spec.ts`, no `npx playwright test`. See anti-stall Rule 0.
2. **Scope discipline** — test session changes + blast radius, not the entire app. For
 a full-app sweep use `test-qa`.
3. **Shared browser** — one Playwright MCP per Cursor; `browser_tabs` list before every
 turn; work in your tab only; never close tabs you didn't open.
4. **Auth reuse** — log in once by hand; the persistent profile keeps you signed in;
 don't log out unless testing logout.
5. **Anti-stall always** — never block >3s; incremental wait → snapshot → check; max 4
 attempts per goal; skip a stuck step (`[TIMEOUT]`) rather than freeze the session.
6. **Fix the root cause, full-stack** — UI, API, DB, config; re-test live after each fix.
7. **Schema in sync** — anything you change via MCP also gets a versioned migration file
 on disk; verify the remote actually has it.
8. **Ask before mutating real data** — DDL for the requested feature ships; `DELETE` /
 `UPDATE` / `TRUNCATE` on production rows asks first.
9. **No secrets in chat** — use `.env*` values by name only; never print them.
10. **Evidence for every finding and fix** — screenshot + console + network + a green
 re-test.
11. **Honest verdict** — don't declare "done" with a red console or an unfixed pain point.
 If you couldn't fix something, say so clearly with a recommendation.
