#!/bin/bash
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_NAME="NudgeBuddy"
DIST_DIR="$PROJECT_DIR/dist-macos"
APP_BUNDLE="$DIST_DIR/$APP_NAME.app"
DESKTOP_DIR="/Users/macjanice/Desktop"

echo "🍃 1. Building production frontend..."
cd "$PROJECT_DIR"
npm run build

echo "📦 2. Scaffolding Native macOS Electron App..."
mkdir -p "$DIST_DIR"
rm -rf "$APP_BUNDLE" "$DESKTOP_DIR/$APP_NAME.app"

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
    <string>com.nudgebuddy.adhdcompanion</string>
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

# Clear local quarantine & permissions
xattr -cr "$APP_BUNDLE" 2>/dev/null || true
chmod +x "$APP_BUNDLE/Contents/MacOS/$APP_NAME"

# Copy directly to Desktop
cp -R "$APP_BUNDLE" "$DESKTOP_DIR/"
xattr -cr "$DESKTOP_DIR/$APP_NAME.app" 2>/dev/null || true
chmod +x "$DESKTOP_DIR/$APP_NAME.app/Contents/MacOS/$APP_NAME"

echo "🎉 Successfully built true native standalone $APP_NAME.app on Desktop!"
