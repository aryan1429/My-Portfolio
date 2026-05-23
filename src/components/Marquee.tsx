import { motion } from 'framer-motion';

interface MarqueeProps {
  items: string[];
  speed?: number;
  className?: string;
  separator?: string;
  reverse?: boolean;
}

const Marquee = ({ items, speed = 30, className = '', separator = '•', reverse = false }: MarqueeProps) => {
  const content = items.join(` ${separator} `) + ` ${separator} `;
  const doubled = content + content;

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-block"
        animate={{ x: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        <span className="inline-block">{doubled}</span>
      </motion.div>
    </div>
  );
};

export default Marquee;
