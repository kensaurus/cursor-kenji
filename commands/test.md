# /test

> Type check → lint → unit → integration → E2E → coverage. Verify quality before committing.

This command is a thin entry point. Three skills cover the testing surface — pick the right one for the target:

- **`test-unit`** at `~/.cursor/skills/test-unit/SKILL.md` — write and improve unit tests (Jest, Vitest, pytest, Go test).
- **`test-qa`** at `~/.cursor/skills/test-qa/SKILL.md` — webapp QA via browser MCP, dynamic user stories, CRUD verification.
- **`test-emulator`** at `~/.cursor/skills/test-emulator/SKILL.md` — native mobile builds (RN/Expo/Capacitor/Flutter) on Android emulator.

Use `/test` to explicitly trigger testing. Otherwise, say "test this", "write tests", "QA the app", or "smoke-test on emulator" and the appropriate skill auto-fires.
