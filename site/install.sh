#!/usr/bin/env bash
# get.routster.trackster.dev/install.sh
# Runs the current installer from routster-agent's main branch, so this file never goes stale.
# The whole script is downloaded before anything runs: a dropped connection can't execute half of it.
set -euo pipefail

main() {
  local url="https://raw.githubusercontent.com/ArzakaRaffan/routster-agent/main/scripts/install.sh"
  local script
  # --retry covers transient failures, including raw.githubusercontent.com's 429 rate limit.
  if ! script="$(curl -fsSL --retry 4 --retry-delay 3 "$url")"; then
    echo "Gagal mengunduh installer dari $url" >&2
    exit 1
  fi
  # Same as `curl ... | bash -s -- "$@"`: the installer sees the exact environment it was written for.
  bash -s -- "$@" <<<"$script"
}

main "$@"
