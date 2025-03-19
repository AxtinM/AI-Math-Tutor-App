'use client';

import { useState, useEffect } from 'react';
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
  const isMobile = useIsMobile();

  useEffect(() => {
    // Detect platform
    const detectPlatform = (): Platform => {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) return 'ios';
      if (/android/.test(ua)) return 'android';
      if (!isMobile) return 'desktop';
      return 'unknown';
    };

    setPlatform(detectPlatform());

    // Check if app is already installed
    if (typeof window !== 'undefined' && 
        (window.matchMedia('(display-mode: standalone)').matches || 
         window.matchMedia('(display-mode: window-controls-overlay)').matches ||
         (navigator as IOSNavigator).standalone === true)) {
      setIsInstalled(true);
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
      } catch (error) {
        // In case of any localStorage errors, default to showing the prompt
        console.error('Error accessing localStorage:', error);
        setCanShowToday(true);
      }
    };

    // Store the install prompt event (primarily for Android and desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
      checkLastPromptTime();
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if the app was just installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      
      // Store installation time to prevent showing prompt again
      try {
        localStorage.setItem('pwaPromptLastShown', new Date().getTime().toString());
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    });

    // Initial check
    checkLastPromptTime();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isMobile]);

  const handleInstallClick = async () => {
    // For Android and desktop, trigger the native install prompt
    if (deferredPrompt) {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        // Save the timestamp when user dismissed the prompt
        try {
          localStorage.setItem('pwaPromptLastShown', new Date().getTime().toString());
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      }

      // Clear the deferredPrompt for next time
      setDeferredPrompt(null);
      setShowPrompt(false);
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
  if (isInstalled || !showPrompt || !isMobile || !canShowToday) return null;

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
