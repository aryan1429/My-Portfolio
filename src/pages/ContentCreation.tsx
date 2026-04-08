import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import LazyVideo from '@/components/LazyVideo';
import MobileDebugPanel from '@/components/MobileDebugPanel';

// Import thumbnails
import wolverine_thumbnail from '@/assets/wolverine_thumbnail.png';
import moon_thumbnail from '@/assets/moon_thumbnail.png';
import ironman_thumbnail from '@/assets/Ironman.jpg';
import spiderman_thumbnail from '@/assets/spiderman_thumbnail.jpg';
import salesman_thumbnail from '@/assets/salesman2.avif';
import doakes_thumbnail from '@/assets/doakes.png';
import steve_thumbnail from '/media/projects/steve.jpg';
import brokegirls_thumbnail from '@/assets/brokegirls.jpg';
import jonsnow_thumbnail from '@/assets/JonSnow.png';

// ---- Lazy Desktop Video Card ----
// Only loads video source when card is near viewport
interface LazyDesktopVideoProps {
  video: { id: number; title: string; category: string; thumbnail: string; videoUrl: string; thumbnailClassName?: string; };
  index: number;
}

const LazyDesktopVideo: React.FC<LazyDesktopVideoProps> = ({ video, index }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const waitingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isNearViewport, setIsNearViewport] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Lazy-load: only set the video source when the card is near the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Debounced waiting/buffering handler to prevent spinner flicker
  const handleWaiting = useCallback(() => {
    if (waitingTimerRef.current) clearTimeout(waitingTimerRef.current);
    waitingTimerRef.current = setTimeout(() => setLoading(true), 300);
  }, []);

  const handlePlaying = useCallback(() => {
    if (waitingTimerRef.current) {
      clearTimeout(waitingTimerRef.current);
      waitingTimerRef.current = null;
    }
    setLoading(false);
  }, []);

  const handleCanPlay = useCallback(() => {
    if (waitingTimerRef.current) {
      clearTimeout(waitingTimerRef.current);
      waitingTimerRef.current = null;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (waitingTimerRef.current) clearTimeout(waitingTimerRef.current);
    };
  }, []);

  const handlePlay = useCallback(() => {
    setPlaying(true);
    setEnded(false);
    setLoading(true);
  }, []);

  const handlePause = useCallback(() => {
    setPlaying(false);
    setLoading(false);
  }, []);

  const handleEnded = useCallback(() => {
    setPlaying(false);
    setEnded(true);
    setLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setPlaying(false);
    setLoading(false);
    console.error(`Error loading video: ${video.title}`);
  }, [video.title]);

  const handleClickPlay = useCallback(() => {
    const el = videoRef.current;
    if (el) el.play();
  }, []);

  const showOverlay = ended || (!playing && !hovered);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isNearViewport ? (
        <video
          ref={videoRef}
          controls
          poster={video.thumbnail || undefined}
          className="w-full h-full object-contain rounded-md"
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onCanPlay={handleCanPlay}
          onError={handleError}
          onWaiting={handleWaiting}
          onPlaying={handlePlaying}
          preload="none"
          playsInline
          muted
          style={{
            backgroundColor: 'black',
            imageRendering: 'auto',
            willChange: 'auto',
          }}
        >
          <source src={video.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        // Before intersection: show only poster image, no video element at all
        <img
          src={video.thumbnail}
          alt={video.title}
          className={`w-full h-full object-cover ${video.thumbnailClassName || 'object-center'} rounded-md`}
          style={{ backgroundColor: 'black' }}
        />
      )}

      {/* Buffering spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      )}

      {/* Thumbnail overlay + play button */}
      {isNearViewport && showOverlay && (
        <>
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`absolute inset-0 w-full h-full object-cover ${video.thumbnailClassName || 'object-center'} rounded-md pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity`}
            style={{ zIndex: 2, backgroundColor: 'black' }}
          />
          <button
            className="absolute inset-0 flex items-center justify-center w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ zIndex: 3 }}
            onClick={handleClickPlay}
            tabIndex={0}
            aria-label="Play"
          >
            <Play className="h-14 w-14 text-white drop-shadow-lg bg-primary/80 backdrop-blur-sm rounded-full p-3 hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Title on hover */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent text-white pointer-events-none rounded-t-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[20]">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2 font-heading">
          {video.title}
        </h3>
      </div>
    </div>
  );
};

// ---- Main Page ----
const ContentCreation = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const isMobile = useIsMobile();

  // Video URLs - hosted on AWS S3 for reliable delivery
  // S3 bucket: aryan-portfolio-videos in ap-south-1
  const baseUrl = 'https://aryan-portfolio-videos.s3.ap-south-1.amazonaws.com';

  const MoonFinal = `${baseUrl}/MoonFinal.mp4`;
  const Wolverine = `${baseUrl}/WolverineFinal.mp4`;
  const ironman_edit = `${baseUrl}/Ironman-edit.mp4`;
  const spiderman_edit = `${baseUrl}/Spiderman_edit.mp4`;
  const salesman = `${baseUrl}/Salesman2.mp4`;
  const steve = `${baseUrl}/steve.mp4`;
  const spiderxdoakes = `${baseUrl}/finalspiderxdoakes_optimized.mp4`;
  const samplebetter = `${baseUrl}/sample%20bettermp4.mp4`;
  const jonsnow = `${baseUrl}/Jon%20Snow%20-%20Funk%20Criminal.mp4`;

  const filters = [
    { id: 'all', label: 'All Content' },
    // { id: 'reels', label: 'Reels' },
    { id: 'shorts', label: 'Shorts' },
    { id: 'edits', label: 'Edits' }
  ];

  const videos = [
    {
      id: 1,
      title: "Steve Edit",
      category: "edits",
      thumbnail: steve_thumbnail,
      videoUrl: steve
    },
    {
      id: 9,
      title: "Jon Snow Edit",
      category: "edits",
      thumbnail: jonsnow_thumbnail,
      videoUrl: jonsnow,
      thumbnailClassName: "object-[20%_center]"
    },
    {
      id: 7,
      title: "Spider x Doakes Edit",
      category: "edits",
      thumbnail: doakes_thumbnail,
      videoUrl: spiderxdoakes
    },
    {
      id: 8,
      title: "2 Broke Girls Edit",
      category: "edits",
      thumbnail: brokegirls_thumbnail,
      videoUrl: samplebetter
    },
    {
      id: 5,
      title: "Spiderman Edit",
      category: "edits",
      thumbnail: spiderman_thumbnail,
      videoUrl: spiderman_edit
    },
    {
      id: 2,
      title: "How did our Moon Formed",
      category: "shorts",
      thumbnail: moon_thumbnail,
      videoUrl: MoonFinal
    },
    {
      id: 3,
      title: "Can Wolverine Survive a Black Hole",
      category: "shorts",
      thumbnail: wolverine_thumbnail,
      videoUrl: Wolverine
    },
    {
      id: 4,
      title: "IronMan Edit ",
      category: "edits",
      thumbnail: ironman_thumbnail,
      videoUrl: ironman_edit
    },
    {
      id: 6,
      title: "Salesman Edit",
      category: "edits",
      thumbnail: salesman_thumbnail,
      videoUrl: salesman
    },
  ];

  const filteredVideos = activeFilter === 'all'
    ? videos
    : videos.filter(video => video.category === activeFilter);

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-20">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-primary/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[30%] right-[20%] w-[30%] h-[30%] bg-secondary/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '5s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 relative z-10 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-primary tracking-tight">
            Video Editing & Content Creation
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Showcasing my creative work in video editing, content creation, and visual storytelling
            across various platforms and formats.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 animate-fade-in px-4">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className={`transition-all duration-300 rounded-full px-4 sm:px-6 touch-target text-sm sm:text-base ${
                activeFilter === filter.id
                  ? 'shadow-glow'
                  : 'glass border-white/10 hover:bg-white/10'
                }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Video Grid - Mobile Optimized */}
        <div className={`grid gap-3 sm:gap-4 ${
          isMobile
            ? 'grid-cols-2 xs:grid-cols-2'
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
          }`}>
          {filteredVideos.map((video, index) => (
            <Card
              key={video.id}
              className="glass border-white/10 hover:bg-white/5 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up aspect-[9/16] relative overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-0 relative w-full h-full">
                {isMobile ? (
                  <LazyVideo
                    src={video.videoUrl}
                    poster={video.thumbnail}
                    title={video.title}
                    className="w-full h-full"
                    posterClassName={video.thumbnailClassName}
                    aspectRatio="vertical"
                    onError={(error) => console.error('Video error:', error)}
                  />
                ) : (
                  <LazyDesktopVideo video={video} index={index} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20 animate-fade-in">
          <h3 className="text-2xl font-bold mb-4 font-heading">Ready to create something amazing?</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Let's collaborate on your next video project or content creation campaign.
          </p>
          <Button variant="default" size="lg" className="shadow-glow hover:scale-105 transition-transform rounded-full px-8">
            Let's Work Together
          </Button>
        </div>
      </div>

      {/* Debug Panel for Development (only on mobile) */}
      {isMobile && import.meta.env.DEV && (
        <MobileDebugPanel />
      )}
    </div>
  );
};

export default ContentCreation;
