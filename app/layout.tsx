import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import Script from 'next/script';

import { ThemeProvider } from '@/components/theme-provider';
import DecorativePattern from '@/components/decorative-pattern';
import PWAInstallPrompt from '@/components/pwa-install-prompt';
import ServiceWorkerRegistration from '@/components/service-worker-registration';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://chat.vercel.ai'),
  title: 'مساعد الرياضيات - Math Tutor',
  description: 'معلم الرياضيات الذكي للأطفال العرب',
  // The manifest is now defined in app/manifest.ts
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Math Tutor',
  },
  applicationName: 'Math Tutor',
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
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
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}
