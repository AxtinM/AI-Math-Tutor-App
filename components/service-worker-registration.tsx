'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.protocol === 'https:' || 
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
      
      console.log('Service Worker registration starting...');
      
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registration successful with scope:', registration.scope);
        })
        .catch(err => {
          console.error('Service Worker registration failed:', err);
        });
    } else {
      console.log('Service Workers not supported or not in secure context');
    }
  }, []);

  return null;
}
