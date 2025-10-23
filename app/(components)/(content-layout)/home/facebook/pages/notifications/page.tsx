"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/api/notificationsocial");
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
        Notifications
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No notifications yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`flex items-start gap-4 p-4 sm:p-5 rounded-lg shadow-sm transition-colors duration-200
              ${n.isRead ? "bg-white hover:bg-gray-50" : "bg-blue-50 hover:bg-blue-100"}`}
            >
              {/* Avatar */}
              <img
                src={n.fromUser.avatarUrl || "/default-avatar.png"}
                alt={n.fromUser.username}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
              />

              {/* Message */}
              <div className="flex-1">
                <p className="text-gray-900 text-sm sm:text-base">
                  {n.message}
                </p>
                <span className="text-gray-400 text-xs sm:text-sm mt-1 block">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
