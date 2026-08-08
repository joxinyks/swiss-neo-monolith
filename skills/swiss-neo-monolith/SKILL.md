---
name: swiss-neo-monolith
description: |
  Okan Öztürk'ün imza tasarım sistemi (SNM) — Swiss editoryal tipografi + endüstriyel
  CAD şematiği + sıfır yuvarlaklık. Web, uygulama, PDF/baskı, sunum, doküman, terminal,
  e-posta, sosyal görsel — HER mecrada görsel bir çıktı üretirken veya düzenlerken KULLAN.
  Tetikleyiciler: UI komponenti, sayfa, ekran, tema, renk/font/aralık seçimi, rapor,
  teklif, CV, fatura, slayt, README rozeti, grafik/chart, logo, OG görseli, e-posta şablonu.
  "Benim tarzımda / kendi tasarımımla / her zamanki gibi yap" dendiğinde de KULLAN.
  KULLANMA: üçüncü tarafın marka kılavuzu varsa, kullanıcı açıkça başka bir stil
  istediyse, ya da çıktı tamamen görselsizse (saf backend, veri dönüşümü, script).
---

# Swiss Neo-Monolith (SNM)

Tek bir tasarım dili, her mecrada. Bir web butonu, bir PDF kapağı ve bir terminal
çıktısı aynı elden çıkmış gibi görünmeli — bunu sağlayan şey aşağıdaki **6 değişmez**.

## Nasıl kullanılır

1. **Her zaman** bu dosyadaki Kanon'u ve Kırmızı Çizgiler'i uygula.
2. Çalıştığın mecraya ait referans dosyasını **oku** (aşağıdaki tablo).
3. Token'ları elle yazma — `tokens/dist/` içinden ilgili bağlamayı içe aktar.
4. Teslimden önce `references/99-checklist.md` ile kendini denetle.

| Ne üretiyorsan | Oku |
|---|---|
| Renk, aralık, kontrast, yükseklik kararı | `references/01-foundations.md` |
| Başlık, punto, satır aralığı, font yükleme | `references/02-typography.md` |
| Animasyon, geçiş, ses, imleç, haptik | `references/03-motion-sound.md` |
| Metin, başlık, tarih/sayı formatı, ton | `references/04-voice.md` |
| Web (React/Tailwind/HTML) | `references/10-web.md` |
| Masaüstü / mobil uygulama | `references/11-app.md` |
| PDF, rapor, teklif, CV, baskı | `references/12-print.md` |
| Sunum, Word, Excel | `references/13-office.md` |
| Terminal, CLI, TUI, log | `references/14-terminal.md` |
| Grafik, chart, dashboard, veri görseli | `references/15-data-viz.md` |
| Logo, favicon, ikon, OG görseli, e-posta | `references/16-brand-assets.md` |

Token bağlamaları: `tokens/dist/` → `tokens.css`, `tokens.scss`, `tokens.ts`,
`tailwind.preset.cjs`, `tokens.py`, `tokens.dart`, `tokens.resolved.json`.
Kaynak `tokens/tokens.json`; değişiklikten sonra `node scripts/build-tokens.mjs`.

---

## Kanon — 6 değişmez

Bunlar mecradan bağımsızdır. Bir çıktının SNM olup olmadığı bunlarla anlaşılır.

**SNM-CANON-01 · Sıfır yarıçap.**
`border-radius: 0`. Her yerde: buton, kart, input, modal, tablo, slayt kutusu, PDF
çerçevesi, avatar, görsel. Tek istisna: durum nabzı (status pulse dot) ve zorunlu
platform kontrolleri (iOS switch). Yuvarlak köşe bu sistemde bir hatadır.

**SNM-CANON-02 · CAD indeksleme.**
Her anlamlı bölüm monospace, büyük harf, numaralı bir etiketle açılır:
`01 // THE ARCHITECTURE` · `03 // FINANCIALS` · `SECTION 02 / 07`.
Numara iki haneli ve sıfır dolgulu. Ayraç `//`. Etiket aksan renginde olabilir,
başlık asla.

**SNM-CANON-03 · Tek kromatik aksan.**
Mint dışında renk yok. Mint toplam görsel alanın **%10'unu geçemez** — o bir vurgu,
bir zemin değil. Geri kalan her şey kemik / obsidyen / çelik. Durum renkleri
(danger/warn/info) yalnızca gerçek bir durum bildirirken kullanılır, dekoratif asla.

**SNM-CANON-04 · Yapı çizgiyle kurulur, gölgeyle değil.**
Hiyerarşi 1px/2px keskin kural çizgileriyle ifade edilir. Bulanık gölge, degrade,
cam efekti, neon parıltı, doku yasak. Yükseklik gerekiyorsa sert ofset gölge
(`2px 2px 0`) — ki bu bir gölge değil, ikinci bir konturdur.

**SNM-CANON-05 · Telemetri şeridi.**
Her bitmiş çıktı, kenarında monospace bir künye taşır: sürüm, tarih (ISO), durum,
sayfa/bölüm sayacı. Web'de footer, PDF'te alt kolontitül, slaytta alt şerit,
terminalde başlık satırı. Bu şerit sistemin imzasıdır.

**SNM-CANON-06 · Asimetri.**
Kompozisyon ortalanmaz. Varsayılan 40/60 asimetrik bölünme; metin sola dayalı,
sağa doğru geniş boşluk. Ortalanmış başlık yalnızca kapak sayfalarında kabul edilir.

---

## Kırmızı çizgiler

Bunlardan biri çıktında varsa, çıktı yanlıştır:

- Yuvarlatılmış köşe (nabız noktası hariç)
- Palette dışı renk, ya da elle yazılmış hex (`#10b981` yerine token kullan)
- Kemik zemin üzerinde `mint-500` metin — kontrast 2.4:1, okunmuyor. Metin için `mint-700`.
- Bulanık gölge, degrade, blur, glassmorphism
- Ortalanmış gövde metni, iki yana yaslama (justify)
- `100vh` (→ `100dvh`), sabit piksel header yüksekliği (→ token)
- `transition: all`
- Emoji ikon (ikonlar çizgisel, 1.5px stroke, keskin uçlu)
- Klavye odağı görünmeyen interaktif öğe
- Türkçe metinde CSS `text-transform: uppercase` (i → I hatası; bkz. `04-voice.md`)

---

## Hızlı referans

```
Kemik   #f2f4f3    Obsidyen #121316    Mint #10b981    Mint-metin #047857
Aralık  4 8 12 16 24 32 48 64 96 128       Yarıçap 0
Kontur  1px hairline · 2px yapısal          Gölge 2px 2px 0
Süre    120 / 180 / 320ms                   Easing cubic-bezier(0.2,0,0,1)
Font    Inter (anlatı)  ·  JetBrains Mono (sistem, sayı, künye)
```
