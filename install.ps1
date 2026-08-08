<#
.SYNOPSIS
  Swiss Neo-Monolith — install the design system skill on this machine.

.DESCRIPTION
  Copies (or links) skills/swiss-neo-monolith into ~/.claude/skills so Claude
  picks it up in every project on this machine.

.PARAMETER Link
  Create a directory junction instead of copying. Use this on the machine where
  you develop the system — edits take effect immediately, no reinstall.

.PARAMETER Force
  Replace an existing installation without prompting.

.EXAMPLE
  .\install.ps1              # copy (use on your other machines)
  .\install.ps1 -Link        # junction (use on your dev machine)
#>
[CmdletBinding()]
param(
  [switch]$Link,
  [switch]$Force
)

$ErrorActionPreference = 'Stop'

$Source = Join-Path $PSScriptRoot 'skills\swiss-neo-monolith'
$SkillsDir = Join-Path $HOME '.claude\skills'
$Target = Join-Path $SkillsDir 'swiss-neo-monolith'

function Write-Row($sym, $label, $value) {
  Write-Host (" {0}  {1}  {2}" -f $sym, $label.PadRight(18), $value)
}

Write-Host ""
Write-Host "01 // INSTALL"
Write-Host ("-" * 60)

if (-not (Test-Path (Join-Path $Source 'SKILL.md'))) {
  Write-Row 'x' 'source' "bulunamadi: $Source"
  exit 1
}
Write-Row '*' 'source' $Source

New-Item -ItemType Directory -Path $SkillsDir -Force | Out-Null

if (Test-Path $Target) {
  if (-not $Force) {
    $ans = Read-Host " !  '$Target' zaten var. Degistirilsin mi? [y/N]"
    if ($ans -ne 'y' -and $ans -ne 'Y') { Write-Host " iptal edildi."; exit 1 }
  }
  # Remove-Item on a junction removes the link, not the target contents.
  Remove-Item $Target -Recurse -Force
  Write-Row '*' 'previous' 'kaldirildi'
}

if ($Link) {
  New-Item -ItemType Junction -Path $Target -Target $Source | Out-Null
  Write-Row '*' 'mode' 'junction (canli)'
} else {
  Copy-Item $Source $Target -Recurse
  Write-Row '*' 'mode' 'kopya'
}

Write-Row '*' 'target' $Target

# Rebuild + verify. A skill that ships failing contrast is worse than no skill.
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
  & node (Join-Path $Target 'scripts\build-tokens.mjs') | Out-Null
  Write-Row '*' 'tokens' 'derlendi'

  & node (Join-Path $Target 'scripts\check-contrast.mjs') | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Row '*' 'contrast' 'gecti'
  } else {
    Write-Row 'x' 'contrast' 'BASARISIZ - check-contrast.mjs calistir'
  }
} else {
  Write-Row '!' 'node' 'bulunamadi - token derlemesi atlandi'
}

Write-Host ("-" * 60)
$stamp = (Get-Date).ToUniversalTime().ToString('yyyy-MM-dd HH:mm')
Write-Host ("DONE - swiss-neo-monolith - {0}Z" -f $stamp)
Write-Host ""
Write-Host " Claude'u yeniden baslat, sonra dene:"
Write-Host '   "bir teklif PDFi hazirla" / "bu butonu benim tarzimda yaz"'
Write-Host ""
