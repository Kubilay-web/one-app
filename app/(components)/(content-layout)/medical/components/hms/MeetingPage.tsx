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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* HEADER - Modern glassmorphism */}
      <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left section - Room info */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-xs sm:text-sm font-medium text-emerald-400">
                Live
              </span>
            </div>

            <div className="hidden xs:block h-4 w-px bg-white/10"></div>

            <div>
              <h2 className="text-xs sm:text-sm lg:text-base font-medium text-white/90 flex items-center gap-2">
                <span className="hidden sm:inline">Meeting Room</span>
                <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full text-xs">
                  {roomId.slice(0, 6)}...
                </span>
              </h2>
              <p className="text-[10px] sm:text-xs text-white/40 flex flex-wrap items-center gap-1">
                <span className="font-medium text-white/60">{username}</span>
                <span>•</span>
                <span className="capitalize px-1.5 py-0.5 bg-white/5 rounded-full">
                  {role}
                </span>
              </p>
            </div>
          </div>

          {/* Right section - Participants */}
          <div className="flex items-center space-x-2 bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-white/10">
            <div className="flex -space-x-2">
              {[...Array(Math.min(peers.length, 3))].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-slate-800 flex items-center justify-center text-[10px] sm:text-xs font-bold"
                >
                  {peers[i]?.name?.charAt(0) || "U"}
                </div>
              ))}
            </div>
            <span className="text-xs sm:text-sm font-medium text-white/80">
              {peers.length}
            </span>
            <span className="hidden sm:inline text-xs text-white/40">
              participant{peers.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* VIDEO GRID - Dynamic and responsive */}
      <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-auto">
        <div
          className="grid gap-3 sm:gap-4 md:gap-5 lg:gap-6 auto-rows-fr
      grid-cols-1
      xs:grid-cols-2
      lg:grid-cols-3
      2xl:grid-cols-4"
        >
          {peers.map((peer, index) => (
            <div
              key={peer.id}
              className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:z-10 ${
                peer.isLocal
                  ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 shadow-xl shadow-indigo-500/30"
                  : "ring-1 ring-white/10 hover:ring-white/20"
              }`}
              style={{
                aspectRatio: "16/9",
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Video or Avatar */}
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
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold shadow-2xl">
                      {peer.name?.charAt(0).toUpperCase()}
                    </div>
                    {!peer.isLocal && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-800"></div>
                    )}
                  </div>
                </div>
              )}

              {/* Gradient overlay for better text visibility */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              {/* Participant badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center space-x-2 backdrop-blur-md bg-black/40 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10">
                  <span className="text-xs sm:text-sm font-medium truncate max-w-[80px] sm:max-w-[120px]">
                    {peer.name}
                  </span>
                  {peer.isLocal && (
                    <span className="text-[10px] sm:text-xs text-indigo-400 bg-indigo-500/20 px-1.5 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </div>

                {/* Audio indicator */}
                {peer.isLocal ? (
                  <div
                    className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md border border-white/10 ${
                      isAudioOn ? "bg-emerald-500/80" : "bg-red-500/80"
                    }`}
                  >
                    {isAudioOn ? (
                      <Mic size={14} className="sm:w-4 sm:h-4" />
                    ) : (
                      <MicOff size={14} className="sm:w-4 sm:h-4" />
                    )}
                  </div>
                ) : (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full backdrop-blur-md bg-black/40 border border-white/10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>

              {/* Speaking indicator */}
              {!peer.isLocal && Math.random() > 0.7 && (
                <div className="absolute top-3 left-3 backdrop-blur-md bg-indigo-500/80 px-2 sm:px-3 py-1 rounded-full border border-indigo-400/30 animate-pulse">
                  <span className="text-[10px] sm:text-xs font-medium">
                    🔊 Speaking
                  </span>
                </div>
              )}

              {/* Video off indicator overlay */}
              {!peer.videoTrack && (
                <div className="absolute top-3 right-3 backdrop-blur-md bg-red-500/80 px-2 sm:px-3 py-1 rounded-full border border-red-400/30">
                  <span className="text-[10px] sm:text-xs font-medium">
                    🎥 Off
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CONTROLS - Sleek floating bottom bar */}
      <div className="sticky bottom-0 backdrop-blur-xl bg-black/50 border-t border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 sm:py-5 md:py-6">
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
            {/* MIC CONTROL */}
            <button
              onClick={() => hmsActions.setLocalAudioEnabled(!isAudioOn)}
              className={`group relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                isAudioOn
                  ? "bg-white/10 hover:bg-white/15 border border-white/20"
                  : "bg-red-500/80 hover:bg-red-500 border border-red-400/50"
              }`}
            >
              {isAudioOn ? (
                <Mic
                  size={20}
                  className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
                />
              ) : (
                <MicOff
                  size={20}
                  className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
                />
              )}

              {/* Tooltip */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
                {isAudioOn ? "Mute microphone" : "Unmute microphone"}
              </span>
            </button>

            {/* CAMERA CONTROL */}
            <button
              onClick={() => hmsActions.setLocalVideoEnabled(!isVideoOn)}
              className={`group relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                isVideoOn
                  ? "bg-white/10 hover:bg-white/15 border border-white/20"
                  : "bg-red-500/80 hover:bg-red-500 border border-red-400/50"
              }`}
            >
              {isVideoOn ? (
                <Video
                  size={20}
                  className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
                />
              ) : (
                <VideoOff
                  size={20}
                  className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
                />
              )}

              <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
                {isVideoOn ? "Stop camera" : "Start camera"}
              </span>
            </button>

            {/* LEAVE CALL - Prominent */}
            <button
              onClick={async () => {
                try {
                  await hmsActions.leave();
                } finally {
                  hasJoinedRef.current = false;
                  router.replace("/medical/dashboard");
                }
              }}
              className="group relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all duration-300 hover:scale-110 hover:rotate-6 active:scale-95 shadow-lg shadow-red-500/30"
            >
              <PhoneOff
                size={22}
                className="sm:w-6 sm:h-6 md:w-7 md:h-7 text-white"
              />

              <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-600 text-white text-xs py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Leave call
              </span>
            </button>
          </div>

          {/* Small helper text for mobile */}
          <p className="text-center text-[10px] sm:text-xs text-white/30 mt-3 sm:hidden">
            Tap to control your devices
          </p>
        </div>
      </div>


    </div>
  );
}
