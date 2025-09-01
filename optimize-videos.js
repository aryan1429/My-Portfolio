#!/usr/bin/env node

/**
 * Video Optimization Helper for Portfolio
 * This script helps identify and optimize videos for web streaming
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VideoOptimizer {
  constructor() {
    this.mediaDir = path.join(__dirname, 'public', 'media', 'projects');
  }

  async analyzeVideos() {
    console.log('🔍 Analyzing video files for optimization...');

    if (!await fs.pathExists(this.mediaDir)) {
      console.log('❌ Media directory not found');
      return;
    }

    const files = await fs.readdir(this.mediaDir);
    const videoFiles = files.filter(file => file.endsWith('.mp4'));

    console.log(`Found ${videoFiles.length} video files:`);

    for (const file of videoFiles) {
      const filePath = path.join(this.mediaDir, file);
      const stats = await fs.stat(filePath);

      console.log(`📹 ${file}:`);
      console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Modified: ${stats.mtime.toISOString()}`);
      console.log('');
    }

    console.log('💡 Recommendations for better web streaming:');
    console.log('1. Use H.264 codec for MP4 files');
    console.log('2. Target bitrate: 2-5 Mbps for 1080p, 1-2 Mbps for 720p');
    console.log('3. Use constant bitrate (CBR) instead of variable bitrate (VBR)');
    console.log('4. Add fast start atom for quicker playback');
    console.log('5. Consider creating multiple quality versions (adaptive streaming)');
  }

  async generateOptimizationScript() {
    console.log('📝 Generating FFmpeg optimization commands...');

    const commands = [
      '# Optimize videos for web streaming',
      '# Install FFmpeg first: https://ffmpeg.org/download.html',
      '',
      '# Example optimization command for H.264 MP4:',
      '# ffmpeg -i input.mp4 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -movflags +faststart output.mp4',
      '',
      '# For your specific files:'
    ];

    if (await fs.pathExists(this.mediaDir)) {
      const files = await fs.readdir(this.mediaDir);
      const videoFiles = files.filter(file => file.endsWith('.mp4'));

      for (const file of videoFiles) {
        const inputPath = path.join(this.mediaDir, file);
        const outputPath = path.join(this.mediaDir, file.replace('.mp4', '_optimized.mp4'));

        commands.push(`ffmpeg -i "${inputPath}" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -movflags +faststart "${outputPath}"`);
      }
    }

    const scriptPath = path.join(__dirname, 'optimize-videos.bat');
    await fs.writeFile(scriptPath, commands.join('\n'));

    console.log(`✅ Optimization script created: ${scriptPath}`);
    console.log('Run this script to optimize your videos for web streaming');
  }
}

// Run the optimizer
const optimizer = new VideoOptimizer();

console.log('🎬 Video Optimization Helper');
console.log('==========================');

optimizer.analyzeVideos().then(() => {
  return optimizer.generateOptimizationScript();
}).then(() => {
  console.log('\n✅ Analysis complete!');
  console.log('If videos are still laggy, consider:');
  console.log('1. Re-encoding with FFmpeg using the generated script');
  console.log('2. Reducing video resolution');
  console.log('3. Lowering bitrate');
  console.log('4. Using a CDN for better streaming');
}).catch(console.error);
