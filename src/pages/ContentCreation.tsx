import { useState, useRef, useEffect, useCallback } from 'react';
import { Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import LazyVideo from '@/components/LazyVideo';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import TextSplit from '@/components/TextSplit';
import MagneticButton from '@/components/MagneticButton';
import { filterItem } from '@/lib/animations';

import wolverine_thumbnail from '@/assets/wolverine_thumbnail.png';
import moon_thumbnail from '@/assets/moon_thumbnail.png';
import ironman_thumbnail from '@/assets/Ironman.jpg';
import spiderman_thumbnail from '@/assets/spiderman_thumbnail.jpg';
import salesman_thumbnail from '@/assets/salesman2.avif';
import doakes_thumbnail from '@/assets/doakes.png';
import steve_thumbnail from '/media/projects/steve.jpg';
import brokegirls_thumbnail from '@/assets/brokegirls.jpg';
import jonsnow_thumbnail from '@/assets/JonSnow.png';
import soldierboy_thumbnail from '@/assets/Soldierboy.png';
import butcher_thumbnail from '@/assets/butcher.jpg';
import spiderman_comic_thumbnail from '@/assets/Spiderman_comic.jpg';

interface LazyDesktopVideoProps {
  video: { id: number; title: string; category: string; thumbnail: string; videoUrl: string; thumbnailClassName?: string; };
  index: number;
}

const LazyDesktopVideo: React.FC<LazyDesktopVideoProps> = ({ video }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const waitingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isNearViewport, setIsNearViewport] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsNearViewport(true); observer.disconnect(); } },
      { rootMargin: '200px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleWaiting = useCallback(() => {
    if (waitingTimerRef.current) clearTimeout(waitingTimerRef.current);
    waitingTimerRef.current = setTimeout(() => setLoading(true), 300);
  }, []);
  const clearWaiting = useCallback(() => {
    if (waitingTimerRef.current) { clearTimeout(waitingTimerRef.current); waitingTimerRef.current = null; }
    setLoading(false);
  }, []);

  useEffect(() => () => { if (waitingTimerRef.current) clearTimeout(waitingTimerRef.current); }, []);

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
          className="w-full h-full object-contain rounded-xl"
          onPlay={() => { setPlaying(true); setEnded(false); setLoading(true); }}
          onPause={() => { setPlaying(false); setLoading(false); }}
          onEnded={() => { setPlaying(false); setEnded(true); setLoading(false); }}
          onCanPlay={clearWaiting}
          onError={() => { setPlaying(false); setLoading(false); }}
          onWaiting={handleWaiting}
          onPlaying={clearWaiting}
          preload="none" playsInline muted
          style={{ backgroundColor: 'black' }}
        >
          <source src={video.videoUrl} type="video/mp4" />
        </video>
      ) : (
        <img src={video.thumbnail} alt={video.title} className={`w-full h-full object-cover ${video.thumbnailClassName || 'object-center'} rounded-xl`} style={{ backgroundColor: 'black' }} />
      )}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      )}

      {isNearViewport && showOverlay && (
        <>
          <img src={video.thumbnail} alt={video.title} className={`absolute inset-0 w-full h-full object-cover ${video.thumbnailClassName || 'object-center'} rounded-xl pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity`} style={{ zIndex: 2, backgroundColor: 'black' }} />
          <button className="absolute inset-0 flex items-center justify-center w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ zIndex: 3 }} onClick={() => videoRef.current?.play()} tabIndex={0} aria-label="Play">
            <Play className="h-14 w-14 text-white drop-shadow-lg bg-primary/80 backdrop-blur-sm rounded-full p-3 hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white pointer-events-none rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[20]">
        <h3 className="font-semibold text-sm font-heading">{video.title}</h3>
      </div>
    </div>
  );
};

const ContentCreation = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const isMobile = useIsMobile();

  const baseUrl = 'https://portfolio-videos.sgp1.digitaloceanspaces.com';

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'shorts', label: 'Shorts' },
    { id: 'edits', label: 'Edits' }
  ];

  const videos = [
    { id: 0, title: "Cartoons Finale", category: "edits", thumbnail: spiderman_comic_thumbnail, videoUrl: `${baseUrl}/cartoons_finale.mp4` },
    { id: 1, title: "Steve Edit", category: "edits", thumbnail: steve_thumbnail, videoUrl: `${baseUrl}/steve.mp4` },
    { id: 9, title: "Jon Snow Edit", category: "edits", thumbnail: jonsnow_thumbnail, videoUrl: `${baseUrl}/Jon%20Snow%20-%20Funk%20Criminal.mp4`, thumbnailClassName: "object-[26%_center]" },
    { id: 11, title: "William Butcher Edit", category: "edits", thumbnail: butcher_thumbnail, videoUrl: `${baseUrl}/William_Butcher_Final.mp4` },
    { id: 12, title: "Spiderman X Funk Edit", category: "edits", thumbnail: spiderman_comic_thumbnail, videoUrl: `${baseUrl}/SpidermanXFunk_FINALs.mp4` },
    { id: 10, title: "Soldier Boy Edit", category: "edits", thumbnail: soldierboy_thumbnail, videoUrl: `${baseUrl}/SoldierBoy_bestCC.mp4`, thumbnailClassName: "object-[center_20%]" },
    { id: 7, title: "Spider x Doakes Edit", category: "edits", thumbnail: doakes_thumbnail, videoUrl: `${baseUrl}/finalspiderxdoakes_optimized.mp4` },
    { id: 8, title: "2 Broke Girls Edit", category: "edits", thumbnail: brokegirls_thumbnail, videoUrl: `${baseUrl}/sample%20bettermp4.mp4` },
    { id: 5, title: "Spiderman Edit", category: "edits", thumbnail: spiderman_thumbnail, videoUrl: `${baseUrl}/Spiderman_edit.mp4` },
    { id: 2, title: "How did our Moon Form?", category: "shorts", thumbnail: moon_thumbnail, videoUrl: `${baseUrl}/MoonFinal.mp4` },
    { id: 3, title: "Can Wolverine Survive a Black Hole?", category: "shorts", thumbnail: wolverine_thumbnail, videoUrl: `${baseUrl}/WolverineFinal.mp4` },
    { id: 4, title: "IronMan Edit", category: "edits", thumbnail: ironman_thumbnail, videoUrl: `${baseUrl}/Ironman-edit.mp4` },
    { id: 6, title: "Salesman Edit", category: "edits", thumbnail: salesman_thumbnail, videoUrl: `${baseUrl}/Salesman2.mp4` },
  ];

  const filteredVideos = activeFilter === 'all' ? videos : videos.filter(v => v.category === activeFilter);

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-20">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-[hsl(263_50%_15%/0.3)] rounded-full blur-[80px] will-change-transform" animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-[hsl(187_50%_15%/0.2)] rounded-full blur-[60px] will-change-transform" animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut', delay: 2 }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 relative z-10 max-w-7xl">
        {/* Header */}
        <div className="mb-16">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-gradient-to-r from-primary to-transparent" />
              <span className="text-primary font-mono text-sm uppercase tracking-widest">Creative Work</span>
            </div>
          </ScrollReveal>
          <TextSplit text="Video Edits" as="h1" className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6" delay={0.1} />
          <ScrollReveal delay={0.3}>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Cinematic edits, visual storytelling, and creative content across platforms.
            </p>
          </ScrollReveal>
        </div>

        {/* Filters */}
        <ScrollReveal className="mb-10">
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-white bg-white/[0.03] hover:bg-white/[0.06]'
                }`}
              >
                {activeFilter === filter.id && (
                  <motion.div
                    layoutId="contentFilter"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {filter.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Grid */}
        <motion.div
          layout
          className={`grid gap-4 ${
            isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                layout
                variants={filterItem}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <TiltCard tiltAmount={5}>
                  <motion.div
                    className="glass rounded-2xl overflow-hidden group aspect-[9/16] relative border-gradient hover:shadow-glow transition-shadow duration-300"
                    whileHover={{ y: -6, boxShadow: '0 0 35px hsl(263 70% 58% / 0.12)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
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
                  </motion.div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <ScrollReveal className="mt-20 text-center">
          <h3 className="text-3xl font-bold font-heading mb-4">Want to collaborate?</h3>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Let's create cinematic content for your next project.
          </p>
          <MagneticButton
            as="a"
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-semibold shadow-glow hover:shadow-[0_0_60px_hsl(263_70%_58%/0.5)] transition-all duration-300"
          >
            Let's Work Together
          </MagneticButton>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default ContentCreation;
