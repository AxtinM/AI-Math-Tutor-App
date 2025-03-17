# Math Tutor PWA Implementation Guide

This document outlines the Progressive Web App (PWA) features implemented for the Math Tutor application and how to use them.

## PWA Features Implemented

1. **TypeScript Web App Manifest**: An `app/manifest.ts` file using Next.js App Router metadata to define how the app appears when installed on a device.
2. **Service Worker**: Implemented via `next-pwa` for offline capabilities and resource caching.
3. **Custom Caching Strategy**: Optimized caching rules for different resource types in `pwa-cache.config.js`.
4. **Offline Page**: A dedicated page (`/offline`) that appears when users are offline.
5. **Installation Prompt**: A custom component to encourage users to install the app.
6. **iOS Support**: Apple-specific meta tags and icons for better iOS experience.
7. **Error Handling**: Advanced error handling for service worker and manifest issues.
8. **Diagnostic Tools**: A diagnostic page for testing PWA functionality.

## Deployment Instructions

To deploy the Math Tutor PWA:

1. Use the dedicated PWA build script:
   ```
   pnpm pwa
   ```
   
   This script will:
   - Clean previous builds
   - Remove old service worker files
   - Build the application in production mode
   - Run the manifest fix script
   - Copy the manifest file to necessary locations
   - Start the production server

When deployed, the service worker will automatically register and begin caching resources according to the defined strategies.

## Testing the PWA

To test PWA functionality:

1. Open Chrome DevTools
2. Go to the "Application" tab
3. Under "Application" section, you can:
   - Check "Service Workers" to verify the service worker is registered
   - Check "Manifest" to verify the web app manifest is loaded correctly
   - Use "Cache Storage" to see what's being cached
   - Test offline functionality by setting "Offline" under the "Network" tab

## Installation Process

Users can install the PWA in two ways:

1. **Browser Prompt**: Most browsers will show an installation prompt in the address bar when the site meets PWA criteria.

2. **Custom Prompt**: The built-in installation prompt component will appear once the browser determines the app is installable.

## Troubleshooting

If PWA features aren't working as expected:

1. Make sure you're using HTTPS or localhost (PWA features require secure context)
2. Clear browser cache and service workers in Chrome DevTools → Application → Clear storage
3. Check if there are any service worker registration errors in the console
4. Verify all PWA criteria are met using Lighthouse audit tool

## Lighthouse PWA Audit

Run a Lighthouse PWA audit in Chrome DevTools to ensure all PWA criteria are met:

1. Open Chrome DevTools
2. Go to "Lighthouse" tab
3. Select "Progressive Web App" category
4. Run audit and address any issues

## PWA Best Practices Implemented

- Responsive design that works on all device sizes
- Custom offline experience
- Fast loading with appropriate caching strategies
- User installation prompts
- Icon support for various devices and platforms
