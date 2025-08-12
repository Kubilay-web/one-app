import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Kullanıcıyı online olarak işaretle
    socket.on("user-online", async (userId) => {
      socket.join(userId);
      console.log(`User ${userId} is online`);
      
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { status: "ONLINE" }
        });
        
        io.emit("user-status-changed", { userId, status: "ONLINE" });
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    });

    // Mesaj gönderme
    socket.on("send-message", async ({ senderId, recipientId, content }) => {
      try {
        const message = await prisma.message.create({
          data: {
            content,
            senderId,
            recipientId,
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            },
            recipient: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            }
          }
        });

        io.to(recipientId).emit("receive-message", message);
        io.to(senderId).emit("message-sent", message);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Arama başlatma
    socket.on("call-user", ({ offer, to, from }) => {
      io.to(to).emit("call-made", { offer, from });
    });

    // Arama cevabı
    socket.on("make-answer", ({ answer, to }) => {
      io.to(to).emit("answer-made", { answer });
    });

    // ICE candidate exchange
    socket.on("ice-candidate", ({ candidate, to }) => {
      io.to(to).emit("ice-candidate", { candidate });
    });

    // Kullanıcı bağlantısı kesildiğinde
    socket.on("disconnect", async () => {
      console.log("A user disconnected:", socket.id);
      
      try {
        // Burada kullanıcının offline olduğunu işaretlemek için ek mantık eklenebilir
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });
  });

  console.log("Socket server started");
  res.end();
}