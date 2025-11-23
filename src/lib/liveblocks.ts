import { createClient } from '@liveblocks/client';
import { LiveList, LiveMap, LiveObject } from '@liveblocks/client';

const LIVEBLOCKS_PUBLIC_KEY = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;
const LIVEBLOCKS_SECRET_KEY = process.env.LIVEBLOCKS_SECRET_KEY;

if (!LIVEBLOCKS_PUBLIC_KEY) {
  throw new Error('NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is not defined');
}

// Create a Liveblocks client for the browser
export const liveblocksClient = createClient({
  publicApiKey: LIVEBLOCKS_PUBLIC_KEY,
  throttle: 16,
  authEndpoint: '/api/liveblocks-auth',
});

// Types for Liveblocks data structures
export interface UserPresence {
  cursor?: {
    x: number;
    y: number;
  };
  selection?: {
    start: number;
    end: number;
  };
  typing: boolean;
  status: 'online' | 'away' | 'busy';
  lastSeen: Date;
  currentRoom?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, any>;
  reactions: Record<string, string[]>; // emoji -> userIds[]
  editedAt?: Date;
  deletedAt?: Date;
}

export interface RoomMetadata {
  name: string;
  description: string;
  type: 'global' | 'community' | 'private' | 'ephemeral';
  creatorId: string;
  createdAt: Date;
  memberCount: number;
  maxMembers: number;
  theme: Record<string, any>;
  settings: Record<string, any>;
  isActive: boolean;
  lastActivity: Date;
}

export interface WhiteboardData {
  shapes: LiveList<any>;
  bindings: LiveMap<string, any>;
  assets: LiveMap<string, any>;
}

// Utility functions for creating Liveblocks storage
export function createInitialRoomStorage(
  initialMetadata: Partial<RoomMetadata>
): LiveObject<RoomMetadata> {
  return new LiveObject({
    name: initialMetadata.name || 'New Room',
    description: initialMetadata.description || '',
    type: initialMetadata.type || 'private',
    creatorId: initialMetadata.creatorId || '',
    createdAt: new Date(),
    memberCount: 1,
    maxMembers: initialMetadata.maxMembers || 100,
    theme: initialMetadata.theme || {},
    settings: initialMetadata.settings || {},
    isActive: true,
    lastActivity: new Date(),
    ...initialMetadata,
  });
}

export function createInitialMessagesStorage(): LiveList<Message> {
  return new LiveList([]);
}

export function createInitialWhiteboardStorage(): WhiteboardData {
  return {
    shapes: new LiveList([]),
    bindings: new LiveMap(),
    assets: new LiveMap(),
  };
}

// Presence management
export function createUserPresence(
  overrides: Partial<UserPresence> = {}
): UserPresence {
  return {
    typing: false,
    status: 'online',
    lastSeen: new Date(),
    ...overrides,
  };
}

// Room management utilities
export async function createLiveblocksRoom(
  roomId: string,
  metadata: Partial<RoomMetadata>
) {
  try {
    const response = await fetch('/api/rooms/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomId,
        metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create room: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Liveblocks room:', error);
    throw error;
  }
}

export async function getRoomAccess(roomId: string) {
  try {
    const response = await fetch(`/api/rooms/${roomId}/access`);
    if (!response.ok) {
      throw new Error(`Failed to get room access: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting room access:', error);
    throw error;
  }
}

// Message formatting utilities
export function formatMessage(message: Message): string {
  return JSON.stringify({
    ...message,
    timestamp: message.timestamp.toISOString(),
    editedAt: message.editedAt?.toISOString(),
    deletedAt: message.deletedAt?.toISOString(),
  });
}

export function parseMessage(data: string): Message {
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    timestamp: new Date(parsed.timestamp),
    editedAt: parsed.editedAt ? new Date(parsed.editedAt) : undefined,
    deletedAt: parsed.deletedAt ? new Date(parsed.deletedAt) : undefined,
  };
}

export default liveblocksClient;