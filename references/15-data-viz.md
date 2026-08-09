# 15 // DATA VISUALIZATION

Charts, dashboards, sparklines, KPI tiles. The same rules apply regardless of
medium — web, PDF, slide or spreadsheet.

> Also load the `dataviz` skill for general visualisation principles. This file
> layers SNM-specific constraints on top of it.

## Series palette order

Because mint is the only accent (SNM-CANON-03), multi-series charts use tone and
texture rather than a rainbow. In this order:

```
1. #10b981  mint 500          5. #9ca3af  steel 400
2. #121316  obsidian 900      6. #6ee7b7  mint 300
3. #4b5563  steel 600         7. #d1d5d3  steel 200
4. #065f46  mint 800          8. #2a2d33  obsidian 700
```

Needing more than five series means the wrong chart was chosen — use small
multiples.

Sequential scale: `#f2f4f3 → #6ee7b7 → #10b981 → #065f46`.
Diverging scale: `#b91c1c ← #f2f4f3 → #10b981`.

Colour vision: the mint/steel distinction also reads as a luminance difference.
In addition, line charts vary line style (solid, dashed, dotted) and area charts
vary hatch pattern. **Colour alone never distinguishes a series.**

## Chart anatomy

```
01 // REVENUE BY QUARTER                    2024–2026
─────────────────────────────────────────────────────
 ▲
 │     ┌──┐
 │  ┌──┤  │  ┌──┐
 │  │  │  │  │  │
 └──┴──┴──┴──┴──┴───────────────────────────────▶
   Q1  Q2  Q3  Q4
─────────────────────────────────────────────────────
 SOURCE: internal · 2026-08-09 · TRY, excl. VAT
```

Required parts: CAD heading · top rule · plot · bottom rule · source and unit
colophon. That colophon is the chart's form of SNM-CANON-05.

## Rules

- **No rounded caps.** Bar corners are sharp, lines use `stroke-linecap: butt`,
  pie segment edges are sharp.
- **No gradient fills.** Area charts use a flat colour at 15% opacity.
- **No 3-D, no shadows, no glow.**
- **Gridlines**: horizontal only, 1px, in the rule colour. Never vertical.
- **Axes**: 1px `borderStrong`. Axis labels in mono `xs`. The zero line is 2px.
- **Y axis starts at zero** — non-negotiable for bar and area charts.
- **Label directly**: prefer labelling a series at its end over a legend.
- **All numbers** are mono, `tabular-nums`, formatted through `Intl`.
- **Pie charts** only for two or three segments summing to 100%. No donuts (round).
  Prefer a single horizontal stacked bar.
- **Tooltip**: sharp corners, 2px rule, obsidian surface, mono content, appearing
  without animation (a `duration-fast` opacity change is acceptable).

## KPI tile

```
+----------------------+
| TOTAL REVENUE        |  mono micro, textMuted
| 12.500,00 ₺          |  mono 3xl, tabular, text
| ▲ 12.4%  vs Q3       |  mono xs, accent (up) / danger (down), with an arrow
+----------------------+  2px rule, zero radius
```

Direction of change is shown **by the arrow as well as** the colour.

## Sparkline

1px line, mint, no fill, no axis, 24px tall, with a 3px square marker at the final
point (not a circle).

## Per-medium notes

| Medium | Notes |
|---|---|
| Web | Prefer SVG with a `viewBox`. Canvas only above ~1000 points. Colours via `var(--snm-…)` so they follow the theme. |
| Print / PDF | Vector (SVG → PDF). Minimum 0.5pt stroke. Distinguish series by pattern for greyscale output. |
| Slide | One chart per slide. Axis labels at 12pt minimum. |
| Spreadsheet | Native charts with the palette set manually in SNM order; gridlines and shadows off. |
| Terminal | Unicode block characters (`▁▂▃▄▅▆▇█`) for sparklines; honour `NO_COLOR`. |

## Accessibility

- Every chart has a text alternative — a `<figcaption>` or `alt` describing the
  trend and the outliers in a sentence. Never say "chart".
- The underlying data is reachable as a table (inside a `<details>` is fine).
- Interactive charts support point-by-point keyboard traversal.
- Contrast: series against the background at 3:1, and distinguishable from each
  other.
