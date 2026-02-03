import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import profilePic from '@/assets/new-profile.jpeg';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/tech-projects', label: 'Tech Projects' },
    { path: '/content-creation', label: 'Content Creation' },
    { path: '/ai-chat', label: 'AI Chat' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border" style={{ paddingTop: 'max(env(safe-area-inset-top), 0px)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent touch-target">
            <img
              src={profilePic}
              alt="Aryan Aligeti"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-primary/30"
            />
            <span className="hidden xs:inline">Aryan Aligeti</span>
            <span className="xs:hidden">AA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-all duration-300 hover:text-primary relative text-sm lg:text-base touch-target ${location.pathname === item.path
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-primary" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden touch-target min-w-[44px] min-h-[44px]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-card/95 backdrop-blur-lg rounded-lg mt-2 mb-2 border border-border animate-fade-in overflow-hidden">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block py-3 px-3 rounded-lg transition-all duration-300 hover:text-primary hover:bg-white/5 touch-target ${location.pathname === item.path
                    ? 'text-primary font-medium bg-white/5'
                    : 'text-muted-foreground'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;