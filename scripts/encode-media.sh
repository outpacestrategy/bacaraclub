#!/usr/bin/env bash
# Encode opening-night source photos into web-ready JPEGs.
#
# Two outputs per source:
#   <n>-portrait.jpg   - original aspect, max 1600px on long edge, ~85% q
#   <n>-landscape.jpg  - center-cropped to 16:9, 2400x1350, ~85% q
#
# next/image then derives AVIF/WebP variants at request time via Netlify's
# image CDN, so committing one optimised JPEG per surface is enough.
#
# Usage:  bash scripts/encode-media.sh [SRC_DIR] [OUT_DIR]
# Default SRC_DIR = "$HOME/Downloads/opening night"
# Default OUT_DIR = "public/media/opening-night"

set -euo pipefail

SRC="${1:-$HOME/Downloads/opening night}"
OUT="${2:-public/media/opening-night}"

if [ ! -d "$SRC" ]; then
  echo "src dir not found: $SRC" >&2
  exit 1
fi

mkdir -p "$OUT"

shopt -s nullglob nocaseglob

for src in "$SRC"/*.jpg "$SRC"/*.jpeg; do
  base=$(basename "$src")
  n="${base%.*}"

  # portrait: keep aspect, fit inside 1600x2400
  ffmpeg -y -loglevel error -i "$src" \
    -vf "scale='min(1600,iw)':-2:flags=lanczos,scale=-2:'min(2400,ih)':flags=lanczos" \
    -q:v 4 "$OUT/${n}-portrait.jpg"

  # landscape: 16:9 center crop -> 2400x1350
  ffmpeg -y -loglevel error -i "$src" \
    -vf "crop='if(gt(iw/ih,16/9),ih*16/9,iw)':'if(gt(iw/ih,16/9),ih,iw*9/16)',scale=2400:1350:flags=lanczos" \
    -q:v 4 "$OUT/${n}-landscape.jpg"
done

# OG image: 1200x630 from #2 if present
if [ -f "$SRC/2.jpg" ]; then
  ffmpeg -y -loglevel error -i "$SRC/2.jpg" \
    -vf "crop='if(gt(iw/ih,1200/630),ih*1200/630,iw)':'if(gt(iw/ih,1200/630),ih,iw*630/1200)',scale=1200:630:flags=lanczos" \
    -q:v 3 "$OUT/og-1200x630.jpg"
fi

echo "encoded into $OUT"
ls -lh "$OUT" | awk '{print $5, $9}' | column -t
