'use client';

// Add type definitions for the global PWA debug object
declare global {
  interface Window {
    __PWA_DEBUG: {
      events: Array<{timestamp: string, message: string}>;
      installPromptEvent: Event | null;
      installationState: string;
      log: (message: string) => void;
    };
  }
}

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus, Share, ArrowDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Extend Window interface to include iOS standalone property
interface IOSNavigator extends Navigator {
  standalone?: boolean;
}

type Platform = 'android' | 'ios' | 'desktop' | 'unknown';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canShowToday, setCanShowToday] = useState(false);
  const [platform, setPlatform] = useState<Platform>('unknown');
  const [installError, setInstallError] = useState<string | null>(null);
  const promptEventReceived = useRef(false);
  const isMobile = useIsMobile();

  // Log PWA installation eligibility for debugging
  // Use the global PWA debug object for logging and state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log('[PWA] Checking installation eligibility');
    
    // Initialize the global object if it doesn't exist yet
    if (!window.__PWA_DEBUG) {
      window.__PWA_DEBUG = {
        events: [],
        installPromptEvent: null,
        installationState: 'unknown',
        log: function(message: string) {
          console.log(`[PWA Debug] ${message}`);
          this.events.push({
            timestamp: new Date().toISOString(),
            message: message
          });
        }
      };
    }
    
    window.__PWA_DEBUG.log('PWAInstallPrompt component mounted');
    
    // Check if the beforeinstallprompt event was already captured
    if (window.__PWA_DEBUG.installPromptEvent) {
      console.log('[PWA] Found existing install prompt event in global object');
      setDeferredPrompt(window.__PWA_DEBUG.installPromptEvent as BeforeInstallPromptEvent);
      promptEventReceived.current = true;
    }
    
    // Check if manifest exists
    fetch('/manifest.json')
      .then(response => {
        const status = response.status;
        const isAvailable = response.ok;
        console.log('[PWA] Manifest status:', status, isAvailable ? 'Available' : 'Not available');
        window.__PWA_DEBUG.log(`Manifest check: ${status} (${isAvailable ? 'Available' : 'Not available'})`);
      })
      .catch(err => {
        console.error('[PWA] Error fetching manifest:', err);
        window.__PWA_DEBUG.log(`Error fetching manifest: ${err.message}`);
      });

    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then(registrations => {
          const count = registrations.length;
          console.log('[PWA] Service worker registrations:', count);
          window.__PWA_DEBUG.log(`Service Worker registrations: ${count}`);
          if (count > 0) {
            window.__PWA_DEBUG.log(`Service Worker scope: ${registrations[0].scope}`);
          }
        })
        .catch(err => {
          console.error('[PWA] Error checking service worker:', err);
          window.__PWA_DEBUG.log(`Error checking Service Worker: ${err.message}`);
        });
    }

    // Check for the main icons from the manifest
    const checkIconExists = (path: string) => {
      fetch(path)
        .then(response => {
          const status = response.status;
          const isAvailable = response.ok;
          console.log(`[PWA] Icon at ${path}:`, status, isAvailable ? 'Available' : 'Not available');
          window.__PWA_DEBUG.log(`Icon at ${path}: ${status} (${isAvailable ? 'Available' : 'Not available'})`);
        })
        .catch(err => {
          console.error(`[PWA] Error fetching icon at ${path}:`, err);
          window.__PWA_DEBUG.log(`Error fetching icon at ${path}: ${err.message}`);
        });
    };

    [
      '/images/icons/icon-192x192.png',
      '/images/icons/icon-512x512.png',
      '/apple-touch-icon.png',
      '/images/math_tutor_ico.png' // Check the icon referenced in the manifest.json
    ].forEach(checkIconExists);

    // Log browser-specific installation criteria
    const userAgent = navigator.userAgent;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const platform = navigator.platform;
    
    console.log('[PWA] Browser details:', userAgent);
    console.log('[PWA] In standalone mode:', isStandalone);
    console.log('[PWA] Platform detection:', platform);
    
    window.__PWA_DEBUG.log(`Browser: ${userAgent}`);
    window.__PWA_DEBUG.log(`Standalone mode: ${isStandalone}`);
    window.__PWA_DEBUG.log(`Platform: ${platform}`);
    
    // Check browser compatibility for PWA installation
    const isChrome = /chrome/i.test(userAgent) && !/edge|edg/i.test(userAgent);
    const isEdge = /edge|edg/i.test(userAgent);
    const isFirefox = /firefox/i.test(userAgent);
    const isSafari = /safari/i.test(userAgent) && !/chrome|chromium/i.test(userAgent);
    const isSamsung = /samsungbrowser/i.test(userAgent);
    
    window.__PWA_DEBUG.log(`Browser support check: Chrome: ${isChrome}, Edge: ${isEdge}, Firefox: ${isFirefox}, Safari: ${isSafari}, Samsung: ${isSamsung}`);
    window.__PWA_DEBUG.log(`PWA installation likely supported: ${isChrome || isEdge || isSamsung}`);
    
    // Check if we're in a secure context
    const isSecureContext = window.isSecureContext;
    window.__PWA_DEBUG.log(`Is secure context: ${isSecureContext}`);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Detect platform
    const detectPlatform = (): Platform => {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) return 'ios';
      if (/android/.test(ua)) return 'android';
      if (!isMobile) return 'desktop';
      return 'unknown';
    };

    const platform = detectPlatform();
    setPlatform(platform);
    if (window.__PWA_DEBUG) {
      window.__PWA_DEBUG.log(`Detected platform: ${platform}`);
    }

    // Check if app is already installed
    const isRunningStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.matchMedia('(display-mode: window-controls-overlay)').matches ||
      (navigator as IOSNavigator).standalone === true;
      
    if (isRunningStandalone) {
      setIsInstalled(true);
      if (window.__PWA_DEBUG) {
        window.__PWA_DEBUG.log('App is already installed and running in standalone mode');
        window.__PWA_DEBUG.installationState = 'running-installed';
      }
      return;
    }
    
    // Check if we should show prompt based on last shown timestamp
    const checkLastPromptTime = () => {
      try {
        const lastPromptTime = localStorage.getItem('pwaPromptLastShown');
        const currentTime = new Date().getTime();
        
        // Show if never shown before or last shown > 24 hours ago
        const shouldShow = !lastPromptTime || 
          (currentTime - parseInt(lastPromptTime)) > 24 * 60 * 60 * 1000;
        
        setCanShowToday(shouldShow);
        
        if (window.__PWA_DEBUG) {
          window.__PWA_DEBUG.log(`Can show prompt today: ${shouldShow}`);
          if (lastPromptTime) {
            const hoursSinceLastPrompt = (currentTime - parseInt(lastPromptTime)) / (1000 * 60 * 60);
            window.__PWA_DEBUG.log(`Hours since last prompt: ${hoursSinceLastPrompt.toFixed(2)}`);
          } else {
            window.__PWA_DEBUG.log('Prompt never shown before');
          }
        }
      } catch (error) {
        // In case of any localStorage errors, default to showing the prompt
        console.error('[PWA] Error accessing localStorage:', error);
        setCanShowToday(true);
        if (window.__PWA_DEBUG) {
          window.__PWA_DEBUG.log(`Error checking last prompt time: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    };

    // Function to handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[PWA] beforeinstallprompt event captured', e);
      e.preventDefault();
      
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setShowPrompt(true);
      promptEventReceived.current = true;
      
      // Also store in global object for debugging
      if (window.__PWA_DEBUG) {
        window.__PWA_DEBUG.installPromptEvent = promptEvent;
        window.__PWA_DEBUG.installationState = 'can-be-installed';
        window.__PWA_DEBUG.log('beforeinstallprompt event captured in component');
      }
      
      checkLastPromptTime();
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Listen for the custom pwaInstallable event (from worker-register.js)
    window.addEventListener('pwaInstallable', ((e: CustomEvent) => {
      console.log('[PWA] Received pwaInstallable custom event', e);
      if (e.detail && e.detail.promptEvent) {
        handleBeforeInstallPrompt(e.detail.promptEvent);
      }
    }) as EventListener);

    // Check if the app was just installed
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App was installed');
      setIsInstalled(true);
      setShowPrompt(false);
      
      if (window.__PWA_DEBUG) {
        window.__PWA_DEBUG.installationState = 'installed';
        window.__PWA_DEBUG.log('App was installed (appinstalled event in component)');
      }
      
      // Store installation time to prevent showing prompt again
      try {
        localStorage.setItem('pwaPromptLastShown', new Date().getTime().toString());
      } catch (error) {
        console.error('[PWA] Error writing to localStorage:', error);
        if (window.__PWA_DEBUG) {
          window.__PWA_DEBUG.log(`Error updating localStorage after install: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    });

    // Initial check
    checkLastPromptTime();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwaInstallable', (() => {}) as EventListener);
    };
  }, [isMobile]);

  // Debug timeout to check for installation event
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Add timeout to check if event was received
    const timeout = setTimeout(() => {
      if (!promptEventReceived.current) {
        console.log('[PWA] No beforeinstallprompt event received after 3 seconds');
        console.log('[PWA] This could be because:');
        console.log('[PWA] - The app is already installed');
        console.log('[PWA] - The browser doesn\'t support installation');
        console.log('[PWA] - The PWA criteria are not met');
        console.log('[PWA] - You\'ve already seen the prompt recently');
        
        if (window.__PWA_DEBUG) {
          window.__PWA_DEBUG.log('No beforeinstallprompt event received after 3 seconds');
          
          // Check if the browser is supported
          const isChrome = /chrome/i.test(navigator.userAgent) && !/edge|edg/i.test(navigator.userAgent);
          const isEdge = /edge|edg/i.test(navigator.userAgent);
          const isSamsung = /samsungbrowser/i.test(navigator.userAgent);
          
          if (!(isChrome || isEdge || isSamsung)) {
            window.__PWA_DEBUG.log('Browser may not support PWA installation');
            window.__PWA_DEBUG.installationState = 'browser-not-supported';
          }
        }
      }
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, []);

  const handleInstallClick = async () => {
    console.log('[PWA] Install button clicked');
    setInstallError(null);
    
    if (window.__PWA_DEBUG) {
      window.__PWA_DEBUG.log('Install button clicked');
    }
    
    // First check if we have a deferredPrompt in state
    let promptToUse = deferredPrompt;
    
    // If not in state, check the global object
    if (!promptToUse && window.__PWA_DEBUG && window.__PWA_DEBUG.installPromptEvent) {
      console.log('[PWA] Using installPromptEvent from global object');
      promptToUse = window.__PWA_DEBUG.installPromptEvent as BeforeInstallPromptEvent;
      setDeferredPrompt(promptToUse);
    }
    
    // For Android and desktop, trigger the native install prompt
    if (promptToUse) {
      try {
        console.log('[PWA] Showing install prompt');
        if (window.__PWA_DEBUG) {
          window.__PWA_DEBUG.log('Showing install prompt');
        }
        
        // Show the install prompt
        await promptToUse.prompt();

        // Wait for the user to respond to the prompt
        const choiceResult = await promptToUse.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] User accepted the install prompt');
          if (window.__PWA_DEBUG) {
            window.__PWA_DEBUG.log('User accepted the install prompt');
            window.__PWA_DEBUG.installationState = 'accepted';
          }
        } else {
          console.log('[PWA] User dismissed the install prompt');
          if (window.__PWA_DEBUG) {
            window.__PWA_DEBUG.log('User dismissed the install prompt');
            window.__PWA_DEBUG.installationState = 'dismissed';
          }
          
          // Save the timestamp when user dismissed the prompt
          try {
            localStorage.setItem('pwaPromptLastShown', new Date().getTime().toString());
          } catch (error) {
            console.error('[PWA] Error writing to localStorage:', error);
            if (window.__PWA_DEBUG) {
              window.__PWA_DEBUG.log(`Error updating localStorage after dismiss: ${error instanceof Error ? error.message : String(error)}`);
            }
          }
        }

        // Clear the deferredPrompt for next time
        setDeferredPrompt(null);
        setShowPrompt(false);
        
        // Also clear from global object
        if (window.__PWA_DEBUG) {
          window.__PWA_DEBUG.installPromptEvent = null;
        }
      } catch (error) {
        console.error('[PWA] Error during installation:', error);
        if (window.__PWA_DEBUG) {
          window.__PWA_DEBUG.log(`Error during installation: ${error instanceof Error ? error.message : String(error)}`);
        }
        setInstallError(error instanceof Error ? error.message : 'Unknown error during installation');
      }
    } else {
      console.warn('[PWA] Install button clicked but no installation prompt is available');
      if (window.__PWA_DEBUG) {
        window.__PWA_DEBUG.log('Install button clicked but no installation prompt is available');
      }
      
      const errorMsg = 'Installation prompt not available';
      setInstallError(errorMsg);
      
      // Try to determine why prompt is not available
      const isChrome = /chrome/i.test(navigator.userAgent) && !/edge|edg/i.test(navigator.userAgent);
      const isEdge = /edge|edg/i.test(navigator.userAgent);
      const isSamsung = /samsungbrowser/i.test(navigator.userAgent);
      
      if (!(isChrome || isEdge || isSamsung)) {
        const browserMsg = 'Your browser may not support PWA installation. Try Chrome, Edge, or Samsung Internet.';
        setInstallError(browserMsg);
        if (window.__PWA_DEBUG) {
          window.__PWA_DEBUG.log(browserMsg);
        }
      } else {
        // Check for other installation criteria
        fetch('/manifest.json')
          .then(response => {
            if (!response.ok) {
              const manifestMsg = 'Web manifest not available or invalid';
              setInstallError(manifestMsg);
              if (window.__PWA_DEBUG) {
                window.__PWA_DEBUG.log(manifestMsg);
              }
            }
          })
          .catch(err => {
            if (window.__PWA_DEBUG) {
              window.__PWA_DEBUG.log(`Error checking manifest: ${err.message}`);
            }
          });
          
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations()
            .then(registrations => {
              if (registrations.length === 0) {
                const swMsg = 'Service worker not registered';
                setInstallError(swMsg);
                if (window.__PWA_DEBUG) {
                  window.__PWA_DEBUG.log(swMsg);
                }
              }
            });
        }
      }
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    
    // Save the timestamp when user dismissed the prompt
    try {
      localStorage.setItem('pwaPromptLastShown', new Date().getTime().toString());
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  // Don't show if already installed, no prompt available, not a mobile device, or already shown today
  if (isInstalled || !showPrompt || !isMobile || (!canShowToday && !deferredPrompt)) return null;

  // iOS specific install instructions
  if (platform === 'ios') {
    return (
      <div className="fixed top-4 inset-x-4 z-50 mx-auto max-w-md rounded-lg bg-white p-4 shadow-lg dark:bg-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-medium">ثبّت التطبيق</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ثبّت هذا التطبيق على جهاز iOS الخاص بك للوصول السريع والاستخدام دون اتصال بالإنترنت
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={dismissPrompt}>
            <X className="size-4" />
          </Button>
        </div>
        <div className="mt-3 space-y-3">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-full flex items-center justify-center size-6 text-white mr-2 rtl:mr-0 rtl:ml-2">1</div>
            <p className="text-sm">انقر على <Share className="inline size-4 mx-1 text-blue-500" /> في شريط المتصفح</p>
          </div>
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-full flex items-center justify-center size-6 text-white mr-2 rtl:mr-0 rtl:ml-2">2</div>
            <p className="text-sm">قم بالتمرير لأسفل واختر <span className="font-semibold">&quot;إضافة إلى الشاشة الرئيسية&quot;</span></p>
          </div>
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-full flex items-center justify-center size-6 text-white mr-2 rtl:mr-0 rtl:ml-2">3</div>
            <p className="text-sm">انقر على <span className="font-semibold">&quot;إضافة&quot;</span> في النافذة المنبثقة</p>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button variant="outline" onClick={dismissPrompt}>
            فهمت
          </Button>
        </div>
      </div>
    );
  }

  // Android specific install prompt
  if (platform === 'android') {
    return (
      <div className="fixed top-4 inset-x-4 z-50 mx-auto max-w-md rounded-lg bg-white p-4 shadow-lg dark:bg-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-medium">ثبّت التطبيق</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ثبّت هذا التطبيق على جهازك للوصول السريع والاستخدام دون اتصال بالإنترنت
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={dismissPrompt}>
            <X className="size-4" />
          </Button>
        </div>
        <div className="mt-2 flex justify-center">
          <ArrowDown className="size-8 text-blue-500 animate-bounce" />
        </div>
        <div className="mt-1 text-center text-sm">
          <p>انقر على <span className="font-bold">&quot;تثبيت&quot;</span> عندما يظهر مربع الحوار</p>
        </div>
        <div className="mt-3 flex justify-end space-x-3 rtl:space-x-reverse">
          <Button variant="outline" onClick={dismissPrompt}>
            لاحقًا
          </Button>
          <Button onClick={handleInstallClick}>
            تثبيت
          </Button>
        </div>
      </div>
    );
  }

  // Desktop prompt (fallback)
  return (
    <div className="fixed top-4 inset-x-4 z-50 mx-auto max-w-md rounded-lg bg-white p-4 shadow-lg dark:bg-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium">ثبّت التطبيق</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ثبّت هذا التطبيق للوصول السريع والاستخدام دون اتصال بالإنترنت
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={dismissPrompt}>
          <X className="size-4" />
        </Button>
      </div>
      <div className="mt-3 flex justify-end space-x-3 rtl:space-x-reverse">
        <Button variant="outline" onClick={dismissPrompt}>
          لاحقًا
        </Button>
        <Button onClick={handleInstallClick}>
          <Plus className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
          تثبيت
        </Button>
      </div>
    </div>
  );
}
