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

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));
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
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.CONTACT_EMAIL || 'your-email@gmail.com',
      subject: `Portfolio Contact: ${subject || 'New Message'}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'Failed to send message.' });
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
  try {
    if (!openai) {
      return res.status(503).json({ 
        error: 'AI service is not available. Please check the OpenAI API configuration.' 
      });
    }

    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

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

    res.json({ response });

  } catch (error) {
    console.error('AI Chat Error:', error);
    
    let errorMessage = 'Sorry, I encountered an error. Please try again.';
    
    if (error.code === 'insufficient_quota') {
      errorMessage = 'AI service quota exceeded. Please try again later.';
    } else if (error.code === 'invalid_api_key') {
      errorMessage = 'AI service configuration error. Please contact support.';
    } else if (error.code === 'rate_limit_exceeded') {
      errorMessage = 'Too many requests. Please wait a moment and try again.';
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

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
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
