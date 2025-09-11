import { NextResponse } from "next/server";
import db  from "@/app/lib/db";
import { validateRequest } from "@/app/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await validateRequest();
    const friendId = params.id;

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // findFirst ile kontrol et
    const existingRequest = await db.friendRequest.findFirst({
      where: {
        userId: user.id,
        friendId: friendId,
      },
    });

    if (!existingRequest) {
      return NextResponse.json({ message: "No request found" }, { status: 404 });
    }

    await db.friendRequest.delete({
      where: { id: existingRequest.id },
    });

    return NextResponse.json({ message: "Friend request canceled" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
