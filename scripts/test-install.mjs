#!/usr/bin/env node
/**
 * Install smoke test — would have caught the original "files silently skipped" bug.
 *
 * Runs bin/install.mjs against a throwaway HOME and asserts that every group
 * (skills, commands, agents, rules) actually lands, including top-level .md files.
 *
 *   node scripts/test-install.mjs   # exit 0 on pass, 1 on failure
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const installer = join(repoRoot, "bin", "install.mjs");
const sandbox = mkdtempSync(join(tmpdir(), "cursor-kenji-test-"));

const fail = [];
const expect = (cond, msg) => { if (!cond) fail.push(msg); };
const countDir = (p) => (existsSync(p) ? readdirSync(p).length : 0);

try {
  // Run the installer with HOME/USERPROFILE pointed at the sandbox.
  execFileSync(process.execPath, [installer], {
    env: { ...process.env, HOME: sandbox, USERPROFILE: sandbox },
    stdio: "pipe",
  });

  const cur = join(sandbox, ".cursor");

  // Expected source counts from the repo.
  const repoSkills = countDir(join(repoRoot, "skills")) + countDir(join(repoRoot, "skills-cursor"));
  const repoCommands = countDir(join(repoRoot, "commands"));
  const repoAgents = countDir(join(repoRoot, "agents"));
  const repoRules = countDir(join(repoRoot, "rules"));

  expect(countDir(join(cur, "skills")) === repoSkills,
    `skills: expected ${repoSkills}, got ${countDir(join(cur, "skills"))}`);
  expect(countDir(join(cur, "commands")) === repoCommands,
    `commands: expected ${repoCommands}, got ${countDir(join(cur, "commands"))}`);
  expect(countDir(join(cur, "agents")) === repoAgents,
    `agents: expected ${repoAgents}, got ${countDir(join(cur, "agents"))}`);
  expect(countDir(join(cur, "rules")) === repoRules,
    `rules: expected ${repoRules}, got ${countDir(join(cur, "rules"))}`);

  // Top-level .md files must survive (the bug class we are guarding against).
  expect(existsSync(join(cur, "agents", "code-reviewer.md")), "missing agents/code-reviewer.md");
  expect(existsSync(join(cur, "commands", "commit.md")), "missing commands/commit.md");
  expect(existsSync(join(cur, "rules", "senior-engineer.md")), "missing rules/senior-engineer.md");

  // MCP template should be written when none exists.
  expect(existsSync(join(cur, "mcp.json")), "missing mcp.json template");

  // --skill should install exactly one skill into a fresh sandbox.
  const sandbox2 = join(sandbox, "single");
  mkdirSync(sandbox2, { recursive: true });
  execFileSync(process.execPath, [installer, "--skill", "audit-ux"], {
    env: { ...process.env, HOME: sandbox2, USERPROFILE: sandbox2 },
    stdio: "pipe",
  });
  expect(existsSync(join(sandbox2, ".cursor", "skills", "audit-ux")), "--skill did not install audit-ux");
  expect(countDir(join(sandbox2, ".cursor", "skills")) === 1, "--skill installed more than one skill");
} catch (err) {
  fail.push("installer threw: " + (err.stderr?.toString() || err.message));
} finally {
  rmSync(sandbox, { recursive: true, force: true });
}

if (fail.length) {
  console.error("✗ install smoke test FAILED:");
  for (const f of fail) console.error("  - " + f);
  process.exit(1);
}
console.log("✓ install smoke test passed (merge + --skill, files preserved).");
