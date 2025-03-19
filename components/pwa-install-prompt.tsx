'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canShowToday, setCanShowToday] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if app is already installed
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
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

    // Store the install prompt event
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
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

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
          تثبيت
        </Button>
      </div>
    </div>
  );
}
