# Deployment Configuration

## Structure for Hosting

Your portfolio is now configured for deployment with the following structure:

### File Organization
```
public/
├── media/
│   ├── projects/     # Project-related media
│   ├── content/      # Content creation media  
│   ├── profile/      # Profile images
│   └── uploads/      # User uploaded files
├── placeholder.svg
└── robots.txt

database/
└── schema.json       # Portfolio data

server/
├── api.js           # API routes
└── database.js      # Database service
```

### Media Paths
All media files now use absolute paths from the root:
- `/media/projects/filename.ext` - Project assets
- `/media/content/filename.ext` - Content creation assets  
- `/media/profile/filename.ext` - Profile images
- `/media/uploads/filename.ext` - User uploaded files

### Deployment Ready Features

1. **Static File Serving**: All media files are served from `/public/media/`
2. **Database**: JSON-based database that works on any hosting platform
3. **File Uploads**: New uploads go to `/public/media/uploads/`
4. **API Endpoints**: RESTful API for managing content
5. **Environment Agnostic**: Works locally and on hosting platforms

### Hosting Platforms
This setup works with:
- ✅ Vercel
- ✅ Netlify  
- ✅ Railway
- ✅ Render
- ✅ Heroku
- ✅ Any Node.js hosting

### Environment Variables Needed
```
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Build Commands
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "node server.js"
  }
}
```

### Git LFS Alternative
Instead of Git LFS, your media files are now:
1. Stored in `/public/media/` folders
2. Served as static assets
3. Referenced by absolute paths in the database
4. Can be uploaded via API endpoints

This eliminates Git LFS issues while maintaining full functionality.
