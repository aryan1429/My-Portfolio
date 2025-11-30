import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import TechProjects from "./pages/TechProjects";
import ContentCreation from "./pages/ContentCreation";
import Contact from "./pages/Contact";
import AIChat from "./pages/AIChat";
import NotFound from "./pages/NotFound";
import { ChatWidget } from "./components/ChatWidget";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tech-projects" element={<TechProjects />} />
            <Route path="/content-creation" element={<ContentCreation />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatWidget />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
