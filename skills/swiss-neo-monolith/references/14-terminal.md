# 14 // TERMINAL & CLI

Bir CLI de tasarlanmış bir yüzeydir. Bu sistemin CAD estetiği terminale doğal
olarak oturur — zaten monospace bir dünyadır.

## Renk

Terminaller 256 renk / truecolor destekler ama **renk asla tek bilgi taşıyıcı
değildir**; her zaman bir sembol ya da etiket eşlik eder (NO_COLOR, pipe, log dosyası).

| Rol | Truecolor | ANSI 256 fallback |
|---|---|---|
| Aksan / başarı | `#10b981` | `\e[38;5;42m` |
| Metin | varsayılan | — |
| Sönük / meta | `#6b7280` | `\e[38;5;244m` |
| Hata | `#f87171` | `\e[38;5;203m` |
| Uyarı | `#fbbf24` | `\e[38;5;220m` |
| Bilgi | `#93c5fd` | `\e[38;5;111m` |

Zorunlu: `NO_COLOR` ortam değişkenine uy · stdout TTY değilse renk kapat ·
`--no-color` bayrağı · `FORCE_COLOR` desteği.

## Kutu çizimi

Yalnızca **keskin köşeli** Unicode box-drawing karakterleri. Yuvarlak köşe
(`╭ ╮ ╰ ╯`) SNM-CANON-01 ihlalidir.

```
┌─────────────────────────────────────────────┐
│ 01 // BUILD                        REV 1.0.0│
├─────────────────────────────────────────────┤
│ ● tokens        compiled          109 tokens│
│ ● contrast      passed             24 pairs │
│ ○ bundle        pending                    │
└─────────────────────────────────────────────┘
 OKAN ÖZTÜRK · 2026-08-09 14:30 · 1.24s
```

ASCII fallback (`--ascii` veya Unicode desteklenmiyorsa): `+ - |`.

## Başlık ve künye (SNM-CANON-02 / 05)

Her komut çıktısı bir CAD başlığıyla açılır ve bir telemetri satırıyla kapanır:

```
01 // BUILD                                  REV 1.0.0
…
─────────────────────────────────────────────────────
DONE · 109 tokens · 1.24s · 2026-08-09 14:30
```

Telemetri satırı: sonuç · sayım · süre · ISO zaman damgası. Sönük renkte.

## Durum sembolleri

```
●  tamamlandı      ○  bekliyor       ◐  çalışıyor
✕  hata            !  uyarı          →  bilgi / adım
```

Emoji kullanma. Spinner dönmez — `◐ ◓ ◑ ◒` dört kareli `steps` döngüsü ya da
sabit `◐` + ilerleme sayacı (`03/12`).

İlerleme çubuğu: `████████░░░░░░░░  62%` — keskin blok karakterler, yuvarlak uç yok.

## Hizalama

- Tablo kolonları sabit genişlikte, sola dayalı; sayılar sağa dayalı.
- Terminal genişliği okunur (`process.stdout.columns`), 80 sütun altına düşerse
  sadeleşmiş düzene geçilir.
- Girinti 2 boşluk. Tab kullanma.

## Log formatı

Makine okunur olmalı ve aynı zamanda SNM okunmalı:

```
2026-08-09T14:30:12Z  INFO   build    tokens compiled  count=109 dur=1.24s
2026-08-09T14:30:13Z  ERROR  build    contrast failed  pair=steel500/bone200 ratio=4.38
```

ISO 8601 UTC zaman damgası · sabit genişlikte seviye · bileşen adı ·
mesaj · `key=value` yapılandırılmış alanlar. JSON log gerekiyorsa aynı alan
adlarıyla.

## Yardım metni

```
snm — Swiss Neo-Monolith toolkit

USAGE
  snm <command> [options]

COMMANDS
  build            token'ları derle
  check            kontrast ve kanon denetimi
  init <medium>    yeni proje iskeleti

OPTIONS
  --no-color       renkli çıktıyı kapat
  --ascii          ASCII kutu karakterleri kullan
  -v, --version    sürüm

  Okan Öztürk · joxinyks.com
```

Bölüm başlıkları büyük harf, iki boşluk girinti, hizalanmış açıklama kolonu.

## Etkileşimli istemler

- Seçim listesi: `❯` işaretçisi (ok değil), seçili satır mint.
- Onay: varsayılan **hayır** olan yıkıcı işlemler için `[y/N]`.
- TTY değilse etkileşimli mod otomatik kapanır ve hata verir; sessizce varsayılana
  düşmez.
