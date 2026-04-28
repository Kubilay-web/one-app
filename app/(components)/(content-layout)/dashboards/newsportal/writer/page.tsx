// import React from "react";
// import Link from "next/link";
// import { FaEye } from "react-icons/fa";
// import Image from "next/image";

// const Writerindex = () => {
//   return (
//     <div className="mt-6 general-writer-container">
//       <div className="grid writer-container grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
//         {[
//           { title: "Writer Total News", value: 50, color: "text-red-500" },
//           { title: "Writer Pending News", value: 55, color: "text-purple-500" },
//           { title: "Writer Active News", value: 22, color: "text-cyan-500" },
//           { title: "Writer Deactive News", value: 15, color: "text-blue-500" },
//         ].map((start, i) => (
//           <div
//             key={i}
//             className="flex flex-col items-center gap-2 rounded-lg bg-white p-8 shadow-md"
//           >
//             <span className={`text-4xl font-bold ${start.color}`}>
//               {start.value}
//             </span>
//             <span className="text-md font-semibold text-gray-600">
//               {start.title}
//             </span>
//           </div>
//         ))}
//       </div>

//       <div className="mt-8 rounded-lg bg-white p-6 shadow-md writer-table">
//         <div className="flex items-center justify-between border-b border-gray-500 pb-4">
//           <h2 className="text-xl font-bold text-gray-600">Recent News</h2>
//           <Link
//             href="/dashboards/newsportal/news"
//             className="font-semibold text-blue-500 transition duration-300 hover:text-blue-800"
//           >
//             View All
//           </Link>
//         </div>

//         <div className="mt-6 overflow-x-auto">
//           <table className="w-full table-auto overflow-hidden rounded-lg bg-white shadow-lg">
//             <thead className="bg-gray-100 text-sm uppercase text-gray-700">
//               <tr>
//                 <th className="px-6 py-4 text-left">No</th>
//                 <th className="px-6 py-4 text-left">Title</th>
//                 <th className="px-6 py-4 text-left">Image</th>
//                 <th className="px-6 py-4 text-left">Category</th>
//                 <th className="px-6 py-4 text-left">Description</th>
//                 <th className="px-6 py-4 text-left">Date</th>
//                 <th className="px-6 py-4 text-left">Status</th>
//                 <th className="px-6 py-4 text-left">Action</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-600">
//               {[1, 2, 3].map((item, index) => (
//                 <tr key={index} className="border-t">
//                   <td className="px-6 py-4">1</td>
//                   <td className="px-6 py-4">News Title</td>
//                   <td className="px-6 py-4">
//                     <Image
//                       className="h-10 w-10 rounded-full object-cover"
//                       src="/assets/news-portal/assets/news.webp"
//                       alt="news"
//                       width={40}
//                       height={40}
//                     />
//                   </td>
//                   <td className="px-6 py-4">Category Name</td>
//                   <td className="px-6 py-4">Description</td>
//                   <td className="px-6 py-4">12-08-2024</td>
//                   <td className="px-6 py-4">
//                     <span className="rounded-full bg-green-200 px-3 py-1 text-xs font-semibold">
//                       Active
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex gap-3 text-gray-500">
//                       <Link
//                         href="#"
//                         className="rounded bg-blue-500 p-2 text-white hover:bg-blue-800"
//                       >
//                         <FaEye />
//                       </Link>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Writerindex;








"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

const Writerindex = () => {
  const [news, setNews] = useState([]);
  const [statistics, setStatistics] = useState({
    totalNews: 0,
    pendingNews: 0,
    activeNews: 0,
    deactiveNews: 0,
  });
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 5;

  // Writer'ın haberlerini getir
  const fetchWriterNews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/news/writer`);
      setNews(data.news || []);
      
      // İstatistikleri hesapla
      const newsArray = data.news || [];
      setStatistics({
        totalNews: newsArray.length,
        pendingNews: newsArray.filter((n: any) => n.status === "pending").length,
        activeNews: newsArray.filter((n: any) => n.status === "active").length,
        deactiveNews: newsArray.filter((n: any) => n.status === "deactive").length,
      });
    } catch (error) {
      console.error("Haberler yüklenirken hata:", error);
      toast.error("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWriterNews();
  }, []);

  // Pagination logic
  const indexOfLast = currentPage * newsPerPage;
  const indexOfFirst = indexOfLast - newsPerPage;
  const currentNews = news.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(news.length / newsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-b-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mt-6 general-writer-container">
      {/* İstatistikler */}
      <div className="grid writer-container grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Writer Total News", value: statistics.totalNews, color: "text-red-500" },
          { title: "Writer Pending News", value: statistics.pendingNews, color: "text-purple-500" },
          { title: "Writer Active News", value: statistics.activeNews, color: "text-cyan-500" },
          { title: "Writer Deactive News", value: statistics.deactiveNews, color: "text-blue-500" },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 rounded-lg bg-white p-8 shadow-md"
          >
            <span className={`text-4xl font-bold ${stat.color}`}>
              {stat.value}
            </span>
            <span className="text-md font-semibold text-gray-600">
              {stat.title}
            </span>
          </div>
        ))}
      </div>

      {/* Haber Tablosu */}
      <div className="mt-8 rounded-lg bg-white p-6 shadow-md writer-table">
        <div className="flex items-center justify-between border-b border-gray-500 pb-4">
          <h2 className="text-xl font-bold text-gray-600">Recent News</h2>
          <Link
            href="/dashboards/newsportal/news"
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
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {currentNews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No news found. Create your first news!
                  </td>
                </tr>
              ) : (
                currentNews.map((item: any, index: number) => (
                  <tr key={item.id || index} className="border-t">
                    <td className="px-6 py-4">{indexOfFirst + index + 1}</td>
                    <td className="px-6 py-4 max-w-[200px] truncate">
                      {item.title}
                    </td>
                    <td className="px-6 py-4">
                      <Image
                        className="h-10 w-10 rounded-full object-cover"
                        src={item.image || "/assets/news-portal/assets/news.webp"}
                        alt="news"
                        width={40}
                        height={40}
                      />
                    </td>
                    <td className="px-6 py-4">{item.category}</td>
                    <td className="px-6 py-4">{item.date}</td>
                    <td className="px-6 py-4">
                      {item.status === "pending" && (
                        <span className="rounded-full bg-yellow-200 px-3 py-1 text-xs font-semibold">
                          Pending
                        </span>
                      )}
                      {item.status === "active" && (
                        <span className="rounded-full bg-green-200 px-3 py-1 text-xs font-semibold">
                          Active
                        </span>
                      )}
                      {item.status === "deactive" && (
                        <span className="rounded-full bg-red-200 px-3 py-1 text-xs font-semibold">
                          Deactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboards/newsportal/editnews/${item.id}`}
                          className="rounded bg-blue-500 p-2 text-white hover:bg-blue-800"
                        >
                          <FaEye />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 text-sm rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-sm rounded-md border transition ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 text-sm rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Writerindex;