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
import {
  mkdtempSync,
  rmSync,
  existsSync,
  readdirSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  statSync,
} from "node:fs";
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
  // Per-project rule bundles (directories) are excluded from global installs.
  const repoRules = readdirSync(join(repoRoot, "rules"))
    .filter((f) => !statSync(join(repoRoot, "rules", f)).isDirectory()).length;

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
  expect(existsSync(join(cur, "rules", "senior-engineer.mdc")), "missing rules/senior-engineer.mdc");
  expect(!existsSync(join(cur, "rules", "native-rn-monorepo")),
    "per-project bundle native-rn-monorepo leaked into global rules");
  expect(!existsSync(join(cur, "rules", "project-starter")),
    "per-project bundle project-starter leaked into global rules");
  expect(existsSync(join(cur, "cursor-kenji-hooks", "completion-gate.mjs")),
    "missing completion hook script");

  const hooksPath = join(cur, "hooks.json");
  expect(existsSync(hooksPath), "missing Cursor hooks.json");
  const hooksConfig = JSON.parse(readFileSync(hooksPath, "utf8"));
  const stopHooks = hooksConfig.hooks?.stop ?? [];
  expect(stopHooks.some((entry) => entry.command?.includes("completion-gate.mjs")),
    "completion stop hook was not registered");

  // Reinstall must preserve unrelated user hooks and replace our entry once.
  stopHooks.unshift({ command: "node user-owned-hook.mjs" });
  writeFileSync(hooksPath, JSON.stringify(hooksConfig, null, 2) + "\n");
  execFileSync(process.execPath, [installer], {
    env: { ...process.env, HOME: sandbox, USERPROFILE: sandbox },
    stdio: "pipe",
  });
  const reinstalledHooks = JSON.parse(readFileSync(hooksPath, "utf8")).hooks.stop;
  expect(reinstalledHooks.some((entry) => entry.command === "node user-owned-hook.mjs"),
    "installer removed an unrelated user hook");
  expect(
    reinstalledHooks.filter((entry) => entry.command?.includes("completion-gate.mjs")).length === 1,
    "installer duplicated the completion hook",
  );

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

  // --- Codex + Gemini context-file tools (no skills system) ----------------
  // A fresh sandbox auto-detects nothing, so force both paths with explicit flags.
  const sandbox3 = join(sandbox, "context-tools");
  mkdirSync(sandbox3, { recursive: true });
  execFileSync(process.execPath, [installer, "--codex", "--gemini"], {
    env: { ...process.env, HOME: sandbox3, USERPROFILE: sandbox3 },
    stdio: "pipe",
  });

  const codexRules = join(sandbox3, ".codex", "AGENTS.md");
  const geminiRules = join(sandbox3, ".gemini", "GEMINI.md");
  expect(existsSync(codexRules), "missing ~/.codex/AGENTS.md");
  expect(existsSync(geminiRules), "missing ~/.gemini/GEMINI.md");

  const portableNames = readdirSync(join(repoRoot, "commands-portable"))
    .filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
  expect(portableNames.length > 0, "commands-portable/ has no .md sources");
  for (const name of portableNames) {
    expect(existsSync(join(sandbox3, ".codex", "prompts", `${name}.md`)),
      `missing ~/.codex/prompts/${name}.md`);
    expect(existsSync(join(sandbox3, ".gemini", "commands", `${name}.toml`)),
      `missing ~/.gemini/commands/${name}.toml`);
  }

  // Merged rules must include a real rule and exclude the skill-routing index.
  const codexText = readFileSync(codexRules, "utf8");
  expect(codexText.includes("Senior Engineer"), "AGENTS.md missing senior-engineer rule content");
  expect(!codexText.includes("Skill Routing Index"),
    "AGENTS.md leaked the skill-routing index (should be excluded)");
  expect(!/^---\s*$/m.test(codexText.split("\n").slice(0, 3).join("\n")),
    "AGENTS.md still has raw .mdc frontmatter at the top");

  // Gemini TOML must be well-formed: description line + literal prompt block.
  const geminiToml = readFileSync(join(sandbox3, ".gemini", "commands", `${portableNames[0]}.toml`), "utf8");
  expect(/^description = "/.test(geminiToml), "gemini command missing description line");
  expect(geminiToml.includes("prompt = '''"), "gemini command missing prompt literal block");

  // Idempotency: a second identical run must not spawn .bak backups.
  execFileSync(process.execPath, [installer, "--codex", "--gemini"], {
    env: { ...process.env, HOME: sandbox3, USERPROFILE: sandbox3 },
    stdio: "pipe",
  });
  const codexBaks = readdirSync(join(sandbox3, ".codex")).filter((n) => n.includes(".bak-"));
  expect(codexBaks.length === 0, `idempotent re-run created backups: ${codexBaks.join(", ")}`);

  // --auto must detect a pre-existing tool dir and install to it.
  const sandbox4 = join(sandbox, "auto");
  mkdirSync(join(sandbox4, ".codex"), { recursive: true });
  execFileSync(process.execPath, [installer, "--auto"], {
    env: { ...process.env, HOME: sandbox4, USERPROFILE: sandbox4 },
    stdio: "pipe",
  });
  expect(existsSync(join(sandbox4, ".codex", "AGENTS.md")), "--auto did not install to detected ~/.codex");
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
