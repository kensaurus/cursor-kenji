---
name: test-qa
description: >
  Generic web-app CRUD/story QA fallback when no project-specific skill
  applies. Use when "QA the app", "test CRUD", or "smoke test". Native →
  mobile-emulator-test. Identity wander → test-exploratory. Dead controls
  → plan-stub-checker. Pixel diffs → test-visual-regression.
license: MIT
---

# test-qa — Story-driven CRUD, not a monkey test

**Degree of freedom: MIXED** — story generation and severity `[HIGH freedom]`;
session, anti-stall, and CRUD verify-after-refresh `[LOW freedom — run exactly]`.
Driver is **playwright-cli**, never Playwright MCP. Guest-vs-authed wander is
`test-exploratory` — do not reclaim it.

Full QA of a live webapp as a senior QA engineer preparing a production
release: user-story-driven coverage, CRUD, data-pipeline integrity, UX, and
edge cases. This is **not** a page-navigation monkey test.

Read `protocol-browser-anti-stall` before any browser step (Rule 0: manual &
headed). Also `references/playwright-session-coordination.md` in that folder.

## This skill vs neighbors

| Skill | Owns |
|:------|:-----|
| **test-qa** (this) | Story-driven CRUD + smoke; persist after refresh (+ DB) |
| `test-exploratory` | Unscripted wander + **guest vs authed diff** |
| `test-playwright` | This-diff PDCA + fix-as-you-go |
| `test-red-team` | Hostile feature×dimension matrix |
| `test-visual-regression` | Pixel baselines |
| `plan-stub-checker` | Dead buttons / fake components (plan) |

## How to reason (every finding)

1. **Observe** — screenshot + console + network (+ DB if available)
2. **Interpret** — persist fail, dead control, UX defect, or expected empty?
3. **Classify** — PASS / FAIL / BLOCKED (auth) — never "sort of works"
4. **Severity** — Critical (blocks ship) / Major (bad UX) / Minor (polish)

## Worked example

> **Observe:** POST /api/items 201; list shows "QA-TEST-Widget"; after hard
> `goto` the row is gone. Console clean.
> **Interpret:** optimistic UI; write never persisted.
> **Classify:** FAIL — data pipeline (ghost create).
> **Severity:** Critical — CRUD not verified E2E.

## Critical rules

- **Manual & headed, never scripted.** One `playwright-cli` action at a time.
  `eval` / `run-code` inspection-only. No `*.spec.ts`, no `npx playwright test`.
- **User in the chair, engineer in the head.** First-open navigation; inspect
  like you know the stack.
- **Every mutation verified E2E.** Create/update/delete is untested until the
  change survives a refresh **and** (if DB access exists) the row matches.
- **Evidence for every finding.** Screenshot + console + network + repro.
- **Clean up.** Delete `QA-TEST-` data. Leave auth session intact.
- **No invented routes.** Discover pages/entities from source first.

---

## Phase 0: Codebase Discovery  [HIGH freedom]

### 0a. Detect Tech Stack

Read the dependency manifest (`package.json`, `requirements.txt`,
`pyproject.toml`, `Cargo.toml`, `go.mod`). Record framework, UI lib, auth,
DB/ORM, state, CSS, and `scripts.dev` port (3000 / 3001 / 5173 / 5174).

### 0b. Discover Routes

| Framework | Scan Pattern |
|-----------|-------------|
| Next.js App Router | `app/**/page.tsx` or `app/**/page.js` |
| Next.js Pages | `pages/**/*.tsx` (excluding `_app`, `_document`) |
| Remix | `app/routes/**/*.tsx` |
| SvelteKit | `src/routes/**/+page.svelte` |
| Nuxt | `pages/**/*.vue` |
| React Router (SPA) | Grep for `<Route` or `createBrowserRouter` |
| Django | `urls.py` files |
| Rails | `config/routes.rb` |

For each route: path, dynamic segments, layout nesting, auth guard.

### 0c. Discover Data Model

| Source | Where |
|--------|-------|
| Supabase migrations | `supabase/migrations/*.sql` — tables, RLS |
| Prisma schema | `prisma/schema.prisma` |
| Drizzle schema | `drizzle/schema.ts` or `src/db/schema.ts` |
| TypeScript types | `types/*.ts`, `**/types.ts` |
| API routes | `app/api/**` — CRUD endpoints |
| Feature files | `features/*/` — services, hooks, components |

For each entity: name, key fields, CRUD capabilities, relationships.

### 0d. Discover Auth Pattern

Provider config (`createClient`, `NextAuth`, `ClerkProvider`, `Auth0Provider`);
login (`signIn` / `login` / `authenticate`); test credentials (`.env.local`,
`.env.test`, `.env.example`, README); protected routes (middleware, guards).

### 0e. Read Feature Documentation

Feature-directory READMEs (`@_*-README.md`, `docs/`) for expected behavior.

### 0f. Record Discovery Results

```
APP DISCOVERY:
- Framework: [name + version]
- Dev server: http://localhost:[port]
- Auth: [provider + method]
- Test account: [email / password, or "none found — ask user"]
- Routes discovered: [count]
 - Public: [list]
 - Auth-required: [list]
 - Dynamic: [list with param patterns]
- Data entities: [list with CRUD capabilities]
- API endpoints: [count]
```

---

## Phase 1: Environment Verification  [LOW freedom — session exact]

### 1a. Verify Dev Server Running

Check the terminals folder for `npm run dev` / `pnpm dev` / `next dev`. If
none, tell the user and stop.

### 1b. Load the app (own your session)

1. Session name `-s=qa-<app>`; never reuse another agent's name.
2. Isolated browser — add `--persistent --profile` if login is required:

```bash
PW="npx --yes @playwright/cli@latest"
$PW -s=qa-<app> open --headed http://localhost:3000
sleep 2
$PW -s=qa-<app> snapshot
$PW -s=qa-<app> screenshot --filename .playwright-mcp/qa-baseline.png
$PW -s=qa-<app> console
$PW -s=qa-<app> requests
```

Blank after 3 incremental waits (6s) → blocker.

### 1c. Authenticate (reuse session — do not re-login every run)

Follow `protocol-browser-anti-stall/references/playwright-session-coordination.md`.

1. Hit a **protected route** — if already signed in, skip to 1d.
2. `state-load .playwright-mcp/auth/<host>.json` if it exists (or reuse the
   `--persistent --profile` directory).
3. If still logged out:
   - Email/password: credentials from `.env.test` / README (never paste secrets).
   - **OAuth / SSO**: sign in in the visible window; incremental snapshots;
     then `state-save .playwright-mcp/auth/<host>.json`.
   - **Google** cannot sign in from a Playwright-launched browser — use the
     one-time real-Chrome profile in the coordination reference.
4. Verify auth (avatar, dashboard, protected pages).
5. **Do not log out** at cleanup unless testing logout.

If auth is impossible, mark auth-required pages BLOCKED and test public only.

### 1d. Capture Baseline

```
BASELINE:
- URL: [current URL]
- Console errors: [count — list if any]
- Network failures: [count — list if any]
- Visible content: [brief description]
- Screenshot: [reference]
```

---

## Phase 2: Intelligent Page Crawl  [HIGH freedom]

For EVERY route from Phase 0b:

### 2a. Navigate and Capture

`goto` → anti-stall (2s → snapshot → verify) → `screenshot` → `console` →
`requests`.

### 2b. Classify the Page

| Classification | Signals |
|---------------|---------|
| **CRUD page** | Forms, edit/delete, data tables |
| **Display page** | Data, no mutation (dashboards, profiles) |
| **Settings page** | Toggles, selects, save for preferences |
| **Auth page** | Login, register, forgot password |
| **Static page** | About, terms, privacy |
| **Navigation hub** | Links to children (home, index) |

### 2c. Detect findings during crawl

| Check | What to Look For |
|-------|-----------------|
| **Dead page** | 404, error boundary, blank |
| **Console errors** | JS / React errors, failed assertions |
| **Network failures** | 4xx/5xx, CORS, timeouts |
| **Missing content** | "undefined", "null", "NaN", "[object Object]" |
| **Mock data** | "Lorem ipsum", "TODO", "test", "example@" |
| **Dead buttons** | No onClick / navigate nowhere (snapshot) |
| **Missing metadata** | Empty or generic `document.title` |
| **Loading stuck** | Spinner/skeleton after 6s |
| **Empty state** | No data AND no helpful empty message |
| **Broken images** | Missing/broken `src` or error fallback |
| **Overflow** | Text/elements past their containers |

### 2d. Build Feature Map

```
FEATURE MAP:
- CRUD pages: [entity + operations]
- Forms found: [page + purpose]
- Data displays: [tables, lists, cards, charts]
- Interactive elements: [buttons, toggles, dropdowns per page]
- Search/filter: [pages]
- Settings: [configurable preferences]
- Dead buttons found: [page + element]
- Pages with errors: [list]
```

---

## Phase 3: Dynamic User Story Generation  [HIGH freedom]

Stories come from the feature map, not a canned list.

| Cat | Story | Drive |
|-----|-------|-------|
| A | First impression | Home: value prop in 3s, CTA, guest-reachable nav, trust |
| B | Core journey | Primary purpose from Phase 0, start to finish |
| C | CRUD per entity | **Phase 4** — verify persist after refresh (+ DB) |
| D | Navigation | Every nav link, back/forward, breadcrumbs, no dead ends |
| E | Search/filter | Known hit, empty miss + helpful empty, filters |
| F | Errors | Empty required, invalid input, `/nonexistent` 404, network fail |
| G | Settings | Change, navigate away, come back — preference persisted |

---

## Phase 4: CRUD Testing  [LOW freedom — verify after refresh]

For each CRUD-capable entity, run the lifecycle.

### 4a. Create

1. Open the creation form; identify fields via `snapshot`
2. Fill realistic data: text `QA-TEST-[field]-[timestamp]`; domain-sane
   numbers/dates; valid select; non-default toggle
3. `screenshot` before submit
4. Submit; `requests` must be 2xx; `snapshot` + `screenshot` for success
   feedback (toast, redirect, confirmation)

**Record** the item's ID, name, and URL.

### 4b. Read

List view → find the item → displayed fields match → detail view (if any)
matches → `screenshot`.

### 4c. Update

Edit 1–2 fields → `screenshot` before save → save → `requests` 2xx → UI
updates → hard-refresh (`goto` same URL) → changes still there.

### 4d. Delete

`screenshot` before → delete (+ confirm if any) → `requests` 2xx → gone from
list → detail URL is 404 or redirect.

### 4e. Validation Testing

1. **Empty submission** → inline validation
2. **Invalid data** — wrong format, text in number field → specific errors
3. **Boundary** — 500+ chars, zero, negative, past dates
4. **Special characters** — `<script>alert('xss')</script>`, `'; DROP TABLE`,
   emoji, Unicode
5. **Duplicate** — create the same item twice → duplicate handling

### 4f. Data Pipeline Verification

After each mutation:

1. **Network** — `requests`: call made? status?
2. **Response** — body has expected data?
3. **UI** — reflects mutation without a manual refresh?
4. **Refresh** — after `goto` same page, still visible?
5. **DB** (if Supabase MCP or DB access):

```json
supabase:execute_sql
{
 "project_id": "<PROJECT_ID>",
 "query": "SELECT * FROM <table> WHERE <identifying_column> LIKE 'QA-TEST-%' ORDER BY created_at DESC LIMIT 5"
}
```

**Pipeline failures:** optimistic UI but API failed; stale cache; missing
invalidation (item appears only after refresh); ghost data (deleted item
returns); silent 4xx/5xx.

---

## Phase 5: UX Quality Audit  [HIGH freedom]

Assess each page. Layout breakage → `audit-responsive`. Empty/error chrome →
`audit-ui-states`. Do not re-own those audits.

### 5a. Visual Quality

| Check | How to Verify |
|-------|--------------|
| Consistent spacing | Screenshot — no irregular gaps or cramped areas |
| Typography | No mixed sizes where they should match; no orphaned headings |
| Truncation | Ellipsis where appropriate, not clipped |
| Image loading | All images render; no broken-image icons |
| Icons | All icons render (no missing squares) |
| Dark mode | If supported: toggle; no white flashes |
| Responsive | 1280 / 768 / 375 — layout adapts without breaking |

### 5b. Interaction Quality

| Check | How to Verify |
|-------|--------------|
| Dead buttons | Click every button. Does it do something? |
| Form labels | Every input has a visible label or accessible name |
| Loading states | Data fetch shows a loading indicator |
| Success feedback | After mutations — toast, confirmation, or visual change |
| Error feedback | Failures — helpful, visible |
| Disabled states | Visually distinct; reason clear |
| Focus management | After modal close or submit, focus moves |

### 5c. Information Architecture

| Check | How to Verify |
|-------|--------------|
| Page titles | `document.title` descriptive and unique |
| Active nav state | Current page highlighted |
| Dead ends | Any page with no way forward or back? |
| Empty states | No data — helpful message? |
| 404 page | `/nonexistent-page` — helpful 404? |

## Self-critique before reporting  [LOW freedom — do not skip]

1. **CRUD E2E** — create/update/delete proven after refresh (+ DB if available)
2. **Evidence** — every FAIL has screenshot + console + network + repro
3. **Cleanup** — `QA-TEST-` rows gone; auth session left intact
4. **Right owner** — guest/authed wander → `test-exploratory`; pixel →
   `test-visual-regression`; hostile → `test-red-team`
5. **Binary** — no "sort of works"

## Further reading

- [5d. Data Display Quality and more](references/details.md)
