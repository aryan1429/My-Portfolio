const fs = require('fs-extra');
const path = require('path');
const dbService = require('./database/service');

async function migrateAssets() {
  try {
    console.log('Starting asset migration...');

    const assetsDir = path.join(__dirname, 'src', 'assets');
    const uploadsDir = path.join(__dirname, 'uploads');
    
    // Ensure uploads directory exists
    await fs.ensureDir(uploadsDir);
    await fs.ensureDir(path.join(uploadsDir, 'videos'));
    await fs.ensureDir(path.join(uploadsDir, 'images'));
    await fs.ensureDir(path.join(uploadsDir, 'thumbnails'));
    await fs.ensureDir(path.join(uploadsDir, 'profile'));

    // Check if assets directory exists
    if (!await fs.pathExists(assetsDir)) {
      console.log('Assets directory not found, skipping migration.');
      return;
    }

    const files = await fs.readdir(assetsDir);
    console.log(`Found ${files.length} files to migrate`);

    for (const file of files) {
      const sourceFile = path.join(assetsDir, file);
      let targetDir = 'images'; // default

      // Determine target directory based on file type
      if (file.includes('.mp4') || file.includes('.mov') || file.includes('.avi')) {
        targetDir = 'videos';
      } else if (file.includes('thumbnail') || file.includes('_thumbnail')) {
        targetDir = 'thumbnails';
      } else if (file.includes('Profile-pic') || file.includes('profile-hero')) {
        targetDir = 'profile';
      }

      const targetFile = path.join(uploadsDir, targetDir, file);
      
      try {
        await fs.copy(sourceFile, targetFile);
        console.log(`Migrated: ${file} -> ${targetDir}/${file}`);
      } catch (error) {
        console.error(`Error migrating ${file}:`, error.message);
      }
    }

    console.log('Asset migration completed!');
    console.log('You can now safely remove the large files from src/assets and commit to git without LFS issues.');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateAssets();
}

module.exports = { migrateAssets };
