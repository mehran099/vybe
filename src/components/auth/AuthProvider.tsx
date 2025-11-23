'use client';

import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 text-sm normal-case',
          formFieldInput: 'rounded-lg border-gray-200',
          footerActionLink: 'text-purple-600 hover:text-purple-700',
        },
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
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