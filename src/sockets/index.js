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