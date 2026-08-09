# 03 // MOTION & SOUND

Motion is mechanical, not organic. This system is a machine, not a bubble.

## Principles

1. **No springs, no bounce, no overshoot.** Spring, bounce and elastic easings are
   forbidden.
2. **Orthogonal movement.** Elements travel on the X or Y axis only. No diagonal
   drift, no `scale` animation, no rotation except in 90° increments.
3. **Whole pixels.** No sub-pixel travel; distances come from the spacing scale.
4. **Short.** No interface transition exceeds 320ms.
5. **Opacity alone is not enough.** A fade-in is always paired with an 8–16px
   translation.

## Tokens

| | Duration | Use |
|---|---|---|
| `fast` | 120ms | Hover, focus, colour change, button press |
| `base` | 180ms | Dropdown, tab change, accordion |
| `slow` | 320ms | Modal, page transition, drawer |

Easing: `mech` = `cubic-bezier(0.2, 0, 0, 1)` is the default — sharp attack, hard
settle. `out` = `cubic-bezier(0.16, 1, 0.3, 1)` for entrances. `step` =
`steps(4, end)` for telemetry counters and loaders, deliberately discrete, like a
digital instrument.

## Property rule

`transition: all` is **forbidden**. Always enumerate:

```css
transition: background-color var(--snm-duration-fast) var(--snm-ease-mech),
            border-color     var(--snm-duration-fast) var(--snm-ease-mech),
            color            var(--snm-duration-fast) var(--snm-ease-mech);
```

Animatable properties: `opacity`, `transform`, `background-color`, `border-color`,
`color`, and `box-shadow` (offset shadows). Layout properties (`width`, `height`,
`top`, `margin`) are never animated — use `transform`.

## Tactile press

The system's signature interaction. On press the hard offset shadow closes and the
element settles into it, like a stiff mechanical key:

```css
.snm-btn {
  box-shadow: var(--snm-elevation-1);      /* 2px 2px 0 */
  transition: transform var(--snm-duration-fast) var(--snm-ease-mech),
              box-shadow var(--snm-duration-fast) var(--snm-ease-mech);
}
.snm-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 0 var(--snm-border-strong);
}
```

Every medium echoes this: the same 2px displacement on mobile press, a `▌` marker
on the selected terminal row, and — in static print — the shadow always closed.

## prefers-reduced-motion

Mandatory. `tokens.css` zeroes the duration tokens automatically; add:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

Parallax, autoplaying loops and pulse effects stop entirely in this mode.

## Sound — the mechanical click

Synthesised with the Web Audio API; no audio files are loaded.

**Non-negotiable rules:**

1. **Off by default.** Nothing sounds on page load.
2. A visible toggle exists; the preference persists in `localStorage`
   (`snm.sound = "on" | "off"`).
3. The `AudioContext` is created and resumed only after a real user gesture —
   otherwise the browser blocks it and the console fills with warnings.
4. Silent when `prefers-reduced-motion: reduce` is set, or the system is muted.
5. Sound accompanies **user-initiated** events only. Automatic events,
   notifications and page loads are silent.
6. Peak gain never exceeds `0.08`; duration stays under 40ms. This is a click, not
   a tone.

Reference implementation: `assets/web/useMechanicalClick.ts`.

## Cursor and hover

`CursorPreview` — the image preview that follows the pointer over project rows —
is enabled only under `@media (hover: hover) and (pointer: fine)`. On touch it is
disabled entirely and replaced by an inline thumbnail.

Follow motion is smoothed with a lerp, but lag never exceeds 60ms; a cursor that
drags behind contradicts the system's hardness.

## Loading states

No spinners — rotation is forbidden. Instead:

- **Determinate**: a 2px, mint-filled, square-capped progress bar.
- **Indeterminate**: a 2px band advancing in `steps()`, or a monospace counter
  (`LOADING 03/12`).
- **Skeleton**: filled with `bgSunken`, either static or pulsing in opacity only.
  A travelling gradient shimmer is **forbidden** — it violates the gradient ban.
