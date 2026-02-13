// // import { UploadDropzone } from "@/lib/uploadthing";

// import { UploadDropzone } from "../../utils/uploadthing";
// import { Pencil } from "lucide-react";
// import Image from "next/image";
// import React from "react";
// import toast from "react-hot-toast";

// export default function ImageInput({
//   label,
//   imageUrl = "",
//   setImageUrl,
//   className = "col-span-full",
//   endpoint = "",
// }: {
//   label: string;
//   imageUrl: string;
//   setImageUrl: any;
//   className?: string;
//   endpoint: any;
// }) {
//   return (
//     <div className={className}>
//       <div className="flex justify-between items-center mb-4">
//         <label
//           htmlFor="course-image"
//           className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-50 mb-2"
//         >
//           {label}
//         </label>
//         {imageUrl && (
//           <button
//             onClick={() => setImageUrl("")}
//             type="button"
//             className="flex space-x-2  bg-slate-900 rounded-md shadow text-slate-50  py-2 px-4"
//           >
//             <Pencil className="w-5 h-5" />
//             <span>Change Image</span>
//           </button>
//         )}
//       </div>
//       {imageUrl ? (
//         <Image
//           src={imageUrl}
//           alt="Item image"
//           width={1000}
//           height={667}
//           className="w-full h-64 object-contain"
//         />
//       ) : (
//         <UploadDropzone
//           endpoint={`${endpoint}` as any}
//           onClientUploadComplete={(res: any) => {
//             setImageUrl(res[0].url);
//             // Do something with the response
//             toast.success("Image Upload complete");
//             console.log("Files: ", res);
//             console.log("Upload Completed");
//           }}
//           onUploadError={(error: any) => {
//             toast.error("Image Upload Failed, Try Again");
//             // Do something with the error.
//             console.log(`ERROR! ${error.message}`, error);
//           }}
//         />
//       )}
//     </div>
//   );
// }

"use client";

import { Pencil } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { deleteDoctorProfileImage } from "../../actions/deleteImage";
import { useSession } from "@/app/SessionProvider";

export default function ImageInput({
  label,
  imageUrl = "",
  setImageUrl,
  className = "col-span-full",
}: {
  label: string;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  className?: string;
}) {
  const [uploading, setUploading] = useState(false);

  const session=useSession();
  const user=session.user;
  const userId=user?.id;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!,
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      setImageUrl(data.secure_url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Image upload failed");
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-gray-900 dark:text-slate-50">
          {label}
        </label>

        {imageUrl && (
          <button
            type="button"
            onClick={async () => {
              await deleteDoctorProfileImage(userId);
              setImageUrl("");
              toast.success("Profile image removed");
            }}
            className="flex space-x-2 bg-slate-900 rounded-md shadow text-slate-50 py-2 px-4"
          >
            <Pencil className="w-5 h-5" />
            <span>Change Image</span>
          </button>
        )}
      </div>

      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Item image"
          width={1000}
          height={667}
          className="w-full h-64 object-contain"
        />
      ) : (
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-slate-900 file:text-white
            hover:file:bg-slate-700"
        />
      )}

      {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}
