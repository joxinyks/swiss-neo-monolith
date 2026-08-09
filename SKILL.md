---
name: swiss-neo-monolith
description: |
  Okan Öztürk's signature design system (SNM) — Swiss editorial typography,
  industrial CAD schematics, zero radius. USE whenever producing or editing any
  visual output, in any medium: web UI, desktop/mobile app, PDF, report, proposal,
  CV, invoice, slide deck, document, spreadsheet, CLI output, chart, dashboard,
  logo, favicon, OG image, email template, README. Also use when asked for
  "my style", "the usual look", or "make it match my other work".
  DO NOT use when a third party's brand guidelines apply, when a different style
  is explicitly requested, or when the output has no visual surface at all
  (pure backend, data transforms, scripts).
---

# Swiss Neo-Monolith (SNM)

One design language across every medium. A web button, a PDF cover and a terminal
report must read as the work of one hand. The **six invariants** below are what
make that true.

## How to use this skill

1. Apply the Canon and the Red Lines below — always, in every medium.
2. Read the reference for the medium you are producing (table below).
3. Never hand-write token values; import the binding from `tokens/dist/`.
4. Before delivering, audit against `references/99-checklist.md`.

| Producing | Read |
|---|---|
| Colour, spacing, contrast, elevation decisions | `references/01-foundations.md` |
| Headings, sizes, leading, font loading | `references/02-typography.md` |
| Transitions, sound, cursor, haptics | `references/03-motion-sound.md` |
| Copy, labels, date/number formats, tone | `references/04-voice.md` |
| Web — React, Tailwind, HTML | `references/10-web.md` |
| Desktop or mobile application | `references/11-app.md` |
| PDF, report, proposal, CV, print | `references/12-print.md` |
| Slides, Word, Excel | `references/13-office.md` |
| Terminal, CLI, TUI, logs | `references/14-terminal.md` |
| Charts, dashboards, data visualisation | `references/15-data-viz.md` |
| Logo, favicon, icons, OG image, email | `references/16-brand-assets.md` |

Token bindings live in `tokens/dist/`: `tokens.css`, `tokens.scss`, `tokens.ts`,
`tailwind.preset.cjs`, `tokens.py`, `tokens.dart`, `tokens.resolved.json`.
The source is `tokens/tokens.json`; after editing it run
`node scripts/build-tokens.mjs`.

---

## The Canon — six invariants

Medium-independent. Whether an output belongs to this system is decided here.

**SNM-CANON-01 · Zero radius.**
`border-radius: 0`. Everywhere: buttons, cards, inputs, modals, tables, slide
shapes, PDF frames, avatars, images. The only exceptions are the status pulse dot
and mandatory platform controls (an iOS switch). A rounded corner is a defect.

**SNM-CANON-02 · CAD indexing.**
Every meaningful section opens with a monospace, uppercase, numbered tag:
`01 // THE ARCHITECTURE` · `03 // FINANCIALS` · `SECTION 02 / 07`.
Two digits, zero-padded, `//` separator. The number may carry the accent colour;
the heading itself never does.

**SNM-CANON-03 · One chromatic accent.**
No colour other than mint. Mint covers at most **10% of visible area** — it is an
accent, not a surface. Everything else is bone, obsidian or steel. State colours
appear only when reporting an actual state, never as decoration.

**SNM-CANON-04 · Structure is drawn with rules, not shadows.**
Hierarchy is expressed with crisp 1px/2px rules. Blurred shadows, gradients,
glassmorphism, glows and textures are forbidden. Where elevation is genuinely
needed, use a hard offset (`2px 2px 0`) — which is a second contour, not a shadow.

**SNM-CANON-05 · Telemetry strip.**
Every finished output carries a monospace colophon: revision, ISO date, status,
page or section counter. Footer on the web, running foot in PDF, bottom strip on
a slide, header line in a terminal. This strip is the system's signature.

**SNM-CANON-06 · Asymmetry.**
Compositions are not centred. The default is a 40/60 split; text sits left with
open space to the right. A centred heading is acceptable only on a cover page.

---

## Red lines

If any of these appear in your output, the output is wrong:

- A rounded corner (other than the status pulse dot)
- An off-palette colour, or a hand-written hex value — use a token
- `mint-500` as text on bone: 2.3:1, unreadable. Text uses `mint-700`.
- Blurred shadow, gradient, blur, glassmorphism
- Centred body copy, or justified text
- `100vh` (use `100dvh`), or a hard-coded header height (use the token)
- `transition: all`
- Emoji used as an icon — icons are linear, 1.5px stroke, butt caps, miter joins
- An interactive element with no visible keyboard focus ring
- CSS `text-transform: uppercase` on Turkish copy (see `04-voice.md`)

---

## Quick reference

```
Bone    #f2f4f3    Obsidian #121316    Mint #10b981    Mint-text #047857
Space   4 8 12 16 24 32 48 64 96 128        Radius 0
Rules   1px hairline · 2px structural       Shadow 2px 2px 0
Timing  120 / 180 / 320ms                   Easing cubic-bezier(0.2,0,0,1)
Type    Inter (narrative) · JetBrains Mono (system, data, colophon)
```
