#!/usr/bin/env bash
set -euo pipefail

TITLE="Daily Data Refresh failed - $(date -u +'%Y-%m-%d')"
LABEL="data-refresh-failure"

gh label create "$LABEL" \
  --description "Automated: daily data refresh workflow failure" \
  --color "d93f0b" \
  --repo "$GITHUB_REPOSITORY" 2>/dev/null || true

EXISTING_ISSUES="$(gh issue list \
  --label "$LABEL" \
  --state open \
  --limit 100 \
  --json number,createdAt \
  --jq 'sort_by(.createdAt) | reverse | .[].number' \
  --repo "$GITHUB_REPOSITORY")"

if [ -n "$EXISTING_ISSUES" ]; then
  while IFS= read -r ISSUE_NUMBER; do
    gh issue comment "$ISSUE_NUMBER" \
      --body "Workflow failed again on $(date -u +'%Y-%m-%d %H:%M UTC'). [View run]($RUN_URL)" \
      --repo "$GITHUB_REPOSITORY"
  done <<< "$EXISTING_ISSUES"

  MOST_RECENT="$(echo "$EXISTING_ISSUES" | head -1)"
  while IFS= read -r ISSUE_NUMBER; do
    if [ "$ISSUE_NUMBER" != "$MOST_RECENT" ]; then
      gh issue close "$ISSUE_NUMBER" \
        --comment "Superseded by #${MOST_RECENT}. Closing to keep at most one open staleness issue at a time." \
        --repo "$GITHUB_REPOSITORY"
    fi
  done <<< "$EXISTING_ISSUES"
else
  gh issue create \
    --title "$TITLE" \
    --label "$LABEL" \
    --body "The Daily Data Refresh workflow failed. The live site may be serving stale data.

**Run:** $RUN_URL
**Time:** $(date -u +'%Y-%m-%d %H:%M UTC')

Please investigate and re-run the workflow once the issue is resolved." \
    --repo "$GITHUB_REPOSITORY"
fi
