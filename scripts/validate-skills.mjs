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
 *   - `description` present, non-empty, <= 1024 chars (always-in-context trigger)
 *   - (warn) SKILL.md body <= 500 lines (move detail to references/)
 */
import { readdirSync, existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const groups = ["skills", "skills-cursor"];
const asJson = process.argv.includes("--json");

const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/; // lowercase, hyphen-separated, no -- or edge -
const DESC_MAX = 1024;
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
    } else if (desc.length > DESC_MAX) {
      errors.push(`${id}: description ${desc.length} chars > ${DESC_MAX} (spec max)`);
    }

    // body length (warning only)
    const lines = body.split("\n").length;
    if (lines > BODY_WARN) {
      warnings.push(`${id}: SKILL.md body ${lines} lines > ${BODY_WARN} (consider references/)`);
    }
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
