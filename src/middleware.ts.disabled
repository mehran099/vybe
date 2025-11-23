import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default auth(async (req) => {
  const { userId } = await auth();
  const currentPath = req.nextUrl.pathname;

  // Redirect authenticated users away from auth pages
  if (userId && (currentPath.startsWith('/sign-in') || currentPath.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Define protected routes
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

  // Protect routes
  if (isProtectedRoute && !userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Handle room access - allow guests for public rooms
  if (currentPath.startsWith('/rooms/') && !userId) {
    // For now, allow room browsing without authentication
    // You could add logic here to check if it's a public room
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};