// app/api/social/follow/[id]/route.ts
import  db  from "@/app/lib/db";
import { validateRequest } from "@/app/auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { user } = await validateRequest();
    const followId = params.id; // URL parametresi burada güvenle alınabilir

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Zaten takip ediyor mu?
    const existing = await db.followSocial.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: followId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Already following" }, { status: 400 });
    }

    await db.followSocial.create({
      data: {
        followerId: user.id,
        followingId: followId,
      },
    });

    return NextResponse.json({ message: "Followed successfully" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
