'use client';

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

export default function ServiceWorkerRegistration() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const registrationAttempted = useRef(false);

  // Function to handle the service worker update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUpdate = () => {
    if (registration && registration.waiting) {
      console.log('[PWA] Skipping waiting and activating new service worker');
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

    console.log('[PWA] Service Worker Registration running in secure context:', isSecureContext);
    console.log('[PWA] Service Worker Registration browser supports SW:', 'serviceWorker' in navigator);

    if ('serviceWorker' in navigator && isSecureContext) {
      // Don't register multiple times
      if (registrationAttempted.current) {
        console.log('[PWA] Service Worker registration already attempted');
        return;
      }
      
      registrationAttempted.current = true;
      const registerSW = async () => {
        try {
          console.log('[PWA] Registering service worker at /sw.js');
          
          // Clear any existing registrations first to ensure clean state
          const existingRegistrations = await navigator.serviceWorker.getRegistrations();
          if (existingRegistrations.length > 0) {
            console.log('[PWA] Found existing service worker registrations:', existingRegistrations.length);
            for (const reg of existingRegistrations) {
              console.log('[PWA] Unregistering existing service worker');
              await reg.unregister();
            }
          }
          
          // Register the service worker
          const reg = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });
          console.log('[PWA] Service Worker registration successful with scope:', reg.scope);
          setRegistration(reg);
          setRegistrationStatus('success');

          // Immediately check the service worker state
          if (reg.installing) {
            console.log('[PWA] Service worker installing');
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              console.log('[PWA] Service worker state changed to:', newWorker.state);
            });
          } else if (reg.waiting) {
            console.log('[PWA] Service worker waiting');
          } else if (reg.active) {
            console.log('[PWA] Service worker active');
          }

          // Check if there's an update available
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) {
              console.log('[PWA] updatefound event but no installing worker');
              return;
            }

            console.log('[PWA] New service worker update found');
            newWorker.addEventListener('statechange', () => {
              console.log('[PWA] Service worker state changed to:', newWorker.state);
              // When the service worker is installed and waiting to activate
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] New version available and ready to use');
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
            console.log('[PWA] Service worker controller changed');
            // If we're reloading due to our skipWaiting() call, don't reload again
            if (document.visibilityState === 'visible') {
              window.location.reload();
            }
          });

          // Add listener for message from the service worker (e.g., for cache updates)
          navigator.serviceWorker.addEventListener('message', (event) => {
            console.log('[PWA] Received message from service worker:', event.data);
            if (event.data && event.data.type === 'CACHE_UPDATED') {
              console.log('[PWA] Content updated in cache:', event.data.url);
            }
          });
          
          // Check for existing controller to determine if SW is already active
          if (navigator.serviceWorker.controller) {
            console.log('[PWA] Page already controlled by a service worker');
          } else {
            console.log('[PWA] No controller yet - first visit or no SW support');
          }
          
          // Signal that PWA functionality is ready
          window.dispatchEvent(new CustomEvent('pwaReady', { detail: { registration: reg } }));
          
        } catch (err) {
          console.error('[PWA] Service Worker registration failed:', err);
          setRegistrationStatus('error');
          toast('خطأ في تسجيل العامل الخدمي', {
            description: 'قد لا تعمل بعض ميزات التطبيق بشكل صحيح',
            duration: 5000
          });
        }
      };

      // Initialize the service worker
      console.log('[PWA] Initializing service worker registration');
      registerSW();
    } else {
      console.log('[PWA] Service Workers not supported or not in secure context');
      toast('وضع الاتصال المحدود', {
        description: 'لن يعمل التطبيق في وضع عدم الاتصال',
        duration: 5000
      });
    }

    return () => {
      if (registration) {
        registration.removeEventListener('updatefound', () => {});
      }
    };
  }, [handleUpdate, registration]);

  // Expose registration status to window for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__PWA_REGISTRATION_STATUS = {
        status: registrationStatus,
        registration: registration
      };
    }
  }, [registrationStatus, registration]);

  return null;
}
