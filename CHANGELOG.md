# CHANGELOG

Sürümleme: `MAJOR.MINOR.PATCH`
**MAJOR** görsel kırılma (mevcut çıktılar yeniden üretilmeli) ·
**MINOR** yeni token/kural/mecra · **PATCH** düzeltme, açıklama.

---

## 1.0.1 — 2026-08-09

Sunum katmanı düzeltmesi. Token'lar ve kurallar değişmedi.

### Eklendi
- **Depo başlık görseli** — `.github/banner-{light,dark}.svg`; README okuyucunun
  temasına göre `<picture>` ile seçiliyor. Görselin kendisi kanona uyar: sıfır
  yarıçap, düz dolgu, kural çizgileriyle kurulmuş yapı, 40/60 bölünme, telemetri
  şeridi.

### Değişti
- **README** sistemin kendi diline getirildi: CAD numaralı bölümler, `flat-square`
  rozetler, monospace telemetri künyesi, mecra ve referans tabloları.
- **Kurulum betiklerinin çıktısı** `references/14-terminal.md` kurallarına
  uyduruldu — CAD başlık, hizalı kolonlar, telemetri satırı. Metin İngilizceye
  alındı; sistemin kendi kuralı gereği makine katmanı İngilizce konuşur
  (`04-voice.md`) ve bu, Windows PowerShell'de Türkçe karakter kodlama riskini
  de ortadan kaldırır.
- Kurulum betikleri artık doğrulama başarısızsa sıfırdan farklı çıkış kodu
  döndürüyor; `PARTIAL` durumu `DONE`'dan ayrıldı.

---

## 1.0.0 — 2026-08-09

İlk sürüm. Tek mecralı (web) bir stil dokümanından çok mecralı bir imza sistemine
geçiş.

### Eklendi
- **Kanon** — mecradan bağımsız 6 değişmez (C01–C06).
- **Token boru hattı** — `tokens.json` tek gerçek kaynak; CSS, SCSS, TS, Tailwind
  preset, Python, Dart ve platformdan bağımsız JSON çıktıları üretiliyor.
- **Semantic token katmanı** — açık/koyu tema karşılıklarıyla; ürün kodu artık
  primitive renklere dokunmuyor.
- **Koyu tema** — `[data-theme]` her iki yönde de OS tercihini eziyor.
- **Kontrast kapısı** (`check-contrast.mjs`) — 34 çift WCAG'e karşı denetleniyor,
  CI'da çalışabilir.
- **Yeni mecralar** — uygulama (masaüstü/mobil), PDF/baskı, PPTX/DOCX/XLSX,
  terminal/CLI, veri görselleştirme, marka varlıkları.
- **Ses sözleşmesi** — varsayılan kapalı, kalıcı tercih, jest sonrası başlatma,
  reduced-motion'da sessiz.
- **Referans uygulamalar** — `FooterGlobal.tsx`, `useMechanicalClick.ts`,
  `print.css`, `eslint-snm.cjs`, Office tema şeması.
- **Teslim denetim listesi** (`99-checklist.md`).
- **Kurulum betikleri** — Windows ve POSIX; kopya veya canlı bağlantı modu.

### Düzeltildi (erişilebilirlik)
- `mint-500` kemik zemin üzerinde metin olarak kullanılıyordu — **2.3:1**, AA'nın
  çok altında. Metin için `mint-700` (`textAccent`, 4.96:1) tanımlandı; anlam
  taşıyan ikon/kontur için `mint-600` (`accentUi`, 3.41:1) ayrıldı. `mint-500`
  artık yalnızca dolgu ve koyu zemin metni.
- `steel-500` (`#6b7280`) ikincil gövde metniydi — **4.38:1**, AA'yı kıl payı
  kaçırıyordu. `textMuted` → `steel-600` (`#4b5563`, 6.84:1).
- `warn` (`#a16207`) **4.46:1** ile kalıyordu → `#92400e` (6.42:1).
- Odak halkası tanımlanmamıştı; `focus` token'ı ve zorunlu `:focus-visible`
  kuralı eklendi.

### Değişti
- **Yarıçap sıfırlaması** global `!important` yerine `@layer base` reset'e taşındı.
- **`100vh` → `100dvh`**; header yüksekliği hardcode'dan token'a alındı.
- **Viewport kilidi** artık `min-height: 700px` altında devre dışı — kısa ekran ve
  %200 zoom'da içerik erişilemez hâle geliyordu (WCAG 1.4.10).
- **Gölge politikası** netleşti: bulanık gölge yasak, sert ofset (`2px 2px 0`)
  standart. Önceki örneklerdeki `shadow-sm` kaldırıldı.
- **`transition: all`** yasaklandı, property listesi zorunlu.
- **Arbitrary Tailwind değerleri** (`bg-[#121316]`) yasaklandı; preset palette'i
  değiştiriyor, ESLint kuralı ihlali yakalıyor.
- **Tipografi** ölçek, ağırlık, tracking ve satır yüksekliği tablolarıyla tamamlandı;
  `tabular-nums` zorunlu hâle geldi.
- **Türkçe büyük harf** — CSS `text-transform: uppercase` yasaklandı (`i` → `I`
  hatası); sistem etiketleri İngilizce ve kaynağında büyük harf.
- **Skill `description`** tetikleyici odaklı yeniden yazıldı; "kullanma" koşulları
  eklendi.
- **Yapı** tek dosyadan yönlendirmeli referans setine bölündü (progressive
  disclosure).
