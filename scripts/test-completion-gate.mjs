#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const hook = join(repoRoot, "hooks", "completion-gate.mjs");
const sandbox = mkdtempSync(join(tmpdir(), "cursor-kenji-gate-"));
const stateDir = join(sandbox, ".cursor");
mkdirSync(stateDir, { recursive: true });

function run(status = "completed") {
  const output = execFileSync(process.execPath, [hook], {
    cwd: repoRoot,
    input: JSON.stringify({
      status,
      loop_count: 0,
      workspace_roots: [sandbox],
    }),
    encoding: "utf8",
  });
  return JSON.parse(output);
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

try {
  expect(run().followup_message === undefined, "gate continued without a state file");

  writeFileSync(
    join(stateDir, "complete-everything-state.md"),
    "# State\n\n## Work\n- [x] complete\n",
  );
  expect(run().followup_message === undefined, "gate continued a completed state");

  writeFileSync(
    join(stateDir, "complete-everything-state.md"),
    "# State\n\n## Work\n- [ ] implement the next item\n",
  );
  const pending = run();
  expect(
    pending.followup_message?.includes("1 actionable checklist item"),
    "gate did not continue an actionable state",
  );
  expect(
    pending.followup_message?.includes("implement the next item"),
    "gate omitted the pending item",
  );

  writeFileSync(
    join(stateDir, "complete-everything-state.md"),
    "# State\n\n## Human gates\n- [ ] production access — question: grant access?\n",
  );
  expect(
    run().followup_message === undefined,
    "gate looped on a human-gate-only state",
  );

  writeFileSync(
    join(stateDir, "complete-everything-state.md"),
    "# State\n\n## Work\n- [ ] actionable\n",
  );
  expect(
    run("error").followup_message === undefined,
    "gate continued an errored agent turn",
  );

  // `[-]` = not applicable: skipped only with an "n/a:" reason.
  writeFileSync(
    join(stateDir, "complete-everything-state.md"),
    "# State\n\n## Verification ladder\n- [x] tests\n- [-] typecheck — n/a: no tsconfig.json or typecheck script\n",
  );
  expect(run().followup_message === undefined, "gate blocked a [-] rung that states its n/a reason");
  writeFileSync(
    join(stateDir, "complete-everything-state.md"),
    "# State\n\n## Verification ladder\n- [x] tests\n- [-] typecheck\n",
  );
  expect(
    run().followup_message?.includes("typecheck"),
    "gate let a [-] rung through with no n/a reason",
  );

  // Claude Code Stop payload: cwd (possibly a subdirectory), decision output, loop cap.
  const runClaude = (cwd) => JSON.parse(execFileSync(process.execPath, [hook], {
    cwd: repoRoot,
    input: JSON.stringify({ hook_event_name: "Stop", cwd, stop_hook_active: false }),
    encoding: "utf8",
  }));
  rmSync(join(stateDir, "completion-gate.count.json"), { force: true });
  writeFileSync(join(stateDir, "complete-everything-state.md"), "# State\n\n## Work\n- [ ] implement the next item\n");
  const sub = join(sandbox, "packages", "web");
  mkdirSync(sub, { recursive: true });
  const claudeBlock = runClaude(sub);
  expect(claudeBlock.decision === "block" && claudeBlock.hookSpecificOutput?.decision === "block", "Claude Stop did not block an actionable state from a subdirectory cwd");
  expect(claudeBlock.reason?.includes("implement the next item"), "Claude reason omitted the pending item");
  for (let i = 1; i < 12; i++) runClaude(sandbox);
  expect(runClaude(sandbox).decision === undefined, "Claude gate did not stand aside after LOOP_LIMIT blocks on an unchanged checklist");
  writeFileSync(join(stateDir, "complete-everything-state.md"), "# State\n\n## Work\n- [ ] a different item\n");
  expect(runClaude(sandbox).decision === "block", "a changed checklist did not reset the loop counter");
  writeFileSync(join(stateDir, "complete-everything-state.md"), "# State\n\n## Work\n- [x] done\n");
  expect(runClaude(sandbox).decision === undefined, "Claude gate blocked a completed state");
  expect(runClaude(sandbox).followup_message === undefined, "Claude branch leaked the Cursor output field");

  process.stdout.write("✓ completion gate tests passed.\n");
} finally {
  rmSync(sandbox, { recursive: true, force: true });
}
