import { NextResponse } from "next/server";
import  db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";
import { ObjectId } from "mongodb"; // <- Prisma MongoDB ObjectId için

export async function POST(req: Request) {
  try {
    const {user} = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Yeni ObjectId üret
    const newId = new ObjectId().toHexString();

    const video = await db.video.create({
      data: {
        id: newId,               // <-- id ekledik
        title: "Untitled Video",
        userId: user.id,
      },
    });

    // Örnek upload URL
    const uploadUrl = `/api/video/mux/upload/${video.id}`;

    return NextResponse.json({ video, url: uploadUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
