#!/usr/bin/env node

import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative, dirname } from "node:path";

const STATE_FILES = [
  ".cursor/complete-everything-state.md",
  ".cursor/burndown-state.md",
];

function parseInput() {
  try {
    const raw = readFileSync(0, "utf8").trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function actionableItems(markdown) {
  let section = "";
  const items = [];

  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^#{1,6}\s+(.+?)\s*$/);
    if (heading) {
      section = heading[1];
      continue;
    }

    if (/human gate|blocked on human|blocked on you/i.test(section)) continue;
    const task = line.match(/^\s*-\s*\[\s\]\s+(.+?)\s*$/);
    if (task) {
      items.push(task[1]);
      continue;
    }
    // `[-]` marks a rung that does not apply. It is not a pass, so it only
    // stops counting as open work when it states why ("n/a: <evidence>").
    const na = line.match(/^\s*-\s*\[-\]\s+(.+?)\s*$/);
    if (na && !/\bn\/a:\s*\S/i.test(na[1])) items.push(`${na[1]} (marked [-] without an "n/a: <reason>")`);
  }

  return items;
}

function inspectWorkspace(root) {
  const pending = [];

  for (const relativePath of STATE_FILES) {
    const absolutePath = join(root, relativePath);
    if (!existsSync(absolutePath)) continue;

    try {
      const items = actionableItems(readFileSync(absolutePath, "utf8"));
      if (items.length) pending.push({ relativePath, items });
    } catch {
      // Fail open: a hook must not trap a session because a state file vanished
      // or became unreadable between existence check and read.
    }
  }

  return pending;
}

// Cursor caps follow-ups with loop_limit in cursor-hooks.json. Claude Code only
// suppresses a second Stop on the same turn (stop_hook_active), so the gate
// counts its own blocks per unchanged checklist and stands aside at the cap.
const LOOP_LIMIT = 12;
const COUNTER_FILE = ".cursor/completion-gate.count.json";

// Claude Code sends cwd, which may sit below the workspace root.
function rootsFromCwd(cwd) {
  let dir = cwd;
  for (let depth = 0; depth < 12; depth++) {
    if (STATE_FILES.some((rel) => existsSync(join(dir, rel))) || existsSync(join(dir, ".git"))) return [dir];
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return [cwd];
}

function loopExhausted(root, items) {
  const path = join(root, COUNTER_FILE);
  const hash = createHash("sha1").update(items.join("\n")).digest("hex");
  let count = 0;
  try {
    const prev = JSON.parse(readFileSync(path, "utf8"));
    if (prev.hash === hash) count = Number(prev.count) || 0;
  } catch {
    // first block on this checklist, or unreadable counter: start at 0
  }
  if (count >= LOOP_LIMIT) return true;
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify({ hash, count: count + 1 })}\n`);
  } catch {
    // fail open: a hook must not trap a session over a counter file
  }
  return false;
}

const input = parseInput();
const isClaude = input.hook_event_name === "Stop";
const pass = () => {
  process.stdout.write("{}\n");
  process.exit(0);
};

let roots = [];
if (isClaude) roots = rootsFromCwd(input.cwd || process.cwd());
else if (input.status === "completed" && Array.isArray(input.workspace_roots)) roots = input.workspace_roots;
if (roots.length === 0) pass();

const workspaces = roots.flatMap((root) =>
  inspectWorkspace(root).map((state) => ({ root, ...state })),
);
if (workspaces.length === 0) pass();
if (isClaude && workspaces.every((state) => loopExhausted(state.root, state.items))) pass();

const count = workspaces.reduce((total, state) => total + state.items.length, 0);
const sample = workspaces
  .flatMap((state) =>
    state.items.map(
      (item) => `${relative(process.cwd(), state.root) || "."}/${state.relativePath}: ${item}`,
    ),
  )
  .slice(0, 5)
  .map((item) => `- ${item}`)
  .join("\n");

const message = [
  `Completion gate: ${count} actionable checklist item${count === 1 ? "" : "s"} remain.`,
  "Re-read the durable state file, continue with the next safe item, record fresh evidence, and update the checklist.",
  sample,
  count > 5 ? `- …and ${count - 5} more` : "",
  "Do not claim completion while actionable items remain. Before the final claim, run the completion-judge gate.",
]
  .filter(Boolean)
  .join("\n");

if (isClaude) {
  // Current docs nest the decision under hookSpecificOutput; earlier releases
  // read it at the top level. Emit both; exit 0 lets the JSON carry it.
  const block = { decision: "block", reason: message };
  process.stdout.write(`${JSON.stringify({ ...block, hookSpecificOutput: { hookEventName: "Stop", ...block } })}\n`);
  process.exit(0);
}
process.stdout.write(`${JSON.stringify({ followup_message: message })}\n`);
