import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/app/auth";
import  db  from "@/app/lib/db";
import { UTApi } from "uploadthing/server";
import { mux } from "@/app/lib/mux";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const {user} = await validateRequest();
    const userId = user?.id;

    const video = await db.video.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          include: {
            _count: {
              select: {
                subscribers: true,
              },
            },
          },
        },
        _count: {
          select: {
            views: true,
            reactions: {
              where: { type: "like" },
            },
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    let viewerReaction = null;
    let viewerSubscribed = false;

    if (userId) {
      // Get viewer's reaction
      const reaction = await db.videoReaction.findFirst({
        where: {
          videoId: params.id,
          userId: userId,
        },
      });

      if (reaction) {
        viewerReaction = reaction.type;
      }

      // Check if viewer is subscribed
      const subscription = await db.subscription.findFirst({
        where: {
          viewerId: userId,
          creatorId: video.userId,
        },
      });

      viewerSubscribed = !!subscription;
    }

    const response = {
      ...video,
      user: {
        ...video.user,
        subscriberCount: video.user._count.subscribers,
        viewerSubscribed,
      },
      viewCount: video._count.views,
      likeCount: video._count.reactions,
      viewerReaction,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const {user} = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const video = await db.video.update({
      where: {
        id: params.id,
        userId: user.id,
      },
      data: {
        title: body.title,
        description: body.description,
        categoryId: body.categoryId,
        visibility: body.visibility,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json(
      { error: "Video not found or unauthorized" },
      { status: 404 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const {user} = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const video = await db.video.delete({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json(
      { error: "Video not found or unauthorized" },
      { status: 404 }
    );
  }
}