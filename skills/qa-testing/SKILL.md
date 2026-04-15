---
name: test-qa
description: >
  Comprehensive QA testing of any webapp using browser MCP tools against a local dev server.
  Auto-discovers pages, features, data entities, and auth patterns from the codebase.
  Generates user stories dynamically, performs real CRUD operations with data pipeline
  verification (FE -> API -> DB -> FE), audits UX quality at design-award level,
  tests edge cases, and produces a structured pass/fail report. Use when asked to
  "QA the app", "test the app", "find bugs", "test before release", "run QA",
  "test CRUD", "test data pipeline", "check for dead buttons", "audit UX quality",
  "pre-release testing", "smoke test", "acceptance test", or "test like a real user".
  Works with any project — not hardcoded to any specific app.
---

# QA Testing Skill

Perform comprehensive QA testing of any webapp through browser MCP tools, adopting the
mindset of a senior QA engineer preparing an app for production release. This is NOT a
simple page-navigation monkey test — it is controlled, intelligent, user-story-driven
testing that covers CRUD operations, data pipeline integrity, UX quality, and edge cases.

**Before ANY browser interaction, read the `browser-anti-stall` skill and apply its
rules to every step.** That skill lives at `~/.cursor/skills/browser-anti-stall/SKILL.md`.
Its rules (navigation guards, max 3s waits, incremental wait pattern, fresh refs after
state changes, lock/unlock discipline) are mandatory for this entire workflow.

## Critical Rules

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
package.json          → Node/JS/TS (framework, UI lib, auth, ORM, state mgmt)
requirements.txt      → Python
pyproject.toml        → Python
Cargo.toml            → Rust
go.mod                → Go
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

### 1b. Load the App

```
browser_navigate → root URL (e.g., http://localhost:3000)
browser_wait_for → 2s
browser_snapshot → verify content rendered
browser_take_screenshot → baseline screenshot
browser_console_messages → capture any startup errors
browser_network_requests → capture initial API calls
```

If the page is blank after 3 incremental wait cycles (6s total), report a blocker.

### 1c. Authenticate (if required)

If auth is required and test credentials are available:

1. Navigate to the login page (detected in Phase 0d)
2. Fill email and password fields
3. Submit the form
4. Wait for redirect to authenticated page
5. Verify auth state (user name visible, auth-required pages accessible)

If no test credentials found, ask the user. If auth is impossible, mark auth-required
pages as BLOCKED and test only public pages.

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

### 5d. Data Display Quality

| Check | What to Look For |
|-------|-----------------|
| Formatting | Currency, dates, percentages displayed correctly for locale |
| Raw data leaks | "undefined", "null", "NaN", "[object Object]", "Invalid Date" visible |
| Mock/placeholder | "Lorem ipsum", "TODO", "test@example.com", "John Doe" in production data |
| Number accuracy | Totals match sum of line items. Percentages sum to ~100%. |
| Table headers | Every column has a header. Sort indicators if sortable. |
| Chart labels | Axes labeled, legend present, values readable |

### 5e. Accessibility Basics

| Check | How to Verify |
|-------|--------------|
| Accessible names | Interactive elements have `aria-label`, `aria-labelledby`, or visible text |
| Color contrast | Text readable against background (use screenshot inspection) |
| Focus visible | Tab through the page — can you see where focus is? |
| Form labels | `<label>` elements associated with `<input>` via `for`/`htmlFor` |
| Alt text | Images have `alt` attributes (check via snapshot) |

---

## Phase 6: Edge Case and Stress Testing

### 6a. Input Boundary Testing

For each form field:

| Input Type | Test Values |
|-----------|------------|
| Text | Empty, 1 char, 500 chars, 5000 chars |
| Number | 0, -1, 999999999, 0.001, NaN (type "abc") |
| Email | Missing @, double @, special chars, very long |
| Date | Past (1900-01-01), future (2099-12-31), today |
| URL | No protocol, invalid TLD, very long |
| Select | First option, last option, no selection |

### 6b. Rapid Interaction

1. Double-click submit buttons — does it submit twice? (Check network requests)
2. Click a navigation link 3 times rapidly — does it crash or navigate correctly?
3. Toggle a setting on/off/on/off quickly — does it end in the correct state?

### 6c. Navigation Edge Cases

1. Browser back button from every page — does it go to the right place?
2. Browser forward button after going back — works correctly?
3. Direct URL access to every page (not via navigation) — loads correctly?
4. Bookmark a page, close tab, reopen — same state?

### 6d. Error State Testing

1. Navigate to `/this-page-does-not-exist` → expect proper 404
2. If possible, trigger API errors → expect user-facing error messages
3. Submit invalid data in every form → expect inline validation

---

## Phase 7: Cleanup

Remove all test data created during testing:

1. Delete any items prefixed with `QA-TEST-`
2. Reset any settings changed during testing
3. If DB access available, verify cleanup:

```sql
SELECT * FROM <table> WHERE <name_column> LIKE 'QA-TEST-%';
-- Should return 0 rows
```

4. Log out if testing required authentication

---

## Phase 8: Report

Produce the final QA report:

```markdown
## QA Test Report — [Project Name]

### Environment
- URL: [url tested]
- Framework: [detected framework + version]
- Auth: [method used or "guest"]
- Date: [date]

### Discovery Summary
- Routes in codebase: [N]
- Pages tested: [N]
- Data entities found: [N]
- CRUD-capable entities tested: [N]

### Test Summary

| Metric | Value |
|--------|-------|
| User stories executed | [N] |
| Individual test steps | [N] |
| CRUD operations performed | [N] |
| Passed | [N] |
| Failed | [N] |
| Blocked | [N] |
| Pass rate | [%] |

### Critical Issues (blocks production release)

| # | Page | Issue | Evidence | Steps to Reproduce |
|---|------|-------|----------|-------------------|
| 1 | [url] | [description] | [screenshot/console ref] | [steps] |

### Major Issues (degrades user experience)

| # | Page | Issue | Evidence | Recommendation |
|---|------|-------|----------|---------------|
| 1 | [url] | [description] | [ref] | [how to fix] |

### Minor Issues (polish for design award)

| # | Page | Issue | Quick Fix |
|---|------|-------|-----------|
| 1 | [url] | [description] | [suggestion] |

### Data Pipeline Issues

| # | Entity | Operation | Issue | Evidence |
|---|--------|-----------|-------|----------|
| 1 | [entity] | [create/update/delete] | [what went wrong] | [network/DB evidence] |

### Dead / Mock Code Detected

| # | Page | Finding |
|---|------|---------|
| 1 | [url] | [dead button / mock data / placeholder text] |

### UX Quality Highlights

#### What Works Well
1. [genuine positive with evidence]
2. [genuine positive with evidence]

#### Design-Award Readiness
- Visual consistency: [score 1-5]
- Interaction feedback: [score 1-5]
- Empty/error states: [score 1-5]
- Data display quality: [score 1-5]
- Accessibility basics: [score 1-5]

### Pages Not Tested

| Page | Reason |
|------|--------|
| [url] | [BLOCKED: auth / SKIPPED: reason] |

### Cleanup Verification
- Test data created: [N items]
- Test data deleted: [N items]
- Orphaned test data: [N — details if any]

### Production Readiness Score

**[N] / 10** — [1-2 sentence justification]

| Score | Meaning |
|-------|---------|
| 9-10 | Ship it. Design-award ready. |
| 7-8 | Ship after fixing critical/major issues. Solid. |
| 5-6 | Needs work. Multiple major issues. |
| 3-4 | Not ready. Fundamental problems. |
| 1-2 | Broken. Major rework needed. |
```

---

## Sentry Integration (optional)

If the project has Sentry configured (detected in Phase 0), check for production errors
related to tested features:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "naturalLanguageQuery": "unresolved issues from the last 7 days",
  "projectSlugOrId": "<PROJECT_SLUG>",
  "regionUrl": "<REGION_URL>",
  "limit": 30
})
```

Cross-reference Sentry issues with pages tested. If a page you tested has known production
errors, note them in the report under a "Known Production Issues" section.

---

## Adapting to Different App Types

The skill auto-adapts based on what Phase 0 discovers. Here are common patterns:

| App Type | Focus Areas |
|----------|------------|
| **CRUD / SaaS** | Heavy CRUD lifecycle testing, data pipeline verification, form validation |
| **Content / CMS** | Content rendering, search, filtering, pagination, media loading |
| **E-commerce** | Cart operations, checkout flow, pricing accuracy, inventory states |
| **Social** | User interactions, feed rendering, notifications, privacy settings |
| **Language learning** | Lesson flow completion, progress tracking, content accuracy |
| **Dashboard / Analytics** | Chart rendering, data accuracy, filter interactions, export |
| **Mobile-first PWA** | Touch targets, offline states, install prompt, viewport testing |

---

## Test Data Guidelines

When generating test data for CRUD operations:

- **Prefix all test data** with `QA-TEST-` for easy identification and cleanup
- **Use realistic but obviously fake values**: `QA-TEST-Widget-1712345678`, `qa-test@example.com`
- **Never use real personal data** or production credentials
- **Respect domain constraints**: if the app is financial, use realistic but fake numbers
- **Cover multiple data types**: strings, numbers, dates, booleans, selections
- **Test with the app's locale**: if the app is in Japanese, test with Japanese input too

---

## Execution Protocol

For each test step, follow this cycle:

```
1. browser_navigate (if needed)
2. Apply anti-stall: wait 2s → snapshot → verify loaded
3. browser_lock before any interaction sequence
4. browser_snapshot to get current refs
5. Interact (click, fill, type, scroll)
6. browser_snapshot after interaction (fresh refs)
7. browser_console_messages (check for errors)
8. browser_network_requests (check for failures)
9. browser_take_screenshot (evidence)
10. Evaluate: PASS or FAIL with evidence
11. browser_lock({ action: "unlock" }) when done
```

**Timeout budget:**
- Single interaction: 15 seconds max
- Page navigation + verification: 30 seconds max
- Full CRUD lifecycle per entity: 5 minutes max
- Full test suite: 30 minutes max

If any step exceeds its budget, log `[TIMEOUT]` and move on.

---

## Important Rules

1. **Read the codebase first.** Never test blindly. Phase 0 is mandatory.
2. **Use browser MCP tools** for all browser interaction: `browser_navigate`, `browser_snapshot`, `browser_take_screenshot`, `browser_click`, `browser_fill`, `browser_type`, `browser_scroll`, `browser_console_messages`, `browser_network_requests`, `browser_lock`, `browser_search`.
3. **Apply anti-stall protocol** to every interaction. Read `browser-anti-stall` skill first.
4. **Screenshot every test step.** Every pass and fail needs visual evidence.
5. **Check console and network** after every page load and every mutation.
6. **Clean up test data.** Delete everything prefixed with `QA-TEST-` at the end.
7. **Be binary on findings.** Each check either PASSES or FAILS. No "sort of works."
8. **Report severity honestly.** Critical = blocks release. Major = bad UX. Minor = polish.
9. **Note what works well.** Good QA reports include positives, not just bugs.
10. **Respect time budgets.** Skip stuck steps rather than freezing the entire session.
