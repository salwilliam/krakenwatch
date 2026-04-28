#!/usr/bin/env bash
set -euo pipefail

LABEL="data-refresh-failure"

EXISTING_ISSUES="$(gh issue list \
  --label "$LABEL" \
  --state open \
  --limit 100 \
  --json number \
  --jq '.[].number' \
  --repo "$GITHUB_REPOSITORY")"

if [ -n "$EXISTING_ISSUES" ]; then
  while IFS= read -r ISSUE_NUMBER; do
    gh issue comment "$ISSUE_NUMBER" \
      --body "The Daily Data Refresh recovered on $(date -u +'%Y-%m-%d %H:%M UTC'). Closing automatically. [View run]($RUN_URL)" \
      --repo "$GITHUB_REPOSITORY"
    gh issue close "$ISSUE_NUMBER" \
      --repo "$GITHUB_REPOSITORY"
  done <<< "$EXISTING_ISSUES"
  echo "issue_closed=true" >> "$GITHUB_OUTPUT"
else
  echo "issue_closed=false" >> "$GITHUB_OUTPUT"
fi
