import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface TextSplitProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  charDelay?: number;
}

const TextSplit = ({ text, className = '', delay = 0, as: Tag = 'h1', charDelay = 0.03 }: TextSplitProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px 0px' });

  const words = text.split(' ');

  return (
    <Tag ref={ref} className={`${className}`} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.25em] overflow-hidden">
          {word.split('').map((char, ci) => {
            const totalIdx = words.slice(0, wi).join(' ').length + ci;
            return (
              <motion.span
                key={ci}
                className="inline-block"
                initial={{ y: '120%', rotateX: -80 }}
                animate={isInView ? { y: 0, rotateX: 0 } : { y: '120%', rotateX: -80 }}
                transition={{
                  duration: 0.6,
                  delay: delay + totalIdx * charDelay,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: 'bottom', display: 'inline-block' }}
                aria-hidden
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
};

export default TextSplit;
