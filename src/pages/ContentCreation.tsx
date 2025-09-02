import { useState } from 'react';
import { Play, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Video URLs using Google Cloud Storage
import gcpStorageService from '@/services/gcpStorageService';
const MoonFinal = gcpStorageService.generateVideoUrl('projects/MoonFinal.mp4');
const Wolverine = gcpStorageService.generateVideoUrl('projects/WolverineFinal.mp4');
const ironman_edit = gcpStorageService.generateVideoUrl('projects/Ironman-edit.mp4');
const spiderman_edit = gcpStorageService.generateVideoUrl('projects/Spiderman_edit.mp4');
const salesman = gcpStorageService.generateVideoUrl('projects/Salesman2.mp4');

// Import thumbnails
import wolverine_thumbnail from '@/assets/wolverine_thumbnail.png';
import moon_thumbnail from '@/assets/moon_thumbnail.png';
import ironman_thumbnail from '@/assets/Ironman.jpg';
import spiderman_thumbnail from '@/assets/spiderman_thumbnail.jpg';
import salesman_thumbnail from '@/assets/salesman2.avif';

const ContentCreation = () => {
  const [activeFilter, setActiveFilter] = useState('all');

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

        {/* Video Grid - Vertical format optimized for Reels/Shorts */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredVideos.map((video, index) => {
            const originalIdx = videos.findIndex(v => v.id === video.id);
            const state = videoStates[originalIdx];

            // Show thumbnail if: video ended OR (paused AND not hovered)
            const showThumbnail = state.ended || (!state.playing && !state.hovered);

            return (
              <Card 
                key={video.id}
                className="bg-gradient-card border-border hover:shadow-glow transition-all duration-500 hover:-translate-y-2 group animate-fade-in-up aspect-[9/16] relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => handleMouseEnter(originalIdx)}
                onMouseLeave={() => handleMouseLeave(originalIdx)}
              >
                <CardContent className="p-0 relative w-full h-full">
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
                      crossOrigin="anonymous"
                      style={{ 
                        backgroundColor: "black",
                        imageRendering: "auto",
                        willChange: "transform"
                      }}
                    >
                      <source src={video.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {state.loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                    {showThumbnail && (
                      <>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover object-center rounded-md pointer-events-none"
                          style={{ zIndex: 2, backgroundColor: "black" }}
                        />
                        {/* Play button always visible on thumbnail */}
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
                  </div>
                  <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent text-white pointer-events-none rounded-t-md">
                    <h3 className="font-semibold text-sm mb-1">
                      {video.title}
                    </h3>
                    {/*<p className="text-xs line-clamp-2">
                      {video.caption}
                    </p>*/}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Upload Placeholder */}
        <div className="mt-16 text-center animate-fade-in">
          <Card className="bg-gradient-card border-border border-dashed max-w-md mx-auto p-8">
            <CardContent className="text-center">
              <Play className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Add Your Videos</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Upload your vertical videos, reels, and content here
              </p>
              <Button variant="outline">
                Upload Video
              </Button>
            </CardContent>
          </Card>
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
    </div>
  );
};

export default ContentCreation;
