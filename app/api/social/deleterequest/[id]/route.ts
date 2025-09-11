import  db  from "@/app/lib/db";
import { validateRequest } from "@/app/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await validateRequest();
    const senderId = params.id; // URL parametresinden geliyor

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.id === senderId) {
      return NextResponse.json(
        { message: "You can't delete yourself" },
        { status: 400 }
      );
    }

    // Kullanıcı ve isteği gönderen kontrolü
    const isRequestExists = await db.user.findFirst({
      where: {
        id: user.id,
        followers: { some: { id: senderId } },
      },
    });

    if (!isRequestExists) {
      return NextResponse.json(
        { message: "Request already deleted or not found" },
        { status: 400 }
      );
    }

    // Receiver'dan followers kaldır
    await db.user.update({
      where: { id: user.id },
      data: {
        followers: { disconnect: { id: senderId } },
      },
    });

    // Sender'dan following kaldır
    await db.user.update({
      where: { id: senderId },
      data: {
        following: { disconnect: { id: user.id } },
      },
    });

    // Opsiyonel: FriendRequest status güncelle
    await db.friendRequest.updateMany({
      where: {
        userId: senderId,
        friendId: user.id,
      },
      data: { status: "removed" },
    });

    return NextResponse.json(
      { message: "Friend request deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
