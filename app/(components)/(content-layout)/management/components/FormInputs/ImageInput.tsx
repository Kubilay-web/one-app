// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
// import { UploadButton } from "../../lib/uploadthing";
// import { cn } from "../../lib/utils";

// import Image from "next/image";
// import React from "react";
// type ImageInputProps = {
//   title: string;
//   imageUrl: string;
//   setImageUrl: any;
//   endpoint: any;
//   className?: string;
//   size?: "sm" | "lg";
// };
// export default function ImageInput({
//   title,
//   imageUrl,
//   setImageUrl,
//   endpoint,
//   className,
//   size = "lg",
// }: ImageInputProps) {
//   if (size === "sm") {
//     return (
//       <Card className="overflow-hidden">
//         <CardHeader>
//           <CardTitle className="text-center">{title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-2">
//             <Image
//               alt={title}
//               className={cn("h-20 w-full rounded-md object-cover", className)}
//               height="500"
//               src={imageUrl}
//               width="500"
//             />
//             <UploadButton
//               className="ut-button:bg-blue-600/80 ut-button:ut-readying:bg-blue-400/50 ut-button:w-full ut-button:outline-none"
//               endpoint={endpoint}
//               onClientUploadComplete={(res) => {
//                 // Do something with the response
//                 console.log("Files: ", res);

//                 setImageUrl(res[0].url);
//               }}
//               onUploadError={(error: Error) => {
//                 // Do something with the error.
//                 alert(`ERROR! ${error.message}`);
//               }}
//             />
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }
//   return (
//     <Card className="overflow-hidden">
//       <CardHeader>
//         <CardTitle className="text-center">{title}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid gap-2">
//           <Image
//             alt={title}
//             className={cn("h-40 w-full rounded-md object-cover", className)}
//             height="500"
//             src={imageUrl}
//             width="500"
//           />
//           <UploadButton
//             className="ut-button:bg-blue-600/80 ut-button:ut-readying:bg-blue-400/50 ut-button:w-full ut-button:outline-none"
//             endpoint={endpoint}
//             onClientUploadComplete={(res) => {
//               // Do something with the response
//               console.log("Files: ", res);

//               setImageUrl(res[0].url);
//             }}
//             onUploadError={(error: Error) => {
//               // Do something with the error.
//               alert(`ERROR! ${error.message}`);
//             }}
//           />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }







"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { cn } from "../../lib/utils";
import Image from "next/image";
import React, { useRef } from "react";

type ImageInputProps = {
  title: string;
  imageUrl: string;
  setImageUrl: any;
  className?: string;
  size?: "sm" | "lg";
};

export default function ImageInput({
  title,
  imageUrl,
  setImageUrl,
  className,
  size = "lg",
}: ImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setImageUrl(data.secure_url);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await handleUpload(file);
  };

  const heightClass = size === "sm" ? "h-20" : "h-40";

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-2">
          <Image
            alt={title}
            src={imageUrl}
            width={500}
            height={500}
            className={cn(`${heightClass} w-full rounded-md object-cover`, className)}
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-md bg-blue-600/80 py-2 text-white hover:bg-blue-500"
          >
            Upload Image
          </button>
        </div>
      </CardContent>
    </Card>
  );
}