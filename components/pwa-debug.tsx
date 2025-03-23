'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function PWADebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{
    browserSupport: string;
    installState: string;
    manifestStatus: string;
    serviceWorkerStatus: string;
    iconsStatus: string[];
    secureContext: boolean;
    canInstall: boolean;
    lastPromptTime: string;
    installPromptAvailable: boolean;
    events: Array<{timestamp: string, message: string}>;
  }>({
    browserSupport: 'Checking...',
    installState: 'unknown',
    manifestStatus: 'Checking...',
    serviceWorkerStatus: 'Checking...',
    iconsStatus: [],
    secureContext: false,
    canInstall: false,
    lastPromptTime: 'Never',
    installPromptAvailable: false,
    events: []
  });

  // Toggle debug panel visibility
  const toggleVisibility = () => setIsVisible(!isVisible);

  // Function to manually trigger install
  const triggerInstall = async () => {
    if (window.__PWA_DEBUG?.installPromptEvent) {
      try {
        console.log('[PWA Debug] Manually triggering installation');
        await (window.__PWA_DEBUG.installPromptEvent as any).prompt();
        const choice = await (window.__PWA_DEBUG.installPromptEvent as any).userChoice;
        console.log('[PWA Debug] User choice:', choice.outcome);
        refreshDebugInfo();
      } catch (error) {
        console.error('[PWA Debug] Error triggering install:', error);
      }
    } else {
      console.log('[PWA Debug] No install event available');
      alert('Installation prompt not available. This may be because:\n\n' +
            '1. The app is already installed\n' +
            '2. Your browser doesn\'t support installation\n' +
            '3. Installation criteria are not met\n' +
            '4. You\'ve already seen the prompt recently');
    }
  };

  // Function to refresh debug information
  const refreshDebugInfo = async () => {
    try {
      // Check browser
      const ua = navigator.userAgent;
      const isChrome = /chrome/i.test(ua) && !/edge|edg/i.test(ua);
      const isEdge = /edge|edg/i.test(ua);
      const isFirefox = /firefox/i.test(ua);
      const isSafari = /safari/i.test(ua) && !/chrome|chromium/i.test(ua);
      const isSamsung = /samsungbrowser/i.test(ua);
      const supportedBrowser = isChrome || isEdge || isSamsung;
      
      const browserSupport = `${supportedBrowser ? 'Supported' : 'Not supported'} (${
        isChrome ? 'Chrome' : isEdge ? 'Edge' : isSamsung ? 'Samsung' : 
        isFirefox ? 'Firefox' : isSafari ? 'Safari' : 'Other'
      })`;
      
      // Check manifest
      let manifestStatus = 'Unknown';
      try {
        const manifestResponse = await fetch('/manifest.json');
        manifestStatus = manifestResponse.ok ? 'Available' : `Error (${manifestResponse.status})`;
      } catch (err) {
        manifestStatus = `Error: ${err instanceof Error ? err.message : String(err)}`;
      }
      
      // Check service worker
      let serviceWorkerStatus = 'Unknown';
      let swRegistrations: readonly ServiceWorkerRegistration[] = [];
      if ('serviceWorker' in navigator) {
        try {
          swRegistrations = await navigator.serviceWorker.getRegistrations();
          serviceWorkerStatus = swRegistrations.length > 0 ? 
            `Registered (${swRegistrations.length}, scope: ${swRegistrations[0].scope})` : 
            'Not registered';
        } catch (err) {
          serviceWorkerStatus = `Error: ${err instanceof Error ? err.message : String(err)}`;
        }
      } else {
        serviceWorkerStatus = 'Not supported';
      }
      
      // Check installation state
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.matchMedia('(display-mode: window-controls-overlay)').matches ||
                         (navigator as any).standalone === true;
      
      // Check icons
      const iconPaths = [
        '/images/icons/icon-192x192.png',
        '/images/icons/icon-512x512.png',
        '/apple-touch-icon.png',
        '/images/math_tutor_ico.png'
      ];
      
      const iconPromises = iconPaths.map(async (path) => {
        try {
          const response = await fetch(path);
          return `${path}: ${response.ok ? 'Available' : `Error (${response.status})`}`;
        } catch (err) {
          return `${path}: Error - ${err instanceof Error ? err.message : String(err)}`;
        }
      });
      
      const iconsStatus = await Promise.all(iconPromises);
      
      // Check last prompt time
      let lastPromptTime = 'Never';
      try {
        const storedTime = localStorage.getItem('pwaPromptLastShown');
        if (storedTime) {
          const date = new Date(parseInt(storedTime));
          lastPromptTime = `${date.toLocaleString()} (${
            Math.round((Date.now() - parseInt(storedTime)) / (1000 * 60 * 60))
          } hours ago)`;
        }
      } catch (error) {
        lastPromptTime = `Error: ${error instanceof Error ? error.message : String(error)}`;
      }
      
      setDebugInfo({
        browserSupport,
        installState: window.__PWA_DEBUG?.installationState || (isStandalone ? 'running-installed' : 'unknown'),
        manifestStatus,
        serviceWorkerStatus,
        iconsStatus,
        secureContext: window.isSecureContext,
        canInstall: supportedBrowser && window.isSecureContext && swRegistrations.length > 0,
        lastPromptTime,
        installPromptAvailable: !!window.__PWA_DEBUG?.installPromptEvent,
        events: window.__PWA_DEBUG?.events || []
      });
    } catch (error) {
      console.error('[PWA Debug] Error refreshing debug info:', error);
    }
  };
  
  // Clear PWA storage and registration (for testing)
  const resetPWA = async () => {
    if (confirm('This will clear all PWA data and service worker registrations. This is meant for debugging only. Continue?')) {
      try {
        // Clear storage
        localStorage.removeItem('pwaPromptLastShown');
        
        // Unregister service workers
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            console.log('[PWA Debug] Unregistered service worker');
          }
        }
        
        // Clear caches
        if ('caches' in window) {
          const cacheKeys = await caches.keys();
          for (const cacheKey of cacheKeys) {
            await caches.delete(cacheKey);
            console.log('[PWA Debug] Deleted cache:', cacheKey);
          }
        }
        
        // Reset debug state
        if (window.__PWA_DEBUG) {
          window.__PWA_DEBUG.installPromptEvent = null;
          window.__PWA_DEBUG.installationState = 'reset';
          window.__PWA_DEBUG.log('PWA state reset');
        }
        
        alert('PWA data cleared. Please refresh the page.');
        refreshDebugInfo();
      } catch (error) {
        console.error('[PWA Debug] Error resetting PWA:', error);
        alert(`Error resetting PWA: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };

  // Initial debug info collection
  useEffect(() => {
    refreshDebugInfo();
    
    // Set up interval to refresh the debug info every 5 seconds
    const intervalId = setInterval(refreshDebugInfo, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development' && !isVisible) {
    return (
      <Button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 z-50 p-2 text-xs bg-red-600 hover:bg-red-700"
      >
        PWA Debug
      </Button>
    );
  }

  if (!isVisible) {
    return (
      <Button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 z-50 p-2 text-xs bg-red-600 hover:bg-red-700"
      >
        PWA Debug
      </Button>
    );
  }

  return (
    // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">PWA Installation Debug</h2>
          <Button variant="outline" onClick={toggleVisibility}>Close</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
            <h3 className="font-medium mb-2">PWA Installation Status</h3>
            <p><strong>State:</strong> {debugInfo.installState}</p>
            <p><strong>Can Install:</strong> {debugInfo.canInstall ? 'Yes' : 'No'}</p>
            <p><strong>Install Prompt Available:</strong> {debugInfo.installPromptAvailable ? 'Yes' : 'No'}</p>
            <p><strong>Last Prompt Shown:</strong> {debugInfo.lastPromptTime}</p>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
            <h3 className="font-medium mb-2">Browser Support</h3>
            <p><strong>Browser:</strong> {debugInfo.browserSupport}</p>
            <p><strong>Secure Context:</strong> {debugInfo.secureContext ? 'Yes' : 'No'}</p>
            <p><strong>Display Mode:</strong> {window.matchMedia('(display-mode: standalone)').matches ? 'Standalone' : 'Browser'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
            <h3 className="font-medium mb-2">Manifest</h3>
            <p><strong>Status:</strong> {debugInfo.manifestStatus}</p>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
            <h3 className="font-medium mb-2">Service Worker</h3>
            <p><strong>Status:</strong> {debugInfo.serviceWorkerStatus}</p>
          </div>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-4">
          <h3 className="font-medium mb-2">Icons</h3>
          <ul className="list-disc list-inside">
            {debugInfo.iconsStatus.map((status, index) => (
              <li key={index} className={status.includes('Error') ? 'text-red-500' : ''}>
                {status}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-4">
          <h3 className="font-medium mb-2">Event Log</h3>
          <div className="max-h-40 overflow-y-auto">
            {debugInfo.events.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {debugInfo.events.map((event, index) => (
                  <li key={index}>
                    <span className="text-gray-500">{new Date(event.timestamp).toLocaleTimeString()}</span> - {event.message}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No events logged yet</p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button onClick={refreshDebugInfo}>Refresh Info</Button>
          <Button 
            onClick={triggerInstall}
            disabled={!debugInfo.installPromptAvailable}
            variant={debugInfo.installPromptAvailable ? 'default' : 'outline'}
          >
            Manual Install
          </Button>
          <Button variant="destructive" onClick={resetPWA}>
            Reset PWA State
          </Button>
        </div>
      </div>
    </div>
  );
}
