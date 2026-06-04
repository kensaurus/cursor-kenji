#!/usr/bin/env node
/**
 * cursor-kenji installer
 *
 * Usage:
 *   npx @kensaurus/cursor-kenji           # install to ~/.cursor/
 *   npx @kensaurus/cursor-kenji --global  # same (alias)
 *   npx @kensaurus/cursor-kenji --dry-run # preview without copying
 *   npx @kensaurus/cursor-kenji --help
 */

import { existsSync, mkdirSync, cpSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir, platform } from 'node:os';
import { fileURLToPath } from 'node:url';

const __dir = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
cursor-kenji installer

Usage:
  npx @kensaurus/cursor-kenji           Install skills to ~/.cursor/skills/
  npx @kensaurus/cursor-kenji --dry-run Preview without copying files
  npx @kensaurus/cursor-kenji --global  Alias for the default (global install)

What gets installed:
  ~/.cursor/skills/       ← 58 agent skills
  ~/.cursor/commands/     ← 13 slash commands
  ~/.cursor/agents/       ← 5 subagent definitions
  ~/.cursor/rules/        ← project rules starter pack
  `.trim());
  process.exit(0);
}

const isDryRun = args.includes('--dry-run');
const targetBase = join(homedir(), '.cursor');

const DIRS = [
  { src: 'skills',        dest: 'skills'   },
  { src: 'skills-cursor', dest: 'skills'   },  // merge cursor-specific skills
  { src: 'commands',      dest: 'commands' },
  { src: 'agents',        dest: 'agents'   },
  { src: 'rules',         dest: 'rules'    },
];

let copied = 0;
let skipped = 0;

for (const { src, dest } of DIRS) {
  const srcPath = resolve(__dir, src);
  const destPath = join(targetBase, dest);

  if (!existsSync(srcPath)) continue;

  if (!isDryRun) {
    mkdirSync(destPath, { recursive: true });
    // Copy each item individually so we merge skills-cursor into skills
    for (const item of readdirSync(srcPath)) {
      const itemSrc = join(srcPath, item);
      const itemDest = join(destPath, item);
      if (statSync(itemSrc).isDirectory()) {
        cpSync(itemSrc, itemDest, { recursive: true });
        copied++;
      }
    }
  } else {
    for (const item of readdirSync(srcPath)) {
      if (statSync(join(srcPath, item)).isDirectory()) {
        console.log(`  [dry-run] ${join(srcPath, item)} → ${join(destPath, item)}`);
        skipped++;
      }
    }
  }
}

if (isDryRun) {
  console.log(`\n[dry-run] Would copy ${skipped} directories to ${targetBase}`);
  console.log('Run without --dry-run to apply.');
} else {
  console.log(`\n✓ cursor-kenji installed — ${copied} items copied to ${targetBase}`);
  console.log('Restart Cursor to activate skills, commands, and agents.');
}
