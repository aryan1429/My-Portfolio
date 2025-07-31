import { ArrowRight, Download, Award, Star, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import profileHero from '@/assets/profile-pic.jpeg';

const Index = () => {
  const skills = [
    { name: "Adobe After Effects", level: "Advanced", icon: "🎬" },
    { name: "Davinci Resolve", level: "Intermediate", icon: "✨" },
    { name: "Content Creation Script Writing", level: "Expert", icon: "🖼️" },
    { name: "YouTube Content Creation", level: "Expert", icon: "📺" },
    { name: "Front-End Developiing", level: "Intermediate", icon: "🎨" },
   //{ name: "", level: "Intermediate", icon: "🌟" }
  ];

  const achievements = [
    { title: "Video Editing Projects Completed", count: "100+", icon: "🎯" },
    { title: "Content Creation Experience", count: "3+ Years", icon: "📅" },
    { title: "Won Multiple Hackathons(Web Dev Competetion)", count: "5+", icon: "⭐" },
    { title: "Experienced in running YT channels", count: "3+", icon: "📱" }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Profile Image */}
            <div className="order-2 lg:order-1 animate-fade-in">
              <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden shadow-hero border border-border/20">
                <img
                  src={profileHero}
                  alt="Aryan Aligeti - Video Editor & Content Creator"
                  className="w-full h-full object-cover object-center rounded-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-20 animate-glow"></div>
              </div>
            </div>
            {/* Right: Hero Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left animate-fade-in-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Hi, I'm{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Aryan Aligeti
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
                A video editor and content creator passionate about Storytelling and innovation.
                Bringing creative visions to life through cinematic editing and engaging content.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Button 
                  size="lg" 
                  className="shadow-glow animate-glow"
                  onClick={() => scrollToSection('contact')}
                >
                  Let's Work Together
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Download Resume
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent" />
                  <span>3+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-accent" />
                  <span>50+ Projects</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown 
              className="h-8 w-8 text-primary cursor-pointer"
              onClick={() => scrollToSection('skills')}
            />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Expertise</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized in video editing, content creation, and Script Writing across multiple platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <Card 
                key={skill.name}
                className="bg-gradient-card border-border hover:shadow-glow transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{skill.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
                  <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm border border-primary/30">
                    {skill.level}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Achievements & Impact</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Proven track record of delivering exceptional results and creating meaningful impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card 
                key={achievement.title}
                className="bg-gradient-card border-border hover:shadow-glow transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <div className="text-3xl font-bold text-primary mb-2">{achievement.count}</div>
                  <p className="text-sm text-muted-foreground">{achievement.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-card border-border shadow-hero max-w-4xl mx-auto animate-fade-in">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to create something amazing?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you need video editing, content creation, or technical development, 
                let's collaborate to bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="shadow-glow">
                  <Link to="/contact">
                    Get In Touch
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/content-creation">View My Work</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
