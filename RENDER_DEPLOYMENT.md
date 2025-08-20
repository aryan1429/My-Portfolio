# Backend Deployment to Render

## Prerequisites
1. Your code should be pushed to GitHub
2. Create a Render account at https://render.com

## Deployment Steps

### 1. Create a Web Service on Render
1. Go to https://render.com/dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select your repository (My-Portfolio)

### 2. Configure the Service
- **Name**: `portfolio-backend` (or any name you prefer)
- **Environment**: `Node`
- **Region**: Choose the closest to your users
- **Branch**: `master` (or your main branch)
- **Root Directory**: `/` (leave blank or use `/` - this is the repository root)
- **Build Command**: `./render-build.sh`
- **Start Command**: `node server.js`

### 3. Set Environment Variables
In the Render dashboard, go to Environment section and add:

```
NODE_ENV=production
EMAIL_USER=aryanaligetibusiness@gmail.com
EMAIL_PASS=lisd oskj dyum mtus
REACT_APP_CLOUDINARY_CLOUD_NAME=dwol4czfp
REACT_APP_CLOUDINARY_API_KEY=578838569393329
REACT_APP_CLOUDINARY_API_SECRET=Rx3z-W0T5rjLyxbtUYYkPW5-ogc
```

### 4. Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your service
3. You'll get a URL like: `https://your-service-name.onrender.com`

### 5. Update Frontend Configuration
Update your Vercel deployment's environment variables:
- Set `VITE_API_URL` to your new Render backend URL: `https://your-service-name.onrender.com/api`

## Important Notes
- The free tier on Render spins down after inactivity, which may cause cold starts
- For production, consider upgrading to a paid plan for better performance
- Make sure to update CORS settings if needed for your frontend domain

## Testing
Once deployed, test your API endpoints:
- Health check: `https://portfolio-backend-o1o3.onrender.com/api/health`
- Contact form: `https://portfolio-backend-o1o3.onrender.com/api/contact`

## Your Deployed Backend URL
Your backend is now live at: `https://portfolio-backend-o1o3.onrender.com`

Make sure to update your Vercel frontend environment variables:
- Set `VITE_API_URL` to: `https://portfolio-backend-o1o3.onrender.com/api`
