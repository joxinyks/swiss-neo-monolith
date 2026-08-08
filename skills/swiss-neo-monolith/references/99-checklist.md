# 99 // DELIVERY CHECKLIST

Teslimden önce çalıştır. Bir madde bile başarısızsa çıktı SNM değildir.

## Kanon (her mecra)

- [ ] **C01** Hiçbir yerde yuvarlatılmış köşe yok (durum nabzı ve zorunlu platform kontrolleri hariç)
- [ ] **C02** Her anlamlı bölümde iki haneli, sıfır dolgulu CAD indeksi var (`01 //`)
- [ ] **C03** Mint dışında kromatik renk yok; mint görünür alanın %10'unu geçmiyor
- [ ] **C04** Bulanık gölge / degrade / blur / cam efekti / doku yok
- [ ] **C05** Çıktı bir telemetri künyesi taşıyor (sürüm · ISO tarih · durum/sayaç)
- [ ] **C06** Kompozisyon asimetrik; gövde metni sola dayalı, ortalanmamış

## Token disiplini

- [ ] Kodda elle yazılmış hex / rgb değeri yok
- [ ] Aralık değerleri yalnızca ölçekten (4 8 12 16 24 32 48 64 96 128)
- [ ] Punto/boyut değerleri yalnızca tip ölçeğinden
- [ ] `tokens/dist/` elle düzenlenmemiş; `tokens.json` değiştiyse derlenmiş

## Tipografi

- [ ] Yalnızca Inter + JetBrains Mono; üçüncü aile yok
- [ ] Veri/etiket/tarih/sayı monospace, anlatı sans
- [ ] Sayı içeren her yerde `tabular-nums`
- [ ] `text-align: justify` yok, `hyphens` kapalı
- [ ] Gövde satır uzunluğu ≤ 68ch
- [ ] Türkçe büyük harf metinler kaynağında yazılmış (CSS `uppercase` ile değil)
- [ ] Büyük harf mono etiketlerde tracking +0.08em

## Renk & kontrast

- [ ] Gövde metni kontrastı ≥ 4.5:1 (hesaplandı, tahmin edilmedi)
- [ ] İkon/kontur/grafik kontrastı ≥ 3:1
- [ ] Kemik zemin üzerinde `mint-500` metin **yok** (→ `mint-700`)
- [ ] `steel-500` gövde metni olarak kullanılmamış (→ `steel-600`)
- [ ] Hiçbir bilgi yalnızca renkle kodlanmamış
- [ ] Koyu temada da tüm eşikler sağlanıyor

## Hareket & ses

- [ ] `transition: all` yok; property listesi açık
- [ ] Süre ≤ 320ms, easing `mech`/`out`; spring/bounce yok
- [ ] `prefers-reduced-motion` uygulanmış
- [ ] Ses varsayılan kapalı, toggle var, tercih saklanıyor, ilk jestten sonra başlıyor
- [ ] Dönen spinner yok

## Erişilebilirlik

- [ ] Her interaktif öğede görünür `:focus-visible` halkası
- [ ] Klavye ile tüm akış tamamlanabiliyor
- [ ] Dokunma hedefleri ≥ 44×44px (masaüstü ≥ 28px)
- [ ] Başlık hiyerarşisi atlamasız, landmark'lar tanımlı
- [ ] Görsellerde `alt`, ikon butonlarda `aria-label`
- [ ] %200 zoom'da içerik kaybı ve yatay kaydırma yok
- [ ] Viewport kilidi kısa ekranlarda devre dışı

## Layout

- [ ] `100dvh` kullanılmış, `100vh` yok
- [ ] Header yüksekliği token'dan, hardcode değil
- [ ] Grid çocuklarında `min-w-0` (taşma koruması)
- [ ] Mobil kırılımda 40/60 tek kolona düzgün iniyor

## Mecraya özgü

**Web** — font preload · `content-visibility` · görsellerde boyut · skip-link · footer render ediliyor
**Uygulama** — durum çubuğu var · platform kısayolları · safe-area · dinamik yazı tipi ölçeği · Material/Cupertino elevation sıfırlanmış
**PDF** — her sayfada alt kolontitül · gövde K100 · fontlar gömülü · etiketli (tagged) · 300dpi görsel · bağlantı URL'leri yazılı
**Ofis** — tema renkleri tanımlı · gerçek stiller kullanılmış (direct formatting yok) · ISO tarih formatı · zebra yok
**Terminal** — `NO_COLOR` destekli · non-TTY'de renk kapalı · keskin kutu karakterleri · ASCII fallback
**Grafik** — Y ekseni sıfırdan · yuvarlak uç yok · kaynak künyesi · metin alternatifi · renk körlüğü ayrımı
**Marka** — logo koruma alanı korunmuş · ikon stroke 1.5/butt/miter · OG görseli 1200×630 · e-postada inline CSS

## Son kontrol

Çıktıyı yan yana koyduğunda önceki bir SNM çıktısıyla **aynı elden çıkmış**
görünüyor mu? Görünmüyorsa hangi kanon maddesi kaymış, bul.
