import { NextResponse, NextRequest } from 'next/server';

// Handle PWA service worker files 
export function middleware(request: NextRequest) {
  // Skip middleware for service worker files
  if (
    request.nextUrl.pathname === '/sw.js' ||
    request.nextUrl.pathname.startsWith('/workbox-') ||
    request.nextUrl.pathname.startsWith('/fallback-')
  ) {
    // Return NextResponse.next() to skip this middleware
    // This ensures these files are served directly from the static files directory
    return NextResponse.next();
  }

  // Continue with default handling for all other routes
  return NextResponse.next();
}

// Configure the matcher to apply this middleware to specific paths
export const config = {
  // Specify paths that should be processed by this middleware
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/sw.js',
    '/manifest',
    '/manifest.json',
    '/workbox-:path*',
    '/fallback-:path*',
  ],
};
