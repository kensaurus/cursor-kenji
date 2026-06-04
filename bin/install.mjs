#!/usr/bin/env node
/**
 * cursor-kenji installer
 *
 * Usage:
 *   npx @kensaurus/cursor-kenji            # merge-install into ~/.cursor/
 *   npx @kensaurus/cursor-kenji --clean    # MIRROR: wipe managed dirs, then install (backup first)
 *   npx @kensaurus/cursor-kenji --dry-run  # preview without changing anything
 *   npx @kensaurus/cursor-kenji --no-backup --clean  # mirror without a backup
 *   npx @kensaurus/cursor-kenji --help
 *
 * Default (merge):  copies this repo's skills/commands/agents/rules on top of
 *                   whatever is already in ~/.cursor (overwriting same names,
 *                   leaving unrelated items untouched).
 * Mirror (--clean): makes ~/.cursor/{skills,commands,agents,rules} EXACTLY match
 *                   this repo — anything not shipped here is removed. The previous
 *                   contents are backed up to ~/.cursor/.cursor-kenji-backups/<ts>/
 *                   unless --no-backup is passed. mcp.json is never touched.
 */

import {
  existsSync, mkdirSync, cpSync, rmSync, readdirSync, statSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const __dir = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
cursor-kenji installer

Usage:
  npx @kensaurus/cursor-kenji            Merge-install into ~/.cursor/
  npx @kensaurus/cursor-kenji --clean    Mirror: make ~/.cursor match this repo exactly
  npx @kensaurus/cursor-kenji --dry-run  Preview without changing anything
  npx @kensaurus/cursor-kenji --no-backup --clean  Mirror without taking a backup

Flags:
  --clean, --mirror   Wipe managed dirs first so ~/.cursor exactly mirrors this repo
                      (removes skills/commands/agents/rules not shipped here).
  --no-backup         Skip the timestamped backup taken before a --clean wipe.
  --dry-run           Show what would happen; make no changes.

What gets installed:
  ~/.cursor/skills/       ← agent skills (skills/ + skills-cursor/ merged)
  ~/.cursor/commands/     ← slash commands
  ~/.cursor/agents/       ← subagent definitions
  ~/.cursor/rules/        ← project rules starter pack
  ~/.cursor/mcp.json      ← MCP server template (only if missing; never overwritten)
  `.trim());
  process.exit(0);
}

const isDryRun = args.includes('--dry-run');
const isClean = args.includes('--clean') || args.includes('--mirror') || args.includes('--force');
const noBackup = args.includes('--no-backup');
const targetBase = join(homedir(), '.cursor');

const DIRS = [
  { src: 'skills',        dest: 'skills'   },
  { src: 'skills-cursor', dest: 'skills'   },  // merge cursor-specific skills
  { src: 'commands',      dest: 'commands' },
  { src: 'agents',        dest: 'agents'   },
  { src: 'rules',         dest: 'rules'    },
];

// Unique destination dirs this tool manages (skills appears twice in DIRS).
const managedDests = [...new Set(DIRS.map((d) => d.dest))];

// ---- Mirror mode: back up, then wipe managed dirs so the install is exact ----
let backupRoot = null;
let wiped = 0;
if (isClean) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  backupRoot = join(targetBase, '.cursor-kenji-backups', stamp);

  for (const dest of managedDests) {
    const p = join(targetBase, dest);
    if (!existsSync(p)) continue;

    if (isDryRun) {
      console.log(`  [dry-run] backup ${p} → ${join(backupRoot, dest)}`);
      console.log(`  [dry-run] wipe   ${p}`);
    } else {
      if (!noBackup) {
        mkdirSync(backupRoot, { recursive: true });
        cpSync(p, join(backupRoot, dest), { recursive: true });
      }
      rmSync(p, { recursive: true, force: true });
    }
    wiped++;
  }
}

let copiedDirs = 0;
let copiedFiles = 0;

for (const { src, dest } of DIRS) {
  const srcPath = resolve(__dir, src);
  const destPath = join(targetBase, dest);

  if (!existsSync(srcPath)) continue;

  if (!isDryRun) mkdirSync(destPath, { recursive: true });

  // Copy each entry individually — both files and directories — so that:
  //  - skills-cursor/ merges into skills/
  //  - top-level command/agent/rule .md/.mdc files are NOT dropped
  for (const item of readdirSync(srcPath)) {
    const itemSrc = join(srcPath, item);
    const itemDest = join(destPath, item);
    const isDir = statSync(itemSrc).isDirectory();

    if (isDryRun) {
      console.log(`  [dry-run] ${itemSrc} → ${itemDest}`);
    } else {
      cpSync(itemSrc, itemDest, { recursive: true });
    }

    if (isDir) copiedDirs++;
    else copiedFiles++;
  }
}

// ---- MCP config template (only if the user has none yet; never overwritten) ----
const mcpDest = join(targetBase, 'mcp.json');
const mcpTemplate = resolve(__dir, 'mcp', 'mcp.json.template');
let mcpInstalled = false;
if (existsSync(mcpTemplate) && !existsSync(mcpDest)) {
  if (isDryRun) {
    console.log(`  [dry-run] ${mcpTemplate} → ${mcpDest}`);
  } else {
    mkdirSync(targetBase, { recursive: true });
    cpSync(mcpTemplate, mcpDest);
  }
  mcpInstalled = true;
}

const mode = isClean ? 'mirror (--clean)' : 'merge';

if (isDryRun) {
  console.log(
    `\n[dry-run] mode: ${mode}` +
    (isClean ? ` — would back up + wipe ${wiped} managed dirs` : '') +
    `\n[dry-run] Would copy ${copiedDirs} directories and ${copiedFiles} files to ${targetBase}` +
    (mcpInstalled ? ' (plus mcp.json template)' : ' (mcp.json already present — skipped)')
  );
  console.log('Run without --dry-run to apply.');
} else {
  if (isClean && backupRoot && !noBackup) {
    console.log(`✓ Backed up previous ~/.cursor/{${managedDests.join(',')}} → ${backupRoot}`);
  }
  console.log(
    `\n✓ cursor-kenji installed (${mode}) — ${copiedDirs} directories and ${copiedFiles} files copied to ${targetBase}`
  );
  if (mcpInstalled) {
    console.log(`✓ MCP template written to ${mcpDest} — edit it to add your API keys.`);
  }
  console.log('Restart Cursor to activate skills, commands, and agents.');
}
