# 02 // TYPOGRAPHY

Two families, two jobs. This split is the system's most recognisable trait.

## The family contract — non-negotiable

| Family | Job |
|---|---|
| **Inter** (sans) | Narrative. Headings, body copy, description, prose. |
| **JetBrains Mono** | System. CAD indexes, labels, colophons, numbers, dates, code, status, table data, units. |

The rule: **anything a machine produced is monospace; anything a person wrote is
sans.** A date is monospace. A heading is sans. A price is monospace. A paragraph
is sans. When in doubt, ask: is this data, or is this a sentence?

## Scale

| Token | Size | Leading | Tracking | Use |
|---|---|---|---|---|
| `micro` | 11 | 14 | +0.08em | CAD index, badge, colophon. **Always mono + bold + uppercase** |
| `xs` | 12 | 16 | +0.04em | Labels, table headers, footnotes |
| `sm` | 14 | 20 | 0 | Secondary text, form help, table cells |
| `base` | 16 | 26 | 0 | Body copy |
| `lg` | 18 | 28 | −0.01em | Lede paragraph |
| `xl` | 24 | 30 | −0.02em | H3, card title |
| `2xl` | 32 | 36 | −0.025em | H2, section heading |
| `3xl` | 40 | 44 | −0.03em | H1 |
| `4xl` | 56 | 56 | −0.035em | Hero |
| `5xl` | 72 | 70 | −0.04em | Cover, display |

Never use an off-scale size. On mobile, `4xl`/`5xl` step down one level.

## Weight

`400` body · `500` labels and emphasis · `700` headings and all mono · `800` hero
and cover only.

Do not use `600` — the gap between 500 and 700 is deliberately hard in this
system. Do not use italics; emphasis is expressed through weight or a switch to
mono.

## Invariants

1. **Uppercase only in mono.** Sans headings are sentence case. Uppercase mono
   labels always carry +0.08em tracking.
2. **Tabular figures are mandatory.** Anywhere numbers appear, set
   `font-variant-numeric: tabular-nums`. Misaligned digits are not acceptable in
   tables, prices, telemetry or counters.
3. **No justification.** `text-align: justify` is forbidden. Body copy is
   left-aligned with a ragged right edge.
4. **No hyphenation.** `hyphens: none` — the Swiss editorial tradition prefers a
   hard right edge.
5. **68ch measure.** Body copy beyond this is columned or narrowed.
6. **Widows and orphans.** `text-wrap: balance` on headings, `text-wrap: pretty`
   on paragraphs.

## CAD index format (SNM-CANON-02)

```
01 // THE ARCHITECTURE          section opener
SECTION 03 / 07                 counter
RESPONSE SLA: <24H              telemetry
STATUS: OPERATIONAL             state
```

Rules: two-digit zero-padded number · spaced `//` separator · all caps · `micro`
size · `700` weight. The number may take the accent colour; the rest of the label
is `textMuted`. The heading itself is never accent-coloured.

## Font loading

Variable fonts, self-hosted, `woff2`. No CDN dependency.

```html
<link rel="preload" as="font" type="font/woff2"
      href="/fonts/InterVariable.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2"
      href="/fonts/JetBrainsMono[wght].woff2" crossorigin>
```

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/InterVariable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
  size-adjust: 100%;
}
```

Load only the two families actually in use. Adding a second mono or a second sans
is a system violation.

Guard against layout shift with `font-display: swap` plus a metric-matched
fallback:

```css
@font-face {
  font-family: 'Inter-fallback';
  src: local('Segoe UI'), local('Helvetica Neue');
  size-adjust: 96%;
}
```

## Turkish — critical

**CSS `text-transform: uppercase` is broken for Turkish:** it maps `i` to `I`
rather than `İ`. "iletişim" becomes "ILETIŞIM" (wrong) instead of "İLETİŞİM".

Rules:

1. Always set `<html lang="tr">` — some engines respect the locale, but **do not
   rely on it**.
2. Write Turkish uppercase text as uppercase **in the source**; never transform it
   with CSS.
3. Keep CAD labels English and technical (`STATUS`, `SECTION`, `REV`). This is a
   stylistic choice that also sidesteps the problem entirely.
4. Verify the chosen font carries ğ ı İ ş ç ö ü. Inter and JetBrains Mono both do.
5. Use the `Intl` API with `tr-TR` for sorting, dates and numbers. Never assemble
   these by string concatenation.
