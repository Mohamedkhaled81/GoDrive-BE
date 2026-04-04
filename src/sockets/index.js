/* export default (io) => {
    io.on("connection", (socket) => {
    socket.on("loginAsAdmin", () => {
      socket.join("roomAdmin");
    });

    socket.on("makeRoom", (userId) => {
      const roomAdminExisted = io.sockets.adapter.rooms.has("roomAdmin");
      if (!roomAdminExisted) {
        socket.emit("error", {
          message: "Can't Respond to Customer Support Right Now",
        });
        return;
      }
      socket.join(userId);
      io.to("roomAdmin").emit("newRoom", { userId });
    });

    socket.on("adminJoined", (obj) => {
      const { adminId, roomId } = obj;
      socket.join(roomId);
      io.to(roomId).emit("welcomeMsg", {
          message: `Admin Joined ${adminId.slice(0, 5)}`,
          timestamp: new Date().toISOString()
      });
    });

    socket.on("sendMsg", (obj) => {
      const { roomId, message } = obj;
      const data = { message, timestamp: new Date().toISOString() };
      io.to(roomId).emit("newMsg", { roomId, data });
    });

    socket.on("leave", ({ userId, roomId }) => {
      socket.leave(roomId);
      io.to(roomId).emit("userLeft", { userId });
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
} */

import adminHandler from "./handlers/admin.handler.js";
import roomHandler from "./handlers/room.handler.js";
import chatHandler from "./handlers/chat.handler.js";

export default (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // attach handlers
    adminHandler(io, socket);
    roomHandler(io, socket);
    chatHandler(io, socket);

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
};