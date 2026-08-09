<picture>
  <source media="(prefers-color-scheme: dark)" srcset="preview/banner-dark.svg">
  <img alt="Swiss Neo-Monolith — a cross-medium design system" src="preview/banner-light.svg">
</picture>

**One design language across every medium.** Swiss editorial typography,
industrial CAD schematics, zero radius. A web component, a printed proposal and a
terminal report read as the work of one hand — because they follow the same six
rules and the same tokens.

It ships as a **Claude skill**, so on any machine where it is installed the system
gets applied automatically, whatever you are building.

[![verify](https://github.com/joxinyks/swiss-neo-monolith/actions/workflows/verify.yml/badge.svg)](https://github.com/joxinyks/swiss-neo-monolith/actions/workflows/verify.yml)
![revision](https://img.shields.io/badge/REV-1.1.0-10b981?style=flat-square&labelColor=121316)
![contrast](https://img.shields.io/badge/WCAG-34%2F34%20PASS-10b981?style=flat-square&labelColor=121316)
![media](https://img.shields.io/badge/MEDIA-7-4b5563?style=flat-square&labelColor=121316)
![licence](https://img.shields.io/badge/LICENCE-MIT-4b5563?style=flat-square&labelColor=121316)

---

## 01 // QUICKSTART

```bash
git clone https://github.com/joxinyks/swiss-neo-monolith.git
cd swiss-neo-monolith
```

**Windows**

```powershell
.\install.ps1
```

**macOS · Linux**

```bash
chmod +x install.sh && ./install.sh
```

Restart Claude. That is the whole setup — the installer links the repository into
`~/.claude/skills/`, compiles the token bindings and runs the contrast gate.

<details>
<summary><b>Other install modes</b></summary>

<br>

On the machine where you edit the system, link instead of copying so changes take
effect without reinstalling:

```powershell
.\install.ps1 -Link
```

```bash
./install.sh --link
```

Update an existing installation:

```bash
git pull && .\install.ps1 -Force
```

Verify at any time:

```bash
npm run verify
```

Anything other than `PASS` means the installation is incomplete or broken.

</details>

---

## 02 // SEE IT

The same canon rendered as a web page, a print page, a slide and a terminal.
Every image in this README is **generated from the tokens** — change a token,
rerun `npm run build`, and the showcase follows. It cannot drift from the system
it documents.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="preview/media-dark.svg">
  <img alt="The same design canon applied to web, print, slide and terminal output" src="preview/media-light.svg">
</picture>

<details>
<summary><b>Components</b> — zero radius, hard-offset shadows, the tactile press state</summary>

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="preview/components-dark.svg">
  <img alt="Buttons, focus ring, KPI tile, status pulse, progress bar and table" src="preview/components-light.svg">
</picture>

</details>

<details>
<summary><b>Colour</b> — every swatch states its own measured contrast ratio</summary>

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="preview/palette-dark.svg">
  <img alt="Colour tokens with live contrast ratios and WCAG verdicts" src="preview/palette-light.svg">
</picture>

</details>

<details>
<summary><b>Typography</b> — two families, one hard rule</summary>

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="preview/type-dark.svg">
  <img alt="Type scale specimen from hero to secondary text" src="preview/type-light.svg">
</picture>

Anything a machine produced is monospace; anything a person wrote is sans.

</details>

---

## 03 // THE CANON

Six invariants, independent of medium. Whether an output belongs to this system is
decided here.

| | Rule |
|---|---|
| `C01` | **Zero radius.** No rounded corners; the only exception is the status pulse dot. |
| `C02` | **CAD indexing.** Every section opens with a two-digit monospace tag: `01 // SECTION`. |
| `C03` | **One chromatic accent.** No colour but mint; mint stays under 10% of visible area. |
| `C04` | **Rules, not shadows.** Crisp rules instead of blur, gradients and texture. |
| `C05` | **Telemetry colophon.** Every output carries revision, ISO date and status. |
| `C06` | **Asymmetry.** A 40/60 split by default; nothing is centred. |

Full detail and the red lines: **[`SKILL.md`](SKILL.md)**

---

## 04 // DOCS

| Medium | |
|---|---|
| Web — React, Tailwind, HTML | [`10-web.md`](references/10-web.md) |
| Applications — desktop, mobile | [`11-app.md`](references/11-app.md) |
| Print and PDF | [`12-print.md`](references/12-print.md) |
| Office — PPTX, DOCX, XLSX | [`13-office.md`](references/13-office.md) |
| Terminal and CLI | [`14-terminal.md`](references/14-terminal.md) |
| Data visualisation | [`15-data-viz.md`](references/15-data-viz.md) |
| Brand assets | [`16-brand-assets.md`](references/16-brand-assets.md) |

Base layer, applying to all of them:
[colour and scale](references/01-foundations.md) ·
[typography](references/02-typography.md) ·
[motion and sound](references/03-motion-sound.md) ·
[voice and format](references/04-voice.md) ·
[delivery checklist](references/99-checklist.md)

---

## 05 // TOKENS

`tokens/tokens.json` is the only file edited by hand. Everything else is generated
from it.

```
tokens.json ──▶ tokens.css · tokens.scss · tokens.ts · tailwind.preset.cjs
                tokens.py  · tokens.dart · tokens.resolved.json
                preview/*.svg          the showcase above
                check-contrast         WCAG gate, non-zero exit on failure
```

<details>
<summary><b>Using the tokens in a project</b></summary>

<br>

**Web**

```js
// tailwind.config.js — the preset replaces the palette, so an off-palette
// colour produces no class and fails at build time.
module.exports = { presets: [require('./vendor/snm/tailwind.preset.cjs')] };
```

**Python — PDF and charts**

```python
from snm.tokens import token, rgb
fill = rgb("accent")            # (0.06, 0.73, 0.51)
```

**Flutter**

```dart
import 'snm/tokens.dart';
Container(color: SnmLight.bgRaised, ...)
```

**TypeScript — canvas, SVG, email**

```ts
import { token, cssVar } from '@snm/tokens';
ctx.fillStyle = token('bgInverse');
```

</details>

<details>
<summary><b>Changing a token</b></summary>

<br>

```bash
# 1  edit tokens/tokens.json
npm run build      # regenerate every binding and the showcase
npm run check      # 34 contrast pairs, both themes
# 2  raise $meta.version, record it in CHANGELOG.md
```

The gate also holds guard tests over tones banned for text, so a future palette
edit cannot quietly make them look safe. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

</details>

---

## 06 // LAYOUT

```
SKILL.md          the constitution — also the skill entry point
references/       12 medium and base-layer references
tokens/           tokens.json + generated bindings in dist/
assets/           web · print · office reference implementations
scripts/          build · preview · contrast gate
preview/          generated showcase — do not edit
install.ps1 .sh   installers
```

The repository root *is* the skill: the installer links it into
`~/.claude/skills/`, so there is no packaged copy to fall out of date.

---

```
OKAN ÖZTÜRK · joxinyks.com
REV 1.1.0 · STATUS: OPERATIONAL · LICENCE: MIT
```
