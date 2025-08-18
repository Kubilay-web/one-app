import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// helper
const getSocketIdByUserId = async (userId: string) => {
  const row = await prisma.onlineUser.findUnique({ where: { userId } });
  return row?.socketId || null;
};

io.on("connection", (socket) => {
  console.log("🔌 Kullanıcı bağlandı:", socket.id);

  // Online user ekleme
  socket.on("add-user", async (userId: string) => {
    await prisma.onlineUser.upsert({
      where: { userId },
      update: { socketId: socket.id, connectedAt: new Date() },
      create: { userId, socketId: socket.id },
    });
  });

  // Mesaj
  socket.on(
    "send-message",
    async (data: { from: string; to: string; message: string }) => {
      const receiverSocketId = await getSocketIdByUserId(data.to);
      if (!receiverSocketId) return;
      io.to(receiverSocketId).emit("receive-message", {
        from: data.from,
        to: data.to,
        message: data.message,
        createdAt: new Date().toISOString(),
      });
    }
  );

  // ---- CALLS ----
  // Outgoing -> Incoming

  socket.on("outgoing-voice-call", async (callData) => {
    console.log("Incoming outgoing-voice-call event:", callData); // 🔹 burayı ekle
    const receiverSocketId = await getSocketIdByUserId(callData.to);
    if (!receiverSocketId) return;

    const userId = callData.from.id;
    const caller = await prisma.user.findUnique({ where: { id: userId } });

    const enrichedCallData = {
      roomId: callData.roomId,
      callType: "voice",
      senderId: userId,
      displayName: caller?.displayName || caller?.username || "Unknown",
      avatarUrl: caller?.avatarUrl || "/default-avatar.png",
    };

    io.to(receiverSocketId).emit("incoming-voice-call", enrichedCallData);
  });

  // socket event

  socket.on("outgoing-video-call", async (callData) => {
    console.log("Incoming outgoing-video-call event:", callData); // 🔹 burayı ekle
    const receiverSocketId = await getSocketIdByUserId(callData.to);
    if (!receiverSocketId) return;

    const userId = callData.from.id;
    const caller = await prisma.user.findUnique({ where: { id: userId } });

    const enrichedCallData = {
      roomId: callData.roomId,
      callType: "video",
      senderId: userId,
      displayName: caller?.displayName || caller?.username || "Unknown",
      avatarUrl: caller?.avatarUrl || "/default-avatar.png",
    };

    io.to(receiverSocketId).emit("incoming-video-call", enrichedCallData);
  });

  // Accept
  socket.on("accept-incoming-call", async (data) => {
    console.log("✅ Gelen video araması kabul edildi:", data);
    const callerSocketId = await getSocketIdByUserId(data.from);
    if (callerSocketId) io.to(callerSocketId).emit("accept-call", data);
  });

  // Reject - Video
  socket.on("reject-video-call", async (data) => {
    console.log("❌ Video araması reddedildi:", data);
    const callerSocketId = await getSocketIdByUserId(data.from);
    if (callerSocketId) io.to(callerSocketId).emit("video-call-rejected", data);
  });

  // Cancel - Video
  socket.on("cancel-video-call", async (data) => {
    console.log("🛑 Video araması iptal edildi:", data);
    const calleeSocketId = await getSocketIdByUserId(data.to);
    if (calleeSocketId) io.to(calleeSocketId).emit("video-call-canceled", data);
  });

  // Reject - Video
  socket.on("reject-voice-call", async (data) => {
    console.log("❌ Sesli arama reddedildi:", data);
    const callerSocketId = await getSocketIdByUserId(data.from);
    if (callerSocketId) io.to(callerSocketId).emit("voice-call-rejected", data);
  });

  // End
  socket.on("end-call", async (data) => {
    console.log("📞 Arama sona erdi:", data);
    const otherSocketId = await getSocketIdByUserId(data.to);
    if (otherSocketId) io.to(otherSocketId).emit("call-ended", data);
  });

  // Disconnect
  socket.on("disconnect", async () => {
    await prisma.onlineUser.deleteMany({ where: { socketId: socket.id } });
  });
});

const PORT = 3001;
server.listen(PORT, () =>
  console.log(`🚀 Socket.IO Server hazır: http://localhost:${PORT}`)
);
