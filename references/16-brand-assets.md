# 16 // BRAND ASSETS

Logo, icons, favicon, social images, email, signature, README. The system's
outward face.

## The mark

SNM's mark is typographic; there is no pictorial logo:

```
OKAN ÖZTÜRK          Inter 700, +0.02em tracking
▌                    2px × cap-height mint bar, 8px to the left of the name
```

The bar and the name form a locked unit. The gap between them is always 0.25 of
the cap height. The mark is used horizontally only.

Clear space: one cap height on every side. Nothing enters it.

Minimum size: 16px cap height on screen, 4mm in print.

Forbidden: skewing, shadows, outlining, gradients, recolouring (only the mint bar
carries colour), placing directly over photography (use an obsidian plate),
re-typesetting, distorting proportions.

In single-colour applications the bar takes the text colour.

## Iconography

- **Linear**, no fills.
- 1.5px stroke on a 24px grid (1.25px at 16px, 2px at 32px).
- `stroke-linecap: butt` · `stroke-linejoin: miter` — **no rounded caps or joins**.
- 24×24 viewBox, 2px padding, 20×20 live area.
- Geometric rather than optical: prefer squares and rectangles to circles.
  Genuine circles (status dots, dials) are fine.
- Single colour, `currentColor`.
- Compatible ready-made set: **Lucide**, with stroke set to 1.5 and caps/joins set
  to `butt`/`miter`. Never mix icon sets.

## Favicon and app icon

An obsidian square, filled edge to edge, with the mint `▌` bar and a white `OÖ`
monogram. No rounding — the platform applies its own mask (iOS); do not
pre-empt it.

Sizes: `favicon.svg` (preferred) · `favicon.ico` 32 · `apple-touch-icon` 180 ·
`icon-192` · `icon-512` · `maskable-512` (80% safe zone).

At 16px the monogram is illegible; at that size use the mint bar on flat obsidian
alone.

## Social / OG image

1200 × 630. Template:

```
+--------------------------------------------+
| ▌ OKAN ÖZTÜRK              01 // ARTICLE   |  top strip, mono
|                                            |
|  The headline goes here,                   |  Inter 800, 64px, left aligned
|  two lines at most                         |  max 2 lines, 60ch
|                                            |
| ------------------------------------------|  2px mint rule
| joxinyks.com              2026-08-09       |  mono 20px
+--------------------------------------------+
   obsidian ground · 64px margin
```

If photography is used: obsidian ground at 30% opacity with a flat obsidian text
plate over it. No blurring.

Twitter card `summary_large_image`; always declare `og:image:width` and
`og:image:height`.

## Email template

Email clients are constrained, so compromises here are unavoidable:

- Table-based layout, 600px wide, single column.
- **Inline CSS** — custom properties are unsupported, so token values are written
  literally. Generate them from `tokens.resolved.json`; never type them by hand.
- Design assuming web fonts will not load: fall back through
  `'JetBrains Mono', Consolas, monospace` and `Inter, 'Segoe UI', Arial, sans-serif`.
- `border-radius: 0` is already the default — never add it anywhere.
- No shadows (unsupported anyway), no gradients.
- Buttons are an `<a>` with `padding`, `background` and a 2px `border`; no VML
  required.
- Dark mode via `@media (prefers-color-scheme: dark)`, but **do not rely on it** —
  the light rendering must stand alone. Gmail may invert colours, so no critical
  information lives in colour only.
- Telemetry in the footer: identity · date · unsubscribe link.
- Images carry `alt`; the email must still make sense with images blocked.

## Email signature

```
Okan Öztürk
▌ joxinyks.com

STATUS: OPERATIONAL · RESPONSE SLA: <24H
```

Plain text first. In the HTML version: name in Inter 700 14px, mono line at 11px
`steel.600`, mint bar. No logo image, no social icon row, no legal disclaimer
paragraph.

## README / repository

- Badges in `flat-square` style (rounded is forbidden), accent `10b981`.
- Title: `# 00 // PROJECT NAME`
- CAD-numbered sections.
- A telemetry block at the end: revision, licence, last update.
- Screenshots framed in obsidian with a 2px rule and no shadow.

## File naming

```
snm_<type>_<subject>_<REV>_<ISO date>.<ext>
snm_proposal_akme-portal_r04_2026-08-09.pdf
```

Lowercase, underscore separators, hyphens within words, ISO date. No spaces and no
non-ASCII characters in file names.
