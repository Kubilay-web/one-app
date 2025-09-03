import React from "react";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import Image from "next/image";

const Writerindex = () => {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Writer Total News", value: 50, color: "text-red-500" },
          { title: "Writer Pending News", value: 55, color: "text-purple-500" },
          { title: "Writer Active News", value: 22, color: "text-cyan-500" },
          { title: "Writer Deactive News", value: 15, color: "text-blue-500" },
        ].map((start, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 rounded-lg bg-white p-8 shadow-md"
          >
            <span className={`text-4xl font-bold ${start.color}`}>
              {start.value}
            </span>
            <span className="text-md font-semibold text-gray-600">
              {start.title}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center justify-between border-b border-gray-500 pb-4">
          <h2 className="text-xl font-bold text-gray-600">Recent News</h2>
          <Link
            href="/news"
            className="font-semibold text-blue-500 transition duration-300 hover:text-blue-800"
          >
            View All
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full table-auto overflow-hidden rounded-lg bg-white shadow-lg">
            <thead className="bg-gray-100 text-sm uppercase text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">No</th>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Image</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {[1, 2, 3].map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-6 py-4">1</td>
                  <td className="px-6 py-4">News Title</td>
                  <td className="px-6 py-4">
                    <Image
                      className="h-10 w-10 rounded-full object-cover"
                      src="/assets/news-portal/assets/news.webp"
                      alt="news"
                      width={40}
                      height={40}
                    />
                  </td>
                  <td className="px-6 py-4">Category Name</td>
                  <td className="px-6 py-4">Description</td>
                  <td className="px-6 py-4">12-08-2024</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-200 px-3 py-1 text-xs font-semibold">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3 text-gray-500">
                      <Link
                        href="#"
                        className="rounded bg-blue-500 p-2 text-white hover:bg-blue-800"
                      >
                        <FaEye />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Writerindex;
