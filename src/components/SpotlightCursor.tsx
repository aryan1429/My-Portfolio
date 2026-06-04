import { useEffect, useRef, useCallback } from 'react';

const SpotlightCursor = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const visible = useRef(false);

  const updateVisibility = useCallback((show: boolean) => {
    if (visible.current === show) return;
    visible.current = show;
    if (containerRef.current) {
      containerRef.current.style.opacity = show ? '1' : '0';
    }
  }, []);

  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return;

    const move = (e: MouseEvent) => {
      spot.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
      updateVisibility(true);
    };
    const leave = () => updateVisibility(false);
    const enter = () => updateVisibility(true);

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
    };
  }, [updateVisibility]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
      style={{ opacity: 0, transition: 'opacity 0.3s' }}
    >
      <div
        ref={spotRef}
        className="absolute w-[600px] h-[600px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, rgba(6,182,212,0.03) 40%, transparent 70%)',
        }}
      />
    </div>
  );
};

export default SpotlightCursor;
