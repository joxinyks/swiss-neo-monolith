# CHANGELOG

Versioning: `MAJOR.MINOR.PATCH`.
**MAJOR** a visual break — existing outputs must be regenerated ·
**MINOR** a new token, rule or medium · **PATCH** a fix or clarification.

---

## 1.0.2 — 2026-08-09

The repository becomes self-demonstrating, and switches to English throughout.

### Added
- **Generated visual showcase** — `scripts/build-previews.mjs` renders five sheets
  in both themes into `.github/preview/`: banner, colour, typography, components,
  and the four-medium comparison. Every figure comes from the tokens, so the
  showcase cannot drift from the system it documents; the contrast ratios printed
  on the colour sheet are computed at build time.
- **CI** (`.github/workflows/verify.yml`) — compiles bindings, regenerates the
  showcase, fails if the committed generated files differ from a fresh build,
  runs the contrast gate, and syntax-checks the POSIX installer.
- **`CONTRIBUTING.md`** — the one-file rule, the procedure for adding a colour or
  a medium, and what must never be added.
- **`scripts/lib/color.mjs`** — WCAG maths shared by the contrast gate and the
  preview generator, so both report identical numbers.
- **`$meta.updated`** in `tokens.json`, used as the build date. Deliberately not
  a wall-clock date: the generated SVGs are committed and CI verifies that a
  rebuild reproduces them exactly, which a changing date would make impossible.

### Fixed
- **Banner alignment.** The hand-written banner sized its wordmark against Inter's
  metrics, so on machines falling back to Arial "NEO-MONOLITH" overran the 40/60
  divider. The generated banner pins it with `textLength`, which holds regardless
  of the available font.
- **Signature mark.** The mint bar spanned only the first of the two wordmark
  lines; it now runs cap height to baseline across both.
- **Version drift.** The banner carried a hard-coded revision that fell out of date
  the moment the version changed. It now reads from `$meta.version`, as does every
  other generated sheet.

### Changed
- **Repository language is now English** — `SKILL.md`, all twelve references,
  `README.md`, `CHANGELOG.md`, installer output, lint messages and audit labels.
  Turkish remains only as example content inside the documentation, and the
  Turkish uppercase guidance in `02-typography.md` is unchanged.
- **README** leads with the showcase: what the system looks like comes before how
  to install it.
- `npm run build` now compiles bindings *and* regenerates the showcase;
  `build:tokens` and `build:previews` run them individually.

---

## 1.0.1 — 2026-08-09

Presentation-layer fix. No token values changed.

### Added
- Theme-aware repository banner selected through `<picture>`.

### Changed
- README rewritten in the system's own language: CAD-numbered sections,
  `flat-square` badges, monospace telemetry colophon.
- Installer output brought in line with `references/14-terminal.md` — CAD heading,
  aligned columns, telemetry line.
- Installers now return a non-zero exit code when verification fails, and
  distinguish `PARTIAL` from `DONE`.

---

## 1.0.0 — 2026-08-09

Initial release. From a single-medium style document to a cross-medium signature
system.

### Added
- **The Canon** — six medium-independent invariants (C01–C06).
- **Token pipeline** — `tokens.json` as single source of truth, generating CSS,
  SCSS, TypeScript, a Tailwind preset, Python, Dart and a platform-neutral JSON.
- **Semantic token layer** with light and dark counterparts; product code no
  longer touches primitive colours.
- **Dark theme** — `[data-theme]` overrides the OS preference in both directions.
- **Contrast gate** (`check-contrast.mjs`) — 34 pairs audited against WCAG,
  suitable for CI.
- **New media** — applications (desktop and mobile), print/PDF, PPTX/DOCX/XLSX,
  terminal/CLI, data visualisation, brand assets.
- **Sound contract** — off by default, persisted preference, gesture-gated start,
  silent under reduced motion.
- **Reference implementations** — `FooterGlobal.tsx`, `useMechanicalClick.ts`,
  `print.css`, `eslint-snm.cjs`, and the Office theme scheme.
- **Delivery checklist** (`99-checklist.md`).
- **Installers** for Windows and POSIX, in copy or live-link mode.

### Fixed (accessibility)
- `mint-500` was used as text on bone at **2.3:1**, far below AA. Text now uses
  `mint-700` (`textAccent`, 4.96:1) and meaning-bearing icons and rules use
  `mint-600` (`accentUi`, 3.41:1). `mint-500` is now fills and dark-surface text
  only.
- `steel-500` (`#6b7280`) was the secondary body colour at **4.38:1**, just short
  of AA. `textMuted` is now `steel-600` (`#4b5563`, 6.84:1).
- `warn` (`#a16207`) sat at **4.46:1** → `#92400e` (6.42:1).
- No focus ring was defined; added the `focus` token and a mandatory
  `:focus-visible` rule.

### Changed
- **Radius reset** moved from a global `!important` to an `@layer base` reset.
- **`100vh` → `100dvh`**; header height moved from hard-coded values to a token.
- **Viewport lock** now disabled below `min-height: 700px` — it made content
  unreachable on short screens and at 200% zoom (WCAG 1.4.10).
- **Shadow policy** made explicit: blurred shadows forbidden, hard offset
  (`2px 2px 0`) standard. The `shadow-sm` in the original examples was removed.
- **`transition: all`** forbidden; enumerated properties required.
- **Arbitrary Tailwind values** (`bg-[#121316]`) forbidden; the preset replaces
  the palette and an ESLint rule catches violations.
- **Typography** completed with scale, weight, tracking and leading tables;
  `tabular-nums` made mandatory.
- **Turkish uppercase** — CSS `text-transform: uppercase` forbidden (it maps
  `i` to `I`, not `İ`); system labels are English and written uppercase at source.
- **Structure** split from one file into a routed reference set (progressive
  disclosure).
