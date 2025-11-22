'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClerkAuth } from '@/components/auth/AuthProvider';
import { Navigation } from '@/components/layout/Navigation';
import {
  Hash,
  Users,
  Lock,
  Clock,
  Settings,
  Shield,
  Eye,
  MessageSquare,
  Mic,
  Video,
  Upload,
  Palette,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

interface RoomSettings {
  name: string;
  description: string;
  type: 'community' | 'private' | 'ephemeral';
  maxMembers: number;
  isPublic: boolean;
  allowGuests: boolean;
  features: {
    textChat: boolean;
    voiceCalls: boolean;
    videoCalls: boolean;
    whiteboard: boolean;
    fileSharing: boolean;
  };
  theme: {
    primaryColor: string;
    backgroundColor: string;
    accentColor: string;
  };
  moderation: {
    requireApproval: boolean;
    enableProfanityFilter: boolean;
    allowGuestsToPost: boolean;
  };
}

const roomTypes = [
  {
    id: 'community',
    name: 'Community Room',
    description: 'Persistent room for communities and groups',
    icon: Users,
    color: 'bg-blue-500',
    features: ['Persistent', 'Customizable', 'Member management'],
  },
  {
    id: 'private',
    name: 'Private Room',
    description: 'Invite-only room for private conversations',
    icon: Lock,
    color: 'bg-purple-500',
    features: ['Private', 'Invite-only', 'Enhanced security'],
  },
  {
    id: 'ephemeral',
    name: 'Ephemeral Room',
    description: 'Temporary room that auto-deletes when empty',
    icon: Clock,
    color: 'bg-orange-500',
    features: ['Temporary', 'Auto-delete', 'Low moderation'],
  },
];

const colorOptions = [
  { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
];

export default function CreateRoomPage() {
  const router = useRouter();
  const { isSignedIn, isGuest, isRegistered, user } = useClerkAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [roomSettings, setRoomSettings] = useState<RoomSettings>({
    name: '',
    description: '',
    type: 'community',
    maxMembers: 100,
    isPublic: true,
    allowGuests: true,
    features: {
      textChat: true,
      voiceCalls: true,
      videoCalls: false,
      whiteboard: false,
      fileSharing: true,
    },
    theme: {
      primaryColor: 'purple',
      backgroundColor: 'gray',
      accentColor: 'pink',
    },
    moderation: {
      requireApproval: false,
      enableProfanityFilter: true,
      allowGuestsToPost: true,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to create a room
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

  if (isGuest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Lock className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Create a Free Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Room creation is only available for registered users. Sign up for free to create your own rooms and access all features!
          </p>
          <a
            href="/sign-up"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700"
          >
            Sign Up Free
          </a>
        </div>
      </div>
    );
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!roomSettings.name.trim()) {
          newErrors.name = 'Room name is required';
        } else if (roomSettings.name.length < 3) {
          newErrors.name = 'Room name must be at least 3 characters';
        } else if (roomSettings.name.length > 100) {
          newErrors.name = 'Room name must be less than 100 characters';
        }

        if (!roomSettings.description.trim()) {
          newErrors.description = 'Room description is required';
        } else if (roomSettings.description.length > 500) {
          newErrors.description = 'Description must be less than 500 characters';
        }

        if (roomSettings.maxMembers < 2) {
          newErrors.maxMembers = 'Room must allow at least 2 members';
        } else if (roomSettings.maxMembers > 1000) {
          newErrors.maxMembers = 'Room cannot have more than 1000 members';
        }
        break;

      case 2:
        const enabledFeatures = Object.values(roomSettings.features).filter(Boolean).length;
        if (enabledFeatures === 0) {
          newErrors.features = 'At least one feature must be enabled';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
    setErrors({});
  };

  const createRoom = async () => {
    if (!validateStep(3)) return;

    setIsCreating(true);
    setErrors({});

    try {
      const response = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: `room_${Date.now()}`,
          metadata: roomSettings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const data = await response.json();
      router.push(`/rooms/${data.roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      setErrors({ general: 'Failed to create room. Please try again.' });
    } finally {
      setIsCreating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Room Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roomTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setRoomSettings({ ...roomSettings, type: type.id as any })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        roomSettings.type === type.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {type.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {type.description}
                      </p>
                      <div className="text-xs space-y-1">
                        {type.features.map((feature) => (
                          <div key={feature} className="flex items-center text-gray-500 dark:text-gray-400">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Name *
                </label>
                <input
                  type="text"
                  value={roomSettings.name}
                  onChange={(e) => setRoomSettings({ ...roomSettings, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                  placeholder="Enter room name"
                  maxLength={100}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {roomSettings.name.length}/100 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={roomSettings.description}
                  onChange={(e) => setRoomSettings({ ...roomSettings, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                  rows={3}
                  placeholder="Describe your room and what it's about"
                  maxLength={500}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {roomSettings.description.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Members *
                </label>
                <input
                  type="number"
                  value={roomSettings.maxMembers}
                  onChange={(e) => setRoomSettings({ ...roomSettings, maxMembers: parseInt(e.target.value) || 100 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                  min={2}
                  max={1000}
                />
                {errors.maxMembers && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxMembers}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Features
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose the features available in your room
              </p>

              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roomSettings.features.textChat}
                    onChange={(e) => setRoomSettings({
                      ...roomSettings,
                      features: { ...roomSettings.features, textChat: e.target.checked }
                    })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <MessageSquare className="w-5 h-5 ml-3 mr-3 text-gray-400" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">Text Chat</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Real-time messaging with reactions</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roomSettings.features.voiceCalls}
                    onChange={(e) => setRoomSettings({
                      ...roomSettings,
                      features: { ...roomSettings.features, voiceCalls: e.target.checked }
                    })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <Mic className="w-5 h-5 ml-3 mr-3 text-gray-400" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">Voice Calls</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">1:1 voice conversations</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roomSettings.features.videoCalls}
                    onChange={(e) => setRoomSettings({
                      ...roomSettings,
                      features: { ...roomSettings.features, videoCalls: e.target.checked }
                    })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <Video className="w-5 h-5 ml-3 mr-3 text-gray-400" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">Video Calls</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Face-to-face video conversations</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roomSettings.features.whiteboard}
                    onChange={(e) => setRoomSettings({
                      ...roomSettings,
                      features: { ...roomSettings.features, whiteboard: e.target.checked }
                    })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <Palette className="w-5 h-5 ml-3 mr-3 text-gray-400" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">Whiteboard</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Collaborative drawing space</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roomSettings.features.fileSharing}
                    onChange={(e) => setRoomSettings({
                      ...roomSettings,
                      features: { ...roomSettings.features, fileSharing: e.target.checked }
                    })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <Upload className="w-5 h-5 ml-3 mr-3 text-gray-400" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">File Sharing</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Share files up to 20MB</div>
                  </div>
                </label>
              </div>

              {errors.features && (
                <p className="mt-1 text-sm text-red-600">{errors.features}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Room Theme
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Customize the appearance of your room
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Primary Color
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setRoomSettings({
                          ...roomSettings,
                          theme: { ...roomSettings.theme, primaryColor: color.value }
                        })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          roomSettings.theme.primaryColor === color.value
                            ? 'border-purple-500'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className={`w-8 h-8 ${color.class} rounded-lg mx-auto mb-1`}></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Background Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['light', 'dark', 'gradient'].map((style) => (
                      <button
                        key={style}
                        onClick={() => setRoomSettings({
                          ...roomSettings,
                          theme: { ...roomSettings.theme, backgroundColor: style }
                        })}
                        className={`p-3 rounded-lg border-2 transition-all capitalize ${
                          roomSettings.theme.backgroundColor === style
                            ? 'border-purple-500'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className={`h-8 rounded mb-1 ${
                          style === 'light' ? 'bg-gray-100' :
                          style === 'dark' ? 'bg-gray-800' :
                          'bg-gradient-to-r from-purple-400 to-pink-400'
                        }`}></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{style}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Privacy Settings
              </h3>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Public Room</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Anyone can find and join this room</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={roomSettings.isPublic}
                    onChange={(e) => setRoomSettings({ ...roomSettings, isPublic: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Allow Guests</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Guest users can join this room</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={roomSettings.allowGuests}
                    onChange={(e) => setRoomSettings({ ...roomSettings, allowGuests: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Review & Create
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Review your room settings before creating
              </p>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Room Type</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {roomSettings.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {roomSettings.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Max Members</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {roomSettings.maxMembers}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Visibility</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {roomSettings.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Guest Access</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {roomSettings.allowGuests ? 'Allowed' : 'Not allowed'}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Enabled Features</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(roomSettings.features)
                        .filter(([_, enabled]) => enabled)
                        .map(([feature]) => (
                          <span
                            key={feature}
                            className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs rounded-full capitalize"
                          >
                            {feature.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {errors.general && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/rooms"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rooms
          </a>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Room
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Build your community space step by step
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  step <= currentStep
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Basic Info</span>
            <span className="text-gray-600 dark:text-gray-400">Features</span>
            <span className="text-gray-600 dark:text-gray-400">Appearance</span>
            <span className="text-gray-600 dark:text-gray-400">Review</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={createRoom}
                disabled={isCreating}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Room'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}