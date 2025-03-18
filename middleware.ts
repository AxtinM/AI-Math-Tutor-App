import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/app/(auth)/auth';

// Handle authentication and PWA service worker files
export async function middleware(request: NextRequest) {
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

  // Authentication check
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isRegisterPage = request.nextUrl.pathname === '/register';
  const isAuthPage = isLoginPage || isRegisterPage;
  
  // If user is logged in and tries to access auth pages, redirect to home
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not logged in and trying to access protected routes, redirect to login
  if (!isLoggedIn && !isAuthPage && 
      !request.nextUrl.pathname.startsWith('/api') && 
      !request.nextUrl.pathname.startsWith('/_next')) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
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
