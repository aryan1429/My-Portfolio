import { useState } from 'react';
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

const ContentCreation = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const isMobile = useIsMobile();

  // Video URLs using Google Cloud Storage
  const baseUrl = 'https://storage.googleapis.com/my-portfolio-69';
  const MoonFinal = `${baseUrl}/projects/MoonFinal.mp4`;
  const Wolverine = `${baseUrl}/projects/WolverineFinal.mp4`;
  const ironman_edit = `${baseUrl}/projects/Ironman-edit.mp4`;
  const spiderman_edit = `${baseUrl}/projects/Spiderman_edit.mp4`;
  const salesman = `${baseUrl}/projects/Salesman2.mp4`;

  const filters = [
    { id: 'all', label: 'All Content' },
   // { id: 'reels', label: 'Reels' },
    { id: 'shorts', label: 'Shorts' },
    { id: 'edits', label: 'Edits' }
  ];

  const videos = [
    {
      id: 1,
      title: "How did our Moon Formed",
      category: "shorts",
      thumbnail: moon_thumbnail,
      videoUrl: MoonFinal
    },
    {
      id: 2,
      title: "Can Wolverine Survive a Black Hole",
      category: "shorts",
      thumbnail: wolverine_thumbnail,
      videoUrl: Wolverine
    },
    {
      id: 3,
      title: "IronMan Edit ",
      category: "edits",
      thumbnail: ironman_thumbnail,
      videoUrl: ironman_edit
    },
    {
      id: 4,
      title: "Spiderman Edit",
      category: "edits",
      thumbnail: spiderman_thumbnail,
      videoUrl: spiderman_edit
    },
    {
      id: 5,
      title: "Salesman Edit",
      category: "edits",
      thumbnail: salesman_thumbnail,
      videoUrl: salesman
    },
  ];

  const filteredVideos = activeFilter === 'all' 
    ? videos 
    : videos.filter(video => video.category === activeFilter);

  // --- NEW STATE FOR VIDEO THUMBNAIL LOGIC ---
  const [videoStates, setVideoStates] = useState(
    videos.map(() => ({ playing: false, hovered: false, ended: false, loading: false }))
  );

  const handlePlay = (idx: number) => {
    setVideoStates(states =>
      states.map((s, i) =>
        i === idx ? { ...s, playing: true, ended: false, loading: true } : s
      )
    );
  };

  const handlePause = (idx: number) => {
    setVideoStates(states =>
      states.map((s, i) =>
        i === idx ? { ...s, playing: false, loading: false } : s
      )
    );
  };

  const handleEnded = (idx: number) => {
    setVideoStates(states =>
      states.map((s, i) =>
        i === idx ? { ...s, playing: false, ended: true, loading: false } : s
      )
    );
  };

  const handleCanPlay = (idx: number) => {
    setVideoStates(states =>
      states.map((s, i) =>
        i === idx ? { ...s, loading: false } : s
      )
    );
  };

  const handleError = (idx: number) => {
    setVideoStates(states =>
      states.map((s, i) =>
        i === idx ? { ...s, playing: false, loading: false } : s
      )
    );
    console.error(`Error loading video ${idx}: ${videos[idx].title}`);
  };

  const handleLoadStart = (idx: number) => {
    setVideoStates(states =>
      states.map((s, i) =>
        i === idx ? { ...s, loading: true } : s
      )
    );
  };

  const handleLoadedData = (idx: number) => {
    setVideoStates(states =>
      states.map((s, i) =>
        i === idx ? { ...s, loading: false } : s
      )
    );
  };

  const handleWaiting = (idx: number) => {
    setVideoStates(states =>
      states.map((s, i) =>
        i === idx ? { ...s, loading: true } : s
      )
    );
  };

  const handlePlaying = (idx: number) => {
    setVideoStates(states =>
      states.map((s, i) =>
        i === idx ? { ...s, loading: false } : s
      )
    );
  };

  const handleMouseEnter = (idx: number) => {
    setVideoStates(states =>
      states.map((s, i) =>
        i === idx ? { ...s, hovered: true } : s
      )
    );
  };

  const handleMouseLeave = (idx: number) => {
    setVideoStates(states =>
      states.map((s, i) =>
        i === idx ? { ...s, hovered: false } : s
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-hero pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Video Editing & Content Creation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing my creative work in video editing, content creation, and visual storytelling 
            across various platforms and formats.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className="transition-all duration-300"
            >
              <Filter className="h-4 w-4 mr-2" />
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Video Grid - Mobile Optimized */}
        <div className={`grid gap-3 ${
          isMobile 
            ? 'grid-cols-2 sm:grid-cols-2' 
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
        }`}>
          {filteredVideos.map((video, index) => {
            const originalIdx = videos.findIndex(v => v.id === video.id);

            return (
              <Card 
                key={video.id}
                className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up aspect-[9/16] relative overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-0 relative w-full h-full">
                  {isMobile ? (
                    // Use lazy loading component for mobile devices
                    <LazyVideo
                      src={video.videoUrl}
                      poster={video.thumbnail}
                      title={video.title}
                      className="w-full h-full"
                      aspectRatio="vertical"
                      onError={(error) => console.error('Video error:', error)}
                    />
                  ) : (
                    // Keep existing video implementation for desktop
                    <div className="absolute inset-0 w-full h-full">
                      <video 
                        src={video.videoUrl} 
                        controls 
                        poster={video.thumbnail || undefined}
                        className="w-full h-full object-cover rounded-md"
                        onPlay={() => handlePlay(originalIdx)}
                        onPause={() => handlePause(originalIdx)}
                        onEnded={() => handleEnded(originalIdx)}
                        onCanPlay={() => handleCanPlay(originalIdx)}
                        onError={() => handleError(originalIdx)}
                        onLoadStart={() => handleLoadStart(originalIdx)}
                        onLoadedData={() => handleLoadedData(originalIdx)}
                        onWaiting={() => handleWaiting(originalIdx)}
                        onPlaying={() => handlePlaying(originalIdx)}
                        preload="metadata"
                        playsInline
                        muted
                        style={{ 
                          backgroundColor: "black",
                          imageRendering: "auto",
                          willChange: "transform"
                        }}
                      >
                        <source src={video.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      {videoStates[originalIdx]?.loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                      {((videoStates[originalIdx]?.ended || (!videoStates[originalIdx]?.playing && !videoStates[originalIdx]?.hovered))) && (
                        <>
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="absolute inset-0 w-full h-full object-cover object-center rounded-md pointer-events-none"
                            style={{ zIndex: 2, backgroundColor: "black" }}
                          />
                          <button
                            className="absolute inset-0 flex items-center justify-center w-full h-full"
                            style={{ zIndex: 3 }}
                            onClick={() => {
                              const videoEls = document.querySelectorAll('video');
                              const el = videoEls[originalIdx] as HTMLVideoElement;
                              if (el) el.play();
                            }}
                            tabIndex={0}
                            aria-label="Play"
                          >
                            <Play className="h-12 w-12 text-white drop-shadow-lg bg-black/40 rounded-full p-2" />
                          </button>
                        </>
                      )}
                      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 to-transparent text-white pointer-events-none rounded-t-md">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in">
          <h3 className="text-2xl font-bold mb-4">Ready to create something amazing?</h3>
          <p className="text-muted-foreground mb-6">
            Let's collaborate on your next video project or content creation campaign.
          </p>
          <Button variant="default" size="lg" className="shadow-glow">
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
