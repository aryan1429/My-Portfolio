import { useState } from 'react';
import { Mail, Send, Youtube, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import portfolioService from '@/services/portfolioService';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await portfolioService.sendContactMessage(formData);
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://www.youtube.com/channel/UCqJLSH1DtEDUdJmJz1mk8gQ',
      color: 'hover:text-red-500'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/aryan_alejandro_aligeti/',
      color: 'hover:text-pink-500'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/aryan-aligeti-099ab825b/',
      color: 'hover:text-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-primary tracking-tight">
            Let's Work Together
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Contact me if you want to any Full Stack Developer, Video editor or any Content Creation collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="glass border-white/10 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 font-heading">
                <Mail className="h-6 w-6 text-primary" />
                Send me a message
              </CardTitle>
              <CardDescription>
                Fill out the form below and I'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white/5 border-white/10 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white/5 border-white/10 focus:ring-primary focus:border-primary transition-all"
                    placeholder="your.email@gmail.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="bg-white/5 border-white/10 focus:ring-primary focus:border-primary transition-all resize-none"
                    placeholder="Express your feelings for me"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full shadow-glow hover:scale-[1.02] transition-transform"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & Social */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {/* Direct Contact */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-heading">Get in Touch</CardTitle>
                <CardDescription>
                  Prefer direct contact? Reach out to me directly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href="mailto:aryanaligetibusiness@gmail.com"
                      className="text-primary hover:text-primary-glow transition-colors"
                    >
                      aryanaligetibusiness@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-heading">Follow My Work</CardTitle>
                <CardDescription>
                  Connect with me on social media for updates and behind-the-scenes content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/5 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] ${social.color} group`}
                      >
                        <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span className="font-medium">{social.name}</span>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="glass border-white/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2 font-heading">Quick Response</h3>
                  <p className="text-sm text-muted-foreground">
                    I typically respond to messages within 24 hours during business days.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;