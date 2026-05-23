import { useRef, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

interface SpinCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  hintRock?: boolean;
}

const SpinCard = ({ front, back, className = '', hintRock = false }: SpinCardProps) => {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drag = useRef({
    startX: 0, startY: 0,
    startRotX: 0, startRotY: 0,
    lastX: 0, lastY: 0, lastTime: 0,
    velX: 0, velY: 0,
    moved: false, pid: -1,
  });

  useEffect(() => {
    if (!hintRock) return;
    const t = setTimeout(() => {
      animate(rotateY, [0, 15, -10, 4, 0], { duration: 1.6, ease: 'easeInOut' });
      animate(rotateX, [0, -8, 5, -2, 0], { duration: 1.6, ease: 'easeInOut' });
    }, 2000);
    return () => clearTimeout(t);
  }, [hintRock, rotateX, rotateY]);

  useEffect(() => {
    return () => { if (clickTimer.current) clearTimeout(clickTimer.current); };
  }, []);

  const onDown = (e: React.PointerEvent) => {
    const d = drag.current;
    d.startX = e.clientX;
    d.startY = e.clientY;
    d.startRotX = rotateX.get();
    d.startRotY = rotateY.get();
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.lastTime = performance.now();
    d.velX = 0;
    d.velY = 0;
    d.moved = false;
    d.pid = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d.pid < 0) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true;
    const now = performance.now();
    const dt = now - d.lastTime;
    if (dt > 0) {
      d.velX = ((e.clientX - d.lastX) / dt) * 16;
      d.velY = ((e.clientY - d.lastY) / dt) * 16;
    }
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.lastTime = now;
    rotateY.set(d.startRotY + dx * 0.5);
    rotateX.set(d.startRotX - dy * 0.5);
  };

  const onUp = () => {
    const d = drag.current;
    if (d.pid < 0) return;

    if (!d.moved) {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
        const spring = { type: 'spring' as const, stiffness: 200, damping: 25 };
        animate(rotateY, 0, spring);
        animate(rotateX, 0, spring);
      } else {
        clickTimer.current = setTimeout(() => {
          clickTimer.current = null;
          animate(rotateY, rotateY.get() + 180, {
            type: 'spring', stiffness: 200, damping: 25,
          });
        }, 250);
      }
    } else {
      animate(rotateY, rotateY.get() + d.velX * 12, {
        type: 'spring', stiffness: 30, damping: 15,
      });
      animate(rotateX, rotateX.get() - d.velY * 12, {
        type: 'spring', stiffness: 30, damping: 15,
      });
    }
    d.pid = -1;
  };

  const onLostCapture = () => {
    drag.current.pid = -1;
  };

  return (
    <div className={className} style={{ perspective: 1000 }}>
      <motion.div
        className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', touchAction: 'none' }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onLostPointerCapture={onLostCapture}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
};

export default SpinCard;
