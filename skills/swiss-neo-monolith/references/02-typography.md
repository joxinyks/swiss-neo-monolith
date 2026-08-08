# 02 // TYPOGRAPHY

İki aile, iki görev. Bu ikilik sistemin en tanınabilir özelliğidir.

## Aile ayrımı — ihlal edilemez

| Aile | Görev |
|---|---|
| **Inter** (sans) | Anlatı. Başlıklar, gövde metni, açıklama, düz cümle. |
| **JetBrains Mono** | Sistem. CAD indeksleri, etiket, künye, sayı, tarih, kod, durum, tablo verisi, birim. |

Kural: **makinenin ürettiği her şey monospace, insanın yazdığı her şey sans.**
Bir tarih monospace'tir. Bir başlık sans'tır. Bir fiyat monospace'tir.
Bir paragraf sans'tır. Tereddüt ettiğinde: veri mi, cümle mi?

## Ölçek

| Token | Boyut | Satır | Tracking | Kullanım |
|---|---|---|---|---|
| `micro` | 11 | 14 | +0.08em | CAD indeks, rozet, künye. **Her zaman mono + bold + büyük harf** |
| `xs` | 12 | 16 | +0.04em | Etiket, tablo başlığı, dipnot |
| `sm` | 14 | 20 | 0 | İkincil metin, form yardımı, tablo hücresi |
| `base` | 16 | 26 | 0 | Gövde metni |
| `lg` | 18 | 28 | −0.01em | Giriş paragrafı (lede) |
| `xl` | 24 | 30 | −0.02em | H3 / kart başlığı |
| `2xl` | 32 | 36 | −0.025em | H2 / bölüm başlığı |
| `3xl` | 40 | 44 | −0.03em | H1 |
| `4xl` | 56 | 56 | −0.035em | Hero başlığı |
| `5xl` | 72 | 70 | −0.04em | Kapak / display |

Ölçek dışı boyut yazma. Mobilde `4xl`/`5xl` bir kademe düşer (`3xl`/`4xl`).

## Ağırlık

`400` gövde · `500` etiket/vurgu · `700` başlık ve mono · `800` yalnızca hero/kapak.

`600` kullanma — 500 ile 700 arasındaki fark bu sistemde kasıtlı olarak serttir.
İtalik kullanma; vurgu için ağırlık veya mono'ya geçiş kullanılır.

## Değişmez kurallar

1. **Büyük harf yalnızca mono'da.** Sans başlıklar cümle düzeninde ("Sentence case").
   Büyük harf mono etiketlerde tracking **her zaman** +0.08em.
2. **Tabular rakam zorunlu.** Sayı içeren her yerde `font-variant-numeric: tabular-nums`.
   Tablo, fiyat, telemetri, sayaç — hizalanmayan rakam kabul edilmez.
3. **Yaslama yok.** `text-align: justify` yasak. Gövde metni sola dayalı, sağı serbest.
4. **Tireleme kapalı.** `hyphens: none` — Swiss editoryal gelenek keskin sağ kenarı tercih eder.
5. **Satır uzunluğu 68ch.** Aşan gövde metni ya kolonlanır ya daraltılır.
6. **Dul/yetim satır.** Başlıklarda `text-wrap: balance`, paragraflarda `text-wrap: pretty`.

## CAD indeks formatı (SNM-CANON-02)

```
01 // THE ARCHITECTURE          ← bölüm açılışı
SECTION 03 / 07                 ← sayaç
RESPONSE SLA: <24H              ← telemetri
STATUS: OPERATIONAL             ← durum
```

Kurallar: iki haneli sıfır dolgulu numara · boşluklu `//` ayracı · tamamı büyük harf ·
`micro` boyut · `700` ağırlık. Numara `accent` renginde olabilir, etiketin geri kalanı
`textMuted`. Başlığın kendisi asla aksan renginde değildir.

## Font yükleme

Variable font, self-hosted, `woff2`. CDN'e bağımlılık yok.

```html
<link rel="preload" as="font" type="font/woff2"
      href="/fonts/InterVariable.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2"
      href="/fonts/JetBrainsMono[wght].woff2" crossorigin>
```

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/InterVariable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
  size-adjust: 100%;
}
```

Yalnızca gerçekten kullanılan iki aile yüklenir. İki mono ya da ikinci bir sans
aile eklemek sistem ihlalidir.

CLS önlemi: `font-display: swap` + fallback metrik eşitleme
(`@font-face { font-family: 'Inter-fallback'; src: local('Segoe UI'); size-adjust: 96%; }`).

## Türkçe — kritik

**CSS `text-transform: uppercase` Türkçe'de bozuktur:** `i` → `I` üretir, `İ` değil.
"iletişim" → "ILETIŞIM" (yanlış), "İLETİŞİM" (doğru).

Kurallar:
1. `<html lang="tr">` her zaman ayarlı olsun — bazı motorlar locale'e saygı duyar,
   ama **buna güvenme**.
2. Türkçe büyük harf metinleri **kaynağında büyük harf yaz**, CSS ile dönüştürme.
3. CAD etiketleri İngilizce ve teknik kalır (`STATUS`, `SECTION`, `REV`) — bu bir
   üslup tercihi, aynı zamanda bu sorunu tümden atlar.
4. Türkçe'ye özgü karakterlerin (ğ ı İ ş ç ö ü) seçilen fontta mevcut olduğunu
   doğrula. Inter ve JetBrains Mono ikisi de tam destekler.
5. Sıralama, tarih ve sayı biçimlendirmede `Intl` API'sini `tr-TR` ile kullan;
   elle string birleştirme yapma.
