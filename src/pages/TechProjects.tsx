import { useState, useRef, useCallback } from 'react';
import { Github, ExternalLink, Code, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import expense from '@/assets/expense.png';
import ironman from '@/assets/Ironman.jpg';
import textmood from '@/assets/textmood.png';
import sarcastic from '@/assets/mrsarcastic.png';
import snakebite from '@/assets/snakebitethumbnail.png';
import snakebite2 from '@/assets/snakebitethumbnail2.png';
import snakebite3 from '@/assets/snakebitethumbnail3.png';
import gym1 from '@/assets/gym1.png';
import gym2 from '@/assets/gym2.png';
import gym3 from '@/assets/gym3.png';
import gym4 from '@/assets/gym4.png';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  image: string;
}

interface CardRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const TechProjects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cardRect, setCardRect] = useState<CardRect | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const handleCardClick = useCallback((project: Project, cardElement: HTMLDivElement | null) => {
    if (cardElement) {
      const rect = cardElement.getBoundingClientRect();
      setCardRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
    setSelectedProject(project);
    setIsClosing(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedProject(null);
      setCardRect(null);
      setIsClosing(false);
    }, 400); // Match animation duration
  }, []);
  const projects = [
    {
      id: 1,
      title: "Snakebite Detection System",
      description: "A Flutter mobile application for snakebite detection using machine learning. This project helps identify venomous snake species and provides immediate first-aid guidance. I contributed by developing the complete mobile frontend with an intuitive user interface for real-time snake identification and emergency response features.",
      technologies: ["Flutter", "Dart", "Machine Learning", "TensorFlow Lite", "Firebase", "Camera API", "Real-time Detection"],
      githubUrl: "https://github.com/manohari3299/AI_Based_SnakeBite_Detection_TreatmentAid.git",
      liveUrl: "https://github.com/manohari3299/AI_Based_SnakeBite_Detection_TreatmentAid/releases/latest",
      image: snakebite
    },
    {
      id: 2,
      title: "Gym Tracker",
      description: "A beautiful Flutter mobile application for tracking gym workouts, featuring a premium Glass & Neon UI design with smooth animations. The app includes workout planning, calendar integration, progress photos, weather-based smart timers, and an intuitive dark theme interface for an engaging fitness tracking experience.",
      technologies: ["Flutter", "Dart", "Firebase", "Weather API", "Material Design", "Glassmorphism"],
      githubUrl: "https://github.com/aryan1429/gym-tracker",
      liveUrl: "https://github.com/aryan1429/gym-tracker/releases/latest",
      image: gym1
    },
    {
      id: 3,
      title: "Expense Tracker",
      description: "This is a full-stack personal expense tracker built with the MERN (MongoDB, Express, React, Node.js) stack. It allows users to add, view, and delete their daily expenses, which are then visualized in a chart to show spending by category.",
      technologies: ["React", "MongoDb", "Express", "Node.js"],
      githubUrl: "https://github.com/aryan1429/Expense_tracker.git",
      liveUrl: "https://expense-tracker-sigma-green.vercel.app/",
      image: expense
    },
    {
      id: 4,
      title: "TextMoodDJ",
      description: "ABuilt an AI-powered mood-based music assistant that detects emotions from text or voice and recommends matching songs/memes using sentiment analysis, speech-to-text, and YouTube Music API, with a dynamic React UI for an engaging experience.",
      technologies: ["Python", "Flask/FastAPI", "React.js", "Tailwind CSS", "Hugging Face Transformers", "YouTube Music API (ytmusicapi)", "Redis / SQLite",],
      githubUrl: "https://github.com/aryan1429/Text-MoodDJ.git",
      liveUrl: "https://text-mood-dj.vercel.app/",
      image: textmood
    },
    {
      id: 5,
      title: "Mr Sarcastic",
      description: "An AI-powered chatbot with a sarcastic personality that detects user mood and provides personalized music recommendations. Features Firebase Authentication for Google sign-in, real-time chat, and mood-based song suggestions.",
      technologies: ["React", "TypeScript", "Node.js", "Express", "Google Cloud Storage", "JWT", "Tailwind CSS"],
      githubUrl: "https://github.com/aryan1429/mr-sarcastic",
      liveUrl: "#",
      image: sarcastic
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 tech-projects-bg">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-primary tracking-tight">
            Tech Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A showcase of my technical projects and development work. Each project represents
            a unique challenge and learning experience.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => { cardRefs.current[project.id] = el; }}
              className="h-full"
            >
              <Card
                className="h-full flex flex-col border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 group animate-fade-in-up overflow-hidden rounded-xl relative cursor-pointer"
                style={{ animationDelay: `${index * 200}ms` }}
                onClick={() => handleCardClick(project, cardRefs.current[project.id])}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage: 'linear-gradient(to bottom, rgba(30, 41, 59, 0.85), rgba(30, 41, 59, 0.9)), url(/background.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
                <CardHeader className="relative z-10">
                  <div className="w-full h-48 bg-black/40 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-white/5 group-hover:border-primary/30 transition-colors">
                    {project.image ? (
                      project.id === 1 ? (
                        // Snakebite project - show all three thumbnails side by side
                        <div className="flex w-full h-full">
                          <img
                            src={snakebite}
                            alt={`${project.title} - Screen 1`}
                            className="flex-1 h-full object-contain hover:scale-110 transition-transform duration-500"
                          />
                          <img
                            src={snakebite2}
                            alt={`${project.title} - Screen 2`}
                            className="flex-1 h-full object-contain hover:scale-110 transition-transform duration-500 delay-75"
                          />
                          <img
                            src={snakebite3}
                            alt={`${project.title} - Screen 3`}
                            className="flex-1 h-full object-contain hover:scale-110 transition-transform duration-500 delay-150"
                          />
                        </div>
                      ) : project.id === 2 ? (
                        // Gym Tracker project - show all four thumbnails side by side
                        <div className="flex w-full h-full">
                          <img
                            src={gym1}
                            alt={`${project.title} - Screen 1`}
                            className="flex-1 h-full object-contain hover:scale-110 transition-transform duration-500"
                          />
                          <img
                            src={gym2}
                            alt={`${project.title} - Screen 2`}
                            className="flex-1 h-full object-contain hover:scale-110 transition-transform duration-500 delay-75"
                          />
                          <img
                            src={gym3}
                            alt={`${project.title} - Screen 3`}
                            className="flex-1 h-full object-contain hover:scale-110 transition-transform duration-500 delay-150"
                          />
                          <img
                            src={gym4}
                            alt={`${project.title} - Screen 4`}
                            className="flex-1 h-full object-contain hover:scale-110 transition-transform duration-500 delay-200"
                          />
                        </div>
                      ) : (
                        // Other projects - single image
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      )
                    ) : (
                      <Code className="h-16 w-16 text-primary/50" />
                    )}
                  </div>
                  <CardTitle className="text-xl font-heading group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 flex-grow flex flex-col">
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto pt-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full glass hover:bg-white/20 border-white/10">
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </Button>
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="default" size="sm" className="w-full shadow-glow hover:scale-105 transition-transform">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {(project.id === 1 || project.id === 2) ? '📱 APK' : 'Live Demo'}
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 animate-fade-in">
          <h3 className="text-2xl font-bold mb-4 font-heading">Want to see more?</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Check out my GitHub for additional projects and contributions.
          </p>
          <a href="https://github.com/aryan1429" target="_blank" rel="noopener noreferrer">
            <Button variant="default" size="lg" className="shadow-glow hover:scale-105 transition-transform rounded-full px-8">
              <Github className="h-5 w-5 mr-2" />
              View GitHub Profile
            </Button>
          </a>
        </div>
      </div>

      {/* Project Detail Modal - Shared Element Transition */}
      {selectedProject && cardRect && (
        <div
          className={`fixed inset-0 z-50 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-400 ${isClosing ? 'opacity-0' : 'opacity-100'}`} />

          {/* Back Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className={`absolute top-6 left-6 z-[60] flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full border border-white/20 text-white transition-all duration-300 hover:scale-105 group ${isClosing ? 'opacity-0 -translate-x-4' : 'opacity-100'}`}
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Projects</span>
          </button>

          {/* Modal Content with Shared Element Transition */}
          <div
            className={`fixed z-[55] overflow-visible rounded-2xl border border-white/20 ${isClosing ? 'project-zoom-out' : 'project-zoom-in'}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              '--start-top': `${cardRect.top}px`,
              '--start-left': `${cardRect.left}px`,
              '--start-width': `${cardRect.width}px`,
              '--start-height': `${cardRect.height}px`,
              backgroundImage: 'linear-gradient(to bottom, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98)), url(/background.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            } as React.CSSProperties}
          >
            {/* Close Button (X) */}
            <button
              onClick={handleClose}
              className={`absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 text-white transition-all duration-300 hover:scale-110 hover:rotate-90 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Project Images */}
            <div className="w-full h-48 md:h-56 bg-black/40 flex items-center justify-center overflow-hidden rounded-t-2xl">
              {selectedProject.id === 1 ? (
                // Snakebite project - show all three thumbnails
                <div className="flex w-full h-full gap-2 p-4">
                  <img
                    src={snakebite}
                    alt={`${selectedProject.title} - Screen 1`}
                    className="flex-1 h-full object-contain rounded-lg"
                  />
                  <img
                    src={snakebite2}
                    alt={`${selectedProject.title} - Screen 2`}
                    className="flex-1 h-full object-contain rounded-lg"
                  />
                  <img
                    src={snakebite3}
                    alt={`${selectedProject.title} - Screen 3`}
                    className="flex-1 h-full object-contain rounded-lg"
                  />
                </div>
              ) : selectedProject.id === 2 ? (
                // Gym Tracker project - show all four thumbnails
                <div className="flex w-full h-full gap-2 p-4">
                  <img
                    src={gym1}
                    alt={`${selectedProject.title} - Screen 1`}
                    className="flex-1 h-full object-contain rounded-lg"
                  />
                  <img
                    src={gym2}
                    alt={`${selectedProject.title} - Screen 2`}
                    className="flex-1 h-full object-contain rounded-lg"
                  />
                  <img
                    src={gym3}
                    alt={`${selectedProject.title} - Screen 3`}
                    className="flex-1 h-full object-contain rounded-lg"
                  />
                  <img
                    src={gym4}
                    alt={`${selectedProject.title} - Screen 4`}
                    className="flex-1 h-full object-contain rounded-lg"
                  />
                </div>
              ) : (
                // Other projects - single image
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-contain p-4"
                />
              )}
            </div>

            {/* Project Details */}
            <div className="p-5">
              {/* Title and Actions Row */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-primary">
                  {selectedProject.title}
                </h2>
                <div className="flex gap-2 flex-shrink-0">
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="outline" size="sm" className="glass hover:bg-white/20 border-white/10">
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </Button>
                  </a>
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="default" size="sm" className="shadow-glow hover:scale-105 transition-transform">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {(selectedProject.id === 1 || selectedProject.id === 2) ? 'APK' : 'Demo'}
                    </Button>
                  </a>
                </div>
              </div>

              {/* Full Description */}
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {selectedProject.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 pb-4">
                {selectedProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-primary/15 text-primary rounded-full text-xs font-medium border border-primary/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechProjects;
