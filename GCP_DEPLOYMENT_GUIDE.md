# Google Cloud Platform Deployment Guide

This guide will help you deploy your portfolio to Google Cloud Platform using your premium account.

## Prerequisites

1. **Google Cloud Premium Account** ✅ (You have this)
2. **Google Cloud CLI** - [Install here](https://cloud.google.com/sdk/docs/install)
3. **Node.js 20+** - For local development

## Quick Start

### 1. Setup GCP Project

```bash
# Login to your GCP account
gcloud auth login

# Create a new project (or use existing)
gcloud projects create your-portfolio-project --name="Portfolio"

# Set the project as default
gcloud config set project your-portfolio-project

# Enable required APIs
gcloud services enable storage.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

### 2. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create portfolio-service \
    --display-name="Portfolio Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding your-portfolio-project \
    --member="serviceAccount:portfolio-service@your-portfolio-project.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding your-portfolio-project \
    --member="serviceAccount:portfolio-service@your-portfolio-project.iam.gserviceaccount.com" \
    --role="roles/datastore.user"

# Download service account key
gcloud iam service-accounts keys create gcp-service-account.json \
    --iam-account=portfolio-service@your-portfolio-project.iam.gserviceaccount.com
```

### 3. Install Dependencies

```bash
# Install GCP dependencies
npm install @google-cloud/storage @google-cloud/firestore @google-cloud/logging

# Run migration script
node migrate-to-gcp.js
```

### 4. Configure Environment

Copy `.env.gcp` to `.env` and update with your values:

```env
# Your actual GCP project ID
GCP_PROJECT_ID=your-portfolio-project

# Your bucket name (will be created automatically)
GCP_BUCKET_NAME=your-portfolio-project-media

# Your preferred region
GCP_REGION=us-central1

# Path to your service account key
GCP_KEY_FILE=./gcp-service-account.json

# Your contact email
CONTACT_EMAIL=your-email@gmail.com
```

## Deployment Options

### Option 1: App Engine (Recommended for Premium)

App Engine is perfect for your premium account with auto-scaling and zero server management.

```bash
# Deploy to App Engine
npm run gcp:deploy

# View your app
gcloud app browse
```

**Benefits with Premium:**
- Enhanced autoscaling
- Advanced security features
- Better performance guarantees
- Priority support

### Option 2: Cloud Run (Containerized)

For more control over the runtime environment.

```bash
# Deploy to Cloud Run
npm run gcp:deploy:cloud-run

# Get the service URL
gcloud run services list
```

### Option 3: Compute Engine (Custom VM)

For maximum customization (available with premium).

```bash
# Create VM instance
gcloud compute instances create portfolio-vm \
    --image-family=ubuntu-2004-lts \
    --image-project=ubuntu-os-cloud \
    --machine-type=e2-medium \
    --zone=us-central1-a

# SSH into the instance
gcloud compute ssh portfolio-vm --zone=us-central1-a
```

## Premium Features You Can Leverage

### 1. Enhanced Storage Classes
```bash
# Use premium storage for faster access
gsutil lifecycle set storage-lifecycle.json gs://your-bucket-name
```

### 2. Advanced CDN Configuration
```bash
# Enable Cloud CDN for global performance
gcloud compute backend-services create portfolio-backend
gcloud compute url-maps create portfolio-urlmap
```

### 3. Cloud Armor (Security)
```bash
# Enable advanced DDoS protection
gcloud compute security-policies create portfolio-security-policy
```

### 4. Cloud Monitoring & Logging
```bash
# Set up advanced monitoring (included in premium)
gcloud logging sinks create portfolio-logs \
    bigquery.googleapis.com/projects/your-project/datasets/portfolio_logs
```

## Custom Domain Setup

### 1. Add Custom Domain
```bash
# Add your domain to App Engine
gcloud app domain-mappings create yourdomain.com
```

### 2. SSL Certificate
```bash
# SSL is automatically managed with App Engine
# For Cloud Run, use:
gcloud run domain-mappings create --service portfolio --domain yourdomain.com
```

## Performance Optimization

### 1. Cloud CDN
```javascript
// Add to your app.yaml
handlers:
- url: /static
  static_dir: dist/static
  secure: always
  http_headers:
    Cache-Control: "public, max-age=31536000"
```

### 2. Image Optimization
Use Cloud Storage's built-in image optimization:
```javascript
// Automatically optimized URLs
const optimizedUrl = gcpStorageService.getOptimizedImageUrl('image.jpg', {
  width: 800,
  quality: 80,
  format: 'webp'
});
```

## Monitoring & Analytics

### 1. Cloud Monitoring Dashboard
```bash
# Create custom dashboard
gcloud monitoring dashboards create --config-from-file=dashboard-config.json
```

### 2. Error Reporting
Automatically enabled with your premium account for better debugging.

### 3. Performance Insights
Use Cloud Trace and Cloud Profiler (premium features) for detailed performance analysis.

## Cost Optimization

Even with premium, optimize costs:

### 1. Auto-scaling Configuration
```yaml
# app.yaml
automatic_scaling:
  min_instances: 0  # Scale to zero when no traffic
  max_instances: 10
  target_cpu_utilization: 0.6
```

### 2. Storage Lifecycle
```json
{
  "lifecycle": {
    "rule": [{
      "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
      "condition": {"age": 30}
    }]
  }
}
```

## Security Best Practices

### 1. IAM Roles
- Use least-privilege principle
- Rotate service account keys regularly
- Enable audit logging

### 2. Network Security
```bash
# Enable VPC firewall rules
gcloud compute firewall-rules create allow-portfolio \
    --allow tcp:8080 \
    --source-ranges 0.0.0.0/0
```

## Backup & Recovery

### 1. Automated Backups
```bash
# Setup Cloud Storage backup
gsutil -m cp -r gs://your-bucket/* gs://your-backup-bucket/
```

### 2. Firestore Backup
```bash
# Export Firestore data
gcloud firestore export gs://your-backup-bucket/firestore-backup
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   # Check service account permissions
   gcloud projects get-iam-policy your-project
   ```

2. **App Engine Deployment Fails**
   ```bash
   # Check logs
   gcloud app logs tail -s default
   ```

3. **Storage Access Issues**
   ```bash
   # Test bucket access
   gsutil ls gs://your-bucket-name
   ```

## Support

With your Google Cloud Premium account, you have access to:
- 24/7 technical support
- Premium support cases
- Dedicated customer success manager
- Advanced troubleshooting tools

## Next Steps

1. **Run the migration**: `node migrate-to-gcp.js`
2. **Deploy your app**: `npm run gcp:deploy`
3. **Set up monitoring**: Use Cloud Console dashboard
4. **Configure custom domain**: Follow domain setup guide
5. **Optimize performance**: Enable CDN and image optimization

Your portfolio will be running on Google Cloud's premium infrastructure with enterprise-grade security, performance, and reliability!
