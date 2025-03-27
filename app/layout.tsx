import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import Script from 'next/script';

import { ThemeProvider } from '@/components/theme-provider';
import DecorativePattern from '@/components/decorative-pattern';
import './globals.css';

// Define iOS and Android meta tags
const IOS_STATUS_BAR_STYLE = "black-translucent";
const APPLE_TOUCH_ICON_URL = "/images/icons/apple-touch-icon.png";
const THEME_COLOR_LIGHT = "#ffffff";
const THEME_COLOR_DARK = "hsl(240deg 10% 3.92%)";

export const metadata: Metadata = {
  title: "PWA NextJS",
  description: "It's a simple progressive web application made with NextJS",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  authors: [
    {
      name: "imvinojanv",
      url: "https://www.linkedin.com/in/imvinojanv/",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
    { rel: "icon", url: "icons/icon-128x128.png" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      dir="rtl"
      lang='ar'
      suppressHydrationWarning
    >
      <body className="antialiased font-dubai overflow-x-hidden">
        <Script src="/sw.js" strategy="beforeInteractive" />
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
        </ThemeProvider>
      </body>
    </html>
  );
}
