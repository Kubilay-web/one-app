// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { FaEye } from "react-icons/fa";
// import axios from "axios";
// import Image from "next/image";
// import "./style.css"; // normal css import

// const Adminindex = () => {
//   const [news, setNews] = useState([]);
//   const [start, setStart] = useState({
//     totalNews: 0,
//     pendingNews: 0,
//     activeNews: 0,
//     deactiveNews: 0,
//     totalWriters: 0,
//   });

//   useEffect(() => {
//     const get_news = async () => {
//       try {
//         const { data } = await axios.get(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/api/news`,
//         );
//         setNews(data.news);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     const fetchStars = async () => {
//       try {
//         const { data } = await axios.get(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/statistics`,
//         );
//         setStart(data);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     get_news();
//     fetchStars();
//   }, []);

//   return (
//     <div className="news-container">
//       <div className="stats-row">
//         {[
//           { title: "Total News", value: start.totalNews },
//           { title: "Pending News", value: start.pendingNews },
//           { title: "Active News", value: start.activeNews },
//           { title: "Deactive News", value: start.deactiveNews },
//           { title: "Writers", value: start.totalWriters },
//         ].map((start, i) => (
//           <div key={i} className="stat-card">
//             <span className="stat-value">{start.value}</span>
//             <span className="stat-title">{start.title}</span>
//           </div>
//         ))}
//       </div>

//       <div className="recent-news">
//         <div className="recent-news-header">
//           <h2>Recent News</h2>
//           <Link href="/news">View All</Link>
//         </div>

//         <table className="news-table">
//           <thead>
//             <tr>
//               <th>No</th>
//               <th>Title</th>
//               <th>Image</th>
//               <th>Category</th>
//               <th>Date</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           {/* <tbody>
//             {news.slice(0, 5).map((n, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{n.title.slice(0, 15)}...</td>
//                 <td>
//                   <Image src={n.image} alt="news" width={40} height={40} />
//                 </td>
//                 <td>{n.category}</td>
//                 <td>{n.date}</td>
//                 <td>
//                   {n.status === "pending" && <span className="status-pending">{n.status}</span>}
//                   {n.status === "active" && <span className="status-active">{n.status}</span>}
//                   {n.status === "deactive" && <span className="status-deactive">{n.status}</span>}
//                 </td>
//                 <td>
//                   <Link href="#" className="action-button">
//                     <FaEye />
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody> */}

//           <tbody>
//             {news.map(
//               (
//                 n,
//                 index, // slice(0,5) kaldır
//               ) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>{n.title.slice(0, 15)}...</td>
//                   <td>
//                     <Image src={n.image} alt="news" width={40} height={40} />
//                   </td>
//                   <td>{n.category}</td>
//                   <td>{n.date}</td>
//                   <td>
//                     {n.status === "pending" && (
//                       <span className="status-pending">{n.status}</span>
//                     )}
//                     {n.status === "active" && (
//                       <span className="status-active">{n.status}</span>
//                     )}
//                     {n.status === "deactive" && (
//                       <span className="status-deactive">{n.status}</span>
//                     )}
//                   </td>
//                   <td>
//                     <Link href="#" className="action-button">
//                       <FaEye />
//                     </Link>
//                   </td>
//                 </tr>
//               ),
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Adminindex;










// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { FaEye } from "react-icons/fa";
// import axios from "axios";
// import Image from "next/image";
// import "./style.css";

// const Adminindex = () => {
//   const [news, setNews] = useState([]);
//   const [start, setStart] = useState({
//     totalNews: 0,
//     pendingNews: 0,
//     activeNews: 0,
//     deactiveNews: 0,
//     totalWriters: 0,
//   });

//   // ✅ Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const newsPerPage = 5;

//   useEffect(() => {
//     const get_news = async () => {
//       try {
//         const { data } = await axios.get(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/api/news`
//         );
//         setNews(data.news);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     const fetchStars = async () => {
//       try {
//         const { data } = await axios.get(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/statistics`
//         );
//         setStart(data);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     get_news();
//     fetchStars();
//   }, []);

//   // ✅ Pagination logic
//   const indexOfLast = currentPage * newsPerPage;
//   const indexOfFirst = indexOfLast - newsPerPage;
//   const currentNews = news.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(news.length / newsPerPage);

//   return (
//     <div className="news-container p-4">
//       {/* ✅ Stats */}
//       <div className="stats-row grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
//         {[
//           { title: "Total News", value: start.totalNews },
//           { title: "Pending News", value: start.pendingNews },
//           { title: "Active News", value: start.activeNews },
//           { title: "Deactive News", value: start.deactiveNews },
//           { title: "Writers", value: start.totalWriters },
//         ].map((item, i) => (
//           <div
//             key={i}
//             className="stat-card bg-white p-4 rounded-lg text-center shadow-sm"
//           >
//             <span className="block text-xl font-bold">{item.value}</span>
//             <span className="text-xs text-gray-500">{item.title}</span>
//           </div>
//         ))}
//       </div>

//       {/* ✅ Table */}
//       <div className="recent-news">
//         <div className="recent-news-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
//           <h2 className="text-lg font-semibold">Recent News</h2>
//           <Link href="/news" className="text-blue-600 text-sm">
//             View All
//           </Link>
//         </div>

//         {/* ✅ Responsive table */}
//         <div className="w-full overflow-x-auto rounded-lg border">
//           <table className="min-w-[700px] w-full text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 text-left">No</th>
//                 <th className="p-2 text-left">Title</th>
//                 <th className="p-2 text-left">Image</th>
//                 <th className="p-2 text-left">Category</th>
//                 <th className="p-2 text-left">Date</th>
//                 <th className="p-2 text-left">Status</th>
//                 <th className="p-2 text-left">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {currentNews.map((n, index) => (
//                 <tr key={index} className="border-b hover:bg-gray-50">
//                   <td className="p-2">
//                     {indexOfFirst + index + 1}
//                   </td>

//                   <td className="p-2 max-w-[140px] truncate">
//                     {n.title}
//                   </td>

//                   <td className="p-2">
//                     <Image
//                       src={n.image}
//                       alt="news"
//                       width={40}
//                       height={40}
//                       className="rounded object-cover"
//                     />
//                   </td>

//                   <td className="p-2 whitespace-nowrap">
//                     {n.category}
//                   </td>

//                   <td className="p-2 whitespace-nowrap">
//                     {n.date}
//                   </td>

//                   <td className="p-2">
//                     {n.status === "pending" && (
//                       <span className="text-yellow-600 text-xs font-medium">
//                         {n.status}
//                       </span>
//                     )}
//                     {n.status === "active" && (
//                       <span className="text-green-600 text-xs font-medium">
//                         {n.status}
//                       </span>
//                     )}
//                     {n.status === "deactive" && (
//                       <span className="text-red-600 text-xs font-medium">
//                         {n.status}
//                       </span>
//                     )}
//                   </td>

//                   <td className="p-2">
//                     <Link
//                       href="#"
//                       className="text-gray-600 hover:text-blue-600"
//                     >
//                       <FaEye />
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* ✅ Pagination (Responsive Tailwind) */}
//         <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//             className="px-3 py-1 text-xs sm:text-sm rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50"
//           >
//             Prev
//           </button>

//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`px-3 py-1 text-xs sm:text-sm rounded-md border transition
//                 ${
//                   currentPage === i + 1
//                     ? "bg-blue-600 text-white border-blue-600"
//                     : "bg-white hover:bg-gray-100"
//                 }`}
//             >
//               {i + 1}
//             </button>
//           ))}

//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className="px-3 py-1 text-xs sm:text-sm rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Adminindex;







"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import Image from "next/image";
import "./style.css";

const Adminindex = () => {
  const [news, setNews] = useState([]);
  const [start, setStart] = useState({
    totalNews: 0,
    pendingNews: 0,
    activeNews: 0,
    deactiveNews: 0,
    totalWriters: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 5;

  useEffect(() => {
    const get_news = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/news`
        );
        setNews(data.news);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchStars = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/statistics`
        );
        setStart(data);
      } catch (error) {
        console.log(error);
      }
    };

    get_news();
    fetchStars();
  }, []);

  const indexOfLast = currentPage * newsPerPage;
  const indexOfFirst = indexOfLast - newsPerPage;
  const currentNews = news.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(news.length / newsPerPage);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">

      {/* ✅ STATS */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { title: "Total News", value: start.totalNews },
          { title: "Pending News", value: start.pendingNews },
          { title: "Active News", value: start.activeNews },
          { title: "Deactive News", value: start.deactiveNews },
          { title: "Writers", value: start.totalWriters },
        ].map((item, i) => (
          <div
            key={i}
            className="flex-1 min-w-[140px] bg-white p-4 rounded-xl text-center shadow-sm border"
          >
            <span className="block text-xl sm:text-2xl font-bold">
              {item.value}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">
              {item.title}
            </span>
          </div>
        ))}
      </div>

      {/* ✅ HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-base sm:text-lg font-semibold">
          Recent News
        </h2>
        <Link href="/news" className="text-blue-600 text-sm">
          View All
        </Link>
      </div>

      {/* ✅ DESKTOP TABLE */}
      <div className="hidden md:block w-full overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">No</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentNews.map((n, index) => (
              <tr key={index} className="border-b bg-gray-50">
                <td className="p-3">{indexOfFirst + index + 1}</td>

                <td className="p-3 max-w-[200px] truncate">
                  {n.title}
                </td>

                <td className="p-3">
                  <Image
                    src={n.image}
                    alt="news"
                    width={40}
                    height={40}
                    className="rounded object-cover"
                  />
                </td>

                <td className="p-3">{n.category}</td>
                <td className="p-3">{n.date}</td>

                <td className="p-3">
                  <span
                    className={`text-xs font-medium ${
                      n.status === "pending"
                        ? "text-yellow-600"
                        : n.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {n.status}
                  </span>
                </td>

                <td className="p-3">
                  <FaEye className="cursor-pointer hover:text-blue-600" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ MOBILE CARD VIEW */}
      <div className="md:hidden flex flex-col gap-4">
        {currentNews.map((n, index) => (
          <div
            key={index}
            className="flex gap-3 bg-white p-3 rounded-lg shadow-sm border"
          >
            <Image
              src={n.image}
              alt="news"
              width={70}
              height={70}
              className="rounded object-cover"
            />

            <div className="flex flex-col flex-1 gap-1">
              <span className="text-xs text-gray-400">
                #{indexOfFirst + index + 1}
              </span>

              <h3 className="text-sm font-semibold line-clamp-2">
                {n.title}
              </h3>

              <span className="text-xs text-gray-500">
                {n.category}
              </span>

              <span className="text-xs text-gray-400">
                {n.date}
              </span>

              <div className="flex items-center justify-between mt-1">
                <span
                  className={`text-xs font-medium ${
                    n.status === "pending"
                      ? "text-yellow-600"
                      : n.status === "active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {n.status}
                </span>

                <FaEye className="text-gray-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ PAGINATION */}
      <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 text-xs sm:text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 text-xs sm:text-sm rounded-md border ${
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
          className="px-3 py-1 text-xs sm:text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Adminindex;