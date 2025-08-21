const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');

// Azure Configuration
// You'll need to set these up after creating your Azure account
const AZURE_CONFIG = {
  accountName: 'YOUR_STORAGE_ACCOUNT_NAME', // Replace with your Azure Storage Account name
  accountKey: 'YOUR_STORAGE_ACCOUNT_KEY', // Replace with your Azure Storage Account key
  containerName: 'portfolio-media' // Choose your container name
};

// Create connection string
const connectionString = `DefaultEndpointsProtocol=https;AccountName=${AZURE_CONFIG.accountName};AccountKey=${AZURE_CONFIG.accountKey};EndpointSuffix=core.windows.net`;

// Video files to upload
const mediaFiles = [
  // Videos
  { 
    local: 'public/media/projects/Ironman-edit.mp4', 
    blobName: 'videos/ironman-edit.mp4',
    contentType: 'video/mp4'
  },
  { 
    local: 'public/media/projects/MoonFinal.mp4', 
    blobName: 'videos/moon-final.mp4',
    contentType: 'video/mp4'
  },
  { 
    local: 'public/media/projects/Spiderman_edit.mp4', 
    blobName: 'videos/spiderman-edit.mp4',
    contentType: 'video/mp4'
  },
  { 
    local: 'public/media/projects/WolverineFinal.mp4', 
    blobName: 'videos/wolverine-final.mp4',
    contentType: 'video/mp4'
  },
  { 
    local: 'public/media/projects/Salesman2.mp4', 
    blobName: 'videos/salesman-story.mp4',
    contentType: 'video/mp4'
  },
  // Images
  { 
    local: 'public/media/projects/Ironman.jpg', 
    blobName: 'images/ironman-hero.jpg',
    contentType: 'image/jpeg'
  },
  { 
    local: 'public/media/projects/moon_thumbnail.png', 
    blobName: 'images/moon-thumbnail.png',
    contentType: 'image/png'
  },
  { 
    local: 'public/media/projects/spiderman_thumbnail.jpg', 
    blobName: 'images/spiderman-thumbnail.jpg',
    contentType: 'image/jpeg'
  },
  { 
    local: 'public/media/projects/wolverine_thumbnail.png', 
    blobName: 'images/wolverine-thumbnail.png',
    contentType: 'image/png'
  },
  { 
    local: 'public/media/projects/salesman2.avif', 
    blobName: 'images/salesman-thumbnail.avif',
    contentType: 'image/avif'
  }
];

async function createContainer() {
  try {
    console.log(`Creating Azure container: ${AZURE_CONFIG.containerName}...`);
    
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(AZURE_CONFIG.containerName);
    
    await containerClient.createIfNotExists({
      access: 'blob' // Public access for blobs
    });
    
    console.log('✅ Container created and configured for public access');
    return containerClient;
  } catch (error) {
    console.error('❌ Failed to create container:', error.message);
    throw error;
  }
}

async function uploadFile(containerClient, localPath, blobName, contentType) {
  try {
    const fullPath = path.join(__dirname, localPath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${fullPath}`);
      return null;
    }
    
    console.log(`Uploading ${localPath} to Azure...`);
    
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    const fileContent = fs.readFileSync(fullPath);
    
    await blockBlobClient.upload(fileContent, fileContent.length, {
      blobHTTPHeaders: {
        blobContentType: contentType
      }
    });
    
    const url = blockBlobClient.url;
    console.log(`✅ Successfully uploaded: ${url}`);
    return { blobName, url };
  } catch (error) {
    console.error(`❌ Failed to upload ${localPath}:`, error.message);
    return null;
  }
}

async function uploadAllFiles() {
  console.log('Starting migration to Azure Blob Storage...\n');
  
  // Create container first
  const containerClient = await createContainer();
  console.log('');
  
  // Upload all files
  const results = [];
  for (const file of mediaFiles) {
    const result = await uploadFile(containerClient, file.local, file.blobName, file.contentType);
    if (result) {
      results.push({
        local: file.local,
        azureUrl: result.url
      });
    }
    console.log(''); // Add spacing
  }
  
  // Generate URL mapping
  console.log('='.repeat(50));
  console.log('MIGRATION COMPLETE! Here are your new URLs:');
  console.log('='.repeat(50));
  
  results.forEach(({ local, azureUrl }) => {
    console.log(`${path.basename(local)} → ${azureUrl}`);
  });
  
  console.log('\n🎉 All files uploaded successfully!');
  console.log('💡 Update your code to use the new Azure URLs above.');
}

// Validation function to check Azure credentials
function validateConfig() {
  if (AZURE_CONFIG.accountName === 'YOUR_STORAGE_ACCOUNT_NAME' || 
      AZURE_CONFIG.accountKey === 'YOUR_STORAGE_ACCOUNT_KEY') {
    console.error('❌ Please configure your Azure credentials first!');
    console.log('\n📝 Steps to set up Azure:');
    console.log('1. Go to https://portal.azure.com/ and create a free account');
    console.log('2. Create a Storage Account');
    console.log('3. Go to Access Keys and copy your credentials');
    console.log('4. Update AZURE_CONFIG with your credentials');
    return false;
  }
  return true;
}

// Run the migration
if (validateConfig()) {
  uploadAllFiles().catch(console.error);
}

module.exports = { uploadAllFiles, AZURE_CONFIG };
