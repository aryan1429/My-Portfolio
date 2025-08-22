// Cloud Media Service - supports AWS S3 and Azure Blob Storage
interface CloudMediaConfig {
  provider: 'aws' | 'azure' | 'gcp';
  baseUrl: string;
  bucket?: string; // for AWS
  container?: string; // for Azure
}

interface MediaAsset {
  id: string;
  url: string;
  type: 'video' | 'image';
  provider: 'aws' | 'azure';
}

class CloudMediaService {
  private config: CloudMediaConfig;

  constructor(config: CloudMediaConfig) {
    this.config = config;
  }

  // Generate media URL for AWS S3
  generateAwsUrl(key: string): string {
    return `${this.config.baseUrl}/${key}`;
  }

  // Generate media URL for Azure Blob Storage
  generateAzureUrl(blobName: string): string {
    return `${this.config.baseUrl}/${blobName}`;
  }

  // Generic method to get media URL
  getMediaUrl(assetKey: string): string {
    if (this.config.provider === 'aws') {
      return this.generateAwsUrl(assetKey);
    } else if (this.config.provider === 'azure') {
      return this.generateAzureUrl(assetKey);
    }
    throw new Error(`Unsupported provider: ${this.config.provider}`);
  }

  // Video-specific methods
  getVideoUrl(videoKey: string): string {
    return this.getMediaUrl(`videos/${videoKey}`);
  }

  // Image-specific methods  
  getImageUrl(imageKey: string): string {
    return this.getMediaUrl(`images/${imageKey}`);
  }

  // Get thumbnail URL (for videos, we'll use image thumbnails)
  getThumbnailUrl(thumbnailKey: string): string {
    return this.getImageUrl(thumbnailKey);
  }
}

// AWS S3 Configuration (Free tier: 5GB storage, 20K GET requests/month)
// GCP Storage Configuration
const gcpConfig: CloudMediaConfig = {
  provider: 'gcp',
  baseUrl: `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME || 'my-portfolio-69'}`
};

// Create service instance for GCP
export const cloudMediaService = new CloudMediaService(gcpConfig);

// Video asset mappings
export const videoAssets = {
  ironman: 'Ironman-edit.mp4',
  moon: 'MoonFinal.mp4',
  spiderman: 'Spiderman_edit.mp4',
  wolverine: 'WolverineFinal.mp4',
  salesman: 'Salesman2.mp4'
};

// Image asset mappings
export const imageAssets = {
  ironmanHero: 'ironman-hero.jpg',
  moonThumbnail: 'moon-thumbnail.png',
  spidermanThumbnail: 'spiderman-thumbnail.jpg',
  wolverineThumbnail: 'wolverine-thumbnail.png',
  salesmanThumbnail: 'salesman-thumbnail.avif'
};

export default CloudMediaService;
