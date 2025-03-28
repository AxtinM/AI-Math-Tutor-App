'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw, Wifi } from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Check connectivity when component mounts and when user tries to reconnect
  useEffect(() => {
    // Update online status
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);

    try {
      // Try to fetch a small resource to check connectivity (cache-busting with Date)
      const response = await fetch(`/api/ping?nocache=${new Date().getTime()}`, {
        method: 'HEAD',
        cache: 'no-store'
      });

      if (response.ok) {
        setIsOnline(true);
        // If we're back online, redirect to home after a brief delay
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setIsOnline(false);
      }
    } catch (error) {
      setIsOnline(false);
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-4 text-center bg-gradient-to-b from-background to-muted/30">
      <div className="bg-background/80 p-8 rounded-xl shadow-lg backdrop-blur-sm max-w-md w-full border border-border">
        <div className="mb-6">
          {isOnline ? (
            <div className="size-24 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <Wifi size={48} />
            </div>
          ) : (
            <div className="size-24 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <WifiOff size={48} />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-2">
          {isOnline ? 'تم استعادة الاتصال!' : 'أنت غير متصل بالإنترنت'}
        </h1>
        <h2 className="text-lg mb-4">
          {isOnline ? 'Connection restored!' : 'You are offline'}
        </h2>

        <p className="mb-6 text-muted-foreground">
          {isOnline
            ? 'جاري إعادة توجيهك للصفحة الرئيسية...'
            : 'يمكنك الاستمرار باستخدام بعض ميزات التطبيق بشكل محدود حتى تستعيد الاتصال بالإنترنت. تحقق من إعدادات الشبكة وحاول مرة أخرى.'
          }
        </p>

        {!isOnline && (
          <div className="flex flex-col gap-3">
            <Button
              onClick={checkConnection}
              disabled={isChecking}
              className="w-full"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="mr-2 size-4 animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 size-4" />
                  التحقق من الاتصال
                </>
              )}
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                العودة إلى المحتوى المخزن محليًا
              </Link>
            </Button>
          </div>
        )}

        {lastChecked && !isOnline && (
          <p className="text-xs text-muted-foreground mt-4">
            آخر محاولة: {lastChecked.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
}
