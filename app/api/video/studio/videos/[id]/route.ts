import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { validateRequest } from "@/app/auth";
import db from "@/app/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const {user} = await validateRequest();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ID ObjectId mi?
    if (!ObjectId.isValid(params.id)) {
      return new NextResponse("Invalid video ID", { status: 400 });
    }

    // ObjectId string'e çevrilmiş haliyle prisma kullanabilir
    const id = new ObjectId(params.id).toString();

    const video = await db.video.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!video) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(video);
  } catch (err) {
    console.error(err);
    return new NextResponse("Server error", { status: 500 });
  }
}
