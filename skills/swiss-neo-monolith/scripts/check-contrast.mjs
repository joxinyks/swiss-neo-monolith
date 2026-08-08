#!/usr/bin/env node
/**
 * Swiss Neo-Monolith — WCAG contrast gate.
 *
 *   node scripts/check-contrast.mjs
 *
 * Every foreground/background pair the system actually ships is checked against
 * its required ratio. Exits non-zero on failure so it can sit in CI.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { tokens } = JSON.parse(
  readFileSync(resolve(ROOT, 'tokens/dist/tokens.resolved.json'), 'utf8')
);

/* ---------- WCAG maths ------------------------------------------------- */

function srgbToLinear(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`not a plain hex colour: ${hex}`);
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

/* ---------- the contract ----------------------------------------------- */

const BODY = 4.5;   // normal text
const LARGE = 3.0;  // >=24px, or >=19px bold
const UI = 3.0;     // icons, borders, graphics

/** [foreground, background, required, label, themes?]
 *  `themes` pins a pair to one theme — some pairs only exist in one
 *  (mint on obsidian is a light-theme inverse panel; in dark, bg-inverse
 *  is bone and the pair is meaningless). */
const PAIRS = [
  ['text',         'bg',         BODY, 'gövde metni'],
  ['text',         'bg-raised',  BODY, 'gövde metni / yükseltilmiş'],
  ['text-muted',   'bg',         BODY, 'ikincil metin'],
  ['text-muted',   'bg-raised',  BODY, 'ikincil metin / yükseltilmiş'],
  ['text-accent',  'bg',         BODY, 'aksan metin (mint-700)'],
  ['text-accent',  'bg-raised',  BODY, 'aksan metin / yükseltilmiş'],
  ['text-inverse', 'bg-inverse', BODY, 'ters metin'],
  ['accent',       'bg-inverse', BODY, 'mint-500 obsidyen üzeri', ['light']],
  ['danger',       'bg',         BODY, 'hata metni'],
  ['warn',         'bg',         BODY, 'uyarı metni'],
  ['info',         'bg',         BODY, 'bilgi metni'],
  ['accent-ui',    'bg',         UI,   'anlam taşıyan mint ikon/kontur'],
  ['accent-ui',    'bg-raised',  UI,   'anlam taşıyan mint / yükseltilmiş'],
  ['border-strong','bg',         UI,   'yapısal kontur'],
  ['focus',        'bg',         UI,   'odak halkası'],
  ['focus',        'bg-raised',  UI,   'odak halkası / yükseltilmiş'],
];

/** Known-bad tokens that must NOT be used for body text. Documented as guards
 *  so a future palette edit can't quietly make them look safe. */
const GUARDS = [
  ['color-steel-500', 'color-bone-200', BODY, 'steel-500 gövde metni olarak yasak'],
  ['color-mint-500',  'color-bone-200', BODY, 'mint-500 kemik üzeri metin yasak'],
  ['color-mint-600',  'color-bone-200', BODY, 'mint-600 kemik üzeri metin yasak'],
];

/* ---------- run --------------------------------------------------------- */

const get = (name, theme) => {
  const t = tokens[name];
  if (!t) throw new Error(`unknown token: ${name}`);
  return t[theme];
};

let failed = 0;
const rows = [];

for (const theme of ['light', 'dark']) {
  for (const [fg, bg, need, label, themes] of PAIRS) {
    if (themes && !themes.includes(theme)) continue;
    // get() intentionally throws on an unknown token — a typo here must fail
    // the build, not silently drop a pair from the audit.
    const r = ratio(get(fg, theme), get(bg, theme));
    const ok = r >= need;
    if (!ok) failed++;
    rows.push([ok ? '●' : '✕', theme.padEnd(5), label.padEnd(34),
               r.toFixed(2).padStart(6), `≥${need.toFixed(1)}`]);
  }
}

for (const [g, bgName, need, label] of GUARDS) {
  const r = ratio(get(g, 'light'), get(bgName, 'light'));
  const stillUnsafe = r < need;
  if (!stillUnsafe) failed++;
  rows.push([stillUnsafe ? '●' : '✕', 'guard', label.padEnd(34),
             r.toFixed(2).padStart(6), stillUnsafe ? 'unsafe ✓' : 'BEKLENMEDİK']);
}

console.log('\n01 // CONTRAST\n' + '─'.repeat(68));
for (const r of rows) console.log(' ' + r.join('  '));
console.log('─'.repeat(68));
console.log(
  `${failed === 0 ? 'PASS' : 'FAIL'} · ${rows.length} pairs · ${failed} failing · ` +
  new Date().toISOString().slice(0, 16).replace('T', ' ') + 'Z\n'
);

process.exit(failed === 0 ? 0 : 1);
