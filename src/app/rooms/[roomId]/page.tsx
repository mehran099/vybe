'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useClerkAuth } from '@/components/auth/AuthProvider';
import { Navigation } from '@/components/layout/Navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import {
  Users,
  Phone,
  Video,
  Settings,
  Info,
  Search,
  Pin,
  Crown,
  Shield,
  UserPlus,
  Volume2,
  Headphones
} from 'lucide-react';

interface Member {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  role?: 'owner' | 'moderator' | 'member';
  isTyping?: boolean;
  lastSeen?: Date;
  isMuted?: boolean;
  isDeafened?: boolean;
}

const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Alice',
    avatar: '',
    status: 'online',
    role: 'owner',
  },
  {
    id: '2',
    name: 'Bob',
    avatar: '',
    status: 'online',
  },
  {
    id: '3',
    name: 'Charlie',
    avatar: '',
    status: 'away',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '4',
    name: 'Diana',
    avatar: '',
    status: 'busy',
    isTyping: true,
  },
  {
    id: '5',
    name: 'Eve',
    avatar: '',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const { isSignedIn, user, isGuest } = useClerkAuth();
  const [showMemberList, setShowMemberList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock room data
  const roomData = {
    id: roomId,
    name: 'General Chat',
    type: 'global' as const,
    memberCount: mockMembers.length,
    isOnline: true,
    features: {
      voiceCalls: !isGuest,
      videoCalls: !isGuest,
      whiteboard: !isGuest,
      fileSharing: true,
    },
  };

  const getStatusColor = (status: Member['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: Member['status'], lastSeen?: Date) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'busy': return 'Do Not Disturb';
      case 'offline':
        return lastSeen ? `Last seen ${lastSeen.toLocaleTimeString()}` : 'Offline';
      default: return 'Unknown';
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-3 h-3 text-yellow-500" />;
      case 'moderator':
        return <Shield className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineMembers = filteredMembers.filter(member => member.status !== 'offline');
  const offlineMembers = filteredMembers.filter(member => member.status === 'offline');

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to join this room
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

      <div className="flex h-screen pt-14">
        {/* Sidebar */}
        <div className={`${showMemberList ? 'w-64' : 'w-0'} transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col`}>
          {/* Room Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Room Members
              </h3>
              <button
                onClick={() => setShowMemberList(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                ×
              </button>
            </div>

            {/* Room Actions */}
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium">
                <UserPlus className="w-4 h-4" />
                Invite People
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                <Settings className="w-4 h-4" />
                Room Settings
              </button>
            </div>
          </div>

          {/* Member Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Member List */}
          <div className="flex-1 overflow-y-auto">
            {/* Online Members */}
            {onlineMembers.length > 0 && (
              <div className="p-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Online — {onlineMembers.length}
                </h4>
                <div className="space-y-2">
                  {onlineMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              member.name[0]?.toUpperCase() || '?'
                            )}
                          </span>
                        </div>
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(member.status)}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {member.name}
                          </span>
                          {getRoleIcon(member.role)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>{getStatusText(member.status)}</span>
                          {member.isTyping && (
                            <span className="text-purple-600 dark:text-purple-400">• typing...</span>
                          )}
                        </div>
                      </div>
                      {/* Voice controls for online members */}
                      {roomData.features.voiceCalls && (
                        <div className="flex items-center gap-1">
                          {member.isMuted && (
                            <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                              <Volume2 className="w-3 h-3 text-gray-400" />
                            </button>
                          )}
                          {member.isDeafened && (
                            <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                              <Headphones className="w-3 h-3 text-gray-400" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offline Members */}
            {offlineMembers.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Offline — {offlineMembers.length}
                </h4>
                <div className="space-y-2">
                  {offlineMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer opacity-60"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-full h-full rounded-full object-cover grayscale"
                              />
                            ) : (
                              member.name[0]?.toUpperCase() || '?'
                            )}
                          </span>
                        </div>
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(member.status)}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-500 dark:text-gray-400 text-sm truncate">
                            {member.name}
                          </span>
                          {getRoleIcon(member.role)}
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {getStatusText(member.status, member.lastSeen)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex">
          <ChatInterface
            roomId={roomData.id}
            roomName={roomData.name}
            roomType={roomData.type}
            memberCount={roomData.memberCount}
            isOnline={roomData.isOnline}
            features={roomData.features}
          />
        </div>
      </div>

      {/* Floating Member Toggle (when sidebar is hidden) */}
      {!showMemberList && (
        <button
          onClick={() => setShowMemberList(true)}
          className="fixed right-4 top-20 z-50 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          title="Show member list"
        >
          <Users className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}