'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerkAuth } from '@/components/auth/AuthProvider';
import {
  Hash,
  Users,
  MessageSquare,
  Plus,
  Search,
  Volume2,
  Settings,
  Crown,
  Shield,
  Lock,
  Clock
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

interface SidebarProps {
  rooms?: Room[];
  onRoomSelect?: (roomId: string) => void;
  currentRoomId?: string;
}

export function Sidebar({ rooms = [], onRoomSelect, currentRoomId }: SidebarProps) {
  const { isSignedIn, isGuest, isRegistered } = useClerkAuth();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  const getRoomIcon = (type: Room['type']) => {
    switch (type) {
      case 'global':
        return <Hash className="w-4 h-4" />;
      case 'community':
        return <Users className="w-4 h-4" />;
      case 'private':
        return <Lock className="w-4 h-4" />;
      case 'ephemeral':
        return <Clock className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
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

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roomCategories = {
    global: filteredRooms.filter(room => room.type === 'global'),
    community: filteredRooms.filter(room => room.type === 'community'),
    private: filteredRooms.filter(room => room.type === 'private'),
    ephemeral: filteredRooms.filter(room => room.type === 'ephemeral'),
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Rooms & Chats
          </h2>
          {isRegistered && (
            <Link
              href="/rooms/create"
              className="p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Global Rooms */}
        {roomCategories.global.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Global Rooms
            </h3>
            <div className="space-y-1">
              {roomCategories.global.map((room) => (
                <RoomLink
                  key={room.id}
                  room={room}
                  isActive={currentRoomId === room.id}
                  onClick={() => onRoomSelect?.(room.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Community Rooms */}
        {roomCategories.community.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Communities
            </h3>
            <div className="space-y-1">
              {roomCategories.community.map((room) => (
                <RoomLink
                  key={room.id}
                  room={room}
                  isActive={currentRoomId === room.id}
                  onClick={() => onRoomSelect?.(room.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Private Rooms */}
        {roomCategories.private.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Private
            </h3>
            <div className="space-y-1">
              {roomCategories.private.map((room) => (
                <RoomLink
                  key={room.id}
                  room={room}
                  isActive={currentRoomId === room.id}
                  onClick={() => onRoomSelect?.(room.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Ephemeral Rooms */}
        {roomCategories.ephemeral.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Temporary
            </h3>
            <div className="space-y-1">
              {roomCategories.ephemeral.map((room) => (
                <RoomLink
                  key={room.id}
                  room={room}
                  isActive={currentRoomId === room.id}
                  onClick={() => onRoomSelect?.(room.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredRooms.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {searchQuery ? 'No rooms found' : 'No rooms yet'}
            </p>
            {!searchQuery && isRegistered && (
              <Link
                href="/rooms/create"
                className="inline-flex items-center mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create your first room
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-2">
          {isGuest && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Upgrade to a full account to create rooms and access all features!
              </p>
              <Link
                href="/sign-up"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1 block"
              >
                Sign up free
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
            <Link
              href="/settings"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RoomLinkProps {
  room: Room;
  isActive: boolean;
  onClick: () => void;
}

function RoomLink({ room, isActive, onClick }: RoomLinkProps) {
  const getRoomTypeColor = (type: Room['type']) => {
    switch (type) {
      case 'global':
        return 'text-green-500';
      case 'community':
        return 'text-blue-500';
      case 'private':
        return 'text-purple-500';
      case 'ephemeral':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
        isActive
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
      }`}
    >
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div className={`flex-shrink-0 ${getRoomTypeColor(room.type)}`}>
          {getRoomIcon(room.type)}
        </div>
        <div className="flex items-center space-x-1 min-w-0 flex-1">
          <span className="text-sm font-medium truncate">{room.name}</span>
          {getRoleIcon(room.role)}
        </div>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        {room.hasUnread && (
          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
        )}
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {room.memberCount}
        </span>
      </div>
    </button>
  );
}