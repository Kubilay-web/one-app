import { NextResponse } from "next/server";
import db from "@/app/lib/db"
import { validateRequest } from "@/app/auth";

export async function GET(req: Request) {
  try {
    const {user} = await validateRequest();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = new URL(req.url);
    const cursorId = url.searchParams.get("cursorId");
    const cursorUpdatedAt = url.searchParams.get("cursorUpdatedAt");
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const where: any = {
      userId: user.id,
    };

    // cursor pagination logic
    if (cursorId && cursorUpdatedAt) {
      where.OR = [
        { updatedAt: { lt: new Date(cursorUpdatedAt) } },
        {
          AND: [
            { updatedAt: { equals: new Date(cursorUpdatedAt) } },
            { id: { lt: cursorId } },
          ],
        },
      ];
    }

    // fetch videos with joined data
    const data = await db.video.findMany({
      where,
      orderBy: [
        { updatedAt: "desc" },
        { id: "desc" },
      ],
      include: {
        user: true,
        views: true,
        comments: true,
        reactions: true,
      },
      take: limit + 1, // check if hasMore
    });

    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, -1) : data;
    const last = items.at(-1);

    let nextCursor = null;
    if (hasMore && last) {
      nextCursor = {
        id: last.id,
        updatedAt: last.updatedAt,
      };
    }

    // map stats (match TRPC exactly)
    const mapped = items.map((v) => ({
      ...v,
      viewCount: v.views.length,
      commentCount: v.comments.length,
      likeCount: v.reactions.filter((r) => r.type === "like").length,
    }));

    return NextResponse.json({
      items: mapped,
      nextCursor,
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Server error", { status: 500 });
  }
}
