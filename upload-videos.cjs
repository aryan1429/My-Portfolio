const fs = require('fs-extra');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dwol4czfp',
  api_key: '578838569393329',
  api_secret: 'Rx3z-W0T5rjLyxbtUYYkPW5-ogc'
});

// Video files to upload
const videoFiles = [
  { 
    local: 'public/media/projects/Ironman-edit.mp4', 
    publicId: 'portfolio/ironman-edit'
  },
  { 
    local: 'public/media/projects/MoonFinal.mp4', 
    publicId: 'portfolio/moon-final'
  },
  { 
    local: 'public/media/projects/Spiderman_edit.mp4', 
    publicId: 'portfolio/spiderman-edit'
  },
  { 
    local: 'public/media/projects/WolverineFinal.mp4', 
    publicId: 'portfolio/wolverine-final'
  },
  { 
    local: 'public/media/projects/Salesman2.mp4', 
    publicId: 'portfolio/salesman-story'
  }
];

async function uploadVideo(localPath, publicId) {
  try {
    console.log(`Uploading ${localPath} as ${publicId}...`);
    
    const result = await cloudinary.uploader.upload(localPath, {
      resource_type: 'video',
      public_id: publicId,
      overwrite: true
    });
    
    console.log(`✅ Successfully uploaded: ${result.secure_url}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to upload ${localPath}:`, error.message);
    return null;
  }
}

async function uploadAllVideos() {
  console.log('Starting video upload to Cloudinary...\n');
  
  for (const video of videoFiles) {
    const fullPath = path.join(__dirname, video.local);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${fullPath}`);
      continue;
    }
    
    await uploadVideo(fullPath, video.publicId);
    console.log(''); // Add spacing between uploads
  }
  
  console.log('Upload process completed!');
}

// Run the upload
uploadAllVideos().catch(console.error);
