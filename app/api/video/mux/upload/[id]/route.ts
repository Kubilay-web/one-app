import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1) Kullanıcı doğrula
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Video gerçekten kullanıcıya ait mi?
    const video = await db.video.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Video bulunamadı" }, { status: 404 });
    }

    // 3) Mux'ta upload linki oluştur
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"], // public playback
      },
      cors_origin: "*",
    });

    // 4) Mux upload ID'yi veritabanına kaydet
    await db.video.update({
      where: { id: params.id },
      data: {
        muxUploadId: upload.id,   // Mux upload ID
      },
    });

    // 5) Frontend'e upload URL ve uploadId döndür
    return NextResponse.json({
      message: "Mux upload oluşturuldu",
      uploadUrl: upload.url,
      uploadId: upload.id,
    });
  } catch (err) {
    console.error("MUX_UPLOAD_ERROR:", err);
    return NextResponse.json({ error: "Mux Upload Error" }, { status: 500 });
  }
}
