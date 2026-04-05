import { userRole } from "../../constants/roleEnum.js";
import { sendMessageSchema } from "../schemas/messageSchema.js";

export default (io, socket) => {
  socket.on("sendMsg", (payload, ack) => {
    try {
      // Validate payload
      const result = sendMessageSchema.safeParse(payload);

      if (!result.success) {
        const errors = result.error.issues.map(e => e.message).join(", ");
        throw new Error(errors);
      }

      // Role check
      const allowedRoles = [userRole.ADMIN, userRole.CUSTOMER];
      
      if (!allowedRoles.includes(socket.user.role)) {
        throw new Error("Unauthorized");
      }
      
      // retrieve valid data..
      const { roomId, message } = result.data;
      
      // Check room existence
      const room = io.sockets.adapter.rooms.get(roomId);

      if (!room) {
        throw new Error("Room does not exist");
      }

      // Message Formate
      const validData = {
        senderId: socket.user.userId,
        message,
        timestamp: new Date().toISOString(),
      };

      // Emit to room
      io.to(roomId).emit("newMsg", { data: validData });

      // Acknowledge success
      ack?.({
        success: true,
      });

    } catch (err) {
      ack?.({
        success: false,
        message: err.message || "Something went wrong",
      });
    }
  });
};