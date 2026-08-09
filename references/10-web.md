# 10 // WEB

React + Tailwind is the default; plain HTML/CSS uses `tokens.css` directly.

## Setup

Vendor the compiled tokens into the project first — one directory, nothing else
to install:

```bash
node scripts/vendor.mjs ../my-app/vendor/snm
```

```js
// tailwind.config.js
module.exports = {
  presets: [require('./vendor/snm/tailwind.preset.cjs')],
  content: ['./src/**/*.{ts,tsx}'],
};
```

```css
/* app.css — first */
@import './vendor/snm/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`npm i file:./vendor/snm` makes the same files resolvable as `@snm/tokens` if the
project prefers a bare specifier. Either way there is no registry and no release
step: the vendored copy is pinned by the consuming project's own commit.

The preset **replaces** the colour and spacing scales rather than extending them:
an off-palette colour or off-scale spacing value produces no class, and the error
surfaces at build time. This is intentional.

**No arbitrary values:** never write `bg-[#121316]`, `p-[10px]`, `text-[11px]`.
Enforce it with the lint config that ships alongside the tokens:

```js
// eslint.config.js
module.exports = [ ...require('./vendor/snm/eslint-snm.cjs') ];
```

Its source is `assets/web/eslint-snm.cjs`; `scripts/check-canon.mjs` tests every
rule in it against a violation it must catch and a correct line it must not
flag, so a rule cannot rot into decoration.

## Layout

### Stage (viewport-locked hero)

```jsx
<section className="min-h-stage overflow-hidden
                    max-[699px]:min-h-0 max-[699px]:overflow-visible">
```

- Use `100dvh`, **never** `100vh` — the mobile address bar breaks the latter.
- Header height comes from `--snm-header-h`, never hard-coded.
- The viewport lock applies only above `@media (min-height: 700px)`. On short
  screens, landscape phones and at 200% zoom the content flows naturally;
  otherwise it becomes unreachable (WCAG 1.4.10).

### 40/60 asymmetric sticky grid

```jsx
<div className="grid grid-cols-1 lg:grid-cols-[40fr_60fr] gap-6">
  <aside className="lg:sticky lg:top-header lg:h-stage lg:overflow-hidden">…</aside>
  <div className="min-w-0">…</div>
</div>
```

On mobile this collapses to one column, the aside loses stickiness and stays
**above**. `min-w-0` is required, or long content overflows the grid.

## Component catalogue

### Button

Three variants. All zero radius, all with a 44px minimum hit area.

```jsx
// primary — obsidian fill
"bg-inverse text-inverse border-2 border-border-strong px-5 py-3
 font-mono text-micro font-bold uppercase tracking-[0.08em]
 shadow-1 transition-[transform,box-shadow,background-color]
 duration-fast ease-mech
 hover:bg-accent-press hover:text-inverse
 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
 focus-visible:outline-focus
 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"

// secondary — outlined
"bg-transparent text-text border-2 border-border-strong … hover:bg-inverse hover:text-inverse"

// ghost — underline only
"bg-transparent text-text border-b border-border … hover:border-border-strong"
```

Button labels are always mono and uppercase. A leading icon is 16px with `gap-2`.

### Input, textarea, select

```jsx
"w-full bg-raised text-text border-2 border-border-strong px-4 py-3
 font-mono text-sm placeholder:text-muted
 focus:outline-none focus:border-accent-press
 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
 focus-visible:outline-focus
 aria-[invalid=true]:border-danger"
```

- A real `<label>` is **required**; placeholder-as-label is not accepted.
- Error text sits below the input with `role="alert"`, mono, `text-xs`,
  `text-danger`, alongside a warning icon — colour alone never carries meaning.
- Mark optional fields "(optional)" rather than marking required ones with `*`.

### CAD link row

```jsx
<a href="…" target="_blank" rel="noreferrer"
  className="group flex items-center justify-between gap-3 border border-border
             bg-raised px-4 py-3 font-mono text-text
             transition-[background-color,border-color,color] duration-fast ease-mech
             hover:border-border-strong hover:bg-inverse hover:text-inverse
             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
             focus-visible:outline-focus">
  <span className="flex items-center gap-3">
    <span aria-hidden className="text-micro font-bold text-accent">01</span>
    <span className="text-xs font-bold tracking-[0.04em]">GitHub</span>
  </span>
  <GitHubIcon className="size-4 text-muted group-hover:text-accent" aria-hidden />
</a>
```

The index digit resolves to `mint-700` on light through the token, so it stays
contrast-safe; on hover the surface inverts and `mint-500` becomes correct.

### Card

```jsx
"border-2 border-border-strong bg-raised p-6 space-y-5"
```

Header row: `flex justify-between items-baseline border-b border-border pb-4` —
sans title on the left, mono status label on the right.

### Table

```jsx
"w-full border-collapse font-mono text-sm tabular-nums"
// thead th: text-micro uppercase tracking-[0.08em] text-muted
//           border-b-2 border-border-strong py-2 text-left
// tbody td: border-b border-border py-3
// numeric column: text-right
```

No zebra striping — separation is a 1px rule.

### Modal

`bg-overlay` backdrop (flat opacity, **no blur**), `border-2 border-border-strong`
panel, `shadow-2`. Focus trap, `Esc` to close, `aria-modal="true"`, and
`overflow: hidden` on the background while open.

### Status pulse — the one round exception

```jsx
<span className="snm-pulse inline-block size-2 bg-accent" aria-hidden />
<span className="font-mono text-micro font-bold uppercase">Operational</span>
```

## Accessibility — shipping requirement

- `:focus-visible` is visible on every interactive element:
  `outline: 2px solid var(--snm-focus); outline-offset: 2px`. Never write
  `outline: none` on its own.
- A "skip to content" link is the first focusable element on every page.
- Heading hierarchy has no skipped levels (h1 → h2 → h3).
- Landmarks present: `header`, `nav`, `main`, `footer`.
- Every flow is completable by keyboard; hover-dependent features such as
  `CursorPreview` never carry information.
- `prefers-reduced-motion` is honoured.
- No horizontal scrolling at 200% zoom.

## Performance

- Two variable fonts, preloaded, self-hosted.
- No `transition: all`.
- `content-visibility: auto` on heavy below-the-fold sections.
- Images carry explicit `width`/`height` (CLS), `loading="lazy"`, AVIF/WebP,
  `object-fit: cover`, and a `bgSunken` placeholder — **no blur-up**.
- Web Audio starts only on the first gesture.

## Global footer (SNM-CANON-05)

Every multi-section page renders the same `<FooterGlobal />`: a four-column Swiss
information grid — `IDENTITY` · `NAVIGATION` · `CHANNELS` · `TELEMETRY`. The
telemetry column carries revision, last update (ISO), status and response SLA.
Reference: `assets/web/FooterGlobal.tsx`.
