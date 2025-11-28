import { NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET(req: Request) {
  try {
    // URL parametrelerini alıyoruz
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "";
    const limit = parseInt(searchParams.get("limit") || "10"); // Varsayılan limit 10
    const cursorId = searchParams.get("cursorId");
    const cursorUpdatedAt = searchParams.get("cursorUpdatedAt");

    // Cursor için tarih formatını kontrol edip parse ediyoruz
    const cursor =
      cursorId && cursorUpdatedAt
        ? { id: cursorId, updatedAt: new Date(cursorUpdatedAt) }
        : undefined;

    // Kullanıcının beğendiği videoları alıyoruz
    const likedVideos = await db.videoReaction.findMany({
      where: {
        userId, // Belirtilen kullanıcı ID'sine göre filtreliyoruz
        type: "like", // Sadece beğenilen videoları alıyoruz
      },
      take: limit + 1, // Bir ekstra video alıyoruz, daha fazla veri olup olmadığını kontrol etmek için
      skip: cursor ? 1 : 0, // Eğer cursor varsa ilk video atlanacak
      cursor: cursor ? { id: cursor.id } : undefined, // Cursor ile sayfalama
      orderBy: {
        updatedAt: "desc", // En son güncellenen video önce gelsin
      },
      include: {
        video: true, // Video bilgilerini dahil ediyoruz
        user: true, // Kullanıcı bilgilerini dahil ediyoruz
      },
    });

    // Eğer veri varsa, ve limit kadar veri alamadıysak, bir sonraki cursor var
    const hasMore = likedVideos.length > limit;
    const items = hasMore ? likedVideos.slice(0, -1) : likedVideos;
    const nextCursor = hasMore
      ? {
          id: items[items.length - 1].id,
          updatedAt: items[items.length - 1].updatedAt,
        }
      : null;

    // Video ve kullanıcı bilgilerini formatlıyoruz
    const formattedItems = await Promise.all(
      items.map(async (item) => {
        const likesCount = await db.videoReaction.count({
          where: {
            videoId: item.video.id,
            type: "like",
          },
        });

        const viewsCount = await db.videoView.count({
          where: {
            videoId: item.video.id,
          },
        });

        return {
          data: {
            id: item.video.id,
            title: item.video.title,
            createdAt: item.video.createdAt.toISOString(), // Dönüşüm sağlanıyor
            thumbnailUrl: item.video.thumbnailUrl,
            previewUrl: item.video.previewUrl,
            duration: item.video.duration,
            viewsCount, // İzlenme sayısını almak için
            likesCount, // Beğeni sayısını almak için
            description: item.video.description,
            user: {
              id: item.user.id,
              username: item.user.username,
              displayName: item.user.displayName,
              avatarUrl: item.user.avatarUrl,
            },
          },
        };
      })
    );

    // Sonuçları 'data' altında döndürüyoruz
    return NextResponse.json({ items: formattedItems, nextCursor });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
