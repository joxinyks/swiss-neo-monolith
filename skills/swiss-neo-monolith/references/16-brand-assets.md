# 16 // BRAND ASSETS

Logo, ikon, favicon, sosyal görsel, e-posta, imza, README. Sistemin dışa dönük yüzü.

## Marka işareti

SNM'nin işareti tipografiktir — resimsel bir logo yoktur:

```
OKAN ÖZTÜRK          ← Inter 700, +0.02em tracking, sentence/caps duruma göre
▌                    ← 2px × cap-height mint dikey çubuk, isimden 8px solda
```

Kilitli birim: mint çubuk + isim. Çubuk ile isim arası boşluk **her zaman** cap
yüksekliğinin 0.25'i. İşaret yalnızca yatay kullanılır.

Koruma alanı: her yönde, harf yüksekliğinin **1×**'i kadar boşluk. İçine hiçbir
şey girmez.

Minimum boyut: ekranda 16px cap yüksekliği, baskıda 4mm.

Yasaklar: eğme, gölge, kontur ekleme, degrade, renk değiştirme (mint çubuk hariç
tek renk), fotoğraf üstüne düz yerleştirme (obsidyen bir plaka üzerinde kullanılır),
yeniden dizme, orantı bozma.

Tek renk kullanımlarda çubuk da metin rengini alır.

## İkonografi

- **Çizgisel**, dolgu yok.
- Stroke 1.5px @ 24px ızgara (16px'te 1.25px, 32px'te 2px).
- `stroke-linecap: butt` · `stroke-linejoin: miter` — **yuvarlak uç ve köşe yok**.
- 24×24 viewBox, 2px iç boşluk, 20×20 canlı alan.
- Optik değil, geometrik: daireler yerine kare/dikdörtgen tercih edilir; zorunlu
  daire (durum noktası, kadran) serbest.
- Tek renk `currentColor`.
- Uyumlu hazır set: **Lucide** (stroke ayarını 1.5, linecap/linejoin'i `butt`/`miter`
  yap). Karışık set kullanma.

## Favicon & uygulama ikonu

Obsidyen kare zemin (**dolu, kenar boşluksuz**) + ortada mint `▌` çubuk + beyaz
`OÖ` monogramı. Yuvarlatma yok — platform kendi maskesini uygular (iOS), buna
karışma.

Boyutlar: `favicon.svg` (tercih edilen) · `favicon.ico` 32 · `apple-touch-icon`
180 · `icon-192` · `icon-512` · `maskable-512` (safe zone %80).

16px'te monogram okunmaz — o boyutta yalnızca mint çubuk + düz obsidyen kullan.

## Sosyal / OG görseli

1200 × 630. Şablon:

```
┌────────────────────────────────────────────┐
│ ▌ OKAN ÖZTÜRK              01 // ARTICLE   │  ← üst şerit, mono
│                                            │
│  Başlık buraya gelir,                      │  ← Inter 800, 64px, sola dayalı
│  en fazla iki satır                        │     max 2 satır, 60ch
│                                            │
│ ──────────────────────────────────────────│  ← 2px mint çizgi
│ joxinyks.com              2026-08-09       │  ← mono 20px
└────────────────────────────────────────────┘
   obsidyen zemin · 64px kenar boşluğu
```

Fotoğraf kullanılacaksa: obsidyen üzerine %30 opaklıkta, üstünde düz obsidyen
metin plakası. Bulanıklaştırma yok.

Twitter card `summary_large_image`, `og:image:width/height` her zaman belirtilir.

## E-posta şablonu

E-posta istemcileri kısıtlıdır — burada tavizler kaçınılmaz:

- Tablo tabanlı düzen, 600px genişlik, tek kolon.
- **Inline CSS** (CSS değişkeni desteklenmez → token değerleri literal yazılır;
  `tokens.resolved.json`'dan üret, elle yazma).
- Web font yüklenmez varsayımıyla tasarla: `font-family: 'JetBrains Mono',
  Consolas, monospace` ve `Inter, 'Segoe UI', Arial, sans-serif` fallback zinciri.
- `border-radius: 0` zaten varsayılan — hiçbir yerde ekleme.
- Gölge yok (destek yok zaten), degrade yok.
- Buton = `<a>` içinde `padding` + `background` + 2px `border` (VML gerekmez).
- Koyu tema: `@media (prefers-color-scheme: dark)` ile ama **buna güvenme** —
  açık temada da okunur olmalı. Gmail renkleri ters çevirebilir; kritik bilgi
  yalnızca renkte olmasın.
- Alt bilgide telemetri: kimlik · tarih · abonelikten çıkma bağlantısı.
- Görseller `alt` metinli; engellendiğinde e-posta anlamını korumalı.

## E-posta imzası

```
Okan Öztürk
▌ joxinyks.com

STATUS: OPERATIONAL · RESPONSE SLA: <24H
```

Düz metin öncelikli. HTML sürümde: isim Inter 700 14px, mono satır 11px
`steel.600`, mint çubuk. Logo görseli, sosyal ikon bloğu, hukuki uyarı paragrafı
**yok**.

## README / repo

- Rozetler: `flat-square` stili (yuvarlak yasak), renk `10b981`.
- Başlık: `# 00 // PROJECT NAME`
- Bölümler CAD numaralı.
- Sonda telemetri bloğu: sürüm, lisans, son güncelleme.
- Ekran görüntüsü: obsidyen çerçeve, 2px kontur, gölgesiz.

## Sunum/dosya adlandırma

```
snm_<tip>_<konu>_<REV>_<ISO tarih>.<uzantı>
snm_teklif_akme-portal_r04_2026-08-09.pdf
```

Küçük harf, alt çizgi ayraç, tire kelime içi, ISO tarih. Türkçe karakter ve boşluk
dosya adında kullanılmaz.
