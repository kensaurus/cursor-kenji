---
description: "Route to the right test skill: unit, manual headed Playwright, full-app QA, or mobile emulator"
argument-hint: "[target or flow]"
---

# /test

> Type check → lint → unit → integration → E2E → coverage. Verify quality before committing.

This command is a thin entry point. Pick the right skill for the target:

- **`test-unit`** — write and improve unit tests (Jest, Vitest, pytest, Go test).
- **`test-playwright`** — PDCA the changes you just made: drive the live app for the touched flows + blast radius and fix pain points as you go.
- **`test-qa`** — full-app webapp QA, dynamic user stories, CRUD verification.
- **`mobile-emulator-test`** — native mobile builds (RN/Expo/Capacitor/Flutter) on Android emulator.

> **All browser QA is manual and headed.** Drive a **visible** browser through playwright-cli
> (`npx --yes @playwright/cli@latest -s=<session> …`, with `--headed` on `open`) one real user
> action at a time — never `*.spec.ts`, `npx playwright test`, or driving the
> UI through `eval`/`run-code`. First read the
> `protocol-browser-anti-stall` skill (Rule 0).

Use `/test` to explicitly trigger testing. Otherwise, say "test this", "test my changes with playwright", "write tests", "QA the app", or "smoke-test on emulator" and the appropriate skill auto-fires.
