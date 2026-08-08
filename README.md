# 00 // SWISS NEO-MONOLITH

Okan Öztürk'ün imza tasarım sistemi. Web, uygulama, PDF, sunum, doküman, terminal,
grafik ve marka varlıkları — hepsi tek bir dilden.

Bu repo aynı anda iki şeydir:

1. **Bir tasarım sistemi** — token'lar, kurallar, referans uygulamalar.
2. **Bir Claude skill'i** — kurduğun her makinede Claude bu sistemi otomatik uygular.

---

## 01 // KURULUM

```bash
git clone https://github.com/joxinyks/swiss-neo-monolith.git
cd swiss-neo-monolith
```

**Windows**
```powershell
.\install.ps1
```

**macOS / Linux**
```bash
chmod +x install.sh && ./install.sh
```

Kurulum `skills/swiss-neo-monolith` klasörünü `~/.claude/skills/` altına kopyalar.
Claude'u yeniden başlat; skill her projede otomatik devreye girer.

**Geliştirme makinende** (sistemi düzenlediğin makine) kopya yerine bağlantı kur —
düzenlemeler anında geçerli olur:

```powershell
.\install.ps1 -Link      # Windows (junction)
```
```bash
./install.sh --link      # macOS / Linux (symlink)
```

### Güncelleme (diğer 3 makine)

```bash
git pull && ./install.ps1 -Force
```

### Doğrulama

```bash
node skills/swiss-neo-monolith/scripts/check-contrast.mjs
```

`PASS` görmüyorsan kurulum eksiktir.

---

## 02 // YAPI

```
swiss-neo-monolith/
├─ install.ps1 / install.sh        4 makineye kurulum
└─ skills/swiss-neo-monolith/      ← kurulan birim (kendine yeterli)
   ├─ SKILL.md                     kanon + yönlendirme
   ├─ references/
   │  ├─ 01-foundations.md         renk · aralık · kontur · yükseklik
   │  ├─ 02-typography.md          ölçek · aile · Türkçe büyük harf
   │  ├─ 03-motion-sound.md        geçiş · mekanik ses · imleç
   │  ├─ 04-voice.md               ton · tarih/sayı formatı · etiket sözlüğü
   │  ├─ 10-web.md                 React · Tailwind · komponent kataloğu
   │  ├─ 11-app.md                 masaüstü · mobil · yoğunluk · platform
   │  ├─ 12-print.md               PDF · baskı · sayfa ızgarası · CMYK
   │  ├─ 13-office.md              PPTX · DOCX · XLSX
   │  ├─ 14-terminal.md            CLI · TUI · log
   │  ├─ 15-data-viz.md            grafik · dashboard · KPI
   │  ├─ 16-brand-assets.md        logo · ikon · favicon · OG · e-posta
   │  └─ 99-checklist.md           teslim denetimi
   ├─ tokens/
   │  ├─ tokens.json               ← TEK GERÇEK KAYNAK (elle düzenlenen tek dosya)
   │  └─ dist/                     ← ÜRETİLEN (elle düzenleme)
   │     ├─ tokens.css             CSS custom properties + tema
   │     ├─ tokens.scss
   │     ├─ tokens.ts              tip güvenli erişim + literal değerler
   │     ├─ tailwind.preset.cjs    palette dışını derlemede yakalar
   │     ├─ tokens.py              ReportLab · WeasyPrint · matplotlib
   │     ├─ tokens.dart            Flutter
   │     └─ tokens.resolved.json   platformdan bağımsız (e-posta, Office, native)
   ├─ assets/
   │  ├─ web/    FooterGlobal.tsx · useMechanicalClick.ts · eslint-snm.cjs
   │  ├─ print/  print.css (CSS Paged Media)
   │  └─ office/ snm-theme-colors.xml
   └─ scripts/
      ├─ build-tokens.mjs          tokens.json → dist/
      └─ check-contrast.mjs        WCAG kapısı (CI'da çalıştırılabilir)
```

---

## 03 // KANON

Mecradan bağımsız 6 değişmez. Bir çıktının SNM olup olmadığı bunlarla anlaşılır.

| | |
|---|---|
| **C01** | Sıfır yarıçap — her yerde |
| **C02** | CAD indeksleme — `01 // SECTION` |
| **C03** | Tek kromatik aksan — mint, alanın ≤%10'u |
| **C04** | Yapı çizgiyle kurulur, gölgeyle değil |
| **C05** | Telemetri künyesi — sürüm · ISO tarih · durum |
| **C06** | Asimetri — 40/60, ortalanmış kompozisyon yok |

Ayrıntı: [`SKILL.md`](skills/swiss-neo-monolith/SKILL.md)

---

## 04 // TOKEN DEĞİŞTİRME

Tek kural: **yalnızca `tokens/tokens.json` düzenlenir.**

```bash
# 1. düzenle
#    skills/swiss-neo-monolith/tokens/tokens.json

# 2. derle
node skills/swiss-neo-monolith/scripts/build-tokens.mjs

# 3. doğrula — kontrast kapısı geçmeden commit etme
node skills/swiss-neo-monolith/scripts/check-contrast.mjs

# 4. sürümü yükselt ($meta.version) ve CHANGELOG'a yaz
```

`dist/` altındaki hiçbir dosya elle düzenlenmez; bir sonraki derlemede kaybolur.

---

## 05 // PROJEDE KULLANIM

**Web**
```js
// tailwind.config.js
presets: [require('./vendor/snm/tailwind.preset.cjs')]
```
```css
@import 'vendor/snm/tokens.css';
```

**Python (PDF/grafik)**
```python
from snm.tokens import token, rgb
c = rgb("accent")        # (0.06, 0.73, 0.51)
```

**Flutter**
```dart
import 'snm/tokens.dart';
color: SnmLight.accent,
```

**TypeScript (canvas, SVG, e-posta)**
```ts
import { token } from '@snm/tokens';
token('bgInverse', 'dark');
```

---

## 06 // TELEMETRY

```
REV 1.0.0 · 2026-08-09 · STATUS: OPERATIONAL
OKAN ÖZTÜRK · joxinyks.com · MIT
```
