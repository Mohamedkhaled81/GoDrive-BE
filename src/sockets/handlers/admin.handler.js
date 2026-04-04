import { userRole } from "../../constants/roleEnum.js";

export default (io, socket) => {
  socket.on("loginAsAdmin", (data, ack) => {
    try {
      if(socket.user.role !== userRole.ADMIN) {
        throw new Error("Unauthorized");
      }
      socket.join("roomAdmin");
      
      ack?.({
        success: true,
        message: "Joined admin room",
      });
    } catch (err) {
      ack?.({
        success: false,
        message: err.message,
      });
    }
  });

  socket.on("adminJoined", ({ roomId }, ack) => {
    try {
      if(socket.user.role !== userRole.ADMIN) {
        throw new Error("Unauthorized");
      }
      socket.join(roomId);

      io.to(roomId).emit("welcomeMsg", {
        message: `Admin Joined`,
        timestamp: new Date().toISOString(),
      });

      ack?.({ success: true });
    } catch (err) {
      ack?.({ success: false, message: err.message });
    }
  });
};
