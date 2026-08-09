# CHANGELOG

Versioning: `MAJOR.MINOR.PATCH`.
**MAJOR** a visual break — existing outputs must be regenerated ·
**MINOR** a new token, rule or medium · **PATCH** a fix or clarification.

---

## 1.2.0 — 2026-08-09

The system could be read, but not taken. This closes the gap between what the
documentation promised and what the repository actually delivered, and puts the
canon under a gate instead of under a checklist.

### Added
- **`scripts/vendor.mjs`** and `npm run vendor`. The README described four
  different import paths — `@snm/tokens`, `./vendor/snm/`, `snm.tokens`,
  `snm/tokens.dart` — and `references/10-web.md` a fifth. None of them resolved:
  the package is private, unpublished, and has no Python or Dart distribution.
  There is now one documented path, and it works.

- **`tokens/dist/package.json`**, generated. The delivery surface is a real
  package, so `npm i file:./vendor/snm` turns the relative paths into the bare
  `@snm/tokens` specifier for projects that prefer it. Its version is read from
  `tokens.json` and can never disagree with the tokens it ships.

- **`scripts/check-canon.mjs`** and `npm run check:canon` — the second gate.
  Contrast was measured; the other five canon items were enforced only by a
  human reading `99-checklist.md`. It now scans hand-written source for a
  non-zero radius, blur, gradient, blurred `box-shadow`, `transition: all` and
  the `vh` unit; verifies every literal colour outside `tokens.json` resolves to
  a real token value; checks the version agrees with itself across all six places
  it is stated; and exercises each shipped ESLint rule against a violation it
  must catch and a clean line it must not flag.

- `SNM-ALLOW` as the single, documented escape hatch from that gate. Three lines
  carry it, each stating its reason.

- CI now runs the canon gate, parses `install.ps1` (only `install.sh` was
  checked, on a Windows-first system), and smoke-tests the vendor path end to
  end.

### Fixed
- **The terminal panel was invisible in the dark showcase.** It took `bg-inverse`
  as its background, which resolves to bone in the dark theme — bone text on a
  bone panel. It is pinned now, like the slide: a terminal is dark in both
  themes.

- **The showcase was only partly generated from the tokens**, despite the README
  claiming otherwise. The print, slide and terminal panels carried nine
  hand-written hex values duplicating token values, so a palette edit would have
  left them behind. They resolve through the tokens now, pinned to a theme where
  the medium demands it.

- The lint config's usage example pointed at a package that did not exist, and
  `10-web.md` disagreed with the README about how to install the Tailwind preset.

### Changed
- `tokens.json` no longer claims a `$schema` that does not exist. The DTCG has
  published no JSON Schema, and this file would not validate against one anyway —
  themed tokens carry a light/dark pair rather than a `$value`. A `$format` block
  states the relationship honestly.

- README gained a licence section. MIT covers the code, the tokens and the
  documentation; it does not hand over the name or the signature palette.

- `CONTRIBUTING.md` documents the gate, the escape hatch and the vendor path;
  its sections renumbered to accommodate them.

---

## 1.1.0 — 2026-08-09

The repository is restructured around its visitors rather than its packaging.

### Changed
- **The system moved to the repository root.** `references/`, `tokens/`, `assets/`
  and `scripts/` were buried two levels down under `skills/swiss-neo-monolith/`,
  so a visitor landing on the repository saw installer scripts and a `skills`
  folder rather than the system itself. The root **is** the skill now: it carries
  `SKILL.md`, and the installer links the root into `~/.claude/skills/`.

  A `dist/skill` packaging step was considered and rejected — it would duplicate
  every file and, worse, break live editing in `-Link` mode on the development
  machine.

- **README restructured as a landing page.** Installation was buried behind four
  full-width showcase images; it is now the first section. The four-medium
  comparison stays open as the hero, and the remaining sheets sit in `<details>`
  blocks so the page stays short without hiding anything.

- **Preview sheets re-authored at 880px** — roughly GitHub's README content
  column. The previous 1200px sheets were scaled to about 73%, which rendered
  12px labels at 9px and made the measured contrast figures, the best detail on
  the colour sheet, effectively unreadable. The media sheet also moved from four
  columns to a 2×2 grid, doubling the width of each panel.

- Preview output moved from `.github/preview/` to `preview/` — it is content, not
  repository plumbing.

### Added
- **Social card** (`preview/social-{light,dark}.svg`, 1280×640) for GitHub's Open
  Graph slot, so a shared link renders as something other than a blank card.
- The banner now states the six canon codes instead of leaving its right column
  half empty.
- CI additionally checks that `SKILL.md` still has its frontmatter and a complete
  routing table — without either, the skill silently stops triggering.
- Copy-mode installs now exclude `.git`, `node_modules` and `.github`.

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
