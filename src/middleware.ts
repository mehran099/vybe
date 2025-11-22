import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
    '/rooms(.*)', // Allow public room browsing
  ],
  ignoredRoutes: [
    '/api/webhooks(.*)',
  ],

  afterAuth(auth, req) {
    const { userId, isSignedIn } = auth;
    const currentPath = req.nextUrl.pathname;

    // Redirect authenticated users away from auth pages
    if (isSignedIn && (currentPath.startsWith('/sign-in') || currentPath.startsWith('/sign-up'))) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Handle protected routes
    const protectedRoutes = [
      '/dashboard',
      '/profile',
      '/friends',
      '/rooms/create',
      '/settings',
    ];

    const isProtectedRoute = protectedRoutes.some(route =>
      currentPath.startsWith(route)
    );

    if (isProtectedRoute && !isSignedIn) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // Handle room access - allow guests for public rooms
    if (currentPath.startsWith('/rooms/') && !isSignedIn) {
      // You could add logic here to check if it's a public room
      // For now, redirect to sign-in
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};