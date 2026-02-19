#!/bin/bash

# Sync RoseSandbox Script
# This script copies the RoseSandbox website files to the public folder for preview

SOURCE_DIR="/Users/markyuzuk/CascadeProjects/Sensorium/RoseSandbox"
DEST_DIR="/Users/markyuzuk/CascadeProjects/MyMark/public/rosesandbox"

echo "========================================="
echo "RoseSandbox Sync Script"
echo "========================================="
echo ""
echo "Source: $SOURCE_DIR"
echo "Destination: $DEST_DIR"
echo ""

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Error: Source directory not found!"
    echo "   $SOURCE_DIR"
    exit 1
fi

# Create destination directory if it doesn't exist
if [ ! -d "$DEST_DIR" ]; then
    echo "📁 Creating destination directory..."
    mkdir -p "$DEST_DIR"
fi

# Sync files using rsync
echo "🔄 Syncing files..."
rsync -av --delete \
    --exclude='.DS_Store' \
    --exclude='*.sh' \
    --exclude='README.md' \
    --exclude='QUICKSTART.md' \
    "$SOURCE_DIR/" "$DEST_DIR/"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Sync completed successfully!"
    echo ""
    echo "Preview URL: http://localhost:5173/rosesandbox/index.html"
    echo ""
else
    echo ""
    echo "❌ Sync failed!"
    exit 1
fi
