#!/usr/bin/env bash
# South Hustles — local dev server. GLB/modules need http, not file://
cd "$(dirname "$0")"
PORT="${1:-8080}"
echo "→ South Hustles en http://localhost:$PORT"
python3 -m http.server "$PORT"
