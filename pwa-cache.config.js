// This file configures the caching strategies for different resources in our PWA

// Cache duration in seconds
const YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
const MONTH_IN_SECONDS = 60 * 60 * 24 * 30;
const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
const DAY_IN_SECONDS = 60 * 60 * 24;
const HOUR_IN_SECONDS = 60 * 60;

// Fix for app-build-manifest.json and manifest.json issues
const buildManifestHandler = {
  urlPattern: /^\/_next\/app-build-manifest\.json$/,
  handler: 'NetworkOnly',
};

// Handler for Next.js App Router manifest.ts
const webManifestHandler = {
  urlPattern: /^\/manifest$/,
  handler: 'StaleWhileRevalidate',
  options: {
    cacheName: 'manifest',
    expiration: {
      maxEntries: 1,
      maxAgeSeconds: DAY_IN_SECONDS
    }
  }
};

module.exports = [
  // Add special handlers for manifest files first
  buildManifestHandler,
  webManifestHandler,
  // App shell (HTML, CSS, JS, fonts)
  {
    urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts',
      expiration: {
        maxEntries: 30,
        maxAgeSeconds: YEAR_IN_SECONDS,
      },
    },
  },
  {
    urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-font-assets',
      expiration: {
        maxEntries: 30,
        maxAgeSeconds: MONTH_IN_SECONDS,
      },
    },
  },
  {
    urlPattern: /\.(?:js)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-js-assets',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: WEEK_IN_SECONDS,
      },
    },
  },
  {
    urlPattern: /\.(?:css)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-style-assets',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: WEEK_IN_SECONDS,
      },
    },
  },
  
  // Images
  {
    urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-image-assets',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: MONTH_IN_SECONDS,
      },
    },
  },
  
  // JSON and API responses
  {
    urlPattern: /\.(?:json)$/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'static-json-assets',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: DAY_IN_SECONDS,
      },
    },
  },
  {
    urlPattern: /\/api\/.*$/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'apis',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: HOUR_IN_SECONDS * 12,
      },
      networkTimeoutSeconds: 10,
    },
  },
  
  // Fallback for navigation requests
  {
    urlPattern: ({ request }) => request.mode === 'navigate',
    handler: 'NetworkFirst',
    options: {
      cacheName: 'pages',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: DAY_IN_SECONDS,
      },
      networkTimeoutSeconds: 10
    },
  },
  
  // Offline fallback
  {
    urlPattern: /.*/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'offline-fallback',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: WEEK_IN_SECONDS,
      },
    },
  },
];
