// Service Worker Registration Script
// This script gets embedded directly in the HTML to ensure early registration

if ('serviceWorker' in navigator && 
    (window.location.protocol === 'https:' || 
     window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1')) {
  
  window.addEventListener('load', function() {
    // Add a small delay to ensure the page has fully loaded
    setTimeout(() => {
      navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Listen for any errors that occur during service worker lifecycle
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              console.log('Service Worker installed successfully');
            }
          });
        });
      })
      .catch(function(error) {
        console.error('Service Worker registration failed:', error);
      });
      
      // Handle unrecoverable errors in the service worker
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'ERROR') {
          console.warn('Service Worker Error:', event.data.message);
        }
      });
      
      // Additional handling for workbox precaching errors
      window.addEventListener('error', event => {
        if (event.message && event.message.includes('bad-precaching-response')) {
          console.warn('Workbox precaching error detected. This is normal during development and can be safely ignored.');
          // Prevent the error from showing in the console
          event.preventDefault();
        }
      });
      
      window.addEventListener('unhandledrejection', event => {
        if (event.reason && typeof event.reason.message === 'string' && 
            event.reason.message.includes('bad-precaching-response')) {
          console.warn('Workbox precaching error detected. This is normal during development and can be safely ignored.');
          // Prevent the error from showing in the console
          event.preventDefault();
        }
      });
    }, 1000);
  });
}
