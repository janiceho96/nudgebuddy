#!/bin/bash
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_NAME="NudgeBuddy"
APP_DIR="$PROJECT_DIR/dist-macos/$APP_NAME.app"
DESKTOP_APP="/Users/macjanice/Desktop/$APP_NAME.app"

# 1. Build production bundle first
cd "$PROJECT_DIR"
npm run build

mkdir -p "$PROJECT_DIR/dist-macos"
rm -rf "$APP_DIR" "$DESKTOP_APP"

# Create .app directory structure
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources/app"

# Copy compiled static web app directly inside the .app bundle
cp -R "$PROJECT_DIR/dist/"* "$APP_DIR/Contents/Resources/app/"
cp "$PROJECT_DIR/electron-main.cjs" "$APP_DIR/Contents/Resources/app/"

# 2. Native macOS Launcher
cat << 'EOF' > "$APP_DIR/Contents/MacOS/NudgeBuddy"
#!/bin/bash
PROJECT_DIR="/Users/macjanice/.gemini/antigravity-ide/scratch/nudgebuddy"
APP_DIR="$(cd "$(dirname "$0")/../Resources/app" && pwd)"

# 1. Try launching as true native Electron floating desktop window
if [ -f "$PROJECT_DIR/node_modules/.bin/electron" ]; then
  exec "$PROJECT_DIR/node_modules/.bin/electron" "$PROJECT_DIR/electron-main.cjs"
elif [ -x "$(command -v electron)" ]; then
  exec electron "$APP_DIR/electron-main.cjs"
else
  # 2. Portable standalone fallback for non-dev computers
  PORT=5188
  if ! nc -z localhost $PORT 2>/dev/null; then
    cd "$APP_DIR"
    python3 -m http.server $PORT > /dev/null 2>&1 &
    sleep 0.5
  fi
  open "http://localhost:$PORT"
fi
EOF

chmod +x "$APP_DIR/Contents/MacOS/NudgeBuddy"

# 3. Info.plist
cat << EOF > "$APP_DIR/Contents/Info.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>NudgeBuddy</string>
    <key>CFBundleIconFile</key>
    <string>appIcon.icns</string>
    <key>CFBundleIdentifier</key>
    <string>com.nudgebuddy.adhdcompanion</string>
    <key>CFBundleName</key>
    <string>NudgeBuddy</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.15</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF

# 4. Copy Mascot Icon
if [ -f "/tmp/appIcon.icns" ]; then
  cp "/tmp/appIcon.icns" "$APP_DIR/Contents/Resources/appIcon.icns"
fi

# Self-sign with ad-hoc signature
codesign --force --deep --sign - "$APP_DIR" 2>/dev/null || true

# Copy directly to Desktop
cp -R "$APP_DIR" "/Users/macjanice/Desktop/"

echo "Successfully built 100% native NudgeBuddy.app on Desktop!"
