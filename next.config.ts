import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,      // Enable React strict mode for improved error handling
}

export default withPWA({
  dest: 'public', // Output directory for service worker
  register: true, // Automatically register service worker
  scope: '/',
  sw: 'sw.js',
  publicExcludes: [
    'sw.js',
    'workbox-*.js',
    'fallback-*.js',
  ],
})(nextConfig);
