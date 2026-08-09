# 13 // OFFICE (PPTX · DOCX · XLSX)

Office files are files other people will edit. The rule here is therefore to **set
up the style definitions correctly**, not to format by hand. A deck built with
direct formatting leaves the system on its first edit.

Common requirement: **define theme colours and styles, then use only those.**
Direct formatting is forbidden.

---

## PPTX — presentation

### Slide setup

- Size 16:9 (13.333 × 7.5 in / 33.87 × 19.05 cm)
- Margins 0.6in (1.5cm) all round
- 12-column grid, 0.15in gutter
- Background bone `#f2f4f3`; section dividers and covers obsidian `#121316`

### Theme colours (Office theme slots)

```
dk1  #121316   lt1  #f2f4f3   dk2  #4b5563   lt2  #ffffff
acc1 #10b981   acc2 #047857   acc3 #4b5563   acc4 #9ca3af
acc5 #b91c1c   acc6 #92400e   hlink #047857  folHlink #065f46
```

The complete scheme is in `assets/office/snm-theme-colors.xml` — apply it through
Design → Colors → Customize, or install it as a `.thmx`.

### Slide layouts (master)

| Layout | Structure |
|---|---|
| `COVER` | Obsidian · 40pt title bottom-left · mono colophon at top · 2pt mint rule bottom-right |
| `SECTION` | Obsidian · oversized CAD number (`03`) at 120pt mint · section name alongside |
| `CONTENT 40/60` | 40% colophon and title · 60% content · the default layout |
| `FULL` | Single full-width column — for tables and charts |
| `SPLIT` | 50/50 image and text |
| `CLOSING` | Obsidian · contact colophon · mono |

Every layout carries a telemetry strip at the bottom (SNM-CANON-05):
`OKAN ÖZTÜRK · 2026-08-09 · 03 / 24` in mono 9pt, `steel.600`.

### Slide typography

Title 32pt Inter 700 · subtitle 18pt Inter 400 · body 16pt (never below 14pt) ·
bullets 16pt · CAD label 10pt JetBrains Mono 700 · notes 11pt.

Bullet character: an em dash `—`, not a round dot. Two levels maximum. Six lines
per slide maximum.

### Forbidden

Transitions (other than a 180ms fade) · entrance animations · WordArt · shadowed
boxes · gradient fills · 3-D charts · stock icon sets · clip art · rounded shapes
(set shape corner radius to 0).

---

## DOCX — document

### Style definitions (required)

| Style | Font | Size | Spacing |
|---|---|---|---|
| `SNM Body` | Inter | 10.5 | 14pt line, 0/8pt before/after |
| `SNM H1` | Inter 700 | 20 | 24pt before, 8pt after |
| `SNM H2` | Inter 700 | 14 | 18pt before, 6pt after |
| `SNM H3` | Inter 700 | 11.5 | 12pt before, 4pt after |
| `SNM Label` | JetBrains Mono 700 | 7.5 | +0.08em, uppercase, `steel.600` |
| `SNM Data` | JetBrains Mono | 9 | tabular |
| `SNM Caption` | Inter | 8 | `steel.600` |
| `SNM Quote` | Inter | 10.5 | 2pt mint left border, 12pt indent |

- Headings must map to the real `Heading 1/2/3` styles — the navigation pane and
  PDF tagging depend on it.
- Numbering is bound to a multilevel list style; never type numbers manually.
- Page setup matches `12-print.md`: 18mm margins, telemetry in the running foot.
- Table style `SNM Table`: no outer border, 1pt beneath the header row, 0.5pt
  between rows, no vertical rules, header row in `SNM Label`.

### Forbidden

Manual spacing or empty paragraphs · text boxes · shadowed table themes ·
coloured cell fills (except genuine state reporting) · leftover Calibri or Times.

---

## XLSX — spreadsheet

### Cell styles

| Style | Definition |
|---|---|
| `SNM Header` | JetBrains Mono 700, 9pt, uppercase, 2pt obsidian bottom border, no fill |
| `SNM Cell` | JetBrains Mono 400, 10pt, 0.5pt bottom border |
| `SNM Number` | as Cell, right aligned, `#,##0.00` |
| `SNM Currency TRY` | `#,##0.00 "₺"` |
| `SNM Currency USD` | `"$"#,##0.00` |
| `SNM Percent` | `0.0%` |
| `SNM Date` | `yyyy-mm-dd` — ISO, always |
| `SNM Total` | Mono 700, 2pt top border |
| `SNM Note` | Inter 9pt, `steel.600` |

### Rules

- Freeze the header row; enable AutoFilter.
- Row height 20px, header 24px. No zebra striping.
- Conditional formatting uses state colours only, and **always alongside text or
  an icon** — colour alone never carries meaning.
- Charts: see `15-data-viz.md`. Never use Excel's default palette; set series
  colours manually in SNM order and switch off gridlines and shadows.
- Sheet names uppercase and short: `DATA` · `SUMMARY` · `NOTES`.
- Cell A1 of the first sheet carries a colophon block: document name, `REV`, ISO
  date, owner.
- For printing: landscape, fit to one page wide, `&[Page] / &[Pages]` in the
  footer.

---

## Automation

When generating these files, use the corresponding skill (`pptx`, `docx`, `xlsx`)
and take theme and style definitions from `assets/office/`. Do not format from
scratch — open the template and fill it.
