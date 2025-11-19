import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/app/auth";
import db from "@/app/lib/db";
import { UTApi } from "uploadthing/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {user} = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const video = await db.video.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const utapi = new UTApi();

    // Delete existing thumbnail
    if (video.thumbnailKey) {
      await utapi.deleteFiles(video.thumbnailKey);
    }

    if (!video.muxPlaybackId) {
      return NextResponse.json({ error: "No playback ID" }, { status: 400 });
    }

    // Upload new thumbnail from Mux
    const tempThumbnailUrl = `https://image.mux.com/${video.muxPlaybackId}/thumbnail.jpg`;
    const uploadedThumbnail = await utapi.uploadFilesFromUrl(tempThumbnailUrl);

    if (!uploadedThumbnail.data) {
      return NextResponse.json(
        { error: "Failed to upload thumbnail" },
        { status: 500 }
      );
    }

    const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data;

    const updatedVideo = await db.video.update({
      where: {
        id: params.id,
        userId: user.id,
      },
      data: {
        thumbnailUrl,
        thumbnailKey,
      },
    });

    return NextResponse.json(updatedVideo);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}