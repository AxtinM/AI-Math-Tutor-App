declare module 'next-pwa' {
  import type { NextConfig } from 'next';
  
  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    buildExcludes?: Array<RegExp | string>;
    publicExcludes?: Array<string>; // Files to exclude from being copied to the public folder
    runtimeCaching?: Array<{
      urlPattern: RegExp | string | ((options: { request: Request }) => boolean);
      handler: string;
      options?: {
        cacheName?: string;
        expiration?: {
          maxEntries?: number;
          maxAgeSeconds?: number;
        };
        cacheableResponse?: {
          statuses: number[];
          headers?: Record<string, string>;
        };
        networkTimeoutSeconds?: number;
      };
    }>;
    skipWaiting?: boolean;
    fallbacks?: {
      document?: string;
      image?: string;
      font?: string;
      audio?: string;
      video?: string;
    };
  }

  export default function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
}
