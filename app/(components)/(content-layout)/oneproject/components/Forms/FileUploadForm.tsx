"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Upload, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createMultipleFiles } from "../../actions/fileManager";
import { FileProps as CreateFileProps } from "../../types/types";

export default function FileUploadForm({ folderId }: { folderId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  // 🔹 Cloudinary upload with automatic resource_type
  async function uploadToCloudinary(file: File) {
    // ✅ Determine resource_type automatically
    const resourceType = file.type.startsWith("image/") ? "image" : "raw";

    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!
    );

    const res = await fetch(url, { method: "POST", body: formData });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Cloudinary upload failed");
    }

    const data = await res.json();

    return {
      name: file.name,
      type: file.type,
      size: file.size,
      url: data.secure_url,
      folderId,
    } as CreateFileProps;
  }

  async function onSubmit() {
    if (files.length === 0) {
      toast.error("Please add at least one file!");
      return;
    }

    try {
      setIsLoading(true);
      const uploadedFiles: CreateFileProps[] = [];

      for (const file of files) {
        const uploaded = await uploadToCloudinary(file);
        uploadedFiles.push(uploaded);
      }

      await createMultipleFiles(uploadedFiles);

      toast.success("Files uploaded successfully!");
      setFiles([]);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-white text-black hover:bg-gray-100">
          <Upload className="mr-2" /> Upload Files
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle>Upload your Files</DialogTitle>
        </DialogHeader>

        {/* File input */}
        <input
          type="file"
          multiple
          onChange={(e) =>
            setFiles(e.target.files ? Array.from(e.target.files) : [])
          }
          className="mb-4"
        />

        {/* Selected file list */}
        {files.map((file, i) => (
          <div
            key={i}
            className="flex justify-between items-center border p-2 rounded mb-2"
          >
            <span className="truncate">{file.name}</span>
            <button
              onClick={() =>
                setFiles((prev) => prev.filter((_, idx) => idx !== i))
              }
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}

        {/* Submit */}
        <div className="flex justify-end">
          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </Button>
          ) : (
            <Button onClick={onSubmit}>Save Files</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
