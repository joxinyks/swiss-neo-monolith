# 11 // APPLICATIONS (masaüstü & mobil)

Uygulama, siteden iki noktada ayrılır: **yoğunluk** ve **platform sözleşmesi**.
Kanon değişmez; ölçüler değişir.

## Yoğunluk (density)

Web sayfası nefes alır; uygulama iş yapar. Uygulamada bir kademe sıkıştır:

| | Web | Uygulama |
|---|---|---|
| Gövde metni | `base` 16px | `sm` 14px |
| Satır yüksekliği (liste/tablo) | 48px | 32px |
| Bölüm boşluğu | `s7` 48px | `s5` 24px |
| Kart iç boşluğu | `s6` 32px | `s4` 16px |
| Buton yüksekliği | 48px | 36px (masaüstü) / 44px (dokunmatik) |

Dokunmatik hedef minimumu (44px) masaüstünde 28px'e inebilir — fare hassasiyeti
farklıdır — ama **klavye odak halkası her iki durumda da tam boyuttadır**.

## Platform sözleşmesi

Bu sistem platformu ezmez, üstüne biner. Uyulacaklar:

- **Pencere kromu**: OS'un kendi başlık çubuğu, trafik ışıkları, pencere yönetimi.
  Özel başlık çubuğu yazacaksan yüksekliği 36px, zemin `bgSunken`, altında 1px
  `border`, sürüklenebilir alan tanımlı (`-webkit-app-region: drag`).
- **Kısayollar**: platform standardı (⌘ / Ctrl). Kendi kısayolunu icat etme.
- **Kaydırma**: OS varsayılan davranışı; özel scroll kaçırma (scrolljacking) yasak.
- **Sistem teması**: uygulama açılışta OS temasını alır, kullanıcı ezebilir.
- **Güvenli alanlar**: mobilde `safe-area-inset-*` her zaman uygulanır (çentik,
  ana ekran çubuğu).
- **Geri jesti**: iOS/Android sistem geri hareketi engellenmez.

Zorunlu platform kontrolleri (iOS switch, Android date picker, native menü) kendi
yuvarlaklığını korur — bu SNM-CANON-01 ihlali sayılmaz. Bunları özel çizmeye kalkma;
uyum, tutarlılıktan önce gelir.

## Uygulama iskeleti

```
┌──────────────────────────────────────────────────┐
│ TITLEBAR   36px · bgSunken · alt 1px border      │
├────────────┬─────────────────────────────────────┤
│ SIDEBAR    │ CONTENT                             │
│ 240px      │ min-w-0, kendi kaydırması           │
│ bgSunken   │                                     │
│ sağ 1px    │                                     │
│ border     │                                     │
├────────────┴─────────────────────────────────────┤
│ STATUS BAR 24px · mono micro · TELEMETRY         │
└──────────────────────────────────────────────────┘
```

**Durum çubuğu SNM-CANON-05'in uygulama karşılığıdır** ve atlanamaz. İçerik:
bağlantı durumu (nabız + etiket), aktif bağlam, sürüm, saat. Mono `micro`.

Kenar çubuğu öğeleri: 32px yüksekliğinde, 12px ikon, mono `xs` etiket, aktif öğe
sol kenarında 2px mint şerit (dolgu zemin değil, çizgi).

## Mobil

- Alt navigasyon 56px + safe-area; en fazla 5 sekme; aktif sekme mint üst şerit.
- Başlık çubuğu 56px, sola dayalı başlık (ortalanmış değil — SNM-CANON-06).
- Liste satırı 56px, sağda mono meta değer, altında 1px ayraç.
- Aşağı çekip yenileme: spinner yerine 2px mint çizgi.
- Modal yerine tam ekran sheet; üstte 2px kontur, sola dayalı başlık, sağda `✕`.

## Framework notları

| Framework | Token dosyası | Not |
|---|---|---|
| Electron / Tauri | `tokens.css` | Web kuralları geçerli; yoğunluğu düşür. `-webkit-app-region` tanımla. |
| React Native | `tokens.ts` | `borderRadius: 0` tema sabiti; `Platform.select` ile yoğunluk. Gölge yerine `borderWidth`. |
| Flutter | `tokens.dart` | `BorderRadius.zero` global tema; `CardTheme`, `InputDecorationTheme`, `ElevatedButtonTheme` içinde `elevation: 0` + `side: BorderSide(width: 2)`. |
| SwiftUI / Compose | `tokens.resolved.json` | Renkleri asset katalogla senkronize et; `.cornerRadius(0)`. |

Flutter'da `Material` varsayılan elevation'ı (blur gölge) **her temada sıfırlanmalı** —
`ThemeData(useMaterial3: true, cardTheme: CardTheme(elevation: 0, shape: …))`.

## Uygulamaya özgü erişilebilirlik

- Ekran okuyucu etiketleri (`Semantics` / `accessibilityLabel`) her etkileşimli öğede.
- Dinamik yazı tipi boyutu (iOS Dynamic Type / Android font scale) desteklenir;
  sabit `px` yerine ölçeklenen birim kullan. Ölçek 200%'de layout bozulmamalı.
- Odak sırası görsel sırayla eşleşir.
- Kritik akışlar yalnızca jestle değil, düğmeyle de tamamlanabilir.
