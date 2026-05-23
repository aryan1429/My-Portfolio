import { useState, useCallback, useRef } from 'react';
import { Github, ExternalLink, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import TextSplit from '@/components/TextSplit';
import MagneticButton from '@/components/MagneticButton';
import { staggerContainer, fadeInUp, modalOverlay, modalContent } from '@/lib/animations';
import expense from '@/assets/expense.png';
import textmood from '@/assets/textmood.png';
import sarcastic from '@/assets/mrsarcastic.png';
import snakebite from '@/assets/snakebitethumbnail.png';
import snakebite2 from '@/assets/snakebitethumbnail2.png';
import snakebite3 from '@/assets/snakebitethumbnail3.png';
import gym1 from '@/assets/gym1.png';
import gym2 from '@/assets/gym2.png';
import gym3 from '@/assets/gym3.png';
import gym4 from '@/assets/gym4.png';
import chestxray from '@/assets/Chest-xray.png';
import bro1 from '@/assets/bro1.png';
import bro2 from '@/assets/bro2.png';
import bro3 from '@/assets/bro3.png';
import bro4 from '@/assets/bro4.png';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  image: string;
  images?: string[];
}

const TechProjects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const headerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start start', 'end start'] });
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const handleClose = useCallback(() => setSelectedProject(null), []);

  const projects: Project[] = [
    {
      id: 3,
      title: "Bro - AI Study Buddy",
      description: "Bro is a web-based AI study buddy that lets users upload notes and interact with them through a clean, modern chat interface with source-style references and a dedicated Study Mode for quizzes and flashcards. Built with scalable architecture, containerized with Docker, deployed on AWS EC2.",
      technologies: ["Next.js", "TypeScript", "Python", "FastAPI", "Docker", "AWS EC2", "Qdrant", "PostgreSQL", "Groq LLM"],
      githubUrl: "https://github.com/aryan1429/Bro-StudyBuddy.git",
      liveUrl: "https://brostudybuddy.live/",
      image: bro3,
      images: [bro1, bro2, bro3, bro4],
    },
    {
      id: 1,
      title: "Snakebite Detection System",
      description: "A Flutter mobile application for snakebite detection using machine learning. Identifies venomous snake species and provides immediate first-aid guidance. Developed complete mobile frontend with real-time snake identification and emergency response features.",
      technologies: ["Flutter", "Dart", "Machine Learning", "TensorFlow Lite", "Firebase", "Camera API"],
      githubUrl: "https://github.com/manohari3299/AI_Based_SnakeBite_Detection_TreatmentAid.git",
      liveUrl: "https://github.com/manohari3299/AI_Based_SnakeBite_Detection_TreatmentAid/releases/latest",
      image: snakebite,
      images: [snakebite, snakebite2, snakebite3],
    },
    {
      id: 4,
      title: "Chest X-ray Report Generator",
      description: "Built the complete Frontend/UI for a Chest X-ray report generation system. Handled full integration of backend and frontend, database setup with Supabase, and authentication via Google Auth.",
      technologies: ["React", "Supabase", "Google Auth", "Full-Stack Integration"],
      githubUrl: "https://github.com/aryan1429/CXR-report-generator.git",
      liveUrl: "https://chestxray.tech/",
      image: chestxray,
    },
    {
      id: 2,
      title: "Gym Tracker",
      description: "Flutter mobile application for tracking gym workouts with premium Glass & Neon UI. Includes workout planning, calendar integration, progress photos, weather-based smart timers.",
      technologies: ["Flutter", "Dart", "Firebase", "Weather API", "Glassmorphism"],
      githubUrl: "https://github.com/aryan1429/gym-tracker",
      liveUrl: "https://github.com/aryan1429/gym-tracker/releases/latest",
      image: gym1,
      images: [gym1, gym2, gym3, gym4],
    },
    {
      id: 5,
      title: "Mr Sarcastic",
      description: "AI-powered chatbot with sarcastic personality that detects user mood and provides personalized music recommendations. Features Firebase Auth, real-time chat, and mood-based song suggestions.",
      technologies: ["React", "TypeScript", "Node.js", "Express", "GCP", "JWT"],
      githubUrl: "https://github.com/aryan1429/mr-sarcastic",
      liveUrl: "https://www.mrsarcastic.me/",
      image: sarcastic,
    },
    {
      id: 6,
      title: "Expense Tracker",
      description: "Full-stack personal expense tracker built with MERN stack. Add, view, and delete daily expenses, visualized in charts by category.",
      technologies: ["React", "MongoDB", "Express", "Node.js"],
      githubUrl: "https://github.com/aryan1429/Expense_tracker.git",
      liveUrl: "https://expense-tracker-sigma-green.vercel.app/",
      image: expense,
    },
    {
      id: 7,
      title: "TextMoodDJ",
      description: "AI-powered mood-based music assistant. Detects emotions from text or voice, recommends matching songs/memes using sentiment analysis and YouTube Music API.",
      technologies: ["Python", "FastAPI", "React", "Hugging Face", "YouTube Music API"],
      githubUrl: "https://github.com/aryan1429/Text-MoodDJ.git",
      liveUrl: "https://text-mood-dj.vercel.app/",
      image: textmood,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 tech-projects-bg">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-[hsl(263_50%_15%/0.25)] rounded-full blur-[150px]"
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-[hsl(187_50%_12%/0.2)] rounded-full blur-[130px]"
          animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut', delay: 3 }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10 max-w-7xl">
        {/* Header */}
        <motion.div ref={headerRef} className="mb-20" style={{ y: headerY, opacity: headerOpacity }}>
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-gradient-to-r from-primary to-transparent" />
              <span className="text-primary font-mono text-sm uppercase tracking-widest">Portfolio</span>
            </div>
          </ScrollReveal>
          <TextSplit
            text="Tech Projects"
            as="h1"
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6"
            delay={0.1}
          />
          <ScrollReveal delay={0.3}>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Each project represents a unique challenge — from AI-powered apps to full-stack platforms.
            </p>
          </ScrollReveal>
        </motion.div>

        {/* Project list */}
        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px 0px' }}
        >
          {projects.map((project, index) => (
            <motion.div key={project.id} variants={fadeInUp}>
              <TiltCard tiltAmount={3}>
                <motion.div
                  className="glass glass-hover rounded-2xl overflow-hidden border-gradient cursor-pointer group"
                  onClick={() => setSelectedProject(project)}
                  whileHover={{ y: -6, boxShadow: '0 0 40px hsl(263 70% 58% / 0.12)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-80 lg:w-96 h-56 md:h-64 bg-black/30 flex-shrink-0 overflow-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    {/* Content */}
                    <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <span className="text-muted-foreground font-mono text-xs mb-1 block">0{index + 1}</span>
                            <h3 className="text-xl sm:text-2xl font-bold font-heading group-hover:text-gradient transition-all duration-300">
                              {project.title}
                            </h3>
                          </div>
                          <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 5).map((tech) => (
                          <span key={tech} className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 5 && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground">+{project.technologies.length - 5}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        {/* GitHub CTA */}
        <ScrollReveal className="mt-16 text-center">
          <MagneticButton
            as="a"
            href="https://github.com/aryan1429"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-semibold shadow-glow hover:shadow-[0_0_60px_hsl(263_70%_58%/0.5)] transition-all duration-300"
          >
            <Github className="h-5 w-5" />
            View GitHub Profile
          </MagneticButton>
        </ScrollReveal>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose} variants={modalOverlay} initial="hidden" animate="visible" exit="exit">
            <div className="absolute inset-0 bg-black/85 backdrop-blur-lg" />
            <motion.div
              className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[hsl(250_25%_6%)] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              variants={modalContent}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button onClick={handleClose} className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90 duration-300">
                <X className="h-5 w-5" />
              </button>

              <div className="h-56 bg-black/40 flex items-center justify-center overflow-hidden rounded-t-2xl">
                {selectedProject.images ? (
                  <div className="flex w-full h-full gap-1 p-3">
                    {selectedProject.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="flex-1 h-full object-contain rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-contain p-4" />
                )}
              </div>

              <div className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gradient font-heading mb-4">{selectedProject.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{selectedProject.description}</p>

                <motion.div className="flex flex-wrap gap-2 mb-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.03, delayChildren: 0.2 } } }}>
                  {selectedProject.technologies.map((tech) => (
                    <motion.span key={tech} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20" variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}>
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>

                <div className="flex gap-3">
                  <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" className="w-full glass hover:bg-white/10 border-white/10">
                      <Github className="h-4 w-4 mr-2" /> Code
                    </Button>
                  </a>
                  <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full shadow-glow hover:scale-[1.02] transition-transform">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {(selectedProject.id === 1 || selectedProject.id === 2) ? 'Download APK' : 'Live Demo'}
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechProjects;
