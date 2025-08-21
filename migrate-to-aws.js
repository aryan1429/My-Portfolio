const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// AWS Configuration
// You'll need to set these up after creating your AWS account
const AWS_CONFIG = {
  accessKeyId: 'YOUR_ACCESS_KEY_ID', // Replace with your AWS Access Key
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY', // Replace with your AWS Secret Key
  region: 'us-east-1', // Choose your preferred region
  bucketName: 'my-portfolio-media' // Choose your bucket name
};

// Configure AWS
AWS.config.update({
  accessKeyId: AWS_CONFIG.accessKeyId,
  secretAccessKey: AWS_CONFIG.secretAccessKey,
  region: AWS_CONFIG.region
});

const s3 = new AWS.S3();

// Video files to upload
const mediaFiles = [
  // Videos
  { 
    local: 'public/media/projects/Ironman-edit.mp4', 
    s3Key: 'videos/ironman-edit.mp4',
    contentType: 'video/mp4'
  },
  { 
    local: 'public/media/projects/MoonFinal.mp4', 
    s3Key: 'videos/moon-final.mp4',
    contentType: 'video/mp4'
  },
  { 
    local: 'public/media/projects/Spiderman_edit.mp4', 
    s3Key: 'videos/spiderman-edit.mp4',
    contentType: 'video/mp4'
  },
  { 
    local: 'public/media/projects/WolverineFinal.mp4', 
    s3Key: 'videos/wolverine-final.mp4',
    contentType: 'video/mp4'
  },
  { 
    local: 'public/media/projects/Salesman2.mp4', 
    s3Key: 'videos/salesman-story.mp4',
    contentType: 'video/mp4'
  },
  // Images
  { 
    local: 'public/media/projects/Ironman.jpg', 
    s3Key: 'images/ironman-hero.jpg',
    contentType: 'image/jpeg'
  },
  { 
    local: 'public/media/projects/moon_thumbnail.png', 
    s3Key: 'images/moon-thumbnail.png',
    contentType: 'image/png'
  },
  { 
    local: 'public/media/projects/spiderman_thumbnail.jpg', 
    s3Key: 'images/spiderman-thumbnail.jpg',
    contentType: 'image/jpeg'
  },
  { 
    local: 'public/media/projects/wolverine_thumbnail.png', 
    s3Key: 'images/wolverine-thumbnail.png',
    contentType: 'image/png'
  },
  { 
    local: 'public/media/projects/salesman2.avif', 
    s3Key: 'images/salesman-thumbnail.avif',
    contentType: 'image/avif'
  }
];

async function createBucket() {
  try {
    console.log(`Creating S3 bucket: ${AWS_CONFIG.bucketName}...`);
    
    await s3.createBucket({
      Bucket: AWS_CONFIG.bucketName
    }).promise();
    
    // Set bucket policy for public read access
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${AWS_CONFIG.bucketName}/*`
        }
      ]
    };
    
    await s3.putBucketPolicy({
      Bucket: AWS_CONFIG.bucketName,
      Policy: JSON.stringify(bucketPolicy)
    }).promise();
    
    console.log('✅ Bucket created and configured for public access');
  } catch (error) {
    if (error.code === 'BucketAlreadyOwnedByYou') {
      console.log('✅ Bucket already exists');
    } else {
      console.error('❌ Failed to create bucket:', error.message);
      throw error;
    }
  }
}

async function uploadFile(localPath, s3Key, contentType) {
  try {
    const fullPath = path.join(__dirname, localPath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${fullPath}`);
      return null;
    }
    
    console.log(`Uploading ${localPath} to S3...`);
    
    const fileContent = fs.readFileSync(fullPath);
    
    const params = {
      Bucket: AWS_CONFIG.bucketName,
      Key: s3Key,
      Body: fileContent,
      ContentType: contentType,
      ACL: 'public-read' // Make file publicly accessible
    };
    
    const result = await s3.upload(params).promise();
    
    console.log(`✅ Successfully uploaded: ${result.Location}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to upload ${localPath}:`, error.message);
    return null;
  }
}

async function uploadAllFiles() {
  console.log('Starting migration to AWS S3...\n');
  
  // Create bucket first
  await createBucket();
  console.log('');
  
  // Upload all files
  const results = [];
  for (const file of mediaFiles) {
    const result = await uploadFile(file.local, file.s3Key, file.contentType);
    if (result) {
      results.push({
        local: file.local,
        s3Url: result.Location
      });
    }
    console.log(''); // Add spacing
  }
  
  // Generate URL mapping
  console.log('='.repeat(50));
  console.log('MIGRATION COMPLETE! Here are your new URLs:');
  console.log('='.repeat(50));
  
  results.forEach(({ local, s3Url }) => {
    console.log(`${path.basename(local)} → ${s3Url}`);
  });
  
  console.log('\n🎉 All files uploaded successfully!');
  console.log('💡 Update your code to use the new S3 URLs above.');
}

// Validation function to check AWS credentials
function validateConfig() {
  if (AWS_CONFIG.accessKeyId === 'YOUR_ACCESS_KEY_ID' || 
      AWS_CONFIG.secretAccessKey === 'YOUR_SECRET_ACCESS_KEY') {
    console.error('❌ Please configure your AWS credentials first!');
    console.log('\n📝 Steps to set up AWS:');
    console.log('1. Go to https://aws.amazon.com/ and create a free account');
    console.log('2. Go to IAM → Users → Create User');
    console.log('3. Attach policy: AmazonS3FullAccess');
    console.log('4. Create Access Key and update this script');
    console.log('5. Update AWS_CONFIG with your credentials');
    return false;
  }
  return true;
}

// Run the migration
if (validateConfig()) {
  uploadAllFiles().catch(console.error);
}

module.exports = { uploadAllFiles, AWS_CONFIG };
