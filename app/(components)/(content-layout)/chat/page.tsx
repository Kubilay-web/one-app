import React from "react";
import ChatList from "./components/Chatlist/ChatList";
import Empty from "./components/Empty";

export default function page() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 h-screen w-screen max-h-screen max-w-full bg-white dark:bg-gray-900 over transition-all duration-300">
      {/* ChatList ve Empty bileşenlerini yerleştiriyoruz */}
      <ChatList />
      <Empty />
    </div>
  );
}
