import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public and protected routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/rooms(.*)', // Allow public room browsing
]);

const isProtectedRoute = createRouteMatcher([
  '/dashboard',
  '/profile',
  '/friends',
  '/rooms/create',
  '/settings',
]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const currentPath = req.nextUrl.pathname;

  // Redirect authenticated users away from auth pages
  if (userId && (currentPath.startsWith('/sign-in') || currentPath.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Protect routes
  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Handle room access - allow guests for public rooms
  if (currentPath.startsWith('/rooms/') && !userId) {
    // You could add logic here to check if it's a public room
    // For now, redirect to sign-in
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};