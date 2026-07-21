#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

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

    const task = line.match(/^\s*-\s*\[\s\]\s+(.+?)\s*$/);
    if (!task) continue;
    if (/human gate|blocked on human|blocked on you/i.test(section)) continue;
    items.push(task[1]);
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

const input = parseInput();
const roots = Array.isArray(input.workspace_roots) ? input.workspace_roots : [];

if (input.status !== "completed" || roots.length === 0) {
  process.stdout.write("{}\n");
  process.exit(0);
}

const workspaces = roots.flatMap((root) =>
  inspectWorkspace(root).map((state) => ({
    root,
    ...state,
  })),
);

if (workspaces.length === 0) {
  process.stdout.write("{}\n");
  process.exit(0);
}

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

process.stdout.write(`${JSON.stringify({ followup_message: message })}\n`);
