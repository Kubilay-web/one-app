"use client";

import { useEffect, useState } from "react";
import { getFriendsPageInfos } from "../../functions/user";
import Card from "./Card";
import {
  FaUserFriends,
  FaRegHeart,
  FaUsers,
  FaBell,
} from "react-icons/fa";
import { useSession } from "@/app/SessionProvider";

export default function Friends() {
  const { user } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getFriendsPageInfos(user.token);
      if (response.status === "ok") {
        setData(response.data);
      } else {
        setError(response.data);
      }
    } catch (err) {
      setError("Something went wrong while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      icon: <FaUserFriends className="w-5 h-5" />,
      label: "Home",
      active: true,
    },
    {
      icon: <FaUsers className="w-5 h-5" />,
      label: "Friend Requests",
    },
    {
      icon: <FaBell className="w-5 h-5" />,
      label: "Sent Requests",
    },
    {
      icon: <FaUsers className="w-5 h-5" />,
      label: "Suggestions",
    },
    {
      icon: <FaUserFriends className="w-5 h-5" />,
      label: "All Friends",
    },
    {
      icon: <FaBell className="w-5 h-5" />,
      label: "Birthdays",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-gray-50">
      {/* Sol Menü */}
      <aside className="w-full md:w-1/4 border-r border-gray-200 bg-white shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Friends</h3>
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <FaRegHeart className="text-gray-600 w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition ${
                item.active
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    item.active ? "bg-white text-blue-600" : "bg-gray-200"
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <i className="right_icon text-gray-400 text-xs"></i>
            </div>
          ))}
        </nav>
      </aside>

      {/* Sağ içerik */}
      <main className="flex-1 p-6 space-y-8">
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg">
            Error: {error}
          </div>
        )}

        {/* Friend Requests */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Friend Requests
            </h3>
            <a className="text-blue-600 text-sm hover:underline cursor-pointer">
              See all
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.requests?.map((user) => (
              <Card user={user} key={user.id} type="request" />
            ))}
          </div>
        </section>

        {/* Sent Requests */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Sent Requests
            </h3>
            <a className="text-blue-600 text-sm hover:underline cursor-pointer">
              See all
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.sentRequests?.map((user) => (
              <Card user={user} key={user.id} type="sent" />
            ))}
          </div>
        </section>

        {/* Friends */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Friends</h3>
            <a className="text-blue-600 text-sm hover:underline cursor-pointer">
              See all
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.friends?.map((user) => (
              <Card user={user} key={user.id} type="friends" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
