import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import Navigation from "./components/Navigation";
import BottomNavigation from "./components/BottomNavigation";
import SpotlightCursor from "./components/SpotlightCursor";
import Particles from "./components/Particles";
import AnimatedPage from "./components/AnimatedPage";
import Index from "./pages/Index";

const TechProjects = lazy(() => import("./pages/TechProjects"));
const ContentCreation = lazy(() => import("./pages/ContentCreation"));
const Contact = lazy(() => import("./pages/Contact"));
const AIChat = lazy(() => import("./pages/AIChat"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Index /></AnimatedPage>} />
        <Route path="/tech-projects" element={<AnimatedPage><Suspense><TechProjects /></Suspense></AnimatedPage>} />
        <Route path="/content-creation" element={<AnimatedPage><Suspense><ContentCreation /></Suspense></AnimatedPage>} />
        <Route path="/ai-chat" element={<AnimatedPage><Suspense><AIChat /></Suspense></AnimatedPage>} />
        <Route path="/contact" element={<AnimatedPage><Suspense><Contact /></Suspense></AnimatedPage>} />
        <Route path="*" element={<AnimatedPage><Suspense><NotFound /></Suspense></AnimatedPage>} />
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
