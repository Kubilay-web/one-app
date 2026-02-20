// "use client";

// import { useSession } from "@/app/SessionProvider";
// import {
//   HMSRoomProvider,
//   selectIsConnectedToRoom,
//   selectPeers,
//   selectIsLocalAudioEnabled,
//   selectIsLocalVideoEnabled,
//   useHMSActions,
//   useHMSStore,
// } from "@100mslive/react-sdk";
// import React, { useEffect, useState, useRef } from "react";
// import { generateAuthToken } from "../../actions/hms";
// import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
// import { useRouter } from "next/navigation";

// interface MeetingPageProps {
//   roomId: string;
// }

// export default function MeetingPage({ roomId }: MeetingPageProps) {
//   return (
//     <HMSRoomProvider>
//       <MeetingContent roomId={roomId} />
//     </HMSRoomProvider>
//   );
// }

// function MeetingContent({ roomId }: { roomId: string }) {
//   const hmsActions = useHMSActions();
//   const isConnected = useHMSStore(selectIsConnectedToRoom);
//   const peers = useHMSStore(selectPeers);
//   const isAudioOn = useHMSStore(selectIsLocalAudioEnabled);
//   const isVideoOn = useHMSStore(selectIsLocalVideoEnabled);

//   const router = useRouter();
//   const session = useSession();
//   const user = session.user;

//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   // 🔒 Join kontrolü için ref
//   const hasJoinedRef = useRef(false);

//   const role = user.rolemedical === "DOCTOR" ? "host" : "guest";

//   const username =
//     user.rolemedical === "DOCTOR"
//       ? `Dr. ${user.username.split(" ")[0]}`
//       : user.username?.split(" ")[0] || "Guest";

//   // =========================
//   // TOKEN FETCH
//   // =========================
//   useEffect(() => {
//     if (!roomId) return;

//     async function fetchToken() {
//       setLoading(true);
//       try {
//         const res = await generateAuthToken(roomId, role);
//         if (res.token) {
//           setToken(res.token);
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchToken();
//   }, [roomId, role]);

//   // =========================
//   // JOIN (SADECE 1 KEZ)
//   // =========================
//   useEffect(() => {
//     if (!token || hasJoinedRef.current) return;

//     hasJoinedRef.current = true;

//     hmsActions.join({
//       authToken: token,
//       userName: username,
//     });
//   }, [token]);

//   // =========================
//   // CLEANUP (UNMOUNT)
//   // =========================
//   useEffect(() => {
//     return () => {
//       hmsActions.leave();
//       hasJoinedRef.current = false;
//     };
//   }, []);

//   // =========================
//   // LOADING SCREEN
//   // =========================
//   if (!isConnected) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 to-blue-900 text-white">
//         <div className="text-center space-y-4 animate-pulse">
//           <h1 className="text-3xl font-bold">Connecting...</h1>
//           <p className="opacity-80">
//             {loading ? "Generating secure token..." : "Joining room..."}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // =========================
//   // UI
//   // =========================
//   return (
//     <div className="h-screen flex flex-col bg-gray-950 text-white">
//       {/* HEADER */}
//       <div className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-800">
//         <div>
//           <h2 className="text-lg font-semibold">Room: {roomId}</h2>
//           <p className="text-xs text-gray-400">
//             {username} • {role}
//           </p>
//         </div>
//         <div className="text-sm text-gray-500">
//           {peers.length} participant(s)
//         </div>
//       </div>

//       {/* VIDEO GRID */}
//       <div
//         className="flex-1 p-6 grid gap-6 auto-rows-fr
//         grid-cols-1
//         sm:grid-cols-2
//         lg:grid-cols-3
//         xl:grid-cols-4"
//       >
//         {peers.map((peer) => (
//           <div
//             key={peer.id}
//             className={`relative bg-black rounded-3xl overflow-hidden border transition-all duration-300 ${
//               peer.isLocal
//                 ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
//                 : "border-gray-800"
//             }`}
//           >
//             {peer.videoTrack ? (
//               <video
//                 className="w-full h-full object-cover"
//                 ref={(ref) => {
//                   if (ref) {
//                     hmsActions.attachVideo(peer.videoTrack, ref);
//                   }
//                 }}
//                 autoPlay
//                 muted={peer.isLocal}
//               />
//             ) : (
//               <div className="flex items-center justify-center h-full bg-gray-900">
//                 <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold">
//                   {peer.name?.charAt(0)}
//                 </div>
//               </div>
//             )}

//             <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-sm">
//               {peer.name}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* CONTROLS */}
//       <div className="bg-gray-900 border-t border-gray-800 py-5 flex justify-center items-center gap-6">
//         {/* MIC */}
//         <button
//           onClick={() => hmsActions.setLocalAudioEnabled(!isAudioOn)}
//           className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-200 ${
//             isAudioOn
//               ? "bg-gray-800 hover:bg-gray-700"
//               : "bg-red-600 hover:bg-red-700"
//           }`}
//         >
//           {isAudioOn ? <Mic size={22} /> : <MicOff size={22} />}
//         </button>

//         {/* CAMERA */}
//         <button
//           onClick={() => hmsActions.setLocalVideoEnabled(!isVideoOn)}
//           className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-200 ${
//             isVideoOn
//               ? "bg-gray-800 hover:bg-gray-700"
//               : "bg-red-600 hover:bg-red-700"
//           }`}
//         >
//           {isVideoOn ? <Video size={22} /> : <VideoOff size={22} />}
//         </button>

//         {/* LEAVE */}
//         <button
//           onClick={async () => {
//             try {
//               await hmsActions.leave();
//             } finally {
//               hasJoinedRef.current = false;
//               router.replace("/medical/dashboard");
//             }
//           }}
//           className="w-16 h-16 flex items-center justify-center rounded-full bg-red-700 hover:bg-red-800 transition-all duration-200"
//         >
//           <PhoneOff size={26} />
//         </button>
//       </div>
//     </div>
//   );
// }




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
  const { user } = useSession();

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasJoinedRef = useRef(false);

  const role = user.rolemedical === "DOCTOR" ? "host" : "guest";

  const username =
    user.rolemedical === "DOCTOR"
      ? `Dr. ${user.username.split(" ")[0]}`
      : user.username?.split(" ")[0] || "Guest";

  // TOKEN FETCH
  useEffect(() => {
    if (!roomId) return;

    let mounted = true;

    async function fetchToken() {
      setLoading(true);
      try {
        const res = await generateAuthToken(roomId, role);
        if (mounted && res.token) setToken(res.token);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchToken();
    return () => {
      mounted = false;
    };
  }, [roomId, role]);

  // JOIN
  useEffect(() => {
    if (!token || hasJoinedRef.current || isConnected) return;

    hasJoinedRef.current = true;

    hmsActions.join({
      authToken: token,
      userName: username,
    });
  }, [token, username, isConnected, hmsActions]);

  // CLEANUP
  useEffect(() => {
    return () => {
      if (isConnected) hmsActions.leave();
      hasJoinedRef.current = false;
    };
  }, [isConnected, hmsActions]);

  // LOADING
  if (!token || !isConnected) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-wide">
              {loading ? "Generating Secure Token..." : "Connecting to Room..."}
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Please wait while we prepare your session
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-black via-slate-950 to-black text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div>
          <h1 className="text-lg font-semibold tracking-wide">
            Consultation Room
          </h1>
          <p className="text-xs text-gray-400">
            {username} • {role} • {roomId}
          </p>
        </div>
        <div className="text-sm text-gray-400">
          {peers.length} participant{peers.length > 1 && "s"}
        </div>
      </header>

      {/* VIDEO AREA */}
      <main className="flex-1 flex flex-wrap justify-center items-center gap-8 p-6 overflow-auto">
        {peers.map((peer) => (
          <VideoTile key={peer.id} peer={peer} />
        ))}
      </main>

      {/* CONTROLS */}
      <footer className="flex justify-center items-center gap-6 py-6 backdrop-blur-xl bg-white/5 border-t border-white/10">
        <ControlButton
          active={isAudioOn}
          onClick={() => hmsActions.setLocalAudioEnabled(!isAudioOn)}
          iconOn={<Mic size={20} />}
          iconOff={<MicOff size={20} />}
        />

        <ControlButton
          active={isVideoOn}
          onClick={() => hmsActions.setLocalVideoEnabled(!isVideoOn)}
          iconOn={<Video size={20} />}
          iconOff={<VideoOff size={20} />}
        />

        <button
          onClick={async () => {
            if (isConnected) await hmsActions.leave();
            router.replace("/medical/dashboard");
          }}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300 flex items-center justify-center shadow-xl shadow-red-900/40"
        >
          <PhoneOff size={26} />
        </button>
      </footer>
    </div>
  );
}

function VideoTile({ peer }: any) {
  const hmsActions = useHMSActions();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && peer.videoTrack) {
      hmsActions.attachVideo(peer.videoTrack, videoRef.current);
    }

    return () => {
      if (videoRef.current && peer.videoTrack) {
        hmsActions.detachVideo(peer.videoTrack, videoRef.current);
      }
    };
  }, [peer.videoTrack, hmsActions]);

  return (
    <div
      className={`relative flex items-center justify-center
      bg-slate-900/60 backdrop-blur-lg
      rounded-3xl overflow-hidden
      w-[320px] sm:w-[400px] md:w-[460px]
      aspect-video
      border transition-all duration-300
      ${
        peer.isLocal
          ? "border-indigo-500 shadow-2xl shadow-indigo-900/40 scale-105"
          : "border-white/10"
      }`}
    >
      {peer.videoTrack ? (
        <video
          ref={videoRef}
          autoPlay
          muted={peer.isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold">
            {peer.name?.charAt(0)}
          </div>
          <span className="text-sm text-gray-400">Camera Off</span>
        </div>
      )}

      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-4 py-1 rounded-full text-sm">
        {peer.name}
      </div>
    </div>
  );
}

function ControlButton({ active, onClick, iconOn, iconOff }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-14 h-14 rounded-full flex items-center justify-center
      transition-all duration-300 shadow-lg
      ${
        active
          ? "bg-white/10 hover:bg-white/20"
          : "bg-red-600 hover:bg-red-700 shadow-red-900/40"
      }`}
    >
      {active ? iconOn : iconOff}
    </button>
  );
}