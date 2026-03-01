import type { NextConfig } from 'next'

// Set NEXT_EXPORT=true during CI to generate a fully static site for GitHub Pages.
// Locally we leave it unset so rewrites (admin redirect) and headers still work.
const isStaticExport = process.env.NEXT_EXPORT === 'true';

const nextConfig: NextConfig = {
  transpilePackages: ['color-string'],
  // Static HTML export — only enabled for GitHub Pages build
  ...(isStaticExport && {
    output: 'export',
    trailingSlash: true, // GH Pages serves index.html from /path/
    images: { unoptimized: true },
    basePath: '/crumbsblog', // GitHub Pages serves from /<repo-name>/
    assetPrefix: '/crumbsblog/', // Ensures CSS/JS/images load with the correct path
  }),
  images: {
    // next/image requires unoptimized:true for static export
    unoptimized: isStaticExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.tina.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      },
      {
        // Blogger-hosted images (hero banner, author photo, post images)
        protocol: 'https',
        hostname: 'blogger.googleusercontent.com',
        port: '',
      },
      {
        // Alternative Blogger CDN hostname
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
      {
        // Images hosted on www.crumbsofsanity.com
        protocol: 'https',
        hostname: 'www.crumbsofsanity.com',
        port: '',
      },
    ],
  },
  // headers() and rewrites() are unsupported with output:'export'.
  // Skip them during GH Pages build; CSP is also set via <meta> in layout.tsx.
  ...(!isStaticExport && {
    async headers() {
      const headers = [
        { key: 'X-Frame-Options',         value: 'SAMEORIGIN' },
        { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
      ];
      return [{ source: '/(.*)', headers }];
    },
    async rewrites() {
      return [
        { source: '/admin', destination: '/admin/index.html' },
      ];
    },
  }),
};

export default nextConfig
