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
import { contrast as ratio, AA_BODY as BODY, AA_UI as UI } from './lib/color.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { tokens } = JSON.parse(
  readFileSync(resolve(ROOT, 'tokens/dist/tokens.resolved.json'), 'utf8')
);

/* ---------- the contract ----------------------------------------------- */

/** [foreground, background, required, label, themes?]
 *  `themes` pins a pair to one theme — some pairs only exist in one
 *  (mint on obsidian is a light-theme inverse panel; in dark, bg-inverse
 *  is bone and the pair is meaningless). */
const PAIRS = [
  ['text',         'bg',         BODY, 'body text'],
  ['text',         'bg-raised',  BODY, 'body text on raised'],
  ['text-muted',   'bg',         BODY, 'secondary text'],
  ['text-muted',   'bg-raised',  BODY, 'secondary text on raised'],
  ['text-accent',  'bg',         BODY, 'accent text (mint-700)'],
  ['text-accent',  'bg-raised',  BODY, 'accent text on raised'],
  ['text-inverse', 'bg-inverse', BODY, 'inverse text'],
  ['accent',       'bg-inverse', BODY, 'mint-500 on obsidian', ['light']],
  ['danger',       'bg',         BODY, 'error text'],
  ['warn',         'bg',         BODY, 'warning text'],
  ['info',         'bg',         BODY, 'info text'],
  ['accent-ui',    'bg',         UI,   'meaning-bearing mint icon/rule'],
  ['accent-ui',    'bg-raised',  UI,   'meaning-bearing mint on raised'],
  ['border-strong','bg',         UI,   'structural rule'],
  ['focus',        'bg',         UI,   'focus ring'],
  ['focus',        'bg-raised',  UI,   'focus ring on raised'],
];

/** Known-bad tokens that must NOT be used for body text. Documented as guards
 *  so a future palette edit can't quietly make them look safe. */
const GUARDS = [
  ['color-steel-500', 'color-bone-200', BODY, 'steel-500 banned as body text'],
  ['color-mint-500',  'color-bone-200', BODY, 'mint-500 banned as text on bone'],
  ['color-mint-600',  'color-bone-200', BODY, 'mint-600 banned as text on bone'],
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
             r.toFixed(2).padStart(6), stillUnsafe ? 'unsafe ✓' : 'UNEXPECTEDLY SAFE']);
}

console.log('\n01 // CONTRAST\n' + '─'.repeat(68));
for (const r of rows) console.log(' ' + r.join('  '));
console.log('─'.repeat(68));
console.log(
  `${failed === 0 ? 'PASS' : 'FAIL'} · ${rows.length} pairs · ${failed} failing · ` +
  new Date().toISOString().slice(0, 16).replace('T', ' ') + 'Z\n'
);

process.exit(failed === 0 ? 0 : 1);
