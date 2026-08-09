# 12 // PRINT & PDF

Reports, proposals, invoices, CVs, certificates, covers. Print is the system's
most natural habitat — the Swiss editorial tradition originates here.

## Production route

In order of preference:

1. **HTML + CSS Paged Media → WeasyPrint / Paged.js.** Tokens work directly; one
   source produces both web and PDF. The default choice.
2. **ReportLab (Python)** for programmatic, data-heavy, many-page reports.
   `tokens/dist/tokens.py` → `rgb("bg")`.
3. **LaTeX** for academic or long-form work. Define colours with `\definecolor`
   from the tokens.

Generate a PDF from Word (see `13-office.md`) only when the recipient must edit
the file.

## Page grid

| | Value |
|---|---|
| Page | A4 (210 × 297mm); a separate template for US Letter |
| Margins | 18mm outer, 22mm bottom (running foot) |
| Columns | 12, 4mm gutter |
| Default split | 40 / 60 — colophon column / content column |

Vertical rhythm is anchored to the **14pt leading** of body text: block spacing is
always a multiple (14 / 28 / 42pt). This guarantees alignment across pages.

## Typography (points)

| Role | Size | Leading | Family |
|---|---|---|---|
| Cover title | 48pt | 46pt | Inter 800 |
| H1 | 24pt | 28pt | Inter 700 |
| H2 | 16pt | 21pt | Inter 700 |
| H3 | 12pt | 14pt | Inter 700 |
| Body | 10pt | 14pt | Inter 400 |
| Note, footnote | 8pt | 11pt | Inter 400 |
| CAD label, colophon | 7.5pt | 10pt | JetBrains Mono 700, +0.08em |
| Table data | 9pt | 12pt | JetBrains Mono 400, tabular |

The on-screen `px` scale does **not** transfer to print. The table above is print's
own scale; the reading distance is different.

## Colour

- Body text: **flat K100 black**. Rich black causes misregistration in text — do
  not use it.
- Large filled areas (covers): rich black `C75 M65 Y60 K90`.
- Mint: `C91 M0 Y30 K27` approximate; nearest Pantone approximately **3395 C**.
  **These figures were computed without an ICC profile — verify against a physical
  guide before any production run.**
- Bone background: solve it with **paper choice** (natural, uncoated stock) rather
  than printing a flood tint. If it must be printed, `C3 M1 Y2 K0`.
- In single-colour printing, mint becomes a K40 tint. The system must still read
  in that state — information is never encoded in mint alone.

## Page structure

```
+------------------------------------------+  <- 18mm
| 01 // SECTION NAME           REV 04       |  running head, mono 7.5pt
| ---------------------------------------- |  0.5pt rule
|                                          |
|  <-- 40% -->|<------ 60% ------>         |
|  colophon   | content                    |
|  column     |                            |
|                                          |
| ---------------------------------------- |
| OKAN ÖZTÜRK · 2026-08-09    PAGE 03/12   |  <- telemetry (SNM-CANON-05)
+------------------------------------------+  <- 22mm
```

The running foot is mandatory on **every** page: identity · ISO date · page
counter (`03 / 12`, zero-padded). The cover page is exempt.

## CSS Paged Media

```css
@page {
  size: A4;
  margin: 18mm 18mm 22mm;
  @top-left  { content: string(section); font: 700 7.5pt 'JetBrains Mono'; letter-spacing: .08em; }
  @top-right { content: 'REV ' string(rev); font: 700 7.5pt 'JetBrains Mono'; }
  @bottom-left  { content: string(identity) ' · ' string(date); font: 400 7.5pt 'JetBrains Mono'; }
  @bottom-right { content: counter(page, decimal-leading-zero) ' / '
                           counter(pages, decimal-leading-zero);
                  font: 700 7.5pt 'JetBrains Mono'; font-variant-numeric: tabular-nums; }
}
@page :first { @top-left { content: none } @top-right { content: none } }

h2 { string-set: section content(); break-after: avoid; }
h1, h2, h3 { break-after: avoid-page; }
table, figure, .snm-card { break-inside: avoid; }
p { orphans: 3; widows: 3; }
```

Ready-made stylesheet: `assets/print/print.css`.

## Print rules

- **No shadows.** Elevation becomes a 1pt rule.
- Rule weights: 0.5pt hairline · 1pt structural · 2pt heavy. Never go below
  0.25pt — it disappears in offset printing.
- Links stay clickable in the PDF but **also print their URL** for paper:
  `joxinyks.com  ↗`
- Tables: no zebra, 0.5pt horizontal rules, no vertical rules, numbers right
  aligned.
- Images at 300dpi minimum, converted to CMYK; 3mm bleed where artwork runs off
  the page.
- Crop marks and bleed only for press output — never in a PDF distributed on
  screen.
- For PDF/A: embed fonts and flatten transparency.
- Accessible PDF: tagged structure, correct reading order, `alt` text, document
  language set, `Title` metadata populated.

## Document types

| Type | Cover | Running head | Notes |
|---|---|---|---|
| Proposal | Yes, full obsidian | Yes | `SCOPE` colophon block on page one |
| Report | Yes | Yes | CAD-numbered table of contents |
| Invoice | No | Foot only | All figures mono tabular; total gets a 2pt rule above |
| CV | No | Foot only | 40/60: colophon and contact left, experience right |
| One-pager | No | No | Single telemetry line at the very bottom |
