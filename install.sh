#!/usr/bin/env bash
#
# Swiss Neo-Monolith — install the design system skill on this machine.
#
# The repository root IS the skill: it carries SKILL.md, references/, tokens/
# and assets/. This script links or copies it into ~/.claude/skills, compiles the
# token bindings and runs the contrast gate.
#
#   ./install.sh            copy    — machines that consume the system
#   ./install.sh --link     symlink — the machine where the system is edited
#   ./install.sh --force    replace an existing installation without prompting
#
set -euo pipefail

LINK=0
FORCE=0
for arg in "$@"; do
  case "$arg" in
    --link)  LINK=1 ;;
    --force) FORCE=1 ;;
    -h|--help) sed -n '2,14p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="${HOME}/.claude/skills"
TARGET="$SKILLS_DIR/swiss-neo-monolith"

# Output follows the system's own terminal rules (references/14-terminal.md):
# CAD heading, aligned columns, telemetry line, no emoji.
row()  { printf '  %s  %-12s %s\n' "$1" "$2" "$3"; }
rule() { printf '%.0s-' $(seq 62); echo; }

echo
echo "01 // INSTALL                              swiss-neo-monolith"
rule

if [ ! -f "$SOURCE/SKILL.md" ]; then
  row 'x' 'source' "SKILL.md not found in $SOURCE"
  rule
  echo "FAILED  run this script from the repository root"
  echo
  exit 1
fi
row '*' 'source' "$SOURCE"

mkdir -p "$SKILLS_DIR"

if [ -e "$TARGET" ] || [ -L "$TARGET" ]; then
  if [ "$FORCE" -eq 0 ]; then
    echo
    echo "  !  An installation already exists at:"
    echo "     $TARGET"
    read -r -p "     Replace it? [y/N] " answer
    case "$answer" in
      y|Y) echo ;;
      *) echo; echo "CANCELLED"; echo; exit 1 ;;
    esac
  fi
  rm -rf "$TARGET"
  row '*' 'previous' 'removed'
fi

if [ "$LINK" -eq 1 ]; then
  ln -s "$SOURCE" "$TARGET"
  row '*' 'mode' 'symlink (live)'
else
  # Copy the system, not the repository plumbing: .git alone can dwarf it.
  mkdir -p "$TARGET"
  for entry in "$SOURCE"/* "$SOURCE"/.[!.]*; do
    [ -e "$entry" ] || continue
    case "$(basename "$entry")" in
      .git|node_modules|.github) continue ;;
    esac
    cp -R "$entry" "$TARGET/"
  done
  row '*' 'mode' 'copy'
fi
row '*' 'target' "$TARGET"

# A skill that ships a failing contrast gate is worse than no skill at all.
verified=1
if command -v node >/dev/null 2>&1; then
  node "$TARGET/scripts/build-tokens.mjs" >/dev/null
  row '*' 'tokens' 'compiled'
  if node "$TARGET/scripts/check-contrast.mjs" >/dev/null; then
    row '*' 'contrast' 'pass'
  else
    row 'x' 'contrast' 'FAIL — run scripts/check-contrast.mjs for detail'
    verified=0
  fi
else
  row '!' 'node' 'not found — token bindings not verified'
  verified=0
fi

rule
if [ "$verified" -eq 1 ]; then
  printf 'DONE     swiss-neo-monolith  %sZ\n' "$(date -u '+%Y-%m-%d %H:%M')"
else
  printf 'PARTIAL  swiss-neo-monolith  %sZ\n' "$(date -u '+%Y-%m-%d %H:%M')"
fi
echo
echo "  Restart Claude to load the skill."
echo

[ "$verified" -eq 1 ] || exit 1
