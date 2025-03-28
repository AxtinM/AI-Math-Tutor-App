'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Handle online/offline events
    const handleOnline = () => {
      setIsOffline(false);
      setShowIndicator(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowIndicator(true);

      // Hide the indicator after 5 seconds
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 5000);

      return () => clearTimeout(timer);
    };

    // Set initial state
    setIsOffline(!navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't render anything if online or if we shouldn't show the indicator
  if (!isOffline || !showIndicator) {
    return null;
  }

  return (
    <div className="offline-indicator" role="alert">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <WifiOff className="size-4" />
        <span>أنت غير متصل بالإنترنت</span>
      </div>
    </div>
  );
}
