# Deployment Instructions

## Deploy to Vercel (Recommended)

Vercel is the best platform for Next.js applications as it supports all features including API routes.

### Steps:

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign up/login with your GitHub account

3. **Import your project**:
   - Click "New Project"
   - Select your `creative-image` repository
   - Click "Import"

4. **Configure environment variables**:
   - In the Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add: `HUGGINGFACE_API_KEY` with your Hugging Face API key value

5. **Deploy**:
   - Vercel will automatically build and deploy your app
   - You'll get a live URL like `https://creative-image-xxx.vercel.app`

### Important Notes:

- The app requires a Hugging Face API key to function
- The app now uses cloud-based background removal (Hugging Face RMBG-1.4 model)
- All functionality should work properly on Vercel

## Alternative: Deploy to Railway/Render

If you need the local `rembg` functionality, consider:
- Railway.app
- Render.com
- DigitalOcean App Platform

These platforms support Docker containers where you can install Python dependencies.

## GitHub Pages Limitation

GitHub Pages only serves static files and cannot run server-side code (API routes), which is why your app doesn't work there.
