---
name: test-visual-regression
description: >
  Set up Playwright screenshot baselines and CI diffing so UI changes fail
  pixel-by-pixel instead of by eye. Use when "add visual regression tests",
  "catch UI regressions", or after audit-responsive / audit-ui-states. Functional
  clicks stay on test-playwright.
license: MIT
---

# test-visual-regression — Screenshot baselines that stay green

**Degree of freedom: MIXED** — what to baseline `[HIGH freedom]`;
determinism loop and 3× clean runs `[LOW freedom — run exactly]`.
playwright-cli / project runner — never Playwright MCP.

Establish a screenshot baseline for important UI states and wire diffing so
unintended visual change fails CI.

**Functional tests prove the button works; visual tests prove it didn't move,
shrink, lose styling, or overlap the next element.**

Use **playwright-cli** (`npx --yes @playwright/cli@latest`) and the project's
Playwright test runner — never Playwright MCP. Read
`protocol-browser-anti-stall` before any headed session.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **test-visual-regression** (this) | Pixel baselines + CI diff artifacts |
| `test-playwright` | Drive the app like a user; fix functional pain |
| `audit-responsive` | Find linearized layout; this *locks* the fix |
| `audit-ui-states` | Design empty/error states; this *locks* them |
| `audit-uiux-design-system` | Token/component compliance (not screenshot CI) |
| `test-qa` | Exploratory CRUD QA |

## How to reason

1. **Observe** — which surface, viewport, and state; what is volatile
2. **Interpret** — will this pixel-lock a bug, or fail every run on a timestamp?
3. **Classify** — baseline / exclude / mask
4. **Severity** — unmasked volatile content = harness will be abandoned

## Worked example

> **Observe:** dashboard spec screenshots the whole page; a relative
> "Updated 3s ago" label sits in the header.
> **Interpret:** every CI run diffs that label.
> **Classify:** must mask (or freeze time) — not a product regression.
> **Fix:** `mask` the timestamp; prove ≥3 consecutive local runs with zero diff.

---

## Phase 0 — Detect the setup  [HIGH freedom]

- Test runner: Playwright test / Vitest / Storybook + Chromatic/Loki
- Existing snapshot config
- Route list or story catalog
- CI provider (usually GitHub Actions)

Prefer the repo's existing Playwright. Do not add a second visual vendor if
Playwright screenshots already work.

---

## Phase 1 — Choose what to baseline (not everything)  [HIGH freedom]

- **Key screens** at 375 / 768 / 1440 (`audit-responsive` breakpoints)
- **State matrix** from `audit-ui-states`: empty, error, loaded
- **DS primitives:** button/input/card variants
- **Both color schemes** if dark mode exists

Exclude volatile content (timestamps, live feeds, mid-animation). Mask or
freeze it — otherwise every run is a false positive.

---

## Phase 2 — Determinism (or the suite gets abandoned)  [LOW freedom — 3× clean]

- Seeded fixtures, never live/random content
- Freeze time; `prefers-reduced-motion`; disable transitions
- Wait for fonts + images + network idle
- Mask dates/avatars via the tool's mask API
- Pin viewport, device-scale-factor, browser version
- Same environment locally and in CI (container) so host fonts don't diff

Prove stability: **≥3 consecutive local runs with zero diff** before calling
the harness done.

---

## Phase 3 — Wire the loop  [HIGH freedom]

- Commit baselines after a human reviews them (a broken screen locks the bug)
- CI required check; upload expected / actual / diff artifacts
- Intentional UI changes update snapshots in the same PR (`--update-snapshots`)
- Small anti-aliasing threshold only — never wide enough to hide real shifts

Save ad-hoc captures under `.playwright-mcp/`, not the repo root.

---

## Definition of Done

- [ ] Tooling + snapshot config in place
- [ ] Baseline scoped to key screens × breakpoints + critical states + DS primitives
- [ ] Volatile regions masked; 3× local runs clean
- [ ] Baselines human-reviewed
- [ ] CI check + triptych artifacts
- [ ] Update path documented

## Self-critique before reporting  [LOW freedom — do not skip]

1. **3× clean locally** — fewer is not "done"
2. **Human reviewed baselines** — a broken screen must not be locked
3. **Threshold tight** — anti-alias only; never hide real shifts
4. **Right owner** — functional clicks stay on `test-playwright`
5. **Artifacts** under `.playwright-mcp/` for ad-hoc; baselines in the harness dir

## Output format

1. **Baseline plan** — captured / excluded / why
2. **Determinism checklist** — flakiness source → neutralization
3. **CI wiring** — check, artifacts, update path
4. Implement the harness; present artifact location

## Related

- `audit-responsive` / `audit-ui-states` — what to lock
- `test-playwright` / `test-qa` — functional, not pixel
- `protocol-browser-anti-stall` — headed sessions
- `audit-cicd` — CI minutes / artifact retention
