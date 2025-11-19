import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20");

    // MongoDB aggregation pipeline for trending videos
    const pipeline: any[] = [
      {
        $match: {
          visibility: "public",
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "userId",
          foreignField: "id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "VideoView",
          localField: "id",
          foreignField: "videoId",
          as: "views",
        },
      },
      {
        $lookup: {
          from: "VideoReaction",
          localField: "id",
          foreignField: "videoId",
          as: "reactions",
        },
      },
      {
        $addFields: {
          viewCount: { $size: "$views" },
          likeCount: {
            $size: {
              $filter: {
                input: "$reactions",
                as: "reaction",
                cond: { $eq: ["$$reaction.type", "like"] },
              },
            },
          },
          dislikeCount: {
            $size: {
              $filter: {
                input: "$reactions",
                as: "reaction",
                cond: { $eq: ["$$reaction.type", "dislike"] },
              },
            },
          },
        },
      },
      {
        $sort: {
          viewCount: -1,
          id: -1,
        },
      },
    ];

    if (cursor) {
      const [id, viewCount] = cursor.split("_");
      pipeline.push({
        $match: {
          $or: [
            { viewCount: { $lt: parseInt(viewCount) } },
            {
              viewCount: parseInt(viewCount),
              id: { $lt: id },
            },
          ],
        },
      });
    }

    pipeline.push({ $limit: limit + 1 });

    const videos = await db.video.aggregateRaw({
      pipeline,
    });

    const videosArray = JSON.parse(JSON.stringify(videos));
    const hasMore = videosArray.length > limit;
    const items = hasMore ? videosArray.slice(0, -1) : videosArray;
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore 
      ? `${lastItem.id}_${lastItem.viewCount}`
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