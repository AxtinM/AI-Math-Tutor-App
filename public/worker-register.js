/**
 * PWA Service Worker Registration Script
 * 
 * This script is loaded by app/layout.tsx with the "beforeInteractive" strategy
 * to ensure the service worker is registered as early as possible.
 */

// Create a global PWA object to store state and debug information
window.__PWA_DEBUG = {
  events: [],
  installPromptEvent: null,
  installationState: 'unknown',
  log: function(message) {
    console.log(`[PWA Debug] ${message}`);
    this.events.push({
      timestamp: new Date().toISOString(),
      message: message
    });
  }
};

// Capture the beforeinstallprompt event as early as possible
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  
  // Store the event for later use
  window.__PWA_DEBUG.installPromptEvent = e;
  window.__PWA_DEBUG.installationState = 'can-be-installed';
  window.__PWA_DEBUG.log('beforeinstallprompt event captured');
  
  // Dispatch a custom event so other parts of the app can know installation is possible
  window.dispatchEvent(new CustomEvent('pwaInstallable', { 
    detail: { promptEvent: e }
  }));
});

// Also listen for the appinstalled event
window.addEventListener('appinstalled', (e) => {
  window.__PWA_DEBUG.installationState = 'installed';
  window.__PWA_DEBUG.log('App was installed');
  window.dispatchEvent(new CustomEvent('pwaInstalled'));
});

// Wait for the page to load
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    window.__PWA_DEBUG.log('Page loaded, checking PWA requirements');
    
    // Check if we're in a valid context for service worker registration
    const isValidContext = 
      window.location.protocol === 'https:' || 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1';
    
    window.__PWA_DEBUG.log(`Valid secure context: ${isValidContext}`);
    
    if (!isValidContext) {
      window.__PWA_DEBUG.log('Service Worker registration skipped: not in a secure context');
      return;
    }

    // Check if we're already in standalone mode
    const displayMode = window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 
                      window.matchMedia('(display-mode: window-controls-overlay)').matches ? 'window-controls-overlay' : 
                      window.navigator.standalone ? 'standalone' : 'browser';
    
    window.__PWA_DEBUG.log(`Current display mode: ${displayMode}`);
    
    if (displayMode !== 'browser') {
      window.__PWA_DEBUG.installationState = 'running-installed';
    }
    
    // Register the service worker from the root path
    // Note: The actual registration logic is in components/service-worker-registration.tsx
    // This script just ensures early detection of service worker support
    
    // Add event listener for network status changes
    window.addEventListener('online', () => {
      window.__PWA_DEBUG.log('Application is online');
      document.body.classList.remove('offline');
      document.body.classList.add('online');
    });
    
    window.addEventListener('offline', () => {
      window.__PWA_DEBUG.log('Application is offline');
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
      window.__PWA_DEBUG.log('Running in iOS standalone mode');
      // iOS PWA specific adjustments
      document.body.classList.add('ios-pwa');
      
      // Prevent iOS overscroll/bounce effect when in PWA mode
      document.body.style.overscrollBehavior = 'none';
      
      // Fix for iOS PWA to prevent text selection
      document.documentElement.style.webkitTouchCallout = 'none';
      document.documentElement.style.webkitUserSelect = 'none';
    }
    
    // Add a button for manual PWA installation debugging
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        const debugButton = document.createElement('button');
        debugButton.innerText = 'Debug PWA Install';
        debugButton.style.position = 'fixed';
        debugButton.style.bottom = '20px';
        debugButton.style.right = '20px';
        debugButton.style.zIndex = '9999';
        debugButton.style.padding = '8px 16px';
        debugButton.style.backgroundColor = '#007bff';
        debugButton.style.color = 'white';
        debugButton.style.border = 'none';
        debugButton.style.borderRadius = '4px';
        debugButton.style.cursor = 'pointer';
        
        debugButton.onclick = function() {
          console.table(window.__PWA_DEBUG.events);
          console.log('Installation state:', window.__PWA_DEBUG.installationState);
          console.log('Install prompt event available:', !!window.__PWA_DEBUG.installPromptEvent);
          
          if (window.__PWA_DEBUG.installPromptEvent) {
            console.log('Triggering install prompt manually');
            window.__PWA_DEBUG.installPromptEvent.prompt();
          } else {
            console.log('No install prompt event available');
            alert('No install prompt event is available. This could be because:\n\n' +
                  '1. The app is already installed\n' +
                  '2. The browser doesn\'t support installation\n' +
                  '3. The PWA criteria are not met\n' +
                  '4. You\'ve already seen the prompt recently');
          }
        };
        
        document.body.appendChild(debugButton);
      }, 2000);
    }
  });
}
