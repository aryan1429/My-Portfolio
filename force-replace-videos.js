#!/usr/bin/env node

/**
 * Force Video Replacement Script
 * This script deletes existing videos and uploads optimized versions
 */

import { Storage } from '@google-cloud/storage';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GCP Configuration
const PROJECT_ID = process.env.GCP_PROJECT_ID || 'your-portfolio-project';
const BUCKET_NAME = process.env.GCP_BUCKET_NAME || 'my-portfolio-69';

const storage = new Storage({
  projectId: PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE || './gcp-service-account.json'
});

const bucket = storage.bucket(BUCKET_NAME);

async function forceReplaceVideos() {
  console.log('🔄 Force replacing videos with optimized versions...');

  const videosToReplace = [
    'projects/MoonFinal.mp4',
    'projects/WolverineFinal.mp4',
    'projects/Ironman-edit.mp4',
    'projects/Spiderman_edit.mp4',
    'projects/Salesman2.mp4'
  ];

  for (const videoPath of videosToReplace) {
    try {
      // Delete existing file
      console.log(`🗑️  Deleting existing: ${videoPath}`);
      await bucket.file(videoPath).delete().catch(err => {
        if (err.code !== 404) {
          console.log(`⚠️  File ${videoPath} doesn't exist or already deleted`);
        }
      });

      // Upload optimized version
      const localPath = path.join(__dirname, 'public', 'media', videoPath);
      console.log(`📤 Uploading optimized: ${localPath}`);

      await bucket.upload(localPath, {
        destination: videoPath,
        metadata: {
          contentType: 'video/mp4',
          cacheControl: 'public, max-age=3600',
          metadata: {
            'upload-date': new Date().toISOString(),
            'optimized-for-web': 'true',
            'force-replaced': 'true'
          }
        },
        resumable: false
      });

      console.log(`✅ Successfully replaced: ${videoPath}`);
    } catch (error) {
      console.error(`❌ Error replacing ${videoPath}:`, error.message);
    }
  }

  console.log('🎉 Video replacement complete!');
  console.log('🔍 Verifying uploads...');

  // Verify uploads
  for (const videoPath of videosToReplace) {
    try {
      const [metadata] = await bucket.file(videoPath).getMetadata();
      console.log(`📊 ${videoPath}: ${metadata.size} bytes, uploaded: ${metadata.metadata['upload-date']}`);
    } catch (error) {
      console.error(`❌ Failed to verify ${videoPath}:`, error.message);
    }
  }
}

forceReplaceVideos().catch(console.error);
