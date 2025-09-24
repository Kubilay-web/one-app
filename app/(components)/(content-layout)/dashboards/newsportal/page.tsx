"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import Image from "next/image";
import "./style.css"; // normal css import

const Adminindex = () => {
  const [news, setNews] = useState([]);
  const [start, setStart] = useState({
    totalNews: 0,
    pendingNews: 0,
    activeNews: 0,
    deactiveNews: 0,
    totalWriters: 0,
  });

  useEffect(() => {
    const get_news = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news`);
        setNews(data.news);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchStars = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/statistics`);
        setStart(data);
      } catch (error) {
        console.log(error);
      }
    };

    get_news();
    fetchStars();
  }, []);

  return (
    <div className="news-container">
      <div className="stats-row">
        {[
          { title: "Total News", value: start.totalNews },
          { title: "Pending News", value: start.pendingNews },
          { title: "Active News", value: start.activeNews },
          { title: "Deactive News", value: start.deactiveNews },
          { title: "Writers", value: start.totalWriters },
        ].map((start, i) => (
          <div key={i} className="stat-card">
            <span className="stat-value">{start.value}</span>
            <span className="stat-title">{start.title}</span>
          </div>
        ))}
      </div>

      <div className="recent-news">
        <div className="recent-news-header">
          <h2>Recent News</h2>
          <Link href="/news">View All</Link>
        </div>

        <table className="news-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Title</th>
              <th>Image</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {news.slice(0, 5).map((n, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{n.title.slice(0, 15)}...</td>
                <td>
                  <Image src={n.image} alt="news" width={40} height={40} />
                </td>
                <td>{n.category}</td>
                <td>{n.date}</td>
                <td>
                  {n.status === "pending" && <span className="status-pending">{n.status}</span>}
                  {n.status === "active" && <span className="status-active">{n.status}</span>}
                  {n.status === "deactive" && <span className="status-deactive">{n.status}</span>}
                </td>
                <td>
                  <Link href="#" className="action-button">
                    <FaEye />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Adminindex;
