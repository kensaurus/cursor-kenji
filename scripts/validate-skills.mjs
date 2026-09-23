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
 *   - first-party families on the prompt require-list declare Degree of
 *     freedom plus heading-level `## Worked example` and `## Self-critique`
 *     (a table cell that names the technique does not count)
 *   - Claude Code routing keys, when present, hold documented values:
 *     `effort` ∈ low/medium/high/xhigh/max (skills, agents, commands),
 *     `context` = fork, `agent` only with fork, booleans are true/false,
 *     agents' `memory`/`isolation`/`color`/`maxTurns` in their sets, `effort`
 *     never nested under `metadata:`; (warn) `model` pinning a full `claude-*`
 *     ID; description + when_to_use <= 1536 chars. Cursor ignores these keys.
 *   - every top-level commands/*.md is `disable-model-invocation: true` unless
 *     listed in MODEL_INVOCABLE_COMMANDS; commands-portable/ carries no
 *     Claude-only keys (install.mjs strips portable frontmatter)
 *   - auto-invocable description roster (skills + skills-cursor + top-level
 *     commands + agents, minus disable-model-invocation) <= ROSTER_MAX_CHARS
 *     (ratchet; ADR-0008), warn above ROSTER_TARGET_CHARS
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

// Claude Code frontmatter extensions (code.claude.com/docs/en/skills →
// "Frontmatter reference"; sub-agents → "Supported frontmatter fields").
// Cursor ignores unknown keys, so a bad value here is invisible until a
// Claude Code session silently loses the routing.
const EFFORT_LEVELS = new Set(["low", "medium", "high", "xhigh", "max"]);
const BOOL_KEYS = ["disable-model-invocation", "user-invocable", "background"];
const CLAUDE_CODE_CAP = 1536; // description + when_to_use
const AGENT_ENUMS = {
  memory: new Set(["user", "project", "local"]),
  isolation: new Set(["worktree"]),
  color: new Set(["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"]),
};
// Roster budget (ADR-0008). Every description without
// `disable-model-invocation: true` rides in the host's skill listing on every
// request; Claude Code trims that listing to a fixed budget with no
// user-visible warning (observed in the client, not a documented setting).
const ROSTER_TARGET_CHARS = 40_000; // warn above (1M-window listing budget)
const ROSTER_MAX_CHARS = 43_500;    // ratchet: measured post-flip total rounded up to 500; lower, never raise
// Commands are the `/` surface; the skill twin carries the auto-route.
const MODEL_INVOCABLE_COMMANDS = new Set(["gtm-weekly", "fix-issue", "mcp-guide"]);
const roster = { skills: 0, "skills-cursor": 0, commands: 0, agents: 0 };

const errors = [];
const warnings = [];
let total = 0;

/** Top-level scalar frontmatter value for `key`, unquoted; null if absent. */
function fmScalar(front, key) {
  const m = front.match(new RegExp(`^${key}:[ \\t]*(.*)$`, "m"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : null;
}
function frontmatterOf(raw) {
  const m = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : null;
}
/** Validate Claude Code routing keys — values, not presence. */
function checkRoutingKeys(id, front, desc, { agent = false } = {}) {
  const effort = fmScalar(front, "effort");
  if (effort !== null && !EFFORT_LEVELS.has(effort)) {
    errors.push(`${id}: effort '${effort}' not one of ${[...EFFORT_LEVELS].join("/")}`);
  }
  if (/^metadata:/m.test(front) && /^\s+effort:/m.test(front)) {
    errors.push(`${id}: effort belongs at the top level of the frontmatter, not under metadata:`);
  }
  const context = fmScalar(front, "context");
  if (context !== null && context !== "fork") errors.push(`${id}: context '${context}' — the only documented value is 'fork'`);
  if (fmScalar(front, "agent") !== null && context !== "fork") warnings.push(`${id}: 'agent' is ignored without 'context: fork'`);
  if (context === "fork" && fmScalar(front, "agent") === null) warnings.push(`${id}: context: fork without agent: — Claude Code will use the default subagent, not Explore`);
  for (const key of BOOL_KEYS) {
    const v = fmScalar(front, key);
    if (v !== null && v !== "true" && v !== "false") errors.push(`${id}: ${key} must be true or false (got '${v}')`);
  }
  const model = fmScalar(front, "model");
  if (model !== null && /^claude-/i.test(model)) warnings.push(`${id}: model '${model}' pins a full model ID — use opus/sonnet/haiku/inherit so the pin does not rot`);
  const whenToUse = fmScalar(front, "when_to_use");
  if (whenToUse !== null && desc && desc.length + whenToUse.length > CLAUDE_CODE_CAP) {
    errors.push(`${id}: description + when_to_use ${desc.length + whenToUse.length} chars > ${CLAUDE_CODE_CAP} (Claude Code cap)`);
  }
  if (agent) {
    for (const [key, allowed] of Object.entries(AGENT_ENUMS)) {
      const v = fmScalar(front, key);
      if (v !== null && !allowed.has(v)) errors.push(`${id}: ${key} '${v}' not one of ${[...allowed].join("/")}`);
    }
    const maxTurns = fmScalar(front, "maxTurns");
    if (maxTurns !== null && !/^\d+$/.test(maxTurns)) errors.push(`${id}: maxTurns must be an integer`);
  }
}

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

    checkRoutingKeys(id, front, desc);
    if (desc && fmScalar(front, "disable-model-invocation") !== "true") roster[group] += desc.length;

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
      if (!/^## Worked example\b/m.test(body)) {
        errors.push(`${id}: missing T3 "## Worked example" heading`);
      }
      if (!/^## Self-critique\b/m.test(body)) {
        errors.push(`${id}: missing T4 "## Self-critique" heading`);
      }
    }
  }
}

// ---- Command-name collisions with host built-ins ----
// A file name becomes a slash command on every target:
//   commands/<x>.md          → /<x> in Cursor and Claude Code (Claude merges
//                              commands into the skill namespace)
//   commands-portable/<x>.md → ~/.gemini/commands/<x>.toml → /<x> in Gemini CLI,
//                              and ~/.codex/prompts/<x>.md for Codex
// A name that matches a host built-in ships as a duplicate entry, or silently
// overrides the host's own command. Reserve every documented built-in so a
// collision fails CI (1.8.3 renamed /mcp, /review, /debug; 2026-09-22 renamed
// /plan, which had become a built-in in three of the four hosts).
//
// Snapshot 2026-09-22 — primary names and documented aliases from:
//   https://code.claude.com/docs/en/commands
//   https://cursor.com/docs/cli/reference/slash-commands
//   https://geminicli.com/docs/reference/commands/
// Names since dropped from those tables (migrate-installer, todos) stay
// reserved so an older host does not regress.
const RESERVED_COMMANDS = new Set([
  "about", "add-dir", "advisor", "agents", "android", "app", "artifacts", "ask",
  "auth", "auto-mode-setup", "auto-run", "autocompact", "autofix-pr", "background",
  "bashes", "batch", "bedrock", "bg", "branch", "btw", "bug", "cd", "chat",
  "checkpoint", "checkup", "chrome", "claude-api", "clear", "code-review", "color",
  "commands", "compact", "compress", "config", "context", "continue", "copy",
  "copy-conversation-id", "copy-request-id", "cost", "cursor", "dataviz", "debug",
  "deep-research", "design", "design-login", "design-sync", "desktop", "diff",
  "dir", "directory", "docs", "doctor", "editor", "effort", "exit", "export",
  "extensions", "fast", "feedback", "fewer-permission-prompts", "focus", "fork",
  "goal", "heapdump", "help", "hooks", "ide", "import", "init", "insights",
  "install-github-app", "install-slack-app", "ios", "keybindings", "line-numbers",
  "list-agents", "login", "logout", "logs", "loop", "max-mode", "mcp", "memory",
  "migrate-installer", "mobile", "model", "new", "new-chat", "newchat", "open",
  "output-style", "passes", "permissions", "plan", "plugin", "policies", "powerup",
  "pr-comments", "privacy", "privacy-settings", "proactive", "quit", "radio",
  "rate-limit-options", "rc", "recap", "release-notes", "reload-plugins",
  "reload-skills", "remote-control", "remote-env", "rename", "reset", "restore",
  "resume", "review", "rewind", "routines", "run", "run-everything",
  "run-skill-generator", "sandbox", "schedule", "scroll-speed", "security-review",
  "settings", "setup-bedrock", "setup-github", "setup-terminal", "setup-vertex",
  "sh", "share", "shell", "shells", "show-thinking", "simplify", "skill-doctor",
  "skills", "stats", "status", "status-indicators", "statusline", "stickers",
  "stop", "subtask", "summarize", "tasks", "team-onboarding", "teleport",
  "terminal-setup", "theme", "todos", "tools", "tui", "ultraplan", "ultrareview",
  "undo", "update", "update-config", "upgrade", "usage", "usage-credits", "verify",
  "vim", "voice", "web-setup", "workflow-authoring", "workflows",
]);
const commandNames = [];
for (const group of ["commands", "commands-portable"]) {
  const dir = join(repoRoot, group);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".md") || f === "README.md") continue;
    const cmd = f.slice(0, -3);
    if (group === "commands") commandNames.push(cmd);
    if (RESERVED_COMMANDS.has(cmd)) {
      errors.push(
        `${group}/${f}: '/${cmd}' collides with a built-in in Cursor, Claude Code, Codex, or Gemini CLI — rename it (e.g. /${cmd}-guide)`,
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

// ---- Agents and commands: same routing keys; commands are `/`-only (ADR-0008) ----
function listCommandFiles(dir) {
  const out = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...listCommandFiles(p));
    else if (f.endsWith(".md") && f !== "README.md") out.push(p);
  }
  return out;
}
{
  const agentsDir = join(repoRoot, "agents");
  for (const f of existsSync(agentsDir) ? readdirSync(agentsDir) : []) {
    if (!f.endsWith(".md") || f === "README.md") continue;
    const rel = `agents/${f}`;
    const front = frontmatterOf(readFileSync(join(agentsDir, f), "utf8"));
    if (!front) { errors.push(`${rel}: no YAML frontmatter`); continue; }
    const desc = readDescription(front);
    if (!desc) errors.push(`${rel}: missing 'description'`);
    checkRoutingKeys(rel, front, desc, { agent: true });
    if (desc && fmScalar(front, "disable-model-invocation") !== "true") roster.agents += desc.length;
  }
  const commandsDir = join(repoRoot, "commands");
  for (const file of existsSync(commandsDir) ? listCommandFiles(commandsDir) : []) {
    const rel = `commands/${file.slice(commandsDir.length + 1).replace(/\\/g, "/")}`;
    const topLevel = !rel.slice("commands/".length).includes("/");
    const front = frontmatterOf(readFileSync(file, "utf8"));
    if (!front) { errors.push(`${rel}: no YAML frontmatter`); continue; }
    const desc = readDescription(front);
    if (!desc) errors.push(`${rel}: missing 'description'`);
    checkRoutingKeys(rel, front, desc);
    const dmi = fmScalar(front, "disable-model-invocation");
    const name = rel.replace(/^commands\//, "").replace(/\.md$/, "");
    if (topLevel && dmi !== "true" && !MODEL_INVOCABLE_COMMANDS.has(name)) {
      errors.push(`${rel}: add \`disable-model-invocation: true\` — commands are the / surface and the skill twin carries the auto-route (ADR-0008); list it in MODEL_INVOCABLE_COMMANDS only if the model must invoke it`);
    }
    if (topLevel && desc && dmi !== "true") roster.commands += desc.length;
  }
  const portableDir = join(repoRoot, "commands-portable");
  for (const file of existsSync(portableDir) ? listCommandFiles(portableDir) : []) {
    const rel = `commands-portable/${file.slice(portableDir.length + 1).replace(/\\/g, "/")}`;
    const front = frontmatterOf(readFileSync(file, "utf8")) || "";
    for (const key of ["effort", "disable-model-invocation", "user-invocable", "context", "agent"]) {
      if (fmScalar(front, key) !== null) errors.push(`${rel}: Claude-only key '${key}' in portable frontmatter (install.mjs strips it — dead text)`);
    }
  }
}
const rosterTotal = Object.values(roster).reduce((a, b) => a + b, 0);
const rosterLine = Object.entries(roster).map(([k, v]) => `${k} ${v}`).join(", ");
if (rosterTotal > ROSTER_MAX_CHARS) {
  errors.push(`roster: ${rosterTotal} auto-invocable description chars > ${ROSTER_MAX_CHARS} (${rosterLine}) — flip user-only rituals to disable-model-invocation: true or shorten descriptions; never raise the cap (ADR-0008)`);
} else if (rosterTotal > ROSTER_TARGET_CHARS) {
  warnings.push(`roster: ${rosterTotal} auto-invocable description chars > target ${ROSTER_TARGET_CHARS} (${rosterLine})`);
}

if (asJson) {
  console.log(JSON.stringify({ total, errors, warnings, roster, rosterTotal }, null, 2));
} else {
  for (const w of warnings) console.warn(`⚠ ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`✗ ${e}`);
    console.error(`\n✗ ${errors.length} error(s) across ${total} skills.`);
  } else {
    console.log(`✓ All ${total} skills valid against the Agent Skills spec` +
      (warnings.length ? ` (${warnings.length} warning(s)).` : ".") +
      ` Always-on description roster: ${rosterTotal} chars (~${Math.round(rosterTotal / 4)} tokens per request).`);
  }
}

process.exit(errors.length ? 1 : 0);
