"use client";

import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { useSession } from "@/app/SessionProvider";
import { useChatStore } from "@/app/chat-store/useChatSotre";
import EmojiPicker from "emoji-picker-react";
import CaptureAudio from "../common/CaptureAudio";

function MessageBar() {
  const { user } = useSession();
  const activeChat = useChatStore((state) => state.activeChat);
  const socket = useChatStore((state) => state.socket);
  const addMessage = useChatStore((state) => state.addMessage);

  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(e.target as Node)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleEmojiModal = () => setShowEmojiPicker(!showEmojiPicker);

  const handleEmojiClick = (emoji: { emoji: string }) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const sendMessage = async () => {
    if (!message.trim() && !file) return;
    if (!activeChat) return;

    try {
      const formData = new FormData();
      formData.append("from", user.id);
      formData.append("to", activeChat.id);
      formData.append("message", message);
      if (file) formData.append("file", file);

      formData.append(
        "type",
        [
          message.trim() ? "text" : null,
          file
            ? file.type.startsWith("video")
              ? "video"
              : file.type.startsWith("audio")
              ? "audio"
              : "image"
            : null,
        ]
          .filter(Boolean)
          .join(",")
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/messages/add`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        const newMsg = {
          id: crypto.randomUUID(),
          senderId: user.id,
          message: message || filePreview,
          type: [
            message.trim() ? "text" : null,
            file
              ? file.type.startsWith("video")
                ? "video"
                : file.type.startsWith("audio")
                ? "audio"
                : "image"
              : null,
          ]
            .filter(Boolean)
            .join(","),
          createdAt: new Date().toISOString(),
          messageStatus: "sent",
          fileUrl: file ? filePreview : null,
        };

        addMessage(newMsg);

        if (socket) {
          socket.emit("send-message", {
            from: user.id,
            to: activeChat.id,
            message: newMsg.message,
            type: newMsg.type,
          });
        }

        setMessage("");
        setFile(null);
        setFilePreview(null);
      } else {
        console.error("Failed to send message:", data.error || data.message);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div
      className="bg-colors-panel-header-background h-auto px-4 py-3 flex flex-col gap-2 relative rounded-t-lg"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {dragOver && (
        <div className="absolute inset-0 bg-white/30 flex justify-center items-center text-gray-700 font-bold text-lg z-50 rounded-t-lg">
          Drop your file here
        </div>
      )}

      {filePreview && (
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {file?.type.startsWith("video") ? (
            <video src={filePreview} className="h-24 rounded" controls />
          ) : file?.type.startsWith("audio") ? (
            <audio src={filePreview} className="w-48" controls />
          ) : (
            <img src={filePreview} className="h-24 rounded" />
          )}
          <button
            onClick={() => {
              setFile(null);
              setFilePreview(null);
            }}
            className="text-red-500 font-bold"
          >
            X
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 w-full">
        <div className="flex gap-3 relative">
          <BsEmojiSmile
            className="text-colors-panel-header-icon cursor-pointer text-2xl"
            id="emoji-open"
            onClick={handleEmojiModal}
          />
          {showEmojiPicker && (
            <div
              className="absolute bottom-24 left-0 z-40"
              ref={emojiPickerRef}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
            </div>
          )}
          <label>
            <ImAttachment className="text-colors-panel-header-icon cursor-pointer text-2xl" />
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                e.target.files && handleFileChange(e.target.files[0])
              }
            />
          </label>
        </div>

        <CaptureAudio
          onAudioCapture={(audioFile) => {
            setFile(audioFile);
            setFilePreview(URL.createObjectURL(audioFile));
          }}
        />

        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-colors-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-4 py-2 w-full border-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <MdSend
          onClick={sendMessage}
          className="text-colors-panel-header-icon cursor-pointer text-3xl"
        />
      </div>
    </div>
  );
}

export default MessageBar;
