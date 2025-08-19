import React, { useState } from 'react';
import { cloudinaryService } from '@/services/cloudinaryService';

interface VideoPlayerProps {
  publicId: string;
  title: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  publicId,
  title,
  thumbnail,
  width = 800,
  height = 450,
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate optimized video URL
  const videoUrl = cloudinaryService.generateVideoUrl(publicId, {
    quality: 'auto',
    format: 'auto',
    width,
    height
  });

  // Generate thumbnail if not provided
  const thumbnailUrl = thumbnail || cloudinaryService.generateVideoThumbnail(publicId, {
    width,
    height
  });

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} 
           style={{ width, height }}>
        <div className="text-center p-4">
          <p className="text-gray-600 mb-2">Failed to load video</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading video...</p>
          </div>
        </div>
      )}
      
      <video
        width={width}
        height={height}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        poster={thumbnailUrl}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        className="w-full h-full object-cover"
        preload="metadata"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

interface OptimizedImageProps {
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: 'auto' | 'auto:good' | 'auto:best';
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale';
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  publicId,
  alt,
  width,
  height,
  quality = 'auto',
  format = 'auto',
  crop = 'fill',
  className = '',
  loading = 'lazy'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageUrl = cloudinaryService.generateImageUrl(publicId, {
    quality,
    format,
    width,
    height,
    crop
  });

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
           style={{ width, height }}>
        <div className="text-center p-4">
          <p className="text-gray-600 text-sm">Image not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg animate-pulse">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
        </div>
      )}
      
      <img
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
      />
    </div>
  );
};

export default { VideoPlayer, OptimizedImage };
