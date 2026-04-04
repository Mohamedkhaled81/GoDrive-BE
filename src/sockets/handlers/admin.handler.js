export default (io, socket) => {

  socket.on("loginAsAdmin", (data, ack) => {
    try {
      socket.join("roomAdmin");

      ack?.({
        success: true,
        message: "Joined admin room"
      });
    } catch (err) {
      ack?.({
        success: false,
        message: err.message
      });
    }
  });

  socket.on("adminJoined", ({ adminId, roomId }, ack) => {
    try {
      socket.join(roomId);

      io.to(roomId).emit("welcomeMsg", {
        message: `Admin Joined ${adminId.slice(0, 5)}`,
        timestamp: new Date().toISOString()
      });

      ack?.({ success: true });

    } catch (err) {
      ack?.({ success: false, message: err.message });
    }
  });

};