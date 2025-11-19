import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

// MUX Webhook Signing Secret
const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("mux-signature");

    // 1) Webhook doğrulaması
    const isValid = Mux.Webhooks.verifyHeader(
      body,
      signature!,
      SIGNING_SECRET
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // 2) Yalnızca asset.ready event'ini işliyoruz
    if (event.type !== "video.asset.ready") {
      return NextResponse.json({ message: "Ignored" });
    }

    const asset = event.data;
    const assetId = asset.id;

    // 3) Bu asset ID hangi videoya ait?
    const video = await db.video.findFirst({
      where: {
        muxUploadId: asset.upload_id,
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Related video not found" },
        { status: 404 }
      );
    }

    // 4) Playback ID al
    const playbackId = asset.playback_ids?.[0]?.id;

    // 5) Veritabanını güncelle
    await db.video.update({
      where: { id: video.id },
      data: {
        muxAssetId: assetId,
        muxPlaybackId: playbackId,
        status: "ready",
      },
    });

    return NextResponse.json({ message: "Webhook processed" });
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}
