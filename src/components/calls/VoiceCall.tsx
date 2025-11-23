'use client';

import { useState, useEffect, useRef } from 'react';
import { useClerkAuth } from '@/components/auth/AuthProvider';
import { CallControls, MiniCallControls } from './CallControls';
import { callManager } from '@/lib/livekit';
import {
  Phone,
  Users,
  Volume2,
  Mic,
  MicOff,
  Headphones,
  Signal,
  Wifi,
  WifiOff,
  Loader2
} from 'lucide-react';

interface VoiceCallProps {
  roomId: string;
  roomName: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  onEndCall: () => void;
  isIncomingCall?: boolean;
  onAnswerCall?: () => void;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isSpeaking: boolean;
  isMuted: boolean;
  volume: number;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'none';
}

export function VoiceCall({
  roomId,
  roomName,
  recipientId,
  recipientName,
  recipientAvatar,
  onEndCall,
  isIncomingCall = false,
  onAnswerCall,
}: VoiceCallProps) {
  const { user } = useClerkAuth();
  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ended' | 'incoming'>(
    isIncomingCall ? 'incoming' : 'connecting'
  );
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'none'>('excellent');
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: recipientId,
      name: recipientName,
      avatar: recipientAvatar,
      isSpeaking: false,
      isMuted: false,
      volume: 50,
      connectionQuality: 'excellent',
    },
  ]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isIncomingCall && callState === 'connecting') {
      initializeCall();
    }

    return () => {
      cleanupCall();
    };
  }, []);

  useEffect(() => {
    if (callState === 'connected') {
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callState]);

  const initializeCall = async () => {
    try {
      // Initialize audio context for volume monitoring
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      // Generate call token (in real app, this would be from your server)
      const token = await generateCallToken(roomId, user?.username || 'Guest');

      // Connect to LiveKit room
      await callManager.connect(roomId, token);

      // Enable audio by default
      await callManager.enableAudio();

      setCallState('connected');
      startAudioMonitoring();
    } catch (error) {
      console.error('Failed to initialize call:', error);
      setCallState('ended');
    }
  };

  const generateCallToken = async (roomId: string, participantName: string): Promise<string> => {
    // In a real implementation, this would call your API
    // For now, return a mock token
    return 'mock_call_token_' + Date.now();
  };

  const startAudioMonitoring = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const updateAudioLevel = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalizedLevel = Math.min(100, (average / 128) * 100);

      setAudioLevel(normalizedLevel);

      // Update speaking status
      setParticipants(prev => prev.map(p => ({
        ...p,
        isSpeaking: normalizedLevel > 10 && p.id === user?.id,
      })));

      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();
  };

  const cleanupCall = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    callManager.disconnect();
  };

  const handleAnswerCall = () => {
    onAnswerCall?.();
    setCallState('connecting');
    initializeCall();
  };

  const handleEndCall = async () => {
    setCallState('ended');
    await callManager.disconnect();
    onEndCall();
  };

  const handleToggleAudio = async () => {
    try {
      if (isAudioEnabled) {
        await callManager.disableAudio();
      } else {
        await callManager.enableAudio();
      }
      setIsAudioEnabled(!isAudioEnabled);
    } catch (error) {
      console.error('Failed to toggle audio:', error);
    }
  };

  const formatCallDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionQualityIcon = () => {
    switch (connectionQuality) {
      case 'excellent':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'good':
        return <Wifi className="w-4 h-4 text-yellow-500" />;
      case 'poor':
        return <WifiOff className="w-4 h-4 text-orange-500" />;
      case 'none':
        return <WifiOff className="w-4 h-4 text-red-500" />;
    }
  };

  if (isMinimized) {
    return (
      <MiniCallControls
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={false}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={() => {}}
        onExpand={() => setIsMinimized(false)}
        onEndCall={handleEndCall}
      />
    );
  }

  if (callState === 'incoming') {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            {recipientAvatar ? (
              <img
                src={recipientAvatar}
                alt={recipientName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-2xl font-bold">
                {recipientName[0]?.toUpperCase() || '?'}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Incoming Call
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {recipientName} is calling you...
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleEndCall}
              className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all transform hover:scale-105"
            >
              <Phone className="w-6 h-6 transform rotate-135" />
            </button>
            <button
              onClick={handleAnswerCall}
              className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-full transition-all transform hover:scale-105 animate-pulse"
            >
              <Phone className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (callState === 'ended') {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="w-10 h-10 text-gray-500 transform rotate-135" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Call Ended
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Call duration: {formatCallDuration(callDuration)}
          </p>

          <button
            onClick={onEndCall}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-blue-900/90 z-40">
      {/* Main Call Interface */}
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 text-white">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                {recipientAvatar ? (
                  <img
                    src={recipientAvatar}
                    alt={recipientName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold">
                    {recipientName[0]?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold">{recipientName}</h1>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  {callState === 'connecting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Connected</span>
                      </div>
                      <span>•</span>
                      <span>{formatCallDuration(callDuration)}</span>
                      <span>•</span>
                      {getConnectionQualityIcon()}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors relative"
              >
                <Users className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-white text-purple-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {participants.length + 1}
                </span>
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-white">
            {/* Audio Visualization */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                {recipientAvatar ? (
                  <img
                    src={recipientAvatar}
                    alt={recipientName}
                    className="w-full h-full rounded-full object-cover opacity-50"
                  />
                ) : (
                  <div className="text-4xl font-bold opacity-50">
                    {recipientName[0]?.toUpperCase() || '?'}
                  </div>
                )}

                {/* Audio Level Indicator */}
                {callState === 'connected' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-24 h-24 rounded-full border-4 border-white/30 transition-all duration-150"
                      style={{
                        transform: `scale(${1 + audioLevel / 200})`,
                        opacity: audioLevel / 100,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Status Text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{recipientName}</h2>
              <p className="text-white/70">
                {callState === 'connecting' ? 'Connecting...' : 'In a voice call'}
              </p>
              {callState === 'connected' && (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Signal className="w-4 h-4" />
                  <span>Good connection</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Participants Panel (optional) */}
        {showParticipants && (
          <div className="absolute right-0 top-0 h-full w-80 bg-black/50 backdrop-blur-sm p-6 border-l border-white/10">
            <h3 className="text-white font-semibold mb-4">Participants</h3>
            <div className="space-y-3">
              {/* Current user */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.firstName?.[0] || user?.username?.[0] || 'Y'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">You</p>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    {isAudioEnabled ? (
                      <Mic className="w-3 h-3" />
                    ) : (
                      <MicOff className="w-3 h-3 text-red-400" />
                    )}
                    <span>{isAudioEnabled ? 'Speaking' : 'Muted'}</span>
                  </div>
                </div>
                {audioLevel > 0 && (
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-4 bg-white rounded-full transition-all duration-150 ${
                          i < Math.floor(audioLevel / 20) ? 'opacity-100' : 'opacity-30'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Other participants */}
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/10">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {participant.name[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{participant.name}</p>
                    <div className="flex items-center gap-2 text-xs text-white/70">
                      {participant.isMuted ? (
                        <MicOff className="w-3 h-3 text-red-400" />
                      ) : (
                        <Mic className="w-3 h-3" />
                      )}
                      <span>{participant.isSpeaking ? 'Speaking' : 'Listening'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <CallControls
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={false}
        isScreenSharing={false}
        isRecording={false}
        isMinimized={isMinimized}
        participantCount={participants.length}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={() => {}}
        onToggleScreenShare={() => {}}
        onToggleRecording={() => {}}
        onEndCall={handleEndCall}
        onToggleMinimize={() => setIsMinimized(true)}
        onOpenChat={() => {}}
        onOpenParticipants={() => setShowParticipants(true)}
        onOpenSettings={() => {}}
      />
    </div>
  );
}