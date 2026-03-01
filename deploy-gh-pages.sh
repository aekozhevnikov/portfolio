#!/bin/bash

# Build the project for GitHub Pages
echo "Building for GitHub Pages..."
npm run build:gh-pages

# Deploy to GitHub Pages
echo "Deploying to GitHub Pages..."
npm run deploy

echo "Deployment complete!"