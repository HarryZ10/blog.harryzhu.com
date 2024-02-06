#!/bin/bash

# USER MUST CLEAR OUT STATIC FILES FIRST

# Define paths
PUBLIC_HTML_DIR="/home/dev/journex" # Path to public_html directory
FRONTEND_DIR="$PUBLIC_HTML_DIR/frontend" # Path to my React app

# Ensure you're in the right directory
cd "$PUBLIC_HTML_DIR"

# Navigate to the frontend directory
cd "$FRONTEND_DIR"

# Install dependencies and build the React app
echo "Building React app..."
npm install
npm run build

# Move the contents of the build folder to the public_html directory
echo "Deploying new build..."
mv "$FRONTEND_DIR/build/"* "$PUBLIC_HTML_DIR/"

echo "Build complete!"
