// app/api/video/studio/videos/[id]/thumbnail/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/app/auth";
import db from "@/app/lib/db";
import { UTApi } from "uploadthing/server";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Next.js 13+ App Router'da params async olarak çözümlenebilir
    const params = await context.params;
    const videoId = params.id;

    // Kullanıcı doğrulama
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Video kontrolü
    const video = await db.video.findFirst({
      where: {
        id: videoId,
        userId: user.id,
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const utapi = new UTApi();

    // Önceki thumbnail varsa sil
    if (video.thumbnailKey) {
      await utapi.deleteFiles(video.thumbnailKey);
    }

    if (!video.muxPlaybackId) {
      return NextResponse.json({ error: "No playback ID" }, { status: 400 });
    }

    // Mux'tan geçici thumbnail al ve UploadThing'e yükle
    const tempThumbnailUrl = `https://image.mux.com/${video.muxPlaybackId}/thumbnail.jpg`;
    const uploadedThumbnail = await utapi.uploadFilesFromUrl(tempThumbnailUrl);

    if (!uploadedThumbnail.data) {
      return NextResponse.json(
        { error: "Failed to upload thumbnail" },
        { status: 500 }
      );
    }

    const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data;

    // Veritabanında güncelle
    const updatedVideo = await db.video.update({
      where: {
        id: videoId,
        userId: user.id,
      },
      data: {
        thumbnailUrl,
        thumbnailKey,
      },
    });

    return NextResponse.json(updatedVideo);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
