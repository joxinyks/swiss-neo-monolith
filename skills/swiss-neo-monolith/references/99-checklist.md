# 99 // DELIVERY CHECKLIST

Run this before delivering. If a single item fails, the output is not SNM.

## Canon (every medium)

- [ ] **C01** No rounded corners anywhere (status pulse and mandatory platform controls excepted)
- [ ] **C02** Every meaningful section carries a two-digit zero-padded CAD index (`01 //`)
- [ ] **C03** No chromatic colour but mint; mint stays under 10% of visible area
- [ ] **C04** No blurred shadow, gradient, blur, glassmorphism or texture
- [ ] **C05** The output carries a telemetry colophon (revision · ISO date · status/counter)
- [ ] **C06** Composition is asymmetric; body copy left aligned, not centred

## Token discipline

- [ ] No hand-written hex or rgb values in code
- [ ] Spacing values come only from the scale (4 8 12 16 24 32 48 64 96 128)
- [ ] Sizes come only from the type scale
- [ ] Nothing in `tokens/dist/` was hand-edited; bindings rebuilt after any `tokens.json` change

## Typography

- [ ] Only Inter and JetBrains Mono; no third family
- [ ] Data, labels, dates and numbers are monospace; narrative is sans
- [ ] `tabular-nums` wherever numbers appear
- [ ] No `text-align: justify`; hyphenation off
- [ ] Body measure at or below 68ch
- [ ] Turkish uppercase written in the source, not via CSS `uppercase`
- [ ] Uppercase mono labels carry +0.08em tracking

## Colour and contrast

- [ ] Body text contrast ≥ 4.5:1, computed rather than assumed
- [ ] Icon, rule and graphic contrast ≥ 3:1
- [ ] No `mint-500` text on bone (use `mint-700`)
- [ ] `steel-500` not used as body text (use `steel-600`)
- [ ] No information encoded in colour alone
- [ ] All thresholds also hold in the dark theme

## Motion and sound

- [ ] No `transition: all`; properties enumerated
- [ ] Durations ≤ 320ms with `mech`/`out` easing; no spring or bounce
- [ ] `prefers-reduced-motion` honoured
- [ ] Sound off by default, toggle present, preference persisted, started after a gesture
- [ ] No rotating spinners

## Accessibility

- [ ] Visible `:focus-visible` ring on every interactive element
- [ ] Every flow completable by keyboard
- [ ] Touch targets ≥ 44×44px (≥ 28px on desktop)
- [ ] Heading hierarchy unbroken; landmarks defined
- [ ] `alt` on images, `aria-label` on icon-only buttons
- [ ] No content loss or horizontal scrolling at 200% zoom
- [ ] Viewport lock disabled on short screens

## Layout

- [ ] `100dvh` used, no `100vh`
- [ ] Header height from a token, not hard-coded
- [ ] `min-w-0` on grid children (overflow guard)
- [ ] The 40/60 split collapses cleanly at the mobile breakpoint

## Per medium

**Web** — fonts preloaded · `content-visibility` · image dimensions set · skip link · global footer rendered
**Application** — status bar present · platform shortcuts · safe areas · dynamic type · Material/Cupertino elevation zeroed
**Print** — running foot on every page · body in K100 · fonts embedded · tagged structure · 300dpi images · link URLs printed
**Office** — theme colours defined · real styles used, no direct formatting · ISO dates · no zebra striping
**Terminal** — `NO_COLOR` honoured · colour off when not a TTY · sharp box characters · ASCII fallback
**Charts** — Y axis from zero · no rounded caps · source colophon · text alternative · distinguishable without colour
**Brand** — logo clear space respected · icons at 1.5px butt/miter · OG image 1200×630 · inline CSS in email

## Final check

Place the output beside an earlier SNM output. Do they look like the work of one
hand? If not, find which canon item drifted.
