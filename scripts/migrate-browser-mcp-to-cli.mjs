/**
 * FILE: scripts/migrate-browser-mcp-to-cli.mjs
 * PURPOSE: One-shot migration of Playwright MCP tool names (`browser_*`) to
 *          playwright-cli command names across skills, commands, and docs.
 *
 * OVERVIEW:
 * - The repo moved off the Playwright MCP (single shared browser, one profile
 *   lock, heavy tool schemas) to `npx @playwright/cli` with named sessions.
 * - This rewrites the mechanical token references. Structural call sites
 *   (`playwright:browser_*` + JSON args) are intentionally NOT handled here and
 *   are migrated by hand.
 *
 * USAGE:
 *   node scripts/migrate-browser-mcp-to-cli.mjs --dry      (preview — default)
 *   node scripts/migrate-browser-mcp-to-cli.mjs --force    (actually write)
 *
 * ⚠ ONE-SHOT, TOKEN-ONLY — DO NOT RE-RUN CASUALLY.
 * This renames tool *tokens*; it does not understand structure. It cannot repair
 * an already-migrated tree, and on MCP-shaped prose it produces invalid output
 * that must be fixed by hand. Known lossy maps:
 *   - `browser_wait_for` → `sleep`          yields `sleep { time: 2 }`; real text
 *                                           waits need `run-code` + `waitFor`
 *   - `browser_tabs` → `tab-list`           yields `` `tab-list` list ``
 *   - `browser_navigate` → `goto`           drops the first-call `open --headed`
 *   - `browser_handle_dialog` → `dialog-accept`  loses the dismiss variant
 *   - `browser_lock` → `close`              wrong semantics (locking no longer exists)
 * Always run `--dry` first and hand-review the resulting diff.
 *
 * NOTES:
 * - `mcp-to-cli-map.md` and `CHANGELOG.md` are excluded: they legitimately
 *   contain the old MCP names (as a translation table and as history).
 * - Longest tokens are replaced first so `browser_navigate_back` is not
 *   clobbered by `browser_navigate`.
 * - Kept in-tree as an audit trail of how the migration was performed.
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Write only on an explicit --force; every other invocation previews.
const DRY = !process.argv.includes("--force");

// Order matters: longest / most specific first.
const MAP = [
  ["browser_navigate_back", "go-back"],
  ["browser_take_screenshot", "screenshot"],
  ["browser_console_messages", "console"],
  ["browser_network_requests", "requests"],
  ["browser_network_request", "request"],
  ["browser_run_code_unsafe", "run-code"],
  ["browser_handle_dialog", "dialog-accept"],
  ["browser_select_option", "select"],
  ["browser_file_upload", "upload"],
  ["browser_press_key", "press"],
  ["browser_fill_form", "fill"],
  ["browser_screenshot", "screenshot"],
  ["browser_navigate", "goto"],
  ["browser_snapshot", "snapshot"],
  ["browser_evaluate", "eval"],
  ["browser_wait_for", "sleep"],
  ["browser_resize", "resize"],
  ["browser_hover", "hover"],
  ["browser_click", "click"],
  ["browser_close", "close"],
  ["browser_tabs", "tab-list"],
  ["browser_type", "type"],
  ["browser_drag", "drag"],
  ["browser_drop", "drop"],
  ["browser_find", "find"],
  ["browser_lock", "close"],
];

// Prose references to the server itself. `.playwright-mcp/` (artifact dir) is
// intentionally unaffected — these patterns all require a space before "MCP".
const PROSE = [
  [/Playwright browser MCP tools/g, "playwright-cli"],
  [/Playwright browser MCP/g, "playwright-cli"],
  [/Playwright MCP tools/g, "playwright-cli"],
  [/the Playwright MCP/g, "playwright-cli"],
  [/Playwright MCP/g, "playwright-cli"],
  [/browser MCP tools/g, "playwright-cli"],
  [/the browser MCP/g, "playwright-cli"],
  [/Browser MCP/g, "playwright-cli"],
  [/browser MCP/g, "playwright-cli"],
];

const EXCLUDE = [
  // Deliberately documents the old MCP names it migrates away from.
  "skills/protocol-browser-anti-stall/SKILL.md",
  "skills/protocol-browser-anti-stall/references/mcp-to-cli-map.md",
  "skills/protocol-browser-anti-stall/references/playwright-session-coordination.md",
  // Intentionally describe the MCP: the catalog entry explains what changed, and
  // mcp/README documents the --isolated fallback.
  "docs/CATALOG.md",
  "mcp/README.md",
  "CHANGELOG.md",
];

const SKIP_DIRS = new Set(["node_modules", ".git", ".playwright-mcp", ".playwright-cli"]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(join(dir, entry.name), out);
    } else if (/\.(md|mdc)$/.test(entry.name)) {
      out.push(join(dir, entry.name).replace(/\\/g, "/"));
    }
  }
  return out;
}

const files = walk(".")
  .map((f) => f.replace(/^\.\//, ""))
  .filter((f) => /browser_[a-z_]+|browser MCP|Browser MCP|Playwright MCP/.test(readFileSync(f, "utf8")))
  .filter((f) => !EXCLUDE.some((x) => f.endsWith(x)));

let totalFiles = 0;
let totalRepl = 0;

for (const file of files) {
  const before = readFileSync(file, "utf8");
  let after = before;
  let n = 0;

  for (const [from, to] of MAP) {
    // Bare token, not part of a longer identifier.
    const re = new RegExp(`\\b${from}\\b`, "g");
    const hits = after.match(re);
    if (hits) {
      n += hits.length;
      after = after.replace(re, to);
    }
  }

  // Server prefixes no longer apply once tools are CLI commands.
  after = after.replace(/\bplaywright:(?=[a-z-]+\b)/g, "");
  after = after.replace(/\bcursor-ide-browser:(?=[a-z-]+\b)/g, "");

  for (const [re, to] of PROSE) {
    const hits = after.match(re);
    if (hits) {
      n += hits.length;
      after = after.replace(re, to);
    }
  }

  if (after !== before) {
    totalFiles++;
    totalRepl += n;
    console.log(`${n.toString().padStart(3)}  ${file}`);
    if (!DRY) writeFileSync(file, after);
  }
}

console.log(
  `\n${DRY ? "[dry] " : ""}${totalRepl} replacements across ${totalFiles} files.`,
);
