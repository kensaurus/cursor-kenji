#!/usr/bin/env node
/**
 * Validate every skill against the Agent Skills specification.
 * Spec: https://agentskills.io/specification
 *
 *   node scripts/validate-skills.mjs        # verify; exit 1 on any error
 *   node scripts/validate-skills.mjs --json  # machine-readable output
 *
 * Checks (errors fail CI; warnings don't):
 *   - SKILL.md exists with YAML frontmatter delimited by `---`
 *   - `name` present, matches the parent directory, lowercase a-z/0-9/-,
 *     no leading/trailing hyphen, no consecutive `--`, <= 64 chars
 *   - `description` present, non-empty, <= 320 chars (house budget; spec max 1024)
 *   - `description` has balanced quoted trigger phrases and no truncation scar
 *   - (warn) `description` stays below 315 chars so edits retain budget headroom
 *   - (warn) SKILL.md body <= 500 lines (move detail to references/)
 *   - first-party audit-, plan-, and test- family bodies declare
 *     Degree of freedom, a Worked example, and a Self-critique rubric
 */
import { readdirSync, existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const groups = ["skills", "skills-cursor"];
const asJson = process.argv.includes("--json");

const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/; // lowercase, hyphen-separated, no -- or edge -
const DESC_MAX = 320;
const DESC_HEADROOM_WARN = 315;
const BODY_WARN = 500;

const errors = [];
const warnings = [];
let total = 0;

/** Extract the YAML frontmatter description value, folded to a single line. */
function readDescription(front) {
  const lines = front.split("\n");
  const start = lines.findIndex((l) => /^description:/.test(l));
  if (start === -1) return null;

  const buf = [];
  // Inline value on the `description:` line (skip a lone block-scalar indicator > or |).
  const head = lines[start].slice("description:".length).trim();
  if (head && !/^[>|][-+0-9]*$/.test(head)) buf.push(head);
  // Continuation lines run until the next top-level `key:` (column 0, unindented).
  for (let j = start + 1; j < lines.length; j++) {
    if (/^[A-Za-z0-9_-]+:/.test(lines[j])) break;
    buf.push(lines[j].trim());
  }
  return buf.join(" ").replace(/\s+/g, " ").replace(/^["']|["']$/g, "").trim();
}

for (const group of groups) {
  const base = join(repoRoot, group);
  if (!existsSync(base)) continue;

  for (const dir of readdirSync(base)) {
    const dirPath = join(base, dir);
    if (!statSync(dirPath).isDirectory()) continue;
    const skillFile = join(dirPath, "SKILL.md");
    const id = `${group}/${dir}`;

    if (!existsSync(skillFile)) {
      errors.push(`${id}: missing SKILL.md`);
      continue;
    }
    total++;

    const raw = readFileSync(skillFile, "utf8").replace(/\r\n/g, "\n");
    const fm = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!fm) {
      errors.push(`${id}: no YAML frontmatter (must start with --- ... ---)`);
      continue;
    }
    const front = fm[1];
    const body = fm[2] || "";

    // name
    const nameMatch = front.match(/^name:\s*(.+)$/m);
    const name = nameMatch ? nameMatch[1].trim().replace(/^["']|["']$/g, "") : null;
    if (!name) {
      errors.push(`${id}: missing 'name' field`);
    } else {
      if (name !== dir) errors.push(`${id}: name '${name}' != directory '${dir}'`);
      if (name.length > 64) errors.push(`${id}: name > 64 chars (${name.length})`);
      if (!NAME_RE.test(name))
        errors.push(`${id}: name '${name}' must be lowercase a-z/0-9/-, no leading/trailing or double hyphen`);
    }

    // description
    const desc = readDescription(front);
    if (!desc) {
      errors.push(`${id}: missing or empty 'description'`);
    } else {
      if (desc.length > DESC_MAX) {
        errors.push(`${id}: description ${desc.length} chars > ${DESC_MAX} (house max)`);
      } else if (desc.length >= DESC_HEADROOM_WARN) {
        warnings.push(
          `${id}: description ${desc.length} chars leaves < ${DESC_MAX - DESC_HEADROOM_WARN + 1} chars headroom`,
        );
      }
      const doubleQuotes = [...desc].filter((char) => char === '"').length;
      if (doubleQuotes % 2 !== 0) {
        errors.push(`${id}: description has an unmatched double quote (likely truncated trigger)`);
      }
      if (/→\./.test(desc)) {
        errors.push(`${id}: description contains truncated handoff '→.'`);
      }
      const opens = [...desc].filter((char) => char === "(").length;
      const closes = [...desc].filter((char) => char === ")").length;
      if (opens !== closes) {
        errors.push(`${id}: description has unmatched parentheses (likely truncated)`);
      }
      if (/\bi\.e\.\s*$/.test(desc)) {
        errors.push(`${id}: description ends in 'i.e.' (truncated)`);
      }
    }

    // body length (warning only)
    const lines = body.split("\n").length;
    if (lines > BODY_WARN) {
      warnings.push(`${id}: SKILL.md body ${lines} lines > ${BODY_WARN} (consider references/)`);
    }

    // First-party families on the prompt-enhancement require-list must
    // carry T1 + T3 + T4. Extend only after that family is upgraded.
    // thirdparty-* is excluded.
    if (
      group === "skills" &&
      /^(audit|plan|test|housekeep|deploy|debug|docs|meta|protocol|iterate|backend|design|enhance|workflow|mobile|data|mushi)-/.test(dir) &&
      !dir.startsWith("thirdparty-")
    ) {
      if (!/\bDegree of freedom\b/i.test(body)) {
        errors.push(`${id}: missing T1 "Degree of freedom" declaration`);
      }
      if (!/\bWorked example\b/i.test(body)) {
        errors.push(`${id}: missing T3 "Worked example"`);
      }
      if (!/\bSelf-critique\b/i.test(body)) {
        errors.push(`${id}: missing T4 "Self-critique" rubric`);
      }
    }
  }
}

// ---- Command-name collisions with Claude Code built-ins / bundled skills ----
// Claude Code merges commands into skills: commands/<x>.md creates /<x>. If <x>
// matches a built-in command, Claude shows a duplicate; if it matches a bundled
// skill, our file silently overrides Claude's. Reserve both sets so a colliding
// command name fails CI instead of shipping (see 1.8.3 /mcp,/review,/debug fix).
const CLAUDE_RESERVED = new Set([
  // built-in commands
  "add-dir", "agents", "bug", "clear", "compact", "config", "cost", "doctor", "exit",
  "export", "help", "hooks", "ide", "init", "install-github-app", "login", "logout",
  "mcp", "memory", "migrate-installer", "model", "output-style", "permissions",
  "pr-comments", "release-notes", "resume", "review", "security-review", "status",
  "terminal-setup", "todos", "usage", "vim",
  // bundled skills
  "code-review", "batch", "debug", "loop", "claude-api", "run", "verify", "run-skill-generator",
]);
const cmdDir = join(repoRoot, "commands");
const commandNames = [];
if (existsSync(cmdDir)) {
  for (const f of readdirSync(cmdDir)) {
    if (!f.endsWith(".md")) continue;
    const cmd = f.slice(0, -3);
    commandNames.push(cmd);
    if (CLAUDE_RESERVED.has(cmd)) {
      errors.push(
        `commands/${f}: '/${cmd}' collides with a Claude Code built-in/bundled command — rename it (e.g. /${cmd}-guide)`,
      );
    }
  }
}

// Same-name skill + command is intentional for a small allowlist (thin
// /slash wrapper → skill). Cursor and Claude both slash-invoke skills, so
// a new undeclared pair ships as two /entries. Fail CI instead of drifting.
const INTENTIONAL_SKILL_COMMAND_PAIRS = new Set([
  "burndown-full",
  "complete-everything",
  "handoff",
  "housekeep-backlog",
  "housekeep-gates",
  "research",
  "test-mutation",
  "thirdparty-web-interface-guidelines",
]);
const skillNames = new Set();
for (const group of groups) {
  const base = join(repoRoot, group);
  if (!existsSync(base)) continue;
  for (const dir of readdirSync(base)) {
    if (statSync(join(base, dir)).isDirectory()) skillNames.add(dir);
  }
}
for (const cmd of commandNames) {
  if (skillNames.has(cmd) && !INTENTIONAL_SKILL_COMMAND_PAIRS.has(cmd)) {
    errors.push(
      `commands/${cmd}.md: undeclared dual name with skills/${cmd} — add it to INTENTIONAL_SKILL_COMMAND_PAIRS or rename one side`,
    );
  }
}
for (const name of INTENTIONAL_SKILL_COMMAND_PAIRS) {
  if (!skillNames.has(name) || !commandNames.includes(name)) {
    errors.push(
      `INTENTIONAL_SKILL_COMMAND_PAIRS contains '${name}' but that pair is no longer on disk — remove it from the allowlist`,
    );
  }
}

if (asJson) {
  console.log(JSON.stringify({ total, errors, warnings }, null, 2));
} else {
  for (const w of warnings) console.warn(`⚠ ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`✗ ${e}`);
    console.error(`\n✗ ${errors.length} error(s) across ${total} skills.`);
  } else {
    console.log(`✓ All ${total} skills valid against the Agent Skills spec` +
      (warnings.length ? ` (${warnings.length} warning(s)).` : "."));
  }
}

process.exit(errors.length ? 1 : 0);
