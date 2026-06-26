#!/usr/bin/env bash
# Tests for close-staleness-alert.sh
#
# Mocks the `gh` CLI and verifies end-to-end behaviour:
#   - When open data-refresh-failure issues exist, each is commented on and
#     closed, and issue_closed=true is written to GITHUB_OUTPUT.
#   - When no open issues exist, issue_closed=false is written and no
#     close/comment calls are made.
#
# No external dependencies required — runs anywhere bash is available.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_UNDER_TEST="$(cd "$SCRIPT_DIR/.." && pwd)/close-staleness-alert.sh"

if [ ! -f "$SCRIPT_UNDER_TEST" ]; then
  echo "ERROR: script not found at $SCRIPT_UNDER_TEST" >&2
  exit 1
fi

TMPDIR_TEST="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_TEST"' EXIT

PASS=0
FAIL=0

pass() { echo "    PASS: $1"; PASS=$((PASS + 1)); }
fail() { echo "    FAIL: $1"; FAIL=$((FAIL + 1)); }

assert_contains() {
  local file="$1" pattern="$2" desc="$3"
  if grep -qF -- "$pattern" "$file" 2>/dev/null; then
    pass "$desc"
  else
    fail "$desc  (pattern '$pattern' not found in $(basename "$file"))"
  fi
}

assert_not_contains() {
  local file="$1" pattern="$2" desc="$3"
  if ! grep -qF -- "$pattern" "$file" 2>/dev/null; then
    pass "$desc"
  else
    fail "$desc  (unexpected pattern '$pattern' found in $(basename "$file"))"
  fi
}

# ---------------------------------------------------------------------------
# make_mock_gh <bin_dir> <calls_file> <issues_file>
#
# Writes a fake `gh` binary that:
#   - Appends "CALL: <all args>" to <calls_file> for every invocation.
#   - For "issue list" commands: prints the contents of <issues_file>
#     (one issue number per line, matching what `gh … --jq '.[].number'`
#     would produce).
#   - For all other commands (issue comment, issue close, …): is a no-op.
# ---------------------------------------------------------------------------
make_mock_gh() {
  local bin_dir="$1"
  local calls_file="$2"
  local issues_file="$3"
  mkdir -p "$bin_dir"
  cat > "$bin_dir/gh" <<EOF
#!/usr/bin/env bash
echo "CALL: \$*" >> "$calls_file"
case "\$*" in
  *"issue list"*)
    cat "$issues_file" 2>/dev/null || true
    ;;
esac
EOF
  chmod +x "$bin_dir/gh"
}

# ============================================================================
# Test 1: open issues exist → each is commented on and closed,
#         issue_closed=true is written to GITHUB_OUTPUT
# ============================================================================
echo ""
echo "Test 1: open issues exist — closes them and sets issue_closed=true"

T1="$TMPDIR_TEST/t1"; mkdir -p "$T1"
CALLS1="$T1/calls"; OUT1="$T1/github_output"; ISSUES1="$T1/issues"
touch "$CALLS1" "$OUT1"
printf '42\n17\n' > "$ISSUES1"

make_mock_gh "$T1/bin" "$CALLS1" "$ISSUES1"

GITHUB_REPOSITORY="owner/repo" \
  RUN_URL="https://example.com/run/1" \
  GITHUB_OUTPUT="$OUT1" \
  PATH="$T1/bin:$PATH" \
  bash "$SCRIPT_UNDER_TEST"

assert_contains     "$OUT1"   "issue_closed=true"  "issue_closed=true written to GITHUB_OUTPUT"
assert_not_contains "$OUT1"   "issue_closed=false" "issue_closed=false not written when issues exist"

for n in 42 17; do
  assert_contains "$CALLS1" "issue close $n"   "gh issue close called for issue #$n"
  assert_contains "$CALLS1" "issue comment $n" "gh issue comment called for issue #$n"
done

# ============================================================================
# Test 2: no open issues → issue_closed=false, no close/comment calls made
# ============================================================================
echo ""
echo "Test 2: no open issues — sets issue_closed=false, skips close/comment"

T2="$TMPDIR_TEST/t2"; mkdir -p "$T2"
CALLS2="$T2/calls"; OUT2="$T2/github_output"; ISSUES2="$T2/issues"
touch "$CALLS2" "$OUT2" "$ISSUES2"   # empty issues file

make_mock_gh "$T2/bin" "$CALLS2" "$ISSUES2"

GITHUB_REPOSITORY="owner/repo" \
  RUN_URL="https://example.com/run/2" \
  GITHUB_OUTPUT="$OUT2" \
  PATH="$T2/bin:$PATH" \
  bash "$SCRIPT_UNDER_TEST"

assert_contains     "$OUT2"   "issue_closed=false" "issue_closed=false written to GITHUB_OUTPUT"
assert_not_contains "$CALLS2" "issue close"        "gh issue close not called when no issues"
assert_not_contains "$CALLS2" "issue comment"      "gh issue comment not called when no issues"

# ============================================================================
# Test 3: the label queried is exactly "data-refresh-failure"
# ============================================================================
echo ""
echo "Test 3: correct label 'data-refresh-failure' is passed to gh issue list"

T3="$TMPDIR_TEST/t3"; mkdir -p "$T3"
CALLS3="$T3/calls"; OUT3="$T3/github_output"; ISSUES3="$T3/issues"
touch "$CALLS3" "$OUT3" "$ISSUES3"

make_mock_gh "$T3/bin" "$CALLS3" "$ISSUES3"

GITHUB_REPOSITORY="owner/repo" \
  RUN_URL="https://example.com/run/3" \
  GITHUB_OUTPUT="$OUT3" \
  PATH="$T3/bin:$PATH" \
  bash "$SCRIPT_UNDER_TEST"

assert_contains "$CALLS3" "--label data-refresh-failure" \
  "label '--label data-refresh-failure' passed exactly to gh issue list"

# ============================================================================
# Test 4: single open issue — still closed and commented on
# ============================================================================
echo ""
echo "Test 4: single open issue — closed and commented on"

T4="$TMPDIR_TEST/t4"; mkdir -p "$T4"
CALLS4="$T4/calls"; OUT4="$T4/github_output"; ISSUES4="$T4/issues"
touch "$CALLS4" "$OUT4"
printf '99\n' > "$ISSUES4"

make_mock_gh "$T4/bin" "$CALLS4" "$ISSUES4"

GITHUB_REPOSITORY="owner/repo" \
  RUN_URL="https://example.com/run/4" \
  GITHUB_OUTPUT="$OUT4" \
  PATH="$T4/bin:$PATH" \
  bash "$SCRIPT_UNDER_TEST"

assert_contains "$OUT4"   "issue_closed=true"  "issue_closed=true written for single issue"
assert_contains "$CALLS4" "issue close 99"     "gh issue close called for issue #99"
assert_contains "$CALLS4" "issue comment 99"   "gh issue comment called for issue #99"

# ============================================================================
# Summary
# ============================================================================
echo ""
echo "─────────────────────────────────────────────"
echo "Passed: $PASS | Failed: $FAIL"
echo "─────────────────────────────────────────────"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
