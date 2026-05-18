#!/usr/bin/env bash
# check-deploy-key-age.sh
#
# Checks the age of the current rotation-managed GitHub deploy key and prints a
# prominent warning if it is older than a configurable threshold.
#
# Designed to run in CI on a schedule (e.g. a weekly cron workflow) without
# performing any rotation.  It exits 0 in all cases so that a "warn only"
# schedule job never blocks other pipelines; only missing required inputs or
# unrecoverable API errors cause a non-zero exit.
#
# Usage:
#   bash scripts/check-deploy-key-age.sh [--max-age-days N]
#
#   --max-age-days N   Warn when the key is older than N days.  Default: 90.
#
# Required secrets:
#   GITHUB_PERSONAL_ACCESS_TOKEN — a GitHub personal access token with repo scope.
#                Store it as a Replit Secret named GITHUB_PERSONAL_ACCESS_TOKEN.
#
# Example CI schedule (GitHub Actions):
#   - cron: '0 9 * * 1'   # every Monday at 09:00 UTC
#     jobs:
#       check-key-age:
#         steps:
#           - run: bash scripts/check-deploy-key-age.sh --max-age-days 90
#             env:
#               GITHUB_PERSONAL_ACCESS_TOKEN: ${{ secrets.GITHUB_PERSONAL_ACCESS_TOKEN }}

set -euo pipefail
set +x

REPO="salwilliam/krakenwatch"
ROTATION_PREFIX="krakenwatch-deploy-"
MAX_AGE_DAYS=90

# ── Parse arguments ───────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --max-age-days)
      if [[ -z "${2:-}" || ! "${2}" =~ ^[0-9]+$ ]]; then
        echo "ERROR: --max-age-days requires a positive integer argument." >&2
        exit 1
      fi
      MAX_AGE_DAYS="$2"
      shift 2
      ;;
    *)
      echo "ERROR: Unknown argument: $1" >&2
      echo "Usage: $0 [--max-age-days N]" >&2
      exit 1
      ;;
  esac
done

# ── Validate required secrets ─────────────────────────────────────────────────
_GITHUB_PERSONAL_ACCESS_TOKEN="${GITHUB_PERSONAL_ACCESS_TOKEN:-}"
if [ -z "$_GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
  echo "" >&2
  echo "ERROR: GITHUB_PERSONAL_ACCESS_TOKEN is not set." >&2
  echo "       Add a GitHub personal access token with repo scope as a Replit Secret" >&2
  echo "       named GITHUB_PERSONAL_ACCESS_TOKEN, then re-run this script." >&2
  exit 1
fi

echo "==> Checking deploy key age for ${REPO} (threshold: ${MAX_AGE_DAYS} days) …"
echo ""

# ── Query GitHub API via Node.js (PAT never in CLI args) ─────────────────────
_CHECK_EXIT=0
GITHUB_PERSONAL_ACCESS_TOKEN="$_GITHUB_PERSONAL_ACCESS_TOKEN" REPO="$REPO" \
  ROTATION_PREFIX="$ROTATION_PREFIX" MAX_AGE_DAYS="$MAX_AGE_DAYS" \
  node - <<'JSEOF' || _CHECK_EXIT=$?
const https = require('https');

const pat           = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const repo          = process.env.REPO;
const rotPrefix     = process.env.ROTATION_PREFIX;
const maxAgeDays    = parseInt(process.env.MAX_AGE_DAYS, 10);

function ghRequest(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${pat}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'krakenwatch-check-key-age-script',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  const listRes = await ghRequest('GET', `/repos/${repo}/keys?per_page=100`);
  if (listRes.status !== 200) {
    console.error(`ERROR: Could not list GitHub deploy keys (HTTP ${listRes.status}).`);
    console.error(`Response: ${listRes.body}`);
    process.exit(1);
  }

  const allKeys      = JSON.parse(listRes.body);
  const rotationKeys = allKeys.filter(k => k.title.startsWith(rotPrefix));

  if (rotationKeys.length === 0) {
    console.error(`WARNING: No rotation-managed deploy key found (title prefix "${rotPrefix}").`);
    console.error(`         A rotation deploy key should exist for CI/CD to work.`);
    console.error(`         Run: bash scripts/rotate-deploy-key.sh`);
    // Exit 0 — the absence of a key is already surfaced by the rotate script's
    // post-rotation verification; this check script warns but does not hard-fail.
    process.exit(0);
  }

  // Use the most recently created rotation key for the age check.
  rotationKeys.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const key = rotationKeys[0];

  const createdAt  = new Date(key.created_at);
  const now        = new Date();
  const ageMs      = now - createdAt;
  const ageDays    = Math.floor(ageMs / (1000 * 60 * 60 * 24));
  const createdStr = createdAt.toISOString().split('T')[0];

  console.log(`==> Current rotation deploy key:`);
  console.log(`      ID:      ${key.id}`);
  console.log(`      Title:   ${key.title}`);
  console.log(`      Created: ${createdStr}  (${ageDays} day${ageDays === 1 ? '' : 's'} ago)`);
  console.log(`      Threshold: ${maxAgeDays} days`);
  console.log('');

  if (ageDays >= maxAgeDays) {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║  ⚠  DEPLOY KEY EXPIRY WARNING                                  ║');
    console.log('╠══════════════════════════════════════════════════════════════════╣');
    console.log(`║  The current deploy key is ${String(ageDays).padStart(3)} days old (threshold: ${String(maxAgeDays).padStart(3)} days). ║`);
    console.log('║  Rotate the key soon to avoid CI/CD interruptions.             ║');
    console.log('║                                                                  ║');
    console.log('║  Run:  bash scripts/rotate-deploy-key.sh                        ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
  } else {
    const daysRemaining = maxAgeDays - ageDays;
    console.log(`==> Deploy key is within the acceptable age limit.`);
    console.log(`    ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining before the ${maxAgeDays}-day threshold.`);
  }
})();
JSEOF

exit "$_CHECK_EXIT"
