import { Github, ExternalLink, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import expense from '@/assets/expense.png';
import ironman from '@/assets/Ironman.jpg';
import textmood from '@/assets/textmood.png';
import sarcastic from '@/assets/mrsarcastic.png';
import snakebite from '@/assets/snakebitethumbnail.png';
import snakebite2 from '@/assets/snakebitethumbnail2.png';
import snakebite3 from '@/assets/snakebitethumbnail3.png';

const TechProjects = () => {
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
      title: "Expense Tracker",
      description: "This is a full-stack personal expense tracker built with the MERN (MongoDB, Express, React, Node.js) stack. It allows users to add, view, and delete their daily expenses, which are then visualized in a chart to show spending by category.",
      technologies: ["React", "MongoDb", "Express", "Node.js"],
      githubUrl: "https://github.com/aryan1429/Expense_tracker.git",
      liveUrl: "https://expense-tracker-sigma-green.vercel.app/",
      image: expense
    },
    {
      id: 3,
      title: "TextMoodDJ",
      description: "ABuilt an AI-powered mood-based music assistant that detects emotions from text or voice and recommends matching songs/memes using sentiment analysis, speech-to-text, and YouTube Music API, with a dynamic React UI for an engaging experience.",
      technologies: ["Python", "Flask/FastAPI", "React.js", "Tailwind CSS", "Hugging Face Transformers", "YouTube Music API (ytmusicapi)", "Redis / SQLite",],
      githubUrl: "https://github.com/aryan1429/Text-MoodDJ.git",
      liveUrl: "https://text-mood-dj.vercel.app/",
      image: textmood
    },
    {
      id: 4,
      title: "Mr Sarcastic",
      description: "An AI-powered chatbot with a sarcastic personality that detects user mood and provides personalized music recommendations. Features Firebase Authentication for Google sign-in, real-time chat, and mood-based song suggestions.",
      technologies: ["React", "TypeScript", "Node.js", "Express", "Google Cloud Storage", "JWT", "Tailwind CSS"],
      githubUrl: "https://github.com/aryan1429/mr-sarcastic",
      liveUrl: "#",
      image: sarcastic
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-20">
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
            <Card
              key={project.id}
              className="glass border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 group animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardHeader>
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

              <CardContent>
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
                <div className="flex gap-3 mt-auto">
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
                      {project.id === 1 ? '📱 APK' : 'Live Demo'}
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
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
    </div>
  );
};

export default TechProjects;
