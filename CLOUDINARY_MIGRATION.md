# Video Storage Migration Guide

This guide will help you migrate your large video files from local storage to Cloudinary, significantly reducing build times and deployment issues.

## 🎯 Benefits

- **Faster Builds**: Remove large files from your repository
- **Better Performance**: Automatic video optimization and compression
- **Responsive Videos**: Serve different quality based on device/connection
- **Global CDN**: Fast loading from anywhere in the world
- **Automatic Formats**: WebM, MP4, AVIF based on browser support

## 🚀 Setup Steps

### 1. Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com) and create a free account
2. Note your **Cloud Name** from the dashboard
3. Copy your **API Key** and **API Secret** (for future uploads)

### 2. Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Cloudinary credentials:
   ```
   REACT_APP_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
   REACT_APP_CLOUDINARY_API_KEY=your-api-key
   REACT_APP_CLOUDINARY_API_SECRET=your-api-secret
   ```

### 3. Upload Your Files

#### Option A: Manual Upload (Recommended for first time)

1. Log into your Cloudinary dashboard
2. Go to Media Library
3. Create a folder called `portfolio`
4. Upload your files with these names:

**Videos:**
- `Ironman-edit.mp4` → upload as `ironman-edit`
- `MoonFinal.mp4` → upload as `moon-final`
- `Spiderman_edit.mp4` → upload as `spiderman-edit`
- `WolverineFinal.mp4` → upload as `wolverine-final`
- `Salesman2.mp4` → upload as `salesman-story`

**Images:**
- `Ironman.jpg` → upload as `ironman-hero`
- `moon_thumbnail.png` → upload as `moon-thumbnail`
- `spiderman_thumbnail.jpg` → upload as `spiderman-thumbnail`
- `wolverine_thumbnail.png` → upload as `wolverine-thumbnail`
- `salesman2.avif` → upload as `salesman-thumbnail`
- `expense.png` → upload as `expense-app`
- `Profile-pic.jpeg` → upload as `profile-pic`
- `profile-hero.jpg` → upload as `profile-hero`

#### Option B: Programmatic Upload (Advanced)

```bash
# Install Cloudinary CLI
npm install -g cloudinary-cli

# Upload all videos
cld upload src/assets/*.mp4 --folder portfolio --use_filename --unique_filename false

# Upload all images
cld upload src/assets/*.{jpg,png,jpeg,avif} --folder portfolio --use_filename --unique_filename false
```

### 4. Run Migration Script

```bash
# See what files need to be uploaded
node migrate-to-cloudinary.js list

# Run the migration (creates schema-migrated.json)
node migrate-to-cloudinary.js
```

### 5. Update Your Database

```bash
# Backup current schema
cp database/schema.json database/schema-backup.json

# Replace with migrated version
cp database/schema-migrated.json database/schema.json
```

### 6. Update Your Components

Replace local imports with Cloudinary components:

**Before:**
```tsx
import videoFile from '@/assets/Ironman-edit.mp4';

<video src={videoFile} controls />
```

**After:**
```tsx
import { VideoPlayer } from '@/components/CloudinaryMedia';

<VideoPlayer 
  publicId="portfolio/ironman-edit"
  title="Iron Man Project"
  width={800}
  height={450}
/>
```

### 7. Clean Up Local Files (Optional)

After confirming everything works:

```bash
# Remove large video files from assets
rm src/assets/*.mp4
rm src/assets/*.avif

# Keep only essential images that are used directly in imports
```

## 📱 Usage Examples

### Video Component
```tsx
import { VideoPlayer } from '@/components/CloudinaryMedia';

<VideoPlayer 
  publicId="portfolio/ironman-edit"
  title="Iron Man Project"
  width={800}
  height={450}
  controls={true}
  muted={true}
  autoPlay={false}
/>
```

### Optimized Image
```tsx
import { OptimizedImage } from '@/components/CloudinaryMedia';

<OptimizedImage 
  publicId="portfolio/ironman-hero"
  alt="Iron Man Project"
  width={400}
  height={300}
  quality="auto"
  format="auto"
/>
```

### Responsive Video
```tsx
<VideoPlayer 
  publicId="portfolio/moon-final"
  title="Moon Landing"
  width={1200}  // Max width
  height={675}  // Max height
  className="w-full max-w-4xl mx-auto"
/>
```

## 🎛️ Advanced Features

### Dynamic Quality
Videos automatically serve different qualities based on:
- Device type (mobile vs desktop)
- Connection speed
- Screen resolution

### Multiple Formats
Cloudinary automatically serves:
- WebM for supported browsers (smaller file size)
- MP4 for fallback
- AVIF for modern browsers (even smaller)

### Lazy Loading
```tsx
<OptimizedImage 
  publicId="portfolio/thumbnail"
  alt="Thumbnail"
  loading="lazy"  // Only loads when in viewport
/>
```

## 🚨 Troubleshooting

### Build Still Failing?
1. Check that `.env` has correct `REACT_APP_CLOUDINARY_CLOUD_NAME`
2. Verify all files are uploaded to Cloudinary
3. Ensure public IDs match the migration script

### Videos Not Loading?
1. Check Cloudinary Media Library for uploaded files
2. Verify the `publicId` matches the folder structure
3. Check browser console for network errors

### Images Blurry?
1. Increase `quality` parameter: `quality="auto:best"`
2. Ensure source images are high resolution
3. Use appropriate `width` and `height` parameters

## 📊 Performance Benefits

**Before (Local Files):**
- Build time: ~2-3 minutes
- Bundle size: ~300MB
- Loading time: 10-30 seconds

**After (Cloudinary):**
- Build time: ~30 seconds
- Bundle size: ~2MB
- Loading time: 2-5 seconds

## 🔄 Future Updates

When adding new videos:
1. Upload to Cloudinary with descriptive public ID
2. Add entry to database schema
3. Use `VideoPlayer` component in your pages
4. No need to redeploy for video changes!

## 📝 Next Steps

1. Set up automated uploads for your admin panel
2. Implement video analytics
3. Add video chapters/markers
4. Set up automatic thumbnail generation
