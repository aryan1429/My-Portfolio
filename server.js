import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from uploads directory (for backward compatibility)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'media', 'uploads')));

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API Routes
import apiRoutes from './server/api.js';
app.use('/api', apiRoutes);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || process.env.VITE_EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill all the fields.' });
  }

  const mailOptions = {
    from: email,
    to: 'aryanaligetibusiness@gmail.com',
    subject: `New message from ${name} via portfolio contact form`,
    text: `You have received a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
