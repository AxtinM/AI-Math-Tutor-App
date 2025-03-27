import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import Script from 'next/script';

import { ThemeProvider } from '@/components/theme-provider';
import DecorativePattern from '@/components/decorative-pattern';
import PWAInstallPrompt from '@/components/pwa-install-prompt';
import ServiceWorkerRegistration from '@/components/service-worker-registration';

import OfflineIndicator from '@/components/offline-indicator';
import './globals.css';

// Define iOS and Android meta tags
const IOS_STATUS_BAR_STYLE = "black-translucent";
const APPLE_TOUCH_ICON_URL = "/images/icons/apple-touch-icon.png";
const THEME_COLOR_LIGHT = "#ffffff";
const THEME_COLOR_DARK = "hsl(240deg 10% 3.92%)";

export const metadata: Metadata = {
  metadataBase: new URL('https://chat.vercel.ai'),
  title: 'مساعد الرياضيات - Math Tutor',
  description: 'معلم الرياضيات الذكي للأطفال العرب',
  // The manifest is now defined in app/manifest.ts
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Math Tutor',
    startupImage: [
      {
        url: '/images/splash/apple-splash-2048-2732.png',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        url: '/images/splash/apple-splash-1668-2388.png',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        url: '/images/splash/apple-splash-1536-2048.png',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        url: '/images/splash/apple-splash-1242-2688.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        url: '/images/splash/apple-splash-1125-2436.png',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        url: '/images/splash/apple-splash-828-1792.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        url: '/images/splash/apple-splash-750-1334.png',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        url: '/images/splash/apple-splash-640-1136.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      }
    ]
  },
  applicationName: 'Math Tutor',
  formatDetection: {
    telephone: false,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(240deg 10% 3.92%)' }
  ],
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'mobile-web-app-capable': 'yes'
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
};

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
        {/* manifest.json is now handled by app/manifest.ts */}
      </head>
      <body className="antialiased font-dubai overflow-x-hidden">
        <Script src="/worker-register.js" strategy="beforeInteractive" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <DecorativePattern />
          <div className="font-dubai">
            {children}
          </div>
          {/* PWA components */}
          <PWAInstallPrompt />
          <OfflineIndicator />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}
