"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MdOutlineCallEnd } from "react-icons/md";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import { useChatStore } from "@/app/chat-store/useChatSotre";
import { useSession } from "@/app/SessionProvider";

interface ContainerProps {
  data: any;
}

function Container({ data }: ContainerProps) {
  const { user } = useSession();
  const socket = useChatStore((state: { socket: any }) => state.socket);
  const endCallStore = useChatStore((state: { endCall: any }) => state.endCall);

  const [callAccepted, setCallAccepted] = useState(false);
  const [token, setToken] = useState<string>();
  const [zg, setZg] = useState<ZegoExpressEngine>();
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [publishStreamId, setPublishStreamId] = useState<string>();

  if (!data) return null;

  // Çağrı kabul
  useEffect(() => {
    if (data.type === "out going") {
      socket?.on("accept-call", () => setCallAccepted(true));
    } else {
      setTimeout(() => setCallAccepted(true), 1000);
    }
  }, [data, socket]);

  // Token al
  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/zego/token/${user.id}`
        );
        const json = await res.json();

        console.log("json",json)
        if (json.token) setToken(json.token);
        else console.error("Token alınamadı:", json);
      } catch (error) {
        console.error(error);
      }
    };
    getToken();
  }, [user.id]);

  // Çağrıyı başlat
  useEffect(() => {
    if (!token) return;

    const startCall = async () => {
      const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";

      if (!appId || appId <= 0) {
        console.error("Geçersiz Zego AppID");
        return;
      }

      const engine = new ZegoExpressEngine(appId, serverSecret);
      setZg(engine);

      // Odaya giriş
      await engine.loginRoom(
        data.roomId.toString(),
        token,
        { userID: user.id.toString(), userName: user.displayName },
        { userUpdate: true }
      );

      // Local stream
      const local = await engine.createStream({
        camera: {
          audio: true,
          video: data.callType === "video",
        },
      });
      setLocalStream(local);

      // Local videoyu ekle
      const localContainer = document.getElementById("local-audio");
      if (localContainer) {
        const localVideo = document.createElement("video");
        localVideo.id = "video-local-zego";
        localVideo.className = "h-28 w-32";
        localVideo.autoplay = true;
        localVideo.muted = true;
        localVideo.playsInline = true;
        localVideo.srcObject = local;
        localContainer.appendChild(localVideo);
      }

      // Yayınla
      const streamId = "stream-" + Date.now();
      setPublishStreamId(streamId);
      await engine.startPublishingStream(streamId, local);

      // Remote stream eventleri
      engine.on("roomStreamUpdate", async (roomId, updateType, streamList) => {
        const remoteContainer = document.getElementById("remote-video");

        if (updateType === "ADD" && streamList.length && remoteContainer) {
          const remoteVideo = document.createElement("video");
          remoteVideo.id = streamList[0].streamID;
          remoteVideo.autoplay = true;
          remoteVideo.playsInline = true;
          remoteContainer.appendChild(remoteVideo);

          const stream = await engine.startPlayingStream(streamList[0].streamID);
          remoteVideo.srcObject = stream;
        }

        if (updateType === "DELETE" && streamList[0]) {
          engine.stopPlayingStream(streamList[0].streamID);
          engine.logoutRoom(data.roomId.toString());
          endCallStore();
        }
      });
    };

    startCall();
  }, [token, data, user, endCallStore]);

  const endCall = () => {
    if (zg && localStream && publishStreamId) {
      zg.destroyStream(localStream);
      zg.stopPublishingStream(publishStreamId);
      zg.logoutRoom(data.roomId.toString());
    }

    if (data.callType === "voice")
      socket?.emit("reject-voice-call", { from: data.id });
    else if (data.callType === "video")
      socket?.emit("reject-video-call", { from: data.id });

    endCallStore();
    setCallAccepted(false);
  };

  return (
    <div className="border-colors-conversation-border border-l w-full bg-colors-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl">{data.displayName}</span>
        <span className="text-lg">
          {callAccepted && data.callType !== "video" ? "On going call" : "Calling"}
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

      <div className="my-5 relative" id="remote-video">
        <div className="absolute bottom-5 right-5" id="local-audio"></div>
      </div>

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
