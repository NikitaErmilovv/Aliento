#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://melissa-tech.ru/aliento}"
export ALIENTO_MELISSA_EXPORT=1

HIDE_DIR="src/app/_melissa_export_hidden"
mkdir -p "$HIDE_DIR"
HIDE_PATHS=(
  api
  admin
  cabinet
  login
  register
  forgot-password
  reset-password
  verify-email
)
for rel in "${HIDE_PATHS[@]}"; do
  if [[ -d "src/app/$rel" ]]; then
    mv "src/app/$rel" "$HIDE_DIR/$rel"
  fi
done
cleanup() {
  for rel in "${HIDE_PATHS[@]}"; do
    if [[ -d "$HIDE_DIR/$rel" ]]; then
      mv "$HIDE_DIR/$rel" "src/app/$rel"
    fi
  done
  rmdir "$HIDE_DIR" 2>/dev/null || true
}
trap cleanup EXIT

rm -rf out .next
npm run build

echo "Static export ready in $ROOT/out"
