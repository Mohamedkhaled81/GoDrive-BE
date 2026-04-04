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

  socket.on("adminJoined", ({ adminName, roomId }, ack) => {
    try {
      socket.join(roomId);

      io.to(roomId).emit("welcomeMsg", {
        message: `Admin Joined ${adminName}`,
        timestamp: new Date().toISOString()
      });

      ack?.({ success: true });

    } catch (err) {
      ack?.({ success: false, message: err.message });
    }
  });

};