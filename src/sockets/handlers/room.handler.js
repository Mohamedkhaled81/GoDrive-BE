export default (io, socket) => {

  socket.on("makeRoom", (userId) => {
    const admins = io.sockets.adapter.rooms.get("roomAdmin");

    if (!admins || admins.size === 0) {
      socket.emit("noAdminSupport", {
        message: "Can't Respond to Customer Support Right Now",
      });
      return;
    }

    socket.join(userId);
    io.to("roomAdmin").emit("newRoom", { userId });
  });

  socket.on("leave", ({ userId, roomId }) => {
    socket.leave(roomId);
    io.to(roomId).emit("userLeft", { userId });
  });

};