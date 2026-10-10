#!/usr/bin/env bash
# Usage: bash tools/ut/smoke.sh [http://localhost:8080]
set -euo pipefail

base_url="${1:-http://localhost:8080}"
base_url="${base_url%/}"
scratch_dir="$(mktemp -d)"
trap 'rm -rf -- "$scratch_dir"' EXIT

check_response() {
  local route="$1"
  local expected_type="$2"
  local expected_marker="${3:-}"
  local details status content_type
  details="$(curl --silent --show-error --location --fail --max-time 30 \
    --output "$scratch_dir/body" --write-out '%{http_code}|%{content_type}' "$base_url$route")"
  status="${details%%|*}"
  content_type="${details#*|}"
  content_type="${content_type%%;*}"
  if [[ "$status" != '200' || ! "$content_type" =~ $expected_type ]]; then
    printf 'FAIL %s: HTTP %s, Content-Type %s\n' "$route" "$status" "$content_type" >&2
    return 1
  fi
  test -s "$scratch_dir/body"
  if [[ "$content_type" != 'text/html' ]] && LC_ALL=C head -c 512 "$scratch_dir/body" | grep -Eiq '<!doctype[[:space:]]+html|<html'; then
    printf 'FAIL %s: static asset returned an HTML fallback\n' "$route" >&2
    return 1
  fi
  if [[ -n "$expected_marker" ]] && ! grep -Fq -- "$expected_marker" "$scratch_dir/body"; then
    printf 'FAIL %s: expected page/asset marker is missing\n' "$route" >&2
    return 1
  fi
  printf 'OK %s (%s)\n' "$route" "$content_type"
}

check_response '/' '^text/html$' '<html'
check_response '/motionlab/' '^text/html$' 'MOTION'
check_response '/UT/' '^text/html$' 'UT Digitall'
check_response '/UT/index.html' '^text/html$' 'UT Digitall'
check_response '/UT/css/ut.css' '^text/css$' '@font-face'
check_response '/UT/js/main.js' '^(application|text)/javascript$' './content.js'
check_response '/UT/js/content.js' '^(application|text)/javascript$' 'universeRows'
check_response '/UT/js/motion.js' '^(application|text)/javascript$' 'initMotion'
check_response '/UT/js/canopy.js' '^(application|text)/javascript$'
check_response '/UT/assets/abstract-3d.webp' '^image/webp$'
check_response '/UT/assets/fonts/helios-bold.woff2' '^(font/woff2|application/font-woff2)$'
test "$(LC_ALL=C head -c 4 "$scratch_dir/body")" = 'wOF2'
printf 'UT HTTP smoke checks passed.\n'
