---
name: audit-ui-states
description: >
  Read-only audit of unhappy-path UI states vibe-coding skips — empty, loading,
  error, offline, zero-results, permission, overflow — then plan fixes. Use when
  "check empty/error states", "audit loading states", or "what happens when this
  fails". Dead buttons → plan-stub-checker; backend timeouts → audit-resilience.
license: MIT
---

# audit-ui-states — Unhappy-path state matrix

**Degree of freedom: MIXED** — Phases 0–1 `[HIGH freedom]`; Phase 2 live
force `[LOW freedom — run exactly]`. Read `protocol-browser-anti-stall`
before any browser work.

Read-only. Map every meaningful screen against the states it can be in. Flag
blank boxes, infinite spinners, raw error objects, and broken overflow.

**Happy-path-only UI is the signature of generated code:** it looks finished
in the demo and falls apart the first time a list is empty or a request fails.

> **Present the matrix first. Implement only on approval.**

**Before any browser work, read `protocol-browser-anti-stall`.**

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **audit-ui-states** (this) | Per-screen empty/loading/error/offline/overflow matrix |
| `plan-stub-checker` | Dead buttons, fake data, unwired handlers |
| `audit-resilience` | Backend timeouts/retries — not the front-end empty state |
| `audit-responsive` | Breakpoint layout / linearized desktop |
| `audit-ux` | Heuristics and microcopy voice |
| `enhance-web-forms` | Form field/error/success patterns |
| `test-visual-regression` | Lock the states this skill designs |

Do **not** fire for "desktop looks like a phone" → `audit-responsive`.
Do **not** fire for "this button does nothing" → `plan-stub-checker`.

## How to reason

1. **Observe** — what renders when the list is empty / the request fails / the network drops?
2. **Interpret** — is that a designed state or a void / spinner / raw error?
3. **Classify** — present / missing / broken
4. **Severity** — blank or raw-error on a core screen = major+

## Worked example

> **Observe:** Orders page: `if (!data) return null`. No empty component.
> Forced empty account → white content area.
> **Interpret:** first-run users see a void, not an onboarding empty state.
> **Classify:** missing empty (zero data, valid).
> **Severity:** major — core loop looks broken with no data.
> **Finding:** Orders | empty | major | void | designed empty + CTA

---

## Phase 0 — Enumerate screens and data dependencies  [HIGH freedom]

List screens/views/major components. For each: data fetch, mutation,
permission, network, variable-length content. A static page has few states;
a data-driven list has all of them.

Detect stack (framework, data library, design system) and reuse existing
empty/error primitives — do not invent a second pattern.

---

## Phase 1 — The state matrix  [HIGH freedom]

For every data-driven screen, mark present / missing / broken:

**Loading** — Shape-matched skeleton (good) vs centered spinner / layout flash.
Handles *slow* (3s+), not just pending.

**Empty (zero data, valid)** — First-run / no-content-yet. Designed empty
state with next action — not a void. This is an onboarding surface.

**Zero-results** — Search/filter returned nothing. Distinct from empty.
Offers clear-filters.

**Error** — Human message + retry. Not a raw object, white screen, or swallow.
Voice matches `design-frontend` / `audit-ux` ("Couldn't load your orders.
Retry." — not "Error: undefined").

**Offline** — Detected and communicated. Queued mutations survive reconnect
(PWA / Capacitor especially).

**Partial / permission** — Logged-out, free vs paid, role-gated: deliberate
state, not a crash on null fields.

**Overflow** — Long names, huge numbers, missing images. Layout holds or
truncates. Long lists virtualize. Note overlap with `audit-responsive`;
don't duplicate breakpoint work.

**Optimistic rollback** — Failed mutation rolls the UI back; does not leave a lie.

---

## Phase 2 — Live verification  [LOW freedom — force each state]

Force each state; "exists in code" that throws is *broken*:

```bash
PW='npx --yes @playwright/cli@latest'
$PW -s=ui-states navigate "$APP"
# Empty: fresh account. Error: block the request. Offline: toggle network.
# Overflow: long string / large list. Zero-results: nonsense search.
```

Save evidence under `.playwright-mcp/`.

---

## Definition of Done

- [ ] Every data-driven screen has applicable states enumerated
- [ ] Loading / empty / zero-results / error / offline / permission / overflow scored
- [ ] States forced live, not only read in code
- [ ] Fix plan in PR-sized chunks; nothing patched without approval

## Self-critique before reporting  [LOW freedom — do not skip]

1. **Forced, not inferred** — "exists in code" that throws is *broken*
2. **Empty ≠ zero-results** — do not collapse those two states
3. **Right owner** — dead button → `plan-stub-checker`; linearized desktop → `audit-responsive`
4. **Evidence** — screenshot under `.playwright-mcp/`
5. **Nothing patched** until the matrix is approved

## Output format

1. **State matrix** — screen × state → present / missing / broken
2. **Findings** — screen | state | severity | renders now | should
3. **Live log** — state forced | result | screenshot
4. **Fix plan** — empty/error first, then loading/offline

## Related

- `plan-stub-checker` — unwired controls
- `audit-resilience` — server timeouts
- `audit-responsive` — breakpoint layout
- `audit-ux` / `design-frontend` — copy voice
- `enhance-web-forms` — form states
- `test-visual-regression` — lock the matrix
- `test-playwright` — functional coverage of recoveries
