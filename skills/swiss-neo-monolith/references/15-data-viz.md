# 15 // DATA VISUALIZATION

Grafik, dashboard, sparkline, KPI kutusu. Mecra ne olursa olsun (web, PDF, slayt,
Excel) aynı kurallar.

> Genel veri görselleştirme prensipleri için `dataviz` skill'i de yükle. Bu dosya
> onun üzerine SNM'ye özgü kısıtları koyar.

## Seri palet sırası

Mint tek aksan olduğu için (SNM-CANON-03) çoklu seride **tonlama + doku** kullanılır,
gökkuşağı değil. Bu sıra ile:

```
1. #10b981  mint 500          5. #9ca3af  steel 400
2. #121316  obsidian 900      6. #6ee7b7  mint 300
3. #4b5563  steel 600         7. #d1d5d3  steel 200
4. #065f46  mint 800          8. #2a2d33  obsidian 700
```

5'ten fazla seri gerekiyorsa grafik yanlış seçilmiştir — küçük çokluk
(small multiples) kullan.

Sıralı (sequential) ölçek: `#f2f4f3 → #6ee7b7 → #10b981 → #065f46`.
Iraksak (diverging): `#b91c1c ← #f2f4f3 → #10b981`.

Renk körlüğü: mint/steel ayrımı luminans farkıyla da okunur; ayrıca çizgi
grafiklerde çizgi stili (düz/kesikli/noktalı), alan grafiklerinde tarama deseni
kullanılır. **Renk tek başına seri ayırt etmez.**

## Grafik anatomisi

```
01 // REVENUE BY QUARTER                    2024–2026
─────────────────────────────────────────────────────
 ▲
 │     ┌──┐
 │  ┌──┤  │  ┌──┐
 │  │  │  │  │  │
 └──┴──┴──┴──┴──┴───────────────────────────────►
   Q1  Q2  Q3  Q4
─────────────────────────────────────────────────────
 SOURCE: internal · 2026-08-09 · TRY, KDV hariç
```

Zorunlu parçalar: CAD başlık · üst kural çizgisi · grafik · alt kural çizgisi ·
kaynak/birim künyesi. Künye SNM-CANON-05'in grafik karşılığıdır.

## Kurallar

- **Yuvarlak uç yok.** Bar köşeleri keskin, çizgi uçları `stroke-linecap: butt`,
  pasta dilimi kenarları keskin.
- **Degrade dolgu yok.** Alan grafiklerinde düz renk + %15 opaklık.
- **3B yok. Gölge yok. Parıltı yok.**
- **Izgara**: yalnızca yatay, 1px, `border` rengi. Dikey ızgara yok.
- **Eksen**: 1px `borderStrong`. Eksen etiketleri mono `xs`. Sıfır çizgisi 2px.
- **Y ekseni sıfırdan başlar** (bar/alan grafiklerde pazarlıksız).
- **Etiket doğrudan**: mümkünse legend yerine seriyi ucunda etiketle.
- **Tüm sayılar** mono + `tabular-nums` + `Intl` ile biçimlendirilmiş.
- **Pasta grafik** yalnızca 2–3 dilimde ve yüzde toplamı 100 olduğunda. Donut yok
  (yuvarlak). Tercih: yatay yığılmış tek bar.
- **Tooltip**: keskin köşeli, 2px kontur, obsidyen zemin, mono içerik, animasyonsuz
  görünür (`duration-fast` opaklık kabul).

## KPI / stat kutusu

```
┌──────────────────────┐
│ TOTAL REVENUE        │  ← mono micro, textMuted
│ 12.500,00 ₺          │  ← mono 3xl, tabular, text
│ ▲ 12.4%  vs Q3       │  ← mono xs, accent (artış) / danger (azalış) + ok işareti
└──────────────────────┘  2px border, 0 radius
```

Değişim yönü **ok işaretiyle de** gösterilir — renk tek başına yeterli değil.

## Sparkline

1px çizgi, mint, dolgusuz, eksen yok, 24px yükseklik, son noktada 3px kare işaret
(daire değil).

## Mecraya özgü

| Mecra | Not |
|---|---|
| Web | SVG tercih; `viewBox` ile ölçeklenir. Canvas yalnızca >1000 nokta. Renkler `var(--snm-…)` ile temaya duyarlı. |
| PDF/baskı | Vektör (SVG→PDF). Çizgi kalınlığı min 0.5pt. Siyah-beyaz baskıda desenle ayrıştır. |
| Slayt | Slayt başına tek grafik. Eksen etiketleri min 12pt. |
| Excel | Yerleşik grafik; palette elle SNM sırasına ayarlanır, ızgara ve gölge kapatılır. |
| Terminal | Unicode blok karakterleri (`▁▂▃▄▅▆▇█`) ile sparkline; renk NO_COLOR'a duyarlı. |

## Erişilebilirlik

- Her grafiğin metin alternatifi var: `<figcaption>` ya da `alt` — eğilimi ve
  uç değerleri cümleyle anlat, "grafik" deme.
- Temel veri tablo olarak da erişilebilir olmalı (`<details>` içinde tablo kabul).
- Etkileşimli grafiklerde klavye ile nokta nokta gezinme.
- Kontrast: seri renkleri zeminle 3:1, birbirleriyle ayırt edilebilir.
