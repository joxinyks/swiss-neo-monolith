#!/usr/bin/env node
/**
 * Swiss Neo-Monolith — canon gate.
 *
 *   node scripts/check-canon.mjs
 *
 * The contrast gate proves the palette is legible. This proves the rest of the
 * canon is actually held by the files in this repository, rather than only
 * asserted in prose:
 *
 *   01  RED LINES     no radius, blur, gradient, `transition: all` or `vh` in
 *                     hand-written source
 *   02  COLOUR SOURCE every literal colour outside tokens.json resolves to a
 *                     token value — the print stylesheet and the Office theme
 *                     cannot silently drift from the palette
 *   03  VERSION       one version, stated identically everywhere it appears
 *   04  LINT CONFIG   the shipped ESLint rules load, compile, and catch the
 *                     violations their messages claim to catch
 *
 * Exits non-zero on failure so it can sit in CI. Zero dependencies, like the
 * rest of the pipeline.
 *
 * ESCAPE HATCH: a line carrying `SNM-ALLOW` is exempt from 01 and 02. Use it for
 * the sanctioned exceptions only, and say why on the same line.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const read = (p) => readFileSync(resolve(ROOT, p), 'utf8');
const rel = (p) => relative(ROOT, p).replace(/\\/g, '/');

const findings = [];
const fail = (section, where, detail) => findings.push({ section, where, detail });

/* ---------- file collection --------------------------------------------- */

/** Hand-written source that either implements the system or generates it.
 *  tokens/dist/ and preview/ are excluded on purpose: they are generated, and
 *  their generators are in this list. */
const SCAN_DIRS = ['assets', 'scripts'];
const SCAN_EXT = /\.(mjs|cjs|js|ts|tsx|css|scss)$/;

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (SCAN_EXT.test(name)) acc.push(p);
  }
  return acc;
}

const SOURCES = SCAN_DIRS.flatMap((d) => walk(resolve(ROOT, d)));

/* ---------- 01 // RED LINES --------------------------------------------- */

const RED_LINES = [
  {
    id: 'C01',
    what: 'non-zero border radius',
    // Read the declared value and judge it, rather than trying to express
    // "colon not followed by zero" as a lookahead — `\s*` backtracks around a
    // negative lookahead and the rule silently passes everything.
    // `rounded` on its own is prose; `rounded-<something>` is a Tailwind class.
    test: (line) => {
      const m = line.match(/border-?radius\s*:\s*([^;}\n]+)/i);
      if (m && !/^0(px|%|rem|em)?$/i.test(m[1].trim())) return true;
      return /\brounded-[a-z0-9[\]]/i.test(line);
    },
  },
  { id: 'C04', what: 'blur', re: /backdrop-blur|\bblur\(|\bblur-(sm|md|lg|xl|2xl|3xl)\b|backdrop-filter|drop-shadow/i },
  { id: 'C04', what: 'gradient', re: /linear-gradient|radial-gradient|conic-gradient|bg-gradient-/i },
  // A hard offset is `2px 2px 0`; any non-zero third length is a real shadow.
  // Matches the CSS property and the camelCase style-object key alike.
  { id: 'C04', what: 'blurred box-shadow', re: /box-?shadow\s*[:=]\s*['"]?[^;'"]*?-?\d+(px)?\s+-?\d+(px)?\s+[1-9]/i },
  { id: 'MOT', what: '`transition: all`', re: /transition\s*:\s*all\b|\btransition-all\b/i },
  { id: 'LAY', what: '`vh` unit (use dvh)', re: /\d+vh\b/i },
];

/** These two files quote the patterns they ban, so scanning them for those
 *  patterns only ever finds themselves. The lint config is tested behaviourally
 *  in section 04, which is the stronger check; this file is what does the
 *  scanning. */
const RED_LINE_EXEMPT_FILES = new Set([
  'assets/web/eslint-snm.cjs',
  'scripts/check-canon.mjs',
]);

for (const file of SOURCES) {
  if (RED_LINE_EXEMPT_FILES.has(rel(file))) continue;
  const lines = read(file).split('\n');
  lines.forEach((line, i) => {
    if (line.includes('SNM-ALLOW')) return;
    for (const { id, what, re, test } of RED_LINES) {
      if (test ? test(line) : re.test(line)) fail('01', `${rel(file)}:${i + 1}`, `${id} — ${what}`);
    }
  });
}

/* ---------- 02 // COLOUR SOURCE ----------------------------------------- */

const { tokens } = JSON.parse(read('tokens/dist/tokens.resolved.json'));

const norm = (h) => {
  const v = h.replace('#', '').toLowerCase();
  return v.length === 3 ? v.split('').map((c) => c + c).join('') : v.slice(0, 6);
};

/** Every colour the system knows about, as normalised 6-digit hex. */
const KNOWN = new Set();
for (const t of Object.values(tokens)) {
  for (const v of [t.light, t.dark]) {
    const m = String(v).match(/#[0-9a-f]{3,8}\b/gi) ?? [];
    for (const hex of m) KNOWN.add(norm(hex));
  }
}

/** Media that cannot reference a CSS variable carry literal colour by necessity:
 *  a print stylesheet is consumed by PDF renderers with no cascade to inherit,
 *  and an OOXML theme is a fixed XML schema. They are allowed to be literal —
 *  they are not allowed to be *different*. */
const LITERAL_MEDIA = ['assets/print/print.css', 'assets/office/snm-theme-colors.xml'];

const hexScan = [...SOURCES.map(rel), ...LITERAL_MEDIA];

for (const file of [...new Set(hexScan)]) {
  const lines = read(file).split('\n');
  lines.forEach((line, i) => {
    if (line.includes('SNM-ALLOW')) return;
    const hexes = [
      ...(line.match(/#[0-9a-f]{3}(?:[0-9a-f]{3})?\b/gi) ?? []),
      // OOXML states colour as val="10B981", without the hash.
      ...(line.match(/val="([0-9a-f]{6})"/gi) ?? []).map((m) => m.slice(5, 11)),
      // rgb()/rgba() is judged on its triple only. Alpha is a medium decision —
      // print rules sit at .25 and .35 where the screen border token is .15 —
      // but the colour underneath still has to come from the palette.
      ...(line.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/gi) ?? []).map((m) =>
        m.replace(/rgba?\(/i, '').split(',')
          .map((n) => Number(n.trim()).toString(16).padStart(2, '0')).join('')),
    ];
    for (const hex of hexes) {
      if (!KNOWN.has(norm(hex))) {
        fail('02', `${rel(resolve(ROOT, file))}:${i + 1}`, `${hex} is not a token value`);
      }
    }
  });
}

/* ---------- 03 // VERSION ----------------------------------------------- */

const meta = JSON.parse(read('tokens/tokens.json')).$meta;
const VERSION = meta.version;

const stated = [
  ['tokens/tokens.json', VERSION],
  ['package.json', JSON.parse(read('package.json')).version],
  ['tokens/dist/package.json', JSON.parse(read('tokens/dist/package.json')).version],
  ['README.md badge', read('README.md').match(/badge\/REV-([0-9.]+)-/)?.[1]],
  ['README.md colophon', read('README.md').match(/^REV ([0-9.]+) · STATUS/m)?.[1]],
  ['CHANGELOG.md', read('CHANGELOG.md').match(/^## ([0-9.]+) — /m)?.[1]],
];

for (const [where, value] of stated) {
  if (value !== VERSION) {
    fail('03', where, `states ${value ?? '(not found)'}, tokens.json says ${VERSION}`);
  }
}

const changelogDate = read('CHANGELOG.md').match(/^## [0-9.]+ — ([0-9-]+)/m)?.[1];
if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.updated)) {
  fail('03', 'tokens.json $meta.updated', `${meta.updated} is not an ISO date`);
} else if (changelogDate !== meta.updated) {
  fail('03', 'CHANGELOG.md date', `${changelogDate} ≠ $meta.updated ${meta.updated}`);
}

/* ---------- 04 // LINT CONFIG ------------------------------------------- */

/** Each shipped rule, with a string it must reject and one it must accept.
 *  A rule that matches nothing is worse than no rule: it reads as enforcement. */
const LINT_CASES = [
  ['arbitrary hex', 'bg-[#121316] p-4', 'bg-inverse p-4'],
  ['rounded class', 'border rounded-lg p-4', 'border-2 border-border-strong p-4'],
  ['transition all', 'transition-all duration-200', 'transition-[transform,box-shadow]'],
  ['vh unit', 'min-h-[100vh]', 'min-h-[100dvh]'],
  ['blur', 'backdrop-blur-md bg-overlay', 'shadow-1 bg-overlay'],
];

try {
  const config = require(resolve(ROOT, 'assets/web/eslint-snm.cjs'));
  if (!Array.isArray(config) || !config.length) throw new Error('config is not a non-empty flat-config array');

  const restricted = config[0]?.rules?.['no-restricted-syntax'];
  if (!Array.isArray(restricted) || restricted[0] !== 'error') {
    throw new Error('no-restricted-syntax is missing or not set to error');
  }

  const entries = restricted.slice(1);
  if (entries.length !== LINT_CASES.length) {
    fail('04', 'eslint-snm.cjs', `${entries.length} rules, ${LINT_CASES.length} test cases — add the missing case`);
  }

  entries.forEach((entry, i) => {
    const src = entry.selector?.match(/^Literal\[value=\/(.+)\/\]$/)?.[1];
    if (!src) {
      fail('04', `eslint-snm.cjs rule ${i + 1}`, 'selector is not a Literal[value=/…/] pattern');
      return;
    }
    let re;
    try {
      // esquery compiles the pattern out of the selector string exactly as it
      // appears here, so testing it directly is testing what ESLint will run.
      re = new RegExp(src);
    } catch (err) {
      fail('04', `eslint-snm.cjs rule ${i + 1}`, `selector regex does not compile: ${err.message}`);
      return;
    }
    const [name, bad, good] = LINT_CASES[i] ?? [];
    if (!name) return;
    if (!re.test(bad)) fail('04', `eslint-snm.cjs ${name}`, `does not catch ${JSON.stringify(bad)}`);
    if (re.test(good)) fail('04', `eslint-snm.cjs ${name}`, `false positive on ${JSON.stringify(good)}`);
    if (!entry.message?.startsWith('SNM')) {
      fail('04', `eslint-snm.cjs ${name}`, 'message does not name the rule it enforces');
    }
  });
} catch (err) {
  fail('04', 'assets/web/eslint-snm.cjs', err.message);
}

/* ---------- report ------------------------------------------------------- */

const SECTIONS = {
  '01': `red lines · ${SOURCES.length} files`,
  '02': `colour source · ${KNOWN.size} known values`,
  '03': `version · ${stated.length} sites`,
  '04': `lint config · ${LINT_CASES.length} rules`,
};

console.log('\n01 // CANON\n' + '─'.repeat(68));
for (const [id, label] of Object.entries(SECTIONS)) {
  const hits = findings.filter((f) => f.section === id);
  console.log(` ${hits.length ? '✕' : '●'}  ${id}  ${label.padEnd(44)} ${hits.length ? `${hits.length} failing` : 'pass'}`);
}

if (findings.length) {
  console.log('─'.repeat(68));
  for (const f of findings) console.log(` ✕  ${f.where}\n      ${f.detail}`);
}

console.log('─'.repeat(68));
console.log(
  `${findings.length === 0 ? 'PASS' : 'FAIL'} · v${VERSION} · ${findings.length} finding${findings.length === 1 ? '' : 's'} · ` +
  new Date().toISOString().slice(0, 16).replace('T', ' ') + 'Z\n'
);

process.exit(findings.length === 0 ? 0 : 1);
