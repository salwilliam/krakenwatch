#!/usr/bin/env bash
# setup-ssh.sh
#
# Reads the GITHUB_DEPLOY_KEY secret from the environment and writes it to
# ~/.ssh/id_ed25519 so that SSH-based git operations (e.g. pushing to GitHub)
# work without any manual key configuration.
#
# Replit Secrets flatten multi-line values to a single space-separated line.
# This script reconstructs the proper PEM format before writing the key file.
#
# Usage:
#   bash scripts/setup-ssh.sh          # standalone
#   source scripts/setup-ssh.sh        # inline in another script
#
# Required environment variable:
#   GITHUB_DEPLOY_KEY  — the SSH private key (stored as a Replit Secret)

set -euo pipefail
# Never allow xtrace (bash -x / set -x) while the private key is in scope.
# If a caller already set -x, we turn it off here and restore it on exit
# so the key material is never echoed to any log or terminal.
_XTRACE_WAS_ON=false
if [[ "$-" == *x* ]]; then
  _XTRACE_WAS_ON=true
fi
set +x

if [ -z "${GITHUB_DEPLOY_KEY:-}" ]; then
  echo "ERROR: GITHUB_DEPLOY_KEY is not set." >&2
  echo "       Add your SSH private key as a Replit Secret named GITHUB_DEPLOY_KEY." >&2
  exit 1
fi

SSH_DIR="$HOME/.ssh"
KEY_FILE="$SSH_DIR/id_ed25519"
KNOWN_HOSTS="$SSH_DIR/known_hosts"

mkdir -p "$SSH_DIR"
chmod 700 "$SSH_DIR"

# Reconstruct the PEM key using Node.js.
# Replit collapses newlines to spaces when storing multi-line secrets, so we
# rebuild the proper line structure here before writing the key file.
node - <<'JSEOF'
const fs   = require('fs');
const os   = require('os');
const path = require('path');

const raw   = process.env.GITHUB_DEPLOY_KEY || '';
const BEGIN = '-----BEGIN OPENSSH PRIVATE KEY-----';
const END   = '-----END OPENSSH PRIVATE KEY-----';

let out;
if (raw.includes('\n')) {
  // Key already has real newlines — write as-is with a trailing newline
  out = raw.trimEnd() + '\n';
} else {
  // Replit has flattened newlines → spaces; reconstruct the PEM format
  let body = raw.trim();
  if (body.startsWith(BEGIN)) body = body.slice(BEGIN.length).trim();
  if (body.endsWith(END))     body = body.slice(0, -END.length).trim();
  // Remaining tokens are base64 payload lines (no spaces within a line)
  out = BEGIN + '\n' + body.split(/\s+/).join('\n') + '\n' + END + '\n';
}

const keyFile = path.join(os.homedir(), '.ssh', 'id_ed25519');
fs.writeFileSync(keyFile, out, { mode: 0o600 });
JSEOF

chmod 600 "$KEY_FILE"

# Validate the key is well-formed before continuing; fail fast with a clear message
if ! ssh-keygen -y -f "$KEY_FILE" > /dev/null 2>&1; then
  echo "ERROR: The key written to $KEY_FILE is not a valid SSH private key." >&2
  echo "       Check that GITHUB_DEPLOY_KEY contains the full OpenSSH private key." >&2
  rm -f "$KEY_FILE"
  exit 1
fi

# Add github.com to known_hosts so ssh does not prompt for host verification
if ! grep -q "github.com" "$KNOWN_HOSTS" 2>/dev/null; then
  ssh-keyscan -t ed25519 github.com >> "$KNOWN_HOSTS" 2>/dev/null
  chmod 644 "$KNOWN_HOSTS"
  echo "==> Added github.com to $KNOWN_HOSTS"
fi

echo "==> SSH key written to $KEY_FILE"

# Restore xtrace if the caller had it enabled
if [ "$_XTRACE_WAS_ON" = true ]; then
  set -x
fi
