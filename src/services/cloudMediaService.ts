// Cloud Media Service - supports AWS S3 and Azure Blob Storage
interface CloudMediaConfig {
  provider: 'aws' | 'azure';
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
const awsConfig: CloudMediaConfig = {
  provider: 'aws',
  baseUrl: 'https://YOUR_BUCKET_NAME.s3.YOUR_REGION.amazonaws.com',
  bucket: 'my-portfolio-media'
};

// Azure Blob Storage Configuration (Free tier: 5GB storage, lots of requests)
const azureConfig: CloudMediaConfig = {
  provider: 'azure',
  baseUrl: 'https://YOUR_STORAGE_ACCOUNT.blob.core.windows.net/portfolio-media',
  container: 'portfolio-media'
};

// Create service instance based on your choice
// Change this to azureConfig if you prefer Azure
export const cloudMediaService = new CloudMediaService(awsConfig);

// Video asset mappings
export const videoAssets = {
  ironman: 'ironman-edit.mp4',
  moon: 'moon-final.mp4',
  spiderman: 'spiderman-edit.mp4',
  wolverine: 'wolverine-final.mp4',
  salesman: 'salesman-story.mp4'
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
