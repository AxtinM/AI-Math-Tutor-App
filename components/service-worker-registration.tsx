'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ServiceWorkerRegistration() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Function to handle the service worker update
  const handleUpdate = () => {
    if (registration && registration.waiting) {
      // Send a message to the waiting service worker to skip waiting and become active
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page to load the new version
      window.location.reload();
    }
  };

  useEffect(() => {
    const isSecureContext = window.location.protocol === 'https:' || 
                           window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';

    if ('serviceWorker' in navigator && isSecureContext) {
      const registerSW = async () => {
        try {
          // Register the service worker
          const reg = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registration successful with scope:', reg.scope);
          setRegistration(reg);

          // Check if there's an update available
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
              // When the service worker is installed and waiting to activate
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New version available');
                setUpdateAvailable(true);
                toast('تحديث جديد متاح', {
                  description: 'انقر هنا لتحديث التطبيق إلى أحدث إصدار',
                  action: {
                    label: 'تحديث',
                    onClick: handleUpdate
                  },
                  duration: 10000
                });
              }
            });
          });

          // Handle service worker updates from other tabs
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            // If we're reloading due to our skipWaiting() call, don't reload again
            if (document.visibilityState === 'visible') {
              window.location.reload();
            }
          });

          // Add listener for message from the service worker (e.g., for cache updates)
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'CACHE_UPDATED') {
              console.log('Content updated in cache:', event.data.url);
            }
          });
        } catch (err) {
          console.error('Service Worker registration failed:', err);
        }
      };

      // Initialize the service worker
      registerSW();
    } else {
      console.log('Service Workers not supported or not in secure context');
    }

    return () => {
      if (registration) {
        registration.removeEventListener('updatefound', () => {});
      }
    };
  }, []);

  return null;
}
