// app/api/social/getfriendinfos/route.ts

import { NextResponse } from 'next/server'; // Importing NextResponse
import db from "@/app/lib/db";

// Named export for the GET method
export async function GET(req: Request) {
  try {
    const userId = req.user?.id; // Example: You can extract it from session or JWT

    if (!userId) {
      // Use NextResponse to return a response with a status code
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve the current user details based on the userId in the request
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        friends: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          }
        },
        requests: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Fetch sent friend requests (users who have sent requests to the current user)
    const sentRequests = await db.friendRequest.findMany({
      where: {
        friendId: userId,  // The current user is the friend being requested
        status: 'pending', // Filter for only pending requests
      },
      select: {
        id: true,
        userId: true,
        friendId: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          }
        }
      }
    });

    // Return the data in the response
    return NextResponse.json({
      friends: user.friends,
      requests: user.requests,
      sentRequests: sentRequests.map(request => request.user), // Only returning the user object in sent requests
    });

  } catch (error) {
    console.error('Error fetching friend page data:', error);
    // Use NextResponse to return a server error response
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
