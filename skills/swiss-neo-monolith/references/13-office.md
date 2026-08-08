# 13 // OFFICE (PPTX · DOCX · XLSX)

Ofis dosyaları başkasının düzenleyeceği dosyalardır. Bu yüzden burada kural
**stil tanımlarını doğru kurmaktır** — elle biçimlendirme değil. Yanlış kurulmuş
bir deck, ilk düzenlemede sistemden çıkar.

Ortak zorunluluk: **tema renklerini ve stilleri tanımla**, sonra yalnızca onları
kullan. Doğrudan hücre/paragraf biçimlendirmesi (direct formatting) yasak.

---

## PPTX — sunum

### Slayt kurulumu

- Boyut 16:9 (13.333 × 7.5 in / 33.87 × 19.05 cm)
- Kenar boşluğu 0.6in (1.5cm) her yön
- Izgara 12 kolon, 0.15in gutter
- Zemin: kemik `#f2f4f3`. Bölüm ayracı ve kapak slaytları obsidyen `#121316`.

### Tema renkleri (Office theme slots)

```
dk1  #121316   lt1  #f2f4f3   dk2  #4b5563   lt2  #ffffff
acc1 #10b981   acc2 #047857   acc3 #4b5563   acc4 #9ca3af
acc5 #b91c1c   acc6 #a16207   hlink #047857  folHlink #065f46
```

Bu tam liste `assets/office/snm-theme.xml` içinde hazır — PowerPoint'te
Tasarım → Renkler → Özelleştir ile ya da doğrudan `.thmx` olarak yüklenir.

### Slayt düzenleri (layout master)

| Düzen | Yapı |
|---|---|
| `COVER` | Obsidyen zemin · sol alt sola dayalı 40pt başlık · üstte mono künye · sağ altta mint 2pt çizgi |
| `SECTION` | Obsidyen zemin · dev CAD numarası (`03`) 120pt mint · yanında bölüm adı |
| `CONTENT 40/60` | Sol 40% künye/başlık · sağ 60% içerik · varsayılan düzen |
| `FULL` | Tek kolon, tam genişlik — tablo ve grafik için |
| `SPLIT` | 50/50 görsel + metin |
| `CLOSING` | Obsidyen · iletişim künyesi · mono |

Her düzende alt şeritte telemetri (SNM-CANON-05): `OKAN ÖZTÜRK · 2026-08-09 ·
03 / 24` — mono 9pt, `steel.600`.

### Slayt tipografisi

Başlık 32pt Inter 700 · alt başlık 18pt Inter 400 · gövde 16pt (asla 14pt altı) ·
madde işareti 16pt · CAD etiket 10pt JetBrains Mono 700 · notlar 11pt.

Madde işareti: `—` (em tire), yuvarlak nokta değil. En fazla iki seviye.
Slayt başına en fazla 6 satır.

### Yasaklar

Geçiş efekti (fade hariç, 180ms) · animasyonlu giriş · WordArt · gölgeli kutu ·
degrade dolgu · 3B grafik · stok ikon seti · clip-art · yuvarlatılmış şekil
(şekil stilinde köşe yarıçapı 0'a çekilir).

---

## DOCX — doküman

### Stil tanımları (zorunlu)

| Stil | Font | Punto | Aralık |
|---|---|---|---|
| `SNM Body` | Inter | 10.5 | 14pt satır, 0/8pt önce/sonra |
| `SNM H1` | Inter 700 | 20 | 24pt önce, 8pt sonra |
| `SNM H2` | Inter 700 | 14 | 18pt önce, 6pt sonra |
| `SNM H3` | Inter 700 | 11.5 | 12pt önce, 4pt sonra |
| `SNM Label` | JetBrains Mono 700 | 7.5 | +0.08em, büyük harf, `steel.600` |
| `SNM Data` | JetBrains Mono | 9 | tabular |
| `SNM Caption` | Inter | 8 | `steel.600` |
| `SNM Quote` | Inter | 10.5 | sol 2pt mint kenarlık, 12pt girinti |

- Başlıklar gerçek `Heading 1/2/3` stiline bağlanır (gezinme bölmesi ve PDF
  etiketlemesi için).
- Numaralandırma çok seviyeli liste stiline bağlı; elle numara yazılmaz.
- Sayfa yapısı `12-print.md` ile aynı: 18mm kenar, alt kolontitülde telemetri.
- Tablo stili: `SNM Table` — dış kenarlık yok, başlık altında 1pt, satır arası
  0.5pt, dikey çizgi yok, başlık satırı `SNM Label`.

### Yasaklar

Elle boşluk/satır atlama · metin kutusu · gölgeli tablo teması · renkli hücre
dolgusu (durum bildirimi hariç) · Calibri/Times kalıntısı.

---

## XLSX — tablo

### Hücre stilleri

| Stil | Tanım |
|---|---|
| `SNM Header` | JetBrains Mono 700, 9pt, büyük harf, alt kenarlık 2pt obsidyen, dolgu yok |
| `SNM Cell` | JetBrains Mono 400, 10pt, alt kenarlık 0.5pt `border` |
| `SNM Number` | + sağa dayalı, `#,##0.00` |
| `SNM Currency TRY` | `#,##0.00 "₺"` |
| `SNM Currency USD` | `"$"#,##0.00` |
| `SNM Percent` | `0.0%` |
| `SNM Date` | `yyyy-mm-dd` (ISO — her zaman) |
| `SNM Total` | Mono 700, üst kenarlık 2pt |
| `SNM Note` | Inter 9pt, `steel.600` |

### Kurallar

- Dondurulmuş başlık satırı (`Freeze Panes`), otomatik filtre açık.
- Satır yüksekliği 20px, başlık 24px. Zebra yok.
- Koşullu biçimlendirme yalnızca durum renkleriyle ve **her zaman bir metin/ikon
  eşliğinde** — renk tek başına anlam taşımaz.
- Grafikler: bkz. `15-data-viz.md`. Excel varsayılan palette **kullanılmaz**;
  seri renkleri elle SNM sırasına ayarlanır.
- Sayfa adları büyük harf ve kısa: `DATA` · `SUMMARY` · `NOTES`.
- İlk sayfanın A1'inde künye bloğu: doküman adı, `REV`, ISO tarih, sahip.
- Baskı için: yatay yön, 1 sayfa genişlik, alt kolontitülde `&[Sayfa] / &[Sayfa Sayısı]`.

---

## Otomasyon

Bu dosyaları üretirken ilgili skill'i kullan (`pptx`, `docx`, `xlsx`) ve
tema/stil tanımlarını `assets/office/` altındaki şablonlardan al. Sıfırdan
biçimlendirme yapma — şablonu aç, içeriği doldur.
