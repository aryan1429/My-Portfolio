import { useState } from 'react';
import { Mail, Send, Youtube, Instagram, Linkedin, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import portfolioService from '@/services/portfolioService';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import TextSplit from '@/components/TextSplit';
import MagneticButton from '@/components/MagneticButton';
import { slideInLeft, slideInRight, staggerContainer, fadeInUp } from '@/lib/animations';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await portfolioService.sendContactMessage(formData);
      if (response.warning) {
        toast({ title: "Message Saved (Email Warning)", description: response.message, variant: "destructive" });
      } else {
        toast({ title: "Message sent!", description: "Thank you for reaching out. I'll get back to you soon." });
        setFormData({ name: '', email: '', message: '' });
      }
    } catch {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/channel/UCqJLSH1DtEDUdJmJz1mk8gQ', color: 'group-hover:text-red-400' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/aryan_alejandro_aligeti/', color: 'group-hover:text-pink-400' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/aryan-aligeti-099ab825b/', color: 'group-hover:text-blue-400' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-20">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-[hsl(263_50%_15%/0.3)] rounded-full blur-[150px]" animate={{ y: [0, -25, 0], x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-[15%] left-[10%] w-[400px] h-[400px] bg-[hsl(187_50%_12%/0.2)] rounded-full blur-[120px]" animate={{ y: [0, 20, 0], x: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut', delay: 2 }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="mb-16 sm:mb-20">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-gradient-to-r from-primary to-transparent" />
              <span className="text-primary font-mono text-sm uppercase tracking-widest">Contact</span>
            </div>
          </ScrollReveal>
          <TextSplit text="Let's talk." as="h1" className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6" delay={0.1} />
          <ScrollReveal delay={0.3}>
            <p className="text-xl text-muted-foreground max-w-xl">
              Got a project in mind? Need a developer or video editor? I'd love to hear from you.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12">
          {/* Form - takes 3 cols */}
          <ScrollReveal variants={slideInLeft} className="lg:col-span-3">
            <TiltCard tiltAmount={2}>
              <div className="glass rounded-2xl p-8 sm:p-10 border-gradient">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
                      <Input
                        id="name" name="name" type="text" required autoComplete="name"
                        value={formData.name} onChange={handleInputChange}
                        className="bg-white/[0.03] border-white/[0.08] focus:border-primary/50 focus:ring-primary/20 transition-all min-h-[48px] text-base rounded-xl"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                      <Input
                        id="email" name="email" type="email" required autoComplete="email" inputMode="email"
                        value={formData.email} onChange={handleInputChange}
                        className="bg-white/[0.03] border-white/[0.08] focus:border-primary/50 focus:ring-primary/20 transition-all min-h-[48px] text-base rounded-xl"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">Message</label>
                    <Textarea
                      id="message" name="message" required rows={6}
                      value={formData.message} onChange={handleInputChange}
                      className="bg-white/[0.03] border-white/[0.08] focus:border-primary/50 focus:ring-primary/20 transition-all resize-none min-h-[160px] text-base rounded-xl"
                      placeholder="Tell me about your project..."
                    />
                  </div>
                  <MagneticButton
                    onClick={undefined}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-semibold shadow-glow hover:shadow-[0_0_60px_hsl(263_70%_58%/0.5)] transition-all duration-300 min-h-[52px]"
                  >
                    {isSubmitting ? 'Sending...' : <><Send className="h-4 w-4" /> Send Message</>}
                  </MagneticButton>
                </form>
              </div>
            </TiltCard>
          </ScrollReveal>

          {/* Info - takes 2 cols */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px 0px' }}
          >
            {/* Email */}
            <motion.div variants={slideInRight}>
              <TiltCard tiltAmount={6}>
                <a
                  href="mailto:aryanaligetibusiness@gmail.com"
                  className="glass glass-hover rounded-2xl p-6 flex items-center gap-4 border-gradient group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground mb-0.5">Email</p>
                    <p className="text-sm font-medium text-primary truncate">aryanaligetibusiness@gmail.com</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-auto flex-shrink-0" />
                </a>
              </TiltCard>
            </motion.div>

            {/* Socials */}
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.div key={social.name} variants={fadeInUp}>
                  <TiltCard tiltAmount={6}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass glass-hover rounded-2xl p-6 flex items-center gap-4 border-gradient group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center flex-shrink-0">
                        <Icon className={`h-5 w-5 transition-colors ${social.color}`} />
                      </div>
                      <span className="font-medium">{social.name}</span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-auto flex-shrink-0" />
                    </a>
                  </TiltCard>
                </motion.div>
              );
            })}

            {/* Response time */}
            <motion.div variants={fadeInUp}>
              <div className="glass rounded-2xl p-6 border-gradient text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium">Quick Response</span>
                </div>
                <p className="text-xs text-muted-foreground">Typically within 24 hours</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
