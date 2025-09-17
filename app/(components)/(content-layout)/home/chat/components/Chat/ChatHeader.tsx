"use client";

import React from "react";
import Avatar from "../common/Avatar";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useChatStore } from "@/app/chat-store/useChatSotre";

function ChatHeader() {
  const activeChat = useChatStore((state) => state.activeChat);

  const setVoiceCall = useChatStore((state) => state.setVoiceCall);
  const setVideoCall = useChatStore((state) => state.setVideoCall);


  const setShowSearchMessages = useChatStore(
    (state) => state.setShowSearchMessages
  );



   const handleVoiceCall = () => {
    if (!activeChat) return;
    setVoiceCall({
      ...activeChat,
      type: "out-going",
      callType: "voice",
      roomId: Date.now(),
    });
  };

  const handleVideoCall = () => {
    if (!activeChat) return;
    setVideoCall({
      ...activeChat,
      type: "out-going",
      callType: "video",
      roomId: Date.now(),
    });
  };


  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-colors-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar type="sm" image={activeChat?.avatarUrl} />
        <div className="flex flex-col">
          <span className="text-primary-strong">{activeChat?.username}</span>
          <span className="text-secondary text-sm">{activeChat?.status}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <MdCall onClick={handleVoiceCall} className="text-colors-panel-header-icon cursor-pointer text-xl" />
        <IoVideocam onClick={handleVideoCall} className="text-colors-panel-header-icon cursor-pointer text-xl" />
        <BiSearchAlt2
          className="text-colors-panel-header-icon cursor-pointer text-xl"
          onClick={() => setShowSearchMessages(true)}
        />
        <BsThreeDotsVertical className="text-colors-panel-header-icon cursor-pointer text-xl" />
      </div>
    </div>
  );
}

export default ChatHeader;
