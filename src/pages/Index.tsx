import { ArrowRight, Download, Award, Star, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import profileHero from '@/assets/Profile-pic.jpeg';
import aeLogo from '/media/projects/aelogo.png';
import davinciLogo from '/media/projects/davinciresolve-removebg-preview.png';
import ytLogo from '/media/projects/yt-logo.png';
import fullstackLogo from '/media/projects/fullstack.png';
import mobileLogo from '/media/projects/mobile.png';

const Index = () => {
  const skills = [
    { name: "Full-Stack Development", level: "Intermediate", icon: fullstackLogo, isImage: true },
    { name: "App Development", level: "Intermediate", icon: mobileLogo, isImage: true, cropBottom: true },
    { name: "Adobe After Effects", level: "Advanced", icon: aeLogo, isImage: true },
    { name: "Davinci Resolve", level: "Intermediate", icon: davinciLogo, isImage: true },
    { name: "Content Creation Script Writing", level: "Expert", icon: "🎥" },
    { name: "YouTube Content Creation", level: "Expert", icon: ytLogo, isImage: true, imageSize: "w-14 h-14" },
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

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Aryan_Aligeti_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <span className="bg-gradient-primary bg-clip-text text-transparent text-glow">
                  Aryan Aligeti
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed text-glow-white">
                A Full Stack Developer, video editor, and content creator passionate about storytelling and innovation. Bringing creative visions to life through cinematic editing, engaging content, and impactful digital solutions
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Button
                  size="lg"
                  className="shadow-glow transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_60px_hsl(270_90%_60%/_0.6)]"
                  onClick={() => scrollToSection('contact')}
                >
                  Let's Work Together
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" onClick={downloadResume} className="glass glass-hover border-primary/20 hover:bg-white/10">
                  <Download className="mr-2 h-5 w-5" />
                  Download Resume
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent animate-pulse" />
                  <span>3+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-accent animate-pulse" />
                  <span>50+ Projects</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown
              className="h-8 w-8 text-primary cursor-pointer hover:text-accent transition-colors"
              onClick={() => scrollToSection('skills')}
            />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-30"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-glow-white">Skills & Expertise</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized in Full Stack Development, Video Editing, Content Creation, and Script Writing across multiple platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <Card
                key={skill.name}
                className="glass glass-hover border-white/10 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4 flex justify-center items-center">
                    {skill.isImage ? (
                      skill.cropBottom ? (
                        <div className="w-14 h-12 overflow-hidden">
                          <img src={skill.icon} alt={skill.name} className="w-14 object-cover object-top" />
                        </div>
                      ) : (
                        <img src={skill.icon} alt={skill.name} className={`${skill.imageSize || 'w-12 h-12'} object-contain`} />
                      )
                    ) : (
                      skill.icon
                    )}
                  </div>
                  <h3 className="text-lg font-semibold">{skill.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-glow-white">Achievements & Impact</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Proven track record of delivering exceptional results and creating meaningful impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card
                key={achievement.title}
                className="glass glass-hover border-white/10 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{achievement.icon}</div>
                  <div className="text-3xl font-bold text-primary mb-2 text-glow">{achievement.count}</div>
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
          <Card className="glass border-white/10 shadow-hero max-w-4xl mx-auto animate-fade-in relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-3xl -z-10"></div>
            <CardContent className="p-12 text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-glow-white">
                Ready to create something amazing?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you need video editing, content creation, or technical development,
                let's collaborate to bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="shadow-glow hover:scale-105 transition-transform duration-300">
                  <Link to="/contact">
                    Get In Touch
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="glass glass-hover border-primary/20 hover:bg-white/10">
                  <Link to="/ContentCreation">View My Work</Link>
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
