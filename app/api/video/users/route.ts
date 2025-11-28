import { NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const limit = Number(url.searchParams.get("limit") || "20");
  const cursor = url.searchParams.get("cursor");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    // Kullanıcının videoları (pagination destekli)
    const videos = await db.video.findMany({
      where: { userId },
      take: limit + 1,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          include: {
            subscriptions: true, // user.subscriptions
            videos: true,        // user.videos
          },
        },
      },
    });

    const hasMore = videos.length > limit;
    const items = hasMore ? videos.slice(0, -1) : videos;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    const formattedItems = items.map((video) => ({
      data: {
        ...video,
        createdAt: video.createdAt.toISOString(),
        updatedAt: video.updatedAt.toISOString(),
        user: {
          ...video.user,
          subscriberCount: video.user.subscriptions?.length || 0,
          videoCount: video.user.videos?.length || 0,
          createdAt: video.user.createdAt.toISOString(),
          updatedAt: video.user.updatedAt.toISOString(),
        },
      },
    }));

    return NextResponse.json({
      items: formattedItems,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
