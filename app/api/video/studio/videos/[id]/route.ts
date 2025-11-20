import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/app/auth";
import db from "@/app/lib/db";
import { ObjectId } from "mongodb";

interface Context {
  params: { id: string };
}


export async function GET(req: NextRequest, context: Context) {
  try {
    // id'den sadece ObjectId kısmını al
    const rawId = context.params.id;
    const id = rawId.split(":")[0]; // "691ed4119103d8923f88e9c6:200" -> "691ed4119103d8923f88e9c6"

    const { user } = await validateRequest();
    const userId = user?.id;

    // ObjectId doğrulama
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    const video = await db.video.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            _count: { select: { subscribers: true } },
          },
        },
        _count: {
          select: { views: true, reactions: { where: { type: "like" } } },
        },
      },
    });

    if (!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });

    let viewerReaction = null;
    let viewerSubscribed = false;

    if (userId) {
      const reaction = await db.videoReaction.findFirst({
        where: { videoId: id, userId },
      });
      if (reaction) viewerReaction = reaction.type;

      const subscription = await db.subscription.findFirst({
        where: { viewerId: userId, creatorId: video.userId },
      });
      viewerSubscribed = !!subscription;
    }

    return NextResponse.json({
      ...video,
      user: {
        ...video.user,
        subscriberCount: video.user._count.subscribers,
        viewerSubscribed,
      },
      viewCount: video._count.views,
      likeCount: video._count.reactions,
      viewerReaction,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}




export async function PUT(req: NextRequest, context: Context) {
  try {
    const { id } = context.params;
    const { user } = await validateRequest();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const video = await db.video.update({
      where: { id, userId: user.id },
      data: {
        title: body.title,
        description: body.description,
        categoryId: body.categoryId || null,
        visibility: body.visibility,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Video not found or unauthorized" }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { id } = context.params;
    const { user } = await validateRequest();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const video = await db.video.delete({
      where: { id, userId: user.id },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Video not found or unauthorized" }, { status: 404 });
  }
}
