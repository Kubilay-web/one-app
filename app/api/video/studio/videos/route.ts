import { NextRequest, NextResponse } from "next/server";
import  db  from "@/app/lib/db";
import { mux } from "@/app/lib/mux";
import { validateRequest } from "@/app/auth";



export async function POST(req: NextRequest) {
  try {
    console.log("Starting video creation process...");

    // Authentication - NextAuth kullanarak
    const {user} = await validateRequest();
    
    if (!user) {
      console.log("Unauthorized: No user session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User authenticated:", user.id);

    // Kullanıcıyı veritabanında bul
    const users = await db.user.findUnique({
      where: {
        id: user.id, // Eğer Clerk kullanıyorsanız: clerkId: session.user.id
      },
    });

    if (!users) {
      console.log("User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User found:", user.id);

    // Mux upload oluştur
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: user.id,
        playback_policy: ["public"],
        input: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              },
            ],
          },
        ],
      },
      cors_origin: "*",
    });

    console.log("Mux upload created:", upload.id);

    // Video kaydı oluştur
    const video = await db.video.create({
      data: {
        userId: user.id,
        title: "Untitled",
        muxStatus: "waiting",
        muxUploadId: upload.id,
        visibility: "private", // Varsayılan olarak private
      },
    });

    console.log("Video record created:", video.id);

    return NextResponse.json({
      video,
      url: upload.url,
    });
  } catch (error: any) {
    console.error("Video creation error:", error);
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const userId = searchParams.get("userId");
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20");

    let where: any = {
      visibility: "public",
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (userId) {
      where.userId = userId;
    }

    let cursorCondition = {};
    if (cursor) {
      const [id, updatedAt] = cursor.split("_");
      cursorCondition = {
        id: { lt: id },
        updatedAt: { lte: new Date(updatedAt) },
      };
    }

    const videos = await db.video.findMany({
      where: {
        ...where,
        ...cursorCondition,
      },
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