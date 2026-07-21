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

  process.stdout.write("✓ completion gate tests passed.\n");
} finally {
  rmSync(sandbox, { recursive: true, force: true });
}
