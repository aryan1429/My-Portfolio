import { ArrowRight, Download, Award, Star, ChevronDown, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import SpinCard from '@/components/SpinCard';
import TextSplit from '@/components/TextSplit';
import MagneticButton from '@/components/MagneticButton';
import Marquee from '@/components/Marquee';
import FloatingVideos from '@/components/FloatingVideos';
import { staggerContainer, fadeInUp, heroStagger, heroItem, slideInLeft, slideInRight } from '@/lib/animations';
import profileHero from '@/assets/new-profile.jpeg';
import profileBack from '@/assets/cool.jpeg';
import aeLogo from '/media/projects/aelogo.png';
import davinciLogo from '/media/projects/davinciresolve-removebg-preview.png';
import ytLogo from '/media/projects/yt-logo.png';
import fullstackLogo from '/media/projects/fullstack.png';
import mobileLogo from '/media/projects/mobile.png';

const CountUp = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const Index = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const techStack = [
    'React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Flutter', 'Dart',
    'Firebase', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'GCP',
    'After Effects', 'DaVinci Resolve', 'Premiere Pro', 'Tailwind CSS',
    'Express.js', 'FastAPI', 'Supabase',
  ];

  const skills = [
    { name: "Full-Stack Development", icon: fullstackLogo, isImage: true },
    { name: "App Development", icon: mobileLogo, isImage: true, cropBottom: true },
    { name: "Adobe After Effects", icon: aeLogo, isImage: true },
    { name: "DaVinci Resolve", icon: davinciLogo, isImage: true },
    { name: "Content Creation", icon: "🎥" },
    { name: "YouTube", icon: ytLogo, isImage: true, imageSize: "w-14 h-14" },
  ];

  const stats = [
    { label: "Projects Completed", value: 100, suffix: "+" },
    { label: "Years Experience", value: 3, suffix: "+" },
    { label: "Hackathons Won", value: 5, suffix: "+" },
    { label: "YT Channels Run", value: 3, suffix: "+" },
  ];

  const featuredProjects = [
    {
      title: "Bro - AI Study Buddy",
      desc: "Web-based AI study buddy with notes, quizzes, and flashcards. Deployed on AWS EC2.",
      tech: ["Next.js", "Python", "FastAPI", "Docker", "AWS"],
      link: "/tech-projects",
    },
    {
      title: "Chest X-ray Report Generator",
      desc: "Complete Frontend/UI with full-stack integration, Supabase, and Google Auth.",
      tech: ["React", "Supabase", "Google Auth"],
      link: "/tech-projects",
    },
    {
      title: "Cinematic Video Edits",
      desc: "100+ professional video edits for YouTube, social media, and creative projects.",
      tech: ["After Effects", "DaVinci Resolve"],
      link: "/content-creation",
    },
  ];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="min-h-screen">
      {/* ======= HERO ======= */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        {/* Gradient orbs — CSS-driven for compositor-thread performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full bg-[hsl(263_70%_58%/0.12)] blur-[80px] anim-hero-orb-1" />
          <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-[hsl(187_80%_48%/0.08)] blur-[60px] anim-hero-orb-2" />
        </div>

        <motion.div
          className="container mx-auto max-w-7xl relative z-10"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text content */}
            <motion.div
              className="lg:col-span-7 text-center lg:text-left"
              variants={heroStagger}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={heroItem} className="mb-4">
                <motion.span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium anim-badge-glow"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Available for work
                </motion.span>
              </motion.div>

              <TextSplit
                text="Aryan Aligeti"
                as="h1"
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-6"
                delay={0.3}
              />

              <motion.p variants={heroItem} className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                Full Stack Developer <span className="text-primary">&</span> Video Editor crafting
                digital experiences that blend <span className="text-gradient font-semibold">code</span> with <span className="text-gradient font-semibold">creativity</span>.
              </motion.p>

              <motion.div variants={heroItem} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <MagneticButton
                  onClick={() => scrollToSection('contact')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-semibold text-base shadow-glow hover:shadow-[0_0_60px_hsl(263_70%_58%/0.5)] transition-all duration-300"
                >
                  Let's Work Together
                  <ArrowRight className="h-5 w-5" />
                </MagneticButton>
                <MagneticButton
                  onClick={downloadResume}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 bg-white/[0.03] text-white font-semibold text-base hover:bg-white/[0.08] transition-all duration-300"
                >
                  <Download className="h-5 w-5" />
                  Resume
                </MagneticButton>
              </motion.div>

              <motion.div variants={heroItem} className="flex items-center gap-6 text-sm text-muted-foreground justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>3+ Years Experience</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span>50+ Projects</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Profile image — 3D spin card */}
            <motion.div
              className="lg:col-span-5 flex justify-center"
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <SpinCard
                className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96"
                hintRock
                front={
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-hero border-gradient">
                    <img
                      src={profileHero}
                      alt="Aryan Aligeti"
                      className="w-full h-full object-cover"
                      loading="eager"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                }
                back={
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-hero border-gradient">
                    <img
                      src={profileBack}
                      alt="Aryan Aligeti"
                      className="w-full h-full object-cover"
                      loading="eager"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                }
              />
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 anim-scroll-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ opacity: { delay: 2 } }}
          >
            <ChevronDown
              className="h-8 w-8 text-primary/60 cursor-pointer hover:text-primary transition-colors"
              onClick={() => scrollToSection('marquee')}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ======= TECH MARQUEE ======= */}
      <section id="marquee" className="py-8 border-y border-white/[0.04] relative overflow-hidden">
        <Marquee items={techStack} speed={25} className="text-xl sm:text-2xl font-heading font-semibold text-white/10" />
      </section>

      {/* ======= ABOUT / BENTO GRID ======= */}
      <section id="about" className="py-20 sm:py-28 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-16">
              <div className="w-12 h-[1px] bg-gradient-to-r from-primary to-transparent" />
              <span className="text-primary font-mono text-sm uppercase tracking-widest">About Me</span>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Large intro card */}
            <ScrollReveal variants={slideInLeft} className="md:col-span-2 lg:col-span-2">
              <TiltCard tiltAmount={4}>
                <div className="glass glass-hover rounded-2xl p-8 sm:p-10 h-full border-gradient">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-heading">
                    I build things for the <span className="text-gradient">web</span> and edit things for the <span className="text-gradient">screen</span>.
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    I'm a Full Stack Developer and Video Editor with 3+ years of experience building web apps,
                    mobile apps, and creating cinematic video content. I love combining technical skills with
                    creative storytelling to deliver impactful digital experiences.
                  </p>
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* Stats card */}
            <ScrollReveal variants={slideInRight}>
              <TiltCard tiltAmount={6}>
                <div className="glass glass-hover rounded-2xl p-8 h-full border-gradient grid grid-cols-2 gap-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-3xl sm:text-4xl font-bold text-gradient font-heading mb-1">
                        <CountUp target={stat.value} suffix={stat.suffix} />
                      </div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* Skills cards */}
            {skills.map((skill, i) => (
              <ScrollReveal key={skill.name} delay={i * 0.05}>
                <TiltCard tiltAmount={8} className="h-full">
                  <motion.div
                    className="glass glass-hover rounded-2xl p-6 h-full flex flex-col items-center justify-center gap-3 text-center border-gradient min-h-[140px]"
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <div className="flex items-center justify-center w-14 h-14">
                      {skill.isImage ? (
                        skill.cropBottom ? (
                          <div className="w-12 h-12 overflow-hidden">
                            <img src={skill.icon} alt={skill.name} className="w-12 object-cover object-top" />
                          </div>
                        ) : (
                          <img src={skill.icon} alt={skill.name} className={`${skill.imageSize || 'w-12 h-12'} object-contain`} />
                        )
                      ) : (
                        <span className="text-4xl">{skill.icon}</span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold">{skill.name}</h3>
                  </motion.div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ======= MY EDITS (FLOATING VIDEOS) ======= */}
      <FloatingVideos />

      {/* ======= FEATURED WORK ======= */}
      <section id="work" className="py-20 sm:py-28 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-16">
              <div className="w-12 h-[1px] bg-gradient-to-r from-primary to-transparent" />
              <span className="text-primary font-mono text-sm uppercase tracking-widest">Featured Work</span>
            </div>
          </ScrollReveal>

          <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px 0px' }}
          >
            {featuredProjects.map((project, i) => (
              <motion.div key={project.title} variants={fadeInUp}>
                <Link to={project.link}>
                  <TiltCard tiltAmount={3}>
                    <motion.div
                      className="glass glass-hover rounded-2xl p-8 sm:p-10 border-gradient group cursor-pointer"
                      whileHover={{ y: -4, boxShadow: '0 0 40px hsl(263 70% 58% / 0.12)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex-1">
                          <span className="text-muted-foreground font-mono text-sm mb-2 block">0{i + 1}</span>
                          <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-3 group-hover:text-gradient transition-all duration-300">
                            {project.title}
                          </h3>
                          <p className="text-muted-foreground max-w-xl mb-4">{project.desc}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.tech.map((t) => (
                              <span key={t} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <motion.div
                          className="flex items-center gap-2 text-primary"
                          whileHover={{ x: 8 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <span className="text-sm font-medium hidden sm:block">View</span>
                          <ArrowRight className="h-5 w-5" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </TiltCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <ScrollReveal className="mt-12 flex gap-4 justify-center">
            <MagneticButton
              as="a"
              href="/tech-projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/[0.03] text-white font-medium hover:bg-white/[0.08] transition-all duration-300"
            >
              <Github className="h-4 w-4" />
              Tech Projects
            </MagneticButton>
            <MagneticButton
              as="a"
              href="/content-creation"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/[0.03] text-white font-medium hover:bg-white/[0.08] transition-all duration-300"
            >
              <ExternalLink className="h-4 w-4" />
              Video Work
            </MagneticButton>
          </ScrollReveal>
        </div>
      </section>

      {/* ======= REVERSE MARQUEE ======= */}
      <section className="py-8 border-y border-white/[0.04] relative overflow-hidden">
        <Marquee
          items={['Full Stack Dev', 'Video Editor', 'Content Creator', 'UI/UX', 'Mobile Dev', 'Script Writer']}
          speed={20}
          reverse
          className="text-4xl sm:text-5xl font-heading font-bold text-white/[0.04]"
          separator="✦"
        />
      </section>

      {/* ======= CTA ======= */}
      <section id="contact" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-6">
                Let's create something <span className="text-gradient">amazing</span> together.
              </h2>
              <div
                className="absolute -inset-20 bg-[hsl(263_70%_58%/0.06)] rounded-full blur-[60px] -z-10 anim-cta-pulse"
              />
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Whether you need a developer, a video editor, or a creative partner —
                I'd love to hear about your project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton className="inline-block">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-primary text-white font-semibold text-lg shadow-glow hover:shadow-[0_0_60px_hsl(263_70%_58%/0.5)] transition-all duration-300"
                  >
                    Get In Touch
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </MagneticButton>
                <MagneticButton className="inline-block">
                  <Link
                    to="/content-creation"
                    className="inline-flex items-center gap-2 px-10 py-5 rounded-full border border-white/10 bg-white/[0.03] text-white font-semibold text-lg hover:bg-white/[0.08] transition-all duration-300"
                  >
                    View My Work
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Index;
