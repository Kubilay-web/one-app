import  db  from "@/app/lib/db";
import { validateRequest } from "@/app/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { user } = await validateRequest();
    const senderId = params.id; // URL’den alınan senderId

    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    if (user.id === senderId) {
      return new Response(
        JSON.stringify({ message: "You can't accept a request from yourself" }),
        { status: 400 }
      );
    }

    // İstek var mı kontrol et
    const friendRequest = await db.friendRequest.findUnique({
      where: { userId_friendId: { userId: senderId, friendId: user.id } },
    });

    if (!friendRequest || friendRequest.status === "accepted") {
      return new Response(
        JSON.stringify({ message: "Already friends or no request found" }),
        { status: 400 }
      );
    }

    // Statüyü güncelle
    await db.friendRequest.update({
      where: { id: friendRequest.id },
      data: { status: "accepted" },
    });

    // Arkadaş listelerine ekle
    await db.user.update({
      where: { id: user.id },
      data: { friends: { connect: { id: senderId } } },
    });

    await db.user.update({
      where: { id: senderId },
      data: { friends: { connect: { id: user.id } } },
    });

    return new Response(
      JSON.stringify({ message: "Friend request accepted" }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
