'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus, Share } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Extend Navigator interface to include iOS standalone property
interface IOSNavigator extends Navigator {
  standalone?: boolean;
}

type Platform = 'android' | 'ios' | 'desktop' | 'unknown';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<Platform>('unknown');
  const isMobile = useIsMobile();

  // Detect platform and check if app is installed
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios');
    } else if (/android/.test(ua)) {
      setPlatform('android');
    } else if (!isMobile) {
      setPlatform('desktop');
    } else {
      setPlatform('unknown');
    }

    // Check if app is running in standalone mode
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as IOSNavigator).standalone === true;

    setIsInstalled(isRunningStandalone);
  }, [isMobile]);

  // Handle beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      await deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      await deferredPrompt.userChoice;
      // Reset the deferred prompt variable
      setDeferredPrompt(null);
    }
  };

  const dismissPrompt = () => {
    setDeferredPrompt(null);
  };

  // Don't show the prompt if app is already installed or not on mobile
  if (isInstalled || !deferredPrompt || !isMobile) return null;

  // iOS specific instructions
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
            <div className="bg-blue-500 rounded-full flex items-center justify-center size-6 text-white ml-2 rtl:mr-2 rtl:ml-0">1</div>
            <p className="text-sm">
              انقر على <Share className="inline size-4 mx-1 text-blue-500" /> في شريط المتصفح
            </p>
          </div>
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-full flex items-center justify-center size-6 text-white ml-2 rtl:mr-2 rtl:ml-0">2</div>
            <p className="text-sm">
              قم بالتمرير لأسفل واختر <span className="font-semibold">إضافة إلى الشاشة الرئيسية</span>
            </p>
          </div>
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-full flex items-center justify-center size-6 text-white ml-2 rtl:mr-2 rtl:ml-0">3</div>
            <p className="text-sm">
              انقر على <span className="font-semibold">إضافة</span> في النافذة المنبثقة
            </p>
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

  // Android and other platforms
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
      <div className="mt-3 flex justify-end space-x-3 rtl:space-x-reverse">
        <Button variant="outline" onClick={dismissPrompt}>
          لاحقًا
        </Button>
        <Button onClick={handleInstallClick}>
          <Plus className="size-4 mr-2 rtl:ml-2 rtl:mr-0" />
          تثبيت
        </Button>
      </div>
    </div>
  );
}
