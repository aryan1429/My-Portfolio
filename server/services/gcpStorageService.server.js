/**
 * Google Cloud Storage Service (server-side)
 * Handles media file operations with Google Cloud Storage
 * This file is intended for Node.js server usage only and should not be imported by client code.
 */

import dotenv from 'dotenv';

dotenv.config();

class GCPStorageService {
  constructor() {
    this.storage = null;
    this.bucketName = process.env.GCP_BUCKET_NAME || '';
    this.bucket = null;
    this.baseUrl = `https://storage.googleapis.com/${this.bucketName}`;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      const { Storage } = await import('@google-cloud/storage');
      this.storage = new Storage({
        projectId: process.env.GCP_PROJECT_ID,
        keyFilename: process.env.GCP_KEY_FILE
      });
      this.bucket = this.storage.bucket(this.bucketName);
      this.initialized = true;
      console.log('✅ GCP Storage Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Google Cloud Storage:', error);
      throw error;
    }
  }

  // ... (rest of implementation unchanged) ...
}

export default GCPStorageService;
