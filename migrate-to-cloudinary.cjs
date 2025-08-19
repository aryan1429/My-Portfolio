const fs = require('fs-extra');
const path = require('path');

// Mapping of your current local files to Cloudinary public IDs
const fileToCloudinaryMapping = {
  // Videos
  'Ironman-edit.mp4': 'portfolio/ironman-edit',
  'MoonFinal.mp4': 'portfolio/moon-final',
  'Spiderman_edit.mp4': 'portfolio/spiderman-edit',
  'WolverineFinal.mp4': 'portfolio/wolverine-final',
  'Salesman2.mp4': 'portfolio/salesman-story',
  
  // Images
  'Ironman.jpg': 'portfolio/ironman-hero',
  'moon_thumbnail.png': 'portfolio/moon-thumbnail',
  'spiderman_thumbnail.jpg': 'portfolio/spiderman-thumbnail',
  'wolverine_thumbnail.png': 'portfolio/wolverine-thumbnail',
  'salesman2.avif': 'portfolio/salesman-thumbnail',
  'expense.png': 'portfolio/expense-app',
  'Profile-pic.jpeg': 'portfolio/profile-pic',
  'profile-hero.jpg': 'portfolio/profile-hero'
};

// Your Cloudinary cloud name (replace this)
const CLOUDINARY_CLOUD_NAME = 'dwol4czfp'; // Your actual cloud name

function generateCloudinaryUrl(fileName, isVideo = false, options = {}) {
  const publicId = fileToCloudinaryMapping[fileName];
  if (!publicId) {
    console.warn(`No Cloudinary mapping found for file: ${fileName}`);
    return null;
  }

  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}`;
  const resourceType = isVideo ? 'video' : 'image';
  
  // Default transformations
  const defaultTransformations = isVideo 
    ? 'q_auto,f_auto' 
    : 'q_auto,f_auto';
  
  // Add custom transformations for thumbnails
  const transformations = options.isThumbnail 
    ? 'q_auto,f_auto,w_400,h_300,c_fill'
    : defaultTransformations;

  return `${baseUrl}/${resourceType}/upload/${transformations}/${publicId}`;
}

function convertLocalPathToCloudinary(localPath) {
  if (!localPath || typeof localPath !== 'string') return localPath;
  
  // Extract filename from path
  const fileName = path.basename(localPath);
  
  // Determine if it's a video
  const isVideo = /\.(mp4|mov|avi|webm)$/i.test(fileName);
  
  // Check if this is used as a thumbnail (in thumbnail field)
  const isThumbnail = localPath.includes('thumbnail') || 
                     localPath.includes('_thumbnail') ||
                     fileName.includes('thumbnail');

  return generateCloudinaryUrl(fileName, isVideo, { isThumbnail });
}

async function migrateDatabase() {
  try {
    console.log('Starting database migration to Cloudinary URLs...');
    
    // Read current database
    const dbPath = path.join(__dirname, 'database', 'schema.json');
    const data = await fs.readJson(dbPath);
    
    // Create backup
    const backupPath = path.join(__dirname, 'database', `schema-backup-${Date.now()}.json`);
    await fs.writeJson(backupPath, data, { spaces: 2 });
    console.log(`Backup created: ${backupPath}`);
    
    // Migrate projects
    if (data.projects) {
      data.projects.forEach(project => {
        if (project.media) {
          if (project.media.thumbnail) {
            project.media.thumbnail = convertLocalPathToCloudinary(project.media.thumbnail);
          }
          if (project.media.video) {
            project.media.video = convertLocalPathToCloudinary(project.media.video);
          }
          if (project.media.images && Array.isArray(project.media.images)) {
            project.media.images = project.media.images.map(img => 
              convertLocalPathToCloudinary(img)
            ).filter(Boolean);
          }
        }
      });
    }
    
    // Migrate content
    if (data.content) {
      data.content.forEach(content => {
        if (content.media) {
          if (content.media.thumbnail) {
            content.media.thumbnail = convertLocalPathToCloudinary(content.media.thumbnail);
          }
          if (content.media.video) {
            content.media.video = convertLocalPathToCloudinary(content.media.video);
          }
          if (content.media.images && Array.isArray(content.media.images)) {
            content.media.images = content.media.images.map(img => 
              convertLocalPathToCloudinary(img)
            ).filter(Boolean);
          }
        }
      });
    }
    
    // Migrate profile
    if (data.profile) {
      if (data.profile.profilePic) {
        data.profile.profilePic = convertLocalPathToCloudinary(data.profile.profilePic);
      }
      if (data.profile.heroImage) {
        data.profile.heroImage = convertLocalPathToCloudinary(data.profile.heroImage);
      }
    }
    
    // Update last modified
    if (data.settings) {
      data.settings.lastUpdated = new Date().toISOString();
    }
    
    // Write migrated database
    const migratedPath = path.join(__dirname, 'database', 'schema-migrated.json');
    await fs.writeJson(migratedPath, data, { spaces: 2 });
    
    console.log('Migration completed successfully!');
    console.log(`Migrated database saved as: ${migratedPath}`);
    console.log('\nNext steps:');
    console.log('1. Upload your video/image files to Cloudinary');
    console.log('2. Update CLOUDINARY_CLOUD_NAME in this script');
    console.log('3. Replace schema.json with schema-migrated.json');
    console.log('4. Remove local asset files from src/assets to reduce build size');
    
    return data;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Helper function to list all files that need to be uploaded
function listFilesToUpload() {
  console.log('\nFiles that need to be uploaded to Cloudinary:');
  console.log('='.repeat(50));
  
  Object.entries(fileToCloudinaryMapping).forEach(([fileName, publicId]) => {
    const isVideo = /\.(mp4|mov|avi|webm)$/i.test(fileName);
    console.log(`${fileName} -> ${publicId} (${isVideo ? 'video' : 'image'})`);
  });
  
  console.log('\nCloudinary folder structure:');
  console.log('portfolio/');
  console.log('  ├── ironman-edit (video)');
  console.log('  ├── ironman-hero (image)');
  console.log('  ├── moon-final (video)');
  console.log('  ├── moon-thumbnail (image)');
  console.log('  ├── spiderman-edit (video)');
  console.log('  ├── spiderman-thumbnail (image)');
  console.log('  ├── wolverine-final (video)');
  console.log('  ├── wolverine-thumbnail (image)');
  console.log('  ├── salesman-story (video)');
  console.log('  ├── salesman-thumbnail (image)');
  console.log('  ├── expense-app (image)');
  console.log('  ├── profile-pic (image)');
  console.log('  └── profile-hero (image)');
}

// Run migration if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'list') {
    listFilesToUpload();
  } else {
    migrateDatabase().catch(console.error);
  }
}

module.exports = {
  migrateDatabase,
  listFilesToUpload,
  convertLocalPathToCloudinary,
  generateCloudinaryUrl,
  fileToCloudinaryMapping
};
