# 🚀 Portfolio - Google Cloud Platform

A modern, responsive portfolio built with React, TypeScript, and deployed on Google Cloud Platform with premium features.

## ✨ Features

- **Modern Stack**: React 18 + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS + Shadcn/ui
- **Cloud Hosting**: Google Cloud Platform (App Engine/Cloud Run)
- **Database**: Google Firestore
- **Storage**: Google Cloud Storage with CDN
- **Email**: Nodemailer with Gmail integration
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Meta tags and performance optimized

## 🏗️ Architecture

```
Frontend (React + Vite)
    ↓
Google App Engine / Cloud Run
    ↓
┌─────────────────┬─────────────────┐
│  Cloud Storage  │    Firestore    │
│   (Media Files) │   (Database)    │
└─────────────────┴─────────────────┘
```

## 📁 Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── services/      # GCP services
│   ├── hooks/         # Custom hooks
│   └── lib/           # Utilities
├── public/
│   └── media/         # Static media files
├── database/          # Database schemas
├── app.yaml          # App Engine config
├── cloudbuild.yaml   # CI/CD config
├── Dockerfile        # Container config
└── server.js         # Express server
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Google Cloud
```bash
# Run interactive setup
node gcp-setup.js

# Or manual setup
npm run gcp:migrate
```

### 3. Development
```bash
# Start development server
npm run dev

# Start backend server
npm run dev:server
```

### 4. Build & Deploy
```bash
# Build for production
npm run build

# Deploy to Google Cloud
npm run gcp:deploy
```

## 🔧 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run dev:server` - Start backend server with nodemon
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Google Cloud Platform
- `npm run gcp:setup` - Complete GCP setup
- `npm run gcp:migrate` - Run migration script
- `npm run gcp:deploy` - Deploy to App Engine
- `npm run gcp:deploy:cloud-run` - Deploy to Cloud Run
- `npm run gcp:build` - Build with Cloud Build
- `npm run gcp:logs` - View App Engine logs
- `npm run gcp:logs:cloud-run` - View Cloud Run logs

## 🌍 Environment Configuration

Create `.env` file with:

```env
# Google Cloud Platform
GCP_PROJECT_ID=your-project-id
GCP_BUCKET_NAME=your-bucket-name
GCP_REGION=us-central1
GCP_KEY_FILE=./gcp-service-account.json

# Contact Form
CONTACT_EMAIL=your-email@gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application
NODE_ENV=production
PORT=8080
```

## 💎 Google Cloud Premium Features

This portfolio leverages Google Cloud Premium benefits:

- **Enhanced Performance**: Premium compute instances
- **Auto-scaling**: Zero to millions of users
- **Global CDN**: Sub-second loading worldwide
- **Advanced Security**: DDoS protection + Cloud Armor
- **99.95% SLA**: Enterprise-grade reliability
- **24/7 Support**: Premium technical support

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Shadcn/ui** - Component library

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Multer** - File uploads
- **Nodemailer** - Email service

### Cloud Services
- **Google App Engine** - Hosting
- **Google Cloud Storage** - Media files
- **Google Firestore** - Database
- **Google Cloud Build** - CI/CD

## 📱 Features

- ✅ Responsive design (mobile-first)
- ✅ Dark/light mode support
- ✅ Contact form with email integration
- ✅ Project showcase with media
- ✅ Admin panel for content management
- ✅ SEO optimized
- ✅ Performance optimized
- ✅ Accessibility compliant
- ✅ Progressive Web App ready

## 🚀 Deployment

### Option 1: App Engine (Recommended)
```bash
npm run gcp:deploy
```

### Option 2: Cloud Run
```bash
npm run gcp:deploy:cloud-run
```

### Option 3: Cloud Build (CI/CD)
```bash
npm run gcp:build
```

## 📊 Performance

- **Lighthouse Score**: 90+ (all categories)
- **Core Web Vitals**: All green
- **Load Time**: <2s (global average)
- **Bundle Size**: Optimized with code splitting

## 🔒 Security

- HTTPS enforced
- CORS configured
- Input validation
- File upload restrictions
- Environment variables secured

## 📞 Contact

For questions or support:
- Email: [your-email@gmail.com]
- Portfolio: [your-portfolio-url]
- GitHub: [your-github-profile]

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ and deployed on Google Cloud Platform**
