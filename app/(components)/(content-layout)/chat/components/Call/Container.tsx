import { useChatStore } from "@/app/chat-store/useChatSotre";
import { useSession } from "@/app/SessionProvider";
import React, { useState } from "react";
import Image from "next/image";
import { MdOutlineCallEnd } from "react-icons/md";

interface ContainerProps {
  data: any;
}

function Container({ data }: ContainerProps) {
  const { user } = useSession();
  const socket = useChatStore((state) => state.socket);
  const endCallStore = useChatStore((state) => state.endCall);
  const [callAccepted, setCallAccepted] = useState(false);

  if (!data) return null;

  const endCall = () => {
    const id = data.id;

    if (data.callType === "voice") {
      socket?.emit("reject-voice-call", { from: id });
    } else if (data.callType === "video") {
      socket?.emit("reject-video-call", { from: id });
    }

    // Her iki durumda da store'daki call state'i temizle
    endCallStore();
    setCallAccepted(false);
  };


  

  return (
    <div className="border-colors-conversation-border border-l w-full bg-colors-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl">{data.displayName}</span>
        <span className="text-lg">
          {callAccepted && data.callType !== "video"
            ? "On going on call"
            : "Calling"}
        </span>
      </div>

      {(!callAccepted || data.callType === "voice") && (
        <div className="my-24">
          <Image
            src={data.avatarUrl || "/default-avatar.png"}
            alt="avatar"
            height={300}
            width={300}
            className="rounded-full"
          />
        </div>
      )}

      <div className="my-8 flex justify-center w-full">
        <button
          onClick={endCall}
          className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full hover:bg-red-700 transition"
        >
          <MdOutlineCallEnd className="text-3xl text-white" />
        </button>
      </div>
    </div>
  );
}

export default Container;
