import { userRole } from "../../constants/roleEnum.js";

// roomId is userId < client: who needs support.. >
export default (io, socket) => {

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
        const {roomId} = data; 
        socket.leave(roomId);

        io.to(roomId).emit("userLeft", `${socket.user.role} Left the chat!`);

        ack?.({ success: true });

    } catch (err) {
      ack?.({ success: false, message: err.message });
    }
  });

};