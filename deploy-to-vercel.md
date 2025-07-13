# Quick Vercel Deployment Guide

## Prerequisites
- GitHub account
- Hugging Face account with API key

## Step-by-Step Deployment

### 1. Get Your Hugging Face API Key
1. Go to [huggingface.co](https://huggingface.co)
2. Sign up/login
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy the token (starts with `hf_...`)

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your `creative-image` repository
5. In the deployment settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add Environment Variable:
   - Name: `HUGGINGFACE_API_KEY`
   - Value: Your Hugging Face token
7. Click "Deploy"

### 3. Test Your App
- Wait for deployment to complete
- Visit your live URL
- Upload an image and test the background replacement

## Troubleshooting

### Common Issues:
1. **"Missing API key"** - Make sure you added the HUGGINGFACE_API_KEY environment variable
2. **"Model loading"** - Hugging Face models may take time to load on first use
3. **Build errors** - Check the build logs in Vercel dashboard

### If deployment fails:
1. Check the build logs in Vercel
2. Ensure all dependencies are in package.json
3. Verify your code builds locally with `npm run build`

## Your App Features:
- ✅ Upload images
- ✅ Remove backgrounds automatically
- ✅ Generate new backgrounds from text prompts
- ✅ Composite final image
- ✅ Download results
