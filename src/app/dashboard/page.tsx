'use client';

import { useState, useEffect } from 'react';
import { useClerkAuth } from '@/components/auth/AuthProvider';
import { Navigation } from '@/components/layout/Navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Star,
  Hash,
  Mic,
  Video,
  FileText,
  Palette
} from 'lucide-react';

interface Room {
  id: string;
  name: string;
  type: 'global' | 'community' | 'private' | 'ephemeral';
  memberCount: number;
  hasUnread: boolean;
  lastActivity: Date;
  role?: 'owner' | 'moderator' | 'member';
}

interface Stat {
  label: string;
  value: string;
  icon: any;
  color: string;
}

export default function Dashboard() {
  const { isSignedIn, isGuest, isRegistered, user } = useClerkAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn) {
      // Simulate loading user's rooms
      const mockRooms: Room[] = [
        {
          id: '1',
          name: 'General Chat',
          type: 'global',
          memberCount: 24,
          hasUnread: true,
          lastActivity: new Date(),
        },
        {
          id: '2',
          name: 'Gaming Central',
          type: 'community',
          memberCount: 156,
          hasUnread: false,
          lastActivity: new Date(Date.now() - 1000 * 60 * 15),
        },
        {
          id: '3',
          name: 'Study Group',
          type: 'private',
          memberCount: 8,
          hasUnread: false,
          lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
          role: 'owner',
        },
      ];

      setTimeout(() => {
        setRooms(mockRooms);
        setLoading(false);
      }, 500);
    }
  }, [isSignedIn]);

  const stats: Stat[] = [
    { label: 'Messages Today', value: '42', icon: MessageSquare, color: 'bg-blue-500' },
    { label: 'Friends Online', value: '12', icon: Users, color: 'bg-green-500' },
    { label: 'Active Calls', value: '2', icon: Mic, color: 'bg-purple-500' },
    { label: 'Files Shared', value: '8', icon: FileText, color: 'bg-orange-500' },
  ];

  const features = [
    {
      icon: MessageSquare,
      title: 'Real-time Chat',
      description: 'Instant messaging with reactions and rich media support',
      available: true,
    },
    {
      icon: Users,
      title: 'Voice & Video Calls',
      description: 'Crystal clear 1:1 voice and video calling',
      available: !isGuest,
    },
    {
      icon: Palette,
      title: 'Collaborative Whiteboard',
      description: 'Draw and create together in real-time',
      available: !isGuest,
    },
    {
      icon: FileText,
      title: 'File Sharing',
      description: 'Share files up to 20MB with preview',
      available: true,
    },
  ];

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to access your dashboard
          </h1>
          <a
            href="/sign-in"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="flex">
        <Sidebar
          rooms={rooms}
          onRoomSelect={setSelectedRoom}
          currentRoomId={selectedRoom || undefined}
        />

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.firstName || user?.username || 'Guest'}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isGuest
                ? 'You\'re using Vybe as a guest. Upgrade to access all features!'
                : 'Ready to connect and collaborate? Let\'s get started.'
              }
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Features */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Available Features
              </h2>
              <div className="space-y-4">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className={`flex items-start space-x-4 p-4 rounded-lg ${
                      feature.available
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        feature.available
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                    >
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                      {!feature.available && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Available for registered users
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {isGuest && (
                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                    Want access to all features? Upgrade your account!
                  </p>
                  <a
                    href="/sign-up"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    Sign up for free →
                  </a>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : rooms.length > 0 ? (
                <div className="space-y-4">
                  {rooms.slice(0, 3).map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => setSelectedRoom(room.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Hash className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {room.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {room.memberCount} members
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {room.hasUnread ? 'New messages' : 'No new messages'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No recent activity
                  </p>
                  {isRegistered && (
                    <a
                      href="/rooms/create"
                      className="inline-flex items-center mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      Create your first room
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isRegistered && (
              <a
                href="/rooms/create"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 text-center hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                <Star className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Create a Room</h3>
                <p className="text-sm opacity-90">Start your own community</p>
              </a>
            )}

            <a
              href="/rooms"
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
            >
              <Hash className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Browse Rooms</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Discover new communities</p>
            </a>

            {isRegistered && (
              <a
                href="/friends"
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Find Friends</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Connect with others</p>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}