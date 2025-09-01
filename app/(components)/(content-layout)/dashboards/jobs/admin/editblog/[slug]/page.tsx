"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";
import { use } from "react"; // Import use hook to unwrap params

const UpdateBlog = ({ params }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // Unwrap the params object using React.use()
  const resolvedParams = use(params); 
  const slug = resolvedParams?.slug;  // Now you can safely access slug

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/blog/${slug}`
    );
    const data = await res.json();

    setTitle(data?.title);
    setDescription(data?.description);
    setImage(data?.image);
    setImagePreview(data?.image);
  };

  const handleUploadSuccess = (result) => {
    const secureUrl = result?.info?.secure_url;
    if (secureUrl) {
      setImage(secureUrl);
      setImagePreview(secureUrl);
      toast.success("Image uploaded successfully!");
    } else {
      toast.error("Failed to retrieve image URL.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/blog/${slug}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          image,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.err || "An error occurred.");
    } else {
      toast.success("Blog updated successfully!");
      router.push("/dashboards/jobs/admin/blogs");
    }
  };

  return (
    <div className="mx-auto mt-10 mb-5 max-w-xl rounded-xl bg-white p-6 shadow-md">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Update Blog
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Description
          </label>
          <textarea
            rows="5"
            placeholder="Enter blog description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Image Upload via Cloudinary Widget */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Image
          </label>
          <CldUploadWidget
            cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
            onSuccess={handleUploadSuccess}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700"
              >
                Upload Image
              </button>
            )}
          </CldUploadWidget>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4 flex justify-center">
              <img
                src={imagePreview}
                alt="Image Preview"
                className="max-h-48 rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateBlog;
