import { Link, useLocation } from 'react-router-dom';
import { Home, Code, Video, MessageCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/tech-projects', label: 'Projects', icon: Code },
    { path: '/content-creation', label: 'Content', icon: Video },
    { path: '/ai-chat', label: 'AI Chat', icon: MessageCircle },
    { path: '/contact', label: 'Contact', icon: Mail }
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.25rem)' }}
    >
      <div className="mx-3 mb-2">
        <div className="flex justify-around items-center h-16 px-2 bg-[hsl(250_25%_6%/0.9)] backdrop-blur-xl rounded-2xl border border-white/[0.06] shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center gap-1 flex-1 py-2 px-1 transition-all duration-300 touch-target ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavActive"
                      className="absolute -inset-3 bg-primary/15 rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
