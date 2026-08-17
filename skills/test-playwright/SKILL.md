---
name: test-playwright
description: >
  Close the PDCA loop on the work you just did. After implementing changes, drive the LIVE
  app on localhost through the playwright-cli like a real end user — manually, in a
  visible (headed) browser, clicking and typing one action at a time, NEVER through
  scripts or test runners — exercising every page, component, and.
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
and apply every rule** —
especially **Rule 0 (manual & headed, never scripted)**, plus the navigation guard,
≤3s waits, fresh `snapshot` after every state change, max-4-attempts-per-goal,
timeout budgets, tab discipline, and persisted auth
(`references/playwright-session-coordination.md`).

---

## Core principles

> **Drive a visible browser by hand, never a script.**
> Headed (never `--headless`). Click, type, scroll, read, react — one real action at a
> time, as someone discovering the feature for the first time. `eval` /
> `run-code` are inspection-only; never write `*.spec.ts` or run
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
 - Backend MCPs available this session: Supabase (`supabase`),
 Sentry (`sentry`), Firecrawl (`firecrawl`).

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
before opening the browser** — session naming, persistent auth profiles, Google/OAuth reuse.

```bash
PW="npx --yes @playwright/cli@latest"
```

1. Check the `terminals/` folder for a running dev server (`npm run dev`, `next dev`,
 `vite`, etc.). If none is running, start it (`block_until_ms` sized to startup) and
 wait until it serves, or tell the user and stop.
2. **Name your session** after the task or branch (`-s=qa-<feature>`). Never reuse another
 agent's session name — each session is its own isolated browser, so there is nothing to claim.
3. `$PW -s=qa-<feature> open --headed <dev-url>` — add
 `--persistent --profile "$HOME/.playwright-cli-profiles/<app>"` when the flow needs a login.
4. Anti-stall: `sleep 2` → `snapshot` → verify content rendered.
5. `console` + `requests` → baseline before touching the changed feature.
6. **Auth (log in once, by hand — it persists):**
   - Hit a protected route → if already signed in, continue. With
     `--persistent --profile`, a one-time manual login survives across turns and restarts.
   - Else complete login **manually in the visible window** like a user. Then verify a
     protected route loads.
   - **Google accounts cannot be signed into from a Playwright-launched browser** — do the
     one-time real-Chrome login described in the coordination reference.
   - Lightweight alternative to a profile: `state-save` / `state-load` with
     `.playwright-mcp/auth/<host>.json`.
   - Do **not** log out at the end unless testing logout.
7. `$PW -s=qa-<feature> close` when the run is done.

---

## Phase 3: Walk the changed flows as a real user

For each user journey from the Phase 1 plan, live it step by step.

Per step, follow this cycle (anti-stall applies throughout):

```bash
S="-s=qa-<feature>"                                  # your session, every call
$PW $S goto "<url>"                                  # 1. if moving pages
sleep 2 && $PW $S snapshot                           # 2. confirm the feature rendered
$PW $S screenshot --filename ".playwright-mcp/<step>.png"   # 3. visual evidence
$PW $S click <ref>                                   # 4. interact like a user —
                                                     #    click / type / fill / select /
                                                     #    hover / press / drag, one at a time
$PW $S snapshot                                      # 5. FRESH refs after every interaction
$PW $S console                                       # 6. any NEW error vs baseline?
$PW $S requests                                      # 7. any 4xx/5xx, CORS, timeout, missing call?
```

8. Judge it: does it WORK and does it feel GOOD? PASS or PAIN POINT.

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
`reload`, and (d) — if Supabase MCP is available — the row actually
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
schemas first, then:

```json
sentry:search_issues
{
 "organizationSlug": "<ORG>", "query": "unresolved issues in the last 7 days",
 "projectSlugOrId": "<PROJECT>", "regionUrl": "<REGION_URL>", "limit": 25
}
```

 Cross-reference issues with the surfaces you touched. Use `analyze_issue_with_seer`
 for root cause on anything that maps to your change. Only `update_issue` to resolve
 AFTER a verified fix.

**Supabase** — verify schema, data, and logs for the paths you touched. Check tool
schemas first, then use `list_tables`,
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
 feature/pattern, use Firecrawl (`firecrawl`) to check current best practices,
 then map findings back to concrete changes:

```json
firecrawl:firecrawl_search
{
 "query": "[pattern/feature] best practices [current year]", "limit": 5,
 "sources": [{ "type": "web" }]
}
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

## playwright-cli commands

`PW="npx --yes @playwright/cli@latest"`, then `$PW -s=<session> <command>`.
Snapshot/ref-based (accessibility tree); no locking — sessions are isolated, so just
re-`snapshot` after each state change. **Headless by default — pass `--headed` on `open`.**

**Drive with these (real user actions):** `open --headed`, `goto`, `go-back`,
`click`, `type`, `fill`, `select`, `check`, `uncheck`,
`hover`, `drag`, `drop`, `press`, `upload`, `dialog-accept`, `resize`.

**Observe with these:** `snapshot`, `find`, `screenshot --filename .playwright-mcp/<name>.png`,
`console`, `requests`, `request <n>`.

**Wait with these:** `sleep N` (shell, ≤3s) or
`run-code "async (page) => { await page.getByText('X').first().waitFor({ timeout: 5000 }); }"`.

**Inspection-only (never to drive the UI):** `eval`, `run-code`.

Full mapping from the old MCP tools: `protocol-browser-anti-stall/references/mcp-to-cli-map.md`.

---

## Guardrails

1. **Manual & headed, never scripted** — visible browser, one real user action at a
 time; `eval` / `run-code` for inspection only; no
 `*.spec.ts`, no `npx playwright test`. See anti-stall Rule 0.
2. **Scope discipline** — test session changes + blast radius, not the entire app. For
 a full-app sweep use `test-qa`.
3. **Own your session** — every command carries `-s=<task>`; never reuse another agent's
 session name, and never `close-all` / `kill-all` sessions you didn't open.
4. **Auth reuse** — log in once by hand into a `--persistent --profile` directory; it keeps
 you signed in across turns; don't log out unless testing logout.
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
