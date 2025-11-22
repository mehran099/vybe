'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useClerkAuth } from '@/components/auth/AuthProvider';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import {
  MessageSquare,
  Users,
  Phone,
  Video,
  Settings,
  Pin,
  Search,
  MoreVertical,
  ArrowDown,
  Info
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    fileUrl?: string;
  };
  reactions?: Record<string, string[]>;
  editedAt?: Date;
  deletedAt?: Date;
}

interface ChatInterfaceProps {
  roomId: string;
  roomName: string;
  roomType: 'global' | 'community' | 'private' | 'ephemeral';
  memberCount?: number;
  isOnline?: boolean;
  features?: {
    voiceCalls?: boolean;
    videoCalls?: boolean;
    whiteboard?: boolean;
    fileSharing?: boolean;
  };
}

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'user1',
    senderName: 'Alice',
    content: 'Hey everyone! How\'s it going?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: 'text',
  },
  {
    id: '2',
    senderId: 'user2',
    senderName: 'Bob',
    content: 'Great! Just finished a project. Anyone up for a game later?',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    type: 'text',
  },
  {
    id: '3',
    senderId: 'user3',
    senderName: 'Charlie',
    content: 'Sure! What game are you thinking?',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    type: 'text',
  },
  {
    id: '4',
    senderId: 'system',
    senderName: 'System',
    content: 'Bob is typing...',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: 'system',
  },
];

export function ChatInterface({
  roomId,
  roomName,
  roomType,
  memberCount = 0,
  isOnline = false,
  features = {},
}: ChatInterfaceProps) {
  const { user, isGuest } = useClerkAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessages(mockMessages);
      setIsLoading(false);
      scrollToBottom();
    };

    loadMessages();
  }, [roomId]);

  // Scroll management
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

    setShowScrollButton(!isAtBottom);
    if (isAtBottom) {
      setHasNewMessages(false);
    }
  }, []);

  // Typing indicators
  const handleTypingStart = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      // In a real implementation, send typing event to server
    }
  }, [isTyping]);

  const handleTypingStop = useCallback(() => {
    if (isTyping) {
      setIsTyping(false);
      // In a real implementation, send stop typing event to server
    }
  }, [isTyping]);

  // Message handlers
  const handleSendMessage = useCallback((content: string, type: 'text' | 'image' | 'file', file?: File) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: user?.id || 'current',
      senderName: user?.firstName || user?.username || 'Guest User',
      senderAvatar: user?.imageUrl,
      content,
      timestamp: new Date(),
      type,
      isFromCurrentUser: true,
    };

    if (file && type !== 'text') {
      newMessage.metadata = {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        fileUrl: URL.createObjectURL(file), // In real app, upload to server
      };
    }

    setMessages(prev => [...prev, newMessage]);
    scrollToBottom();

    // In a real implementation, send message to server
    // For now, just simulate a response
    if (type === 'text') {
      setTimeout(() => {
        const responseMessage: Message = {
          id: `response_${Date.now()}`,
          senderId: 'bot',
          senderName: 'Assistant',
          content: `You said: "${content}". This is a demo response!`,
          timestamp: new Date(),
          type: 'text',
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 1000);
    }
  }, [user, scrollToBottom]);

  const handleEditMessage = useCallback((messageId: string) => {
    // Implement message editing
    console.log('Edit message:', messageId);
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, deletedAt: new Date(), content: 'This message was deleted' }
        : msg
    ));
  }, []);

  const handleReactMessage = useCallback((messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;

      const reactions = { ...msg.reactions } || {};
      const currentReactions = reactions[emoji] || [];

      if (currentReactions.includes(user?.id || '')) {
        // Remove reaction
        reactions[emoji] = currentReactions.filter(id => id !== user?.id);
        if (reactions[emoji].length === 0) {
          delete reactions[emoji];
        }
      } else {
        // Add reaction
        reactions[emoji] = [...currentReactions, user?.id || ''];
      }

      return { ...msg, reactions };
    }));
  }, [user?.id]);

  const handleReportMessage = useCallback((messageId: string) => {
    // Implement message reporting
    console.log('Report message:', messageId);
    // Show confirmation or open report modal
  }, []);

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'global': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'community': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'private': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'ephemeral': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {roomName}
              </h2>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoomTypeColor(roomType)}`}>
                {roomType}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{memberCount} members</span>
              {isOnline && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Active</span>
                  </div>
                </>
              )}
              {typingUsers.length > 0 && (
                <>
                  <span>•</span>
                  <span className="text-purple-600 dark:text-purple-400">
                    {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {features.voiceCalls && (
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
              <Phone className="w-5 h-5" />
            </button>
          )}
          {features.videoCalls && (
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
              <Video className="w-5 h-5" />
            </button>
          )}
          {features.whiteboard && (
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
              <Users className="w-5 h-5" />
            </button>
          )}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
            <Info className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-gray-50 dark:bg-gray-900"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No messages yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Start the conversation with a friendly greeting!
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              This is the beginning of your chat history in {roomName}
            </p>
          </div>
        ) : (
          <>
            {/* Date separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-gray-200 dark:bg-gray-700 h-px flex-1"></div>
              <span className="px-3 text-sm text-gray-500 dark:text-gray-400">Today</span>
              <div className="bg-gray-200 dark:bg-gray-700 h-px flex-1"></div>
            </div>

            {/* Messages */}
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={{
                  ...message,
                  isFromCurrentUser: message.senderId === user?.id,
                }}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                onReact={handleReactMessage}
                onReport={handleReportMessage}
              />
            ))}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-6 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          title="Scroll to bottom"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      )}

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
        placeholder={`Message ${roomName}...`}
        disabled={isGuest}
        allowFileUpload={features.fileSharing}
        allowVoiceRecording={!isGuest}
        allowImageUpload={features.fileSharing}
      />
    </div>
  );
}