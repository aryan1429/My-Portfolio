import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useIsMobile } from '@/hooks/use-mobile';

// Extend HTMLVideoElement for iOS Safari fullscreen support
interface ExtendedHTMLVideoElement extends HTMLVideoElement {
  webkitRequestFullscreen?: () => void;
  webkitEnterFullscreen?: () => void;
  webkitEnterFullScreen?: () => void;
  webkitSupportsFullscreen?: boolean;
  webkitDisplayingFullscreen?: boolean;
}

// Extend Document for fullscreen API compatibility
interface ExtendedDocument extends Document {
  webkitFullscreenElement?: Element;
  webkitExitFullscreen?: () => void;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
}

// Extend Window for IE/Edge detection
interface ExtendedWindow extends Window {
  MSStream?: unknown;
}

interface LazyVideoProps {
  src: string;
  poster?: string;
  title: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'vertical';
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: string) => void;
}

export const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  poster,
  title,
  className = '',
  aspectRatio = 'vertical',
  onPlay,
  onPause,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const [loadAttempted, setLoadAttempted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [wasPlayingBeforePause, setWasPlayingBeforePause] = useState(false);
  const [showDoubleTapHint, setShowDoubleTapHint] = useState(false);

  const videoRef = useRef<ExtendedHTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { networkInfo, isSlowConnection, shouldUseDataSaver } = useNetworkStatus();
  const isMobile = useIsMobile();

  // Detect iOS Safari
  const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as ExtendedWindow).MSStream;

  const aspectRatioClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    vertical: 'aspect-[9/16]'
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!containerRef.current || loadAttempted) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadAttempted) {
          setLoadAttempted(true);
          // Add small delay to improve perceived performance
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.load();
            }
          }, 100);
        }
      },
      {
        threshold: 0.25, // Load when 25% visible
        rootMargin: '50px' // Start loading slightly before entering viewport
      }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadAttempted]);

  // Fullscreen detection
  useEffect(() => {
    const extDocument = document as ExtendedDocument;
    
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = document.fullscreenElement === videoRef.current ||
        extDocument.webkitFullscreenElement === videoRef.current ||
        extDocument.mozFullScreenElement === videoRef.current ||
        extDocument.msFullscreenElement === videoRef.current;
      setIsFullscreen(isCurrentlyFullscreen);
    };

    const handleWebkitFullscreenChange = () => {
      const isCurrentlyFullscreen = extDocument.webkitFullscreenElement === videoRef.current;
      setIsFullscreen(isCurrentlyFullscreen);
    };

    const handleVideoFullscreenChange = () => {
      // iOS Safari video fullscreen detection
      const video = videoRef.current;
      if (video && video.webkitDisplayingFullscreen !== undefined) {
        setIsFullscreen(video.webkitDisplayingFullscreen);
      }
    };

    // Standard fullscreen events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleWebkitFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    // iOS Safari video fullscreen events
    const video = videoRef.current;
    if (video) {
      video.addEventListener('webkitbeginfullscreen', handleVideoFullscreenChange);
      video.addEventListener('webkitendfullscreen', handleVideoFullscreenChange);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleWebkitFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      
      if (video) {
        video.removeEventListener('webkitbeginfullscreen', handleVideoFullscreenChange);
        video.removeEventListener('webkitendfullscreen', handleVideoFullscreenChange);
      }
    };
  }, []);

  // Video time tracking for resume functionality
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [loadAttempted]);

  const handleLoadedData = useCallback(() => {
    setIsLoaded(true);
    setIsLoading(false);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
  }, []);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', e);
    setHasError(true);
    setIsLoading(false);
    setIsPlaying(false);
    onError?.(`Failed to load video: ${title}`);
  }, [title, onError]);

  const handlePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      setIsLoading(true);
      await video.play();
      setIsPlaying(true);
      setShowPoster(false);
      onPlay?.();
    } catch (error) {
      console.error('Play failed:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [onPlay]);

  const handlePause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    setIsPlaying(false);
    onPause?.();
  }, [onPause]);

  const handleVideoPlay = useCallback(() => {
    setIsPlaying(true);
    setShowPoster(false);
    setIsLoading(false);
    setWasPlayingBeforePause(true);
    onPlay?.();
  }, [onPlay]);

  const handleVideoPause = useCallback(() => {
    setIsPlaying(false);
    setWasPlayingBeforePause(false);
    // Show poster when paused, but only if not at the beginning
    if (currentTime > 0.5) {
      setShowPoster(true);
    }
    onPause?.();
  }, [onPause, currentTime]);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    setShowPoster(true);
    setWasPlayingBeforePause(false);
    setCurrentTime(0);
  }, []);

  const handlePlayClick = useCallback(() => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [isPlaying, handlePlay, handlePause]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleFullscreen = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    const extDocument = document as ExtendedDocument;

    // Debug logging for iOS Safari
    if (process.env.NODE_ENV === 'development' && isIOSSafari) {
      console.log('iOS Safari detected, available fullscreen methods:', {
        requestFullscreen: !!video.requestFullscreen,
        webkitRequestFullscreen: !!video.webkitRequestFullscreen,
        webkitEnterFullscreen: !!video.webkitEnterFullscreen,
        webkitSupportsFullscreen: !!video.webkitSupportsFullscreen
      });
    }

    try {
      if (isFullscreen || document.fullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (extDocument.webkitExitFullscreen) {
          extDocument.webkitExitFullscreen();
        }
      } else {
        // Try standard fullscreen first
        if (video.requestFullscreen) {
          await video.requestFullscreen();
        } 
        // iOS Safari fallback - use webkit methods
        else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        }
        // iOS Safari video-specific fullscreen
        else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
        // Last resort for iOS
        else if (video.webkitSupportsFullscreen && video.webkitEnterFullScreen) {
          video.webkitEnterFullScreen();
        }
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
      // iOS Safari fallback - try webkit video fullscreen
      try {
        if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      } catch (fallbackError) {
        console.error('iOS fullscreen fallback failed:', fallbackError);
      }
    }
  }, [isFullscreen, isIOSSafari]);

  const handlePosterClick = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      setIsLoading(true);
      setShowPoster(false);
      
      // If video was paused midway, resume from that position
      if (wasPlayingBeforePause && currentTime > 0) {
        video.currentTime = currentTime;
      }
      
      await video.play();
    } catch (error) {
      console.error('Play from poster failed:', error);
      setHasError(true);
      setShowPoster(true);
    } finally {
      setIsLoading(false);
    }
  }, [wasPlayingBeforePause, currentTime]);

  // Touch events for mobile interaction
  const handleVideoClick = useCallback((e: React.MouseEvent) => {
    // Prevent click when interacting with controls
    if ((e.target as HTMLElement).closest('.video-controls')) return;
    
    // Double tap for fullscreen on mobile
    const now = Date.now();
    const target = e.target as HTMLElement & { lastTap?: number };
    const lastTap = target.lastTap || 0;
    
    if (now - lastTap < 300) {
      // Double tap detected
      toggleFullscreen();
      // Show hint for first time users
      if (isMobile) {
        setShowDoubleTapHint(true);
        setTimeout(() => setShowDoubleTapHint(false), 2000);
      }
    } else {
      // Single tap - toggle play/pause
      handlePlayClick();
    }
    
    target.lastTap = now;
  }, [handlePlayClick, toggleFullscreen, isMobile]);

  const getPreloadStrategy = () => {
    if (shouldUseDataSaver) return 'none';
    if (isMobile && isSlowConnection) return 'none';
    if (isMobile) return 'metadata';
    return 'metadata';
  };

  if (hasError) {
    return (
      <div ref={containerRef} className={`relative ${aspectRatioClasses[aspectRatio]} bg-gray-900 rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <div className="text-red-500 mb-2 text-2xl">⚠️</div>
          <p className="text-sm text-center mb-2">Video unavailable</p>
          <p className="text-xs text-gray-400 text-center line-clamp-2">{title}</p>
          <button 
            onClick={() => {
              setHasError(false);
              setLoadAttempted(false);
              setShowPoster(true);
              setIsLoaded(false);
            }}
            className="mt-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative ${aspectRatioClasses[aspectRatio]} bg-black rounded-lg overflow-hidden group ${className}`}
    >
      {/* Video Element - Only rendered after load attempted */}
      {loadAttempted && (
        <video
          ref={videoRef}
          className="w-full h-full object-cover cursor-pointer"
          poster={poster}
          muted={isMuted}
          playsInline
          {...(isIOSSafari && { 'webkit-playsinline': 'true' })}
          preload={getPreloadStrategy()}
          onLoadStart={handleLoadStart}
          onLoadedData={handleLoadedData}
          onCanPlay={handleCanPlay}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onEnded={handleVideoEnded}
          onError={handleError}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
          onClick={handleVideoClick}
          style={{
            backgroundColor: 'black',
            willChange: 'transform'
          }}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Loading State */}
      {(isLoading || (!isLoaded && loadAttempted)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
          <div className="text-center text-white">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading...</p>
            {shouldUseDataSaver && (
              <p className="text-xs text-gray-300 mt-1">Data saver mode</p>
            )}
            {networkInfo?.effectiveType && (
              <p className="text-xs text-gray-300 mt-1">
                {networkInfo.effectiveType.toUpperCase()} connection
              </p>
            )}
          </div>
        </div>
      )}

      {/* Poster Image and Play Button */}
      {(showPoster || !loadAttempted) && poster && (
        <div className="absolute inset-0 z-10">
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <button
            onClick={handlePosterClick}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors z-20"
            aria-label={`Play ${title}${currentTime > 0 ? ` from ${Math.floor(currentTime)}s` : ''}`}
          >
            <div className="bg-black/60 rounded-full p-3 hover:bg-black/80 transition-colors">
              <Play className="h-8 w-8 text-white" />
              {currentTime > 0 && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black/60 px-2 py-1 rounded">
                  Resume from {Math.floor(currentTime)}s
                </div>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Custom Controls for Mobile */}
      {isLoaded && !showPoster && (
        <div className="video-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity z-30">
          {/* Progress Bar */}
          {duration > 0 && (
            <div className="w-full bg-white/20 rounded-full h-1 mb-3">
              <div 
                className="bg-white rounded-full h-1 transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayClick}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 text-white" />
                ) : (
                  <Play className="h-4 w-4 text-white" />
                )}
              </button>
              
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-white" />
                ) : (
                  <Volume2 className="h-4 w-4 text-white" />
                )}
              </button>

              {/* Time Display */}
              {duration > 0 && (
                <span className="text-white text-xs font-mono">
                  {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label={isFullscreen ? 'Exit fullscreen' : (isIOSSafari ? 'Enter fullscreen (iOS)' : 'Enter fullscreen')}
                title={isIOSSafari ? 'Tap for fullscreen video player' : (isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen')}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4 text-white" />
                ) : (
                  <Maximize2 className="h-4 w-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title Overlay */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 to-transparent z-20">
        <h3 className="text-white font-semibold text-sm line-clamp-2">
          {title}
        </h3>
      </div>

      {/* Data Saver Indicator */}
      {shouldUseDataSaver && (
        <div className="absolute top-2 right-2 bg-blue-600/80 text-white text-xs px-2 py-1 rounded z-20">
          Data Saver
        </div>
      )}

      {/* Double Tap Hint for Mobile */}
      {showDoubleTapHint && isMobile && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm animate-fade-in">
            Double tap for fullscreen
          </div>
        </div>
      )}

      {/* Fullscreen Indicator */}
      {isFullscreen && (
        <div className="absolute top-2 left-2 bg-green-600/80 text-white text-xs px-2 py-1 rounded z-20">
          Fullscreen
        </div>
      )}
    </div>
  );
};

export default LazyVideo;
