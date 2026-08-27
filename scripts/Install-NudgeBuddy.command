#!/bin/bash
# NudgeBuddy 1-Click Fix & Launcher for macOS

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_PATH="$DIR/NudgeBuddy.app"

echo "=========================================="
echo "   Opening NudgeBuddy for macOS           "
echo "=========================================="

echo "Removing macOS Gatekeeper quarantine..."
xattr -cr "$APP_PATH" 2>/dev/null || true

if [ -d "/Applications/NudgeBuddy.app" ]; then
  xattr -cr /Applications/NudgeBuddy.app 2>/dev/null || true
fi

echo "Launching NudgeBuddy..."
open "$APP_PATH" 2>/dev/null || open /Applications/NudgeBuddy.app 2>/dev/null || true

echo "Done! You can now launch NudgeBuddy directly."
