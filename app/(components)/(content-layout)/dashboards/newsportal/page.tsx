"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import Image from "next/image";

const Adminindex = () => {
  const [news, setNews] = useState([]);

  const get_news = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/news`,
      );
      setNews(data.news);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    get_news();
  }, []);

  const [start, setStart] = useState({
    totalNews: 0,
    pendingNews: 0,
    activeNews: 0,
    deactiveNews: 0,
    totalWriters: 0,
  });

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/statistics`,
        );
        setStart(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStars();
  }, []);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        {[
          {
            title: "Total News",
            value: start.totalNews,
            color: "text-red-500",
          },
          {
            title: "Pending News",
            value: start.pendingNews,
            color: "text-purple-500",
          },
          {
            title: "Active News",
            value: start.activeNews,
            color: "text-cyan-500",
          },
          {
            title: "Deactive News",
            value: start.deactiveNews,
            color: "text-blue-500",
          },
          {
            title: "Writers",
            value: start.totalWriters,
            color: "text-green-500",
          },
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
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {news.slice(0, 5).map((n, index) => (
                <tr key={index} className="border-t">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{n.title.slice(0, 15)}...</td>
                  <td className="px-6 py-4">
                    <Image
                      className="h-10 w-10 rounded-full object-cover"
                      src={n.image}
                      alt="news"
                      width={40}
                      height={40}
                    />
                  </td>
                  <td className="px-6 py-4">{n.category}</td>
                  <td className="px-6 py-4">{n.date}</td>
                  <td className="px-6 py-4">
                    {n.status === "pending" && (
                      <span className="rounded-md bg-blue-200 px-2 py-[2px] text-xs text-blue-800">
                        {n.status}
                      </span>
                    )}
                    {n.status === "active" && (
                      <span className="rounded-md bg-green-200 px-2 py-[2px] text-xs text-green-800">
                        {n.status}
                      </span>
                    )}
                    {n.status === "deactive" && (
                      <span className="rounded-md bg-red-200 px-2 py-[2px] text-xs text-red-800">
                        {n.status}
                      </span>
                    )}
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

export default Adminindex;
