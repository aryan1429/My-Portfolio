import { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import SpinCard from '@/components/SpinCard';
import ScrollReveal from '@/components/ScrollReveal';

import wolverine_thumbnail from '@/assets/wolverine_thumbnail.png';
import ironman_thumbnail from '@/assets/Ironman.jpg';
import spiderman_thumbnail from '@/assets/spiderman_thumbnail.jpg';
import steve_thumbnail from '/media/projects/steve.jpg';
import jonsnow_thumbnail from '@/assets/JonSnow.png';
import soldierboy_thumbnail from '@/assets/Soldierboy.png';
import butcher_thumbnail from '@/assets/butcher.jpg';
import spiderman_comic_thumbnail from '@/assets/Spiderman_comic.jpg';

const BASE_URL = 'https://portfolio-videos.sgp1.digitaloceanspaces.com';

const ALL_VIDEOS = [
  { title: 'Steve Edit', thumbnail: steve_thumbnail, url: `${BASE_URL}/steve.mp4` },
  { title: 'Jon Snow', thumbnail: jonsnow_thumbnail, url: `${BASE_URL}/Jon%20Snow%20-%20Funk%20Criminal.mp4` },
  { title: 'William Butcher', thumbnail: butcher_thumbnail, url: `${BASE_URL}/William_Butcher_Final.mp4` },
  { title: 'Spiderman X Funk', thumbnail: spiderman_comic_thumbnail, url: `${BASE_URL}/SpidermanXFunk_FINALs.mp4` },
  { title: 'Soldier Boy', thumbnail: soldierboy_thumbnail, url: `${BASE_URL}/SoldierBoy_bestCC.mp4` },
  { title: 'Spiderman Edit', thumbnail: spiderman_thumbnail, url: `${BASE_URL}/Spiderman_edit.mp4` },
  { title: 'Wolverine', thumbnail: wolverine_thumbnail, url: `${BASE_URL}/WolverineFinal.mp4` },
  { title: 'IronMan Edit', thumbnail: ironman_thumbnail, url: `${BASE_URL}/Ironman-edit.mp4` },
];

const FLOAT_CONFIGS = [
  { rotate: -4 },
  { rotate: 2 },
  { rotate: -3 },
];

const VideoSpinCard = ({
  video,
  index,
}: {
  video: (typeof ALL_VIDEOS)[0];
  index: number;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const config = FLOAT_CONFIGS[index];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const vid = videoRef.current;
        if (!vid) return;
        if (entry.isIntersecting) {
          if (!vid.src) vid.src = video.url;
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [video.url]);

  const front = (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-black relative">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={video.thumbnail}
        muted
        loop
        playsInline
        preload="none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      <div className="absolute bottom-3 left-4 right-4">
        <p className="text-xs text-white/80 font-medium truncate">{video.title}</p>
      </div>
    </div>
  );

  const back = (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-black relative">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-full object-cover opacity-50"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-white font-heading font-bold text-base sm:text-lg mb-1">
            {video.title}
          </p>
          <p className="text-white/50 text-xs">Drag to spin</p>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40, rotate: config.rotate }}
      whileInView={{ opacity: 1, y: 0, rotate: config.rotate }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className={`anim-card-float-${index}`}>
        <SpinCard
          front={front}
          back={back}
          className="w-36 h-60 sm:w-44 sm:h-72 md:w-48 md:h-80"
          hintRock={index === 1}
        />
      </div>
    </motion.div>
  );
};

const FloatingVideos = () => {
  const picked = useMemo(() => {
    const shuffled = [...ALL_VIDEOS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, []);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-14">
            <div className="w-12 h-[1px] bg-gradient-to-r from-primary to-transparent" />
            <span className="text-primary font-mono text-sm uppercase tracking-widest">
              My Edits
            </span>
          </div>
        </ScrollReveal>

        <div className="flex justify-center items-end gap-6 sm:gap-10 md:gap-14">
          {picked.map((video, i) => (
            <VideoSpinCard key={video.title} video={video} index={i} />
          ))}
        </div>

        <ScrollReveal className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Click or drag to spin the cards
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FloatingVideos;
