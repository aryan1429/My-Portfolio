const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const dbService = require('../database/service');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
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
    const projects = await dbService.getAllProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/projects/featured', async (req, res) => {
  try {
    const projects = await dbService.getFeaturedProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/projects/:id', async (req, res) => {
  try {
    const project = await dbService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/projects', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), async (req, res) => {
  try {
    const projectData = JSON.parse(req.body.data);
    const media = { thumbnail: '', video: '', images: [] };

    // Handle file uploads
    if (req.files) {
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const thumbnailFile = await dbService.saveMediaFile(req.files.thumbnail[0], 'thumbnails');
        media.thumbnail = thumbnailFile.filename;
      }

      if (req.files.video && req.files.video[0]) {
        const videoFile = await dbService.saveMediaFile(req.files.video[0], 'videos');
        media.video = videoFile.filename;
      }

      if (req.files.images) {
        for (const imageFile of req.files.images) {
          const image = await dbService.saveMediaFile(imageFile, 'images');
          media.images.push(image.filename);
        }
      }
    }

    const project = await dbService.createProject({
      ...projectData,
      media
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/projects/:id', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), async (req, res) => {
  try {
    const updateData = JSON.parse(req.body.data);
    
    // Handle file uploads if any
    if (req.files) {
      const media = { ...updateData.media };

      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const thumbnailFile = await dbService.saveMediaFile(req.files.thumbnail[0], 'thumbnails');
        media.thumbnail = thumbnailFile.filename;
      }

      if (req.files.video && req.files.video[0]) {
        const videoFile = await dbService.saveMediaFile(req.files.video[0], 'videos');
        media.video = videoFile.filename;
      }

      if (req.files.images) {
        media.images = media.images || [];
        for (const imageFile of req.files.images) {
          const image = await dbService.saveMediaFile(imageFile, 'images');
          media.images.push(image.filename);
        }
      }

      updateData.media = media;
    }

    const project = await dbService.updateProject(req.params.id, updateData);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    const project = await dbService.deleteProject(req.params.id);
    res.json({ message: 'Project deleted successfully', project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Content Creation routes
router.get('/content', async (req, res) => {
  try {
    const content = await dbService.getAllContentCreation();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/content/featured', async (req, res) => {
  try {
    const content = await dbService.getFeaturedContent();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/content/:id', async (req, res) => {
  try {
    const content = await dbService.getContentCreationById(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/content', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), async (req, res) => {
  try {
    const contentData = JSON.parse(req.body.data);
    const media = { thumbnail: '', video: '', images: [] };

    // Handle file uploads
    if (req.files) {
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const thumbnailFile = await dbService.saveMediaFile(req.files.thumbnail[0], 'thumbnails');
        media.thumbnail = thumbnailFile.filename;
      }

      if (req.files.video && req.files.video[0]) {
        const videoFile = await dbService.saveMediaFile(req.files.video[0], 'videos');
        media.video = videoFile.filename;
      }

      if (req.files.images) {
        for (const imageFile of req.files.images) {
          const image = await dbService.saveMediaFile(imageFile, 'images');
          media.images.push(image.filename);
        }
      }
    }

    const content = await dbService.createContentCreation({
      ...contentData,
      media
    });

    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/content/:id', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), async (req, res) => {
  try {
    const updateData = JSON.parse(req.body.data);
    
    // Handle file uploads if any
    if (req.files) {
      const media = { ...updateData.media };

      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const thumbnailFile = await dbService.saveMediaFile(req.files.thumbnail[0], 'thumbnails');
        media.thumbnail = thumbnailFile.filename;
      }

      if (req.files.video && req.files.video[0]) {
        const videoFile = await dbService.saveMediaFile(req.files.video[0], 'videos');
        media.video = videoFile.filename;
      }

      if (req.files.images) {
        media.images = media.images || [];
        for (const imageFile of req.files.images) {
          const image = await dbService.saveMediaFile(imageFile, 'images');
          media.images.push(image.filename);
        }
      }

      updateData.media = media;
    }

    const content = await dbService.updateContentCreation(req.params.id, updateData);
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/content/:id', async (req, res) => {
  try {
    const content = await dbService.deleteContentCreation(req.params.id);
    res.json({ message: 'Content deleted successfully', content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profile routes
router.get('/profile', async (req, res) => {
  try {
    const profile = await dbService.getProfile();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const profileData = JSON.parse(req.body.data);
    
    // Handle file uploads if any
    if (req.files) {
      const media = { ...profileData.media };

      if (req.files.profilePic && req.files.profilePic[0]) {
        const profilePicFile = await dbService.saveMediaFile(req.files.profilePic[0], 'profile');
        media.profilePic = profilePicFile.filename;
      }

      if (req.files.heroImage && req.files.heroImage[0]) {
        const heroImageFile = await dbService.saveMediaFile(req.files.heroImage[0], 'profile');
        media.heroImage = heroImageFile.filename;
      }

      profileData.media = media;
    }

    const profile = await dbService.updateProfile(profileData);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search routes
router.get('/search/projects', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    const projects = await dbService.searchProjects(q);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search/content', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    const content = await dbService.searchContentCreation(q);
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// File upload route for standalone media
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const category = req.body.category || 'general';
    const fileData = await dbService.saveMediaFile(req.file, category);
    res.json(fileData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
