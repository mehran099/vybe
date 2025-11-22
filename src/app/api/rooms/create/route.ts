import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { roomId, metadata } = await request.json();

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    // For now, just return a success response
    // In a real implementation, you would store this in a database
    return NextResponse.json({
      success: true,
      roomId,
      metadata: {
        name: metadata.name || 'New Room',
        type: metadata.type || 'private',
        creatorId: userId,
        createdAt: new Date(),
        ...metadata,
      },
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}