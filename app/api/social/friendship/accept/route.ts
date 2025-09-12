import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";


export async function POST(req: Request) {
  try {

    const {user} = await validateRequest();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const body = await req.json();
    const { friendId } = body;
    if (!friendId) return new Response(JSON.stringify({ error: "friendId is required" }), { status: 400 });

    // Pending friend request'i kabul et
    await db.friendRequest.updateMany({
      where: { userId: friendId, friendId: user.id, status: "pending" },
      data: { status: "accepted" },
    });

    // Arkadaşı otomatik takip et
    await db.followSocial.create({
      data: { followerId: user.id, followingId: friendId },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
