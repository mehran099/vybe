'use client';

import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

// Mock implementation for development without real Clerk keys
const mockUser = {
  id: 'demo-user-id',
  firstName: 'Demo',
  lastName: 'User',
  username: 'demo_user',
  imageUrl: undefined,
  publicMetadata: { isGuest: false },
};

function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If no valid Clerk key, provide a mock provider for development
  if (!publishableKey || publishableKey.includes('mock')) {
    return <div>{children}</div>;
  }

  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 text-sm normal-case',
          formFieldInput: 'rounded-lg border-gray-200',
          footerActionLink: 'text-purple-600 hover:text-purple-700',
        },
      }}
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/onboarding"
    >
      {children}
    </ClerkProvider>
  );
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

export function useClerkAuth() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If no valid Clerk key, return mock auth for development
  if (!publishableKey || publishableKey.includes('mock')) {
    return {
      isLoaded: true,
      isSignedIn: false, // Start as signed out for demo
      isGuest: false,
      isRegistered: false,
      user: null,
    };
  }

  const { isSignedIn, isLoaded, user } = useAuth();

  const isGuest = isLoaded && isSignedIn && user?.publicMetadata?.isGuest === true;
  const isRegistered = isLoaded && isSignedIn && !isGuest;

  return {
    isLoaded,
    isSignedIn,
    isGuest,
    isRegistered,
    user,
  };
}