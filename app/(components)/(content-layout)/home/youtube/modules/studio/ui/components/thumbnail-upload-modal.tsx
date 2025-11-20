"use client";

import { useState } from "react";
import { UploadDropzone } from "@/app/lib/uploadthingvideo";
import { ResponsiveModal } from "../../../../components/responsive-modal";
import { toast } from "sonner";

interface ThumbnailUploadModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThumbnailUploadModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailUploadModalProps) => {
  const [uploading, setUploading] = useState(false);

  const onUploadComplete = async (fileUrl: string) => {
    try {
      setUploading(true);
      const res = await fetch(`/api/videos/${videoId}/thumbnail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thumbnailUrl: fileUrl }),
      });
      if (!res.ok) throw new Error("Failed to upload thumbnail");
      toast.success("Thumbnail updated");
      onOpenChange(false);
    } catch (err) {
      toast.error("Something went wrong while uploading thumbnail");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ResponsiveModal
      title="Upload a thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="thumbnailUploader"
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
        disabled={uploading}
      />
    </ResponsiveModal>
  );
};
