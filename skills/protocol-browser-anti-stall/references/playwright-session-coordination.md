# Playwright session coordination (shared browser, persisted auth)

The Playwright MCP (`user-playwright`) exposes **one browser process** per Cursor
instance. Every agent, chat, and skill shares it. Follow this protocol so parallel
work does not hijack tabs, lose Google/OAuth sign-in, or fight over navigation.

All artifacts live under `.playwright-mcp/` (gitignored).

---

## File layout

```
.playwright-mcp/
├── session.json              # Which tab holds auth; last writer wins metadata only
└── auth/
    └── localhost-3000.json   # Playwright storageState (cookies + localStorage)
```

`<host>.json` naming: hostname + port, e.g. `localhost-3000.json`, `app-example-com.json`.

---

## Multi-agent / multi-tab etiquette

**Before the first browser action in your turn:**

1. `browser_tabs` → `action: "list"` — see every open tab and its URL.
2. Read `.playwright-mcp/session.json` if it exists (see schema below).
3. **Claim a tab** — do not blindly `browser_navigate` on tab 0.

| Situation | Action |
|-----------|--------|
| `session.json` points to an auth tab still on the app origin | `browser_tabs` → `select` that index → verify logged-in via snapshot |
| No auth tab, but a tab is already on the app and logged in | `select` it → update `session.json` → reuse |
| Need a isolated surface (different route, no nav conflict) | `browser_tabs` → `new` with target URL → work only in that tab |
| Another tab is mid-flow on unrelated work | **Do not** navigate or close it — pick a different tab |

**During your turn:**

- Interact only in **your selected tab** unless explicitly switching with `select`.
- Take a fresh `browser_snapshot` after every state change (refs go stale).
- Never `browser_close` tabs you did not create **unless** the user asked to reset the browser.
- Never `browser_close` with no index if other agents may still be testing.

**End of turn:**

- If you established or refreshed auth, **save storage state** (below) and update `session.json`.
- Leave the auth tab open for the next agent — do **not** log out unless the test is explicitly the logout flow.

### `session.json` schema

```json
{
  "authTabIndex": 0,
  "appOrigin": "http://localhost:3000",
  "storageStatePath": ".playwright-mcp/auth/localhost-3000.json",
  "updatedAt": "2026-06-12T00:00:00.000Z",
  "hint": "test-playwright — dashboard flow"
}
```

`authTabIndex` is advisory — always confirm with `browser_tabs` list before selecting.

---

## Auth persistence (Google OAuth, magic link, email/password)

Goal: **sign in once**, reuse across skills (`test-playwright`, `test-qa`, `test-red-team`) and across agent turns.

### Step 1 — Check existing session

1. Select auth tab (or `new` → navigate to app origin).
2. Navigate to a **protected route** (e.g. `/dashboard`, not `/login`).
3. Snapshot:
   - **Logged in** (dashboard, avatar, app shell) → skip login; optionally refresh storage state file.
   - **Redirect to login** → continue to Step 2.

### Step 2 — Restore saved storage state

If `.playwright-mcp/auth/<host>.json` exists, inject before navigating:

```json
CallMcpTool(server: "user-playwright", toolName: "browser_run_code_unsafe", arguments: {
  "code": "async (page) => {\n  const fs = require('fs');\n  const path = require('path');\n  const statePath = path.resolve('.playwright-mcp/auth/localhost-3000.json');\n  if (!fs.existsSync(statePath)) return { restored: false };\n  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));\n  if (state.cookies?.length) await page.context().addCookies(state.cookies);\n  if (state.origins?.length) {\n    for (const o of state.origins) {\n      await page.goto(o.origin);\n      for (const item of o.localStorage || []) {\n        await page.evaluate(([k, v]) => localStorage.setItem(k, v), [item.name, item.value]);\n      }\n    }\n  }\n  return { restored: true };\n}"
})
```

Replace `localhost-3000.json` with your host file. Navigate to protected route again — if still logged out, continue to Step 3.

### Step 3 — Interactive login (once per environment)

1. Navigate to login; complete auth in the browser:
   - **Google / OAuth / SSO**: user may need to approve in the browser window — wait up to 60s with incremental snapshots (2s waits, anti-stall rules still apply).
   - **Email/password**: use test credentials from `.env.test` / README — never paste secrets into chat.
2. Verify protected route loads.
3. **Save storage state** immediately:

```json
CallMcpTool(server: "user-playwright", toolName: "browser_run_code_unsafe", arguments: {
  "code": "async (page) => {\n  const fs = require('fs');\n  const path = require('path');\n  const dir = path.resolve('.playwright-mcp/auth');\n  fs.mkdirSync(dir, { recursive: true });\n  const statePath = path.join(dir, 'localhost-3000.json');\n  await page.context().storageState({ path: statePath });\n  return { saved: statePath };\n}"
})
```

4. Write `session.json` with current tab index and `storageStatePath`.

### Rules

- **Do not log out** at end of QA/red-team/PDCA unless testing logout.
- **Do not** open a second OAuth flow if storage state or an existing tab is already authenticated.
- **Production URLs**: ask before saving auth state to disk; default to localhost/staging only.
- Storage files contain session cookies — treat as secrets; never commit (`.playwright-mcp/` is gitignored).

---

## Conflict recovery

If navigation lands on the wrong page or auth is lost:

1. `browser_tabs` list — identify tabs; do not close unknown tabs.
2. Try `select` auth tab from `session.json`.
3. Re-inject storage state (Step 2).
4. If still broken, report blocker and ask user to re-auth once — then save state again.

If two agents must test **different apps** simultaneously, use **separate tabs** with separate `auth/<host>.json` files — never share one tab across origins.
