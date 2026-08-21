---
name: test-exploratory
description: >
  Headed exploratory QA of a live app as guest then logged-in, followed
  by a diff; uses junk input and navigation abuse. Use when "monkey test",
  "wander like a confused user", or "guest vs logged in". CRUD stories →
  test-qa. Hostile sweep → test-red-team. This-diff fix loop →
  test-playwright.
license: MIT
---

# test-exploratory — naive-user discovery, two identities

**Degree of freedom: MIXED** — wander and charters `[HIGH freedom]`; driver,
sessions, and triage `[LOW freedom — run exactly]`. Driver is
**playwright-cli**, never Playwright MCP. **Three isolated sessions** — never
share storage.

You drive the **live non-prod app** like a slightly careless user. The job is
**discovery, not verification**: find the bugs nobody scripted. The sharpest
bugs live in the **guest vs logged-in diff**. Report only — do not fix in this
pass. Pair with `protocol-browser-anti-stall`. Hand real bugs to
`workflow-feedback-to-closure`. Lock a fix later with `test-playwright`.

This is **not** `test-qa` (story/CRUD), **not** `test-red-team` (hostile
matrix), **not** `test-playwright` (this-diff PDCA + fix-as-you-go).

## This skill vs neighbors

| Skill | Owns |
|:------|:-----|
| **test-exploratory** (this) | Unscripted wander + junk/nav-abuse + **guest vs authed diff table** |
| `test-qa` | Story-driven CRUD / smoke — explicitly not a monkey test |
| `test-red-team` | Adversarial feature×dimension matrix (security/data/perf) |
| `test-playwright` | Session diff + blast radius; **fixes** inline |
| `audit-auth-flows` | Static route×gate matrix (code). This skill is the **live probe** |
| `audit-ux-journeys` | Story completability / IA — not junk submit + double-click |
| `audit-accessibility` | WCAG / axe only |

## How to reason (before a finding)

1. **Observe** — captured console/network event + identity + snapshot ref
2. **Interpret** — guest-in-protected, guest-only throw, leakage, or expected deny?
3. **Classify** — Real bug / UX defect / Flaky / Out of scope (Phase 3 table)
4. **Severity** — blast radius: auth/money first

## Worked example

> **Observe:** guest session `goto /settings/billing` → 200 + "Update card".
> Authed same route works. Console clean.
> **Interpret:** protected billing UI reachable without a session.
> **Classify:** Real bug — guest-in-protected (live complement to `audit-auth-flows`).
> **Severity:** critical.
> **Finding:** guest | billing | guest-in-protected | critical | repro: `-s=explore-guest` goto `/settings/billing`

## Phase 0 — Safety, driver, isolation  [LOW freedom — sessions exact]

- **Non-prod only.** You will submit forms and mash destructive controls. If
  only prod exists: read-only navigation and say so.
- **Driver is playwright-cli**, never Playwright MCP:

  ```bash
  PW="npx --yes @playwright/cli@latest"
  $PW -s=explore-guest open --headed http://localhost:3000
  ```

  Read `protocol-browser-anti-stall` first (Rule 0: headed, one action, no
  `*.spec.ts`). Use **three isolated sessions** — never share storage:

  | Session | Storage | Purpose |
  |:--------|:--------|:--------|
  | `-s=explore-guest` | default in-memory (no `--profile`) | anonymous |
  | `-s=explore-authed` | `state-load` or dedicated `--profile` under `~/.playwright-cli-profiles/` | seeded test account |
  | `-s=explore-post-logout` | fresh in-memory | prove logout actually cleared state |

  See `protocol-browser-anti-stall/references/playwright-session-coordination.md`.
- **Instrument before the first click.** After `open`, capture `console`,
  network/`requests`, and status ≥400. Judge findings against **captured
  events**, not guesses.
- **Accessibility tree first.** Click/fill by snapshot **refs** (`e12`). Refs
  die on the next page change — **re-snapshot after every navigation**
  ([Playwright Agent CLI snapshots](https://playwright.dev/agent-cli/snapshots)).
  Use `--depth` or a scoped snapshot on dense pages. Screenshot is a
  **secondary** modality for layout/grouping (web.dev 2026), not the driver.
  Vision/coordinates only for canvas or unnamed icons
  ([vision mode](https://playwright.dev/agent-cli/vision-mode)).
- **SBTM charters** — copy `references/charter-template.md`. Time-box each
  identity (30–45 min). Stop when the box ends; record leftovers.

## Phase 1 — Map, then wander (per identity)  [HIGH freedom]

1. **Discover routes** from links + router/sitemap. Build a **per-identity**
   list (some routes exist only when logged in).
2. **Exercise the a11y tree** on each page: every button/link/tab/menu/modal;
   forms three ways (**valid / empty-required / junk** — huge strings, emoji,
   `<script>`, SQL-ish, negatives, wrong types, whitespace); **double-submit**;
   dismiss modals three ways (X, Escape, click-outside).
3. **Abuse navigation** — back/forward after mutations, refresh mid-flow,
   deep-link inner routes, Back after logout (on the post-logout session).
4. **One mobile-width pass** on key pages. Layout breakage →
   `audit-responsive`. Empty/error chrome → `audit-ui-states`. Do not re-audit.
5. **Short monkey burst** on auth, checkout, and mutating forms only (confused
   click sequences / races). Skip marketing pages.

Prioritize blast radius: auth, money, account mutation, then the rest.

## Phase 2 — Guest vs logged-in diff (the deliverable)  [HIGH freedom]

Run Phase 1 fully as **GUEST**, then fully as **LOGGED-IN**, then
**POST-LOGOUT**. Compare. File these in a dedicated table — nothing else in
the pack produces it:

- **Guest reaches protected things** — route/API/UI that should require auth
  (live complement to `audit-auth-flows`).
- **Guest-only breakage** — 500/404/throw for guests, works when authed
  (null-user). Auth-looking UI that renders for guests then errors on click.
- **Login/logout transitions** — redirect loops, broken return-to, session
  not cleared.
- **State leakage** — cookies, `localStorage`, **`sessionStorage`** (Playwright
  `storageState` does **not** persist sessionStorage — inspect it explicitly),
  bfcache/Back showing private data after logout.
- **Divergent errors** — same action, different failure per identity.

## Phase 3 — Triage (this IS the work)  [LOW freedom — T4; do not skip]

Classify every captured event before it becomes a finding:

| Class | Meaning | Action |
|:------|:--------|:-------|
| **Real bug** | Reproducible: uncaught exception, 500, dead control, raw error, guest-in-protected, hang, data-loss on double-submit | File with repro + identity + evidence |
| **UX defect** | Works but wrong (silent fail, no loading/error) | Route to `audit-ui-states` / `audit-ux-journeys` |
| **Flaky** | Failed once | **Re-run once** before filing. Do not file flakes |
| **Out of scope** | WCAG, pixel polish, load | Hand off; do not duplicate |

Severity by blast radius (auth/money first). Do not generate a Playwright
spec dump and call the app "covered" — that is shallow comprehensive coverage.

## Self-critique before reporting

- **Identity + evidence** — every row names who and shows the artifact
- **Flakes** — re-run once before filing
- **Handoff** — WCAG / pixel / load were not filed here
- **Guest** — never used `--profile`

## Definition of Done

- [ ] Non-prod (or read-only + said so)
- [ ] Three isolated CLI sessions; guest never used `--profile`
- [ ] Listeners attached before interaction; traces/screenshots per identity
- [ ] Charters filled; leftovers listed
- [ ] Route lists per identity; high-blast-radius monkey pass done
- [ ] Guest + authed + post-logout runs
- [ ] Guest-vs-authed **diff table** produced
- [ ] Events triaged; flakes re-run; each real bug has repro + identity + evidence
- [ ] Honest skip list (MFA, paid flows, external redirects)

## Output format

1. **Run summary** — target, charters, routes per identity, skips
2. **Findings table** — id | identity (guest/authed/both) | area | type | severity | repro | evidence
3. **Guest-vs-logged-in diff** — protected-reachable, guest-only breakage, transitions, leakage
4. **Console/network** — recurring errors, ≥400, hangs
5. **Handoffs** — `audit-responsive` · `audit-ui-states` · `audit-auth-flows` · each bug → `workflow-feedback-to-closure` → later `test-playwright`

Present the report. Do not fix in this pass.
