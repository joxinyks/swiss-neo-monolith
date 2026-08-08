# 10 // WEB

React + Tailwind varsayılan; düz HTML/CSS için `tokens.css` doğrudan kullanılır.

## Kurulum

```js
// tailwind.config.js
module.exports = {
  presets: [require('./node_modules/@snm/tokens/tailwind.preset.cjs')],
  content: ['./src/**/*.{ts,tsx}'],
};
```

```css
/* app.css — en üstte */
@import '@snm/tokens/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Preset renk ve aralık ölçeklerini **değiştirir** (extend etmez): palette dışı bir
renk veya ölçek dışı bir aralık yazdığında sınıf üretilmez ve hatayı derlemede
görürsün. Bu kasıtlıdır.

**Arbitrary değer yasağı:** `bg-[#121316]`, `p-[10px]`, `text-[11px]` yazma.
ESLint ile zorla: `assets/web/eslint-snm.cjs`.

## Layout

### Sahne (viewport-locked hero)

```jsx
<section className="min-h-stage overflow-hidden max-[699px]:min-h-0 max-[699px]:overflow-visible">
```

- `100dvh` kullanılır, `100vh` **asla** (mobil adres çubuğu).
- Header yüksekliği token'dan gelir (`--snm-header-h`), hardcode edilmez.
- Viewport kilidi yalnızca `@media (min-height: 700px)` altında uygulanır. Kısa
  ekranda, yatay telefonda ve %200 zoom'da içerik doğal akar — aksi hâlde içerik
  erişilemez hâle gelir (WCAG 1.4.10).

### 40/60 asimetrik yapışkan ızgara

```jsx
<div className="grid grid-cols-1 lg:grid-cols-[40fr_60fr] gap-6">
  <aside className="lg:sticky lg:top-header lg:h-stage lg:overflow-hidden">…</aside>
  <div className="min-w-0">…</div>
</div>
```

Mobilde tek kolona iner, `aside` yapışkanlığını kaybeder ve **üstte** kalır.
`min-w-0` zorunlu — yoksa uzun içerik grid'i taşırır.

## Komponent kataloğu

### Buton

Üç varyant. Hepsi 0 yarıçap, hepsi `44px` minimum hit alanı.

```jsx
// primary — obsidyen dolgu
"bg-inverse text-inverse border-2 border-border-strong px-5 py-3
 font-mono text-micro font-bold uppercase tracking-[0.08em]
 shadow-1 transition-[transform,box-shadow,background-color]
 duration-fast ease-mech
 hover:bg-accent-press hover:text-inverse
 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
 focus-visible:outline-focus
 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"

// secondary — kontur
"bg-transparent text-text border-2 border-border-strong … hover:bg-inverse hover:text-inverse"

// ghost — yalnızca alt çizgi
"bg-transparent text-text border-b border-border … hover:border-border-strong"
```

Buton içeriği her zaman mono + büyük harf. İkon soldaysa 16px, `gap-2`.

### Input / Textarea / Select

```jsx
"w-full bg-raised text-text border-2 border-border-strong px-4 py-3
 font-mono text-sm placeholder:text-muted
 focus:outline-none focus:border-accent-press
 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
 focus-visible:outline-focus
 aria-[invalid=true]:border-danger"
```

- `<label>` **zorunlu**, gizlenmiş placeholder-label kabul edilmez.
- Hata mesajı input'un altında, `role="alert"`, mono, `text-xs`, `text-danger`,
  yanında bir uyarı ikonu (renk tek başına anlam taşımaz).
- Zorunlu alan `*` ile değil, opsiyonel alan `(opsiyonel)` ile işaretlenir.

### CAD sosyal / bağlantı satırı

```jsx
<a href="…" target="_blank" rel="noreferrer"
  className="group flex items-center justify-between gap-3 border border-border
             bg-raised px-4 py-3 font-mono text-text
             transition-[background-color,border-color,color] duration-fast ease-mech
             hover:border-border-strong hover:bg-inverse hover:text-inverse
             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
             focus-visible:outline-focus">
  <span className="flex items-center gap-3">
    <span aria-hidden className="text-micro font-bold text-accent
                                 group-hover:text-accent">01</span>
    <span className="text-xs font-bold tracking-[0.04em]">GitHub</span>
  </span>
  <GitHubIcon className="size-4 text-muted group-hover:text-accent" aria-hidden />
</a>
```

Not: index rakamı açık temada `text-accent` = `mint-700` (kontrast güvenli), hover'da
zemin obsidyene döndüğü için `mint-500` de kabul edilir — token bunu otomatik çözer.

### Kart

```jsx
"border-2 border-border-strong bg-raised p-6 space-y-5"
```

Başlık satırı: `flex justify-between items-baseline border-b border-border pb-4`
— solda sans başlık, sağda mono durum etiketi.

### Tablo

```jsx
"w-full border-collapse font-mono text-sm tabular-nums"
// thead th: text-micro uppercase tracking-[0.08em] text-muted border-b-2 border-border-strong py-2 text-left
// tbody td: border-b border-border py-3
// sayısal kolon: text-right
```

Zebra çizgisi yok — ayrım 1px kural çizgisiyle yapılır.

### Modal

`bg-overlay` backdrop (blur **yok**, düz opaklık) + `border-2 border-border-strong`
panel + `shadow-2`. Odak tuzağı, `Esc` ile kapanma, `aria-modal="true"`,
açılırken arka plan `overflow: hidden`.

### Durum nabzı — tek yuvarlak istisna

```jsx
<span className="snm-pulse inline-block size-2 bg-accent" aria-hidden />
<span className="font-mono text-micro font-bold uppercase">Operational</span>
```

## Erişilebilirlik — teslim şartı

- `:focus-visible` her interaktif öğede görünür: `outline: 2px solid var(--snm-focus); outline-offset: 2px`. `outline: none` tek başına yazılmaz.
- "Skip to content" bağlantısı her sayfada, ilk odaklanabilir öğe.
- Başlık hiyerarşisi atlamasız (h1 → h2 → h3).
- Landmark'lar: `header`, `nav`, `main`, `footer`.
- Klavye ile tüm akış tamamlanabilir; `CursorPreview` gibi hover'a bağlı özellikler
  bilgi taşımaz.
- `prefers-reduced-motion` uygulanmış.
- %200 zoom'da yatay kaydırma yok.

## Performans

- İki variable font, preload, self-hosted.
- `transition: all` yok.
- `content-visibility: auto` fold altı ağır bölümlerde.
- Görseller `width`/`height` ile boyutlandırılmış (CLS), `loading="lazy"`,
  AVIF/WebP, `object-fit: cover`, placeholder rengi `bgSunken` (blur-up **yok**).
- Web Audio yalnızca ilk jestte başlatılır.

## Global footer (SNM-CANON-05)

Her çok bölümlü sayfa aynı `<FooterGlobal />` bileşenini render eder: 4 kolonlu
Swiss bilgi ızgarası — `IDENTITY` · `NAVIGATION` · `CHANNELS` · `TELEMETRY`.
Telemetri kolonu sürüm, son güncelleme (ISO), durum ve yanıt SLA'sını taşır.
Referans: `assets/web/FooterGlobal.tsx`.
