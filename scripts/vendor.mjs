#!/usr/bin/env node
/**
 * Swiss Neo-Monolith — vendor the token bindings into a consuming project.
 *
 *   node scripts/vendor.mjs ../my-app/vendor/snm
 *   npm run vendor -- ../my-app/vendor/snm
 *
 * Copies tokens/dist/ — bindings, lint config and the package manifest — to the
 * target directory. That directory is self-contained: every import path in
 * references/10-web.md resolves from it, and `npm i file:./vendor/snm` turns the
 * relative paths into the bare `@snm/tokens` specifier if the project prefers it.
 *
 * The system is deliberately not published to a registry. It is a personal design
 * system, versioned in one repository; copying the compiled surface into a project
 * keeps that project reproducible without adding a release process here.
 */

import { cpSync, existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(ROOT, 'tokens/dist');

const args = process.argv.slice(2).filter((a) => a !== '--');
if (args.includes('-h') || args.includes('--help')) {
  console.log('\nusage: node scripts/vendor.mjs [target]    (default: ./vendor/snm)\n');
  process.exit(0);
}

const TARGET = resolve(process.cwd(), args[0] ?? 'vendor/snm');

const row = (sym, field, value) => console.log(`  ${sym}  ${field.padEnd(12)} ${value}`);
const rule = () => console.log('-'.repeat(62));

console.log('\n01 // VENDOR                               swiss-neo-monolith');
rule();

if (!existsSync(resolve(DIST, 'package.json'))) {
  row('x', 'source', 'tokens/dist is not built — run: npm run build:tokens');
  rule();
  console.log('FAILED\n');
  process.exit(1);
}

if (TARGET === DIST) {
  row('x', 'target', 'refusing to vendor tokens/dist onto itself');
  rule();
  console.log('FAILED\n');
  process.exit(1);
}

// Overwriting a directory the user did not intend to hand over is the one
// mistake this script could make that is expensive to undo.
if (existsSync(TARGET)) {
  const stat = statSync(TARGET);
  if (!stat.isDirectory()) {
    row('x', 'target', `${TARGET} exists and is not a directory`);
    rule();
    console.log('FAILED\n');
    process.exit(1);
  }
  const foreign = readdirSync(TARGET)
    .filter((f) => !existsSync(resolve(DIST, f)));
  if (foreign.length) {
    row('x', 'target', `${TARGET} holds files this script does not own:`);
    row(' ', '', foreign.slice(0, 6).join(', ') + (foreign.length > 6 ? ' …' : ''));
    rule();
    console.log('FAILED  point at an empty or previously vendored directory\n');
    process.exit(1);
  }
}

cpSync(DIST, TARGET, { recursive: true });

const { version } = JSON.parse(readFileSync(resolve(DIST, 'package.json'), 'utf8'));
const files = readdirSync(TARGET).sort();

row('*', 'version', `v${version}`);
row('*', 'target', TARGET);
row('*', 'files', String(files.length));
for (const f of files) row(' ', '', relative(TARGET, resolve(TARGET, f)));

rule();
console.log(`DONE     @snm/tokens v${version}`);
console.log(`
  Tailwind   presets: [require('./vendor/snm/tailwind.preset.cjs')]
  CSS        @import './vendor/snm/tokens.css';
  Bare name  npm i file:./vendor/snm   ->   import { token } from '@snm/tokens'
`);
