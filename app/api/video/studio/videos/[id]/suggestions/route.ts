import { NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);

    const videoId = params.id; // <-- Dinamik route
    const limit = searchParams.get("limit");
    const cursor = searchParams.get("cursor");

    // Eksik parametre kontrolü
    if (!videoId || !limit) {
      return NextResponse.json(
        { message: "Missing videoId or limit" },
        { status: 400 }
      );
    }

    const limitValue = parseInt(limit, 10) || 20;
    let cursorValue: number | undefined = undefined;

    // Cursor doğrulama
    if (cursor && cursor !== "null") {
      cursorValue = parseInt(cursor, 10);
      if (isNaN(cursorValue)) {
        return NextResponse.json(
          { message: "Invalid cursor value" },
          { status: 400 }
        );
      }
    }

    // Video + kategori bilgisi al
    const video = await db.video.findUnique({
      where: { id: videoId },
      include: { category: true },
    });

    if (!video) {
      return NextResponse.json(
        { message: "Video not found" },
        { status: 404 }
      );
    }

    // Öneriler
    const suggestions = await db.video.findMany({
      where: {
        categoryId: video.categoryId,
        NOT: { id: videoId },
        ...(cursorValue && { createdAt: { lt: cursorValue } }),
      },
      take: limitValue,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        duration: true,
        createdAt: true,
      },
    });

    // nextCursor hesaplama
    const nextCursor =
      suggestions.length === limitValue
        ? suggestions[suggestions.length - 1].createdAt
        : null;

    return NextResponse.json({
      items: suggestions,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
