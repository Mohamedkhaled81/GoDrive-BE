export default (io, socket) => {

  socket.on("sendMsg", ({ roomId, message }) => {
    const data = {
      message,
      timestamp: new Date().toISOString()
    };

    io.to(roomId).emit("newMsg", { roomId, data });
  });

};