import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";

interface Params {
  username: string;
}

export async function GET(
  req: Request,
  { params }: { params: Params }
) {
  const username = params.username;

  const {user} = await validateRequest();
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  try {
    const requestSent = await db.friendRequest.findFirst({
      where: { userId: user.id, friendId: username, status: "pending" },
    });

    const requestReceived = await db.friendRequest.findFirst({
      where: { userId: username, friendId: user.id, status: "pending" },
    });

    const friends = await db.friendRequest.findFirst({
      where: {
        OR: [
          { userId: user.id, friendId: username, status: "accepted" },
          { userId: username, friendId: user.id, status: "accepted" },
        ],
      },
    });

    const following = await db.followSocial.findUnique({
      where: {
        followerId_followingId: { followerId: user.id, followingId: username },
      },
    });

    return new Response(
      JSON.stringify({
        friends: !!friends,
        requestSent: !!requestSent,
        requestReceived: !!requestReceived,
        following: !!following,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
