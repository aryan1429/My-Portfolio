/**
 * Google Cloud Storage Service
 * Handles media file operations with Google Cloud Storage
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

  /**
   * Upload file to Google Cloud Storage
      async fixMp4ContentType() {
        try {
          await this.initialize();
          const [files] = await this.bucket.getFiles();
          for (const file of files) {
            if (file.name.endsWith('.mp4')) {
              const [metadata] = await file.getMetadata();
              if (metadata.contentType !== 'video/mp4') {
                await file.setMetadata({ contentType: 'video/mp4' });
                console.log(`Updated contentType for: ${file.name}`);
              }
            }
          }
          console.log('All .mp4 files checked and updated if needed.');
        } catch (error) {
          console.error('Error updating mp4 contentType:', error);
        }
      }
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} fileName - File name
   * @param {string} folder - Folder path (optional)
   * @returns {Promise<string>} - Public URL of uploaded file
   */
  async uploadFile(fileBuffer, fileName, folder = '') {
    try {
      await this.initialize();
      
      const destination = folder ? `${folder}/${fileName}` : fileName;
      const file = this.bucket.file(destination);

      const stream = file.createWriteStream({
        metadata: {
          contentType: this.getContentType(fileName),
          cacheControl: 'public, max-age=86400' // 24 hours cache
        },
        public: true,
        validation: 'md5'
      });

      return new Promise((resolve, reject) => {
        stream.on('error', (error) => {
          console.error('Upload error:', error);
          reject(error);
        });

        stream.on('finish', () => {
          const publicUrl = `${this.baseUrl}/${destination}`;
          resolve(publicUrl);
        });

        stream.end(fileBuffer);
      });
    } catch (error) {
      console.error('Error uploading file to GCS:', error);
      throw error;
    }
  }

  /**
   * Delete file from Google Cloud Storage
   * @param {string} fileName - File name or path
   * @returns {Promise<boolean>} - Success status
   */
  async deleteFile(fileName) {
    try {
      await this.initialize();
      await this.bucket.file(fileName).delete();
      return true;
    } catch (error) {
      console.error('Error deleting file from GCS:', error);
      return false;
    }
  }

  /**
   * Get signed URL for private file access
   * @param {string} fileName - File name or path
   * @param {number} expiration - Expiration time in minutes (default: 60)
   * @returns {Promise<string>} - Signed URL
   */
  async getSignedUrl(fileName, expiration = 60) {
    try {
      await this.initialize();
      
      const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + expiration * 60 * 1000
      };

      const [url] = await this.bucket.file(fileName).getSignedUrl(options);
      return url;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }

  /**
   * List files in a folder
   * @param {string} folder - Folder path (optional)
   * @returns {Promise<Array>} - Array of file objects
   */
  async listFiles(folder = '') {
    try {
      await this.initialize();
      
      const [files] = await this.bucket.getFiles({
        prefix: folder
      });

      return files.map(file => ({
        name: file.name,
        size: file.metadata.size || '0',
        updated: file.metadata.updated || new Date().toISOString(),
        contentType: file.metadata.contentType || 'application/octet-stream',
        publicUrl: `${this.baseUrl}/${file.name}`
      }));
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  /**
   * Generate optimized image URL using Google Cloud's image optimization
   * @param {string} fileName - File name or path
   * @param {Object} options - Optimization options
   * @returns {string} - Optimized image URL
   */
  getOptimizedImageUrl(fileName, options = {}) {
    const {
      width,
      height,
      quality = 80,
      format = 'auto'
    } = options;

    let url = `${this.baseUrl}/${fileName}`;
    
    // Add transformation parameters if needed
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality !== 80) params.append('q', quality.toString());
    if (format !== 'auto') params.append('f', format);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return url;
  }

  /**
   * Get content type based on file extension
   * @param {string} fileName - File name
   * @returns {string} - Content type
   */
  getContentType(fileName) {
    const ext = fileName.toLowerCase().split('.').pop();
    
    const contentTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'avif': 'image/avif',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'mov': 'video/quicktime',
      'pdf': 'application/pdf',
      'txt': 'text/plain',
      'json': 'application/json'
    };

    return contentTypes[ext] || 'application/octet-stream';
  }

  /**
   * Check if bucket exists and is accessible
   * @returns {Promise<boolean>} - Bucket status
   */
  async checkBucketAccess() {
    try {
      await this.initialize();
      await this.bucket.getMetadata();
      return true;
    } catch (error) {
      console.error('Bucket access error:', error);
      return false;
    }
  }
}

export default GCPStorageService;
