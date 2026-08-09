# 00 // CONTRIBUTING

This is a personal design system, so "contributing" mostly means changing it
without breaking it. These are the working rules.

---

## 01 // THE ONE RULE

**`tokens/tokens.json` is the only file edited by hand.**

Everything under `tokens/dist/` and `preview/` is generated. Editing a generated
file is not a small shortcut — it silently desynchronises the system, and the next
build erases the change.

```bash
npm run build     # tokens -> bindings, and regenerate the showcase
npm run check     # WCAG gate
npm run verify    # both, in order
```

---

## 02 // BEFORE OPENING A PULL REQUEST

- [ ] `npm run verify` passes locally
- [ ] Generated files are committed alongside their source (`tokens/dist/` and
      `preview/` are tracked deliberately, so consumers need no toolchain)
- [ ] `$meta.version` raised, and `CHANGELOG.md` records the change
- [ ] Any new rule is reflected in `references/99-checklist.md`
- [ ] No Turkish in repository files — the repository is English throughout.
      Turkish appears only as example content inside documentation.

---

## 03 // ADDING OR CHANGING A COLOUR

A colour is not accepted on appearance. It is accepted on measurement.

1. Add the primitive under `color.*` in `tokens.json`, with a `$description`
   stating its contrast against bone or obsidian.
2. Bind it to a semantic token — product code never references primitives.
3. Add the pair to `PAIRS` in `scripts/check-contrast.mjs` with the threshold it
   must meet.
4. If the tone is unsafe for some use, add a **guard** entry so a later edit
   cannot make it silently acceptable.
5. Run `npm run verify`. A failure is a real finding; fix the colour rather than
   the test.

Thresholds: body text 4.5:1 · large text 3:1 · icons, rules and graphics 3:1.

---

## 04 // ADDING A MEDIUM

1. Create `references/NN-name.md`, numbered in the existing sequence.
2. Add it to the routing table in `SKILL.md` — an unrouted reference will not be
   read.
3. Add its per-medium block to `references/99-checklist.md`.
4. State how each of the six canon items is expressed in that medium. If one
   cannot be expressed, say so explicitly and explain what replaces it.

---

## 05 // CHANGING THE CANON

The canon is the reason outputs from different media look related. Changing it
invalidates existing work, so:

- A canon change is always a `MAJOR` version.
- Record in `CHANGELOG.md` which existing outputs need regenerating.
- Update every reference that restates the rule; the canon is quoted in several
  places by design, and a half-applied change is worse than none.

---

## 06 // COMMIT STYLE

Commit subjects follow the system's own indexing:

```
02 // Fix banner alignment and version drift
```

A two-digit index, ` // `, then a sentence-case summary. The body explains the
reasoning, not the diff.

---

## 07 // WHAT NOT TO ADD

- A third font family
- A second chromatic accent
- Blur, gradients, glassmorphism, or any rounded corner
- A dependency in the token pipeline — the scripts are deliberately zero-dependency
  Node, so any machine with Node 18+ can build the system
- A packaged copy of the system. The repository root *is* the skill; a `dist/skill`
  step would duplicate every file and break live editing on the dev machine.

---

## 08 // PREVIEW SHEETS

`scripts/build-previews.mjs` authors at **880px**, which is roughly GitHub's README
content column. Anything wider is scaled down and its type shrinks with it — an
earlier 1200px version rendered 12px labels at about 9px and the contrast figures
became unreadable. If you add a sheet, keep it at 880 and keep body type at 12px
or above. The social card is the one exception at 1280×640, sized for Open Graph.

---

```
OKAN ÖZTÜRK · joxinyks.com
STATUS: OPERATIONAL · LICENCE: MIT
```
