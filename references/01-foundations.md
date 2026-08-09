# 01 // FOUNDATIONS

Colour, spacing, rules, elevation. The medium-independent base layer.

## Token architecture

Three layers exist, and **product code only ever touches layer 2**:

```
1. Primitive   color.mint.500        raw, named value
2. Semantic    --snm-text-accent     purpose-bound, theme-aware   <- USE THIS
3. Component   --snm-btn-bg          rare; only when layer 2 cannot express it
```

Seeing `#10b981` or `color.mint.500` in product code is a defect.
The correct forms are `var(--snm-accent)`, `text-accent`, `token("accent")`.

## Colour

### Neutrals

| Role | Light | Dark |
|---|---|---|
| Background | `bone.200` `#f2f4f3` | `obsidian.900` `#121316` |
| Raised surface | `bone.50` `#ffffff` | `obsidian.800` `#1c1e22` |
| Text | `obsidian.900` | `bone.200` |
| Secondary text | `steel.600` `#4b5563` | `steel.400` |
| Rule (hairline) | `rgba(18,19,22,.15)` | `rgba(242,244,243,.15)` |
| Rule (structural) | `obsidian.900` | `bone.200` |

### Mint — usage contract

Mint is the system's only chromatic voice, so where it may appear is tightly
governed.

| Tone | Contrast on bone | Permitted use |
|---|---|---|
| `mint.500` `#10b981` | **2.3:1** | Text on obsidian (7.3:1 ✓), fills, rules, icons, chart series. **Never text on bone.** |
| `mint.600` `#059669` | 3.4:1 | Meaning-bearing icons, borders, graphics (AA non-text ✓). Not text. |
| `mint.700` `#047857` | **4.9:1** ✓ | The only mint permitted for text and links on light. |
| `mint.300` `#6ee7b7` | — | Text and links on obsidian. |

Three separate semantic tokens exist; do not conflate them:

- **`accent`** = `mint.500` — the brand fill. Carries inverse text on top; it does
  not itself convey information. Its 2.3:1 on light is acceptable *because* it is
  a fill, not a meaning-bearing line.
- **`accentUi`** = `mint.600` light / `mint.500` dark — meaning-bearing icons,
  borders and graphic elements. Clears 3:1.
- **`textAccent`** = `mint.700` light / `mint.300` dark — text and links.

Area budget: mint covers at most **10%** of any visible screen or page. Beyond
that it stops functioning as an accent.

### State colours

`danger` `#b91c1c` · `warn` `#92400e` · `info` `#1d4ed8`, with lighter dark-theme
counterparts. They report real states only, never decoration. Colour alone never
carries meaning — an icon or label always accompanies it.

### Contrast thresholds

- Body text: **4.5:1** minimum
- Text at 24px+, or 19px+ bold: 3:1
- Icons, rules, form borders, chart marks: 3:1

Disabled elements are exempt but must not be the sole carrier of information.

When proposing a new colour, compute its contrast and state the figure. If you
have not computed it, do not use it.

## Spacing scale

4px base. **These are the only permitted values:**

```
0   4   8   12   16   24   32   48   64   96   128
s0  s1  s2  s3   s4   s5   s6   s7   s8   s9   s10
```

Never write an intermediate value (10px, 20px, 36px). Needing one means the
composition is wrong.

Rhythm rule: a component's **inner** padding must be smaller than the **outer**
gap that separates it — a card with `p-4` is separated by `mb-6`. Otherwise the
grouping cannot be read.

## Rules and borders

| Name | Width | Use |
|---|---|---|
| hairline | 1px | Dividers, table rows, secondary cards |
| structural | 2px | Primary cards, buttons, modals, active state |
| heavy | 3px | Rare — cover frames, selected state |

Rule colour must reach 3:1 against its background. The `rgba(...,0.15)` rules are
for **decorative dividers only**; anything information-bearing, such as a form
border, uses `borderStrong` or at minimum `steel.500`.

## Elevation

No blur. Hard offset only:

```css
--snm-elevation-1: 2px 2px 0 0 var(--snm-border-strong);
--snm-elevation-2: 4px 4px 0 0 var(--snm-border-strong);
--snm-elevation-3: 8px 8px 0 0 var(--snm-border-strong);
```

The offset is always down-right, always whole pixels, always a single flat colour.
Never use more than two elevation levels on one screen. In print, elevation
becomes a 1pt rule instead (see `12-print.md`).

## Grid and measure

- Maximum content width: **1440px**
- Reading measure: **68ch** — body copy beyond this is split or narrowed
- Columns: 12, gutter `s5` (24px)
- Default division: **40 / 60** asymmetric (SNM-CANON-06)
- Minimum touch target: **44 × 44px** — the visual mark may be smaller, the hit
  area may not

## Theming

Both themes are supported.

- The OS preference is the default (`prefers-color-scheme`).
- An explicit user choice (`[data-theme]`) overrides the OS **in both directions**.
- Theme switching is not animated; it is instant.
- Mint stays at `500` in both themes; what changes is the text tone.

## Verification

```bash
node scripts/build-tokens.mjs      # recompile bindings
node scripts/check-contrast.mjs    # audit every shipped pair against WCAG
node scripts/build-previews.mjs    # regenerate the visual showcase
```
