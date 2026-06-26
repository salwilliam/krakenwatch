#!/usr/bin/env bash
# ensure-git-identity.sh
#
# Sets a local git identity (user.name / user.email) for the current repo when
# either value is absent from the environment.  This prevents "Author identity
# unknown" errors in scripts that need to make commits.
#
# Usage (call from another script — do not source; uses set -euo pipefail):
#   bash scripts/ensure-git-identity.sh [<name>] [<email>]
#
# Arguments (both optional):
#   <name>   git user.name  to use as the fallback (default: "Kraken Watch Bot")
#   <email>  git user.email to use as the fallback (default: "bot@krakenwatch.replit")
#
# The identity is set at the repo level (--local) so it never pollutes the
# global git config of the environment.

set -euo pipefail

FALLBACK_NAME="${1:-Kraken Watch Bot}"
FALLBACK_EMAIL="${2:-bot@krakenwatch.replit}"

if [ -z "$(git config user.email 2>/dev/null)" ] || [ -z "$(git config user.name 2>/dev/null)" ]; then
  echo "==> Git identity missing or incomplete — configuring fallback identity for this repo …"
  echo "    (was: name='$(git config user.name 2>/dev/null)' email='$(git config user.email 2>/dev/null)')"
  git config user.name  "$FALLBACK_NAME"
  git config user.email "$FALLBACK_EMAIL"
  echo "    user.name  = $FALLBACK_NAME"
  echo "    user.email = $FALLBACK_EMAIL"
fi
