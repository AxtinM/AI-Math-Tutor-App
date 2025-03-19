/**
 * PWA Service Worker Registration Script
 * 
 * This script is loaded by app/layout.tsx with the "beforeInteractive" strategy
 * to ensure the service worker is registered as early as possible.
 */

// Wait for the page to load
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // Check if we're in a valid context for service worker registration
    const isValidContext = 
      window.location.protocol === 'https:' || 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1';
    
    if (!isValidContext) {
      console.log('Service Worker registration skipped: not in a secure context');
      return;
    }

    // Register the service worker from the root path
    // Note: The actual registration logic is in components/service-worker-registration.tsx
    // This script just ensures early detection of service worker support
    
    // Add event listener for network status changes
    window.addEventListener('online', () => {
      console.log('Application is online');
      document.body.classList.remove('offline');
      document.body.classList.add('online');
    });
    
    window.addEventListener('offline', () => {
      console.log('Application is offline');
      document.body.classList.remove('online');
      document.body.classList.add('offline');
    });

    // Initial class setting
    if (navigator.onLine) {
      document.body.classList.add('online');
    } else {
      document.body.classList.add('offline');
    }

    // Handle iOS standalone mode improvements
    if (window.navigator.standalone === true) {
      // iOS PWA specific adjustments
      document.body.classList.add('ios-pwa');
      
      // Prevent iOS overscroll/bounce effect when in PWA mode
      document.body.style.overscrollBehavior = 'none';
      
      // Fix for iOS PWA to prevent text selection
      document.documentElement.style.webkitTouchCallout = 'none';
      document.documentElement.style.webkitUserSelect = 'none';
    }
  });
}
