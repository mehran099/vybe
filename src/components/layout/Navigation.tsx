'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerkAuth } from '@/components/auth/AuthProvider';
import {
  Home,
  MessageSquare,
  Users,
  Settings,
  Plus,
  Search,
  Bell,
  User,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from 'next-themes';

export function Navigation() {
  const { isSignedIn, isGuest, isRegistered, user } = useClerkAuth();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Rooms', href: '/rooms', icon: MessageSquare },
    { name: 'Friends', href: '/friends', icon: Users },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => pathname === href;

  if (!isSignedIn) {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Vybe</span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center ml-10 space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4 inline mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Create room (registered users only) */}
            {isRegistered && (
              <Link
                href="/rooms/create"
                className="hidden md:flex items-center px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Room
              </Link>
            )}

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User menu */}
            <div className="flex items-center">
              <Link
                href="/profile"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {user?.firstName?.[0] || user?.username?.[0] || 'G'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName || user?.username || 'Guest User'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {isGuest ? 'Guest' : 'Registered'}
                  </div>
                </div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 inline mr-3" />
                {item.name}
              </Link>
            ))}

            {/* Create room for mobile */}
            {isRegistered && (
              <Link
                href="/rooms/create"
                className="flex items-center px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Plus className="w-5 h-5 mr-3" />
                Create Room
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}