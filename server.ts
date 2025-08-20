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
const getSocketIdByUserId = async (userId: string | undefined | null) => {
  if (!userId) {
    console.warn("getSocketIdByUserId çağrıldı fakat userId boş:", userId);
    return null;
  }
  const row = await prisma.onlineUser.findUnique({ where: { userId } });
  return row?.socketId || null;
};

io.on("connection", (socket) => {
  console.log("🔌 Kullanıcı bağlandı:", socket.id);

  // Online user ekleme
  socket.on("add-user", async (userId: string) => {
    if (!userId) {
      console.warn("add-user event'i boş userId ile çağrıldı.");
      return;
    }
    try {
      await prisma.onlineUser.upsert({
        where: { userId },
        update: { socketId: socket.id, connectedAt: new Date() },
        create: { userId, socketId: socket.id, connectedAt: new Date() },
      });
    } catch (e) {
      console.error("add-user hatası:", e);
    }
  });

  // Mesaj gönderme
  socket.on(
    "send-message",
    async (data: { from: string; to: string; message: string }) => {
      if (!data.to) {
        console.warn("send-message: alıcı belirtilmemiş.");
        return;
      }
      try {
        const receiverSocketId = await getSocketIdByUserId(data.to);
        if (!receiverSocketId) {
          console.warn("send-message: alıcının socketId'si bulunamadı", data.to);
          return;
        }
        io.to(receiverSocketId).emit("receive-message", {
          from: data.from,
          to: data.to,
          message: data.message,
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.error("send-message hatası:", e);
      }
    }
  );

  // Çağrılar

  socket.on("outgoing-voice-call", async (callData) => {
    try {
      if (!callData?.to || !callData?.from?.id) {
        console.warn("outgoing-voice-call: Eksik çağrı verisi", callData);
        return;
      }
      const receiverSocketId = await getSocketIdByUserId(callData.to);
      if (!receiverSocketId) {
        console.warn("outgoing-voice-call: Alıcı socketId bulunamadı", callData.to);
        return;
      }
      const caller = await prisma.user.findUnique({ where: { id: callData.from.id } });
      const enrichedCallData = {
        roomId: callData.roomId,
        callType: "voice",
        senderId: callData.from.id,
        displayName: caller?.displayName || caller?.username || "Unknown",
        avatarUrl: caller?.avatarUrl || "/default-avatar.png",
      };
      io.to(receiverSocketId).emit("incoming-voice-call", enrichedCallData);
    } catch (e) {
      console.error("outgoing-voice-call hatası:", e);
    }
  });

  socket.on("outgoing-video-call", async (callData) => {
    try {
      if (!callData?.to || !callData?.from?.id) {
        console.warn("outgoing-video-call: Eksik çağrı verisi", callData);
        return;
      }
      const receiverSocketId = await getSocketIdByUserId(callData.to);
      if (!receiverSocketId) {
        console.warn("outgoing-video-call: Alıcı socketId bulunamadı", callData.to);
        return;
      }
      const caller = await prisma.user.findUnique({ where: { id: callData.from.id } });
      const enrichedCallData = {
        roomId: callData.roomId,
        callType: "video",
        senderId: callData.from.id,
        displayName: caller?.displayName || caller?.username || "Unknown",
        avatarUrl: caller?.avatarUrl || "/default-avatar.png",
      };
      io.to(receiverSocketId).emit("incoming-video-call", enrichedCallData);
    } catch (e) {
      console.error("outgoing-video-call hatası:", e);
    }
  });

  // Gelen çağrıyı kabul et
  socket.on("accept-incoming-call", async (data) => {
    try {
      if (!data?.from) {
        console.warn("accept-incoming-call: 'from' bilgisi yok.");
        return;
      }
      const callerSocketId = await getSocketIdByUserId(data.from);
      if (callerSocketId) io.to(callerSocketId).emit("accept-call", data);
    } catch (e) {
      console.error("accept-incoming-call hatası:", e);
    }
  });

  // Video çağrısını reddet
  socket.on("reject-video-call", async (data) => {
    try {
      if (!data?.from) {
        console.warn("reject-video-call: 'from' bilgisi yok.");
        return;
      }
      const callerSocketId = await getSocketIdByUserId(data.from);
      if (callerSocketId) io.to(callerSocketId).emit("video-call-rejected", data);
    } catch (e) {
      console.error("reject-video-call hatası:", e);
    }
  });

  // Video çağrısını iptal et
  socket.on("cancel-video-call", async (data) => {
    try {
      if (!data?.to) {
        console.warn("cancel-video-call: 'to' bilgisi yok.");
        return;
      }
      const calleeSocketId = await getSocketIdByUserId(data.to);
      if (calleeSocketId) io.to(calleeSocketId).emit("video-call-canceled", data);
    } catch (e) {
      console.error("cancel-video-call hatası:", e);
    }
  });

  // Sesli çağrıyı reddet
  socket.on("reject-voice-call", async (data) => {
    try {
      if (!data?.from) {
        console.warn("reject-voice-call: 'from' bilgisi yok.");
        return;
      }
      const callerSocketId = await getSocketIdByUserId(data.from);
      if (callerSocketId) io.to(callerSocketId).emit("voice-call-rejected", data);
    } catch (e) {
      console.error("reject-voice-call hatası:", e);
    }
  });

  // Aramayı sonlandır
  socket.on("end-call", async (data) => {
    try {
      if (!data?.to) {
        console.warn("end-call: 'to' bilgisi yok.");
        return;
      }
      const otherSocketId = await getSocketIdByUserId(data.to);
      if (otherSocketId) io.to(otherSocketId).emit("call-ended", data);
    } catch (e) {
      console.error("end-call hatası:", e);
    }
  });

  // Disconnect olduğunda onlineUser kaydını sil
  socket.on("disconnect", async () => {
    try {
      await prisma.onlineUser.deleteMany({ where: { socketId: socket.id } });
    } catch (e) {
      console.error("disconnect hatası:", e);
    }
  });
});

const PORT = 3001;
server.listen(PORT, () =>
  console.log(`🚀 Socket.IO Server hazır: http://localhost:${PORT}`)
);
