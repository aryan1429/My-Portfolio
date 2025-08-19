// Cloudinary service for video and image management
interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

interface MediaAsset {
  id: string;
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  resourceType: 'video' | 'image';
  bytes: number;
  duration?: number; // for videos
  width: number;
  height: number;
}

class CloudinaryService {
  private config: CloudinaryConfig;
  private baseUrl: string;

  constructor(config: CloudinaryConfig) {
    this.config = config;
    this.baseUrl = `https://res.cloudinary.com/${config.cloudName}`;
  }

  // Generate Cloudinary URL for existing videos
  generateVideoUrl(publicId: string, options: {
    quality?: 'auto' | 'auto:good' | 'auto:best';
    format?: 'mp4' | 'webm' | 'auto';
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale';
  } = {}): string {
    const {
      quality = 'auto',
      format = 'auto',
      width,
      height,
      crop = 'fill'
    } = options;

    let transformations = [`q_${quality}`, `f_${format}`];
    
    if (width || height) {
      const dimensions = [
        width && `w_${width}`,
        height && `h_${height}`,
        `c_${crop}`
      ].filter(Boolean).join(',');
      transformations.push(dimensions);
    }

    const transformationString = transformations.join(',');
    return `${this.baseUrl}/video/upload/${transformationString}/${publicId}`;
  }

  // Generate thumbnail from video
  generateVideoThumbnail(publicId: string, options: {
    width?: number;
    height?: number;
    timeOffset?: string; // e.g., "50%" or "10s"
  } = {}): string {
    const {
      width = 400,
      height = 300,
      timeOffset = "50%"
    } = options;

    return `${this.baseUrl}/video/upload/so_${timeOffset},w_${width},h_${height},c_fill,q_auto,f_auto/${publicId}.jpg`;
  }

  // Generate image URL
  generateImageUrl(publicId: string, options: {
    quality?: 'auto' | 'auto:good' | 'auto:best';
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale';
  } = {}): string {
    const {
      quality = 'auto',
      format = 'auto',
      width,
      height,
      crop = 'fill'
    } = options;

    let transformations = [`q_${quality}`, `f_${format}`];
    
    if (width || height) {
      const dimensions = [
        width && `w_${width}`,
        height && `h_${height}`,
        `c_${crop}`
      ].filter(Boolean).join(',');
      transformations.push(dimensions);
    }

    const transformationString = transformations.join(',');
    return `${this.baseUrl}/image/upload/${transformationString}/${publicId}`;
  }

  // Upload video (for future use with admin panel)
  async uploadVideo(file: File, options: {
    folder?: string;
    publicId?: string;
    tags?: string[];
  } = {}): Promise<MediaAsset> {
    // This would typically use the Cloudinary upload API
    // For now, return a placeholder that matches your current structure
    throw new Error('Upload functionality requires server-side implementation');
  }

  // Upload image (for future use with admin panel)
  async uploadImage(file: File, options: {
    folder?: string;
    publicId?: string;
    tags?: string[];
  } = {}): Promise<MediaAsset> {
    // This would typically use the Cloudinary upload API
    throw new Error('Upload functionality requires server-side implementation');
  }
}

// Export a configured instance
export const cloudinaryService = new CloudinaryService({
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY || '',
  apiSecret: process.env.REACT_APP_CLOUDINARY_API_SECRET || ''
});

export default CloudinaryService;
