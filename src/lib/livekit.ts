import { Room, RoomEvent, RemoteParticipant, LocalParticipant } from 'livekit-client';

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'ws://localhost:7880';

export interface CallMetadata {
  type: 'voice' | 'video';
  participants: string[];
  startTime: Date;
  endTime?: Date;
  roomId: string;
  createdBy: string;
}

export interface CallSettings {
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenShareEnabled: boolean;
  recordingEnabled: boolean;
  maxParticipants: number;
  allowGuests: boolean;
}

export class CallManager {
  private room: Room | null = null;
  private isConnected = false;
  private currentCallId: string | null = null;
  private localTracks: Map<string, any> = new Map();

  constructor() {
    this.initializeEventHandlers();
  }

  private initializeEventHandlers() {
    if (this.room) {
      this.room
        .on(RoomEvent.Connected, this.handleConnected.bind(this))
        .on(RoomEvent.Disconnected, this.handleDisconnected.bind(this))
        .on(RoomEvent.ParticipantConnected, this.handleParticipantConnected.bind(this))
        .on(RoomEvent.ParticipantDisconnected, this.handleParticipantDisconnected.bind(this))
        .on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed.bind(this))
        .on(RoomEvent.TrackUnsubscribed, this.handleTrackUnsubscribed.bind(this));
    }
  }

  async connect(callId: string, token: string): Promise<void> {
    try {
      this.currentCallId = callId;
      this.room = new Room();

      this.initializeEventHandlers();

      // Connect to the LiveKit room
      await this.room.connect(LIVEKIT_URL, token);
      this.isConnected = true;

      console.log(`Connected to LiveKit room: ${callId}`);
    } catch (error) {
      console.error('Failed to connect to LiveKit room:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.room) {
        // Stop all local tracks
        this.localTracks.forEach((track) => {
          if (track.stop) {
            track.stop();
          }
        });
        this.localTracks.clear();

        // Disconnect from the room
        this.room.disconnect();
        this.room = null;
      }

      this.isConnected = false;
      this.currentCallId = null;

      console.log('Disconnected from LiveKit room');
    } catch (error) {
      console.error('Error disconnecting from LiveKit room:', error);
      throw error;
    }
  }

  async enableAudio(): Promise<void> {
    if (!this.room || !this.isConnected) {
      throw new Error('Not connected to a room');
    }

    try {
      // Enable audio
      await this.room.localParticipant.setMicrophoneEnabled(true);
      console.log('Audio enabled');
    } catch (error) {
      console.error('Error enabling audio:', error);
      throw error;
    }
  }

  async disableAudio(): Promise<void> {
    if (!this.room || !this.isConnected) {
      throw new Error('Not connected to a room');
    }

    try {
      // Disable audio
      await this.room.localParticipant.setMicrophoneEnabled(false);
      console.log('Audio disabled');
    } catch (error) {
      console.error('Error disabling audio:', error);
      throw error;
    }
  }

  async enableVideo(): Promise<void> {
    if (!this.room || !this.isConnected) {
      throw new Error('Not connected to a room');
    }

    try {
      // Enable video
      await this.room.localParticipant.setCameraEnabled(true);
      console.log('Video enabled');
    } catch (error) {
      console.error('Error enabling video:', error);
      throw error;
    }
  }

  async disableVideo(): Promise<void> {
    if (!this.room || !this.isConnected) {
      throw new Error('Not connected to a room');
    }

    try {
      // Disable video
      await this.room.localParticipant.setCameraEnabled(false);
      console.log('Video disabled');
    } catch (error) {
      console.error('Error disabling video:', error);
      throw error;
    }
  }

  async startScreenShare(): Promise<void> {
    if (!this.room || !this.isConnected) {
      throw new Error('Not connected to a room');
    }

    try {
      // Start screen share
      await this.room.localParticipant.setScreenShareEnabled(true);
      console.log('Screen share started');
    } catch (error) {
      console.error('Error starting screen share:', error);
      throw error;
    }
  }

  async stopScreenShare(): Promise<void> {
    if (!this.room || !this.isConnected) {
      throw new Error('Not connected to a room');
    }

    try {
      // Stop screen share
      await this.room.localParticipant.setScreenShareEnabled(false);
      console.log('Screen share stopped');
    } catch (error) {
      console.error('Error stopping screen share:', error);
      throw error;
    }
  }

  // Getters
  getLocalParticipant(): LocalParticipant | null {
    return this.room?.localParticipant || null;
  }

  getRemoteParticipants(): RemoteParticipant[] {
    return this.room ? Array.from(this.room.remoteParticipants.values()) : [];
  }

  getParticipantCount(): number {
    if (!this.room) return 0;
    return this.room.remoteParticipants.size + 1; // +1 for local participant
  }

  isCallActive(): boolean {
    return this.isConnected && this.room !== null;
  }

  getCurrentCallId(): string | null {
    return this.currentCallId;
  }

  // Event handlers
  private handleConnected() {
    console.log('Connected to LiveKit room');
  }

  private handleDisconnected() {
    console.log('Disconnected from LiveKit room');
    this.isConnected = false;
    this.currentCallId = null;
  }

  private handleParticipantConnected(participant: RemoteParticipant) {
    console.log('Participant connected:', participant.identity);
  }

  private handleParticipantDisconnected(participant: RemoteParticipant) {
    console.log('Participant disconnected:', participant.identity);
  }

  private handleTrackSubscribed(
    track: any,
    publication: any,
    participant: RemoteParticipant
  ) {
    console.log('Track subscribed:', track.kind, participant.identity);
  }

  private handleTrackUnsubscribed(
    track: any,
    publication: any,
    participant: RemoteParticipant
  ) {
    console.log('Track unsubscribed:', track.kind, participant.identity);
  }
}

// Utility functions for call management
export async function generateCallToken(
  roomId: string,
  participantName: string,
  isGuest: boolean = false
): Promise<string> {
  try {
    const response = await fetch('/api/calls/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomId,
        participantName,
        isGuest,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate call token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error generating call token:', error);
    throw error;
  }
}

export async function createCallRoom(
  roomId: string,
  metadata: CallMetadata,
  settings: CallSettings
): Promise<void> {
  try {
    const response = await fetch('/api/calls/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomId,
        metadata,
        settings,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create call room: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error creating call room:', error);
    throw error;
  }
}

export async function endCall(callId: string): Promise<void> {
  try {
    const response = await fetch(`/api/calls/${callId}/end`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to end call: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error ending call:', error);
    throw error;
  }
}

// Create a singleton instance
export const callManager = new CallManager();

export default callManager;