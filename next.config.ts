import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,      // Enable React strict mode for improved error handling
}

export default withPWA({
  dest: 'public', // Output directory for service worker
  register: true, // Automatically register service worker
  skipWaiting: true, // Activate service worker immediately
  scope: '/',
  sw: 'sw.js',
  publicExcludes: [
    // Exclude problematic files from being copied to the public folder
    'sw.js',
    'workbox-*.js',
    'fallback-*.js',
  ],
})(nextConfig);
