import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Type definitions for network connection
interface NetworkInformation {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  downlink?: number;
  saveData?: boolean;
}

interface NetworkConnection extends NetworkInformation, EventTarget {}

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

declare global {
  interface Navigator {
    connection?: NetworkConnection;
  }
}

interface MobileOptimizedVideoProps {
  src: string;
  poster?: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: () => void;
}

export const MobileOptimizedVideo: React.FC<MobileOptimizedVideoProps> = ({
  src,
  poster,
  title,
  className = '',
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  preload = 'none',
  onPlay,
  onPause,
  onEnded,
  onError,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasError, setHasError] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const [canPlay, setCanPlay] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<NetworkInformation | null>(null);
  
  const videoRef = useRef<ExtendedHTMLVideoElement>(null);
  const isMobile = useIsMobile();

  // Detect iOS Safari
  const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as ExtendedWindow).MSStream;

  // Detect network conditions for mobile optimization
  useEffect(() => {
    if ('connection' in navigator && navigator.connection) {
      const connection = navigator.connection;
      setNetworkInfo({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        saveData: connection.saveData
      });
    }
  }, []);

  // Mobile-specific preload strategy
  const getOptimalPreload = () => {
    if (!isMobile) return preload;
    
    // On mobile, be more conservative with preloading
    if (networkInfo?.effectiveType === '4g') return 'metadata';
    if (networkInfo?.effectiveType === '3g') return 'none';
    if (networkInfo?.effectiveType === '2g' || networkInfo?.effectiveType === 'slow-2g') return 'none';
    
    return 'none'; // Default to none on mobile for better performance
  };

  // Handle video events
  const handlePlay = () => {
    setIsPlaying(true);
    setShowPoster(false);
    setIsLoading(false);
    onPlay?.();
  };

  const handlePause = () => {
    setIsPlaying(false);
    setIsLoading(false);
    onPause?.();
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setCanPlay(true);
    setIsLoading(false);
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

  const handlePlaying = () => {
    setIsLoading(false);
    setShowPoster(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setShowPoster(true);
    setIsLoading(false);
    onEnded?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', e);
    setHasError(true);
    setIsLoading(false);
    setIsPlaying(false);
    onError?.();
  };

  const handlePlayClick = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
      } else {
        setIsLoading(true);
        await video.play();
      }
    } catch (error) {
      console.error('Play failed:', error);
      setHasError(true);
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    const extDocument = document as ExtendedDocument;

    try {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (extDocument.webkitExitFullscreen) {
          extDocument.webkitExitFullscreen();
        }
      } else {
        // Try standard fullscreen first
        if (video.requestFullscreen) {
          video.requestFullscreen().catch(console.error);
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
      console.error('Fullscreen error:', error);
      // iOS Safari fallback
      try {
        if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      } catch (fallbackError) {
        console.error('iOS fullscreen fallback failed:', fallbackError);
      }
    }
  };

  if (hasError) {
    return (
      <div className={`relative aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-sm text-center mb-2">Failed to load video</p>
          <p className="text-xs text-gray-400 text-center">{title}</p>
          <button 
            onClick={() => {
              setHasError(false);
              setShowPoster(true);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative aspect-[9/16] bg-black rounded-lg overflow-hidden group ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        muted={isMuted}
        loop={loop}
        playsInline
        {...(isIOSSafari && { 'webkit-playsinline': 'true' })}
        preload={getOptimalPreload()}
        onPlay={handlePlay}
        onPause={handlePause}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onEnded={handleEnded}
        onError={handleError}
        style={{
          backgroundColor: 'black',
          willChange: 'transform'
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {/* Poster Image and Play Button */}
      {(showPoster && poster) && (
        <div className="absolute inset-0 z-10">
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors z-20"
            aria-label="Play video"
          >
            <Play className="h-12 w-12 text-white drop-shadow-lg" />
          </button>
        </div>
      )}

      {/* Custom Controls (Mobile Optimized) */}
      {controls && !showPoster && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
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
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Fullscreen"
            >
              <Maximize2 className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Title Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent z-20">
        <h3 className="text-white font-semibold text-sm line-clamp-2">
          {title}
        </h3>
      </div>

      {/* Network indicator (for debugging on mobile) */}
      {isMobile && networkInfo && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-50 z-20">
          {networkInfo.effectiveType || 'unknown'}
        </div>
      )}
    </div>
  );
};

export default MobileOptimizedVideo;
