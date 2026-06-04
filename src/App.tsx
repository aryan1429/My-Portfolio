import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navigation from "./components/Navigation";
import BottomNavigation from "./components/BottomNavigation";
import SpotlightCursor from "./components/SpotlightCursor";
import Particles from "./components/Particles";
import AnimatedPage from "./components/AnimatedPage";
import Index from "./pages/Index";
import TechProjects from "./pages/TechProjects";
import ContentCreation from "./pages/ContentCreation";
import Contact from "./pages/Contact";
import AIChat from "./pages/AIChat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Index /></AnimatedPage>} />
        <Route path="/tech-projects" element={<AnimatedPage><TechProjects /></AnimatedPage>} />
        <Route path="/content-creation" element={<AnimatedPage><ContentCreation /></AnimatedPage>} />
        <Route path="/ai-chat" element={<AnimatedPage><AIChat /></AnimatedPage>} />
        <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
        <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SpotlightCursor />
          <Particles count={25} />
          <Navigation />
          <div className="pb-20 md:pb-0" style={{ paddingBottom: 'max(calc(4rem + env(safe-area-inset-bottom)), 4rem)' }}>
            <AnimatedRoutes />
          </div>
          <BottomNavigation />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
