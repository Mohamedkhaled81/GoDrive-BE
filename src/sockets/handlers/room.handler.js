import { userRole } from "../../constants/roleEnum.js";
import { roomSchema } from "../schemas/roomSchema.js";

export default (io, socket) => {
  // roomId is userId < client: who needs support.. >
  socket.on("makeRoom", (temp, ack) => {
    try {
      const admins = io.sockets.adapter.rooms.get("roomAdmin");
      const roomId = socket.user.userId;

      if (!admins || admins.size === 0) {
        throw new Error("Can't Respond to Customer Support Right Now");
      }

      if(socket.user.role !== userRole.CUSTOMER) {
        throw new Error("Unauthorized");
      }

      socket.join(roomId);
      io.to("roomAdmin").emit("newRoom", { roomId });

      ack?.({
        success: true,
        roomId: roomId
      });

    } catch (err) {
      ack?.({ success: false, message: err.message });
    }
  });

  // data is {roomId}
  socket.on("leave", (data, ack) => {
    try {
        const result = roomSchema.safeParse(data);

        if (!result.success) {
          throw new Error("Invalid payload");
        }

        const { roomId } = result.data;

        // Check room exists
        const room = io.sockets.adapter.rooms.get(roomId);

        if (!room) {
          throw new Error("Room does not exist");
        }

        // Check user is in room
        if (!room.has(socket.id)) {
          throw new Error("You are not in this room");
        }

        socket.leave(roomId);

        io.to(roomId).emit("userLeft", {data: `${socket.user.role} Left the chat!`});

        ack?.({ success: true });

    } catch (err) {
      ack?.({ success: false, message: err.message });
    }
  });

};