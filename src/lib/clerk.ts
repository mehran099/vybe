import { Clerk } from '@clerk/clerk-js';

export const clerk = new Clerk(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, {
  isSatellite: false,
  domain: process.env.NEXT_PUBLIC_CLERK_DOMAIN,
  proxyUrl: process.env.NEXT_PUBLIC_CLERK_PROXY_URL,
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/dashboard',
  afterSignUpUrl: '/onboarding',
  weekendMode: {
    enabled: false,
    startTime: '00:00',
    endTime: '00:00',
  },
  supportEmail: 'support@vybe.app',
});

// Initialize Clerk client
if (typeof window !== 'undefined') {
  clerk.load();
}

export default clerk;