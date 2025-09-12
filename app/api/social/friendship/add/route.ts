import { validateRequest } from "@/app/auth";
import db from "@/app/lib/db";

interface Params {}

export async function POST(req: Request, context: { params: Params }) {
  try {
    const body = await req.json();
    const friendId = body.friendId;

    if (!friendId) {
      return new Response(JSON.stringify({ error: "friendId is required" }), { status: 400 });
    }

    const {user} = await validateRequest();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const request = await db.friendRequest.create({
      data: {
        status: "pending",
        user: { connect: { id: user.id } },
        friend: { connect: { id: friendId } }, // Prisma modelinde friend ilişkisi varsa
      },
    });

    await db.followSocial.create({
      data: { followerId: user.id, followingId: friendId },
    });

    return new Response(JSON.stringify(request), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
