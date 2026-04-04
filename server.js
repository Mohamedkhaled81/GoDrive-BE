import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import { connectDb } from "./src/config/dbConfig.js";
import rootRouter from "./src/routes/index.js";
import { fileURLToPath } from "url";
import globalErrorHandler from "./src/middlewares/globalError.js";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Adding Cors for the Client-side Project...
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
connectDb();

app.set("port", process.env.PORT || 5050);
app.set("socketIo", io);

const PORT = app.get("port");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routers
app.use("/", rootRouter);

// Global Custom-ErrorHandler
app.use(globalErrorHandler);

// Once The MongoDb is On We start the server..
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDb :D");
  httpServer.listen(PORT, () => {
    const servStatus = `Server Started at http://localhost:${PORT}/ :D`;
    console.log(servStatus);
  });

  // io is our Socket.Io Server...
  io.on("connection", (socket) => {
    socket.on("registerAsAdmin", () => {
      socket.join("roomAdmin");
    });

    socket.on("makeRoom", (userId) => {
      const roomAdminExisted = io.sockets.adapter.rooms.has("roomAdmin");
      if (!roomAdminExisted) {
        socket.emit("error", {
          message: "Can't Respond to Customer Support Right Now",
        });
        return;
      }
      socket.join(userId);
      io.to("roomAdmin").emit("newRoom", { userId });
    });

    socket.on("adminJoined", (obj) => {
      const { adminId, roomId } = obj;
      socket.join(roomId);
      io.to(roomId).emit("welcomeMsg", {
          message: `Admin Joined ${adminId.slice(0, 5)}`,
          timestamp: new Date().toISOString()
      });
    });

    socket.on("sendMsg", (obj) => {
      const { roomId, message } = obj;
      const data = { message, timestamp: new Date().toISOString() };
      io.to(roomId).emit("newMsg", { roomId, data });
    });

    socket.on("leave", ({ userId, roomId }) => {
      socket.leave(roomId);
      io.to(roomId).emit("userLeft", { userId });
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
});
