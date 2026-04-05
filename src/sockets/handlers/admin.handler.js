import { userRole } from "../../constants/roleEnum.js";
import { roomSchema } from "../schemas/roomSchema.js";

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

  // data: {roomId} refers to userId
  socket.on("adminJoined", (data, ack) => {
    try {
      const result = roomSchema.safeParse(data);

      if (!result.success) {
        throw new Error("Invalid payload");
      }

      const { roomId } = result.data;
      const roomExists = io.sockets.adapter.rooms.get(roomId);

      if(socket.user.role !== userRole.ADMIN) {
        throw new Error("Unauthorized");
      }

      if(!roomExists) {
        throw new Error("This room doesn't exist at the moment!");
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
