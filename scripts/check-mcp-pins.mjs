#!/usr/bin/env node
/**
 * Fail if MCP templates still use @latest or drift from mcp/pinned-versions.json.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const PINNED = JSON.parse(readFileSync(join(ROOT, 'mcp/pinned-versions.json'), 'utf8'));

const FILES = ['.mcp.json', 'mcp/mcp.json.template', 'mcp/mcp-full.json.template'];

/** @type {string[]} */
const errors = [];

for (const rel of FILES) {
  const text = readFileSync(join(ROOT, rel), 'utf8');

  if (/@latest\b/.test(text)) {
    errors.push(`${rel}: contains @latest — pin in mcp/pinned-versions.json`);
  }

  const allPins = { ...PINNED.npm, ...PINNED.pypi_uvx };
  for (const [pkg, version] of Object.entries(allPins)) {
    const pinnedRef = `${pkg}@${version}`;
    if (text.includes(pkg) && !text.includes(pinnedRef)) {
      errors.push(`${rel}: expected ${pinnedRef}`);
    }
  }
}

if (errors.length > 0) {
  console.error('MCP pin check failed:\n');
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
}

const npmCount = Object.keys(PINNED.npm).length;
const uvxCount = Object.keys(PINNED.pypi_uvx).length;
console.log(`✓ MCP templates pinned (${npmCount} npm + ${uvxCount} uvx)`);
