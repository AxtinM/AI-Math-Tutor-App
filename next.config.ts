import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

// Import custom runtime caching config
const runtimeCaching = require('./pwa-cache.config');

const nextConfig: NextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false, // Enable service worker in all environments for testing
  runtimeCaching,
  scope: '/',
  sw: 'sw.js',
  buildExcludes: [
    // Exclude problematic files from precaching
    /app-build-manifest\.json$/,
    /middleware-manifest\.json$/
  ],
})({
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  // Handle redirects for manifest.json
  async redirects() {
    return [];
  },
});

export default nextConfig;
