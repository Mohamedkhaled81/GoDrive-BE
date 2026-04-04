// roomId is userId < client: who needs support.. >
export default (io, socket) => {

  socket.on("makeRoom", (userId, ack) => {
    try {
      const admins = io.sockets.adapter.rooms.get("roomAdmin");

      if (!admins || admins.size === 0) {
        const error = "Can't Respond to Customer Support Right Now";

        socket.emit("error", { message: error });

        return ack?.({
          success: false,
          message: error
        });
      }

      socket.join(userId);
      io.to("roomAdmin").emit("newRoom", { userId });

      ack?.({
        success: true,
        roomId: userId
      });

    } catch (err) {
      ack?.({ success: false, message: err.message });
    }
  });

  socket.on("leave", ({ userName, roomId }, ack) => {
    try {
      socket.leave(roomId);

      io.to(roomId).emit("userLeft", `${userName} Left the chat!`);

      ack?.({ success: true });

    } catch (err) {
      ack?.({ success: false, message: err.message });
    }
  });

};