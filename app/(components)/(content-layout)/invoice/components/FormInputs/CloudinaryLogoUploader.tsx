"use client";

import { useRef, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";

interface Props {
  imageUrl: string;
  setImageUrl: (url: string) => void;
}

export default function CloudinaryLogoUploader({
  imageUrl,
  setImageUrl,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const presetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

  const handleUpload = async (file: File) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", presetName || "");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setImageUrl(data.secure_url);
      } else {
        console.error("Upload failed:", data);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-40 h-40 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition"
        onClick={() => fileInputRef.current?.click()}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="logo"
            className="w-full h-full object-contain rounded-xl"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <ImageIcon className="w-8 h-8 mb-2" />
            <span className="text-sm">Upload Logo</span>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Upload className="w-4 h-4 animate-spin" />
          Uploading...
        </div>
      )}
    </div>
  );
}