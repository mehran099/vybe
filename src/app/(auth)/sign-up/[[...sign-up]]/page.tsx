import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { ArrowLeft, Shield, Calendar } from 'lucide-react';

export default function SignUpPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-4">
      <div className="w-full max-w-md">
        {/* Back to Sign In */}
        <div className="mb-6">
          <Link
            href="/sign-in"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join the Vybe community and unlock all features
          </p>
        </div>

        {/* Age Verification Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
                Age Requirement
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-xs">
                You must be at least 13 years old to use Vybe. Users under 18 have additional safety protections.
              </p>
            </div>
          </div>
        </div>

        {/* Clerk Sign Up */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          <SignUp
            appearance={{
              baseTheme: theme === 'dark' ? dark : undefined,
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none border-0 bg-transparent',
                formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm normal-case font-semibold',
                formFieldInput: 'rounded-lg border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700',
                socialButtonsBlockButton: 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
                dividerLine: 'bg-gray-200 dark:bg-gray-600',
                headerTitle: 'text-gray-900 dark:text-white',
                headerSubtitle: 'text-gray-600 dark:text-gray-400',
                formFieldLabel: 'text-gray-700 dark:text-gray-300',
                formFieldHintText: 'text-gray-500 dark:text-gray-400',
                footerActionLink: 'text-purple-600 hover:text-purple-700',
                identityPreviewText: 'text-gray-900 dark:text-white',
                identityPreviewEditButton: 'text-purple-600 hover:text-purple-700',
                termsPageLink: 'text-purple-600 hover:text-purple-700 underline',
                privacyPageLink: 'text-purple-600 hover:text-purple-700 underline',
              },
            }}
            redirectUrl="/onboarding"
            signInUrl="/sign-in"
            unsafeMetadata={{
              isGuest: false,
            }}
          />
        </div>

        {/* Guest Access Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Just want to try it out?{' '}
            <Link
              href="/sign-in"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Continue as guest
            </Link>
          </p>
        </div>

        {/* Safety Notice */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Vybe is committed to providing a safe environment. All users must follow our{' '}
            <Link href="/community-guidelines" className="text-purple-600 hover:text-purple-700">
              Community Guidelines
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}