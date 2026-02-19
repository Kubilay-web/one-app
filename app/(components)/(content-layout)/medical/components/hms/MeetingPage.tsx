"use client";

import { useSession } from "@/app/SessionProvider";
import {
  HMSRoomProvider,
  selectIsConnectedToRoom,
  selectPeers,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import React, { useEffect, useState, useRef } from "react";
import { generateAuthToken } from "../../actions/hms";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface MeetingPageProps {
  roomId: string;
}

export default function MeetingPage({ roomId }: MeetingPageProps) {
  return (
    <HMSRoomProvider>
      <MeetingContent roomId={roomId} />
    </HMSRoomProvider>
  );
}

function MeetingContent({ roomId }: { roomId: string }) {
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const peers = useHMSStore(selectPeers);
  const isAudioOn = useHMSStore(selectIsLocalAudioEnabled);
  const isVideoOn = useHMSStore(selectIsLocalVideoEnabled);

  const router = useRouter();
  const session = useSession();
  const user = session.user;

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔒 Join kontrolü için ref
  const hasJoinedRef = useRef(false);

  const role = user.rolemedical === "DOCTOR" ? "host" : "guest";

  const username =
    user.rolemedical === "DOCTOR"
      ? `Dr. ${user.username.split(" ")[0]}`
      : user.username?.split(" ")[0] || "Guest";

  // =========================
  // TOKEN FETCH
  // =========================
  useEffect(() => {
    if (!roomId) return;

    async function fetchToken() {
      setLoading(true);
      try {
        const res = await generateAuthToken(roomId, role);
        if (res.token) {
          setToken(res.token);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchToken();
  }, [roomId, role]);

  // =========================
  // JOIN (SADECE 1 KEZ)
  // =========================
  useEffect(() => {
    if (!token || hasJoinedRef.current) return;

    hasJoinedRef.current = true;

    hmsActions.join({
      authToken: token,
      userName: username,
    });
  }, [token]);

  // =========================
  // CLEANUP (UNMOUNT)
  // =========================
  useEffect(() => {
    return () => {
      hmsActions.leave();
      hasJoinedRef.current = false;
    };
  }, []);

  // =========================
  // LOADING SCREEN
  // =========================
  if (!isConnected) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 to-blue-900 text-white">
        <div className="text-center space-y-4 animate-pulse">
          <h1 className="text-3xl font-bold">Connecting...</h1>
          <p className="opacity-80">
            {loading ? "Generating secure token..." : "Joining room..."}
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-800">
        <div>
          <h2 className="text-lg font-semibold">Room: {roomId}</h2>
          <p className="text-xs text-gray-400">
            {username} • {role}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {peers.length} participant(s)
        </div>
      </div>

      {/* VIDEO GRID */}
      <div
        className="flex-1 p-6 grid gap-6 auto-rows-fr
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4"
      >
        {peers.map((peer) => (
          <div
            key={peer.id}
            className={`relative bg-black rounded-3xl overflow-hidden border transition-all duration-300 ${
              peer.isLocal
                ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                : "border-gray-800"
            }`}
          >
            {peer.videoTrack ? (
              <video
                className="w-full h-full object-cover"
                ref={(ref) => {
                  if (ref) {
                    hmsActions.attachVideo(peer.videoTrack, ref);
                  }
                }}
                autoPlay
                muted={peer.isLocal}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-900">
                <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold">
                  {peer.name?.charAt(0)}
                </div>
              </div>
            )}

            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-sm">
              {peer.name}
            </div>
          </div>
        ))}
      </div>

      {/* CONTROLS */}
      <div className="bg-gray-900 border-t border-gray-800 py-5 flex justify-center items-center gap-6">
        {/* MIC */}
        <button
          onClick={() => hmsActions.setLocalAudioEnabled(!isAudioOn)}
          className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-200 ${
            isAudioOn
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isAudioOn ? <Mic size={22} /> : <MicOff size={22} />}
        </button>

        {/* CAMERA */}
        <button
          onClick={() => hmsActions.setLocalVideoEnabled(!isVideoOn)}
          className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-200 ${
            isVideoOn
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isVideoOn ? <Video size={22} /> : <VideoOff size={22} />}
        </button>

        {/* LEAVE */}
        <button
          onClick={async () => {
            try {
              await hmsActions.leave();
            } finally {
              hasJoinedRef.current = false;
              router.replace("/medical/dashboard");
            }
          }}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-red-700 hover:bg-red-800 transition-all duration-200"
        >
          <PhoneOff size={26} />
        </button>
      </div>
    </div>
  );
}
