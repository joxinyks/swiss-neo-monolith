#!/usr/bin/env bash
#
# Swiss Neo-Monolith — install the design system skill on this machine.
#
#   ./install.sh          copy   (use on your other machines)
#   ./install.sh --link   symlink (use on your dev machine)
#   ./install.sh --force  replace without prompting
#
set -euo pipefail

LINK=0
FORCE=0
for arg in "$@"; do
  case "$arg" in
    --link)  LINK=1 ;;
    --force) FORCE=1 ;;
    *) echo "bilinmeyen secenek: $arg" >&2; exit 2 ;;
  esac
done

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="$ROOT/skills/swiss-neo-monolith"
SKILLS_DIR="${HOME}/.claude/skills"
TARGET="$SKILLS_DIR/swiss-neo-monolith"

row() { printf ' %s  %-18s %s\n' "$1" "$2" "$3"; }

echo
echo "01 // INSTALL"
printf '%.0s-' {1..60}; echo

[ -f "$SOURCE/SKILL.md" ] || { row 'x' 'source' "bulunamadı: $SOURCE"; exit 1; }
row '*' 'source' "$SOURCE"

mkdir -p "$SKILLS_DIR"

if [ -e "$TARGET" ] || [ -L "$TARGET" ]; then
  if [ "$FORCE" -eq 0 ]; then
    read -r -p " !  '$TARGET' zaten var. Değiştirilsin mi? [y/N] " ans
    [[ "$ans" == "y" || "$ans" == "Y" ]] || { echo " iptal edildi."; exit 1; }
  fi
  rm -rf "$TARGET"
  row '*' 'previous' 'kaldırıldı'
fi

if [ "$LINK" -eq 1 ]; then
  ln -s "$SOURCE" "$TARGET"
  row '*' 'mode' 'symlink (canlı)'
else
  cp -R "$SOURCE" "$TARGET"
  row '*' 'mode' 'kopya'
fi

row '*' 'target' "$TARGET"

# Rebuild + verify. A skill that ships failing contrast is worse than no skill.
if command -v node >/dev/null 2>&1; then
  node "$TARGET/scripts/build-tokens.mjs" >/dev/null
  row '*' 'tokens' 'derlendi'
  if node "$TARGET/scripts/check-contrast.mjs" >/dev/null; then
    row '*' 'contrast' 'geçti'
  else
    row 'x' 'contrast' 'BAŞARISIZ — check-contrast.mjs çalıştır'
  fi
else
  row '!' 'node' 'bulunamadı — token derlemesi atlandı'
fi

printf '%.0s-' {1..60}; echo
echo "DONE · swiss-neo-monolith · $(date -u '+%Y-%m-%d %H:%M')Z"
echo
echo " Claude'u yeniden başlat, sonra dene:"
echo '   "bir teklif PDFi hazırla" / "bu butonu benim tarzımda yaz"'
echo
