// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import Link from "next/link";
// import dynamic from "next/dynamic";
// import { FaImages } from "react-icons/fa6";
// import axios from "axios";
// import toast from "react-hot-toast";
// import Gallery from "@/app/projects/components/newsportal/Gallery";

// // FIX: JoditEditor SSR disable
// const JoditEditor = dynamic(() => import("jodit-react"), {
//   ssr: false,
// });

// const EditNews = () => {
//   const { id: news_id } = useParams(); // App Router params
//   const router = useRouter();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [oldImage, setOldImage] = useState("");
//   const [newImage, setNewImage] = useState<File | null>(null);
//   const [preview, setPreview] = useState("");
//   const [loading, setLoading] = useState(false);

//   const editor = useRef(null);

//   const [showGallery, setShowGallery] = useState(false);
//   const [images, setImages] = useState([]);
//   const [imagesLoading, setImagesLoading] = useState(false);

//   // 📦 Handle image file selection
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setNewImage(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     if (newImage) {
//       formData.append("new_image", newImage);
//     }
//     formData.append("old_image", oldImage);

//     try {
//       setLoading(true);
//       const { data } = await axios.put(`/api/news/edit/${news_id}`, formData);
//       toast.success(data.message);
//       router.push("/dashboards/newsportal/news");
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔄 Get initial data
//   const fetchNews = async () => {
//     try {
//       const { data } = await axios.get(`/api/news/edit/${news_id}`);
//       setTitle(data.news.title);
//       setDescription(data.news.description);
//       setOldImage(data.news.image);
//       setPreview(data.news.image);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchImages = async () => {
//     try {
//       const { data } = await axios.get(`/api/news/images`);
//       setImages(data.images || []);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const uploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files?.length) return;

//     const formData = new FormData();
//     Array.from(files).forEach((file) => formData.append("images", file));

//     try {
//       setImagesLoading(true);
//       const { data } = await axios.post(`/api/news/images`, formData);
//       setImages((prev = []) => [...prev, ...data.images]); // 🛡️ prev varsa kullan, yoksa []
//       toast.success(data.message);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setImagesLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (news_id) {
//       fetchNews();
//       fetchImages();
//     }
//   }, [news_id]);

//   return (
//     <div className="rounded-md bg-white p-6 shadow-md">
//       <div className="mb-6 flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-gray-700">Edit News</h2>
//         <Link
//           className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-800"
//           href="/dashboards/newsportal/news"
//         >
//           View All
//         </Link>
//       </div>

//       <form onSubmit={handleUpdate}>
//         {/* Title */}
//         <div>
//           <label className="text-md mb-2 block font-medium text-gray-600">
//             Title
//           </label>
//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             type="text"
//             placeholder="Enter News Title"
//             className="h-10 w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
//             required
//           />
//         </div>

//         {/* Image Upload */}
//         <div>
//           <label
//             htmlFor="img"
//             className="mt-4 flex h-[240px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-500 text-gray-500 hover:border-blue-500"
//           >
//             {preview ? (
//               <img
//                 src={preview}
//                 className="h-full w-full object-cover"
//                 alt="preview"
//               />
//             ) : (
//               <div className="flex flex-col items-center justify-center gap-y-2">
//                 <FaImages className="mb-2 text-4xl" />
//                 <span className="font-medium">Select Image</span>
//               </div>
//             )}
//           </label>
//           <input
//             type="file"
//             id="img"
//             className="hidden"
//             onChange={handleImageChange}
//           />
//         </div>

//         {/* Description */}
//         <div className="mt-4">
//           <div className="mb-2 flex items-center justify-between">
//             <label className="text-md font-medium text-gray-600">
//               Description
//             </label>
//             <div
//               onClick={() => setShowGallery(true)}
//               className="cursor-pointer text-blue-500 hover:text-blue-800"
//             >
//               <FaImages className="text-2xl" />
//             </div>
//           </div>
//           <JoditEditor
//             ref={editor}
//             value={description}
//             tabIndex={1}
//             onBlur={(value) => setDescription(value)}
//             onChange={() => {}}
//           />
//         </div>

//         {/* Submit */}
//         <div className="mt-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-800"
//           >
//             {loading ? "Updating..." : "Update News"}
//           </button>
//         </div>
//       </form>

//       {/* Gallery Modal */}
//       {showGallery && <Gallery setShow={setShowGallery} images={images} />}
//       <input
//         type="file"
//         multiple
//         id="images"
//         className="hidden"
//         onChange={uploadImages}
//       />
//     </div>
//   );
// };

// export default EditNews;












// app/dashboards/newsportal/editnews/[id]/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaImages, FaTrash } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";
import Gallery from "@/app/projects/components/newsportal/Gallery";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

const EditNews = () => {
  const { id: news_id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [oldImagePublicId, setOldImagePublicId] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const editor = useRef(null);
  const [showGallery, setShowGallery] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);

  // Kategorileri getir
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const { data } = await axios.get("/api/news/category");
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
      toast.error("Kategoriler yüklenemedi");
    } finally {
      setLoadingCategories(false);
    }
  };

  // Haber detaylarını getir
  const fetchNews = async () => {
    try {
      const { data } = await axios.get(`/api/news/edit/${news_id}`);
      setTitle(data.news.title);
      setDescription(data.news.description);
      setCategory(data.news.category || "");
      setOldImageUrl(data.news.image);
      setOldImagePublicId(data.news.imagePublicId || "");
      setPreview(data.news.image);
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 403) {
        toast.error("You don't have permission to edit this news");
        router.push("/dashboards/newsportal/news");
      } else if (error?.response?.status === 404) {
        toast.error("News not found");
        router.push("/dashboards/newsportal/news");
      }
    }
  };

  const fetchImages = async () => {
    try {
      const { data } = await axios.get(`/api/news/images`);
      setImages(data.images || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (newImage) {
      formData.append("new_image", newImage);
    }
    formData.append("old_image_url", oldImageUrl);
    formData.append("old_image_public_id", oldImagePublicId);

    try {
      setLoading(true);
      setUploadProgress(0);
      
      const { data } = await axios.put(`/api/news/edit/${news_id}`, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });
      
      toast.success(data.message);
      router.push("/dashboards/newsportal/news");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const uploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));

    try {
      setImagesLoading(true);
      const { data } = await axios.post(`/api/news/images`, formData);
      setImages((prev = []) => [...prev, ...data.images]);
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
    } finally {
      setImagesLoading(false);
    }
  };

  const deleteGalleryImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    try {
      await axios.delete(`/api/news/images/${imageId}`);
      setImages((prev) => prev.filter((img: any) => img.id !== imageId));
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  useEffect(() => {
    if (news_id) {
      fetchNews();
      fetchCategories();
      fetchImages();
    }
  }, [news_id]);

  return (
    <div className="rounded-md bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-700">Edit News</h2>
        <Link
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-800 transition"
          href="/dashboards/newsportal/news"
        >
          View All
        </Link>
      </div>

      <form onSubmit={handleUpdate}>
        {/* Title */}
        <div className="mb-4">
          <label className="text-md mb-2 block font-medium text-gray-600">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Enter News Title"
            className="h-10 w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="text-md mb-2 block font-medium text-gray-600">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            disabled={loadingCategories}
            className="h-10 w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {loadingCategories ? "Loading categories..." : "--- Select Category ---"}
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="text-md mb-2 block font-medium text-gray-600">
            Featured Image
          </label>
          <label
            htmlFor="img"
            className="flex h-[240px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-500 text-gray-500 transition hover:border-blue-500 hover:bg-blue-50"
          >
            {preview ? (
              <div className="relative h-full w-full">
                <img
                  src={preview}
                  className="h-full w-full object-cover rounded-lg"
                  alt="preview"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setPreview("");
                    setNewImage(null);
                  }}
                  className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-700"
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-y-2">
                <FaImages className="mb-2 text-4xl" />
                <span className="font-medium">Click to select image</span>
                <span className="text-xs text-gray-400">Max 5MB</span>
              </div>
            )}
          </label>
          <input
            type="file"
            id="img"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-md font-medium text-gray-600">
              Description
            </label>
            <button
              type="button"
              onClick={() => setShowGallery(true)}
              className="flex items-center gap-2 cursor-pointer text-blue-500 hover:text-blue-800"
            >
              <FaImages className="text-2xl" />
              <span className="text-sm">Gallery</span>
            </button>
          </div>
          <JoditEditor
            ref={editor}
            value={description}
            tabIndex={1}
            onBlur={(value) => setDescription(value)}
            onChange={() => {}}
            className="w-full rounded-md border border-gray-300"
          />
        </div>

        {/* Upload Progress */}
        {loading && uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-4">
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
          </div>
        )}

        {/* Submit */}
        <div className="mt-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-500 px-6 py-2 text-white transition hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update News"}
          </button>
        </div>
      </form>

      {/* Gallery Modal */}
      {showGallery && (
        <Gallery 
          setShow={setShowGallery} 
          images={images} 
          onDelete={deleteGalleryImage}
        />
      )}
      
      <input
        type="file"
        multiple
        id="images"
        className="hidden"
        accept="image/*"
        onChange={uploadImages}
      />
    </div>
  );
};

export default EditNews;