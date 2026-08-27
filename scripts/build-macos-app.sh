#!/bin/bash
set -e

PROJECT_DIR="/Users/macjanice/.gemini/antigravity-ide/scratch/nudgebuddy"
APP_NAME="NudgeBuddy"
APP_DIR="$PROJECT_DIR/dist-macos/$APP_NAME.app"
DESKTOP_APP="/Users/macjanice/Desktop/$APP_NAME.app"

mkdir -p "$PROJECT_DIR/dist-macos"
rm -rf "$APP_DIR" "$DESKTOP_APP"

# Create .app directory structure
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources"

# 1. Launcher Executable (Launches true Electron floating window)
cat << 'EOF' > "$APP_DIR/Contents/MacOS/NudgeBuddy"
#!/bin/bash
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
PROJECT_DIR="/Users/macjanice/.gemini/antigravity-ide/scratch/nudgebuddy"

# Check if Vite server on port 5173 is active
if ! nc -z localhost 5173 2>/dev/null; then
  cd "$PROJECT_DIR"
  nohup npm run dev > /tmp/nudgebuddy_dev.log 2>&1 &
  for i in {1..25}; do
    if nc -z localhost 5173 2>/dev/null; then
      break
    fi
    sleep 0.2
  done
fi

cd "$PROJECT_DIR"
exec ./node_modules/.bin/electron electron-main.cjs
EOF

chmod +x "$APP_DIR/Contents/MacOS/NudgeBuddy"

# 2. Info.plist
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
    <string>11.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF

# 3. Copy Icon
if [ -f "/tmp/appIcon.icns" ]; then
  cp "/tmp/appIcon.icns" "$APP_DIR/Contents/Resources/appIcon.icns"
fi

# Copy directly to Desktop for 1-click drag & launch
cp -R "$APP_DIR" "/Users/macjanice/Desktop/"

echo "Successfully built native floating NudgeBuddy.app on Desktop!"
