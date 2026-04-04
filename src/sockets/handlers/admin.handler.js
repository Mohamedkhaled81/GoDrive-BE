export default (io, socket) => {

  socket.on("loginAsAdmin", () => {
    socket.join("roomAdmin");
  });

  socket.on("adminJoined", ({ adminId, roomId }) => {
    socket.join(roomId);

    io.to(roomId).emit("welcomeMsg", {
      message: `Admin Joined ${adminId.slice(0, 5)}`,
      timestamp: new Date().toISOString()
    });
  });

};