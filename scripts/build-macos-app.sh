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

# Copy compiled static web app directly inside the .app bundle (100% self-contained!)
cp -R "$PROJECT_DIR/dist/"* "$APP_DIR/Contents/Resources/app/"

# 2. Universal Self-Contained Launcher (Runs on ANY Mac)
cat << 'EOF' > "$APP_DIR/Contents/MacOS/NudgeBuddy"
#!/bin/bash
DIR="$(cd "$(dirname "$0")/../Resources/app" && pwd)"
PORT=5188

# Check if port is already running
if ! nc -z localhost $PORT 2>/dev/null; then
  # Start lightweight built-in macOS python web server from inside the app bundle
  cd "$DIR"
  /usr/bin/python3 -m http.server $PORT > /dev/null 2>&1 &
  SERVER_PID=$!
  sleep 0.3
fi

# Try launching in Chrome standalone app window mode if Google Chrome is installed
if [ -d "/Applications/Google Chrome.app" ]; then
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --app="http://localhost:$PORT" \
    --window-size=440,780 \
    --window-position=980,60 \
    --disable-features=TranslateUI \
    > /dev/null 2>&1 &
elif [ -d "$HOME/Applications/Google Chrome.app" ]; then
  "$HOME/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --app="http://localhost:$PORT" \
    --window-size=440,780 \
    --window-position=980,60 \
    > /dev/null 2>&1 &
elif [ -d "/Applications/Brave Browser.app" ]; then
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
    --app="http://localhost:$PORT" \
    --window-size=440,780 \
    --window-position=980,60 \
    > /dev/null 2>&1 &
elif [ -d "/Applications/Microsoft Edge.app" ]; then
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
    --app="http://localhost:$PORT" \
    --window-size=440,780 \
    --window-position=980,60 \
    > /dev/null 2>&1 &
else
  # Fallback to default browser
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

echo "Successfully built 100% self-contained portable NudgeBuddy.app!"
