import { NextRequest, NextResponse } from "next/server";
import  db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";

export async function GET(req: NextRequest) {
  try {
    const {user} = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Get user's subscriptions
    const subscriptions = await db.subscription.findMany({
      where: {
        viewerId: user.id,
      },
      select: {
        creatorId: true,
      },
    });

    const creatorIds = subscriptions.map(sub => sub.creatorId);

    if (creatorIds.length === 0) {
      return NextResponse.json({
        items: [],
        nextCursor: null,
      });
    }

    let where: any = {
      userId: { in: creatorIds },
      visibility: "public",
    };

    if (cursor) {
      const [id, updatedAt] = cursor.split("_");
      where = {
        ...where,
        $or: [
          { updatedAt: { lt: new Date(updatedAt) } },
          {
            updatedAt: new Date(updatedAt),
            id: { lt: id },
          },
        ],
      };
    }

    const videos = await db.video.findMany({
      where,
      include: {
        user: true,
        _count: {
          select: {
            views: true,
            reactions: {
              where: { type: "like" },
            },
          },
        },
      },
      orderBy: [
        { updatedAt: "desc" },
        { id: "desc" },
      ],
      take: limit + 1,
    });

    const hasMore = videos.length > limit;
    const items = hasMore ? videos.slice(0, -1) : videos;
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore 
      ? `${lastItem.id}_${lastItem.updatedAt.toISOString()}`
      : null;

    return NextResponse.json({
      items,
      nextCursor,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}