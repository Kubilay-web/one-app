"use client"

import React, { useState } from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import ContactsList from "./ContactsList";

function ChatList() {
  const [showContactList, setShowContactList] = useState(false); // State to toggle between views

  // Function to toggle contact list visibility
  const toggleContactList = () => {
    setShowContactList((prev) => !prev); // Toggle the state
  };

  return (
    <div className="bg-colors-panel-header-background h-[100vh] flex flex-col max-h-screen z-20">
      {!showContactList ? (
        <>
          {" "}
          <ChatListHeader  toggleContactList={toggleContactList} />
          <SearchBar />
          <List />
        </>
      ) : (
        <ContactsList toggleContactList={toggleContactList} />
      )}
    </div>
  );
}

export default ChatList;
