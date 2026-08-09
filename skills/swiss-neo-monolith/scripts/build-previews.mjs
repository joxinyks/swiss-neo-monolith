#!/usr/bin/env node
/**
 * Swiss Neo-Monolith — preview generator.
 *
 *   node scripts/build-previews.mjs
 *
 * Renders the repository's visual showcase straight from the tokens, in both
 * themes, into .github/preview/. Because every colour, size and contrast figure
 * is read from tokens.resolved.json, the showcase cannot drift from the system
 * it documents — change a token, rerun, and the images follow.
 *
 * Everything is laid out on the same 4px scale and 40/60 split the system
 * mandates, so the images are also a working proof of the canon.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrast } from './lib/color.mjs';

const SKILL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = resolve(SKILL, '../..');
const OUT = resolve(REPO, '.github/preview');

const { $meta, tokens } = JSON.parse(
  readFileSync(resolve(SKILL, 'tokens/dist/tokens.resolved.json'), 'utf8')
);

const REV = $meta.version;
// Deliberately NOT new Date(): the generated SVGs are committed, and CI verifies
// that a rebuild reproduces them byte for byte. A wall-clock date would make the
// output differ on every run and the drift check meaningless.
const DATE = $meta.updated;

/* ---------- layout constants ------------------------------------------- */

const W = 1200;
const M = 64;                       // outer margin — space-8
const INNER = W - M * 2;            // 1072
const SPLIT = M + Math.round(INNER * 0.4);  // SNM-CANON-06: the 40/60 line

const SANS = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'JetBrains Mono', SFMono-Regular, Menlo, Consolas, monospace";

/** Monospace advance is predictable; this is how the generator keeps columns
 *  aligned without measuring text in a browser. 0.6em is the JetBrains Mono
 *  advance and a close-enough match for every fallback in the stack. */
const monoW = (s, size, track = 0.08) => s.length * (size * 0.6 + size * track);

/* ---------- primitives -------------------------------------------------- */

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function text(content, o = {}) {
  const {
    x = 0, y = 0, size = 13, weight = 400, fill = '#000',
    mono = true, anchor = 'start', track = mono ? 0.08 : 0, len, opacity,
  } = o;
  const attrs = [
    `x="${x}"`, `y="${y}"`,
    `font-family="${mono ? MONO : SANS}"`,
    `font-size="${size}"`, `font-weight="${weight}"`,
    `letter-spacing="${(size * track).toFixed(2)}"`,
    `fill="${fill}"`,
  ];
  if (anchor !== 'start') attrs.push(`text-anchor="${anchor}"`);
  if (opacity != null) attrs.push(`fill-opacity="${opacity}"`);
  // textLength pins a string to an exact width so a missing Inter can never
  // push it past a rule. This is what the hand-written banner got wrong.
  if (len) attrs.push(`textLength="${len}"`, 'lengthAdjust="spacing"');
  return `<text ${attrs.join(' ')}>${esc(content)}</text>`;
}

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"` +
  (o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 2}"` : '') +
  (o.opacity != null ? ` fill-opacity="${o.opacity}"` : '') +
  ' shape-rendering="crispEdges"/>';

const line = (x1, y1, x2, y2, stroke, sw = 1, opacity = 1) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}"` +
  ` stroke-width="${sw}" stroke-opacity="${opacity}" shape-rendering="crispEdges"/>`;

/** Frame every panel identically: CAD index above, telemetry strip below. */
function doc({ h, theme, title, index, body, right }) {
  const c = palette(theme);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
${rect(0, 0, W, h, c.bg)}
${text(index, { x: M, y: 44, size: 13, weight: 700, fill: c.accentText })}
${text(title.toUpperCase(), { x: M + monoW(index, 13) + 12, y: 44, size: 13, weight: 700, fill: c.muted })}
${text(right ?? `REV ${REV}`, { x: W - M, y: 44, size: 13, weight: 700, fill: c.muted, anchor: 'end' })}
${line(M, 64, W - M, 64, c.line, 1, 0.15)}
${body}
${line(M, h - 44, W - M, h - 44, c.line, 1, 0.15)}
${text('OKAN ÖZTÜRK · JOXINYKS.COM', { x: M, y: h - 20, size: 12, fill: c.muted })}
${text(`${DATE} · STATUS: OPERATIONAL`, { x: W - M, y: h - 20, size: 12, weight: 700, fill: c.accentText, anchor: 'end' })}
</svg>
`;
}

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
  line: t('border-strong', theme),
  strong: t('border-strong', theme),
  danger: t('danger', theme),
});

/* ---------- 00 // BANNER ------------------------------------------------ */

function banner(theme) {
  const c = palette(theme);
  const h = 300;
  const wordW = SPLIT - M - 40;        // 40% column minus the mint bar and gutter
  const barX = M, barW = 4;
  const l1 = 148, l2 = 200;            // wordmark baselines, on the 4px scale

  const reach = [
    ['01', 'WEB'], ['02', 'APPLICATIONS'], ['03', 'PRINT & PDF'],
    ['04', 'OFFICE'], ['05', 'TERMINAL'], ['06', 'DATA VISUALIZATION'],
    ['07', 'BRAND ASSETS'],
  ];
  const colX = [SPLIT + 40, SPLIT + 320];
  const rows = reach.map(([n, label], i) => {
    const col = i < 4 ? 0 : 1;
    const row = i < 4 ? i : i - 4;
    const x = colX[col], y = 112 + row * 26;
    return text(n, { x, y, size: 13, weight: 700, fill: c.accentText }) +
           text(label, { x: x + 34, y, size: 13, weight: 700, fill: c.muted });
  }).join('\n');

  const body = [
    // The 40/60 divider is drawn, and the wordmark is pinned to never cross it.
    line(SPLIT, 64, SPLIT, h - 44, c.line, 1, 0.15),

    // Signature mark: the mint bar spans BOTH wordmark lines, cap to baseline.
    rect(barX, l1 - 38, barW, l2 - l1 + 38, c.accent),

    text('SWISS', {
      x: barX + 24, y: l1, size: 46, weight: 800, mono: false,
      track: -0.035, fill: c.text,
    }),
    text('NEO-MONOLITH', {
      x: barX + 24, y: l2, size: 46, weight: 800, mono: false,
      track: -0.035, fill: c.text, len: wordW,
    }),
    text('A cross-medium design system', {
      x: barX + 24, y: l2 + 34, size: 14, weight: 400, mono: false,
      fill: c.muted,
    }),

    rows,
    rect(colX[1], 178, 8, 8, c.accentUi),
    text('ONE LANGUAGE', { x: colX[1] + 20, y: 186, size: 13, weight: 700, fill: c.accentText }),
  ].join('\n');

  return doc({
    h, theme, index: '00 //', title: 'Design system', body,
    right: `REV ${REV}`,
  });
}

/* ---------- 01 // PALETTE ----------------------------------------------- */

function paletteSheet(theme) {
  const c = palette(theme);
  const groups = [
    ['BONE',     ['color-bone-50', 'color-bone-100', 'color-bone-200', 'color-bone-300', 'color-bone-400']],
    ['OBSIDIAN', ['color-obsidian-900', 'color-obsidian-800', 'color-obsidian-700', 'color-obsidian-600']],
    ['MINT',     ['color-mint-300', 'color-mint-500', 'color-mint-600', 'color-mint-700', 'color-mint-800']],
    ['STEEL',    ['color-steel-200', 'color-steel-400', 'color-steel-500', 'color-steel-600', 'color-steel-700']],
    ['SIGNAL',   ['danger', 'warn', 'info']],
  ];

  const sw = 196, gap = 24, swH = 72;
  let y = 104;
  const out = [];

  for (const [label, names] of groups) {
    out.push(text(label, { x: M, y: y - 12, size: 12, weight: 700, fill: c.muted }));
    names.forEach((name, i) => {
      const x = M + i * (sw + gap);
      const hex = t(name, theme);
      const r = contrast(hex, c.bg);
      // Every swatch states its own contrast against this sheet's background —
      // the rule that governs whether it may carry text.
      const verdict = r >= 4.5 ? 'AA text' : r >= 3 ? 'AA non-text' : 'fill only';
      out.push(
        rect(x, y, sw, swH, hex, { stroke: c.strong, sw: 2 }),
        text(name.replace(/^color-/, ''), { x, y: y + swH + 20, size: 12, weight: 700, fill: c.text }),
        text(hex.toUpperCase(), { x, y: y + swH + 38, size: 12, fill: c.muted }),
        text(`${r.toFixed(2)}:1  ${verdict}`, { x, y: y + swH + 56, size: 12, fill: r >= 3 ? c.accentText : c.muted }),
      );
    });
    y += swH + 96;
  }

  return doc({
    h: y + 12, theme, index: '01 //', title: 'Colour tokens',
    body: out.join('\n'), right: `CONTRAST vs ${c.bg.toUpperCase()}`,
  });
}

/* ---------- 02 // TYPOGRAPHY -------------------------------------------- */

function typeSheet(theme) {
  const c = palette(theme);
  const steps = [
    ['5xl', 72, 'Display'], ['4xl', 56, 'Hero'], ['3xl', 40, 'H1'],
    ['2xl', 32, 'H2'], ['xl', 24, 'H3'], ['lg', 18, 'Lede'],
    ['base', 16, 'Body'], ['sm', 14, 'Secondary'],
  ];
  let y = 116;
  const out = [];

  for (const [name, size, role] of steps) {
    const shown = Math.min(size, 44);   // clamp so the sheet stays one page
    out.push(
      text(name.toUpperCase(), { x: M, y, size: 12, weight: 700, fill: c.accentText }),
      text(`${size}px`, { x: M + 70, y, size: 12, fill: c.muted }),
      text(role, { x: M + 140, y, size: 12, fill: c.muted }),
      text('Structure before decoration', {
        x: SPLIT, y: y + 4, size: shown, weight: name === 'base' || name === 'sm' ? 400 : 700,
        mono: false, track: -0.03, fill: c.text,
      }),
      line(M, y + 24, W - M, y + 24, c.line, 1, 0.15),
    );
    y += Math.max(shown + 34, 56);
  }

  // The two-family contract, stated as a specimen.
  out.push(
    text('SANS — NARRATIVE', { x: M, y: y + 24, size: 12, weight: 700, fill: c.muted }),
    text('Anything a person wrote.', { x: M, y: y + 52, size: 22, weight: 700, mono: false, fill: c.text }),
    text('MONO — SYSTEM', { x: SPLIT, y: y + 24, size: 12, weight: 700, fill: c.muted }),
    text('2026-08-09  12.500,00 ₺  03/12', { x: SPLIT, y: y + 52, size: 18, weight: 700, fill: c.text }),
    text('Anything a machine produced.', { x: SPLIT, y: y + 76, size: 13, fill: c.muted }),
  );

  return doc({
    h: y + 128, theme, index: '02 //', title: 'Typography',
    body: out.join('\n'), right: 'INTER · JETBRAINS MONO',
  });
}

/* ---------- 03 // COMPONENTS -------------------------------------------- */

function components(theme) {
  const c = palette(theme);
  const out = [];
  const label = (s, x, y) => text(s, { x, y, size: 12, weight: 700, fill: c.muted });

  // -- buttons, including the signature press state ------------------------
  label('BUTTONS', M, 100);
  const btn = (x, y, w, hgt, bg, fg, txtStr, pressed) => {
    const dx = pressed ? 2 : 0;
    return (pressed ? '' : rect(x + 2, y + 2, w, hgt, c.strong)) +
      rect(x + dx, y + dx, w, hgt, bg, { stroke: c.strong, sw: 2 }) +
      text(txtStr, { x: x + dx + w / 2, y: y + dx + hgt / 2 + 4, size: 12, weight: 700, fill: fg, anchor: 'middle' });
  };
  out.push(
    btn(M, 116, 168, 44, c.inverse, c.textInverse, 'PRIMARY'),
    btn(M + 192, 116, 168, 44, c.bg, c.text, 'SECONDARY'),
    btn(M + 384, 116, 168, 44, c.inverse, c.textInverse, 'PRESSED', true),
    text('Pressed sinks into its own offset shadow — the tactile signature.', {
      x: M, y: 184, size: 12, fill: c.muted,
    }),
  );

  // -- input ---------------------------------------------------------------
  label('INPUT', M, 232);
  out.push(
    rect(M, 248, 360, 44, c.raised, { stroke: c.strong, sw: 2 }),
    text('name@domain.com', { x: M + 16, y: 276, size: 13, fill: c.muted }),
    label('FOCUS RING', M + 400, 232),
    rect(M + 400, 248, 360, 44, c.raised, { stroke: c.strong, sw: 2 }),
    `<rect x="${M + 396}" y="${244}" width="368" height="52" fill="none" stroke="${c.accentText}" stroke-width="2" shape-rendering="crispEdges"/>`,
    text('name@domain.com', { x: M + 416, y: 276, size: 13, fill: c.text }),
  );

  // -- KPI tile ------------------------------------------------------------
  label('KPI', M, 340);
  out.push(
    rect(M, 356, 300, 116, c.raised, { stroke: c.strong, sw: 2 }),
    text('TOTAL REVENUE', { x: M + 20, y: 384, size: 12, weight: 700, fill: c.muted }),
    text('12.500,00 ₺', { x: M + 20, y: 424, size: 30, weight: 700, fill: c.text }),
    text('▲ 12.4%  vs Q3', { x: M + 20, y: 450, size: 12, weight: 700, fill: c.accentText }),
  );

  // -- status + progress ---------------------------------------------------
  label('STATUS', M + 340, 340);
  out.push(
    `<circle cx="${M + 346}" cy="${372}" r="5" fill="${c.accent}"/>`,
    text('OPERATIONAL', { x: M + 362, y: 377, size: 13, weight: 700, fill: c.text }),
    text('The only round shape in the system.', { x: M + 340, y: 400, size: 12, fill: c.muted }),
    label('PROGRESS', M + 340, 432),
    rect(M + 340, 444, 300, 4, c.line, { opacity: 0.15 }),
    rect(M + 340, 444, 186, 4, c.accent),
    text('62%  ·  no spinners, no rounded caps', { x: M + 340, y: 468, size: 12, fill: c.muted }),
  );

  // -- table ---------------------------------------------------------------
  label('TABLE', SPLIT + 240, 340);
  const tx = SPLIT + 240;
  const rowsData = [['01', 'TOKENS', '110'], ['02', 'PAIRS', '034'], ['03', 'MEDIA', '007']];
  out.push(
    text('IDX', { x: tx, y: 372, size: 12, weight: 700, fill: c.muted }),
    text('METRIC', { x: tx + 56, y: 372, size: 12, weight: 700, fill: c.muted }),
    text('VALUE', { x: tx + 260, y: 372, size: 12, weight: 700, fill: c.muted, anchor: 'end' }),
    line(tx, 380, tx + 260, 380, c.strong, 2),
  );
  rowsData.forEach(([i, k, v], n) => {
    const y = 404 + n * 26;
    out.push(
      text(i, { x: tx, y, size: 13, fill: c.accentText }),
      text(k, { x: tx + 56, y, size: 13, fill: c.text }),
      text(v, { x: tx + 260, y, size: 13, fill: c.text, anchor: 'end' }),
      line(tx, y + 8, tx + 260, y + 8, c.line, 1, 0.15),
    );
  });

  return doc({
    h: 560, theme, index: '03 //', title: 'Components',
    body: out.join('\n'), right: 'RADIUS 0 · NO BLUR',
  });
}

/* ---------- 04 // MEDIA ------------------------------------------------- */

function media(theme) {
  const c = palette(theme);
  const cols = 4, gap = 24;
  const pw = Math.floor((INNER - gap * (cols - 1)) / cols);
  const py = 116, ph = 300;
  const out = [];

  const head = (x, n, name) => [
    text(n, { x, y: py - 16, size: 12, weight: 700, fill: c.accentText }),
    text(name, { x: x + 30, y: py - 16, size: 12, weight: 700, fill: c.muted }),
  ].join('\n');

  // 01 WEB
  let x = M;
  out.push(head(x, '01', 'WEB'), rect(x, py, pw, ph, c.raised, { stroke: c.strong, sw: 2 }));
  out.push(
    rect(x, py, pw, 26, c.inverse),
    text('OKAN ÖZTÜRK', { x: x + 10, y: py + 17, size: 9, weight: 700, fill: c.textInverse }),
    rect(x + 10, py + 48, 4, 40, c.accent),
    text('Interface', { x: x + 22, y: py + 66, size: 17, weight: 800, mono: false, fill: c.text }),
    text('systems', { x: x + 22, y: py + 86, size: 17, weight: 800, mono: false, fill: c.text }),
    rect(x + 22, py + 104, 84, 24, c.inverse),
    text('CONTACT', { x: x + 64, y: py + 120, size: 9, weight: 700, fill: c.textInverse, anchor: 'middle' }),
    line(x + 10, py + 152, x + pw - 10, py + 152, c.line, 1, 0.15),
    ...[0, 1, 2].map((i) =>
      line(x + 10, py + 172 + i * 16, x + pw - 40 + i * 12, py + 172 + i * 16, c.line, 1, 0.15)),
    line(x, py + ph - 34, x + pw, py + ph - 34, c.strong, 2),
    text('REV ' + REV, { x: x + 10, y: py + ph - 14, size: 9, fill: c.muted }),
    text('OPERATIONAL', { x: x + pw - 10, y: py + ph - 14, size: 9, weight: 700, fill: c.accentText, anchor: 'end' }),
  );

  // 02 PRINT
  x = M + pw + gap;
  out.push(head(x, '02', 'PRINT'), rect(x, py, pw, ph, '#ffffff', { stroke: c.strong, sw: 2 }));
  const psplit = x + Math.round(pw * 0.4);
  out.push(
    text('03 // FINANCIALS', { x: x + 14, y: py + 24, size: 8, weight: 700, fill: '#4b5563' }),
    text('REV ' + REV, { x: x + pw - 14, y: py + 24, size: 8, weight: 700, fill: '#4b5563', anchor: 'end' }),
    line(x + 14, py + 32, x + pw - 14, py + 32, '#121316', 1, 0.35),
    text('Quarterly', { x: x + 14, y: py + 62, size: 14, weight: 800, mono: false, fill: '#121316' }),
    text('report', { x: x + 14, y: py + 80, size: 14, weight: 800, mono: false, fill: '#121316' }),
    line(psplit, py + 44, psplit, py + ph - 44, '#121316', 1, 0.2),
    ...[0, 1, 2, 3, 4, 5].map((i) =>
      line(psplit + 12, py + 52 + i * 15, x + pw - 14 - (i % 3) * 14, py + 52 + i * 15, '#121316', 1, 0.3)),
    line(x + 14, py + ph - 34, x + pw - 14, py + ph - 34, '#121316', 1, 0.35),
    text('OKAN ÖZTÜRK · ' + DATE, { x: x + 14, y: py + ph - 16, size: 8, fill: '#4b5563' }),
    text('03 / 12', { x: x + pw - 14, y: py + ph - 16, size: 8, weight: 700, fill: '#121316', anchor: 'end' }),
  );

  // 03 SLIDE
  x = M + (pw + gap) * 2;
  out.push(head(x, '03', 'SLIDE'), rect(x, py, pw, ph, '#121316', { stroke: c.strong, sw: 2 }));
  out.push(
    text('SECTION 03 / 07', { x: x + 14, y: py + 26, size: 8, weight: 700, fill: '#9ca3af' }),
    text('03', { x: x + 14, y: py + 128, size: 76, weight: 800, mono: false, fill: '#10b981' }),
    rect(x + 14, py + 148, pw - 28, 2, '#10b981'),
    text('Financials', { x: x + 14, y: py + 186, size: 18, weight: 800, mono: false, fill: '#f2f4f3' }),
    text('Revenue, runway, unit economics', { x: x + 14, y: py + 206, size: 9, mono: false, fill: '#9ca3af' }),
    line(x + 14, py + ph - 34, x + pw - 14, py + ph - 34, '#f2f4f3', 1, 0.15),
    text('OKAN ÖZTÜRK', { x: x + 14, y: py + ph - 16, size: 8, fill: '#9ca3af' }),
    text('03 / 24', { x: x + pw - 14, y: py + ph - 16, size: 8, weight: 700, fill: '#6ee7b7', anchor: 'end' }),
  );

  // 04 TERMINAL
  x = M + (pw + gap) * 3;
  out.push(head(x, '04', 'TERMINAL'), rect(x, py, pw, ph, c.inverse, { stroke: c.strong, sw: 2 }));
  const term = [
    ['01 // BUILD', '#9ca3af', 700],
    ['', '', 0],
    ['● tokens     110', '#10b981', 400],
    ['● contrast    34', '#10b981', 400],
    ['◐ previews  10/10', '#f2f4f3', 400],
    ['', '', 0],
    ['████████████ 100%', '#10b981', 400],
    ['', '', 0],
    ['DONE · 1.24s', '#6b7280', 400],
  ];
  term.forEach(([s, fill, weight], i) => {
    if (!s) return;
    out.push(text(s, { x: x + 14, y: py + 34 + i * 22, size: 10, weight, fill }));
  });
  out.push(
    line(x + 14, py + ph - 34, x + pw - 14, py + ph - 34, '#f2f4f3', 1, 0.15),
    text(DATE, { x: x + 14, y: py + ph - 16, size: 8, fill: '#6b7280' }),
  );

  out.push(text(
    'Same canon, four media: zero radius, CAD index, one mint accent, rules not shadows, telemetry strip, 40/60 split.',
    { x: M, y: py + ph + 40, size: 13, fill: c.muted }));

  return doc({
    h: py + ph + 92, theme, index: '04 //', title: 'One language, seven media',
    body: out.join('\n'), right: 'C01 – C06',
  });
}

/* ---------- write -------------------------------------------------------- */

mkdirSync(OUT, { recursive: true });

const sheets = {
  banner, palette: paletteSheet, type: typeSheet, components, media,
};

let count = 0;
for (const [name, fn] of Object.entries(sheets)) {
  for (const theme of ['light', 'dark']) {
    const file = `${name}-${theme}.svg`;
    writeFileSync(resolve(OUT, file), fn(theme), 'utf8');
    console.log(`  wrote .github/preview/${file}`);
    count++;
  }
}
console.log(`\nSwiss Neo-Monolith v${REV} — ${count} preview sheets generated.`);
