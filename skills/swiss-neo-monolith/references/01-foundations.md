# 01 // FOUNDATIONS

Renk, aralık, kontur, yükseklik. Mecradan bağımsız temel katman.

## Token mimarisi

Üç katman var, ve **ürün kodu yalnızca 2. katmana dokunur**:

```
1. Primitive   color.mint.500        ham değer, isimlendirilmiş
2. Semantic    --snm-text-accent     amaca göre, temaya duyarlı  ← BUNU KULLAN
3. Component   --snm-btn-bg          nadir; yalnızca 2. katman yetmediğinde
```

Ürün kodunda `#10b981` veya `color.mint.500` görürsen bu bir hatadır.
Doğru form: `var(--snm-accent)` / `text-accent` / `token("accent")`.

## Renk sistemi

### Nötrler

| Rol | Açık tema | Koyu tema |
|---|---|---|
| Zemin | `bone.200` `#f2f4f3` | `obsidian.900` `#121316` |
| Yükseltilmiş yüzey | `bone.50` `#ffffff` | `obsidian.800` `#1c1e22` |
| Metin | `obsidian.900` | `bone.200` |
| İkincil metin | `steel.600` `#4b5563` | `steel.400` |
| Kontur (ince) | `rgba(18,19,22,.15)` | `rgba(242,244,243,.15)` |
| Kontur (yapısal) | `obsidian.900` | `bone.200` |

### Mint — kullanım kuralları

Mint sistemin tek kromatik sesidir; bu yüzden nerede kullanıldığı sıkı kurallıdır.

| Ton | Kontrast (kemik üzeri) | İzin verilen kullanım |
|---|---|---|
| `mint.500` `#10b981` | **2.4:1** | Obsidyen üzeri metin (7.3:1 ✓), dolgu, çizgi, ikon, grafik serisi. **Kemik üzeri metin YASAK.** |
| `mint.600` `#059669` | 3.4:1 | Anlam taşıyan grafik öğe / kontur / ikon (AA non-text 3:1 ✓). Metin değil. Semantic adı: `accentUi`. |
| `mint.700` `#047857` | **4.9:1** ✓ | Kemik üzeri metin ve link için **tek geçerli mint**. |
| `mint.300` `#6ee7b7` | — | Obsidyen üzeri metin ve link. |

İki ayrı semantic token var, karıştırma:

- **`accent`** = `mint.500` — marka dolgusu. Üzerine ters metin gelir, kendisi
  bilgi taşımaz. Açık zeminde kontrastı 2.3:1'dir; bu kabul edilebilir çünkü
  bir *dolgu*dur, anlam taşıyan bir çizgi değil.
- **`accentUi`** = `mint.600` (açık) / `mint.500` (koyu) — **anlam taşıyan**
  ikon, kontur, grafik öğesi. 3:1 eşiğini geçer.
- **`textAccent`** = `mint.700` (açık) / `mint.300` (koyu) — metin ve link.

Alan bütçesi: mint, herhangi bir ekranın/sayfanın görünür alanının **%10'unu**
geçmez. Geçiyorsa vurgu vurgu olmaktan çıkmıştır.

### Durum renkleri

`danger` `#b91c1c` · `warn` `#92400e` · `info` `#1d4ed8` (koyu temada açık karşılıkları).
Yalnızca gerçek durum bildirir. Dekoratif kullanım yok. Renk asla tek başına anlam
taşımaz — her zaman bir ikon veya etiket eşlik eder (renk körlüğü).

### Kontrast eşiği

- Gövde metni: **4.5:1** minimum.
- 24px+ veya 19px+bold metin: 3:1.
- İkon, kontur, form kenarı, grafik: 3:1.
- Devre dışı öğeler muaf ama bilgi taşıyamaz.

Yeni bir renk önerdiğinde kontrastı hesapla ve rakamı belirt. Hesaplamadıysan kullanma.

## Aralık ölçeği

4px tabanlı. **İzin verilen tek değerler:**

```
0   4   8   12   16   24   32   48   64   96   128
s0  s1  s2  s3   s4   s5   s6   s7   s8   s9   s10
```

Ara değer (10px, 20px, 36px) yazma. İhtiyaç duyuyorsan kompozisyon yanlıştır.

Ritim kuralı: bir bileşenin **iç** boşluğu, **dış** boşluğundan küçük olmalı —
`p-4` içeren bir kart `mb-6` ile ayrılır. Aksi hâlde gruplama okunmaz.

## Kontur

| Ad | Kalınlık | Kullanım |
|---|---|---|
| hairline | 1px | Ayraç, tablo satırı, ikincil kart |
| structural | 2px | Birincil kart, buton, modal, aktif durum |
| heavy | 3px | Nadir — kapak çerçevesi, seçili durum |

Kontur rengi zemin ile kontrastta 3:1 olmalı. `rgba(...,0.15)` konturlar **yalnızca
dekoratif ayraçlar** içindir; form kenarı gibi bilgi taşıyan konturlar
`borderStrong` veya en az `steel.500` olmalı.

## Yükseklik (elevation)

Blur yok. Sert ofset:

```css
--snm-elevation-1: 2px 2px 0 0 var(--snm-border-strong);
--snm-elevation-2: 4px 4px 0 0 var(--snm-border-strong);
--snm-elevation-3: 8px 8px 0 0 var(--snm-border-strong);
```

Ofset her zaman **sağ-aşağı**, her zaman **tam piksel**, her zaman **tek renk**.
Aynı ekranda ikiden fazla yükseklik seviyesi kullanma. Baskıda elevation yerine
2px kontur kullanılır (bkz. `12-print.md`).

## Izgara ve ölçü

- Maksimum içerik genişliği: **1440px**
- Okuma satır uzunluğu: **68ch** (bunu aşan gövde metni bölünür)
- Kolon: 12'li, gutter `s5` (24px)
- Varsayılan bölünme: **40 / 60** asimetrik (SNM-CANON-06)
- Dokunma hedefi minimum: **44 × 44px** (görsel öğe küçük olabilir, hit alanı olamaz)

## Tema

Sistem hem açık hem koyu temayı destekler. Kural:

- OS tercihi varsayılandır (`prefers-color-scheme`).
- Kullanıcının açık seçimi (`[data-theme]`) **her iki yönde de** OS'i ezer.
- Tema geçişi animasyonsuzdur — anlık.
- Mint her iki temada da aynı `500` tonundadır; değişen şey metin tonudur.

## Doğrulama

```bash
node scripts/build-tokens.mjs      # token'ları yeniden derle
node scripts/check-contrast.mjs    # tüm metin/zemin çiftlerini WCAG'e karşı denetle
```
