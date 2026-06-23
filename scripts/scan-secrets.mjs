#!/usr/bin/env node
/**
 * Zero-dependency pre-commit secret scanner.
 * Scans staged files (or paths passed as args) for common credential patterns.
 *
 * Usage:
 *   node scripts/scan-secrets.mjs           # staged files only (pre-commit)
 *   node scripts/scan-secrets.mjs --self-test
 *   node scripts/scan-secrets.mjs path/to/file
 */
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { extname } from 'node:path';

const SKIP_PATH_PREFIXES = [
  'docs/examples/',
  'skills/plan-secrets-audit/',
  'skills/audit-security/',
  'skills/plan-input-validation/',
  'skills/plan-dependency-provenance/',
  'skills/plan-rls-audit/',
  'scripts/scan-secrets.mjs',
];

const SKIP_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.svg',
  '.woff', '.woff2', '.ttf', '.eot',
  '.zip', '.gz', '.tar', '.pdf',
]);

/** @type {{ id: string; re: RegExp }[]} */
const PATTERNS = [
  { id: 'github_pat', re: /\bghp_[A-Za-z0-9]{20,}\b/g },
  { id: 'github_pat_fine', re: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g },
  { id: 'aws_access_key', re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g },
  { id: 'stripe_live', re: /\bsk_live_[A-Za-z0-9]{16,}\b/g },
  { id: 'stripe_restricted_live', re: /\srk_live_[A-Za-z0-9]{16,}\b/g },
  { id: 'npm_token', re: /\bnpm_[A-Za-z0-9]{20,}\b/g },
  { id: 'openai_key', re: /\bsk-[A-Za-z0-9]{20,}T3BlbkFJ[A-Za-z0-9]{10,}\b/g },
  { id: 'slack_token', re: /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/g },
  { id: 'supabase_pat', re: /\bsbp_[a-f0-9]{40}\b/g },
  { id: 'private_key_block', re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
];

const ALLOWLIST_SUBSTRINGS = [
  'ghp_your_token_here',
  'github_pat_your',
  'npm_your_token_here',
  'npm_your_',
  'YOUR_',
  'your_token',
  'your-aws-profile',
  'sk_test_',
  'sk_live_xxx',
  'AKIAEXAMPLE',
  'placeholder',
  'example.com',
  '${FIRECRAWL_API_KEY}',
  '${SUPABASE',
  'xoxb-your',
  '-----BEGIN PRIVATE KEY-----\\n...\\n-----END',
  'plan-secrets-audit',
  'never commit',
];

function shouldSkipPath(filePath) {
  if (SKIP_PATH_PREFIXES.some((p) => filePath.replace(/\\/g, '/').includes(p))) {
    return true;
  }
  const ext = extname(filePath).toLowerCase();
  if (SKIP_EXTENSIONS.has(ext)) return true;
  if (filePath.endsWith('.lock') || filePath.includes('package-lock')) return true;
  return false;
}

function isAllowlisted(match, line) {
  const ctx = `${match} ${line}`;
  return ALLOWLIST_SUBSTRINGS.some((s) => ctx.includes(s));
}

function getStagedFiles() {
  try {
    const out = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return out.trim().split(/\r?\n/).filter(Boolean);
  } catch {
    return [];
  }
}

/** @returns {{ file: string; line: number; id: string; preview: string }[]} */
function scanFile(filePath) {
  if (!existsSync(filePath) || shouldSkipPath(filePath)) return [];

  let text;
  try {
    text = readFileSync(filePath, 'utf8');
  } catch {
    return [];
  }

  if (text.includes('\0')) return [];

  const hits = [];
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const { id, re } of PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        if (!isAllowlisted(m[0], line)) {
          hits.push({
            file: filePath,
            line: i + 1,
            id,
            preview: line.trim().slice(0, 120),
          });
        }
      }
    }
  }
  return hits;
}

function runSelfTest() {
  const fixtures = [
    { text: 'token = ghp_your_token_here', expect: 0 },
    { text: 'key = ghp_1234567890abcdefghijklmnopqrstuvwxyz1234', expect: 1 },
    { text: 'NPM_TOKEN=npm_your_token_here', expect: 0 },
    { text: 'export NPM_TOKEN=npm_abcdefghijklmnopqrstuvwxyz123456', expect: 1 },
    { text: 'sk_test_abc123', expect: 0 },
  ];

  let failed = 0;
  for (const { text, expect } of fixtures) {
    let count = 0;
    for (const { re } of PATTERNS) {
      re.lastIndex = 0;
      const m = re.exec(text);
      if (m && !isAllowlisted(m[0], text)) count++;
    }
    if (count !== expect) {
      console.error(`self-test failed: "${text}" expected ${expect} hits, got ${count}`);
      failed++;
    }
  }

  if (failed > 0) process.exit(1);
  console.log('✓ scan-secrets self-test passed');
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--self-test')) {
    runSelfTest();
    return;
  }

  const files = args.length > 0 ? args : getStagedFiles();
  if (files.length === 0) {
    process.exit(0);
  }

  const allHits = [];
  for (const file of files) {
    allHits.push(...scanFile(file));
  }

  if (allHits.length === 0) {
    process.exit(0);
  }

  console.error('pre-commit: possible secrets detected — commit blocked.\n');
  for (const h of allHits) {
    console.error(`  ${h.file}:${h.line} [${h.id}] ${h.preview}`);
  }
  console.error('\nIf this is a false positive, use a placeholder (YOUR_*, ghp_your_token_here) or ask in the PR.');
  process.exit(1);
}

main();
