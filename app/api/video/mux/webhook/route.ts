import { NextRequest, NextResponse } from "next/server";
import  db  from "@/app/lib/db";
import { mux } from "@/app/lib/mux";

export async function POST(req: NextRequest) {
  try {
    console.log("🔔 Mux webhook received");

    const body = await req.json();
    console.log("Webhook body:", JSON.stringify(body, null, 2));

    const { type, data } = body;

    // Upload completed event
    if (type === "video.upload.asset_created") {
      const uploadId = data.id;
      const assetId = data.asset_id;

      console.log(`📹 Upload ${uploadId} completed, asset: ${assetId}`);

      // Video'yu bul ve güncelle
      const video = await db.video.update({
        where: {
          muxUploadId: uploadId,
        },
        data: {
          muxAssetId: assetId,
          muxStatus: "asset_created",
        },
      });

      console.log(`✅ Video ${video.id} updated with asset ${assetId}`);
    }

    // Asset ready event
    if (type === "video.asset.ready") {
      const assetId = data.id;
      const playbackId = data.playback_ids?.[0]?.id;
      const duration = data.duration ? Math.round(data.duration * 1000) : 0;

      console.log(`🎬 Asset ${assetId} ready, playback: ${playbackId}, duration: ${duration}`);

      // Video'yu bul ve güncelle
      const video = await db.video.update({
        where: {
          muxAssetId: assetId,
        },
        data: {
          muxPlaybackId: playbackId,
          muxStatus: "ready",
          duration: duration,
        },
      });

      console.log(`✅ Video ${video.id} is ready for playback`);
    }

    // Asset errored event
    if (type === "video.asset.errored") {
      const assetId = data.id;
      const errors = data.errors;

      console.log(`❌ Asset ${assetId} errored:`, errors);

      const video = await db.video.update({
        where: {
          muxAssetId: assetId,
        },
        data: {
          muxStatus: "errored",
        },
      });

      console.log(`❌ Video ${video.id} marked as errored`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook Error", details: error.message },
      { status: 500 }
    );
  }
}