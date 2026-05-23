import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import profilePic from '@/assets/new-profile.jpeg';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location.pathname]);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/tech-projects', label: 'Projects' },
    { path: '/content-creation', label: 'Content' },
    { path: '/ai-chat', label: 'AI Chat' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 0px)' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-3">
        <div
          className={`flex justify-between items-center h-14 px-6 rounded-2xl transition-all duration-500 ${
            scrolled
              ? 'bg-[hsl(250_25%_6%/0.85)] backdrop-blur-xl border border-white/[0.06] shadow-lg'
              : 'bg-transparent'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-bold touch-target group">
            <div className="relative">
              <img
                src={profilePic}
                alt="Aryan Aligeti"
                className="w-8 h-8 rounded-lg object-cover border border-white/10 group-hover:border-primary/40 transition-colors"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[hsl(250_25%_6%)]" />
            </div>
            <span className="text-gradient text-lg hidden sm:block">Aryan</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 bg-white/[0.08] rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden touch-target min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-white/[0.05] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden mt-2 bg-[hsl(250_25%_6%/0.95)] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden shadow-xl"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-3 space-y-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                  >
                    <Link
                      to={item.path}
                      className={`block py-3 px-4 rounded-xl transition-all duration-200 touch-target text-sm font-medium ${
                        location.pathname === item.path
                          ? 'text-white bg-white/[0.06]'
                          : 'text-muted-foreground hover:text-white hover:bg-white/[0.03]'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
