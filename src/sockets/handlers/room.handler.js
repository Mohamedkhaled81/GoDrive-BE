export default (io, socket) => {

  // roomId is userId < client: who needs support.. >
  socket.on("makeRoom", (roomId) => {
    const admins = io.sockets.adapter.rooms.get("roomAdmin");

    if (!admins || admins.size === 0) {
      socket.emit("noAdminSupport", {
        message: "Can't Respond to Customer Support Right Now",
      });
      return;
    }

    socket.join(roomId);
    io.to("roomAdmin").emit("newRoom", { roomId });
  });

  socket.on("leave", ({ userName, roomId }) => {
    socket.leave(roomId);
    io.to(roomId).emit("userLeft", `${userName} has left the chat!`);
  });

};