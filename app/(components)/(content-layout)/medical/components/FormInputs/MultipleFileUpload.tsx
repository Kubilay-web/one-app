// import React, { useRef } from "react";
// import { File, Pencil, XCircle } from "lucide-react";
// import toast from "react-hot-toast";

// export type FileProps = {
//   title: string;
//   size: number;
//   url: string;
// };

// type MultipleFileUploadProps = {
//   label: string;
//   files: FileProps[];
//   setFiles: (files: FileProps[]) => void;
//   className?: string;
//   uploadPreset: string;
//   cloudName: string;
// };

// export default function MultipleFileUpload({
//   label,
//   files,
//   setFiles,
//   className = "col-span-full",
//   uploadPreset,
//   cloudName,
// }: MultipleFileUploadProps) {
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   function handleFileRemove(index: number) {
//     setFiles(files.filter((_, i) => i !== index));
//   }

//   async function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
//     const selectedFiles = event.target.files;
//     if (!selectedFiles) return;

//     const uploadedFiles: FileProps[] = [];

//     for (let i = 0; i < selectedFiles.length; i++) {
//       const file = selectedFiles[i];

//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("upload_preset", uploadPreset);

//       try {
//         const response = await fetch(
//           `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
//           { method: "POST", body: formData }
//         );
//         const data = await response.json();

//         if (data.secure_url) {
//           uploadedFiles.push({
//             url: data.secure_url,
//             title: file.name,
//             size: file.size,
//           });
//         }
//       } catch (error) {
//         console.error("Cloudinary upload error:", error);
//         toast.error(`Dosya yüklenemedi: ${file.name}`);
//       }
//     }

//     setFiles([...files, ...uploadedFiles]);
//     toast.success("Dosyalar başarıyla yüklendi!");
//   }

//   return (
//     <div className={className}>
//       <div className="flex justify-between items-center mb-4">
//         <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-50 mb-2">
//           {label}
//         </label>
//         {files.length > 0 && (
//           <button
//             type="button"
//             onClick={() => fileInputRef.current?.click()}
//             className="flex space-x-2 bg-slate-900 rounded-md shadow text-slate-50 py-2 px-4"
//           >
//             <Pencil className="w-5 h-5" />
//             <span>Dosyaları Değiştir</span>
//           </button>
//         )}
//       </div>

//       {files.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {files.map((file, i) => (
//             <div key={i} className="relative mb-6">
//               <button
//                 type="button"
//                 onClick={() => handleFileRemove(i)}
//                 className="absolute -top-4 -right-2 bg-slate-100 text-red-600 rounded-full"
//               >
//                 <XCircle className="w-6 h-6" />
//               </button>
//               <div className="py-2 rounded-md px-6 bg-white dark:bg-slate-800 text-slate-800 flex items-center dark:text-slate-200 border border-slate-200">
//                 <File className="w-6 h-6 flex-shrink-0 mr-2" />
//                 <div className="flex flex-col">
//                   <span className="line-clamp-1">{file.title}</span>
//                   {file.size > 0 && (
//                     <span className="text-xs">{(file.size / 1000).toFixed(2)} kb</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div
//           className="border-2 border-dashed border-slate-300 rounded-md p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
//           onClick={() => fileInputRef.current?.click()}
//         >
//           Dosyaları yüklemek için tıklayın veya sürükleyip bırakın
//         </div>
//       )}

//       <input
//         type="file"
//         multiple
//         ref={fileInputRef}
//         onChange={handleFilesSelected}
//         className="hidden"
//       />
//     </div>
//   );
// }







import React, { useRef } from "react";
import { File, Pencil, XCircle, Download } from "lucide-react";
import toast from "react-hot-toast";

export type FileProps = {
  title: string;
  size: number;
  url: string;
};

type MultipleFileUploadProps = {
  label: string;
  files: FileProps[];
  setFiles: (files: FileProps[]) => void;
  className?: string;
};

export default function MultipleFileUpload({
  label,
  files,
  setFiles,
  className = "col-span-full",
}: MultipleFileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!;

  function handleFileRemove(index: number) {
    setFiles(files.filter((_, i) => i !== index));
  }

  async function handleFilesSelected(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "Upload failed");
        }

        return {
          url: data.secure_url,
          title: file.name,
          size: file.size,
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      setFiles([...files, ...uploadedFiles]);
      toast.success("Files uploaded successfully!");
    } catch (error: any) {
      console.error("Cloudinary error:", error);
      toast.error(error.message || "Upload failed");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-gray-900 dark:text-slate-50 mb-2">
          {label}
        </label>

        {files.length > 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex space-x-2 bg-slate-900 rounded-md shadow text-white py-2 px-4"
          >
            <Pencil className="w-5 h-5" />
            <span>Change Files</span>
          </button>
        )}
      </div>

      {files.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {files.map((file, i) => (
            <div key={i} className="relative mb-6">
              <button
                type="button"
                onClick={() => handleFileRemove(i)}
                className="absolute -top-4 -right-2 bg-white text-red-600 rounded-full"
              >
                <XCircle className="w-6 h-6" />
              </button>

              {/* DOWNLOADABLE CARD */}
              <a
                href={file.url}
                download={file.title}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 overflow-hidden rounded-md px-6 bg-white dark:bg-slate-800 flex items-center justify-between border border-slate-200 hover:bg-slate-50 transition"
              >
                <div className="flex items-center">
                  <File className="w-6 h-6 flex-shrink-0 mr-2" />
                  <div className="flex flex-col">
                    <span className="truncate">{file.title}</span>
                    <span className="text-xs">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                </div>

                <Download className="w-5 h-5 opacity-70" />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-slate-300 rounded-md p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
          onClick={() => fileInputRef.current?.click()}
        >
          Click or drag and drop files here to upload
        </div>
      )}

      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFilesSelected}
        className="hidden"
      />
    </div>
  );
}
