---
name: protocol-browser-anti-stall
description: >-
  Prevent browser automation from freezing, getting stuck, or waiting
  excessively during page navigation and interaction. Use BEFORE any browser
  automation session — when testing webapps, running user-story tests,
  QA audits, UX audits, or any task that calls cursor-ide-browser MCP tools
  (browser_navigate, browser_snapshot, browser_wait_for, browser_click, etc.).
---

# Browser Anti-Stall Protocol

**Apply these rules to EVERY browser automation action. No exceptions.**

---

## 1. Navigation Guard

After every `browser_navigate`:

1. `browser_wait_for({ time: 2 })` — short initial wait (2 seconds)
2. `browser_snapshot` — verify URL changed and page has content
3. If page is blank or URL unchanged → `browser_wait_for({ time: 2 })` + `browser_snapshot` again
4. **Max 3 cycles (6s total).** If still not loaded → report blocker and move on.

Never assume navigation succeeded without a snapshot to confirm it.

---

## 2. Never Block More Than 3 Seconds

- `browser_wait_for({ time: N })` → **N must be ≤ 3**
- `browser_wait_for({ text: "...", timeout: 5000 })` → always set explicit `timeout` (default is 30000ms which is way too long)
- `browser_wait_for({ textGone: "...", timeout: 5000 })` → same rule

**Unit reminder:** `time` is in SECONDS, `timeout` is in MILLISECONDS.

---

## 3. Incremental Wait Pattern (replaces all long waits)

```
wait 2s → snapshot → check condition
  ↓ not ready
wait 2s → snapshot → check condition
  ↓ not ready
wait 2s → snapshot → check condition
  ↓ still not ready
STOP → report blocker with evidence
```

This handles Vercel cold starts (5-15s), SPA hydration, and slow APIs
without ever blocking blindly.

---

## 4. Anti-Loop: Max 4 Attempts Per Goal

Track attempts for each interaction goal (e.g. "click login button"):

| Attempts | Action |
|----------|--------|
| 1 | Try the action normally |
| 2 | If same result, try alternative (different ref, scroll into view, `browser_search`) |
| 3 | Gather evidence: `browser_console_messages` + `browser_network_requests` |
| 4 | **STOP.** Report what blocked progress with evidence. |

Never repeat the exact same failing action without new evidence.

---

## 5. Evidence Before Retry

When something isn't working, gather evidence FIRST — then form a hypothesis:

1. `browser_console_messages` — JS errors, failed assertions
2. `browser_network_requests` — pending/failed API calls, CORS errors
3. `browser_snapshot` — actual DOM state (not what you assume)
4. `browser_take_screenshot` — visual state for layout/rendering issues

Only retry after you have a new hypothesis based on this evidence.

---

## 6. Timeout Budget

| Scope | Max time |
|-------|----------|
| Single page interaction (click, fill, select) | 15 seconds |
| Page navigation + verification | 30 seconds |
| Multi-page test flow | 5 minutes |
| Full test suite | 15 minutes |

If a step exceeds its budget, **skip it** and log `[TIMEOUT] skipped: <step>`.
Do not let one stuck step kill the entire session.

---

## 7. SPA-Specific Rules

SPAs (React, Next.js, Vue) fire `load` before hydration completes.
Do NOT rely on page load events. Instead:

- Wait for a **specific UI element** (text, button, heading) that proves the app rendered
- Use `browser_wait_for({ text: "Dashboard", timeout: 8000 })` for key landmarks
- If the page shows a loading spinner, use `browser_wait_for({ textGone: "Loading", timeout: 8000 })`

---

## 8. Fresh Refs After Every State Change

After ANY action that could change the page (navigate, click, fill, select,
hover, press key, wait, dialog response), take a **fresh `browser_snapshot`**
before the next interaction. Old refs are invalid after state changes.

---

## 9. Lock/Unlock Discipline

```
browser_navigate → browser_lock({ action: "lock" }) → interactions → browser_lock({ action: "unlock" })
```

- Lock REQUIRES an existing tab — never call lock before navigate
- Unlock ONLY when completely done with ALL browser operations for the turn
- If a tab already exists (check `browser_tabs list`), lock FIRST before interacting

---

## 10. Blocker Reporting Format

When you must stop, report exactly:

```
BLOCKER:
- Page: [current URL]
- Goal: [what I was trying to do]
- Blocked by: [what prevented it]
- Evidence: [console errors / network failures / screenshot observation]
- Suggestion: [most likely next step or manual action needed]
```

This gives the user actionable information instead of a silent freeze.
