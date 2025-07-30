import { Github, ExternalLink, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TechProjects = () => {
  const projects = [
    {
      id: 1,
      title: "Project Name 1",
      description: "Add your project description here. This is a placeholder for your technical project.",
      technologies: ["React", "TypeScript", "Tailwind"],
      githubUrl: "#",
      liveUrl: "#",
      image: null
    },
    {
      id: 2,
      title: "Project Name 2", 
      description: "Another placeholder project description. Replace with your actual project details.",
      technologies: ["Node.js", "Express", "MongoDB"],
      githubUrl: "#",
      liveUrl: "#",
      image: null
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
                <div className="w-full h-48 bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <Code className="h-16 w-16 text-primary" />
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
                  <Button variant="outline" size="sm" className="flex-1">
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </Button>
                  <Button variant="default" size="sm" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Button>
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
          <Button variant="default" size="lg" className="shadow-glow">
            <Github className="h-5 w-5 mr-2" />
            View GitHub Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TechProjects;