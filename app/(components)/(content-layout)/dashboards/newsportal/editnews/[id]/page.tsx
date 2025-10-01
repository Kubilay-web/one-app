"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import JoditEditor from "jodit-react";
import { FaImages } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";
import Gallery from "@/app/projects/components/newsportal/Gallery";

const EditNews = () => {
  const { id: news_id } = useParams(); // App Router params
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [oldImage, setOldImage] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const editor = useRef(null);

  const [showGallery, setShowGallery] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);

  // 📦 Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (newImage) {
      formData.append("new_image", newImage);
    }
    formData.append("old_image", oldImage);

    try {
      setLoading(true);
      const { data } = await axios.put(`/api/news/edit/${news_id}`, formData);
      toast.success(data.message);
      router.push("/dashboard/newsportal/news");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Get initial data
  const fetchNews = async () => {
    try {
      const { data } = await axios.get(`/api/news/edit/${news_id}`);
      setTitle(data.news.title);
      setDescription(data.news.description);
      setOldImage(data.news.image);
      setPreview(data.news.image);
    } catch (error) {
      console.error(error);
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

  const uploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));

    try {
      setImagesLoading(true);
      const { data } = await axios.post(`/api/news/images`, formData);
      setImages((prev = []) => [...prev, ...data.images]); // 🛡️ prev varsa kullan, yoksa []
      toast.success(data.message);
    } catch (error) {
      console.error(error);
    } finally {
      setImagesLoading(false);
    }
  };

  useEffect(() => {
    if (news_id) {
      fetchNews();
      fetchImages();
    }
  }, [news_id]);

  return (
    <div className="rounded-md bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-700">Edit News</h2>
        <Link
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-800"
          href="/dashboards/newsportal/news"
        >
          View All
        </Link>
      </div>

      <form onSubmit={handleUpdate}>
        {/* Title */}
        <div>
          <label className="text-md mb-2 block font-medium text-gray-600">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Enter News Title"
            className="h-10 w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label
            htmlFor="img"
            className="mt-4 flex h-[240px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-500 text-gray-500 hover:border-blue-500"
          >
            {preview ? (
              <img
                src={preview}
                className="h-full w-full object-cover"
                alt="preview"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-y-2">
                <FaImages className="mb-2 text-4xl" />
                <span className="font-medium">Select Image</span>
              </div>
            )}
          </label>
          <input
            type="file"
            id="img"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Description */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-md font-medium text-gray-600">
              Description
            </label>
            <div
              onClick={() => setShowGallery(true)}
              className="cursor-pointer text-blue-500 hover:text-blue-800"
            >
              <FaImages className="text-2xl" />
            </div>
          </div>
          <JoditEditor
            ref={editor}
            value={description}
            tabIndex={1}
            onBlur={(value) => setDescription(value)}
            onChange={() => {}}
          />
        </div>

        {/* Submit */}
        <div className="mt-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-800"
          >
            {loading ? "Updating..." : "Update News"}
          </button>
        </div>
      </form>

      {/* Gallery Modal */}
      {showGallery && <Gallery setShow={setShowGallery} images={images} />}
      <input
        type="file"
        multiple
        id="images"
        className="hidden"
        onChange={uploadImages}
      />
    </div>
  );
};

export default EditNews;
