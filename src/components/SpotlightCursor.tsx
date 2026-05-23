import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SpotlightCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
    };
  }, [visible]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          left: pos.x - 300,
          top: pos.y - 300,
          background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, rgba(6,182,212,0.03) 40%, transparent 70%)',
        }}
      />
    </motion.div>
  );
};

export default SpotlightCursor;
