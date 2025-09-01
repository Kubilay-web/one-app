"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";

const Home = () => {
  const [blogs, setBlogs] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/blog`,
    );
    const data = await res.json();

    setBlogs(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/blog/${id}`, {
        method: "DELETE",
      });
      fetchBlogs();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        All Blogs
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs &&
          blogs.map((blog) => (
            <div
              key={blog.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition hover:shadow-lg dark:bg-gray-800 dark:ring-gray-700"
            >
              <div className="aspect-[16/10] w-full overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h5 className="mb-2 line-clamp-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {blog.title}
                </h5>
                <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-300">
                  {blog.description.substring(0, 100)}...
                </p>

                <div className="mt-auto flex items-center gap-3">
                  <Link
                    href={`/dashboards/jobs/admin/editblog/${blog.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <FaEdit /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {blogs.length === 0 && (
        <p className="mt-10 text-center text-gray-500 dark:text-gray-400">
          No blogs found.
        </p>
      )}
    </div>
  );
};

export default Home;
