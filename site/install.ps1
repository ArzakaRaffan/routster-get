# get.routster.trackster.dev/install.ps1
# Runs the current installer from routster-agent's main branch, so this file never goes stale.
#   irm https://get.routster.trackster.dev/install.ps1 | iex
$ErrorActionPreference = "Stop"
$url = "https://raw.githubusercontent.com/ArzakaRaffan/routster-agent/main/scripts/install.ps1"
& ([scriptblock]::Create((Invoke-RestMethod $url))) @args
