// Video optimization utilities for mobile devices

export interface VideoOptimizationSettings {
  preload: 'none' | 'metadata' | 'auto';
  quality: 'low' | 'medium' | 'high';
  autoplay: boolean;
  enableDataSaver: boolean;
}

export const getOptimalVideoSettings = (
  isMobile: boolean,
  connectionType?: string,
  saveData?: boolean
): VideoOptimizationSettings => {
  // If data saver is enabled, use minimal settings
  if (saveData) {
    return {
      preload: 'none',
      quality: 'low',
      autoplay: false,
      enableDataSaver: true
    };
  }

  // Mobile optimizations
  if (isMobile) {
    switch (connectionType) {
      case '4g':
        return {
          preload: 'metadata',
          quality: 'medium',
          autoplay: false,
          enableDataSaver: false
        };
      case '3g':
        return {
          preload: 'none',
          quality: 'low',
          autoplay: false,
          enableDataSaver: true
        };
      case '2g':
      case 'slow-2g':
        return {
          preload: 'none',
          quality: 'low',
          autoplay: false,
          enableDataSaver: true
        };
      default:
        return {
          preload: 'none',
          quality: 'medium',
          autoplay: false,
          enableDataSaver: false
        };
    }
  }

  // Desktop settings
  return {
    preload: 'metadata',
    quality: 'high',
    autoplay: false,
    enableDataSaver: false
  };
};

export const getVideoUrlWithQuality = (baseUrl: string, quality: 'low' | 'medium' | 'high'): string => {
  // For now, return the same URL since we don't have multiple quality versions
  // In a real app, you'd have different video files for different qualities
  return baseUrl;
};

export const shouldShowDataSaverWarning = (
  connectionType?: string,
  saveData?: boolean
): boolean => {
  return saveData === true || connectionType === '2g' || connectionType === 'slow-2g';
};

export const getVideoLoadingStrategy = (
  isMobile: boolean,
  isIntersecting: boolean,
  connectionType?: string
): 'immediate' | 'lazy' | 'on-demand' => {
  if (!isIntersecting) return 'on-demand';
  
  if (isMobile && (connectionType === '2g' || connectionType === 'slow-2g')) {
    return 'on-demand';
  }
  
  if (isMobile) return 'lazy';
  
  return 'immediate';
};

export const formatVideoDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const estimateVideoSize = (duration: number, quality: 'low' | 'medium' | 'high'): string => {
  // Rough estimates in MB per minute
  const sizesPerMinute = {
    low: 5,    // ~5MB per minute
    medium: 15, // ~15MB per minute
    high: 25   // ~25MB per minute
  };
  
  const durationInMinutes = duration / 60;
  const estimatedSize = durationInMinutes * sizesPerMinute[quality];
  
  return `~${Math.round(estimatedSize)}MB`;
};
