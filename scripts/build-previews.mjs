#!/usr/bin/env node
/**
 * Swiss Neo-Monolith — preview generator.
 *
 *   node scripts/build-previews.mjs
 *
 * Renders the repository's visual showcase straight from the tokens, in both
 * themes, into preview/. Because every colour, size and contrast figure is read
 * from tokens/dist/tokens.resolved.json, the showcase cannot drift from the
 * system it documents — change a token, rerun, and the images follow.
 *
 * SIZING MATTERS. GitHub renders README content in a column of roughly 880px and
 * scales anything wider down, shrinking type with it. These sheets are therefore
 * authored at 880 so they render 1:1 and stay legible. The social card is the one
 * exception: it is authored at 1280x640 because that is what GitHub's Open Graph
 * slot expects, and its type is sized to survive being thumbnailed.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrast } from './lib/color.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'preview');

const { $meta, tokens } = JSON.parse(
  readFileSync(resolve(ROOT, 'tokens/dist/tokens.resolved.json'), 'utf8')
);

const REV = $meta.version;
// Deliberately NOT new Date(): the generated SVGs are committed and CI verifies
// that a rebuild reproduces them byte for byte.
const DATE = $meta.updated;

/* ---------- constants --------------------------------------------------- */

const README_W = 880;     // GitHub's README content column
const SOCIAL_W = 1280;
const SOCIAL_H = 640;

const SANS = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'JetBrains Mono', SFMono-Regular, Menlo, Consolas, monospace";

/** JetBrains Mono advances at 0.6em; close enough for every fallback in the
 *  stack, and enough to keep generated columns aligned without measuring. */
const monoW = (s, size, track = 0.08) => s.length * (size * 0.6 + size * track);

const t = (name, theme) => tokens[name][theme];

const palette = (theme) => ({
  bg: t('bg', theme),
  raised: t('bg-raised', theme),
  sunken: t('bg-sunken', theme),
  inverse: t('bg-inverse', theme),
  text: t('text', theme),
  muted: t('text-muted', theme),
  textInverse: t('text-inverse', theme),
  accent: t('accent', theme),
  accentUi: t('accent-ui', theme),
  accentText: t('text-accent', theme),
  strong: t('border-strong', theme),
  danger: t('danger', theme),
});

/* ---------- primitives -------------------------------------------------- */

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function text(content, o = {}) {
  const {
    x = 0, y = 0, size = 13, weight = 400, fill = '#000',
    mono = true, anchor = 'start', track = mono ? 0.08 : 0, len,
  } = o;
  const a = [
    `x="${x}"`, `y="${y}"`,
    `font-family="${mono ? MONO : SANS}"`,
    `font-size="${size}"`, `font-weight="${weight}"`,
    `letter-spacing="${(size * track).toFixed(2)}"`,
    `fill="${fill}"`,
  ];
  if (anchor !== 'start') a.push(`text-anchor="${anchor}"`);
  // textLength pins a string to an exact width, so a missing Inter can never
  // push it past a rule.
  if (len) a.push(`textLength="${len}"`, 'lengthAdjust="spacing"');
  return `<text ${a.join(' ')}>${esc(content)}</text>`;
}

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"` +
  (o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 2}"` : '') +
  (o.opacity != null ? ` fill-opacity="${o.opacity}"` : '') +
  ' shape-rendering="crispEdges"/>';

const line = (x1, y1, x2, y2, stroke, sw = 1, opacity = 1) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}"` +
  ` stroke-width="${sw}" stroke-opacity="${opacity}" shape-rendering="crispEdges"/>`;

/** Every sheet is framed identically: CAD index above, telemetry strip below. */
function sheet({ h, theme, index, title, right, body, w = README_W, m = 32 }) {
  const c = palette(theme);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
${rect(0, 0, w, h, c.bg)}
${text(index, { x: m, y: 34, size: 13, weight: 700, fill: c.accentText })}
${text(title.toUpperCase(), { x: m + monoW(index, 13) + 10, y: 34, size: 13, weight: 700, fill: c.muted })}
${text(right, { x: w - m, y: 34, size: 13, weight: 700, fill: c.muted, anchor: 'end' })}
${line(m, 48, w - m, 48, c.strong, 1, 0.2)}
${body}
${line(m, h - 38, w - m, h - 38, c.strong, 1, 0.2)}
${text('OKAN ÖZTÜRK', { x: m, y: h - 16, size: 12, fill: c.muted })}
${text(`REV ${REV} · ${DATE}`, { x: w - m, y: h - 16, size: 12, weight: 700, fill: c.accentText, anchor: 'end' })}
</svg>
`;
}

/* ---------- 00 // BANNER (README hero) ---------------------------------- */

function banner(theme) {
  const c = palette(theme);
  const M = 32, W = README_W, h = 236;
  const split = M + Math.round((W - M * 2) * 0.4);
  const wordW = split - M - 52;

  const body = [
    line(split, 48, split, h - 38, c.strong, 1, 0.2),

    // Signature mark: the mint bar spans both wordmark lines, cap to baseline.
    rect(M, 76, 4, 62, c.accent),
    text('SWISS', { x: M + 20, y: 104, size: 34, weight: 800, mono: false, track: -0.035, fill: c.text }),
    text('NEO-MONOLITH', { x: M + 20, y: 138, size: 34, weight: 800, mono: false, track: -0.035, fill: c.text, len: wordW }),
    text('A cross-medium design system', { x: M + 20, y: 164, size: 13, mono: false, fill: c.muted }),

    ...[
      ['C01', 'Zero radius'],
      ['C02', 'CAD indexing'],
      ['C03', 'One accent'],
      ['C04', 'Rules, not shadows'],
      ['C05', 'Telemetry colophon'],
      ['C06', 'Asymmetry'],
    ].flatMap(([code, label], i) => {
      const x = split + 28 + (i % 2) * 250;
      const y = 78 + Math.floor(i / 2) * 30;
      return [
        text(code, { x, y, size: 13, weight: 700, fill: c.accentText }),
        text(label, { x: x + 46, y, size: 13, weight: 700, fill: c.muted }),
      ];
    }),

    rect(split + 28, 168, 8, 8, c.accentUi),
    text('SEVEN MEDIA, ONE LANGUAGE', { x: split + 48, y: 176, size: 13, weight: 700, fill: c.accentText }),
  ].join('\n');

  return sheet({ h, theme, index: '00 //', title: 'Design system', right: `REV ${REV}`, body });
}

/* ---------- SOCIAL CARD (Open Graph, 1280x640) -------------------------- */

function social(theme) {
  const c = palette(theme);
  const M = 80, W = SOCIAL_W, H = SOCIAL_H;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Swiss Neo-Monolith">
<title>Swiss Neo-Monolith</title>
${rect(0, 0, W, H, c.bg)}
${line(M, 128, W - M, 128, c.strong, 1, 0.2)}
${line(M, H - 128, W - M, H - 128, c.strong, 1, 0.2)}
${text('00 //', { x: M, y: 96, size: 22, weight: 700, fill: c.accentText })}
${text('DESIGN SYSTEM', { x: M + 92, y: 96, size: 22, weight: 700, fill: c.muted })}
${text(`REV ${REV}`, { x: W - M, y: 96, size: 22, weight: 700, fill: c.muted, anchor: 'end' })}

${rect(M, 210, 8, 168, c.accent)}
${text('SWISS', { x: M + 40, y: 288, size: 92, weight: 800, mono: false, track: -0.04, fill: c.text })}
${text('NEO-MONOLITH', { x: M + 40, y: 380, size: 92, weight: 800, mono: false, track: -0.04, fill: c.text, len: 700 })}
${text('One design language — web, applications, print, office, terminal.', { x: M + 40, y: 432, size: 26, mono: false, fill: c.muted })}

${text('OKAN ÖZTÜRK · JOXINYKS.COM', { x: M, y: H - 84, size: 22, fill: c.muted })}
${text('STATUS: OPERATIONAL', { x: W - M, y: H - 84, size: 22, weight: 700, fill: c.accentText, anchor: 'end' })}
</svg>
`;
}

/* ---------- 01 // MEDIA (2x2 so the panels stay legible) ---------------- */

function media(theme) {
  const c = palette(theme);
  const M = 32, W = README_W, gap = 16;
  const pw = Math.floor((W - M * 2 - gap) / 2);
  const ph = 190;
  const out = [];

  const head = (x, y, n, name) =>
    text(n, { x, y, size: 12, weight: 700, fill: c.accentText }) +
    text(name, { x: x + 28, y, size: 12, weight: 700, fill: c.muted });

  // 01 WEB
  let x = M, y = 82;
  out.push(head(x, y - 10, '01', 'WEB'), rect(x, y, pw, ph, c.raised, { stroke: c.strong, sw: 2 }));
  out.push(
    rect(x, y, pw, 24, c.inverse),
    text('OKAN ÖZTÜRK', { x: x + 12, y: y + 16, size: 10, weight: 700, fill: c.textInverse }),
    rect(x + 16, y + 46, 4, 42, c.accent),
    text('Interface systems', { x: x + 30, y: y + 72, size: 20, weight: 800, mono: false, fill: c.text }),
    rect(x + 30, y + 88, 96, 26, c.inverse),
    text('CONTACT', { x: x + 78, y: y + 105, size: 10, weight: 700, fill: c.textInverse, anchor: 'middle' }),
    ...[0, 1, 2].map((i) => line(x + 16, y + 134 + i * 14, x + pw - 30 + i * 10, y + 134 + i * 14, c.strong, 1, 0.18)),
    line(x, y + ph - 26, x + pw, y + ph - 26, c.strong, 2),
    text(`REV ${REV}`, { x: x + 12, y: y + ph - 9, size: 10, fill: c.muted }),
    text('OPERATIONAL', { x: x + pw - 12, y: y + ph - 9, size: 10, weight: 700, fill: c.accentText, anchor: 'end' }),
  );

  // 02 PRINT
  x = M + pw + gap;
  out.push(head(x, y - 10, '02', 'PRINT & PDF'), rect(x, y, pw, ph, '#ffffff', { stroke: c.strong, sw: 2 }));
  const ps = x + Math.round(pw * 0.4);
  out.push(
    text('03 // FINANCIALS', { x: x + 14, y: y + 22, size: 10, weight: 700, fill: '#4b5563' }),
    text(`REV ${REV}`, { x: x + pw - 14, y: y + 22, size: 10, weight: 700, fill: '#4b5563', anchor: 'end' }),
    line(x + 14, y + 30, x + pw - 14, y + 30, '#121316', 1, 0.35),
    text('Quarterly report', { x: x + 14, y: y + 62, size: 17, weight: 800, mono: false, fill: '#121316' }),
    line(ps, y + 42, ps, y + ph - 34, '#121316', 1, 0.2),
    ...[0, 1, 2, 3, 4].map((i) => line(ps + 14, y + 54 + i * 16, x + pw - 14 - (i % 3) * 16, y + 54 + i * 16, '#121316', 1, 0.3)),
    line(x + 14, y + ph - 26, x + pw - 14, y + ph - 26, '#121316', 1, 0.35),
    text(`OKAN ÖZTÜRK · ${DATE}`, { x: x + 14, y: y + ph - 9, size: 10, fill: '#4b5563' }),
    text('03 / 12', { x: x + pw - 14, y: y + ph - 9, size: 10, weight: 700, fill: '#121316', anchor: 'end' }),
  );

  // 03 SLIDE
  x = M; y = 82 + ph + 42;
  out.push(head(x, y - 10, '03', 'SLIDE'), rect(x, y, pw, ph, '#121316', { stroke: c.strong, sw: 2 }));
  out.push(
    text('SECTION 03 / 07', { x: x + 14, y: y + 24, size: 10, weight: 700, fill: '#9ca3af' }),
    text('03', { x: x + 14, y: y + 108, size: 64, weight: 800, mono: false, fill: '#10b981' }),
    rect(x + 14, y + 124, pw - 28, 2, '#10b981'),
    text('Financials', { x: x + 14, y: y + 154, size: 20, weight: 800, mono: false, fill: '#f2f4f3' }),
    line(x + 14, y + ph - 26, x + pw - 14, y + ph - 26, '#f2f4f3', 1, 0.15),
    text('OKAN ÖZTÜRK', { x: x + 14, y: y + ph - 9, size: 10, fill: '#9ca3af' }),
    text('03 / 24', { x: x + pw - 14, y: y + ph - 9, size: 10, weight: 700, fill: '#6ee7b7', anchor: 'end' }),
  );

  // 04 TERMINAL
  x = M + pw + gap;
  out.push(head(x, y - 10, '04', 'TERMINAL'), rect(x, y, pw, ph, c.inverse, { stroke: c.strong, sw: 2 }));
  [
    ['01 // BUILD', '#9ca3af', 700],
    ['● tokens        110', '#10b981', 400],
    ['● contrast       34', '#10b981', 400],
    ['◐ previews    12/12', '#f2f4f3', 400],
    ['████████████  100%', '#10b981', 400],
    ['DONE · 1.24s', '#6b7280', 400],
  ].forEach(([s, fill, weight], i) => {
    out.push(text(s, { x: x + 14, y: y + 30 + i * 24, size: 12, weight, fill }));
  });
  out.push(line(x + 14, y + ph - 26, x + pw - 14, y + ph - 26, '#f2f4f3', 1, 0.15));

  const h = y + ph + 68;
  out.push(text('Same canon in four media: zero radius, CAD index, one accent, rules not shadows, telemetry.',
    { x: M, y: y + ph + 30, size: 12, fill: c.muted }));

  return sheet({ h, theme, index: '01 //', title: 'One language, seven media', right: 'C01 – C06', body: out.join('\n') });
}

/* ---------- 02 // COMPONENTS -------------------------------------------- */

function components(theme) {
  const c = palette(theme);
  const M = 32, W = README_W;
  const out = [];
  const lab = (s, x, y) => text(s, { x, y, size: 12, weight: 700, fill: c.muted });

  const btn = (x, y, w, hh, bg, fg, s, pressed) => {
    const d = pressed ? 2 : 0;
    return (pressed ? '' : rect(x + 2, y + 2, w, hh, c.strong)) +
      rect(x + d, y + d, w, hh, bg, { stroke: c.strong, sw: 2 }) +
      text(s, { x: x + d + w / 2, y: y + d + hh / 2 + 4, size: 12, weight: 700, fill: fg, anchor: 'middle' });
  };

  lab('BUTTONS · the press sinks into its own offset shadow', M, 76);
  out.push(
    lab('BUTTONS · press sinks into its own offset shadow', M, 76),
    btn(M, 88, 150, 40, c.inverse, c.textInverse, 'PRIMARY'),
    btn(M + 168, 88, 150, 40, c.bg, c.text, 'SECONDARY'),
    btn(M + 336, 88, 150, 40, c.inverse, c.textInverse, 'PRESSED', true),
  );

  lab('FOCUS RING', M + 512, 76);
  out.push(
    lab('FOCUS RING', M + 512, 76),
    rect(M + 516, 92, 272, 32, c.raised, { stroke: c.strong, sw: 2 }),
    `<rect x="${M + 512}" y="${88}" width="280" height="40" fill="none" stroke="${c.accentText}" stroke-width="2" shape-rendering="crispEdges"/>`,
    text('name@domain.com', { x: M + 528, y: 113, size: 12, fill: c.text }),
  );

  // KPI
  out.push(
    lab('KPI TILE', M, 172),
    rect(M, 184, 236, 96, c.raised, { stroke: c.strong, sw: 2 }),
    text('TOTAL REVENUE', { x: M + 16, y: 208, size: 12, weight: 700, fill: c.muted }),
    text('12.500,00 ₺', { x: M + 16, y: 244, size: 26, weight: 700, fill: c.text }),
    text('▲ 12.4%  vs Q3', { x: M + 16, y: 266, size: 12, weight: 700, fill: c.accentText }),
  );

  // status + progress
  out.push(
    lab('STATUS · the only round shape', M + 268, 172),
    `<circle cx="${M + 274}" cy="${200}" r="5" fill="${c.accent}"/>`,
    text('OPERATIONAL', { x: M + 290, y: 205, size: 13, weight: 700, fill: c.text }),
    lab('PROGRESS · no spinners, no rounded caps', M + 268, 240),
    rect(M + 268, 252, 236, 4, c.strong, { opacity: 0.18 }),
    rect(M + 268, 252, 146, 4, c.accent),
    text('62%', { x: M + 268, y: 276, size: 12, fill: c.muted }),
  );

  // table
  const tx = M + 540;
  out.push(
    lab('TABLE · no zebra, rules only', tx, 172),
    text('IDX', { x: tx, y: 200, size: 12, weight: 700, fill: c.muted }),
    text('METRIC', { x: tx + 48, y: 200, size: 12, weight: 700, fill: c.muted }),
    text('VALUE', { x: tx + 248, y: 200, size: 12, weight: 700, fill: c.muted, anchor: 'end' }),
    line(tx, 208, tx + 248, 208, c.strong, 2),
  );
  [['01', 'TOKENS', '110'], ['02', 'PAIRS', '034'], ['03', 'MEDIA', '007']].forEach(([i, k, v], n) => {
    const y = 230 + n * 24;
    out.push(
      text(i, { x: tx, y, size: 12, fill: c.accentText }),
      text(k, { x: tx + 48, y, size: 12, fill: c.text }),
      text(v, { x: tx + 248, y, size: 12, fill: c.text, anchor: 'end' }),
      line(tx, y + 8, tx + 248, y + 8, c.strong, 1, 0.18),
    );
  });

  return sheet({ h: 340, theme, index: '02 //', title: 'Components', right: 'RADIUS 0 · NO BLUR', body: out.join('\n') });
}

/* ---------- 03 // COLOUR ------------------------------------------------- */

function paletteSheet(theme) {
  const c = palette(theme);
  const M = 32, W = README_W, gap = 16;
  const groups = [
    ['BONE', ['color-bone-50', 'color-bone-200', 'color-bone-300', 'color-bone-400']],
    ['OBSIDIAN', ['color-obsidian-900', 'color-obsidian-800', 'color-obsidian-700', 'color-obsidian-600']],
    ['MINT', ['color-mint-300', 'color-mint-500', 'color-mint-600', 'color-mint-700']],
    ['STEEL', ['color-steel-400', 'color-steel-500', 'color-steel-600', 'color-steel-700']],
    ['SIGNAL', ['danger', 'warn', 'info']],
  ];
  const sw = Math.floor((W - M * 2 - gap * 3) / 4);
  let y = 84;
  const out = [];

  for (const [label, names] of groups) {
    out.push(text(label, { x: M, y: y - 8, size: 12, weight: 700, fill: c.muted }));
    names.forEach((name, i) => {
      const x = M + i * (sw + gap);
      const hex = t(name, theme);
      const r = contrast(hex, c.bg);
      // Each swatch states the rule that governs it, computed at build time.
      const verdict = r >= 4.5 ? 'AA text' : r >= 3 ? 'AA non-text' : 'fill only';
      out.push(
        rect(x, y, sw, 44, hex, { stroke: c.strong, sw: 2 }),
        text(name.replace(/^color-/, ''), { x, y: y + 62, size: 12, weight: 700, fill: c.text }),
        text(hex.toUpperCase(), { x, y: y + 78, size: 12, fill: c.muted }),
        text(`${r.toFixed(2)}:1 ${verdict}`, { x, y: y + 94, size: 12, fill: r >= 3 ? c.accentText : c.muted }),
      );
    });
    y += 128;
  }

  out.push(text('Contrast measured against this sheet\'s background, at build time — not typed by hand.',
    { x: M, y: y - 12, size: 12, fill: c.muted }));

  return sheet({
    h: y + 28, theme, index: '03 //', title: 'Colour',
    right: `vs ${c.bg.toUpperCase()}`, body: out.join('\n'),
  });
}

/* ---------- 04 // TYPOGRAPHY --------------------------------------------- */

function typeSheet(theme) {
  const c = palette(theme);
  const M = 32, W = README_W;
  const split = M + Math.round((W - M * 2) * 0.4);
  const steps = [
    ['4XL', 56, 'Hero', 40], ['3XL', 40, 'H1', 32], ['2XL', 32, 'H2', 27],
    ['XL', 24, 'H3', 22], ['BASE', 16, 'Body', 16], ['SM', 14, 'Secondary', 14],
  ];
  let y = 86;
  const out = [];

  for (const [name, size, role, shown] of steps) {
    out.push(
      text(name, { x: M, y, size: 12, weight: 700, fill: c.accentText }),
      text(`${size}px`, { x: M + 62, y, size: 12, fill: c.muted }),
      text(role, { x: M + 124, y, size: 12, fill: c.muted }),
      text('Structure before decoration', {
        x: split, y: y + 4, size: shown, weight: size <= 16 ? 400 : 700,
        mono: false, track: -0.03, fill: c.text,
      }),
      line(M, y + 20, W - M, y + 20, c.strong, 1, 0.15),
    );
    y += shown + 28;
  }

  out.push(
    text('SANS — NARRATIVE', { x: M, y: y + 22, size: 12, weight: 700, fill: c.muted }),
    text('Anything a person wrote.', { x: M, y: y + 48, size: 19, weight: 700, mono: false, fill: c.text }),
    text('MONO — SYSTEM', { x: split, y: y + 22, size: 12, weight: 700, fill: c.muted }),
    text('2026-08-09  03/12', { x: split, y: y + 48, size: 17, weight: 700, fill: c.text }),
    text('Anything a machine produced.', { x: split, y: y + 68, size: 12, fill: c.muted }),
  );

  return sheet({
    h: y + 108, theme, index: '04 //', title: 'Typography',
    right: 'INTER · JETBRAINS MONO', body: out.join('\n'),
  });
}

/* ---------- write -------------------------------------------------------- */

mkdirSync(OUT, { recursive: true });

const sheets = { banner, social, media, components, palette: paletteSheet, type: typeSheet };

let n = 0;
for (const [name, fn] of Object.entries(sheets)) {
  for (const theme of ['light', 'dark']) {
    writeFileSync(resolve(OUT, `${name}-${theme}.svg`), fn(theme), 'utf8');
    console.log(`  wrote preview/${name}-${theme}.svg`);
    n++;
  }
}
console.log(`\nSwiss Neo-Monolith v${REV} — ${n} sheets generated at ${README_W}px (social at ${SOCIAL_W}x${SOCIAL_H}).`);
