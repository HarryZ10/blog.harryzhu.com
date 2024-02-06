#!/bin/bash

# Define paths
PUBLIC_HTML_DIR="/home/hzhu20/public_html" # Path to public_html directory
FRONTEND_DIR="$PUBLIC_HTML_DIR/frontend" # Path to my React app

# Ensure you're in the right directory
cd "$PUBLIC_HTML_DIR"

# Clear the existing build directory in public_html if it exists
echo "Clearing old build..."
rm -rf "$PUBLIC_HTML_DIR/build"

# Navigate to the frontend directory
cd "$FRONTEND_DIR"

# Install dependencies and build the React app
echo "Building React app..."
npm install
npm run build

# Move the build folder to the public_html directory
echo "Deploying new build..."
mv "$FRONTEND_DIR/build" "$PUBLIC_HTML_DIR"

echo "Build complete!"

