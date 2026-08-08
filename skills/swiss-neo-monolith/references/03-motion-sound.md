# 03 // MOTION & SOUND

Hareket mekaniktir, organik değil. Bu sistem bir makinedir; bir baloncuk değil.

## İlkeler

1. **Yay yok, sıçrama yok, aşma yok.** Spring, bounce, elastic easing yasak.
2. **Ortogonal hareket.** Öğeler yalnızca X veya Y ekseninde kayar. Çapraz kayma,
   ölçek animasyonu (`scale`), rotasyon (90° katları hariç) kullanılmaz.
3. **Tam piksel.** Yarım piksel kayma yok; hareket mesafesi aralık ölçeğinden gelir.
4. **Kısa.** 320ms'yi aşan hiçbir arayüz geçişi yoktur.
5. **Opaklık tek başına yeterli değil.** Fade-in her zaman 8-16px'lik bir kayma ile eşlenir.

## Token'lar

| | Süre | Kullanım |
|---|---|---|
| `fast` | 120ms | Hover, focus, renk değişimi, buton basımı |
| `base` | 180ms | Açılır menü, sekme geçişi, akordeon |
| `slow` | 320ms | Modal, sayfa geçişi, drawer |

Easing: `mech` = `cubic-bezier(0.2, 0, 0, 1)` — varsayılan. Sert atak, kesin duruş.
`out` = `cubic-bezier(0.16, 1, 0.3, 1)` — girişler için.
`step` = `steps(4, end)` — telemetri sayaçları, yükleniyor göstergeleri (kasıtlı olarak
kesikli; dijital ölçüm aleti hissi).

## Property kuralı

`transition: all` **yasak**. Her zaman açık liste:

```css
transition: background-color var(--snm-duration-fast) var(--snm-ease-mech),
            border-color     var(--snm-duration-fast) var(--snm-ease-mech),
            color            var(--snm-duration-fast) var(--snm-ease-mech);
```

Animasyonlanabilir property'ler: `opacity`, `transform`, `background-color`,
`border-color`, `color`, `box-shadow` (ofset gölge). Layout property'leri
(`width`, `height`, `top`, `margin`) animasyonlanmaz — `transform` kullan.

## Basma geri bildirimi (tactile press)

Sistemin imza etkileşimi. Buton basıldığında sert ofset gölgesi kapanır ve öğe
gölgenin içine oturur — mekanik bir tuş gibi:

```css
.snm-btn {
  box-shadow: var(--snm-elevation-1);      /* 2px 2px 0 */
  transition: transform var(--snm-duration-fast) var(--snm-ease-mech),
              box-shadow var(--snm-duration-fast) var(--snm-ease-mech);
}
.snm-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 0 var(--snm-border-strong);
}
```

Bu davranış her mecrada taklit edilir: mobilde basma anında aynı 2px kayma,
terminalde seçili satırda `▌` işareti, PDF'te (statik) gölge her zaman açık.

## prefers-reduced-motion

Zorunlu. `tokens.css` süreleri otomatik 0ms'e çeker, ama ek olarak:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

Parallax, otomatik döngüsel animasyon ve nabız efektleri bu modda tamamen durur.

## Ses — mekanik tuş sesi

Web Audio API ile sentezlenir; ses dosyası yüklenmez.

**Kurallar (pazarlıksız):**

1. **Varsayılan KAPALI.** Sayfa açılışında hiçbir ses çalmaz.
2. Görünür bir açma/kapama anahtarı bulunur; tercih `localStorage`'da saklanır
   (`snm.sound = "on" | "off"`).
3. `AudioContext` yalnızca ilk gerçek kullanıcı jestinden sonra oluşturulur ve
   `resume()` edilir — aksi hâlde tarayıcı bloklar ve konsol kirlenir.
4. `prefers-reduced-motion: reduce` **veya** sistem sessize alınmışsa ses çalmaz.
5. Ses yalnızca **kullanıcının başlattığı** olaylara eşlik eder. Otomatik olay,
   bildirim, sayfa yüklenmesi ses çıkarmaz.
6. Tepe kazanç `0.08`'i geçmez. Süre `< 40ms`. Bu bir tık, bir ton değil.

Referans uygulama: `assets/web/useMechanicalClick.ts`.

## İmleç ve hover

`CursorPreview` (proje satırlarında fareyi takip eden görsel önizleme) yalnızca
`@media (hover: hover) and (pointer: fine)` altında etkinleşir. Dokunmatik
cihazlarda tamamen devre dışıdır ve yerine satır içi küçük görsel gösterilir.

Takip hareketi `lerp` ile yumuşatılır ama gecikme 60ms'yi aşmaz — geride sürüklenen
imleç bu sistemin sertliğiyle çelişir.

## Yükleniyor durumları

Spinner yok (dönme yasak). Bunun yerine:

- **Determinate**: 2px yüksekliğinde, mint dolgulu, keskin uçlu ilerleme çubuğu.
- **Indeterminate**: `steps()` ile kesikli ilerleyen 2px şerit, ya da monospace
  sayaç (`LOADING 03/12`).
- **Skeleton**: dolgu rengi `bgSunken`, animasyonsuz ya da yalnızca opaklık nabzı
  (kayan gradyan parıltısı **yasak** — degrade ihlali).
