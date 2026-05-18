#!/usr/bin/env bash
# rotate-deploy-key.sh
#
# Generates a fresh ed25519 deploy key for salwilliam/krakenwatch and rotates
# it in one step.
#
# Fully automated when both REPLIT_API_KEY and GITHUB_PERSONAL_ACCESS_TOKEN are set:
#   - Generates the new key pair
#   - Prints only the public key (safe to share)
#   - Automatically pushes the private key to the GITHUB_DEPLOY_KEY Replit
#     Secret via the Replit API — no copy-paste required
#   - Removes all existing GitHub deploy keys via the GitHub API
#   - Adds the new public key to GitHub with write access
#   - Prints a summary of keys removed and added
#   - Verifies SSH auth end-to-end
#   No browser interaction needed at any step.
#
# When REPLIT_API_KEY is NOT set:
#   - Stages the private key at a temp path (mode 600)
#   - Guides you through the manual Replit secret-update step
#   GitHub keys are still rotated automatically via GITHUB_PERSONAL_ACCESS_TOKEN.
#
# The private key is NEVER printed to the terminal or to any log in either path.
#
# Usage:
#   bash scripts/rotate-deploy-key.sh
#
# Required secrets:
#   REPLIT_API_KEY — a Replit personal token with "read/write repl" scope.
#     Generate one at: https://replit.com/account#tokens
#     Store it as an env var (not a secret) so the script can read it.
#   GITHUB_PERSONAL_ACCESS_TOKEN     — a GitHub personal access token with repo scope.
#     Store it as a Replit Secret named GITHUB_PERSONAL_ACCESS_TOKEN.
#
# After running this script:
#   bash scripts/setup-ssh.sh && ssh -T git@github.com
# should respond: "Hi salwilliam/krakenwatch! You've successfully authenticated."

set -euo pipefail
set +x   # Never allow xtrace — the private key must not appear in any log

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="salwilliam/krakenwatch"
TMP_KEY="$(mktemp /tmp/deploy_key_XXXXXX)"
TMP_PUB="${TMP_KEY}.pub"
STAGED_KEY="/tmp/new_deploy_key"

cleanup() {
  rm -f "$TMP_KEY" "$TMP_PUB" "$STAGED_KEY"
}
trap cleanup EXIT INT TERM

# ── Ensure git identity is configured ────────────────────────────────────────
# The rotation script may need to commit changes (e.g. updated key references
# or known-hosts entries).  Call the shared helper up-front so no git commit
# step ever fails with "Author identity unknown", and so this script never
# re-implements the identity-check pattern inline.
bash "$SCRIPT_DIR/ensure-git-identity.sh" "Kraken Watch Rotate" "rotate@krakenwatch.replit"

# ── 1. Generate a new key pair ───────────────────────────────────────────────
COMMENT="krakenwatch-deploy-$(date +%Y%m%d)"
ssh-keygen -t ed25519 -C "$COMMENT" -f "$TMP_KEY" -N "" -q
chmod 600 "$TMP_KEY"
KEY_FINGERPRINT="$(ssh-keygen -lf "$TMP_PUB" | awk '{print $2}')"

echo ""
echo "==> New ed25519 key pair generated (private key NOT shown here)."
echo "    Fingerprint: $KEY_FINGERPRINT"
echo ""

# ── 2. Show the public key ───────────────────────────────────────────────────
PUB_KEY="$(cat "$TMP_PUB")"
echo "════════════════════════════════════════════════════════════"
echo "  PUBLIC KEY  (safe to share — add this to GitHub)"
echo "════════════════════════════════════════════════════════════"
echo "$PUB_KEY"
echo "════════════════════════════════════════════════════════════"
echo ""

# ── 3. Update the Replit secret (automatically or manually) ──────────────────

# Determine the effective API key and Repl UUID for the automated path.
# Use safe expansions so set -u never hard-fails on unset variables.
_AUTO_KEY="${REPLIT_API_KEY:-}"
_REPL_UUID=""
if [ -n "$_AUTO_KEY" ]; then
  _REPL_ID_RAW="${REPL_ID:-}"
  if [ -z "$_REPL_ID_RAW" ]; then
    echo "WARNING: REPL_ID is not set — cannot auto-update via Replit API." >&2
    echo "         Falling back to the manual update path …" >&2
    _AUTO_KEY=""
  else
    _REPL_UUID="${_REPL_ID_RAW%%:*}"
  fi
fi

if [ -n "$_AUTO_KEY" ]; then
  # ── Automatic path: push the private key to the Replit Secrets vault ────────
  echo "==> Updating GITHUB_DEPLOY_KEY in Replit Secrets via the Replit API …"

  # Delegate the HTTPS call to Node.js so the key is never in CLI args or logs.
  # KEY_FILE and REPL_UUID are passed as env vars; the script reads them there.
  _UPDATE_OK=0
  KEY_FILE="$TMP_KEY" REPL_UUID="$_REPL_UUID" node - <<'JSEOF' || _UPDATE_OK=$?
const https = require('https');
const fs    = require('fs');

const apiKey      = process.env.REPLIT_API_KEY;
const replUuid    = process.env.REPL_UUID;
const secretName  = 'GITHUB_DEPLOY_KEY';
const secretValue = fs.readFileSync(process.env.KEY_FILE, 'utf8').trimEnd();

function apiRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const options = {
      hostname: 'replit.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

(async () => {
  const basePath = `/api/v1/repls/${replUuid}/secrets`;

  // Try POST first (create / upsert).
  let res = await apiRequest('POST', basePath, { name: secretName, value: secretValue });

  // If the secret already exists some APIs return 409; fall back to a named PUT.
  if (res.status === 409) {
    res = await apiRequest('PUT', `${basePath}/${secretName}`, { value: secretValue });
  }

  if (res.status >= 200 && res.status < 300) {
    console.log('==> GITHUB_DEPLOY_KEY secret updated successfully.');
  } else {
    console.error(`ERROR: Replit API returned HTTP ${res.status}`);
    console.error(`Response body: ${res.body}`);
    process.exit(1);
  }
})();
JSEOF

  if [ "$_UPDATE_OK" -ne 0 ]; then
    echo "" >&2
    echo "ERROR: Failed to update the Replit secret automatically." >&2
    echo "       Check that REPLIT_API_KEY is a valid Replit personal token" >&2
    echo "       with read/write repl scope (https://replit.com/account#tokens)." >&2
    echo "" >&2
    echo "       Falling back to the manual update path …" >&2
    echo "" >&2
    _AUTO_KEY=""   # force fallthrough to manual path
  fi
fi

if [ -z "$_AUTO_KEY" ]; then
  # ── In CI the automated path is required — fail fast rather than hang ────────
  if [ "${CI:-}" = "true" ]; then
    echo "" >&2
    echo "ERROR: Cannot update the Replit secret automatically in CI." >&2
    echo "       Ensure the following GitHub repository secrets are set:" >&2
    echo "         REPLIT_API_KEY — a Replit personal token with read/write repl scope" >&2
    echo "         REPL_ID        — the repl ID (run: echo \$REPL_ID in the Replit shell)" >&2
    echo "" >&2
    echo "       No keys were changed.  The existing deploy key is still active." >&2
    exit 1
  fi

  # ── Manual path (local Replit use only) ─────────────────────────────────────
  cp "$TMP_KEY" "$STAGED_KEY"
  chmod 600 "$STAGED_KEY"

  echo "┌─────────────────────────────────────────────────────────────────┐"
  echo "│  TIP: Set REPLIT_API_KEY to make all future rotations automatic │"
  echo "│  Get a personal token at: https://replit.com/account#tokens     │"
  echo "│  Add it as an env var named REPLIT_API_KEY in this Replit repl  │"
  echo "└─────────────────────────────────────────────────────────────────┘"
  echo ""
  echo "Manual step — update the Replit Secret:"
  echo ""
  echo "  1. Open the Replit Shell tab and run:"
  echo "         cat $STAGED_KEY"
  echo ""
  echo "  2. Copy the full output (including the BEGIN/END lines)."
  echo "     The key is in the file — it was NOT printed above."
  echo ""
  echo "  3. Go to Replit Secrets and update GITHUB_DEPLOY_KEY with that value."
  echo ""
  read -r -p "  Press Enter when GITHUB_DEPLOY_KEY has been updated in Replit Secrets: "
  rm -f "$STAGED_KEY"
fi

# ── 4. Update GitHub deploy keys via the API ─────────────────────────────────
echo ""
echo "==> Updating GitHub deploy keys via the GitHub API …"

_GITHUB_PERSONAL_ACCESS_TOKEN="${GITHUB_PERSONAL_ACCESS_TOKEN:-}"
if [ -z "$_GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
  echo "" >&2
  echo "ERROR: GITHUB_PERSONAL_ACCESS_TOKEN is not set." >&2
  echo "       Add a GitHub personal access token with repo scope as a Replit Secret" >&2
  echo "       named GITHUB_PERSONAL_ACCESS_TOKEN, then re-run this script." >&2
  exit 1
fi

# ── 4a-pre. Check the age of the current deploy key before rotating ──────────
# This surfaces the warning in the rotation log so the operator can see how old
# the outgoing key was.  The check is best-effort; a failure here does not block
# the rotation itself.
echo "==> Checking current deploy key age …"
MAX_AGE_DAYS="${DEPLOY_KEY_MAX_AGE_DAYS:-90}"
GITHUB_PERSONAL_ACCESS_TOKEN="$_GITHUB_PERSONAL_ACCESS_TOKEN" bash "$SCRIPT_DIR/check-deploy-key-age.sh" --max-age-days "$MAX_AGE_DAYS" || true
echo ""

# Use Node.js for all GitHub API calls so that the PAT never appears in CLI args.
_GH_OK=0
GITHUB_PERSONAL_ACCESS_TOKEN="$_GITHUB_PERSONAL_ACCESS_TOKEN" PUB_KEY_VALUE="$PUB_KEY" KEY_TITLE="$COMMENT" REPO="$REPO" \
  KEY_FINGERPRINT="$KEY_FINGERPRINT" \
  node - <<'JSEOF' || _GH_OK=$?
const https = require('https');

const pat         = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const repo        = process.env.REPO;          // e.g. salwilliam/krakenwatch
const pubKey      = process.env.PUB_KEY_VALUE;
const title       = process.env.KEY_TITLE;
const fingerprint = process.env.KEY_FINGERPRINT;

// Only delete keys whose title was created by this rotation script.
// Keys titled "krakenwatch-deploy-YYYYMMDD" are safe to remove.
const ROTATION_PREFIX = 'krakenwatch-deploy-';

function ghRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${pat}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'krakenwatch-rotate-key-script',
        ...(payload ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        } : {}),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

(async () => {
  // 4a. List existing deploy keys.
  const listRes = await ghRequest('GET', `/repos/${repo}/keys?per_page=100`);
  if (listRes.status !== 200) {
    console.error(`ERROR: Could not list GitHub deploy keys (HTTP ${listRes.status}).`);
    console.error(`Response: ${listRes.body}`);
    process.exit(1);
  }
  const existingKeys = JSON.parse(listRes.body);

  const rotationKeys = existingKeys.filter(k => k.title.startsWith(ROTATION_PREFIX));
  const skippedKeys  = existingKeys.filter(k => !k.title.startsWith(ROTATION_PREFIX));

  if (skippedKeys.length > 0) {
    console.log(`==> Skipping ${skippedKeys.length} unrelated deploy key(s) (not created by this script).`);
  }

  // 4b. POST the new public key first.  Only proceed to delete the old keys once
  //     we have confirmed the new key was accepted by the GitHub API.  This makes
  //     the operation naturally safe: if the POST fails (e.g. transient network
  //     error), no existing key has been touched and the script exits cleanly.
  const addRes = await ghRequest('POST', `/repos/${repo}/keys`, {
    title,
    key: pubKey,
    read_only: false,
  });
  if (addRes.status === 201) {
    const added = JSON.parse(addRes.body);
    console.log(`==> Added new deploy key:   [${added.id}] "${added.title}"`);
    console.log(`    Fingerprint: ${fingerprint}`);
  } else {
    console.error(`ERROR: Failed to add new deploy key (HTTP ${addRes.status}).`);
    console.error(`Response: ${addRes.body}`);
    console.error('==> No existing keys were deleted — the repo deploy keys are unchanged.');
    console.error('    Fix the root cause, then re-run this script to complete the rotation.');
    process.exit(1);
  }

  // 4c. New key is confirmed — now delete the old rotation-prefixed keys.
  //     Each key gets one automatic retry on failure.  If the retry also fails,
  //     a targeted error message is emitted with the exact GitHub URL and key
  //     details so the operator can remove the stale key manually without
  //     guessing which one it is.  Failures are collected so that all stale
  //     keys are attempted before the script exits, leaving the operator with a
  //     complete list of what still needs to be cleaned up.
  if (rotationKeys.length === 0) {
    console.log('==> No previous rotation keys found — nothing to remove.');
  } else {
    const deleteFailures = [];

    for (const key of rotationKeys) {
      // Helper: attempt a single DELETE and return the HTTP status, or null on
      // a transport-level error (connection refused, timeout, DNS failure, etc.)
      // so that network errors are handled the same way as bad HTTP responses.
      async function tryDelete() {
        try {
          return await ghRequest('DELETE', `/repos/${repo}/keys/${key.id}`);
        } catch (err) {
          console.error(`WARN: DELETE request for key ${key.id} threw a network error: ${err.message}`);
          return null;
        }
      }

      // First attempt.
      let delRes = await tryDelete();

      if (!delRes || delRes.status !== 204) {
        // One automatic retry before giving up.
        const reason = delRes ? `HTTP ${delRes.status}` : 'network error';
        console.error(`WARN: First delete attempt for key ${key.id} failed (${reason}) — retrying …`);
        delRes = await tryDelete();
      }

      if (delRes && delRes.status === 204) {
        console.log(`==> Removed old deploy key: [${key.id}] "${key.title}"`);
      } else {
        // Retry also failed — record this so we can report all failures together.
        const reason = delRes ? `HTTP ${delRes.status}` : 'network error';
        console.error(`ERROR: Failed to delete key ${key.id} ("${key.title}") after retry (${reason}).`);
        console.error(`       This stale key is still registered and must be removed manually.`);
        console.error(`       Remove it at: https://github.com/${repo}/settings/keys`);
        console.error(`       Key details — ID: ${key.id}  title: "${key.title}"`);
        deleteFailures.push(key);
      }
    }

    if (deleteFailures.length > 0) {
      console.error('');
      console.error(`ERROR: ${deleteFailures.length} stale deploy key(s) could not be deleted automatically.`);
      console.error('       Both the new key AND the stale key(s) are currently registered on GitHub.');
      console.error('       Remove each stale key manually to restore a clean rotation state:');
      console.error(`         https://github.com/${repo}/settings/keys`);
      console.error('       Stale key IDs to remove:');
      for (const k of deleteFailures) {
        console.error(`         • [${k.id}] "${k.title}"`);
      }
      console.error('');
      console.error('       After removing them, re-run this script to verify the state is correct.');
      process.exit(1);
    }
  }

  // 4d. Verify exactly one rotation-prefixed deploy key is registered after the cycle.
  //     This guards against races or unexpected API failures that could silently break CI/CD.
  //     Non-rotation keys (not matching ROTATION_PREFIX) are intentionally ignored here;
  //     the script only manages keys it created.
  const verifyRes = await ghRequest('GET', `/repos/${repo}/keys?per_page=100`);
  if (verifyRes.status !== 200) {
    console.error(`ERROR: Post-rotation verification failed (HTTP ${verifyRes.status}).`);
    console.error(`       Could not confirm rotation deploy key count — check the repo manually.`);
    console.error(`       https://github.com/${repo}/settings/keys`);
    process.exit(1);
  }
  const afterKeys         = JSON.parse(verifyRes.body);
  const afterRotationKeys = afterKeys.filter(k => k.title.startsWith(ROTATION_PREFIX));

  if (afterRotationKeys.length === 0) {
    console.error('ERROR: Post-rotation verification found ZERO script-managed deploy keys on GitHub.');
    console.error('       CI/CD will be broken until a rotation deploy key is added.');
    console.error(`       Add one manually: https://github.com/${repo}/settings/keys`);
    process.exit(1);
  }

  if (afterRotationKeys.length > 1) {
    console.error(`ERROR: Post-rotation verification found ${afterRotationKeys.length} script-managed deploy keys — expected exactly 1.`);
    console.error('       This is unexpected and likely means a stale key was not cleaned up.');
    console.error(`       Review and remove duplicates: https://github.com/${repo}/settings/keys`);
    process.exit(1);
  }

  console.log(`==> Verified: exactly 1 script-managed deploy key registered after rotation.`);
  console.log('==> GitHub deploy keys updated successfully.');
})();
JSEOF

if [ "$_GH_OK" -ne 0 ]; then
  echo "" >&2
  echo "ERROR: GitHub API key rotation failed — see errors above." >&2
  echo "       Check that GITHUB_PERSONAL_ACCESS_TOKEN has repo scope and is valid." >&2
  exit 1
fi

# ── 5. Verify the new key works end-to-end ───────────────────────────────────
echo ""

if [ "${CI:-}" = "true" ]; then
  # In CI (GitHub Actions), GITHUB_DEPLOY_KEY is a Replit secret and is not
  # available as a GitHub Actions env var.  The temp key file ($TMP_KEY) is
  # still on disk at this point (the cleanup trap fires on EXIT, not here), so
  # we can verify authentication directly against it without setup-ssh.sh.
  echo "==> Testing GitHub SSH authentication with the new key (CI mode) …"
  _SSH_DIR="$HOME/.ssh"
  mkdir -p "$_SSH_DIR"
  chmod 700 "$_SSH_DIR"
  if ! grep -q "github.com" "$_SSH_DIR/known_hosts" 2>/dev/null; then
    ssh-keyscan -t ed25519 github.com >> "$_SSH_DIR/known_hosts" 2>/dev/null
    chmod 644 "$_SSH_DIR/known_hosts"
  fi
  SSH_OUT="$(ssh -i "$TMP_KEY" -o StrictHostKeyChecking=yes -o BatchMode=yes -T git@github.com 2>&1 || true)"
else
  echo "==> Loading updated GITHUB_DEPLOY_KEY from Replit Secrets …"
  bash "$SCRIPT_DIR/setup-ssh.sh"
  echo "==> Testing GitHub SSH authentication …"
  SSH_OUT="$(ssh -T git@github.com 2>&1 || true)"
fi

if echo "$SSH_OUT" | grep -q "successfully authenticated"; then
  echo "==> Auth confirmed: $SSH_OUT"
else
  echo "" >&2
  echo "ERROR: GitHub SSH auth failed." >&2
  echo "       Output: $SSH_OUT" >&2
  echo "" >&2
  echo "       Checklist:" >&2
  echo "         • Did the GitHub API step succeed (no errors above)?" >&2
  if [ "${CI:-}" = "true" ]; then
    echo "         • Is GITHUB_PERSONAL_ACCESS_TOKEN valid and does it have repo scope?" >&2
    echo "         • Did the Replit API call succeed (REPLIT_API_KEY + REPL_ID correct)?" >&2
  else
    echo "         • Is GITHUB_DEPLOY_KEY saved correctly in Replit Secrets?" >&2
    echo "         • Is GITHUB_PERSONAL_ACCESS_TOKEN valid and does it have repo scope?" >&2
  fi
  exit 1
fi


# ── 6. Record the rotation in the audit log ───────────────────────────────────
# The log file lives at scripts/rotation-log.md in the monorepo root so it
# accumulates a clear, human-readable history of every rotation: when it
# happened, what fingerprint replaced the previous key, and who ran the script.
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null)"
if [ -z "$REPO_ROOT" ]; then
  REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
fi
LOG_FILE="$REPO_ROOT/scripts/rotation-log.md"

TIMESTAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
OPERATOR="$(git -C "$REPO_ROOT" config user.name 2>/dev/null || echo "unknown")"
if [ "${CI:-}" = "true" ]; then
  OPERATOR="CI / ${OPERATOR}"
fi

# Append one row to the markdown table.
# Wrap the log-write and git-commit in a subshell so that any failure here
# produces a clear warning but does NOT set a non-zero exit code.  The key
# rotation has already succeeded at this point and must not be rolled back
# because of a logging problem.
_LOG_OK=0
(
  printf "| %s | %s | %s |\n" "$TIMESTAMP" "$KEY_FINGERPRINT" "$OPERATOR" >> "$LOG_FILE" || exit 1
  echo "==> Committing rotation entry to audit log …"
  git -C "$REPO_ROOT" add "$LOG_FILE" || exit 1
  git -C "$REPO_ROOT" commit -m "chore: record deploy key rotation on ${TIMESTAMP}" || exit 1
  echo "==> Audit log updated: $LOG_FILE"
) || _LOG_OK=1

if [ "$_LOG_OK" -ne 0 ]; then
  echo "" >&2
  echo "WARNING: The key rotation succeeded, but the audit log commit failed." >&2
  echo "         The new deploy key is live and working — no rollback is needed." >&2
  echo "         Please commit the log entry manually:" >&2
  echo "           git add scripts/rotation-log.md" >&2
  echo "           git commit -m 'chore: record deploy key rotation on ${TIMESTAMP}'" >&2
fi

# ── 6b. Push the audit log commit to the remote ──────────────────────────────
# Only attempt the push when the commit was recorded successfully and a remote
# is configured.  A missing remote is silently skipped (common in bare local
# tests).  A push failure emits a clear warning so the operator knows to push
# manually — it never masks the fact that the rotation itself succeeded.
if [ "$_LOG_OK" -eq 0 ]; then
  _REMOTE="$(git -C "$REPO_ROOT" remote 2>/dev/null | head -n 1)"
  if [ -z "$_REMOTE" ]; then
    echo "==> No git remote configured — skipping audit log push."
  else
    echo "==> Pushing audit log commit to remote '$_REMOTE' …"
    _PUSH_OK=0
    git -C "$REPO_ROOT" push "$_REMOTE" HEAD || _PUSH_OK=$?
    if [ "$_PUSH_OK" -ne 0 ]; then
      echo "" >&2
      echo "WARNING: The audit log commit was created locally but could not be pushed." >&2
      echo "         The key rotation itself succeeded — no rollback is needed." >&2
      echo "         Push the commit manually when the remote is reachable:" >&2
      echo "           git push $_REMOTE HEAD" >&2
    else
      echo "==> Audit log commit pushed to remote '$_REMOTE' successfully."
    fi
  fi
fi

echo ""
echo "==> Key rotation complete."
