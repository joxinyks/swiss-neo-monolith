# 11 // APPLICATIONS (desktop & mobile)

An application differs from a site in two respects: **density** and **platform
contract**. The canon does not change; the measurements do.

## Density

A web page breathes; an application works. Tighten by one step:

| | Web | Application |
|---|---|---|
| Body text | `base` 16px | `sm` 14px |
| Row height (list, table) | 48px | 32px |
| Section gap | `s7` 48px | `s5` 24px |
| Card padding | `s6` 32px | `s4` 16px |
| Button height | 48px | 36px desktop / 44px touch |

The 44px touch minimum may drop to 28px on desktop — pointer precision differs —
but **the keyboard focus ring stays full size in both cases**.

## Platform contract

This system rides on top of the platform; it does not override it. Respect:

- **Window chrome** — the OS title bar, traffic lights and window management. If
  you must draw your own title bar: 36px tall, `bgSunken`, a 1px rule beneath, and
  a defined drag region (`-webkit-app-region: drag`).
- **Shortcuts** — platform standards (⌘ / Ctrl). Do not invent your own.
- **Scrolling** — OS default behaviour; scrolljacking is forbidden.
- **System theme** — the app adopts the OS theme at launch; the user may override.
- **Safe areas** — always apply `safe-area-inset-*` on mobile (notch, home bar).
- **Back gesture** — never intercept the iOS/Android system back gesture.

Mandatory platform controls (iOS switch, Android date picker, native menus) keep
their own radii; this is not a SNM-CANON-01 violation. Do not redraw them —
conformance outranks consistency here.

## Application shell

```
+--------------------------------------------------+
| TITLEBAR   36px · bgSunken · 1px rule beneath     |
+------------+-------------------------------------+
| SIDEBAR    | CONTENT                             |
| 240px      | min-w-0, own scroll container       |
| bgSunken   |                                     |
| 1px rule   |                                     |
| on right   |                                     |
+------------+-------------------------------------+
| STATUS BAR 24px · mono micro · TELEMETRY         |
+--------------------------------------------------+
```

**The status bar is the application's form of SNM-CANON-05** and is not optional.
It carries connection state (pulse + label), active context, revision and clock,
in mono `micro`.

Sidebar items: 32px tall, 12px icon, mono `xs` label. The active item takes a 2px
mint bar on its leading edge — a rule, not a filled background.

## Mobile

- Bottom navigation 56px plus safe area; five tabs maximum; the active tab takes a
  mint top rule.
- App bar 56px with a left-aligned title (not centred — SNM-CANON-06).
- List rows 56px, mono meta value on the right, 1px rule beneath.
- Pull-to-refresh: a 2px mint line instead of a spinner.
- Full-screen sheets rather than modals: 2px rule on top, left-aligned title,
  `✕` on the right.

## Framework notes

| Framework | Token file | Notes |
|---|---|---|
| Electron / Tauri | `tokens.css` | Web rules apply; reduce density. Define `-webkit-app-region`. |
| React Native | `tokens.ts` | `borderRadius: 0` as a theme constant; `Platform.select` for density. Use `borderWidth`, not shadow. |
| Flutter | `tokens.dart` | `BorderRadius.zero` globally; set `elevation: 0` and `side: BorderSide(width: 2)` in `CardTheme`, `InputDecorationTheme`, `ElevatedButtonTheme`. |
| SwiftUI / Compose | `tokens.resolved.json` | Sync colours into the asset catalogue; `.cornerRadius(0)`. |

In Flutter, Material's default blurred elevation **must be zeroed in both
themes**: `ThemeData(useMaterial3: true, cardTheme: CardTheme(elevation: 0, …))`.

## Application-specific accessibility

- Screen-reader labels (`Semantics` / `accessibilityLabel`) on every interactive
  element.
- Support dynamic type (iOS Dynamic Type, Android font scale): use scaling units
  rather than fixed `px`. The layout must survive 200% scale.
- Focus order matches visual order.
- Critical flows are completable by button, not only by gesture.
