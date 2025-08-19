import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import serverless from "serverless-http";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// helper
const getSocketIdByUserId = async (userId) => {
  const row = await prisma.onlineUser.findUnique({ where: { userId } });
  return row?.socketId || null;
};

// Socket.IO bağlantıları
io.on("connection", (socket) => {
  console.log("🔌 Kullanıcı bağlandı:", socket.id);

  // Online user ekleme
  socket.on("add-user", async (userId) => {
    await prisma.onlineUser.upsert({
      where: { userId },
      update: { socketId: socket.id, connectedAt: new Date() },
      create: { userId, socketId: socket.id },
    });
  });

  // Mesaj gönderme
  socket.on("send-message", async (data) => {
    const receiverSocketId = await getSocketIdByUserId(data.to);
    if (!receiverSocketId) return;
    io.to(receiverSocketId).emit("receive-message", {
      from: data.from,
      to: data.to,
      message: data.message,
      createdAt: new Date().toISOString(),
    });
  });

  // Arama olayları (Video/Voice Calls)
  socket.on("outgoing-voice-call", async (callData) => {
    console.log("Voice call event:", callData);
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

  socket.on("outgoing-video-call", async (callData) => {
    console.log("Video call event:", callData);
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

  // Arama kabul etme
  socket.on("accept-incoming-call", async (data) => {
    const callerSocketId = await getSocketIdByUserId(data.from);
    if (callerSocketId) io.to(callerSocketId).emit("accept-call", data);
  });

  // Arama reddetme
  socket.on("reject-video-call", async (data) => {
    const callerSocketId = await getSocketIdByUserId(data.from);
    if (callerSocketId) io.to(callerSocketId).emit("video-call-rejected", data);
  });

  // Bağlantı kesildiğinde
  socket.on("disconnect", async () => {
    await prisma.onlineUser.deleteMany({ where: { socketId: socket.id } });
  });
});

// Serverless kullanarak Express API'si
app.get("/api", (req, res) => {
  res.json({ message: "API is working" });
});

export const handler = serverless(app);
