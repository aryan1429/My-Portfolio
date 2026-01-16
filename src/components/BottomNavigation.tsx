import { Link, useLocation } from 'react-router-dom';
import { Home, Code, Video, MessageCircle, Mail } from 'lucide-react';

const BottomNavigation = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/tech-projects', label: 'Tech', icon: Code },
        { path: '/content-creation', label: 'Content', icon: Video },
        { path: '/ai-chat', label: 'AI Chat', icon: MessageCircle },
        { path: '/contact', label: 'Contact', icon: Mail }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all duration-300 ${isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-300`}>
                                <Icon className={`h-5 w-5 ${isActive ? 'drop-shadow-glow' : ''}`} />
                                {isActive && (
                                    <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md -z-10" />
                                )}
                            </div>
                            <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : ''}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNavigation;
