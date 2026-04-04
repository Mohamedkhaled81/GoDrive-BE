export default (io, socket) => {

  socket.on("sendMsg", ({ roomId, message }, ack) => {
    try {
      const data = {
        message,
        timestamp: new Date().toISOString()
      };

      io.to(roomId).emit("newMsg", { roomId, data });

      ack?.({
        success: true,
        data
      });

    } catch (err) {
      ack?.({
        success: false,
        message: err.message
      });
    }
  });

};