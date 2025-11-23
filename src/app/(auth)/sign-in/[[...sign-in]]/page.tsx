import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';

export default function SignInPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Vybe
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect, chat, and collaborate with friends
          </p>
        </div>

        {/* Guest Access Button */}
        <div className="mb-6">
          <Link
            href="/dashboard?guest=true"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Users className="w-5 h-5" />
            Continue as Guest
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            No account required • Limited features
          </p>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 text-gray-500 dark:text-gray-400">
              OR
            </span>
          </div>
        </div>

        {/* Clerk Sign In */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          <SignIn
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
              },
            }}
            redirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              href="/sign-up"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Age Notice */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing up, you confirm you are at least 13 years old and agree to our{' '}
            <Link href="/terms" className="text-purple-600 hover:text-purple-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-purple-600 hover:text-purple-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}