import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { chatWithGemini, ConversationMessage } from '@/services/geminiService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Typewriter = ({ text, onUpdate, speed = 15 }: { text: string; onUpdate?: () => void; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = React.useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (indexRef.current < text.length) {
        const currentIndex = indexRef.current;
        setDisplayedText((prev) => prev + text.charAt(currentIndex));
        indexRef.current++;
        onUpdate?.();
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onUpdate]);

  return <>{displayedText}</>;
};

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Aryan's AI assistant powered by Google Gemini. I know everything about his portfolio, skills, projects, and experience. Feel free to ask me anything about Aryan Aligeti - his work, projects, skills, or anything else you'd like to know!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Gemini API with conversation history
      const responseText = await chatWithGemini(userMessage.text, conversationHistory);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update conversation history for context
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text: userMessage.text }] },
        { role: 'model', parts: [{ text: responseText }] }
      ]);
    } catch (error: any) {
      console.error('Error getting response:', error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const suggestionPrompts = [
    "Tell me about Aryan's technical skills",
    "What projects has Aryan worked on?",
    "What is Aryan's experience in content creation?",
    "How can I contact Aryan?",
    "What technologies does Aryan use?",
    "Tell me about Aryan's achievements"
  ];

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[30%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full border border-primary/20 shadow-glow">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-primary tracking-tight">
              AI Assistant
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Chat with my AI assistant to learn everything about my portfolio, skills, projects, and experience.
          </p>
        </div>

        {/* Chat Container */}
        <Card
          className="glass border-white/10 shadow-glow animate-fade-in-up relative overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(30, 41, 59, 0.85), rgba(30, 41, 59, 0.9)), url(/cool.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <CardHeader className="border-b border-white/10 bg-white/5">
            <CardTitle className="flex items-center gap-2 font-heading">
              <Bot className="h-5 w-5 text-primary" />
              Aryan's AI Assistant
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages */}
            <ScrollArea ref={scrollAreaRef} className="h-[500px] p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <Avatar className={`h-8 w-8 border border-white/10 ${message.isUser ? 'bg-primary shadow-glow' : 'bg-secondary/80'}`}>
                      <AvatarFallback className="bg-transparent text-white">
                        {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>

                    <div className={`max-w-[80%] ${message.isUser ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-md ${message.isUser
                          ? 'bg-primary text-primary-foreground ml-auto rounded-tr-none'
                          : 'bg-white/10 text-foreground border border-white/10 rounded-tl-none backdrop-blur-sm'
                          }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.isUser ? (
                            message.text
                          ) : (
                            <Typewriter text={message.text} onUpdate={scrollToBottom} />
                          )}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 bg-secondary/80 border border-white/10">
                      <AvatarFallback className="bg-transparent text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 border border-white/10">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Suggestions (only show when no messages or just the initial message) */}
            {messages.length <= 1 && (
              <div className="px-4 pb-4 animate-fade-in">
                <p className="text-sm text-muted-foreground mb-3 font-medium">Try asking about:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestionPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-left justify-start h-auto py-2 px-3 text-xs glass hover:bg-white/10 border-white/10 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => handleSuggestionClick(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-white/10 p-4 bg-white/5">
              <form onSubmit={sendMessage} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about Aryan..."
                  disabled={isLoading}
                  className="flex-1 bg-white/5 border-white/10 focus:ring-primary focus:border-primary transition-all"
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="shadow-glow hover:scale-105 transition-transform"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-sm text-muted-foreground">
            This AI assistant has comprehensive knowledge about Aryan's portfolio, skills, projects, and experience.
            <br />
            Powered by advanced AI to provide accurate and helpful information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;