import { Github, ExternalLink, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import expense from '@/assets/expense.png';
import ironman from '@/assets/Ironman.jpg';
import textmood from '@/assets/textmood.png';

const TechProjects = () => {
  const projects = [
    {
      id: 1,
      title: "Expense Tracker",
      description: "This is a full-stack personal expense tracker built with the MERN (MongoDB, Express, React, Node.js) stack. It allows users to add, view, and delete their daily expenses, which are then visualized in a chart to show spending by category.",
      technologies: ["React", "MongoDb", "Express","Node.js"],
      githubUrl: "https://github.com/aryan1429/Expense_tracker.git",
      liveUrl: "https://expense-tracker-sigma-green.vercel.app/",
      image: expense
    },
    {
      id: 2,
      title: "TextMoodDJ", 
      description: "ABuilt an AI-powered mood-based music assistant that detects emotions from text or voice and recommends matching songs/memes using sentiment analysis, speech-to-text, and YouTube Music API, with a dynamic React UI for an engaging experience.",
      technologies: ["Python","Flask/FastAPI","React.js","Tailwind CSS","Hugging Face Transformers","YouTube Music API (ytmusicapi)","Redis / SQLite",],
      githubUrl: "https://github.com/aryan1429/Text-MoodDJ.git",
      liveUrl: "https://text-mood-dj.vercel.app/",
      image: textmood
    },
    {
      id: 3,
      title: "Project Name 3",
      description: "Third placeholder project. Add your real project information here.",
      technologies: ["Python", "Django", "PostgreSQL"],
      githubUrl: "#",
      liveUrl: "#", 
      image: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
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
              className="bg-gradient-card border-border hover:shadow-glow transition-all duration-500 hover:-translate-y-2 group animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardHeader>
                <div className="w-full h-48 bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Code className="h-16 w-16 text-primary" />
                  )}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
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
                    <Button variant="default" size="sm" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-in">
          <h3 className="text-2xl font-bold mb-4">Want to see more?</h3>
          <p className="text-muted-foreground mb-6">
            Check out my GitHub for additional projects and contributions.
          </p>
          <a href="https://github.com/aryan1429" target="_blank" rel="noopener noreferrer">
            <Button variant="default" size="lg" className="shadow-glow">
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
