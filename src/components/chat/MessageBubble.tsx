'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Flag,
  Heart,
  ThumbsUp,
  Laugh,
  Surprise,
  HeartBroken,
  FileText,
  Image as ImageIcon,
  Download
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
  isFromCurrentUser?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onReport?: (messageId: string) => void;
}

const reactions = [
  { emoji: '❤️', icon: Heart, label: 'Love' },
  { emoji: '👍', icon: ThumbsUp, label: 'Like' },
  { emoji: '😄', icon: Laugh, label: 'Laugh' },
  { emoji: '😮', icon: Surprise, label: 'Wow' },
  { emoji: '💔', icon: HeartBroken, label: 'Sad' },
];

export function MessageBubble({
  message,
  onEdit,
  onDelete,
  onReact,
  onReport
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return FileText;

    if (mimeType.startsWith('image/')) return ImageIcon;
    if (mimeType.includes('pdf')) return FileText;
    if (mimeType.includes('word') || mimeType.includes('document')) return FileText;
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return FileText;

    return FileText;
  };

  const handleReaction = (emoji: string) => {
    onReact?.(message.id, emoji);
    setShowReactions(false);
  };

  return (
    <div
      className={`group flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
        message.isFromCurrentUser ? 'flex-row-reverse' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactions(false);
      }}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 ${message.isFromCurrentUser ? 'ml-3' : 'mr-3'}`}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {message.senderAvatar ? (
              <img
                src={message.senderAvatar}
                alt={message.senderName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              message.senderName[0]?.toUpperCase() || '?'
            )}
          </span>
        </div>
      </div>

      {/* Message Content */}
      <div className={`flex-1 min-w-0 ${message.isFromCurrentUser ? 'text-right' : ''}`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          {!message.isFromCurrentUser && (
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {message.senderName}
            </span>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
          {message.editedAt && (
            <span className="text-xs text-gray-500 dark:text-gray-400 italic">
              (edited)
            </span>
          )}
        </div>

        {/* Message Body */}
        <div className={`inline-block ${message.isFromCurrentUser ? 'text-right' : ''}`}>
          <div
            className={`max-w-lg rounded-2xl px-4 py-2 ${
              message.isFromCurrentUser
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
            }`}
          >
            {message.type === 'text' && (
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}

            {message.type === 'image' && message.metadata?.fileUrl && (
              <div className="space-y-2">
                <img
                  src={message.metadata.fileUrl}
                  alt="Shared image"
                  className="rounded-lg max-w-full h-auto max-h-64 object-cover cursor-pointer"
                  onClick={() => window.open(message.metadata?.fileUrl, '_blank')}
                />
                {message.content && (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            )}

            {message.type === 'file' && (
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                {(() => {
                  const Icon = getFileIcon(message.metadata?.mimeType);
                  return <Icon className="w-5 h-5 text-white/80" />;
                })()}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {message.metadata?.fileName || 'Unknown file'}
                  </p>
                  {message.metadata?.fileSize && (
                    <p className="text-xs text-white/70">
                      {formatFileSize(message.metadata.fileSize)}
                    </p>
                  )}
                </div>
                {message.metadata?.fileUrl && (
                  <button
                    onClick={() => window.open(message.metadata?.fileUrl, '_blank')}
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            )}

            {message.type === 'system' && (
              <p className="text-sm italic text-gray-600 dark:text-gray-300">
                {message.content}
              </p>
            )}
          </div>

          {/* Reactions */}
          {message.reactions && Object.keys(message.reactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(message.reactions).map(([emoji, userIds]) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                    message.isFromCurrentUser
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{userIds.length}</span>
                </button>
              ))}
            </div>
          )}

          {/* Reaction Picker */}
          {showReactions && message.isFromCurrentUser && (
            <div className={`flex gap-1 mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${
              message.isFromCurrentUser ? 'ml-auto' : ''
            }`}>
              {reactions.map(({ emoji, icon: Icon, label }) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title={label}
                >
                  <span className="text-lg">{emoji}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className={`flex items-center gap-1 ${message.isFromCurrentUser ? 'order-first' : ''}`}>
          {/* Reaction button */}
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <Heart className="w-4 h-4" />
          </button>

          {/* Message actions dropdown */}
          <div className="relative">
            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* Dropdown menu would go here */}
            {/* For now, showing inline actions for simplicity */}
            <div className="absolute right-0 top-0 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
              {message.isFromCurrentUser && (
                <>
                  <button
                    onClick={() => onEdit?.(message.id)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(message.id)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={() => onReport?.(message.id)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Flag className="w-4 h-4" />
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}