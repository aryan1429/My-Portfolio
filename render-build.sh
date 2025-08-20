#!/bin/bash
# Render build script

# Copy the backend-specific package.json
cp package-backend.json package.json

# Install dependencies
npm install

echo "Build completed successfully"
