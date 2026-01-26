#!/bin/bash

# Deployment script for reading-list-app
# Run this on your server to pull latest changes, build, and restart

set -e

APP_NAME="reading-list-app"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=========================================="
echo "Deploying $APP_NAME"
echo "=========================================="
echo ""

cd "$APP_DIR"

echo "[1/4] Pulling latest changes from GitHub..."
git fetch origin main
git reset --hard origin/main
echo "Done."
echo ""

echo "[2/4] Installing dependencies..."
npm ci
echo "Done."
echo ""

echo "[3/4] Building the application..."
npm run build
echo "Done."
echo ""

echo "[4/4] Restarting PM2 process..."
pm2 restart "$APP_NAME"
echo "Done."
echo ""

echo "=========================================="
echo "Deployment complete!"
echo "=========================================="
