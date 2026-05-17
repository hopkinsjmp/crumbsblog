import type { NextConfig } from 'next'

// Set NEXT_EXPORT=true during CI to generate a fully static site for GitHub Pages.
// Locally we leave it unset so rewrites (admin redirect) and headers still work.
const isStaticExport = process.env.NEXT_EXPORT === 'true';

const nextConfig: NextConfig = {
  // Static HTML export - only enabled for GitHub Pages build.
  // With a custom domain (crumbsofsanity.com) GH Pages serves from the root,
  // so basePath and assetPrefix are empty strings.
  ...(isStaticExport && {
    output: 'export',
    trailingSlash: true, // GH Pages serves index.html from /path/
    images: { unoptimized: true },
    basePath: '',
    assetPrefix: '',
  }),
  // Expose basePath to client bundles so withBasePath() can use it at runtime.
  env: {
    NEXT_PUBLIC_BASE_PATH: '',
  },
  images: {
    // next/image requires unoptimized:true for static export
    unoptimized: isStaticExport,
    remotePatterns: [
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
