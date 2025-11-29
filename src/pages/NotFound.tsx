import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="text-center relative z-10 p-8 glass rounded-2xl border-white/10 max-w-lg w-full mx-4 animate-fade-in-up">
        <h1 className="text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-primary font-heading">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="inline-block">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium shadow-glow hover:scale-105 transition-transform">
            Return to Home
          </button>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
