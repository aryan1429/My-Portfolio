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
      <div
        className="inline-block"
        style={{
          animation: `marquee-scroll ${speed}s linear infinite${reverse ? ' reverse' : ''}`,
        }}
      >
        <span className="inline-block">{doubled}</span>
      </div>
    </div>
  );
};

export default Marquee;
