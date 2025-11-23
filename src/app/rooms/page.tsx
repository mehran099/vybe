'use client';

import { useState, useEffect } from 'react';
import { useClerkAuth } from '@/components/auth/AuthProvider';
import { Navigation } from '@/components/layout/Navigation';
import {
  Users,
  Hash,
  Lock,
  Crown,
  Shield,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Star,
  Eye,
  MessageSquare,
  Video,
  Mic
} from 'lucide-react';

interface Room {
  id: string;
  name: string;
  description: string;
  type: 'global' | 'community' | 'private' | 'ephemeral';
  memberCount: number;
  maxMembers: number;
  tags: string[];
  isJoined: boolean;
  isPrivate: boolean;
  creatorName?: string;
  lastActivity: Date;
  features: {
    textChat: boolean;
    voiceCalls: boolean;
    videoCalls: boolean;
    whiteboard: boolean;
    fileSharing: boolean;
  };
}

const mockRooms: Room[] = [
  {
    id: '1',
    name: 'General Chat',
    description: 'The main lobby for general discussions and hangouts',
    type: 'global',
    memberCount: 234,
    maxMembers: 500,
    tags: ['general', 'social', 'chat'],
    isJoined: true,
    isPrivate: false,
    lastActivity: new Date(),
    features: {
      textChat: true,
      voiceCalls: true,
      videoCalls: false,
      whiteboard: false,
      fileSharing: true,
    },
  },
  {
    id: '2',
    name: 'Gaming Central',
    description: 'Discuss games, find teammates, and share gaming moments',
    type: 'community',
    memberCount: 567,
    maxMembers: 1000,
    tags: ['gaming', 'community', 'teamwork'],
    isJoined: false,
    isPrivate: false,
    creatorName: 'GameMaster',
    lastActivity: new Date(Date.now() - 1000 * 60 * 5),
    features: {
      textChat: true,
      voiceCalls: true,
      videoCalls: true,
      whiteboard: false,
      fileSharing: true,
    },
  },
  {
    id: '3',
    name: 'Study Group',
    description: 'Collaborative learning and homework help',
    type: 'community',
    memberCount: 89,
    maxMembers: 200,
    tags: ['education', 'study', 'help'],
    isJoined: false,
    isPrivate: false,
    creatorName: 'StudyBuddy',
    lastActivity: new Date(Date.now() - 1000 * 60 * 15),
    features: {
      textChat: true,
      voiceCalls: true,
      videoCalls: false,
      whiteboard: true,
      fileSharing: true,
    },
  },
  {
    id: '4',
    name: 'Art & Creativity',
    description: 'Share your artwork and get creative feedback',
    type: 'community',
    memberCount: 156,
    maxMembers: 300,
    tags: ['art', 'creativity', 'design'],
    isJoined: false,
    isPrivate: false,
    creatorName: 'ArtistPro',
    lastActivity: new Date(Date.now() - 1000 * 60 * 30),
    features: {
      textChat: true,
      voiceCalls: false,
      videoCalls: false,
      whiteboard: true,
      fileSharing: true,
    },
  },
];

const categories = [
  { name: 'All Rooms', icon: Hash, color: 'bg-gray-500' },
  { name: 'Gaming', icon: MessageSquare, color: 'bg-purple-500' },
  { name: 'Study', icon: Star, color: 'bg-blue-500' },
  { name: 'Social', icon: Users, color: 'bg-green-500' },
  { name: 'Creative', icon: Crown, color: 'bg-pink-500' },
];

export default function RoomsPage() {
  const { isSignedIn, isGuest, isRegistered, user } = useClerkAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Rooms');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'activity' | 'members' | 'newest'>('activity');

  useEffect(() => {
    // Simulate loading rooms
    setTimeout(() => {
      setRooms(mockRooms);
      setFilteredRooms(mockRooms);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...rooms];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(room => room.type === selectedType);
    }

    // Filter by category
    if (selectedCategory !== 'All Rooms') {
      filtered = filtered.filter(room =>
        room.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'activity':
          return b.lastActivity.getTime() - a.lastActivity.getTime();
        case 'members':
          return b.memberCount - a.memberCount;
        case 'newest':
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });

    setFilteredRooms(filtered);
  }, [rooms, searchQuery, selectedCategory, selectedType, sortBy]);

  const getRoomTypeIcon = (type: Room['type']) => {
    switch (type) {
      case 'global':
        return <Hash className="w-5 h-5" />;
      case 'community':
        return <Users className="w-5 h-5" />;
      case 'private':
        return <Lock className="w-5 h-5" />;
      case 'ephemeral':
        return <Clock className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getRoomTypeColor = (type: Room['type']) => {
    switch (type) {
      case 'global':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'community':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'private':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'ephemeral':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to browse rooms
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Discover Rooms
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Find communities and start conversations
              </p>
            </div>
            {isRegistered && (
              <a
                href="/rooms/create"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700"
              >
                Create Room
              </a>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="global">Global</option>
              <option value="community">Community</option>
              <option value="private">Private</option>
              <option value="ephemeral">Ephemeral</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="activity">Last Activity</option>
              <option value="members">Most Members</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              {/* Room Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getRoomTypeColor(room.type)}`}>
                    {getRoomTypeIcon(room.type)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {room.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                    </p>
                  </div>
                </div>
                {room.isJoined && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium rounded-full">
                    Joined
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {room.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {room.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {room.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                    +{room.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Features */}
              <div className="flex items-center space-x-3 mb-4">
                {room.features.textChat && <MessageSquare className="w-4 h-4 text-gray-400" />}
                {room.features.voiceCalls && <Mic className="w-4 h-4 text-gray-400" />}
                {room.features.videoCalls && <Video className="w-4 h-4 text-gray-400" />}
                {room.features.whiteboard && <Eye className="w-4 h-4 text-gray-400" />}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {room.memberCount}/{room.maxMembers}
                  </span>
                </div>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    room.isJoined
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  {room.isJoined ? 'Enter' : 'Join'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No rooms found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || selectedType !== 'all' || selectedCategory !== 'All Rooms'
                ? 'Try adjusting your filters or search terms'
                : 'No rooms match your criteria'
              }
            </p>
            {isRegistered && (
              <a
                href="/rooms/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700"
              >
                Create the first room
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}