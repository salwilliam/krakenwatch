#!/usr/bin/env bash
# daily-traffic-report.sh
#
# Queries Cloudflare Web Analytics (GraphQL API) for yesterday's traffic
# and posts a brief report as a GitHub issue.
#
# Required env vars (set as GitHub Actions secrets):
#   CLOUDFLARE_ACCOUNT_ID  — Cloudflare account tag
#   CLOUDFLARE_API_TOKEN   — API token with Analytics:Read permission
#   GH_TOKEN               — GitHub token (provided automatically in Actions)

set -euo pipefail

CF_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-}"
CF_API_TOKEN="${CLOUDFLARE_API_TOKEN:-}"
SITE_TAG="eabb175ab0a9460a85169d4bea3f7a52"
REPO="${GITHUB_REPOSITORY:-salwilliam/krakenwatch}"

if [[ -z "$CF_ACCOUNT_ID" || -z "$CF_API_TOKEN" ]]; then
  echo "WARNING: Cloudflare credentials not set — skipping traffic report."
  exit 0
fi

YESTERDAY=$(date -u -d 'yesterday' +'%Y-%m-%d' 2>/dev/null || date -u -v-1d +'%Y-%m-%d')

echo "==> Generating traffic report for $YESTERDAY ..."

REPORT=$(CF_ACCOUNT_ID="$CF_ACCOUNT_ID" \
         CF_API_TOKEN="$CF_API_TOKEN" \
         SITE_TAG="$SITE_TAG" \
         YESTERDAY="$YESTERDAY" \
         node - <<'JSEOF'
const https = require('https');

const accountId = process.env.CF_ACCOUNT_ID;
const apiToken  = process.env.CF_API_TOKEN;
const siteTag   = process.env.SITE_TAG;
const yesterday = process.env.YESTERDAY;

const dateStart = `${yesterday}T00:00:00Z`;
const dateEnd   = new Date(new Date(dateStart).getTime() + 86400000).toISOString().replace('.000', '');

function cfQuery(gql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: gql });
    const req = https.request({
      hostname: 'api.cloudflare.com',
      path: '/client/v4/graphql',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse failed: ${data.slice(0, 300)}`)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function timeFilter() {
  return `AND: [
      { datetime_geq: "${dateStart}" }
      { datetime_lt: "${dateEnd}" }
      { siteTag: "${siteTag}" }
    ]`;
}

(async () => {
  const pathsRes = await cfQuery(`{
    viewer {
      accounts(filter: { accountTag: "${accountId}" }) {
        rumPageloadEventsAdaptiveGroups(
          filter: { ${timeFilter()} }
          limit: 10
          orderBy: [count_DESC]
        ) {
          count
          dimensions { requestPath }
        }
      }
    }
  }`);

  const countriesRes = await cfQuery(`{
    viewer {
      accounts(filter: { accountTag: "${accountId}" }) {
        rumPageloadEventsAdaptiveGroups(
          filter: { ${timeFilter()} }
          limit: 5
          orderBy: [count_DESC]
        ) {
          count
          dimensions { countryName }
        }
      }
    }
  }`);

  const referrersRes = await cfQuery(`{
    viewer {
      accounts(filter: { accountTag: "${accountId}" }) {
        rumPageloadEventsAdaptiveGroups(
          filter: { ${timeFilter()} }
          limit: 6
          orderBy: [count_DESC]
        ) {
          count
          dimensions { referrerHost }
        }
      }
    }
  }`);

  const pathRows     = pathsRes?.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups ?? [];
  const countryRows  = countriesRes?.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups ?? [];
  const referrerRows = referrersRes?.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups ?? [];

  const totalViews = pathRows.reduce((s, r) => s + (r.count || 0), 0);

  let md = `## krakenwatch.com — ${yesterday}\n\n`;
  md += `**Page views:** ${totalViews.toLocaleString()}\n\n`;

  if (pathRows.length > 0) {
    md += `### Top pages\n| Path | Views |\n|---|---|\n`;
    for (const r of pathRows) {
      md += `| \`${r.dimensions?.requestPath || '/'}\` | ${r.count} |\n`;
    }
    md += '\n';
  }

  if (countryRows.length > 0) {
    md += `### Top countries\n| Country | Views |\n|---|---|\n`;
    for (const r of countryRows) {
      md += `| ${r.dimensions?.countryName || 'Unknown'} | ${r.count} |\n`;
    }
    md += '\n';
  }

  const realReferrers = referrerRows.filter(r => r.dimensions?.referrerHost);
  if (realReferrers.length > 0) {
    md += `### Top referrers\n| Source | Views |\n|---|---|\n`;
    for (const r of realReferrers.slice(0, 5)) {
      md += `| ${r.dimensions.referrerHost} | ${r.count} |\n`;
    }
    md += '\n';
  }

  md += `_Generated automatically by the daily data-refresh — [view in Cloudflare](https://dash.cloudflare.com/web-analytics)_`;
  process.stdout.write(md);
})().catch(e => {
  process.stdout.write(`Traffic report unavailable: ${e.message}`);
});
JSEOF
)

LABEL="traffic-report"
gh label create "$LABEL" \
  --description "Daily traffic analytics" \
  --color "0075ca" \
  --repo "$REPO" 2>/dev/null || true

gh issue create \
  --title "Traffic — $YESTERDAY" \
  --label "$LABEL" \
  --body "$REPORT" \
  --repo "$REPO"

echo "==> Traffic report posted."
