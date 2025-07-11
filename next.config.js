/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const repo = 'creative-image'; // Change if you use a different repo name

const nextConfig = {
  output: 'export',
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
