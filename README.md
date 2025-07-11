# Creative Image Background Updater

This is a Next.js app that allows users to upload an image and update the background using creative prompts. It integrates with a Hugging Face model for background replacement based on text prompts. The app is deployable to GitHub Pages.

## Features
- Upload an image and preview it
- Enter a creative prompt to update the background
- Uses Hugging Face Inference API for background replacement
- Deployable as a static site to GitHub Pages

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Create a `.env.local` file in the project root:
     ```env
     HUGGINGFACE_API_KEY=your_huggingface_api_key_here
     ```

3. **Run locally:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to GitHub Pages

1. **Update `next.config.js` if you use a different repo name:**
   - Change the `repo` variable to match your GitHub repository name.

2. **Push your code to GitHub:**
   - Create a new repository on GitHub (e.g., `rjluttz/creative-image`).
   - Initialize git, add, commit, and push your code:
     ```bash
     git init
     git remote add origin https://github.com/rjluttz/creative-image.git
     git add .
     git commit -m "Initial commit"
     git push -u origin main
     ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```
   This will build and export the static site, then publish the `out` directory to the `gh-pages` branch.

4. **Configure GitHub Pages:**
   - In your GitHub repo settings, set GitHub Pages source to the `gh-pages` branch and `/` (root) directory.
   - Your site will be available at `https://rjluttz.github.io/creative-image/`

## Notes
- The Hugging Face API/model may have usage limits on free accounts.
- For client-side environment variables, prefix with `NEXT_PUBLIC_`.
- For background replacement, you can change the model in `src/app/api/background/route.ts`.

---
Made with Next.js, Tailwind CSS, and Hugging Face Inference API.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
