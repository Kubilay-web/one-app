import { headers } from "next/headers";
import { UTApi } from "uploadthing/server";

import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
  VideoAssetDeletedWebhookEvent,
} from "@mux/mux-node/resources/webhooks";

import db  from "@/app/lib/db";
import { mux } from "@/app/lib/mux";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetTrackReadyWebhookEvent
  | VideoAssetDeletedWebhookEvent;

export const POST = async (request: Request) => {
  if (!SIGNING_SECRET) {
    throw new Error("MUX_WEBHOOK_SECRET is not set");
  }

  // Get headers
  const headersPayload = await headers();
  const muxSignature = headersPayload.get("mux-signature");

  if (!muxSignature) {
    return new Response("No signature found", { status: 401 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Verify signature
  mux.webhooks.verifySignature(
    body,
    { "mux-signature": muxSignature },
    SIGNING_SECRET
  );

  // Switch by webhook type
  switch (payload.type as WebhookEvent["type"]) {

    /* ------------------------------------ *
     *          VIDEO ASSET CREATED
     * ------------------------------------ */
    case "video.asset.created": {
      const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("No upload ID found", { status: 400 });
      }

      console.log("Creating video asset:", data.upload_id);

      await db.video.updateMany({
        where: { muxUploadId: data.upload_id },
        data: {
          muxAssetId: data.id,
          muxStatus: data.status,
        },
      });

      break;
    }

    /* ------------------------------------ *
     *          VIDEO READY
     * ------------------------------------ */
    case "video.asset.ready": {
      const data = payload.data as VideoAssetReadyWebhookEvent["data"];
      const playbackId = data.playback_ids?.[0].id;

      if (!data.upload_id) return new Response("Missing upload ID", { status: 400 });
      if (!playbackId) return new Response("Missing playback ID", { status: 400 });

      const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;

      const duration = data.duration ? Math.round(data.duration * 1000) : 0;

      // Upload using UploadThing
      const utapi = new UTApi();
      const [uploadedThumbnail, uploadedPreview] =
        await utapi.uploadFilesFromUrl([tempThumbnailUrl, tempPreviewUrl]);

      if (!uploadedThumbnail.data || !uploadedPreview.data) {
        return new Response("Failed to upload thumbnail or preview", { status: 500 });
      }

      await db.video.updateMany({
        where: { muxUploadId: data.upload_id },
        data: {
          muxStatus: data.status,
          muxPlaybackId: playbackId,
          muxAssetId: data.id,

          thumbnailUrl: uploadedThumbnail.data.url,
          thumbnailKey: uploadedThumbnail.data.key,

          previewUrl: uploadedPreview.data.url,
          previewKey: uploadedPreview.data.key,

          duration,
        },
      });

      break;
    }

    /* ------------------------------------ *
     *          VIDEO ERRORED
     * ------------------------------------ */
    case "video.asset.errored": {
      const data = payload.data as VideoAssetErroredWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("Missing upload ID", { status: 400 });
      }

      await db.video.updateMany({
        where: { muxUploadId: data.upload_id },
        data: { muxStatus: data.status },
      });

      break;
    }

    /* ------------------------------------ *
     *          VIDEO DELETED
     * ------------------------------------ */
    case "video.asset.deleted": {
      const data = payload.data as VideoAssetDeletedWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("Missing upload ID", { status: 400 });
      }

      console.log("Deleting video with upload, id:", data.upload_id);

      await db.video.deleteMany({
        where: { muxUploadId: data.upload_id },
      });

      break;
    }

    /* ------------------------------------ *
     *          TRACK READY
     * ------------------------------------ */
    case "video.asset.track.ready": {
      const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
        asset_id: string;
      };

      console.log("Track ready");

      const assetId = data.asset_id;
      const trackId = data.id;
      const status = data.status;

      if (!assetId) {
        return new Response("Missing asset ID", { status: 400 });
      }

      await db.video.updateMany({
        where: { muxAssetId: assetId },
        data: {
          muxTrackId: trackId,
          muxTrackStatus: status,
        },
      });

      break;
    }
  }

  return new Response("Webhook received", { status: 200 });
};
