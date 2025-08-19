import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import database from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'public', 'media', 'uploads');
    await fs.ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm|avif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

// Projects routes
router.get('/projects', async (req, res) => {
  try {
    const projects = await database.getProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/projects/:id', async (req, res) => {
  try {
    const project = await database.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const { title, description, category, technologies, featured } = req.body;
    const project = await database.addProject({
      title,
      description,
      category,
      technologies,
      featured
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const project = await database.updateProject(req.params.id, req.body);
    res.json(project);
  } catch (error) {
    if (error.message === 'Project not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    const project = await database.deleteProject(req.params.id);
    res.json({ message: 'Project deleted successfully', project });
  } catch (error) {
    if (error.message === 'Project not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Content creation routes
router.get('/content', async (req, res) => {
  try {
    const content = await database.getContentCreation();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/content/:id', async (req, res) => {
  try {
    const content = await database.getContentItem(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/content', async (req, res) => {
  try {
    const { title, description, category, featured } = req.body;
    const content = await database.addContentItem({
      title,
      description,
      category,
      featured
    });
    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/content/:id', async (req, res) => {
  try {
    const content = await database.updateContentItem(req.params.id, req.body);
    res.json(content);
  } catch (error) {
    if (error.message === 'Content item not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

router.delete('/content/:id', async (req, res) => {
  try {
    const content = await database.deleteContentItem(req.params.id);
    res.json({ message: 'Content deleted successfully', content });
  } catch (error) {
    if (error.message === 'Content item not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Profile routes
router.get('/profile', async (req, res) => {
  try {
    const profile = await database.getProfile();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const profile = await database.updateProfile(req.body);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// File upload routes
router.post('/upload/:type/:id', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { type, id } = req.params;
    const { mediaType } = req.body;
    
    let filePath = `/media/uploads/${req.file.filename}`;

    // Generate thumbnail for videos
    if (req.file.mimetype.startsWith('video/') && mediaType === 'video') {
      // For now, we'll just store the video path
      // You can implement video thumbnail generation here if needed
    }

    // Resize images if needed
    if (req.file.mimetype.startsWith('image/') && mediaType === 'thumbnail') {
      const thumbnailPath = path.join(path.dirname(req.file.path), 'thumb-' + req.file.filename);
      await sharp(req.file.path)
        .resize(400, 300, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);
      
      filePath = `/media/uploads/thumb-${req.file.filename}`;
    }

    // Update database
    let updatedItem;
    if (type === 'project') {
      updatedItem = await database.addMediaToProject(id, mediaType, filePath);
    } else if (type === 'content') {
      updatedItem = await database.addMediaToContent(id, mediaType, filePath);
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    res.json({
      message: 'File uploaded successfully',
      filePath,
      item: updatedItem
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search routes
router.get('/search/projects', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const results = await database.searchProjects(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search/content', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const results = await database.searchContent(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve uploaded files
router.get('/media/:folder/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'public', 'media', req.params.folder, req.params.filename);
  res.sendFile(filePath);
});

router.get('/media/:subfolder/:folder/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'public', 'media', req.params.subfolder, req.params.folder, req.params.filename);
  res.sendFile(filePath);
});

export default router;
