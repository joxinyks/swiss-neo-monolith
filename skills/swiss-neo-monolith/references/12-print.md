# 12 // PRINT & PDF

Rapor, teklif, fatura, CV, sertifika, kapak. Baskı SNM'nin en doğal ortamıdır —
Swiss editoryal gelenek buradan gelir.

## Üretim yolu

Tercih sırası:

1. **HTML + CSS Paged Media → WeasyPrint / Paged.js** — token'lar doğrudan çalışır,
   tek kaynaktan hem web hem PDF. Varsayılan seçim.
2. **ReportLab (Python)** — programatik, veri yoğun, çok sayfalı raporlar.
   `tokens/dist/tokens.py` → `rgb("bg")`.
3. **LaTeX** — akademik/uzun form. Renkleri `\definecolor` ile token'lardan tanımla.

Word'den PDF üretme (bkz. `13-office.md`) yalnızca alıcı dosyayı düzenleyecekse.

## Sayfa ızgarası

| | Değer |
|---|---|
| Sayfa | A4 (210 × 297mm) · US Letter gerekiyorsa ayrı şablon |
| Kenar boşluğu | 18mm dış, 22mm alt (kolontitül için) |
| Kolon | 12'li, 4mm gutter |
| Taban ızgarası | 4mm — **tüm** metin bu ızgaraya oturur |
| Varsayılan bölünme | 40 / 60 (sol künye kolonu / sağ içerik) |

Baseline grid pazarlıksızdır: gövde 10pt/14pt = 4.94mm... bunun yerine
**10pt / 14pt satır aralığı** kullan ve blok aralıklarını 14pt'nin katları yap
(14 / 28 / 42pt). Bu, sayfalar arası dikey hizayı garanti eder.

## Tipografi (punto)

| Rol | Punto | Satır | Aile |
|---|---|---|---|
| Kapak başlığı | 48pt | 46pt | Inter 800 |
| H1 | 24pt | 28pt | Inter 700 |
| H2 | 16pt | 21pt | Inter 700 |
| H3 | 12pt | 14pt | Inter 700 |
| Gövde | 10pt | 14pt | Inter 400 |
| Not / dipnot | 8pt | 11pt | Inter 400 |
| CAD etiket / künye | 7.5pt | 10pt | JetBrains Mono 700, +0.08em |
| Tablo verisi | 9pt | 12pt | JetBrains Mono 400, tabular |

Ekrandaki `px` ölçeği baskıya **birebir taşınmaz** — yukarıdaki tablo baskının
kendi ölçeğidir. Okuma mesafesi farklıdır.

## Renk

- Gövde metni: **K100 düz siyah**. Rich black metinde kayıt kayması (misregistration)
  yaratır — kullanma.
- Büyük dolgu alanları (kapak): rich black `C75 M65 Y60 K90`.
- Mint: `C91 M0 Y30 K27` (yaklaşık) · Pantone yaklaşık **3395 C**.
  **Bu değerler ICC profili olmadan hesaplanmıştır — matbaa işi öncesi fiziksel
  kılavuzla doğrula.**
- Kemik zemin: mümkünse **kağıt seçimiyle** çöz (doğal/uncoated stok), tam sayfa
  tint basma. Basılacaksa `C3 M1 Y2 K0`.
- Tek renk baskıda (siyah-beyaz) mint → K40 tram. Sistem bu hâlde de okunur olmalı;
  bilgi asla yalnızca mint ile kodlanmaz.

## Sayfa yapısı

```
┌─────────────────────────────────────────┐  ← 18mm
│ 01 // SECTION NAME          REV 04       │  başlık kolontitülü, mono 7.5pt
│ ─────────────────────────────────────── │  0.5pt kural çizgisi
│                                          │
│  ◄── 40% ──►│◄────── 60% ──────►        │
│  künye       │ içerik                    │
│  kolonu      │                           │
│                                          │
│ ─────────────────────────────────────── │
│ OKAN ÖZTÜRK · 2026-08-09    SAYFA 03/12 │  ← telemetri (SNM-CANON-05)
└─────────────────────────────────────────┘  ← 22mm
```

Alt kolontitül **her sayfada** zorunlu: kimlik · ISO tarih · sayfa sayacı
(`03 / 12`, sıfır dolgulu). Kapak sayfası muaftır.

## CSS Paged Media

```css
@page {
  size: A4;
  margin: 18mm 18mm 22mm;
  @top-left  { content: string(section); font: 700 7.5pt 'JetBrains Mono'; letter-spacing: .08em; }
  @top-right { content: 'REV 04'; font: 700 7.5pt 'JetBrains Mono'; }
  @bottom-left  { content: 'OKAN ÖZTÜRK · 2026-08-09'; font: 400 7.5pt 'JetBrains Mono'; }
  @bottom-right { content: counter(page, decimal-leading-zero) ' / '
                           counter(pages, decimal-leading-zero);
                  font: 700 7.5pt 'JetBrains Mono'; font-variant-numeric: tabular-nums; }
}
@page :first { @top-left { content: none } @top-right { content: none } }

h2 { string-set: section content(); break-after: avoid; }
h1, h2, h3 { break-after: avoid-page; }
table, figure, .snm-card { break-inside: avoid; }
p { orphans: 3; widows: 3; }
```

Hazır sayfa stil dosyası: `assets/print/print.css`.

## Baskı kuralları

- **Gölge yok.** Elevation baskıda 1pt kontura dönüşür.
- Kontur kalınlıkları: 0.5pt hairline · 1pt yapısal · 2pt ağır.
  0.25pt'nin altına inme — ofset baskıda kaybolur.
- Bağlantılar PDF'te tıklanabilir kalır ama **URL de yazılır** (basılı kopya için):
  `joxinyks.com  ↗`
- Tablo: zebra yok, 0.5pt yatay çizgiler, dikey çizgi yok, sayılar sağa dayalı.
- Görseller minimum 300dpi; CMYK'ye dönüştürülmüş; taşma (bleed) gerekiyorsa 3mm.
- Kırım payı ve kesim işaretleri yalnızca matbaa çıktısında; ekranda dağıtılan
  PDF'te olmaz.
- PDF/A gerekiyorsa fontlar gömülü (embedded), şeffaflık düzleştirilmiş.
- Erişilebilir PDF: etiketli (tagged) yapı, okuma sırası, `alt` metinleri, doküman
  dili `tr-TR`, `Title` metadata dolu.

## Doküman tipleri

| Tip | Kapak | Kolontitül | Not |
|---|---|---|---|
| Teklif | Var, tam obsidyen zemin | Var | İlk sayfada `SCOPE` künye bloğu |
| Rapor | Var | Var | İçindekiler CAD numaralı |
| Fatura | Yok | Sadece alt | Tüm rakamlar mono tabular; toplam 2pt üst çizgi |
| CV | Yok | Sadece alt | 40/60: sol künye+iletişim, sağ deneyim |
| Tek sayfalık | Yok | Yok | Telemetri tek satır, en altta |
