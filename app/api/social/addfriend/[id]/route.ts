import  db  from "@/app/lib/db";
import { validateRequest } from "@/app/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { user } = await validateRequest(); // Token doğrulama
    const friendId = params.id;

    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    if (user.id === friendId) {
      return new Response(
        JSON.stringify({ message: "You can't send a request to yourself" }),
        { status: 400 }
      );
    }

    // Zaten gönderilmiş mi kontrol et
    const existingRequest = await db.friendRequest.findFirst({
      where: {
        userId: user.id,
        friendId: friendId,
      },
    });

    if (existingRequest) {
      return new Response(
        JSON.stringify({ message: "Friend request already sent" }),
        { status: 400 }
      );
    }

    // Yeni arkadaşlık isteği oluştur
    const friendRequest = await db.friendRequest.create({
      data: {
        userId: user.id,
        friendId,
        status: "pending",
      },
    });

    return new Response(
      JSON.stringify({ message: "Friend request has been sent", friendRequest }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
