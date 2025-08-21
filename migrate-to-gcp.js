#!/usr/bin/env node

/**
 * Google Cloud Platform Migration Script for Portfolio
 * This script sets up and migrates your portfolio to Google Cloud
 */

import { Storage } from '@google-cloud/storage';
import { Firestore } from '@google-cloud/firestore';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GCP Configuration
const PROJECT_ID = process.env.GCP_PROJECT_ID || 'your-portfolio-project';
const BUCKET_NAME = process.env.GCP_BUCKET_NAME || `${PROJECT_ID}-media`;
const REGION = process.env.GCP_REGION || 'us-central1';

// Initialize GCP services
const storage = new Storage({
  projectId: PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE || './gcp-service-account.json'
});

const firestore = new Firestore({
  projectId: PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE || './gcp-service-account.json'
});

class GCPMigration {
  constructor() {
    this.bucket = storage.bucket(BUCKET_NAME);
  }

  async createBucket() {
    try {
      console.log(`Creating Cloud Storage bucket: ${BUCKET_NAME}...`);
      
      await storage.createBucket(BUCKET_NAME, {
        location: REGION,
        storageClass: 'STANDARD',
        versioning: {
          enabled: true
        },
        cors: [{
          origin: ['*'],
          method: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
          responseHeader: ['Content-Type', 'Access-Control-Allow-Origin'],
          maxAgeSeconds: 3600
        }]
      });

      console.log(`✅ Bucket ${BUCKET_NAME} created successfully`);
    } catch (error) {
      if (error.code === 409) {
        console.log(`ℹ️  Bucket ${BUCKET_NAME} already exists`);
      } else {
        console.error('❌ Error creating bucket:', error.message);
        throw error;
      }
    }
  }

  async uploadMediaFiles() {
    const mediaDir = path.join(__dirname, 'public', 'media');
    const uploadPromises = [];

    console.log('📁 Uploading media files to Cloud Storage...');

    const uploadFile = async (filePath, fileName) => {
      try {
        const destination = fileName.replace(/\\/g, '/'); // Convert Windows paths
        
        await this.bucket.upload(filePath, {
          destination,
          metadata: {
            cacheControl: 'public, max-age=86400', // 24 hours cache
          },
          public: true
        });

        console.log(`✅ Uploaded: ${destination}`);
        return `https://storage.googleapis.com/${BUCKET_NAME}/${destination}`;
      } catch (error) {
        console.error(`❌ Error uploading ${fileName}:`, error.message);
        throw error;
      }
    };

    const scanDirectory = async (dir, baseDir = '') => {
      const items = await fs.readdir(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = await fs.stat(fullPath);
        
        if (stats.isDirectory()) {
          await scanDirectory(fullPath, path.join(baseDir, item));
        } else {
          const relativePath = path.join(baseDir, item);
          uploadPromises.push(uploadFile(fullPath, relativePath));
        }
      }
    };

    if (await fs.pathExists(mediaDir)) {
      await scanDirectory(mediaDir);
      await Promise.all(uploadPromises);
      console.log('✅ All media files uploaded successfully');
    } else {
      console.log('ℹ️  No media directory found');
    }
  }

  async setupFirestore() {
    console.log('🔥 Setting up Firestore database...');
    
    try {
      // Create collections and sample data
      const portfolioRef = firestore.collection('portfolio');
      
      // Sample portfolio data
      const portfolioData = {
        name: 'Your Portfolio',
        title: 'Full Stack Developer',
        description: 'Passionate developer creating amazing web experiences',
        email: process.env.CONTACT_EMAIL || 'your-email@example.com',
        social: {
          github: 'https://github.com/yourusername',
          linkedin: 'https://linkedin.com/in/yourprofile',
          twitter: 'https://twitter.com/yourhandle'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await portfolioRef.doc('profile').set(portfolioData);
      
      // Create projects collection
      const projectsRef = firestore.collection('projects');
      const sampleProject = {
        title: 'Sample Project',
        description: 'A sample project to demonstrate the structure',
        technologies: ['React', 'TypeScript', 'Google Cloud'],
        imageUrl: `https://storage.googleapis.com/${BUCKET_NAME}/projects/sample.jpg`,
        demoUrl: 'https://your-demo-url.com',
        githubUrl: 'https://github.com/yourusername/project',
        featured: true,
        createdAt: new Date()
      };

      await projectsRef.add(sampleProject);
      
      console.log('✅ Firestore database setup completed');
    } catch (error) {
      console.error('❌ Error setting up Firestore:', error.message);
      throw error;
    }
  }

  async generateEnvironmentFile() {
    console.log('📝 Generating environment configuration...');
    
    const envContent = `# Google Cloud Platform Configuration
GCP_PROJECT_ID=${PROJECT_ID}
GCP_BUCKET_NAME=${BUCKET_NAME}
GCP_REGION=${REGION}
GCP_KEY_FILE=./gcp-service-account.json

# Cloud Storage URLs
GCP_STORAGE_BASE_URL=https://storage.googleapis.com/${BUCKET_NAME}

# Firestore
FIRESTORE_PROJECT_ID=${PROJECT_ID}

# App Configuration
NODE_ENV=production
PORT=8080

# Contact Form (replace with your email)
CONTACT_EMAIL=your-email@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL (update after deployment)
FRONTEND_URL=https://your-app-url.appspot.com
`;

    await fs.writeFile(path.join(__dirname, '.env.gcp'), envContent);
    console.log('✅ Environment file created: .env.gcp');
  }

  async generateAppYaml() {
    console.log('📝 Generating app.yaml for App Engine...');
    
    const appYamlContent = `runtime: nodejs20

env_variables:
  NODE_ENV: production
  GCP_PROJECT_ID: ${PROJECT_ID}
  GCP_BUCKET_NAME: ${BUCKET_NAME}
  GCP_REGION: ${REGION}

automatic_scaling:
  min_instances: 0
  max_instances: 10
  target_cpu_utilization: 0.6

handlers:
- url: /static
  static_dir: dist/static
  secure: always

- url: /assets
  static_dir: dist/assets
  secure: always

- url: /.*
  script: auto
  secure: always
`;

    await fs.writeFile(path.join(__dirname, 'app.yaml'), appYamlContent);
    console.log('✅ App Engine configuration created: app.yaml');
  }

  async generateCloudBuildYaml() {
    console.log('📝 Generating cloudbuild.yaml for CI/CD...');
    
    const cloudBuildContent = `steps:
  # Install dependencies
  - name: 'node:20'
    entrypoint: npm
    args: ['ci']

  # Build the application
  - name: 'node:20'
    entrypoint: npm
    args: ['run', 'build']

  # Deploy to App Engine
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['app', 'deploy', '--quiet']

options:
  logging: CLOUD_LOGGING_ONLY
  
timeout: 1200s
`;

    await fs.writeFile(path.join(__dirname, 'cloudbuild.yaml'), cloudBuildContent);
    console.log('✅ Cloud Build configuration created: cloudbuild.yaml');
  }

  async generateDockerfile() {
    console.log('📝 Generating Dockerfile for Cloud Run...');
    
    const dockerfileContent = `# Use official Node.js runtime as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 8080

# Set environment variable for port
ENV PORT=8080

# Start the application
CMD ["npm", "start"]
`;

    await fs.writeFile(path.join(__dirname, 'Dockerfile'), dockerfileContent);
    console.log('✅ Dockerfile created for Cloud Run deployment');
  }

  async updatePackageJson() {
    console.log('📦 Updating package.json with GCP dependencies...');
    
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    
    // Add GCP dependencies
    const gcpDependencies = {
      '@google-cloud/storage': '^7.12.1',
      '@google-cloud/firestore': '^7.10.0',
      '@google-cloud/logging': '^11.2.0'
    };

    packageJson.dependencies = { ...packageJson.dependencies, ...gcpDependencies };
    
    // Add GCP scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      'gcp:deploy': 'gcloud app deploy',
      'gcp:deploy:cloud-run': 'gcloud run deploy portfolio --source .',
      'gcp:build': 'gcloud builds submit',
      'gcp:logs': 'gcloud app logs tail -s default'
    };

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    console.log('✅ Package.json updated with GCP dependencies');
  }

  async run() {
    try {
      console.log('🚀 Starting Google Cloud Platform migration...\n');
      
      await this.createBucket();
      await this.uploadMediaFiles();
      await this.setupFirestore();
      await this.generateEnvironmentFile();
      await this.generateAppYaml();
      await this.generateCloudBuildYaml();
      await this.generateDockerfile();
      await this.updatePackageJson();
      
      console.log('\n✅ Google Cloud Platform migration completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Install GCP CLI: https://cloud.google.com/sdk/docs/install');
      console.log('2. Create a GCP project and enable required APIs');
      console.log('3. Create a service account and download the JSON key');
      console.log('4. Update .env.gcp with your actual values');
      console.log('5. Run: gcloud auth login');
      console.log('6. Run: npm run gcp:deploy');
      console.log('\n🔗 Useful commands:');
      console.log('- Deploy to App Engine: npm run gcp:deploy');
      console.log('- Deploy to Cloud Run: npm run gcp:deploy:cloud-run');
      console.log('- View logs: npm run gcp:logs');
      
    } catch (error) {
      console.error('\n❌ Migration failed:', error.message);
      process.exit(1);
    }
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const migration = new GCPMigration();
  migration.run();
}

export default GCPMigration;
