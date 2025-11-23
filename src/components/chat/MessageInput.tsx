'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Paperclip,
  Smile,
  Image,
  File,
  X,
  Loader2
} from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string, type: 'text' | 'image' | 'file', file?: File) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  allowFileUpload?: boolean;
  allowVoiceRecording?: boolean;
  allowImageUpload?: boolean;
}

interface FileUpload {
  file: File;
  preview?: string;
}

export function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  placeholder = "Type a message...",
  disabled = false,
  maxLength = 2000,
  allowFileUpload = true,
  allowVoiceRecording = true,
  allowImageUpload = true,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [fileUploads, setFileUploads] = useState<FileUpload[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const handleTyping = () => {
    onTypingStart?.();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop?.();
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
      handleTyping();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((message.trim() || fileUploads.length > 0) && !disabled && !isUploading) {
      // Send text message first
      if (message.trim()) {
        onSendMessage(message.trim(), 'text');
        setMessage('');
      }

      // Send files
      fileUploads.forEach((upload) => {
        onSendMessage(upload.file.name, upload.file.type.startsWith('image/') ? 'image' : 'file', upload.file);
      });

      setFileUploads([]);
      setShowEmojiPicker(false);
      onTypingStop?.();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isImage = false) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      // Check file size (20MB limit)
      if (file.size > 20 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 20MB.`);
        return false;
      }
      return true;
    });

    const newUploads: FileUpload[] = validFiles.map(file => {
      const upload: FileUpload = { file };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        upload.preview = URL.createObjectURL(file);
      }

      return upload;
    });

    setFileUploads(prev => [...prev, ...newUploads].slice(0, 5)); // Max 5 files

    // Clear the input
    if (isImage) {
      imageInputRef.current!.value = '';
    } else {
      fileInputRef.current!.value = '';
    }
  };

  const removeFileUpload = (index: number) => {
    setFileUploads(prev => {
      const newUploads = [...prev];
      if (newUploads[index].preview) {
        URL.revokeObjectURL(newUploads[index].preview!);
      }
      newUploads.splice(index, 1);
      return newUploads;
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const startRecording = () => {
    if (!allowVoiceRecording) return;

    setIsRecording(true);
    setRecordingTime(0);

    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // In a real implementation, you would start actual voice recording here
    // using MediaRecorder API or similar
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }

    // In a real implementation, you would stop recording and send the voice note
    // For now, we'll just send a placeholder message
    onSendMessage('Voice note recording placeholder', 'text');
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const commonEmojis = ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🥵', '🥶', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'];

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      {/* File Uploads */}
      {fileUploads.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {fileUploads.map((upload, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-xs"
            >
              {upload.preview ? (
                <img
                  src={upload.preview}
                  alt="Preview"
                  className="w-8 h-8 object-cover rounded"
                />
              ) : (
                <File className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                {upload.file.name}
              </span>
              <button
                onClick={() => removeFileUpload(index)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="mb-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiSelect(emoji)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1 flex items-center gap-2">
          {/* Left side buttons */}
          <div className="flex gap-1">
            {allowFileUpload && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                {allowImageUpload && (
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    disabled={disabled}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Upload image"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFileSelect(e, false)}
                  className="hidden"
                  accept="*/*"
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFileSelect(e, true)}
                  className="hidden"
                  accept="image/*"
                />
              </>
            )}

            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={disabled}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          {/* Message input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? '' : placeholder}
              disabled={disabled || isRecording}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />

            {/* Character count */}
            {message.length > maxLength * 0.8 && (
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400">
                {message.length}/{maxLength}
              </div>
            )}
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex gap-1">
          {allowVoiceRecording && (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={disabled}
              className={`p-2 rounded-lg transition-colors ${
                isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isRecording ? 'Stop recording' : 'Start voice recording'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={handleSend}
            disabled={disabled || (!message.trim() && fileUploads.length === 0) || isUploading}
            className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Send message"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Recording: {formatRecordingTime(recordingTime)}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            (Max 60 seconds)
          </span>
        </div>
      )}

      {/* Upload progress or status */}
      {isUploading && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Uploading files...
        </div>
      )}
    </div>
  );
}