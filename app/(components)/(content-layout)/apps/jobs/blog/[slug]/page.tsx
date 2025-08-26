"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const ViewBlog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/${slug}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch blog");
      }
      const data = await res.json();
      setBlog(data.blog);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading blog...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  if (!blog)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Blog not found</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {blog.image && (
          <div className="relative w-full h-64 md:h-96">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-gray-900 text-center">
            {blog.title}
          </h1>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6">
            {blog.description}
          </p>
          <p className="text-gray-400 text-sm text-right">
            Created at: {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;
