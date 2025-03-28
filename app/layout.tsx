import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import Script from 'next/script';

import { ThemeProvider } from '@/components/theme-provider';
import DecorativePattern from '@/components/decorative-pattern';
import './globals.css';

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
};

export const metadata: Metadata = {
  title: "مساعد الواجبات الذكي",
  description: "مساعدك الذكي لحل واجباتك المدرسية في مختلف المواد",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next14", "pwa", "واجبات", "مساعدة دراسية", "ذكاء اصطناعي", "تعليم", "رياضيات", "علوم", "تاريخ", "جغرافيا", "لغات"],
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
      <head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
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
