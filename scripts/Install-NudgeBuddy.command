#!/bin/bash
# ==============================================================================
#  NudgeBuddy 1-Click Universal Fix & Launcher for macOS
# ==============================================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_PATH="$DIR/NudgeBuddy.app"
STATIC_DIR="$APP_PATH/Contents/Resources/app"

echo "=================================================="
echo "         🚀 Launching NudgeBuddy for macOS        "
echo "=================================================="

# 1. Strip Gatekeeper quarantine lock
if [ -d "$APP_PATH" ]; then
  echo "1. Removing macOS quarantine security lock..."
  xattr -cr "$APP_PATH" 2>/dev/null || true
fi

# 2. Check & start local self-contained server
PORT=5188
if ! nc -z localhost $PORT 2>/dev/null; then
  echo "2. Starting local focus engine..."
  if [ -d "$STATIC_DIR" ]; then
    cd "$STATIC_DIR"
    python3 -m http.server $PORT > /dev/null 2>&1 &
  elif [ -d "$DIR/dist" ]; then
    cd "$DIR/dist"
    python3 -m http.server $PORT > /dev/null 2>&1 &
  fi
  sleep 0.5
fi

# 3. Open in Browser / Standalone App Mode
echo "3. Opening NudgeBuddy in your browser..."

if [ -d "/Applications/Google Chrome.app" ]; then
  open -na "Google Chrome" --args --app="http://localhost:$PORT" --window-size=440,780 2>/dev/null || open "http://localhost:$PORT"
else
  open "http://localhost:$PORT"
fi

echo "=================================================="
echo "   🎉 Done! NudgeBuddy is now open on your screen! "
echo "=================================================="
