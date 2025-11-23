'use client';

import { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Phone,
  PhoneOff,
  Settings,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  MessageSquare,
  Users,
  Share,
  Record,
  Stop
} from 'lucide-react';

interface CallControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  isMinimized: boolean;
  participantCount: number;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleRecording: () => void;
  onEndCall: () => void;
  onToggleMinimize: () => void;
  onOpenChat: () => void;
  onOpenParticipants: () => void;
  onOpenSettings: () => void;
}

export function CallControls({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  isRecording,
  isMinimized,
  participantCount,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleRecording,
  onEndCall,
  onToggleMinimize,
  onOpenChat,
  onOpenParticipants,
  onOpenSettings,
}: CallControlsProps) {
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 ${
      isMinimized ? 'scale-90' : ''
    }`}>
      {/* Minimized Call Window */}
      {isMinimized ? (
        <div className="bg-gray-900 text-white rounded-xl p-4 shadow-2xl border border-gray-700">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Call in progress</span>
              <span className="text-xs text-gray-400">({participantCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleAudio}
                className={`p-2 rounded-lg transition-colors ${
                  isAudioEnabled
                    ? 'hover:bg-gray-800 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              <button
                onClick={onToggleVideo}
                className={`p-2 rounded-lg transition-colors ${
                  isVideoEnabled
                    ? 'hover:bg-gray-800 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
              <button
                onClick={onToggleMinimize}
                className="p-2 rounded-lg hover:bg-gray-800 text-white"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={onEndCall}
                className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Full Call Controls */
        <div className="bg-gray-900/95 backdrop-blur-sm text-white rounded-2xl p-4 shadow-2xl border border-gray-700">
          <div className="flex items-center justify-between gap-6">
            {/* Left Controls - Primary Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleAudio}
                className={`p-3 rounded-xl transition-all transform hover:scale-105 ${
                  isAudioEnabled
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
                title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
              >
                {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={onToggleVideo}
                className={`p-3 rounded-xl transition-all transform hover:scale-105 ${
                  isVideoEnabled
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
                title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={onToggleScreenShare}
                className={`p-3 rounded-xl transition-all transform hover:scale-105 ${
                  isScreenSharing
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
                title={isScreenSharing ? 'Stop screen sharing' : 'Share screen'}
              >
                {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
              </button>
            </div>

            {/* Center Control - End Call */}
            <button
              onClick={onEndCall}
              className="p-4 bg-red-600 hover:bg-red-700 rounded-xl transition-all transform hover:scale-105 text-white shadow-lg"
              title="End call"
            >
              <Phone className="w-6 h-6 transform rotate-135" />
            </button>

            {/* Right Controls - Secondary Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleRecording}
                className={`p-3 rounded-xl transition-all transform hover:scale-105 relative ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
                title={isRecording ? 'Stop recording' : 'Start recording'}
              >
                {isRecording ? (
                  <>
                    <Stop className="w-5 h-5" />
                    <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </>
                ) : (
                  <Record className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={onOpenChat}
                className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-all transform hover:scale-105"
                title="Open chat"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenParticipants}
                className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-all transform hover:scale-105 relative"
                title="Participants"
              >
                <Users className="w-5 h-5" />
                {participantCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {participantCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                  className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-all transform hover:scale-105"
                  title="More options"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {/* More Options Dropdown */}
                {showMoreOptions && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                    <button
                      onClick={() => {
                        onOpenSettings();
                        setShowMoreOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 text-white flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Call Settings
                    </button>
                    <button
                      onClick={() => {
                        onToggleMinimize();
                        setShowMoreOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 text-white flex items-center gap-2"
                    >
                      <Minimize2 className="w-4 h-4" />
                      Minimize Call
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 text-white flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Audio Settings
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 text-white flex items-center gap-2">
                      <Share className="w-4 h-4" />
                      Share Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Call Status Bar */}
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Call connected</span>
            </div>
            {isScreenSharing && (
              <span className="text-blue-400">• Screen sharing</span>
            )}
            {isRecording && (
              <span className="text-red-400">• Recording</span>
            )}
            <span>• {participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface MiniCallControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onExpand: () => void;
  onEndCall: () => void;
}

export function MiniCallControls({
  isAudioEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
  onExpand,
  onEndCall,
}: MiniCallControlsProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-gray-900 text-white rounded-xl p-3 shadow-2xl border border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Call</span>
          <button
            onClick={onToggleAudio}
            className={`p-1.5 rounded-lg transition-colors ${
              isAudioEnabled ? 'hover:bg-gray-800' : 'bg-red-600'
            }`}
          >
            {isAudioEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
          </button>
          <button
            onClick={onToggleVideo}
            className={`p-1.5 rounded-lg transition-colors ${
              isVideoEnabled ? 'hover:bg-gray-800' : 'bg-red-600'
            }`}
          >
            {isVideoEnabled ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
          </button>
          <button
            onClick={onExpand}
            className="p-1.5 rounded-lg hover:bg-gray-800"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <button
            onClick={onEndCall}
            className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700"
          >
            <PhoneOff className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}