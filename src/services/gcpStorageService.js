/**
 * Google Cloud Storage Service - Client Version
 * Handles media URL generation for frontend use only
 */

class GCPStorageService {
  constructor() {
    this.bucketName = \"my-portfolio-69\"; // Hardcoded for frontend
    this.baseUrl = `https://storage.googleapis.com/${this.bucketName}`;
    this.initialized = true; // Always initialized for client
  }

  // Client-side method to generate URLs (no server operations)
  generateVideoUrl(objectPath) {
    return `${this.baseUrl}/${objectPath}`;
  }

  generateImageUrl(objectPath) {
    return `${this.baseUrl}/${objectPath}`;
  }

  generateMediaUrl(objectPath) {
    return `${this.baseUrl}/${objectPath}`;
  }

  // Stub methods for compatibility (no actual operations)
  async uploadFile() {
    throw new Error(\"Upload operations not available on client-side. Use server API.\");
  }

  async deleteFile() {
    throw new Error(\"Delete operations not available on client-side. Use server API.\");
  }

  async listFiles() {
    throw new Error(\"List operations not available on client-side. Use server API.\");
  }
}

export default GCPStorageService;