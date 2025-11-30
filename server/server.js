/**
 * Enhanced Server with Google Cloud Platform Support
 * Supports both traditional hosting and GCP deployment
 */

import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';
import OpenAI from 'openai';

// Import GCP services (only if available)
let GCPStorageService, FirestoreService;
try {
  const gcpStorage = await import('./server/services/gcpStorageService.server.js');
  const firestore = await import('./server/services/firestoreService.server.js');
  GCPStorageService = gcpStorage.default;
  FirestoreService = firestore.default;
} catch (error) {
  console.log('GCP services not available, running in traditional mode');
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Initialize GCP services if available
let gcpStorage = null;
let firestoreDb = null;

if (GCPStorageService && FirestoreService && process.env.GCP_PROJECT_ID) {
  try {
    gcpStorage = new GCPStorageService();
    firestoreDb = new FirestoreService();
    console.log('✅ GCP services initialized');
  } catch (error) {
    console.log('⚠️  GCP services failed to initialize, falling back to traditional mode');
  }
}

// Initialize OpenAI
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('✅ OpenAI initialized');
} else {
  console.log('⚠️  OpenAI API key not found');
}

// Import portfolio knowledge base
let portfolioKnowledge = null;
try {
  const knowledgeModule = await import('./data/portfolioKnowledge.js');
  portfolioKnowledge = knowledgeModule.portfolioKnowledge;
  console.log('✅ Portfolio knowledge base loaded');
} catch (error) {
  console.log('⚠️  Portfolio knowledge base not found');
}

// Fallback response generator for when OpenAI is unavailable
function generateFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Skills and expertise questions
  if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech stack')) {
    return `Here are Aryan's key technical skills:

🎯 **Frontend Expertise:**
• React.js (Expert) - Building dynamic, responsive web applications
• TypeScript (Advanced) - Type-safe development
• HTML5/CSS3 (Expert) - Modern web standards
• Tailwind CSS (Advanced) - Utility-first styling
• Three.js (Intermediate) - 3D web graphics

💻 **Backend & Databases:**
• Node.js & Express.js (Intermediate)
• Python with Flask/FastAPI (Intermediate)
• MongoDB, Firebase/Firestore, SQLite, Redis

☁️ **Cloud & DevOps:**
• Google Cloud Platform (GCP)
• Cloud Storage & App Engine
• Vercel deployment
• Git/GitHub version control

🎬 **Content Creation:**
• Adobe After Effects (Advanced)
• DaVinci Resolve (Intermediate)
• Video editing & post-production
• Script writing (Expert)
• YouTube content creation (Expert)`;
  }

  // Project questions
  if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('work')) {
    return `Here are some of Aryan's notable projects:

🎵 **TextMoodDJ** - AI-powered mood-based music assistant
• Uses sentiment analysis to understand user emotions
• Recommends music based on detected mood
• Built with Python and machine learning

🤖 **Mr Sarcastic** - AI Chatbot with personality
• Sarcastic AI assistant with music recommendation features
• Natural language processing and conversation flows
• Integrated with music APIs

💰 **Expense Tracker** - Full-stack financial management
• MERN stack application (MongoDB, Express, React, Node.js)
• Data visualization with charts and graphs
• User authentication and data persistence

🎥 **Content Creation Portfolio** - 50+ projects completed
• YouTube content creation and editing
• Adobe After Effects animations
• Script writing and video production

Aryan has completed 50+ projects across web development, AI/ML, and content creation with 3+ years of experience.`;
  }

  // Contact and collaboration questions
  if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
    return `📧 **Contact Aryan Aligeti:**

**Email:** aryanaligetibusiness@gmail.com
**Portfolio:** https://aryanaligeti.dev

💼 **Professional Focus:**
• Full-stack web development
• AI/ML projects and implementations
• Content creation and video production
• Technical consultation and project collaboration

🚀 **Experience:** 3+ years in development
📊 **Projects Completed:** 50+

Aryan is open to freelance projects, full-time opportunities, and collaboration on innovative tech projects. Feel free to reach out for any development needs or creative partnerships!`;
  }

  // Experience and background questions
  if (lowerMessage.includes('experience') || lowerMessage.includes('background') || lowerMessage.includes('about')) {
    return `👨‍💻 **About Aryan Aligeti:**

**Title:** Full Stack Developer & Content Creator
**Experience:** 3+ Years in Development
**Specialization:** React.js, AI/ML, Content Creation

🎯 **Professional Journey:**
• Started as a content creator with YouTube expertise
• Evolved into full-stack development with React.js focus
• Specialized in AI/ML integration and modern web technologies
• Combines technical skills with creative content production

🏆 **Key Achievements:**
• 50+ completed projects across various technologies
• Expert-level React.js and content creation skills
• Advanced knowledge in TypeScript and modern web development
• Successfully integrated AI/ML into web applications

🌟 **Unique Combination:**
Aryan brings a unique blend of technical development expertise and creative content creation skills, making him ideal for projects that require both robust development and engaging user experiences.`;
  }

  // Default response for general questions
  return `Hello! I'm Aryan Aligeti's AI assistant. Aryan is a **Full Stack Developer & Content Creator** with 3+ years of experience and 50+ completed projects.

🎯 **Key Expertise:**
• React.js & TypeScript development (Expert)
• AI/ML integration and chatbot development  
• Content creation with Adobe After Effects
• Full-stack web development (MERN stack)
• Google Cloud Platform deployment

💡 **Notable Projects:**
• TextMoodDJ - AI mood-based music assistant
• Mr Sarcastic - AI chatbot with personality
• Expense Tracker - Full-stack financial app

📧 **Contact:** aryanaligetibusiness@gmail.com

Feel free to ask me about Aryan's skills, projects, experience, or how to get in touch for collaboration opportunities!`;
}

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'https://aryanaligeti.dev',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8081',
    'https://aryanaligeti.dev'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure uploads directory (only if needed for file uploads)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'media', 'uploads')));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|avif|mp4|webm|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const status = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: firestoreDb ? 'GCP Firestore' : 'Traditional',
      storage: gcpStorage ? 'GCP Cloud Storage' : 'Local Storage',
      gcp: !!process.env.GCP_PROJECT_ID
    }
  };
  res.status(200).json(status);
});

// Portfolio API Routes

// Get portfolio profile
app.get('/api/portfolio/profile', async (req, res) => {
  try {
    if (firestoreDb) {
      const profile = await firestoreDb.getProfile();
      res.json(profile || {});
    } else {
      // Fallback to static data or file-based storage
      res.json({
        name: 'Your Portfolio',
        title: 'Full Stack Developer',
        description: 'Passionate developer creating amazing web experiences',
        email: process.env.CONTACT_EMAIL,
        social: {
          github: 'https://github.com/yourusername',
          linkedin: 'https://linkedin.com/in/yourprofile'
        }
      });
    }
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Get projects
app.get('/api/portfolio/projects', async (req, res) => {
  try {
    const { featured } = req.query;

    if (firestoreDb) {
      const projects = await firestoreDb.getProjects(featured === 'true');
      res.json(projects);
    } else {
      // Fallback to static project data
      const sampleProjects = [
        {
          id: '1',
          title: 'Sample Project',
          description: 'A sample project to demonstrate the portfolio',
          technologies: ['React', 'TypeScript', 'Node.js'],
          featured: true,
          category: 'web',
          createdAt: new Date()
        }
      ];
      res.json(featured === 'true' ? sampleProjects.filter(p => p.featured) : sampleProjects);
    }
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
});

// Create project (admin only)
app.post('/api/portfolio/projects', upload.single('image'), async (req, res) => {
  try {
    const projectData = JSON.parse(req.body.data || '{}');

    // Upload image if provided
    if (req.file && gcpStorage) {
      const imageUrl = await gcpStorage.uploadFile(
        req.file.buffer,
        `projects/${Date.now()}-${req.file.originalname}`,
        'projects'
      );
      projectData.imageUrl = imageUrl;
    }

    if (firestoreDb) {
      const projectId = await firestoreDb.createProject(projectData);
      res.json({ id: projectId, ...projectData });
    } else {
      // Fallback to file-based storage or return success
      res.json({ id: Date.now().toString(), ...projectData });
    }
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (gcpStorage) {
      // Upload to Google Cloud Storage
      const { folder = 'uploads' } = req.body;
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const fileUrl = await gcpStorage.uploadFile(req.file.buffer, fileName, folder);

      res.json({
        url: fileUrl,
        fileName,
        size: req.file.size,
        type: req.file.mimetype
      });
    } else {
      // Fallback to local storage
      const fs = await import('fs-extra');
      const uploadDir = path.join(__dirname, 'public', 'media', 'uploads');
      await fs.ensureDir(uploadDir);

      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, req.file.buffer);

      res.json({
        url: `/uploads/${fileName}`,
        fileName,
        size: req.file.size,
        type: req.file.mimetype
      });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please fill all required fields.' });
    }

    // Save to Firestore if available
    if (firestoreDb) {
      await firestoreDb.saveContactMessage({
        name,
        email,
        subject: subject || 'Portfolio Contact',
        message
      });
    }

    // Send email notification
    try {
      // Handle Nodemailer import compatibility (v6 vs v7)
      const createTransport = nodemailer.createTransport || nodemailer.default?.createTransport;

      if (!createTransport) {
        throw new Error('Nodemailer createTransport function not found');
      }

      const transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use STARTTLS
        requireTLS: true,
        logger: true, // Log to console
        debug: true, // Include SMTP traffic in logs
        auth: {
          user: process.env.SMTP_USER || process.env.EMAIL_USER,
          pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
        },
      });

      console.log(`📧 Preparing to send email to: ${process.env.CONTACT_EMAIL || 'DEFAULT (your-email@gmail.com)'}`);

      const mailOptions = {
        from: process.env.SMTP_FROM || email,
        to: process.env.CONTACT_EMAIL || 'your-email@gmail.com',
        subject: `Portfolio Contact: ${subject || 'New Message from ' + name}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'Portfolio Contact'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        `,
      };

      // Only try to send email if SMTP credentials are configured
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).json({ message: 'Message sent successfully.' });
      } else {
        console.log('Email not configured, but message saved:', { name, email, message });
        res.status(200).json({
          message: 'Message received (Email not configured on server).',
          warning: true
        });
      }
    } catch (emailError) {
      console.error('❌ Email sending failed DETAILED ERROR:', {
        message: emailError.message,
        code: emailError.code,
        command: emailError.command,
        response: emailError.response,
        stack: emailError.stack
      });

      res.status(200).json({
        message: 'Message received but failed to send email notification.',
        warning: true,
        debugError: emailError.message
      });
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      error: 'Failed to send message.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get contact messages (admin only)
app.get('/api/contact/messages', async (req, res) => {
  try {
    if (firestoreDb) {
      const messages = await firestoreDb.getContactMessages();
      res.json(messages);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error getting contact messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  console.log('🤖 AI Chat request received');
  console.log('Request body:', req.body);
  console.log('OpenAI available:', !!openai);
  console.log('Portfolio knowledge available:', !!portfolioKnowledge);

  try {
    if (!openai) {
      console.log('❌ OpenAI not initialized');
      return res.status(503).json({
        error: 'AI service is not available. Please check the OpenAI API configuration.'
      });
    }

    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim().length === 0) {
      console.log('❌ Empty message received');
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('✅ Processing message:', message.substring(0, 50) + '...');

    // Create system prompt with portfolio knowledge
    const systemPrompt = `You are Aryan Aligeti's AI assistant. You have comprehensive knowledge about Aryan's portfolio, skills, projects, and experience. Answer questions about Aryan in a helpful, professional, and friendly manner.

Here's what you know about Aryan Aligeti:

PERSONAL INFORMATION:
- Name: ${portfolioKnowledge?.personal?.name || 'Aryan Aligeti'}
- Title: ${portfolioKnowledge?.personal?.title || 'Full Stack Developer & Content Creator'}
- Email: ${portfolioKnowledge?.personal?.email || 'aryanaligetibusiness@gmail.com'}
- Experience: ${portfolioKnowledge?.personal?.experience || '3+ Years'}
- Projects Completed: ${portfolioKnowledge?.personal?.projects_completed || '50+'}

TECHNICAL SKILLS:
Frontend: React.js (Expert), TypeScript (Advanced), HTML5/CSS3 (Expert), Tailwind CSS (Advanced), Three.js (Intermediate)
Backend: Node.js (Intermediate), Express.js (Intermediate), Python (Intermediate), Flask/FastAPI (Intermediate)
Databases: MongoDB (Intermediate), Firebase/Firestore (Intermediate), SQLite, Redis
Cloud & DevOps: Google Cloud Platform, Cloud Storage, App Engine, Vercel, Git/GitHub

CONTENT CREATION SKILLS:
- Adobe After Effects (Advanced)
- DaVinci Resolve (Intermediate) 
- Video Editing & Post-production
- Script Writing (Expert)
- YouTube Content Creation (Expert)

KEY PROJECTS:
1. TextMoodDJ - AI mood-based music assistant with sentiment analysis
2. Mr Sarcastic - AI chatbot with sarcastic personality and music recommendations
3. Expense Tracker - Full-stack MERN application with data visualization
4. Iron Man Project - 3D web project with Three.js
5. Moon Landing Recreation - 3D historical recreation

ACHIEVEMENTS:
- Won 5+ hackathons in Web Development
- Managed 3+ YouTube channels
- Completed 100+ video editing projects
- 3+ years content creation experience

UNIQUE STRENGTHS:
- Combines technical development with creative content creation
- Specializes in AI-powered web applications
- Expert in both coding and video production
- Strong background in 3D web development

Always provide accurate, helpful information about Aryan. If asked about something not in your knowledge base, politely say you don't have that specific information but offer related information you do know. Be conversational and professional.`;

    // Convert conversation history to OpenAI format
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history (limit to last 10 messages for context)
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.slice(-10).forEach(msg => {
        messages.push({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        });
      });
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    console.log('🚀 Calling OpenAI API...');

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const response = completion.choices[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response right now. Please try again.";

    console.log('✅ OpenAI response received:', response.substring(0, 50) + '...');

    res.json({ response });

  } catch (error) {
    console.error('❌ AI Chat Error:', error);

    // Check if it's a quota/rate limit error and provide fallback
    if (error.code === 'insufficient_quota' || error.code === 'rate_limit_exceeded') {
      console.log('🔄 OpenAI quota exceeded, providing fallback response');

      const fallbackResponse = generateFallbackResponse(req.body.message);

      return res.json({
        response: fallbackResponse + "\n\n*Note: AI assistant is currently at capacity. This is a pre-configured response based on Aryan's portfolio.*"
      });
    }

    let errorMessage = 'Sorry, I encountered an error. Please try again.';

    if (error.code === 'invalid_api_key') {
      errorMessage = 'AI service configuration error. Please contact support.';
    }

    res.status(500).json({ error: errorMessage });
  }
});

// Analytics endpoint
app.get('/api/analytics/stats', async (req, res) => {
  try {
    if (firestoreDb) {
      const stats = await firestoreDb.getStats();
      res.json(stats);
    } else {
      res.json({
        projects: 0,
        messages: 0,
        featuredProjects: 0
      });
    }
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// API not found handler
app.get('*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`☁️  GCP Mode: ${gcpStorage && firestoreDb ? 'Enabled' : 'Disabled'}`);
  console.log(`🗄️  Database: ${firestoreDb ? 'Firestore' : 'Traditional'}`);
  console.log(`📁 Storage: ${gcpStorage ? 'Cloud Storage' : 'Local'}`);
});

export default app;
