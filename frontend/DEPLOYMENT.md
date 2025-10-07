# Frontend Deployment Guide for Vercel

## Required Environment Variables

Set these in your Vercel project dashboard under Settings > Environment Variables:

### API Configuration
- `VITE_API_URL` - Your backend API URL (e.g., `https://ascension2-backend.vercel.app/api`)

## Deployment Steps

1. **Push to GitHub**: Make sure your code is pushed to your GitHub repository
2. **Create Vercel Project**: 
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   - Set **Root Directory** to `frontend`
   - Set **Framework Preset** to "Vite"
3. **Configure Environment Variables**: Add `VITE_API_URL` with your backend URL
4. **Deploy**: Click "Deploy"

## Environment Variable Setup

In your Vercel project settings, add:
- **Name**: `VITE_API_URL`
- **Value**: `https://ascension2-backend.vercel.app/api`

## Post-Deployment

After deployment, you'll get a URL like `https://ascension2-frontend.vercel.app`
- Update your backend's `FRONTEND_URL` environment variable with this URL
- This ensures CORS works properly between frontend and backend
