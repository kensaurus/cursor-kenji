# /test

> Type check → lint → unit → integration → E2E → coverage. Verify quality before committing.

This command is a thin entry point. Pick the right skill for the target:

- **`test-unit`** at `~/.cursor/skills/test-unit/SKILL.md` — write and improve unit tests (Jest, Vitest, pytest, Go test).
- **`test-playwright`** at `~/.cursor/skills/test-playwright/SKILL.md` — PDCA the changes you just made: drive the live app for the touched flows + blast radius and fix pain points as you go.
- **`test-qa`** at `~/.cursor/skills/test-qa/SKILL.md` — full-app webapp QA, dynamic user stories, CRUD verification.
- **`mobile-emulator-test`** at `~/.cursor/skills/mobile-emulator-test/SKILL.md` — native mobile builds (RN/Expo/Capacitor/Flutter) on Android emulator.

> **All browser QA is manual and headed.** Drive a **visible** browser through the Playwright
> MCP one real user action at a time — never `*.spec.ts`, `npx playwright test`, or driving the
> UI through `browser_evaluate`/`browser_run_code_unsafe`. First read
> `~/.cursor/skills/protocol-browser-anti-stall/SKILL.md` (Rule 0).

Use `/test` to explicitly trigger testing. Otherwise, say "test this", "test my changes with playwright", "write tests", "QA the app", or "smoke-test on emulator" and the appropriate skill auto-fires.
