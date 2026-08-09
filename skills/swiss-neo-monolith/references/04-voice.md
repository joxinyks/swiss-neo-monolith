# 04 // VOICE & CONTENT

A visual language implies a tone of voice. This file fixes that tone — half of
consistency lives in word choice, not typography.

## Tone

**Speak like an instrument.** Precise, short, unembellished. An engineering
drawing does not praise itself; it states its measurement.

| Use | Avoid |
|---|---|
| "Response time: under 24 hours" | "We'll get right back to you!" |
| "12 projects delivered" | "Countless successful projects" |
| "Out of scope" | "Unfortunately we can't offer that 😔" |
| "REV 04 · 2026-08-09" | "Last updated: last week" |

Rules: no exclamation marks · no emoji · no superlatives ("best", "unique",
"revolutionary") · no marketing clichés · no editorial "we" in a one-person
studio — use first person singular or neutral phrasing.

## Label language

System labels — CAD indexes, status, colophons — stay **English and technical**;
narrative copy follows the content's language. This duality is deliberate: the
machine layer speaks English, the human layer speaks the reader's language. It
also sidesteps the Turkish uppercase problem entirely.

The standard label vocabulary; do not invent outside it:

```
STATUS   REV      SECTION   INDEX    SCOPE    STACK    ROLE
CLIENT   PERIOD   DELIVERY  SLA      SOURCE   OUTPUT   NOTE
OPERATIONAL   IN PROGRESS   ARCHIVED   DRAFT   FINAL   CONFIDENTIAL
```

## Number and date formats

All monospace, all `tabular-nums`.

| Kind | Format | Example |
|---|---|---|
| Date (system, colophon) | ISO 8601 | `2026-08-09` |
| Date (narrative) | `Intl`, content locale | `9 Ağustos 2026` · `9 August 2026` |
| Date + time | ISO + zone | `2026-08-09 14:30 TRT` |
| Range | en dash, unspaced | `2024–2026` |
| Revision | `REV` + two digits | `REV 04` |
| Percentage | locale convention | `%98` (tr) · `98%` (en) |
| Currency (TRY) | `Intl` `tr-TR` | `12.500,00 ₺` |
| Currency (USD) | `Intl` `en-US` | `$12,500.00` |
| File size | decimal, single space | `2.4 MB` |
| Duration | abbreviated unit | `180ms` · `<24h` |
| Counter | zero-padded, `/` separated | `03 / 12` |

Dates and currency are **always** formatted through `Intl.DateTimeFormat` and
`Intl.NumberFormat`. Never assemble them by string concatenation.

## Heading style

- Sans headings: sentence case. "System architecture", not "System Architecture".
- Mono labels: all caps, written uppercase in the source.
- No full stops in headings; colons are fine.
- No question-form headings.

## Empty and error states

An empty state is a measurement, not an apology:

```
00 // NO RECORDS
No entries match this filter.
[ RESET FILTER ]
```

An error message has three parts: what happened · why · what can be done. No
blaming language — "email address not recognised", not "you entered an invalid
address".

## Accessible text

- Every image has `alt`; decorative images use `alt=""`.
- CAD indexes are decorative — hide them from screen readers with `aria-hidden`
  while keeping the heading itself accessible.
- Icon-only buttons require `aria-label`.
- Link text must make sense out of context — never "click here".
- Set `lang` on any section that changes language.
