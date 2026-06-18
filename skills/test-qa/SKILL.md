---
name: test-qa
description: >
  GENERIC webapp QA fallback — use ONLY when no project-specific QA skill applies
  (66ai-user-story-testing, sbc-qa-data-integrity-audit, glotit-fresh-eyes-ux-audit,
  or mobile-emulator-test for native builds). For unit tests use test-unit.
  Drives a visible (headed) browser manually through the Playwright MCP like a real
  user — clicking and typing one action at a time, never via scripts or test runners.
  Auto-discovers pages, entities, and auth from the codebase, generates user stories,
  performs real CRUD with data-pipeline verification (FE -> API -> DB -> FE), audits
  UX quality, tests edge cases, and produces a pass/fail report. Use when asked to
  "QA the app", "test the app", "find bugs", "run QA", "test CRUD", "smoke test",
  "check for dead buttons", or "test like a real user" AND no project-specific QA
  skill matches the repo.
license: MIT
---

# QA Testing Skill

Perform full QA testing of any webapp through browser MCP tools, adopting the
mindset of a senior QA engineer preparing an app for production release. This is NOT a
simple page-navigation monkey test — it is controlled, intelligent, user-story-driven
testing that covers CRUD operations, data pipeline integrity, UX quality, and edge cases.

**Before ANY browser interaction, read the `protocol-browser-anti-stall` skill and apply its
rules to every step — especially Rule 0 (manual & headed, never scripted).** That skill lives
at `~/.cursor/skills/protocol-browser-anti-stall/SKILL.md`. Also read
`references/playwright-session-coordination.md` in that folder — shared browser, tab claiming,
persisted login.

## Critical Rules

> **Manual & headed, never scripted.**
> Drive a visible browser one real action at a time with the individual `browser_*` tools.
> `browser_evaluate` / `browser_run_code_unsafe` are inspection-only — never use them to click,
> type, or navigate. Do not write `*.spec.ts` or run `npx playwright test`; experience the app,
> don't automate past it.

> **Test as a real user, think as an engineer.**
> Navigate like someone who just opened the app for the first time.
> Inspect like someone who knows what's under the hood.

> **Every mutation must be verified end-to-end.**
> Creating, updating, or deleting something is not "tested" until you confirm the
> change persisted in the UI after a page refresh AND (if DB access available) in the database.

> **Evidence for every finding.**
> Every bug report needs: screenshot, console output, network request, and reproduction steps.
> "It looked broken" is not a finding.

> **Clean up after yourself.**
> If you created test data during CRUD testing, delete it at the end. Leave the app in the
> state you found it.

> **No hardcoded assumptions.**
> Read the codebase to discover pages, entities, and features. Never assume a route
> exists without confirming it in the source code.

---

## Phase 0: Codebase Discovery

Before opening the browser, understand the app from its source code.

### 0a. Detect Tech Stack

Read the dependency manifest:

```
package.json → Node/JS/TS (framework, UI lib, auth, ORM, state mgmt)
requirements.txt → Python
pyproject.toml → Python
Cargo.toml → Rust
go.mod → Go
```

Extract and record:
- **Framework**: Next.js, Remix, SvelteKit, Nuxt, Django, Rails, etc.
- **UI library**: React, Vue, Svelte, Angular
- **Auth**: Supabase Auth, NextAuth, Clerk, Auth0, Passport, custom
- **Database/ORM**: Supabase, Prisma, Drizzle, Sequelize, SQLAlchemy
- **State management**: TanStack Query, Zustand, Redux, Pinia
- **CSS**: Tailwind, CSS Modules, Styled Components, Chakra, Shadcn
- **Dev server port**: Read from `scripts.dev` in `package.json` (usually 3000, 3001, 5173, 5174)

### 0b. Discover Routes

Scan the file system for page/route definitions:

| Framework | Scan Pattern |
|-----------|-------------|
| Next.js App Router | `app/**/page.tsx` or `app/**/page.js` |
| Next.js Pages | `pages/**/*.tsx` (excluding `_app`, `_document`) |
| Remix | `app/routes/**/*.tsx` |
| SvelteKit | `src/routes/**/+page.svelte` |
| Nuxt | `pages/**/*.vue` |
| React Router (SPA) | Grep for `<Route` or `createBrowserRouter` in source |
| Django | `urls.py` files |
| Rails | `config/routes.rb` |

For each route, note:
- Path (e.g., `/words`, `/profile`, `/settings`)
- Dynamic segments (e.g., `/grammar/[slug]`, `/culture/[id]`)
- Layout nesting (which layout wraps which pages)
- Auth requirements (is the page behind a guard/middleware?)

### 0c. Discover Data Model

Look for entity definitions:

| Source | Where |
|--------|-------|
| Supabase migrations | `supabase/migrations/*.sql` — table definitions, RLS policies |
| Prisma schema | `prisma/schema.prisma` — models, relations |
| Drizzle schema | `drizzle/schema.ts` or `src/db/schema.ts` |
| TypeScript types | `types/*.ts`, `**/types.ts` — interfaces for data entities |
| API routes | `app/api/**` — what CRUD endpoints exist |
| Feature files | `features/*/` — feature-specific services, hooks, components |

For each entity, note: name, key fields, CRUD capabilities, relationships.

### 0d. Discover Auth Pattern

Search for:
- Auth provider config (`createClient` for Supabase, `NextAuth`, `ClerkProvider`, `Auth0Provider`)
- Login page/component (grep for `signIn`, `login`, `authenticate`)
- Test account credentials (check `.env.local`, `.env.test`, `.env.example`, README)
- Protected routes (middleware files, auth guards, route wrappers)

### 0e. Read Feature Documentation

If the project has README files in feature directories (`@_*-README.md`, `docs/`, etc.),
read them to understand expected behavior and business rules.

### 0f. Record Discovery Results

Produce a structured summary before proceeding:

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

## Phase 1: Environment Verification

### 1a. Verify Dev Server Running

Check the terminals folder for active dev server processes:
- Read terminal files to find running `npm run dev`, `pnpm dev`, `next dev`, etc.
- If no dev server found, inform the user and stop.

### 1b. Load the app (shared browser — claim a tab first)

1. `browser_tabs` → `list`; read `.playwright-mcp/session.json` if present.
2. `select` the auth tab from `session.json`, or `new` with the dev URL — do not hijack
   another agent's tab.
3. In **your tab only**:

```
browser_navigate → root URL (e.g., http://localhost:3000)
browser_wait_for → 2s
browser_snapshot → verify content rendered
browser_take_screenshot → baseline screenshot
browser_console_messages → capture any startup errors
browser_network_requests → capture initial API calls
```

If the page is blank after 3 incremental wait cycles (6s total), report a blocker.

### 1c. Authenticate (reuse session — do not re-login every run)

Follow `protocol-browser-anti-stall/references/playwright-session-coordination.md`.

1. Navigate to a **protected route** — if already signed in, skip to 1d.
2. Restore `.playwright-mcp/auth/<host>.json` via `browser_run_code_unsafe` if it exists.
3. If still logged out:
   - Email/password: use test credentials from `.env.test` / README (never paste secrets in chat).
   - **Google / OAuth / SSO**: complete sign-in in the browser (user may need to approve);
     wait with incremental snapshots; then **save storage state** + `session.json`.
4. Verify auth (avatar, dashboard, protected pages load).
5. **Do not log out** at cleanup unless explicitly testing the logout flow.

If auth is impossible, mark auth-required pages as BLOCKED and test only public pages.

### 1d. Capture Baseline

After login (or on the public home page):

```
BASELINE:
- URL: [current URL]
- Console errors: [count — list if any]
- Network failures: [count — list if any]
- Visible content: [brief description]
- Screenshot: [reference]
```

---

## Phase 2: Intelligent Page Crawl

For EVERY route discovered in Phase 0b, do the following:

### 2a. Navigate and Capture

1. `browser_navigate` to the page
2. Apply anti-stall protocol (2s wait → snapshot → verify)
3. `browser_take_screenshot` for visual evidence
4. `browser_console_messages` — record errors and warnings
5. `browser_network_requests` — record API calls, failures, timing

### 2b. Classify the Page

| Classification | Signals |
|---------------|---------|
| **CRUD page** | Has forms, edit buttons, delete buttons, data tables |
| **Display page** | Shows data but no mutation controls (dashboards, profiles) |
| **Settings page** | Has toggles, selects, save buttons for preferences |
| **Auth page** | Login, register, forgot password forms |
| **Static page** | No dynamic data (about, terms, privacy) |
| **Navigation hub** | Links to child pages (home, index pages) |

### 2c. Detect Issues During Crawl

For each page, immediately flag:

| Check | What to Look For |
|-------|-----------------|
| **Dead page** | Page returns 404, error boundary, or blank screen |
| **Console errors** | JavaScript errors, failed assertions, React errors |
| **Network failures** | 4xx/5xx responses, CORS errors, timeouts |
| **Missing content** | "undefined", "null", "NaN", "[object Object]" visible in text |
| **Mock data** | Placeholder text ("Lorem ipsum", "TODO", "test", "example@") that should be real |
| **Dead buttons** | Buttons that have no onClick or navigate nowhere (detect via snapshot inspection) |
| **Missing metadata** | No page title (`document.title` empty or generic), no description |
| **Loading stuck** | Spinner or skeleton that never resolves (after 6s) |
| **Empty state** | No data AND no helpful empty-state message |
| **Broken images** | Image elements with no `src`, broken `src`, or error fallback showing |
| **Overflow** | Text or elements overflowing their containers (visible in screenshot) |

### 2d. Build Feature Map

After crawling all pages, produce:

```
FEATURE MAP:
- CRUD pages: [list — with which entity and which operations]
- Forms found: [list — page + form purpose]
- Data displays: [list — tables, lists, cards, charts]
- Interactive elements: [buttons, toggles, dropdowns per page]
- Search/filter: [which pages have search or filter controls]
- Settings: [which preferences are configurable]
- Dead buttons found: [list with page + element description]
- Pages with errors: [list]
```

---

## Phase 3: Dynamic User Story Generation

Based on the feature map, generate user stories. These are NOT predefined — they are
derived from what the app actually contains.

### Story Categories

#### Category A: First Impression

> "As a first-time visitor, I open the app and try to understand what it does."

Steps:
1. Navigate to home page
2. Assess: Is the value proposition clear within 3 seconds?
3. Assess: Is there a clear call-to-action?
4. Assess: Can I navigate without signing up?
5. Assess: Does the app look professional and trustworthy?

#### Category B: Core User Journey

Identify the app's primary purpose from Phase 0 (e.g., language learning, project management,
e-commerce, social network). Generate a story that walks through the main flow:

> "As a [user type], I want to [primary action] so that [value]."

Steps: Follow the app's main flow from start to finish.

#### Category C: CRUD Lifecycle (per entity)

For each data entity discovered:

> "As a user, I create a [entity], verify it appears, edit it, verify changes, delete it, verify removal."

Steps:
1. Navigate to the creation form
2. Fill with realistic test data (prefix with `QA-TEST-` for easy cleanup)
3. Submit and verify success feedback
4. Navigate to the list view and verify the item appears
5. Open the item and verify all fields match what was entered
6. Edit one or more fields
7. Save and verify the changes appear
8. Delete the item
9. Verify it's gone from the list
10. If DB access available: verify the row was created, updated, and deleted

#### Category D: Navigation Completeness

> "As a user, I can reach every page from the navigation and never hit a dead end."

Steps:
1. From home, find and click every navigation link
2. On each page, verify back navigation works
3. Verify breadcrumbs or location indicators are correct
4. Check that all bottom nav / sidebar nav items lead somewhere
5. Try browser back/forward buttons between pages

#### Category E: Search and Filter (if applicable)

> "As a user, I search for something and get relevant results."

Steps:
1. Find search input
2. Search for a known item
3. Verify results contain the item
4. Search for something that doesn't exist
5. Verify empty results have a helpful message
6. Test filters if available

#### Category F: Error Handling

> "As a user, I make mistakes and the app guides me."

Steps:
1. Submit a form with empty required fields → expect inline validation errors
2. Enter invalid data (wrong format, too long, negative numbers) → expect helpful error messages
3. Navigate to a non-existent URL → expect a proper 404 page
4. If possible, trigger a network error → expect a user-friendly error state

#### Category G: Settings and Preferences

> "As a user, I change my preferences and they persist."

Steps:
1. Navigate to settings
2. Change a preference
3. Navigate away
4. Come back to settings
5. Verify the preference persisted

---

## Phase 4: CRUD Testing

For each CRUD-capable entity, execute the lifecycle test.

### 4a. Create

1. Navigate to the creation page/form
2. Identify all form fields via `browser_snapshot`
3. Fill each field with realistic test data:
 - Text fields: `QA-TEST-[field]-[timestamp]`
 - Numbers: reasonable values for the domain
 - Dates: today or near-future
 - Selects: pick a valid option
 - Toggles: set to non-default
4. `browser_take_screenshot` before submitting (evidence of input)
5. Submit the form
6. `browser_network_requests` — verify the API call succeeded (2xx response)
7. `browser_snapshot` — verify success feedback (toast, redirect, confirmation)
8. `browser_take_screenshot` — evidence of success state

**Record the created item's identifying info** (ID, name, URL) for subsequent steps.

### 4b. Read

1. Navigate to the list view containing the entity
2. `browser_snapshot` — find the created item in the list
3. Verify all displayed fields match what was entered
4. Click into the detail view (if available)
5. Verify detail fields match
6. `browser_take_screenshot` — evidence

### 4c. Update

1. Navigate to the edit form for the created item
2. Change 1-2 fields to new values
3. `browser_take_screenshot` — evidence of changes before save
4. Save the changes
5. `browser_network_requests` — verify the update API call succeeded
6. Verify the UI reflects the updated values
7. Hard-refresh the page (`browser_navigate` to same URL) and verify changes persisted

### 4d. Delete

1. Find the delete action for the item
2. `browser_take_screenshot` — evidence before deletion
3. Trigger deletion (click delete button, confirm dialog if present)
4. `browser_network_requests` — verify the delete API call succeeded
5. Verify the item is gone from the list view
6. If the item had a detail URL, navigate to it and verify 404 or redirect

### 4e. Validation Testing

For each form, also test:

1. **Empty submission**: Clear all fields, submit → expect validation errors
2. **Invalid data**: Wrong format (email without @, text in number field) → expect specific error messages
3. **Boundary values**: Very long strings (500+ chars), zero, negative numbers, past dates
4. **Special characters**: `<script>alert('xss')</script>`, `'; DROP TABLE`, emoji, Unicode
5. **Duplicate prevention**: Try to create the same item twice → expect duplicate handling

### 4f. Data Pipeline Verification

After each mutation (create/update/delete):

1. **Network check**: `browser_network_requests` — was the API call made? What status code?
2. **Response check**: Did the response body contain the expected data?
3. **UI check**: Does the UI reflect the mutation without manual refresh?
4. **Refresh check**: After `browser_navigate` to the same page, is the mutation still visible?
5. **DB check** (if Supabase MCP or DB access available):

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "execute_sql", arguments: {
 "project_id": "<PROJECT_ID>",
 "query": "SELECT * FROM <table> WHERE <identifying_column> LIKE 'QA-TEST-%' ORDER BY created_at DESC LIMIT 5"
})
```

**Pipeline failures to detect:**
- Optimistic update that never confirms (UI shows change but API failed)
- Stale cache (mutation succeeded but list view shows old data)
- Missing cache invalidation (created item doesn't appear until page refresh)
- Ghost data (deleted item reappears after refresh)
- Silent failures (no error shown to user but API returned 4xx/5xx)

---

## Phase 5: UX Quality Audit

Assess each page against design-award quality standards.

### 5a. Visual Quality

| Check | How to Verify |
|-------|--------------|
| Consistent spacing | Screenshot — no irregular gaps or cramped areas |
| Typography | No mixed font sizes where they should match, no orphaned headings |
| Truncation | Text truncated with ellipsis where appropriate, not clipped |
| Image loading | All images render, no broken image icons |
| Icons | All icons render (no missing icon squares or fallback text) |
| Dark mode | If supported: toggle and verify all components adapt, no white flashes |
| Responsive | Test at 1280px, 768px, 375px — layout adapts without breaking |

### 5b. Interaction Quality

| Check | How to Verify |
|-------|--------------|
| Dead buttons | Click every button. Does it do something? |
| Form labels | Every input has a visible label or accessible name |
| Loading states | Trigger data fetches — is a loading indicator shown? |
| Success feedback | After mutations — toast, confirmation, or visual change? |
| Error feedback | After failures — is the error message helpful and visible? |
| Disabled states | Are disabled elements visually distinct? Is the reason clear? |
| Focus management | After modal close or form submit, is focus moved appropriately? |

### 5c. Information Architecture

| Check | How to Verify |
|-------|--------------|
| Page titles | `document.title` — is it descriptive and unique per page? |
| Active nav state | Current page highlighted in navigation? |
| Dead ends | Any page with no way to navigate forward or back? |
| Empty states | Pages with no data — do they show a helpful message? |
| 404 page | Navigate to `/nonexistent-page` — is the 404 page helpful? |

## Further reading

- [5d. Data Display Quality and more](references/details.md)
