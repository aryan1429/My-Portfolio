#!/usr/bin/env node

/**
 * Favicon Generator Script
 * Converts profile picture to favicon formats
 * Run with: node scripts/generate-favicon.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sourceImage = path.join(rootDir, 'src', 'assets', 'profile-pic.jpeg');
const publicDir = path.join(rootDir, 'public');

// Favicon sizes to generate
const sizes = [16, 32, 48];

async function generateFavicons() {
  try {
    console.log('🔄 Generating favicons from profile picture...');

    // Check if source image exists
    if (!fs.existsSync(sourceImage)) {
      throw new Error(`Source image not found: ${sourceImage}`);
    }

    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Generate different sizes
    for (const size of sizes) {
      const outputPath = path.join(publicDir, `favicon-${size}x${size}.png`);

      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${size}x${size} favicon`);
    }

    // Generate main favicon.ico (32x32)
    const faviconIcoPath = path.join(publicDir, 'favicon.ico');
    await sharp(sourceImage)
      .resize(32, 32, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(faviconIcoPath);

    console.log('✅ Generated favicon.ico');
    console.log('🎉 Favicon generation complete!');

  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

generateFavicons();
