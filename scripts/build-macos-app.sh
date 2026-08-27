#!/bin/bash
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_NAME="NudgeBuddy"
DIST_DIR="$PROJECT_DIR/dist-macos"
APP_BUNDLE="$DIST_DIR/$APP_NAME.app"
DESKTOP_DIR="/Users/macjanice/Desktop"
DESKTOP_FOLDER="$DESKTOP_DIR/NudgeBuddy-Mac"
ZIP_OUTPUT="$DESKTOP_DIR/NudgeBuddy-Mac.zip"

echo "🍃 1. Building production frontend..."
cd "$PROJECT_DIR"
npm run build

echo "📦 2. Scaffolding Native macOS Electron App..."
mkdir -p "$DIST_DIR"
rm -rf "$APP_BUNDLE" "$DESKTOP_FOLDER" "$ZIP_OUTPUT"

# Copy prebuilt Electron app as base
if [ -d "$PROJECT_DIR/node_modules/electron/dist/Electron.app" ]; then
  cp -R "$PROJECT_DIR/node_modules/electron/dist/Electron.app" "$APP_BUNDLE"
  mv "$APP_BUNDLE/Contents/MacOS/Electron" "$APP_BUNDLE/Contents/MacOS/$APP_NAME"
else
  echo "Error: Electron binary not found in node_modules."
  exit 1
fi

# Populate Contents/Resources/app
mkdir -p "$APP_BUNDLE/Contents/Resources/app"
cp -R "$PROJECT_DIR/dist" "$APP_BUNDLE/Contents/Resources/app/"
cp "$PROJECT_DIR/electron-main.cjs" "$APP_BUNDLE/Contents/Resources/app/"
cp "$PROJECT_DIR/preload.cjs" "$APP_BUNDLE/Contents/Resources/app/"
cp "$PROJECT_DIR/package.json" "$APP_BUNDLE/Contents/Resources/app/"

# Update Info.plist
cat << EOF > "$APP_BUNDLE/Contents/Info.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>$APP_NAME</string>
    <key>CFBundleIconFile</key>
    <string>electron.icns</string>
    <key>CFBundleIdentifier</key>
    <string>com.nudgebuddy.sanctuary</string>
    <key>CFBundleName</key>
    <string>$APP_NAME</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>0.1.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>11.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF

# Clear local quarantine
xattr -cr "$APP_BUNDLE" 2>/dev/null || true

echo "📁 3. Packaging 1-Click Installer Folder on Desktop..."
mkdir -p "$DESKTOP_FOLDER"
cp -R "$APP_BUNDLE" "$DESKTOP_FOLDER/"
cp -R "$APP_BUNDLE" "$DESKTOP_DIR/"

# Create 1-click launcher script for her friend
cat << 'EOF' > "$DESKTOP_FOLDER/Install-NudgeBuddy.command"
#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
echo "🍃 Preparing NudgeBuddy for your Mac..."
# Clear macOS internet download quarantine
xattr -cr "$DIR/NudgeBuddy.app" 2>/dev/null || true
# Move to Applications if possible, or run from folder
if [ -w "/Applications" ]; then
  cp -R "$DIR/NudgeBuddy.app" /Applications/ 2>/dev/null || true
  open /Applications/NudgeBuddy.app
else
  open "$DIR/NudgeBuddy.app"
fi
echo "✨ NudgeBuddy is now open on your desktop!"
osascript -e 'tell application "Terminal" to close (every window whose name contains "Install-NudgeBuddy")' 2>/dev/null &
exit 0
EOF

chmod +x "$DESKTOP_FOLDER/Install-NudgeBuddy.command"

# Create simple instructions
cat << 'EOF' > "$DESKTOP_FOLDER/HOW-TO-OPEN.txt"
========================================
🌿 NudgeBuddy — Lush Forest Sanctuary
========================================

How to open on any Mac:

Option A (Easiest — 1 Click):
👉 Double-click "Install-NudgeBuddy.command"

Option B:
👉 Right-Click "NudgeBuddy.app" -> Select "Open" -> Click "Open"

Global Shortcut on your Mac:
Press [Option + Space] (⌥ + Space) to toggle NudgeBuddy anywhere on your screen!
EOF

# Create Zip
cd "$DESKTOP_DIR"
zip -r -q "NudgeBuddy-Mac.zip" "NudgeBuddy-Mac"

echo "🎉 Success! Ready to share:"
echo "   -> $DESKTOP_FOLDER"
echo "   -> $ZIP_OUTPUT"
