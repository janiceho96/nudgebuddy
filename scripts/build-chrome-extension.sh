#!/bin/bash
set -e

PROJECT_DIR="/Users/macjanice/.gemini/antigravity-ide/scratch/nudgebuddy"
EXT_DIR="$PROJECT_DIR/dist-chrome-extension"

rm -rf "$EXT_DIR"
mkdir -p "$EXT_DIR"

cd "$PROJECT_DIR"
npm run build

# Copy built assets
cp -R "$PROJECT_DIR/dist/"* "$EXT_DIR/"

# 1. Manifest V3 for Chrome Side Panel
cat << 'EOF' > "$EXT_DIR/manifest.json"
{
  "manifest_version": 3,
  "name": "NudgeBuddy - ADHD Focus Companion",
  "version": "1.0.0",
  "description": "Tactile ADHD focus companion, 25m Pomodoro, and AI accountability mascot docked right inside Google Chrome.",
  "icons": {
    "128": "icon128.png"
  },
  "action": {
    "default_title": "Open NudgeBuddy Side Panel",
    "default_icon": "icon128.png"
  },
  "side_panel": {
    "default_path": "index.html"
  },
  "background": {
    "service_worker": "background.js"
  },
  "permissions": [
    "sidePanel"
  ]
}
EOF

# 2. Background service worker to open side panel on toolbar click
cat << 'EOF' > "$EXT_DIR/background.js"
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
EOF

# 3. Copy Icon
if [ -f "/tmp/budge_icon.svg.png" ]; then
  cp "/tmp/budge_icon.svg.png" "$EXT_DIR/icon128.png"
fi

echo "Successfully built Chrome Side Panel Extension in $EXT_DIR!"
