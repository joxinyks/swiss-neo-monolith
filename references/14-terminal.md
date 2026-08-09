# 14 // TERMINAL & CLI

A CLI is a designed surface too. This system's CAD aesthetic sits naturally in a
terminal — it is already a monospace world.

## Colour

Terminals support 256 colours or truecolor, but **colour is never the sole carrier
of information**; a symbol or label always accompanies it, for `NO_COLOR`, pipes
and log files.

| Role | Truecolor | ANSI 256 fallback |
|---|---|---|
| Accent, success | `#10b981` | `\e[38;5;42m` |
| Text | default | — |
| Dim, meta | `#6b7280` | `\e[38;5;244m` |
| Error | `#f87171` | `\e[38;5;203m` |
| Warning | `#fbbf24` | `\e[38;5;220m` |
| Info | `#93c5fd` | `\e[38;5;111m` |

Required: honour `NO_COLOR` · disable colour when stdout is not a TTY · provide
`--no-color` · support `FORCE_COLOR`.

## Box drawing

Only **sharp-cornered** Unicode box-drawing characters. Rounded corners
(`╭ ╮ ╰ ╯`) violate SNM-CANON-01.

```
┌─────────────────────────────────────────────┐
│ 01 // BUILD                        REV 1.0.1│
├─────────────────────────────────────────────┤
│ ● tokens        compiled          110 tokens│
│ ● contrast      passed             34 pairs │
│ ○ previews      pending                     │
└─────────────────────────────────────────────┘
 OKAN ÖZTÜRK · 2026-08-09 14:30 · 1.24s
```

ASCII fallback (`--ascii`, or when Unicode is unsupported): `+ - |`.

## Heading and colophon (SNM-CANON-02 / 05)

Every command opens with a CAD heading and closes with a telemetry line:

```
01 // BUILD                                  REV 1.0.1
…
─────────────────────────────────────────────────────
DONE · 110 tokens · 1.24s · 2026-08-09 14:30
```

The telemetry line carries outcome · count · duration · ISO timestamp, dimmed.

## Status symbols

```
●  done          ○  pending       ◐  running
✕  error         !  warning       →  info / step
```

No emoji. Nothing rotates — use a four-frame `◐ ◓ ◑ ◒` cycle driven by `steps`, or
a fixed `◐` with a counter (`03/12`).

Progress bar: `████████░░░░░░░░  62%` — sharp block characters, no rounded caps.

## Alignment

- Table columns are fixed width and left aligned; numbers are right aligned.
- Read the terminal width (`process.stdout.columns`); below 80 columns switch to a
  reduced layout.
- Indent by two spaces. Never use tabs.

## Log format

Machine readable and still recognisably SNM:

```
2026-08-09T14:30:12Z  INFO   build    tokens compiled  count=110 dur=1.24s
2026-08-09T14:30:13Z  ERROR  build    contrast failed  pair=steel500/bone200 ratio=4.38
```

ISO 8601 UTC timestamp · fixed-width level · component · message · `key=value`
structured fields. JSON logs use the same field names.

## Help text

```
snm — Swiss Neo-Monolith toolkit

USAGE
  snm <command> [options]

COMMANDS
  build            compile token bindings
  check            run the contrast and canon audit
  preview          regenerate the visual showcase

OPTIONS
  --no-color       disable coloured output
  --ascii          use ASCII box characters
  -v, --version    print version

  Okan Öztürk · joxinyks.com
```

Section headings uppercase, two-space indent, aligned description column.

## Interactive prompts

- Selection list: a `❯` marker (not an arrow); the selected row in mint.
- Confirmation: `[y/N]` for destructive operations, defaulting to no.
- When not attached to a TTY, interactive mode switches off and the command
  errors — it never silently falls back to a default.
