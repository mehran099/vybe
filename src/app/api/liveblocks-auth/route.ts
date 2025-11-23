import { auth } from '@clerk/nextjs/server';
import { Liveblocks } from '@liveblocks/node';

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get the room ID from the request body
    const { room } = await request.json();

    if (!room) {
      return new Response('Room ID is required', { status: 400 });
    }

    // Get user information from Clerk
    const user = auth();
    const userInfo = {
      name: `${user.user?.firstName || ''} ${user.user?.lastName || ''}`.trim() || user.user?.username || 'Guest User',
      picture: user.user?.imageUrl,
    };

    // Create a session token for the user
    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name: userInfo.name,
        picture: userInfo.picture,
      },
    });

    // Grant access to the specific room
    session.allow(room, session.FULL_ACCESS);

    const { body } = await session.authorize();

    return new Response(body, { status: 200 });
  } catch (error) {
    console.error('Error authorizing Liveblocks session:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}