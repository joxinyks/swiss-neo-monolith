# 04 // VOICE & CONTENT

Görsel dil bir ses tonu ima eder. Bu dosya o tonu sabitler — tutarlılığın yarısı
tipografide değil, kelime seçimindedir.

## Ton

**Ölçüm aleti gibi konuş.** Kesin, kısa, abartısız. Bir mühendislik çizimi kendini
övmez; ölçüsünü verir.

| Kullan | Kullanma |
|---|---|
| "Yanıt süresi: 24 saatten kısa" | "Size hemen dönüş yapıyoruz!" |
| "12 proje teslim edildi" | "Sayısız başarılı projeye imza attık" |
| "Kapsam dışı" | "Maalesef bu hizmeti sunamıyoruz 😔" |
| "REV 04 · 2026-08-09" | "Son güncelleme: geçen hafta" |

Kurallar: ünlem yok · emoji yok · üstünlük sıfatı yok ("en iyi", "eşsiz", "devrim
niteliğinde") · pazarlama klişesi yok · birinci çoğul şahıs ("biz") tek kişilik bir
stüdyoda kullanılmaz, birinci tekil ya da nesnel dil kullanılır.

## Etiket dili

Sistem etiketleri (CAD indeksleri, durum, künye) **İngilizce ve teknik** kalır;
anlatı metni içeriğin dilindedir. Bu bilinçli bir ikiliktir: makine katmanı İngilizce
konuşur, insan katmanı Türkçe. Aynı zamanda Türkçe büyük-harf sorununu tümden atlar.

Standart etiket sözlüğü — bunlar dışına çıkma:

```
STATUS   REV      SECTION   INDEX    SCOPE    STACK    ROLE
CLIENT   PERIOD   DELIVERY  SLA      SOURCE   OUTPUT   NOTE
OPERATIONAL   IN PROGRESS   ARCHIVED   DRAFT   FINAL   CONFIDENTIAL
```

## Sayı ve tarih formatı

Tümü monospace, tümü `tabular-nums`.

| Tür | Format | Örnek |
|---|---|---|
| Tarih (sistem/künye) | ISO 8601 | `2026-08-09` |
| Tarih (anlatı, TR) | `Intl` `tr-TR` | `9 Ağustos 2026` |
| Tarih + saat | ISO + zaman dilimi | `2026-08-09 14:30 TRT` |
| Aralık | en tire, boşluksuz | `2024–2026` |
| Sürüm | `REV` + iki hane | `REV 04` |
| Yüzde | boşluksuz | `%98` (TR) · `98%` (EN) |
| Para (TR) | `Intl` `tr-TR` / `TRY` | `12.500,00 ₺` |
| Para (EN) | `Intl` `en-US` / `USD` | `$12,500.00` |
| Dosya boyutu | ondalık, tek boşluk | `2.4 MB` |
| Süre | birim kısaltmalı | `180ms` · `<24h` |
| Sayaç | sıfır dolgulu, `/` ayraçlı | `03 / 12` |

Tarih ve para biçimlendirmesi **her zaman** `Intl.DateTimeFormat` /
`Intl.NumberFormat` ile yapılır. Elle string birleştirme yapılmaz.

## Başlık yazımı

- Sans başlıklar: cümle düzeni. "Sistem mimarisi" — "Sistem Mimarisi" değil.
- Mono etiketler: tamamı büyük harf, kaynağında yazılmış.
- Başlıklarda nokta yok, iki nokta serbest.
- Soru cümlesi başlık kullanılmaz.

## Boş ve hata durumları

Boş durum bir özür değil, bir ölçümdür:

```
00 // NO RECORDS
Bu filtreyle eşleşen kayıt yok.
[ FİLTREYİ SIFIRLA ]
```

Hata mesajı üç parçadır: ne oldu · neden · ne yapılabilir. Suçlayıcı dil yok
("geçersiz giriş yaptınız" değil, "e-posta adresi tanınmadı").

## Erişilebilirlik metni

- Her görselin `alt` metni var; dekoratif görselde `alt=""`.
- CAD indeksleri dekoratiftir → ekran okuyucudan gizle (`aria-hidden`), başlığın
  kendisi erişilebilir kalsın.
- Yalnızca ikondan oluşan butonlarda `aria-label` zorunlu.
- Bağlantı metni bağlamsız anlamlı olmalı — "buraya tıkla" yok.
- `lang` özniteliği dil değişen bölümlerde belirtilir.
