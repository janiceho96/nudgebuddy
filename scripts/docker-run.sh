#!/bin/bash
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo "=========================================="
echo "   🐳 Building & Running NudgeBuddy Docker"
echo "=========================================="

docker compose up --build -d

echo "=========================================="
echo "   🎉 Live at http://localhost:3000       "
echo "=========================================="
