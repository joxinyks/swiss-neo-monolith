<#
.SYNOPSIS
  Swiss Neo-Monolith — install the design system skill on this machine.

.DESCRIPTION
  The repository root IS the skill: it carries SKILL.md, references/, tokens/ and
  assets/. This script links or copies it into ~/.claude/skills, compiles the
  token bindings and runs the contrast gate. Claude picks the skill up in every
  project on this machine after a restart.

.PARAMETER Link
  Create a directory junction instead of copying. Use this on the machine where
  the system itself is edited: changes take effect without reinstalling.

.PARAMETER Force
  Replace an existing installation without prompting.

.EXAMPLE
  .\install.ps1
  Copies the skill. Use on machines that only consume the system.

.EXAMPLE
  .\install.ps1 -Link
  Links the skill. Use on the development machine.
#>
[CmdletBinding()]
param(
  [switch]$Link,
  [switch]$Force
)

$ErrorActionPreference = 'Stop'

$Source    = $PSScriptRoot
$SkillsDir = Join-Path $HOME '.claude\skills'
$Target    = Join-Path $SkillsDir 'swiss-neo-monolith'

# Output follows the system's own terminal rules (see references/14-terminal.md):
# CAD heading, aligned columns, telemetry line, no emoji.
function Write-Row([string]$Symbol, [string]$Field, [string]$Value) {
  Write-Host ('  {0}  {1}  {2}' -f $Symbol, $Field.PadRight(12), $Value)
}
function Write-Rule { Write-Host ('-' * 62) }

Write-Host ''
Write-Host '01 // INSTALL                              swiss-neo-monolith'
Write-Rule

if (-not (Test-Path (Join-Path $Source 'SKILL.md'))) {
  Write-Row 'x' 'source' "SKILL.md not found in $Source"
  Write-Rule
  Write-Host 'FAILED  run this script from the repository root'
  Write-Host ''
  exit 1
}
Write-Row '*' 'source' $Source

New-Item -ItemType Directory -Path $SkillsDir -Force | Out-Null

if (Test-Path $Target) {
  if (-not $Force) {
    Write-Host ''
    Write-Host '  !  An installation already exists at:'
    Write-Host "     $Target"
    $answer = Read-Host '     Replace it? [y/N]'
    if ($answer -notin @('y', 'Y')) {
      Write-Host ''
      Write-Host 'CANCELLED'
      Write-Host ''
      exit 1
    }
    Write-Host ''
  }
  # On a junction this removes the link, not the files it points at.
  Remove-Item $Target -Recurse -Force
  Write-Row '*' 'previous' 'removed'
}

if ($Link) {
  New-Item -ItemType Junction -Path $Target -Target $Source | Out-Null
  Write-Row '*' 'mode' 'junction (live)'
} else {
  # Copy the system, not the repository plumbing: .git alone can dwarf it.
  New-Item -ItemType Directory -Path $Target -Force | Out-Null
  $exclude = @('.git', 'node_modules', '.github')
  Get-ChildItem $Source -Force |
    Where-Object { $exclude -notcontains $_.Name } |
    ForEach-Object { Copy-Item $_.FullName -Destination $Target -Recurse -Force }
  Write-Row '*' 'mode' 'copy'
}
Write-Row '*' 'target' $Target

# A skill that ships a failing contrast gate is worse than no skill at all.
$verified = $true
if (Get-Command node -ErrorAction SilentlyContinue) {
  & node (Join-Path $Target 'scripts\build-tokens.mjs') | Out-Null
  Write-Row '*' 'tokens' 'compiled'

  & node (Join-Path $Target 'scripts\check-contrast.mjs') | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Row '*' 'contrast' 'pass'
  } else {
    Write-Row 'x' 'contrast' 'FAIL — run scripts\check-contrast.mjs for detail'
    $verified = $false
  }
} else {
  Write-Row '!' 'node' 'not found — token bindings not verified'
  $verified = $false
}

Write-Rule
$stamp = (Get-Date).ToUniversalTime().ToString('yyyy-MM-dd HH:mm')
Write-Host ('{0}  swiss-neo-monolith  {1}Z' -f $(if ($verified) { 'DONE   ' } else { 'PARTIAL' }), $stamp)
Write-Host ''
Write-Host '  Restart Claude to load the skill.'
Write-Host ''

exit $(if ($verified) { 0 } else { 1 })
