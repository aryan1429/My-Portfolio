#!/usr/bin/env node

/**
 * Quick Setup Script for Google Cloud Portfolio Deployment
 * This script guides you through the initial setup process
 */

import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

class GCPSetup {
  constructor() {
    this.projectId = '';
    this.bucketName = '';
    this.region = 'us-central1';
    this.email = '';
  }

  async askQuestions() {
    console.log('🚀 Welcome to Google Cloud Portfolio Setup!\n');
    console.log('This script will help you deploy your portfolio to Google Cloud Platform.\n');

    this.projectId = await question('Enter your GCP Project ID (e.g., my-portfolio-2024): ');
    this.bucketName = await question(`Enter bucket name [${this.projectId}-media]: `) || `${this.projectId}-media`;
    this.region = await question(`Enter region [us-central1]: `) || 'us-central1';
    this.email = await question('Enter your contact email: ');

    console.log('\n📋 Configuration Summary:');
    console.log(`Project ID: ${this.projectId}`);
    console.log(`Bucket Name: ${this.bucketName}`);
    console.log(`Region: ${this.region}`);
    console.log(`Email: ${this.email}\n`);

    const confirm = await question('Is this correct? (y/N): ');
    if (confirm.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      process.exit(0);
    }
  }

  async checkGCloudCLI() {
    console.log('🔍 Checking Google Cloud CLI...');
    
    try {
      execSync('gcloud version', { stdio: 'pipe' });
      console.log('✅ Google Cloud CLI is installed');
    } catch (error) {
      console.log('❌ Google Cloud CLI not found');
      console.log('Please install it from: https://cloud.google.com/sdk/docs/install');
      process.exit(1);
    }
  }

  async setupGCPProject() {
    console.log('🏗️  Setting up GCP project...');

    try {
      // Set project
      console.log(`Setting project to: ${this.projectId}`);
      execSync(`gcloud config set project ${this.projectId}`, { stdio: 'inherit' });

      // Enable APIs
      console.log('Enabling required APIs...');
      const apis = [
        'storage.googleapis.com',
        'firestore.googleapis.com',
        'appengine.googleapis.com',
        'cloudbuild.googleapis.com',
        'run.googleapis.com'
      ];

      for (const api of apis) {
        console.log(`Enabling ${api}...`);
        execSync(`gcloud services enable ${api}`, { stdio: 'inherit' });
      }

      console.log('✅ APIs enabled successfully');
    } catch (error) {
      console.error('❌ Error setting up GCP project:', error.message);
      process.exit(1);
    }
  }

  async createServiceAccount() {
    console.log('👤 Creating service account...');

    try {
      const serviceAccountName = 'portfolio-service';
      const serviceAccountEmail = `${serviceAccountName}@${this.projectId}.iam.gserviceaccount.com`;

      // Create service account
      console.log('Creating service account...');
      try {
        execSync(`gcloud iam service-accounts create ${serviceAccountName} --display-name="Portfolio Service Account"`, { stdio: 'pipe' });
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log('ℹ️  Service account already exists');
        } else {
          throw error;
        }
      }

      // Grant permissions
      console.log('Granting permissions...');
      const roles = [
        'roles/storage.admin',
        'roles/datastore.user',
        'roles/appengine.appAdmin'
      ];

      for (const role of roles) {
        execSync(`gcloud projects add-iam-policy-binding ${this.projectId} --member="serviceAccount:${serviceAccountEmail}" --role="${role}"`, { stdio: 'pipe' });
      }

      // Download key
      console.log('Downloading service account key...');
      execSync(`gcloud iam service-accounts keys create gcp-service-account.json --iam-account=${serviceAccountEmail}`, { stdio: 'inherit' });

      console.log('✅ Service account created and configured');
    } catch (error) {
      console.error('❌ Error creating service account:', error.message);
      process.exit(1);
    }
  }

  async updateEnvironmentFile() {
    console.log('📝 Creating environment configuration...');

    const envContent = `# Google Cloud Platform Configuration
GCP_PROJECT_ID=${this.projectId}
GCP_BUCKET_NAME=${this.bucketName}
GCP_REGION=${this.region}
GCP_KEY_FILE=./gcp-service-account.json

# Cloud Storage URLs
GCP_STORAGE_BASE_URL=https://storage.googleapis.com/${this.bucketName}

# Firestore Database
FIRESTORE_PROJECT_ID=${this.projectId}

# Application Configuration
NODE_ENV=production
PORT=8080

# Contact Form Configuration
CONTACT_EMAIL=${this.email}
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=${this.email}
SMTP_PASS=your-gmail-app-password

# Frontend URL (update after deployment)
FRONTEND_URL=https://${this.projectId}.appspot.com

# Development Configuration
VITE_GCP_PROJECT_ID=${this.projectId}
VITE_GCP_STORAGE_BASE_URL=https://storage.googleapis.com/${this.bucketName}
`;

    await fs.writeFile(path.join(__dirname, '.env'), envContent);
    console.log('✅ Environment file created: .env');
  }

  async updateAppYaml() {
    console.log('📝 Updating app.yaml configuration...');

    const appYamlPath = path.join(__dirname, 'app.yaml');
    let appYamlContent = await fs.readFile(appYamlPath, 'utf8');

    // Replace placeholder values
    appYamlContent = appYamlContent
      .replace(/your-portfolio-project/g, this.projectId)
      .replace(/your-portfolio-project-media/g, this.bucketName)
      .replace(/us-central1/g, this.region);

    await fs.writeFile(appYamlPath, appYamlContent);
    console.log('✅ app.yaml updated');
  }

  async installDependencies() {
    console.log('📦 Installing Google Cloud dependencies...');

    try {
      execSync('npm install @google-cloud/storage @google-cloud/firestore @google-cloud/logging', { stdio: 'inherit' });
      console.log('✅ Dependencies installed');
    } catch (error) {
      console.error('❌ Error installing dependencies:', error.message);
      process.exit(1);
    }
  }

  async runMigration() {
    console.log('🔄 Running migration script...');

    try {
      execSync('node migrate-to-gcp.js', { stdio: 'inherit' });
      console.log('✅ Migration completed');
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      console.log('You can run the migration manually later with: npm run gcp:migrate');
    }
  }

  async initializeAppEngine() {
    console.log('🏗️  Initializing App Engine...');

    try {
      execSync(`gcloud app create --region=${this.region}`, { stdio: 'inherit' });
      console.log('✅ App Engine initialized');
    } catch (error) {
      if (error.message.includes('already contains an App Engine')) {
        console.log('ℹ️  App Engine already exists');
      } else {
        console.error('❌ Error initializing App Engine:', error.message);
      }
    }
  }

  async run() {
    try {
      await this.askQuestions();
      await this.checkGCloudCLI();
      await this.setupGCPProject();
      await this.createServiceAccount();
      await this.updateEnvironmentFile();
      await this.updateAppYaml();
      await this.installDependencies();
      await this.initializeAppEngine();
      await this.runMigration();

      console.log('\n🎉 Setup completed successfully!\n');
      console.log('📋 Next steps:');
      console.log('1. Update your Gmail app password in .env file');
      console.log('2. Test locally: npm run dev');
      console.log('3. Build: npm run build');
      console.log('4. Deploy: npm run gcp:deploy');
      console.log('\n🔗 Useful commands:');
      console.log('- Deploy: npm run gcp:deploy');
      console.log('- View logs: npm run gcp:logs');
      console.log('- Check status: gcloud app browse');
      console.log('\n💰 With your Google Cloud Premium account, you get:');
      console.log('- Enhanced performance and autoscaling');
      console.log('- 24/7 technical support');
      console.log('- Advanced security features');
      console.log('- Priority resource allocation');
      
    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      process.exit(1);
    } finally {
      rl.close();
    }
  }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new GCPSetup();
  setup.run();
}

export default GCPSetup;
